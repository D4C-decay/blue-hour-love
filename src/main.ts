import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import { config } from './lib/config'
import { initHero } from './sections/hero'
import { initTvStatic } from './sections/tv-static'
import { initCursorGlitch } from './lib/cursor'

const app = document.querySelector<HTMLElement>('#app')

if (app) {
  const hero = initHero(config)
  const tv = initTvStatic(config)

  app.append(hero.element, tv.element)

  hero.start?.()
  tv.start?.()

  initCursorGlitch()
  document.documentElement.classList.add('is-ready')
}
