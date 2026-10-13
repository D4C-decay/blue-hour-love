# MEMORY.md — blue-hour-love

> Fuente de continuidad entre sesiones. Actualizar al cierre si hay cambios relevantes.

## Objetivo
Desarrollar `blue-hour-love` (estética TV Girl/VHS) para probar el workflow **Codex+Opencode+Testers + CI**, siguiendo el plan aprobado (Netlify, repo privado, noindex). Fase 1 en curso.

## Estado actual
- Fase 1 scaffold: Vite + TS + Vitest + Playwright + axe + ESLint flat config.
- `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `playwright.config.ts` creados.
- `src/lib/config.ts` (Amy/Eddy, frase, canción, tvStatic) + helpers (`signal.ts`, `dom.ts`, `typewriter.ts`, `cursor.ts`).
- Secciones: `hero.ts`, `tv-static.ts`; estilos: `tokens.css`, `base.css`, `sections.css`.
- Tests: unit `config`, unit `signal`; e2e `home`, e2e `a11y`.
- Noindex: `index.html` meta, `public/robots.txt`, `netlify.toml` headers.
- Docs: `AGENTS.md`, `README.md`, `.gitignore`.

## Decisiones
- Repo **privado**, deploy **Netlify**, URL no listada + noindex.
- Estética oscura nocturna (magenta/cian) + VHS: grano, scanlines, viñeta, aberración cromática, cursor glitcheado.
- TV se sintoniza por **agitar** (DeviceMotion) o **mantener pulsado** (fallback). Respeta `prefers-reduced-motion`.
- Workflow web-adaptado: Vitest + Playwright + axe.

## Blockers
- Ninguno (Fase 1 en progreso).

## Próximo paso
Ejecutar verificación: `npm run typecheck && npm run lint && npm run build && npm test`. Tras verde, ejecutar `npm run test:e2e -- --project=chromium`. Luego inicializar git, crear repo privado en GitHub y conectar con Netlify.

## Log
- 2026-10-12: scaffold completo de Fase 1. Commit inicial pendiente.
