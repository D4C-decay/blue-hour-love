import { el } from '../lib/dom'
import { prefersReducedMotion } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import {
  accelerationMagnitude,
  clamp,
  isTuned,
  shakeToProgress,
  staticAmount,
} from '../lib/signal'
import type { Section } from './hero'

const HOLD_RATE = 0.85 // progreso por segundo manteniendo pulsado

type MotionEventLike = {
  acceleration?: { x: number | null; y: number | null; z: number | null } | null
  accelerationIncludingGravity?: {
    x: number | null
    y: number | null
    z: number | null
  } | null
}

function readMotion(event: MotionEventLike) {
  return event.acceleration ?? event.accelerationIncludingGravity ?? null
}

/**
 * TV con estática que se "sintoniza" al agitar el teléfono o mantener pulsado.
 * Al completar, revela un mensaje de amor.
 */
export function initTvStatic(cfg: LoveConfig): Section {
  const root = el('section', 'tv')
  root.id = 'tv'

  const frame = el('div', 'tv__frame')
  const screen = el('div', 'tv__screen')

  const canvas = el('canvas', 'tv__canvas')
  canvas.setAttribute('aria-hidden', 'true')

  const scanlines = el('div', 'tv__scanlines')
  scanlines.setAttribute('aria-hidden', 'true')

  const glow = el('div', 'tv__glow')
  glow.setAttribute('aria-hidden', 'true')

  const message = el('p', 'tv__message', cfg.tvStatic.message)
  message.setAttribute('role', 'status')
  message.setAttribute('aria-live', 'polite')

  screen.append(canvas, scanlines, glow, message)
  frame.append(screen)

  const hint = el('p', 'tv__hint', cfg.tvStatic.hint)
  const action = el('button', 'tv__action', 'Sintonizar')
  action.type = 'button'
  action.setAttribute('aria-describedby', 'tv-hint')
  hint.id = 'tv-hint'

  root.append(frame, action, hint)

  // --- estado ---
  let progress = 0
  let holding = false
  let tuned = false
  let raf = 0
  let last = 0
  let motionArmed = false
  const reduced = prefersReducedMotion()

  const ctx = canvas.getContext('2d')

  // --- ruido reutilizable (barato): un tile pequeño que se escala ---
  const noise = document.createElement('canvas')
  noise.width = 256
  noise.height = 192
  const noiseCtx = noise.getContext('2d')

  function reseedNoise() {
    if (!noiseCtx) return
    const img = noiseCtx.createImageData(noise.width, noise.height)
    const data = img.data
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    }
    noiseCtx.putImageData(img, 0, 0)
  }
  reseedNoise()

  let noiseClock = 0

  function resize() {
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(1, Math.round(screen.clientWidth * dpr))
    const h = Math.max(1, Math.round(screen.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
  }

  function draw(amount: number, now: number) {
    if (!ctx) return
    const { width: w, height: h } = canvas
    ctx.globalAlpha = 1
    ctx.fillStyle = '#05050c'
    ctx.fillRect(0, 0, w, h)

    if (amount > 0.01) {
      // re-siembra el ruido cada ~80ms para que titile
      if (now - noiseClock > 80) {
        reseedNoise()
        noiseClock = now
      }
      ctx.globalAlpha = clamp(amount, 0, 1)
      const jx = (Math.random() - 0.5) * 12
      const jy = (Math.random() - 0.5) * 12
      ctx.drawImage(noise, jx, jy, w + 16, h + 16)

      // bandas horizontales aleatorias
      ctx.globalAlpha = clamp(amount * 0.5, 0, 1)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      for (let i = 0; i < 3; i += 1) {
        const bandY = Math.random() * h
        ctx.fillRect(0, bandY, w, Math.random() * 3)
      }
    }
    ctx.globalAlpha = 1
  }

  function loop(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
    last = now

    if (holding && !tuned) {
      progress = clamp(progress + HOLD_RATE * dt)
    }

    if (!reduced) draw(staticAmount(progress), now)
    screen.dataset.progress = progress.toFixed(3)
    screen.style.setProperty('--progress', progress.toFixed(3))

    if (!tuned && isTuned(progress)) {
      tune()
    }
    raf = requestAnimationFrame(loop)
  }

  function tune() {
    if (tuned) return
    tuned = true
    progress = 1
    root.classList.add('is-tuned')
    message.setAttribute('aria-hidden', 'false')
    action.disabled = true
    action.textContent = 'Sintonizado'
    draw(0, performance.now())
  }

  function armMotion() {
    if (motionArmed) return
    motionArmed = true
    type DeviceMotionCtor = typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    const DM = (window as unknown as { DeviceMotionEvent?: DeviceMotionCtor })
      .DeviceMotionEvent
    if (!DM) return

    const onMotion = (event: Event) => {
      const mag = accelerationMagnitude(readMotion(event as MotionEventLike))
      progress = clamp(progress + shakeToProgress(mag))
    }

    if (typeof DM.requestPermission === 'function') {
      DM.requestPermission()
        .then((state) => {
          if (state === 'granted') window.addEventListener('devicemotion', onMotion)
        })
        .catch(() => {})
    } else {
      window.addEventListener('devicemotion', onMotion)
    }
  }

  // --- interacción ---
  const startHold = (event: Event) => {
    event.preventDefault()
    if (tuned) return
    holding = true
    armMotion()
  }
  const endHold = () => {
    holding = false
  }

  action.addEventListener('pointerdown', startHold)
  window.addEventListener('pointerup', endHold)
  window.addEventListener('pointercancel', endHold)
  action.addEventListener('keydown', (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      startHold(event)
    }
    if (event.key === ' ' || event.key === 'Enter') event.preventDefault()
  })
  action.addEventListener('keyup', endHold)

  return {
    element: root,
    start: () => {
      resize()
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => resize())
        ro.observe(screen)
      } else {
        window.addEventListener('resize', resize)
      }
      message.setAttribute('aria-hidden', 'true')
      if (reduced) {
        draw(0.5, 0)
        screen.dataset.progress = '0.000'
      } else {
        raf = requestAnimationFrame(loop)
      }
    },
    destroy: () => cancelAnimationFrame(raf),
  }
}
