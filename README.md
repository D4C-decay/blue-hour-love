# blue-hour-love

Página romántica interactiva (estética **TV Girl / VHS**) para Amy, de Eddy.

## Fase 1 (actual)
- Hero: frase escrita / marquesina.
- TV con estática: se "sintoniza" al **agitar el móvil** o **mantener pulsado** el botón. Al sintonizar, revela un mensaje.
- Cursor con halo glitcheado (desactivado con `prefers-reduced-motion`).
- Noindex (`robots.txt`, `<meta robots>`, `X-Robots-Tag` en Netlify).

## Cómo editar contenido
Todo el contenido está centralizado en [`src/lib/config.ts`](src/lib/config.ts). Cambia nombres, frase, canción, carta, secretos, razones, etc.

## Desarrollo
```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run lint
npm test           # Vitest unit (config + signal)
npm run build      # build + typecheck
npm run test:e2e   # Playwright
```

## Deploy
Se usa **Netlify** (repo privado). `netlify.toml` incluye `build`, publish `dist` y cabeceras `X-Robots-Tag: noindex`. La web queda no listada, pero accesible con el enlace (sin portero en free tier).

## Notas
- Usa Node 22+ (Netlify).
- Las fotos personales (si añades) debes comprimirlas y borrar EXIF antes de subirlas.
- Para el audio ambiente (Fase 4) necesitarás un `.mp3` propio (evita subir música con copyright).
