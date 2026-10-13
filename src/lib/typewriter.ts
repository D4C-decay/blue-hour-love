import { prefersReducedMotion } from './dom'

export interface TypewriterOptions {
  /** ms entre caracteres. */
  speed?: number
  /** ms de pausa antes de empezar. */
  delay?: number
  onDone?: () => void
}

/**
 * Escribe `text` carácter a carácter en `node`.
 * Con prefers-reduced-motion escribe todo de golpe.
 * Devuelve una función para cancelar.
 */
export function typewriter(
  node: HTMLElement,
  text: string,
  { speed = 42, delay = 200, onDone }: TypewriterOptions = {},
): () => void {
  if (prefersReducedMotion()) {
    node.textContent = text
    onDone?.()
    return () => {}
  }

  let i = 0
  let timer: number | undefined
  let cancelled = false
  node.textContent = ''

  const step = () => {
    if (cancelled) return
    i += 1
    node.textContent = text.slice(0, i)
    if (i >= text.length) {
      onDone?.()
      return
    }
    timer = window.setTimeout(step, speed)
  }

  timer = window.setTimeout(step, delay)

  return () => {
    cancelled = true
    if (timer !== undefined) window.clearTimeout(timer)
  }
}
