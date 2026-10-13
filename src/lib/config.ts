/**
 * blue-hour-love — personalización central
 * ----------------------------------------
 * Edita SOLO este archivo para cambiar el contenido.
 * (Fase 1: hero + TV con estática. El resto se irá activando por fases.)
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
  letter: string
  secret: string
  reasons: ReasonGroups
  reasonFinal: string
  timeline: TimelineItem[]
  footerMessages: string[]
}

export const config: LoveConfig = {
  title: 'Blue Hour Love',

  to: 'Amy',
  from: 'Eddy',

  /** Frase destacada del hero (marquesina / máquina de escribir). */
  quote:
    'a tu lado las cosas no son perfectas, pero prefiero un amor verdadero ' +
    'contigo a cualquier otra cosa con otra persona',

  /** Canción: el botón abre YouTube en una pestaña nueva. */
  song: {
    title: 'Not Allowed',
    artist: 'TV Girl',
    // Sustituye por el enlace exacto del video si lo prefieres.
    youtubeUrl: 'https://www.youtube.com/results?search_query=TV+Girl+Not+Allowed',
  },

  /** Sección de la TV con estática (se aclara al agitar o mantener pulsado). */
  tvStatic: {
    hint: 'Agita el teléfono o mantén pulsada la pantalla para sintonizar',
    message:
      'De todas las señales del mundo, la única que quiero sintonizar es la tuya.',
  },

  /** Carta que se escribe sola (Fase 2). */
  letter:
    'Escribí esto pensando en ti. Gracias por cada momento, por tu paciencia ' +
    'y por quererme incluso cuando no es fácil. Eres mi persona favorita.',

  /** Mensaje secreto (Fase 3). */
  secret: 'si pudiera volver a empezar, te elegiría a ti otra vez y sin dudarlo.',

  /** Razones interactivas (Fase 3). */
  reasons: {
    flip: [
      'Por tu sonrisa, que me arregla el día entero',
      'Por cómo me escuchas de verdad',
      'Por tu forma de ver el mundo',
      'Por tu ternura incluso en los días grises',
      'Por lo fuerte que eres sin darte cuenta',
      'Porque contigo hasta lo simple se vuelve especial',
    ],
    deck: [
      'La primera vez que reímos hasta llorar',
      'Nuestras conversaciones de madrugada',
      'Cuando me cuentas tus sueños sin miedo',
      'Los silencios que nunca incomodan',
      'Cada abrazo que dice más que mil palabras',
      'La forma en que me miras sin hablar',
    ],
    scratch: [
      'Me enamoré de ti antes de saberlo',
      'Pienso en ti apenas despierto',
      'Eres mi lugar favorito en el mundo',
      'Quiero envejecer a tu lado',
      'Eres la casualidad más bonita de mi vida',
      'Te elegiría una y otra vez',
    ],
  },

  reasonFinal: '…y mil razones más ❤',

  /** Timeline "nuestra historia" (Fase 3). */
  timeline: [
    { label: 'El inicio', text: 'El día en que todo empezó a tener sentido.' },
    { label: 'Nuestro lugar', text: 'Donde sea, mientras sea contigo.' },
    { label: 'Hoy', text: 'Sigue siendo tú.' },
  ],

  /** Mensajes del footer de televisiones rotas (Fase 4): uno por TV. */
  footerMessages: [
    'Te quiero.',
    'Gracias por existir.',
    'Eres mi canal favorito.',
    'Contigo todo tiene mejor señal.',
    'Mi persona favorita.',
    'Eres mi blue hour.',
  ],
}

/** Nombre a mostrar como destinatario, listo para la UI. */
export function greeting(cfg: LoveConfig = config): string {
  return `Para ${cfg.to}`
}
