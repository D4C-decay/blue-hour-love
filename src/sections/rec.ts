import { el } from '../lib/dom'

/** Indicador "REC ●" parpadeante tipo cámara VHS. */
export function initRec(): HTMLElement {
  const rec = el('div', 'rec')
  rec.setAttribute('aria-hidden', 'true')
  const dot = el('span', 'rec__dot')
  const label = el('span', 'rec__label', 'REC')
  rec.append(dot, label)
  return rec
}
