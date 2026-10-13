import { el } from '../lib/dom'
import { prefersReducedMotion } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initMarqueeSignal(cfg: LoveConfig): Section {
  const root = el('section', 'marquee')
  root.id = 'marquee'

  const label = el('p', 'marquee__label', cfg.marquee.label)

  const trackWrap = el('div', 'marquee__track')
  const track = el('div', 'marquee__inner')
  const text = el('span', 'marquee__text', cfg.marquee.text)
  const text2 = el('span', 'marquee__text', cfg.marquee.text)

  track.append(text, text2)
  trackWrap.append(track)

  const bar = el('div', 'marquee__bar')
  const barFill = el('div', 'marquee__bar-fill')
  bar.append(barFill)

  root.append(label, trackWrap, bar)

  if (prefersReducedMotion()) {
    track.style.animation = 'none'
    barFill.style.width = '100%'
  }

  let raf = 0
  let t = 0
  function loop(now: number) {
    t = (now / 800) % 1
    barFill.style.width = `${(t * 100).toFixed(1)}%`
    raf = requestAnimationFrame(loop)
  }

  return {
    element: root,
    start: () => {
      if (prefersReducedMotion()) return
      raf = requestAnimationFrame(loop)
    },
    destroy: () => cancelAnimationFrame(raf),
  }
}
