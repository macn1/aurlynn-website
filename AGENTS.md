## Stack

Next.js 16 (App Router) + React 19 (JSX, no TypeScript) + Tailwind CSS v4 (`@tailwindcss/postcss`).
Motion: framer-motion, GSAP + ScrollTrigger, Lenis smooth scroll. 3D: three + react-three-fiber.

- Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint`
- `@/` aliases `src/`. Routes live in `src/app/` (App Router); page bodies live in `src/views/`.
- Internal links use `@/components/ui/Link` (`href` prop, next/link-backed). Client-only heavy components use `lazyClient()` from `@/lib/lazy`.
- Env vars are `NEXT_PUBLIC_*` (see `src/lib/site.js`); `NEXT_PUBLIC_HERO_3D=1` enables the live 3D hero.
- Fonts come from `@fontsource-variable/*`; the CSS variables are defined in `src/styles/tokens.css`.
- The design tokens in `src/styles/tokens.css` and `src/styles/globals.css` are the visual source of truth.
