# immigrantsgame Frontend

This is the frontend for the Immigrants Game project, built with Next.js and React.

## Features

- Modern React (19+) and Next.js 16
- TypeScript, ESLint, and Prettier best practices
- Modular component structure
- Internationalization (i18n) support
- E2E and unit testing with Playwright and Vitest
- **Supports two data-fetching modes:**
  - Direct data fetching from Firebase (client-side)
  - Hard-coded data updates via GitHub Actions (scheduled, server-side)

## Project Structure

- `src/` — Main application source code
- `public/` — Static assets
- `package.json` — Project scripts and dependencies
- `.prettierrc` — Prettier config
- `eslint.config.mjs` — ESLint config

## Data Fetching

- The app can fetch data directly from Firebase at runtime for real-time updates.
- Alternatively, data can be hard-coded and updated automatically by a scheduled GitHub Action, which fetches and commits the latest data to the repository.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm run test` — Run all tests
- `npm run test:e2e` — Run Playwright E2E tests

## Development

1. Install dependencies: `npm ci`
2. Run the dev server: `npm run dev`
3. Open [http://localhost:3001](http://localhost:3001)

## Linting & Formatting

- ESLint and Prettier are configured for code quality and consistency.
- Run `npm run lint` to check for lint errors.

## License

MIT
