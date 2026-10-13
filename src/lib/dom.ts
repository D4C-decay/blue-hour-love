/** Pequeños helpers de DOM. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

export function requireEl<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T {
  const node = root.querySelector<T>(selector)
  if (!node) throw new Error(`No existe el elemento: ${selector}`)
  return node
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
