import { el } from '../lib/dom'

const SEEN_KEY = 'bhl_intro_seen'
const DURATION = 1500

/** Intro tipo VHS "▶ PLAY" (una vez por sesión; no bloquea clics). */
export function initIntro(): HTMLElement {
  const overlay = el('div', 'intro')
  overlay.setAttribute('aria-hidden', 'true')
  const play = el('div', 'intro__play', '▶ PLAY')
  const track = el('div', 'intro__track')
  overlay.append(track, play)

  function dismiss() {
    overlay.classList.add('is-done')
    window.setTimeout(() => overlay.remove(), 700)
  }

  let seen = false
  try {
    seen = window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    seen = false
  }

  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (seen || reduced) {
    overlay.remove()
    return overlay
  }

  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* sessionStorage puede fallar en modo privado: se ignora */
  }

  window.addEventListener('pointerdown', dismiss, { once: true })
  window.setTimeout(dismiss, DURATION)
  return overlay
}
