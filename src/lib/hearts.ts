import { el, prefersReducedMotion } from './dom'
import { heartSvg } from './pixel-art'

/** Lluvia de corazones 8-bit (se ignora con `prefers-reduced-motion`). */
export function celebrateHearts(count = 26): void {
  if (typeof document === 'undefined' || prefersReducedMotion()) return

  const layer = el('div', 'heart-rain')
  layer.setAttribute('aria-hidden', 'true')

  for (let i = 0; i < count; i += 1) {
    const item = el('span', 'heart-rain__item')
    item.innerHTML = heartSvg()
    item.style.left = `${Math.round(Math.random() * 100)}%`
    item.style.setProperty('--delay', `${(Math.random() * 0.9).toFixed(2)}s`)
    item.style.setProperty('--duration', `${(1.7 + Math.random() * 1.7).toFixed(2)}s`)
    item.style.setProperty('--scale', `${(0.6 + Math.random() * 1).toFixed(2)}`)
    layer.append(item)
  }

  document.body.append(layer)
  window.setTimeout(() => layer.remove(), 4600)
}
