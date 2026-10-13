import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initTimeline(cfg: LoveConfig): Section {
  const root = el('section', 'timeline')
  root.id = 'timeline'

  const title = el('h2', 'timeline__title', 'Nuestra historia')
  const list = el('ul', 'timeline__list')
  cfg.timeline.forEach((item) => {
    const li = el('li', 'timeline__item')
    const label = el('span', 'timeline__label', item.label)
    const text = el('span', 'timeline__text', item.text)
    li.append(label, text)
    list.append(li)
  })
  root.append(title, list)
  return { element: root }
}
