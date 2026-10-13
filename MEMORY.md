# MEMORY.md — blue-hour-love

> Fuente de continuidad entre sesiones. Actualizar al cierre si hay cambios relevantes.

## Objetivo
Página romántica interactiva `blue-hour-love` (estética TV Girl/VHS) para Amy, de
Eddy. Proyecto estático Vite+TS para ejercitar el workflow **Codex+Opencode+Testers
+ CI**. Repo **público** con **GitHub Pages** (sin Cloudflare) y **galería privada
cifrada**.

## Estado actual
- Fases 1–3 completas (hero, TV con estática, marquesina, carta, razones, secreto,
  timeline, footer TVs) + **Fase 4: galería cifrada**.
- **Rediseño de razones + mensaje secreto (esta sesión)**:
  - "Cosas que amo de ti" y "Secretitos" ahora son **televisores con estática**
    (`createStaticTv` en `reasons.ts`): **pulsar** sintoniza (~0.6 s) y revela el
    mensaje; con `prefers-reduced-motion` revela al instante. Sin canvas por
    tarjeta (estática **CSS**, ruido SVG + `steps()`), 12 TVs en total.
  - Se **eliminó** la sección "Momentos que atesoro" (mazo) y su `deck` del config.
  - **Mensaje secreto** (`secret.ts`): revela al **agitar el teléfono**
    (`src/lib/shake.ts`, con `requestPermission` de iOS en el primer gesto) o al
    **mantener pulsado**; antes solo soportaba manteniendo y fallaba con un toque.
  - **"¿Me amas?"** (`love-vhs.ts`): al pulsar **Sí** aparece un mensaje en la TV
    (`config.loveVhs.message`), además del corazón.
- **Fase 5 — visuales 8-bit, radio y cementerio (esta sesión)**:
  - **"¿Me amas?"** (`love-vhs.ts`): el botón "Sí" **no respondía** porque el "No"
    esquiva con `translate3d` hasta los límites de la ventana y, al pasar el ratón,
    caía encima; arreglado con `position: relative; z-index: 2` en `.lovevhs__btn--yes`.
    Ahora al decir **Sí** aparece una **cara triste 8-bit** (SVG `shape-rendering:
    crispEdges`, parpadeo + lágrima) que da paso a un **corazón rojo 8-bit**, más
    **lluvia de corazones** (`src/lib/hearts.ts`, `celebrateHearts`). El "No" rota
    etiquetas (`config.loveVhs.noLabels`).
  - **Pixel-art** (`src/lib/pixel-art.ts`): `pixelSvg`, `neutralFaceSvg`,
    `cryingFaceSvg`, `heartSvg` (SVG nítido, sin dependencias).
  - **Mensaje secreto** (`secret.ts`): reescrito como **radio**; al pulsar la
    **antena** (o agitar el móvil) la estática se resuelve en el mensaje con
    `scrambleFrame` (`src/lib/scramble.ts`, rAF ~3.6 s; reduced-motion instantáneo).
  - **Cementerio de televisiones** (`footer-tvs.ts`, antes "Vertedero"): TVs
    rotas (pantalla agrietada, carcasa inclinada) y **antenas torcidas**; al pulsar
    una rota hace un glitch.
  - **Extras**: intro VHS "▶ PLAY" (`src/sections/intro.ts`, `sessionStorage`,
    `pointer-events:none`), **"Nuestra canción"** en casete que enlaza a YouTube
    (`src/sections/song.ts`, usa `config.song`), indicador **REC ●**
    (`src/sections/rec.ts`), **favicon 8-bit** (`public/favicon.svg`) y lluvia de
    corazones al desbloquear la galería.
  - Estilos en `src/styles/fase5.css` (importado en `main.ts`) + utilidad `.sr-only`.
