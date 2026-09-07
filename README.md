# aicumen.dev

The local Aicumen website: a landing page and dedicated Composer and Assessor product pages. This repository includes the complete design, animations, interactive demos, and source-based product descriptions.

## Run locally

Requires Node.js 22.13 or later and npm.

```sh
npm install
npm run dev
```

Open the local address printed by the development server (normally http://localhost:3000).

To run the production build locally:

```sh
npm run build
npm start
```

The production server listens only on 127.0.0.1 by default.

## Deploy

`next.config.ts` sets `output: 'export'`, so `npm run build` writes a fully static site to `dist/client` (`index.html`, `composer.html`, `assess.html`, `404.html`, and assets). `vercel.json` points Vercel at that directory with clean URLs, so `/composer` serves `composer.html`. Any static host works the same way.

## Pages

- `/`: Aicumen landing page with the interactive development loop.
- `/composer`: why an agent-native course engine exists, with a replayed tool-call build, a drag comparison, a prose-to-structure reveal, a shape atlas, and the glossary, flashcards, and matching demonstration.
- `/assess`: the Assessor page: an auto-stepping five-level ladder, an interactive seven-domain radar, a live Elo session simulator over the real question bank, five scored sample questions in five formats, and a twelve-format explorer.

Composer's demo illustrates the unreleased engine's design principles. Assessor's sample questions use the repository's deterministic scorers and Elo update; the simulator uses the bank's item metadata only. Neither is the full adaptive assessment and neither invokes AI scoring.

## Source material

Product copy was based on the local `aicumen` and `saica` repositories in the same parent directory. The Composer page follows the `aicumen` README's "Why this exists" argument; the hero replay and lesson-plan example come from `docs/transcript-lesson-01.md`, and the shape atlas from `docs/block-model.md`. Downloadable source material is in `public/documents`; demo questions are in `app/demo-data.json`.

## Development

React, TypeScript, Vinext/Vite, Tailwind CSS, and Base UI. The original site history is preserved. Sites hosting configuration and direct Cloudflare hosting dependencies have been removed. No Git remote is configured.
