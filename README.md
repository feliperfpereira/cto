# Worldforge AI Command Center

A Next.js 14 + TypeScript starter designed for Worldforge AI. It ships with a responsive, theme-aware application shell, data visualization primitives, and a geospatial preview surface ready for feature build-out.

## Getting started

Install dependencies and launch the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to explore the command center experience.

## Key capabilities

- **App Router + `src/` layout** with global providers and an opinionated UI shell
- **Tailwind CSS v4** configured with design tokens exposed as CSS variables for light/dark theming
- **State management** via Zustand with a persisted theme controller and hydration safeguards
- **Data orchestration layer** bootstrapped with React Query helpers and providers
- **Visualization primitives** including a Recharts area chart and a MapLibre-backed geospatial preview using `react-map-gl`
- **Developer experience** powered by ESLint (flat config), Prettier, Tailwind-aware formatting, Husky, and lint-staged

## Project structure

```
src/
  app/          # App Router entrypoints, global layout, providers, styles
  components/   # Reusable UI building blocks (charts, maps, layout, theme)
  hooks/        # Custom React hooks
  lib/          # Utilities, constants, and client helpers
  store/        # Zustand stores
  types/        # Shared TypeScript types
public/assets/  # Brand and marketing assets
```

## Available scripts

```bash
npm run dev           # Start Next.js in development mode
npm run build         # Build the production bundle
npm run start         # Serve the production build
npm run lint          # Run Next.js lint (ESLint flat config)
npm run typecheck     # Run TypeScript without emitting files
npm run format        # Format the codebase with Prettier
npm run format:check  # Verify Prettier formatting
```

## Editor configuration

VS Code settings (checked into `.vscode/settings.json`) enable format-on-save with Prettier, flat-config ESLint integration, and point the editor to the workspace TypeScript version.

## Next steps

Extend the foundation with authenticated routes, live data integrations, and granular state slices as mission requirements evolve.