- **Fase 6 — mural, grietas y caras (esta sesión)**:
  - **Galería como mural** (`src/sections/gallery.ts` + `src/styles/gallery.css`):
    las 13 fotos son **polaroids** con cinta adhesiva y tilt, repartidas de forma
    **determinista** (`src/lib/gallery-layout.ts`, patrón %7): algunas con
    **estática moderada** (escaneo + ruido a baja opacidad; la imagen queda nítida)
    y otras con **marcas de quemadura** en los bordes (`.gallery__item--burn::after`,
    `mix-blend-mode: multiply`). Sin TVs ni grietas dentro de la galería. Muro con
    textura de tablón.
  - **Grietas en el fondo** (`src/sections/cracks.ts`, `initCracks()` → `.page-cracks`
    fijo, `aria-hidden`, `mix-blend-mode:screen`) y **grieta sobre la pantalla de
    "Sintonizar"** (`#tv`), en `src/styles/fase6.css` (importado en `main.ts`).
  - **Carta**: `config.letter.text` con la frase nueva ("…mi obsesión más hermosa,
    te amo con la certeza egoísta…").
  - **"¿Me amas?"** (`love-vhs.ts`): cara **neutra `._.`** por defecto; al
    interactuar con el **"No"** pasa a **`;-;`** (llorando) y el botón se mueve; al
    **"Sí"**, un **corazón 8-bit pequeño** aparece en el flujo de la pantalla (sin
    tapar el mensaje). TV con **2 antenas** (una recta, una torcida). `is-cry`/
    `is-yes` en `src/styles/fase5.css`.
- **Desplegado y verificado en vivo**: `https://d4c-decay.github.io/blue-hour-love/`
  (repo **público**, Pages vía `deploy.yml`, sin Cloudflare/Netlify). Home 200,
  `photos-enc/*` 200, `photos/*` **404**; desbloqueo real con la contraseña → 13
  imágenes, 0 errores. CI en verde.
- **Galería privada** (`src/sections/gallery.ts` + `src/lib/crypto.ts`):
  - Fotos cifradas con **AES-256-GCM** + clave derivada por **PBKDF2-SHA256**
    (600k iteraciones, salt 16 B, IV 12 B) desde la contraseña.
  - Solo se versiona `public/photos-enc/*.webp.enc` + `manifest.json` (salt/IVs).
  - `public/photos/` (originales) está en `.gitignore`.
  - Script `scripts/encrypt-photos.mjs` (`npm run photos:encrypt`,
    `PHOTO_PASSWORD=...`). IDs opacos (`p01…p13`) para no filtrar fechas.
  - Descifrado en el navegador (Web Crypto) tras escribir la contraseña; la
    contraseña **no** está en el repo.
- Tests: **19 unit** (config, signal, crypto, scramble, gallery-layout) + **10 e2e**
  (home, a11y, gallery, reasons, secret, love-vhs, letter).
- CI `ci.yml` (typecheck/lint/build/unit/e2e chromium) + `deploy.yml` (Pages).

## Decisiones
- Repo **público**, deploy **GitHub Pages**, **sin Cloudflare/Netlify** (igual que
  `for-this-one-special-girl`).
- Fotos: **cifrado client-side** (única protección real y gratis en hosting
  estático con repo público). Un simple overlay de contraseña NO protegería.
- Historia reescrita para purgar las fotos en claro (`public/photos`) antes de
  hacer público el repo.
- Estética oscura nocturna (magenta/cian) + VHS. `prefers-reduced-motion` respetado.

## Blockers
- **`/etc/hosts`**: `api.github.com` apunta a la IP de `github.com` → `gh api`
  falla. **Workaround usado** (sin sudo): `curl --resolve api.github.com:443:140.82.114.5`
  con `$(gh auth token)` para `PATCH visibility` y `POST /pages`.
  Arreglar quitando esa línea (requiere sudo). No afecta a `git push`.

## Próximo paso
Proyecto terminado y desplegado. Opcionales: dominio propio, audio ambiente,
revisar EXIF de los originales (las fotos ya están cifradas). Si se cambia la
contraseña: `PHOTO_PASSWORD=... npm run photos:encrypt` y commit de
`public/photos-enc/`.

## Log
- 2026-10-13: **Fase 6** — galería convertida en **mural de polaroids** con cinta
  (estática moderada en algunas y **marcas de quemadura** en los bordes en otras,
  repartidas por `src/lib/gallery-layout.ts`; sin TVs ni grietas dentro de la
  galería), **grietas** en el fondo de la página (`src/sections/cracks.ts` +
  `fase6.css`) y en la pantalla de "Sintonizar" (`#tv`); carta con la frase nueva;
  "¿Me amas?" con caras **`._.`/`;-;`** y **corazón pequeño** que no tapa el mensaje,
  TV con 2 antenas. Fix de CSS: `.gallery__grid[hidden]{display:none}` (el padding lo
  hacía visible). 19 unit + 10 e2e verdes (nuevos `gallery-layout.test.ts`,
  `letter.spec.ts`).
- 2026-10-12: **Fase 5** — "¿Me amas?" con cara triste y corazón **8-bit** (fix
  real: `z-index` del "Sí", que el "No" esquivador bloqueaba) + lluvia de
  corazones; mensaje secreto como **radio** con antena y `scrambleFrame`; footer
  como **Cementerio de televisiones** (rotas + antenas torcidas); extras (intro
  "▶ PLAY", canción-casete, REC, favicon 8-bit); frases nuevas de razones/secretitos.
  15 unit + 8 e2e verdes (nuevos `scramble.test.ts`, `love-vhs.spec.ts`).
- 2026-10-12: rediseño de razones (flip+scratch → TVs con estática; se elimina el
  mazo "Momentos que atesoro"), mensaje secreto con **agitar el teléfono**
  (`src/lib/shake.ts`), y mensaje en la TV al pulsar "Sí" en "¿Me amas?".
  11 unit + 6 e2e verdes; typecheck/lint/build en verde. Nuevo e2e `reasons.spec.ts`.
- 2026-10-12: galería cifrada (AES-GCM/PBKDF2) + deploy Pages + repo público;
  historial purgado de `public/photos` (filter-branch + force-push); Pages
  habilitado con build_type=workflow. 11 unit + 5 e2e verdes; desbloqueo real
  verificado en Chromium local y en vivo (13 imágenes, 0 errores).
  URL: https://d4c-decay.github.io/blue-hour-love/
