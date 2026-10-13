import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/fase2.css'
import { config } from './lib/config'
import { initHero } from './sections/hero'
import { initTvStatic } from './sections/tv-static'
import { initMarqueeSignal } from './sections/marquee-signal'
import { initLetter } from './sections/letter'
import { initLoveVhs } from './sections/love-vhs'
import { initCursorGlitch } from './lib/cursor'

const app = document.querySelector<HTMLElement>('#app')

if (app) {
  const hero = initHero(config)
  const tv = initTvStatic(config)
  const marquee = initMarqueeSignal(config)
  const letter = initLetter(config)
  const love = initLoveVhs(config)

  app.append(
    hero.element,
    tv.element,
    marquee.element,
    letter.element,
    love.element,
  )

  hero.start?.()
  tv.start?.()
  marquee.start?.()
  letter.start?.()
  love.start?.()

  initCursorGlitch()
  document.documentElement.classList.add('is-ready')
}
