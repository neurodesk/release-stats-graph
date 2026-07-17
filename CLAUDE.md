# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub Readme Activity Graph generates dynamic SVG activity graphs showing a user's GitHub contributions. It's an Express.js server (TypeScript) that queries the GitHub GraphQL API for contribution data and renders SVG line charts using `node-chartist`.

## Commands

- **Dev server:** `npm run dev:start` (uses nodemon)
- **Build:** `npm run build` (compiles to `dist/`)
- **Start:** `npm start` (runs compiled `dist/main.js`)
- **Test:** `npm test` (Jest)
- **Single test:** `npx jest __test__/utils.test.ts`
- **Lint:** `npm run lint` (ESLint with auto-fix)
- **Format:** `npm run format` (Prettier)

## Environment

Requires a `.env` file with `TOKEN=<GitHub personal access token>` (see `.env.example`).

## Architecture

**Request flow:** Express routes (`src/main.ts`) -> `Handlers` (`src/handlers.ts`) -> `Utilities` (`src/utils.ts`) + `Fetcher` (`src/fetcher.ts`) -> `Card` (`src/GraphCards.ts`) -> SVG output

Key components:
- **`Fetcher`** - Calls GitHub GraphQL API to get contribution calendar data for a date range
- **`Utilities`** - Parses query string parameters, resolves theme colors, validates dates/days, orchestrates graph building
- **`Card`** (GraphCards.ts) - Configures chart options and uses `node-chartist` to render the line chart, wraps it in SVG via `graphSvg()`
- **`src/svgs.ts`** - SVG template functions (`graphSvg`, `invalidUserSvg`)
- **`src/styles/themes.ts`** - Theme color definitions (30+ themes as a switch/case in `selectColors`)
- **`src/interfaces/interface.ts`** - All TypeScript class definitions (used as interfaces)

**Routes:**
- `GET /graph` - Returns SVG image of contribution graph (main endpoint)
- `GET /data` - Returns raw contribution JSON
- `GET /` - Landing page

**Query parameters** (on `/graph`): `username`, `theme`, `area`, `hide_border`, `hide_title`, `custom_title`, `bg_color`, `color`, `line`, `point`, `area_color`, `title_color`, `radius`, `height`, `days`, `from`, `to`, `grid`

## Tests

Tests are in `__test__/` directory using Jest with ts-jest. Test files cover fetching, SVG output, themes, and utility functions. Mock data is in `__test__/fakeInputs.ts` and `__test__/mockFunctions.ts`.

## Adding a Theme

Add a new case to the switch statement in `src/styles/themes.ts` returning a `Colors` object with: `areaColor`, `bgColor`, `borderColor`, `color`, `titleColor`, `lineColor`, `pointColor` (hex values without `#`).
