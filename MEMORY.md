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
- **Deploy**: `.github/workflows/deploy.yml` (Actions → Pages) en cada push a `main`.
  `vite.config.ts` con `base: './'` (soporta subruta del proyecto).
- **Galería privada** (`src/sections/gallery.ts` + `src/lib/crypto.ts`):
  - Fotos cifradas con **AES-256-GCM** + clave derivada por **PBKDF2-SHA256**
    (600k iteraciones, salt 16 B, IV 12 B) desde la contraseña.
  - Solo se versiona `public/photos-enc/*.webp.enc` + `manifest.json` (salt/IVs).
  - `public/photos/` (originales) está en `.gitignore`.
  - Script `scripts/encrypt-photos.mjs` (`npm run photos:encrypt`,
    `PHOTO_PASSWORD=...`). IDs opacos (`p01…p13`) para no filtrar fechas.
  - Descifrado en el navegador (Web Crypto) tras escribir la contraseña; la
    contraseña **no** está en el repo.
- Tests: **11 unit** (config, signal, crypto) + **5 e2e** (home, a11y, gallery).
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
  falla. Arreglar quitando esa línea (requiere sudo). No afecta a `git push`.

## Próximo paso
Verificar el deploy en GitHub Pages y confirmar el link
`https://d4c-decay.github.io/blue-hour-love/`. Opcional: dominio propio, audio
ambiente (Fase 4 opcional), o revisar EXIF de los originales.

## Log
- 2026-10-12: galería cifrada (AES-GCM/PBKDF2) + deploy Pages + repo público;
  historial purgado de `public/photos`. 11 unit + 5 e2e verdes; desbloqueo real
  verificado en Chromium (13 imágenes, 0 errores).
