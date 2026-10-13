import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initSecret(cfg: LoveConfig): Section {
  const root = el('section', 'secret')
  root.id = 'secret'

  const title = el('h2', 'secret__title', 'Mensaje secreto')
  const hint = el('p', 'secret__hint', 'Mantén pulsado para descubrirlo')
  const msg = el('p', 'secret__msg', cfg.secret)
  msg.hidden = true

  let held = false
  let timeout: number | undefined

  function start() {
    if (held) return
    held = true
    timeout = window.setTimeout(() => {
      msg.hidden = false
    }, 800)
  }
  function end() {
    held = false
    if (timeout !== undefined) window.clearTimeout(timeout)
  }

  root.addEventListener('pointerdown', start)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  root.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      start()
    }
  })
  root.addEventListener('keyup', end)

  root.append(title, hint, msg)
  return { element: root }
}
