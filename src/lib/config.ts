/**
 * blue-hour-love — personalización central
 */

export interface Song {
  title: string
  artist: string
  youtubeUrl: string
}

export interface ReasonGroups {
  flip: string[]
  deck: string[]
  scratch: string[]
}

export interface TimelineItem {
  label: string
  text: string
}

export interface LetterConfig {
  prompt: string
  text: string
  closeHint: string
}

export interface LoveConfig {
  title: string
  to: string
  from: string
  quote: string
  song: Song
  tvStatic: {
    hint: string
    message: string
  }
  letter: LetterConfig
  secret: string
  reasons: ReasonGroups
  reasonFinal: string
  timeline: TimelineItem[]
  footerMessages: string[]
  marquee: {
    text: string
    label: string
  }
}

export const config: LoveConfig = {
  title: 'Blue Hour Love',
  to: 'Amy',
  from: 'Eddy',
  quote:
    'a tu lado las cosas no son perfectas, pero prefiero un amor verdadero ' +
    'contigo a cualquier otra cosa con otra persona',
  song: {
    title: 'Not Allowed',
    artist: 'TV Girl',
    youtubeUrl: 'https://www.youtube.com/results?search_query=TV+Girl+Not+Allowed',
  },
  tvStatic: {
    hint: 'Agita el teléfono o mantén pulsada la pantalla para sintonizar',
    message:
      'De todas las señales del mundo, la única que quiero sintonizar es la tuya.',
  },
  letter: {
    prompt: 'Abre la carta',
    text:
      'Escribí esto pensando en ti. Gracias por cada momento, por tu paciencia ' +
      'y por quererme incluso cuando no es fácil. Eres mi persona favorita.',
    closeHint: 'Cerrar carta',
  },
  secret: 'si pudiera volver a empezar, te elegiría a ti otra vez y sin dudarlo.',
  reasons: {
    flip: ['Por tu sonrisa...', 'Por cómo me escuchas...', 'Por tu forma de ver el mundo...', 'Por tu ternura...', 'Por tu fuerza...', 'Porque contigo lo simple es especial'],
    deck: ['Risas hasta llorar', 'Conversaciones de madrugada', 'Sueños compartidos', 'Silencios cómodos', 'Abrazos que dicen todo', 'Miradas sin hablar'],
    scratch: ['Me enamoré antes de saberlo', 'Pienso en ti al despertar', 'Eres mi lugar favorito', 'Quiero envejecer a tu lado', 'La casualidad más bonita', 'Te elegiría una y otra vez'],
  },
  reasonFinal: '…y mil razones más ❤',
  timeline: [
    { label: 'El inicio', text: 'Todo empezó a tener sentido.' },
    { label: 'Nuestro lugar', text: 'Donde sea, contigo.' },
    { label: 'Hoy', text: 'Sigue siendo tú.' },
  ],
  footerMessages: [
    'Te quiero.',
    'Gracias por existir.',
    'Eres mi canal favorito.',
    'Contigo todo tiene mejor señal.',
    'Mi persona favorita.',
    'Eres mi blue hour.',
  ],
  marquee: {
    label: 'Señal de amor',
    text: 'a tu lado las cosas no son perfectas, pero prefiero un amor verdadero contigo a cualquier otra cosa con otra persona',
  },
}

export function greeting(cfg: LoveConfig = config): string {
  return `Para ${cfg.to}`
}
