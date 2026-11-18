## Stack

Vite 8 + React 19 (JSX, no TypeScript) + React Router 7 + Tailwind CSS v4 (`@tailwindcss/vite`).
Motion: framer-motion, GSAP + ScrollTrigger, Lenis smooth scroll. 3D: three + react-three-fiber.

- Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint`
- `@/` aliases `src/`. Routes live in `src/routes/App.jsx`.
- Internal links use `@/components/ui/Link` (`href` prop, router-aware). Client-only heavy components use `lazyClient()` from `@/lib/lazy`.
- Env vars are `VITE_*` (see `src/lib/site.js`); `VITE_HERO_3D=1` enables the live 3D hero.
- Fonts come from `@fontsource-variable/*`; the CSS variables are defined in `src/styles/tokens.css`.
- The design tokens in `src/styles/tokens.css` and `src/styles/globals.css` are the visual source of truth.
