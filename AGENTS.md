---
name: blue-hour-love
description: Página romántica interactiva (TV Girl/VHS) para probar el workflow Codex+Opencode+Testers
---

# blue-hour-love — AGENTS.md

## Alcance del proyecto
Proyecto web estático construido con **Vite + TypeScript + Vitest + Playwright**. Objetivo: ejercitar el flujo **Codex (obrero) + Opencode (supervisor) + Testers** y el CI, mientras se construye iterativamente por fases (Fase 1 mínima → ampliación).

## Modo de trabajo
- **Principio:** Codex escribe; Opencode supervisa. Nunca se pisan archivos.
- **Scope mínimo:** empezar con **1–2 archivos** por tarea; acordar con Codex los archivos editables.
- **Mientras Codex corre:** lanzar testers relevantes (Playwright/axe + unit). Usar reporte vivo.
- **Verificación obligada:** tras cada cambio → `npm run typecheck && npm run lint && npm run build && npm test && npm run test:e2e -- --project=chromium` (o lo necesario).
- **Iterativo:** seguir el enfoque "mínimo e iterar" acordado.

## Convenciones
- TypeScript estricto, ESM.
- Estilos con CSS vanilla (tokens CSS).
- Config centralizado en `src/lib/config.ts`.
- Sin dependencias runtime innecesarias.
- `noindex` obligatorio (privacidad).
- Respeta `prefers-reduced-motion`.
- **Fotos privadas**: nunca se commitean en claro. Solo `public/photos-enc/`
  (ciphertext + `manifest.json`). El cifrado es client-side (AES-256-GCM +
  PBKDF2) y la contraseña se pasa por `PHOTO_PASSWORD` a `npm run photos:encrypt`
  y **nunca** se guarda en el repo.

## Testing adaptado al stack web
- **Unit:** Vitest (helpers puros: `src/lib/signal.ts`, `config`).
- **E2E:** Playwright (interacciones: TV estática, esquiva de botón, revelados).
- **Accesibilidad:** axe via Playwright.
- **Verificación CI:** build+lint+typecheck+unit+e2e.

## Seguridad/privacidad
- Repo **público** (requisito de GitHub Pages free). Todo el código es visible.
- Contenido **no indexado** (`robots.txt`, meta, headers). Fotos **cifradas**.
- No exponer secretos en commits (la contraseña de la galería vive solo fuera
  del repo; se usa en `npm run photos:encrypt`).
- Fotos: comprimir (WebP), **borrar EXIF** antes de cifrar. No subir originales.

## Referencia
Ver `README.md` y `.github/workflows/deploy.yml`.
