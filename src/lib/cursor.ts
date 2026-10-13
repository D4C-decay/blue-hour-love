import { el, prefersReducedMotion } from './dom'

/**
 * Cursor con halo glitcheado (líneas rojas/azules desalineadas).
 * Se desactiva con prefers-reduced-motion o en punteros táctiles.
 */
export function initCursorGlitch(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  if (prefersReducedMotion()) return null
  if (!window.matchMedia('(pointer: fine)').matches) return null

  const cursor = el('div', 'cursor-glitch')
  cursor.setAttribute('aria-hidden', 'true')
  document.body.append(cursor)

  let raf = 0
  let targetX = window.innerWidth / 2
  let targetY = window.innerHeight / 2
  let x = targetX
  let y = targetY

  const render = () => {
    x += (targetX - x) * 0.2
    y += (targetY - y) * 0.2
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    raf = requestAnimationFrame(render)
  }
  raf = requestAnimationFrame(render)

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX
      targetY = event.clientY
    },
    { passive: true },
  )

  window.addEventListener(
    'beforeunload',
    () => {
      cancelAnimationFrame(raf)
    },
    { once: true },
  )

  return cursor
}
