import { el, prefersReducedMotion } from '../lib/dom'
import { armShake } from '../lib/shake'
import { scrambleFrame } from '../lib/scramble'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

const TUNE_MS = 3600
const SHAKE_THRESHOLD = 14

/** Radio vieja: al pulsar la antena (o agitar el móvil) la estática se resuelve en el mensaje. */
export function initSecret(cfg: LoveConfig): Section {
  const root = el('section', 'secret')
  root.id = 'secret'

  const title = el('h2', 'secret__title', 'Mensaje secreto')

  const radio = el('div', 'radio')

  const antenna = el('button', 'radio__antenna')
  antenna.type = 'button'
  antenna.setAttribute('aria-label', 'Encender la radio')
  const antennaRod = el('span', 'radio__antenna-rod')
  const antennaTip = el('span', 'radio__antenna-tip')
  antenna.append(antennaRod, antennaTip)

  const body = el('div', 'radio__body')
  const dial = el('div', 'radio__dial')
  dial.setAttribute('aria-hidden', 'true')
  const display = el('div', 'radio__display')
  const staticEl = el('span', 'radio__static')
  staticEl.setAttribute('aria-hidden', 'true')
  const msg = el('p', 'radio__msg')
  msg.setAttribute('aria-hidden', 'true')
  display.append(staticEl, msg)
  const grille = el('div', 'radio__grille')
  grille.setAttribute('aria-hidden', 'true')
  const knobs = el('div', 'radio__knobs')
  const knobA = el('span', 'radio__knob')
  const knobB = el('span', 'radio__knob')
  knobs.append(knobA, knobB)
  body.append(dial, display, grille, knobs)

  radio.append(antenna, body)

  const hint = el('p', 'secret__hint', 'Pulsa la antena o agita el teléfono para sintonizar')
  const status = el('p', 'secret__status sr-only')
  status.setAttribute('aria-live', 'polite')

  root.append(title, radio, hint, status)

  const reduced = prefersReducedMotion()
  const text = cfg.secret
  let tuning = false
  let tuned = false
  let frame = 0
  let armed = false

  function finish() {
    tuning = false
    tuned = true
    cancelAnimationFrame(frame)
    msg.textContent = text
    msg.setAttribute('aria-hidden', 'false')
    status.textContent = text
    antenna.setAttribute('aria-label', 'Radio encendida')
    root.classList.remove('is-tuning')
    root.classList.add('is-tuned')
  }

  function tune() {
    if (tuning || tuned) return
    tuning = true
    root.classList.add('is-tuning')
    if (reduced) {
      finish()
      return
    }
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / TUNE_MS)
      msg.textContent = scrambleFrame(text, progress)
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      } else {
        finish()
      }
    }
    frame = requestAnimationFrame(step)
  }

  function armMotion() {
    if (armed) return
    armed = true
    armShake((magnitude) => {
      if (magnitude >= SHAKE_THRESHOLD) tune()
    })
  }

  antenna.addEventListener('click', () => {
    armMotion()
    tune()
  })

  return {
    element: root,
    start: () => {},
    destroy: () => cancelAnimationFrame(frame),
  }
}
