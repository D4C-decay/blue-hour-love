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
- Tests: **11 unit** (config, signal, crypto) + **6 e2e** (home, a11y, gallery,
  reasons).
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
- 2026-10-12: rediseño de razones (flip+scratch → TVs con estática; se elimina el
  mazo "Momentos que atesoro"), mensaje secreto con **agitar el teléfono**
  (`src/lib/shake.ts`), y mensaje en la TV al pulsar "Sí" en "¿Me amas?".
  11 unit + 6 e2e verdes; typecheck/lint/build en verde. Nuevo e2e `reasons.spec.ts`.
- 2026-10-12: galería cifrada (AES-GCM/PBKDF2) + deploy Pages + repo público;
  historial purgado de `public/photos` (filter-branch + force-push); Pages
  habilitado con build_type=workflow. 11 unit + 5 e2e verdes; desbloqueo real
  verificado en Chromium local y en vivo (13 imágenes, 0 errores).
  URL: https://d4c-decay.github.io/blue-hour-love/
