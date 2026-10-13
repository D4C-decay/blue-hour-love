# blue-hour-love

Página romántica interactiva (estética **TV Girl / VHS**) para Amy, de Eddy.

## En línea

GitHub Pages: se publica desde la rama `main` vía GitHub Actions (ver más abajo).

## Qué incluye

- **Hero**: saludo, título con aberración cromática y frase escrita sola.
- **TV con estática**: se "sintoniza" al **agitar el móvil** o **mantener pulsado** el botón. Al sintonizar, revela un mensaje.
- **Marquesina + medidor VHS** y **carta** que se escribe al abrir el sobre.
- **Razones**: tarjetas que se voltean, mazo deslizable y rasca y gana.
- **Mensaje secreto**, **timeline** y **footer de TVs**.
- **Galería privada** cifrada (ver abajo).
- Cursor con halo glitcheado (se desactiva con `prefers-reduced-motion`).

## Galería privada (cifrada)

Las fotos personales **no se suben en claro**. Se cifran en local con
**AES-256-GCM** y una clave derivada por **PBKDF2-SHA256** de una contraseña que
**nunca** se guarda en el repositorio. Solo se versiona el texto cifrado
(`public/photos-enc/*.webp.enc`) y un manifiesto con el salt/IVs. El descifrado
ocurre en el navegador, en memoria (Web Crypto), tras escribir la contraseña.

> Repo público ⇒ el ciphertext es descargable, pero **inútil sin la contraseña**.
> La seguridad depende de la fuerza de la contraseña. No la pierdas.

### Regenerar la galería

1. Coloca los originales en `~/Escritorio/tvgirl` y optimiza a WebP:
   ```bash
   npm run photos
   ```
2. Cifra con la contraseña (no se guarda en el repo):
   ```bash
   PHOTO_PASSWORD='tu passphrase' npm run photos:encrypt
   ```
3. La carpeta `public/photos/` (originales) queda **ignorada**; se sube
   `public/photos-enc/` (cifrado) y `manifest.json`.

Para cambiar la contraseña, vuelve a ejecutar el paso 2 (regenera salt, IVs y
ciphertext) y haz commit de `public/photos-enc/`.

## Cómo editar contenido

Todo el contenido de texto está centralizado en
[`src/lib/config.ts`](src/lib/config.ts) (nombres, frase, canción, carta,
galería, secretos, razones, etc.).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run lint
npm test           # Vitest unit
npm run build      # build + typecheck
npm run test:e2e   # Playwright
```

## Deploy

- **GitHub Pages** mediante `.github/workflows/deploy.yml`: en cada push a `main`
  compila con Vite y publica `dist/`.
- `vite.config.ts` usa `base: './'`, así que funciona bajo la subruta del
  proyecto (`https://<usuario>.github.io/blue-hour-love/`).
- **No** se usa Cloudflare ni Netlify.
- `public/robots.txt` + `<meta name="robots">` mantienen el sitio **noindex**.

## Notas

- Usa Node 22+.
- Las fotos ya se optimizan y cifran; no subas originales.
- Para el audio ambiente (si se añade) usa un `.mp3` propio (sin copyright).
