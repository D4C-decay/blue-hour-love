import { el } from '../lib/dom'

/** Fondo de grietas tipo cristal roto (decorativo). */
export function initCracks(): HTMLElement {
  const cracks = el('div', 'page-cracks')
  cracks.setAttribute('aria-hidden', 'true')
  return cracks
}
