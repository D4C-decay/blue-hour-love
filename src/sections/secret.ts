import { el, prefersReducedMotion } from '../lib/dom'
import { armShake } from '../lib/shake'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

const HOLD_MS = 800
const SHAKE_THRESHOLD = 14

export function initSecret(cfg: LoveConfig): Section {
  const root = el('section', 'secret')
  root.id = 'secret'

  const title = el('h2', 'secret__title', 'Mensaje secreto')
  const hint = el(
    'p',
    'secret__hint',
    'Agita el teléfono o mantén pulsado para descubrirlo',
  )
  const msg = el('p', 'secret__msg', cfg.secret)
  msg.hidden = true

  const reduced = prefersReducedMotion()
  let revealed = false
  let armed = false
  let timeout: number | undefined

  function reveal() {
    if (revealed) return
    revealed = true
    if (timeout !== undefined) window.clearTimeout(timeout)
    timeout = undefined
    msg.hidden = false
    hint.hidden = true
    root.classList.add('is-revealed')
  }

  function armMotion() {
    if (armed) return
    armed = true
    armShake((magnitude) => {
      if (magnitude >= SHAKE_THRESHOLD) reveal()
    })
  }

  function start() {
    armMotion()
    if (revealed) return
    if (reduced) {
      reveal()
      return
    }
    if (timeout !== undefined) window.clearTimeout(timeout)
    timeout = window.setTimeout(reveal, HOLD_MS)
  }

  function end() {
    if (timeout !== undefined) window.clearTimeout(timeout)
    timeout = undefined
  }

  root.addEventListener('pointerdown', start)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  root.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!e.repeat) start()
    }
  })
  root.addEventListener('keyup', end)

  root.append(title, hint, msg)
  return { element: root }
}
