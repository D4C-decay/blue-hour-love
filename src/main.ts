import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/fase2.css'
import './styles/gallery.css'
import './styles/fase5.css'
import './styles/fase6.css'
import { config } from './lib/config'
import { initIntro } from './sections/intro'
import { initCracks } from './sections/cracks'
import { initRec } from './sections/rec'
import { initHero } from './sections/hero'
import { initTvStatic } from './sections/tv-static'
import { initMarqueeSignal } from './sections/marquee-signal'
import { initLetter } from './sections/letter'
import { initSong } from './sections/song'
import { initLoveVhs } from './sections/love-vhs'

import { initReasons } from './sections/reasons'
import { initSecret } from './sections/secret'
import { initTimeline } from './sections/timeline'
import { initFooterTvs } from './sections/footer-tvs'
import { initGallery } from './sections/gallery'
import { initCursorGlitch } from './lib/cursor'

const app = document.querySelector<HTMLElement>('#app')

if (app) {
  const intro = initIntro()
  document.body.append(intro)
  document.body.append(initRec())
  document.body.append(initCracks())

  const hero = initHero(config)
  const tv = initTvStatic(config)
  const marquee = initMarqueeSignal(config)
  const letter = initLetter(config)
  const song = initSong(config)
  const love = initLoveVhs(config)
  const reasons = initReasons(config)
  const secret = initSecret(config)
  const timeline = initTimeline(config)
  const footertvs = initFooterTvs(config)
  const gallery = initGallery(config)

  app.append(
    hero.element,
    tv.element,
    marquee.element,
    letter.element,
    song.element,
    love.element,
    reasons.element,
    secret.element,
    timeline.element,
    gallery.element,
    footertvs.element,
  )

  hero.start?.()
  tv.start?.()
  marquee.start?.()
  letter.start?.()
  song.start?.()
  love.start?.()
  reasons.start?.()
  secret.start?.()
  timeline.start?.()
  footertvs.start?.()
  gallery.start?.()

  initCursorGlitch()
  document.documentElement.classList.add('is-ready')
}
