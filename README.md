# aicument.dev

The local Aicumen website: a landing page and dedicated Composer and Assess product pages. This repository includes the complete design, animations, interactive demos, and source-based product descriptions.

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

The production server listens only on 127.0.0.1 by default. No Sites account, hosting integration, deployment, or API key is required.

## Pages

- `/`: Aicumen landing page with the interactive development loop.
- `/composer`: course-authoring architecture and roadmap, plus glossary, flashcards, and matching demonstrations.
- `/assess`: assessment framework, a real SAICA sample question, domain explorer, and scoring details.

Composer's demo illustrates the unreleased engine's design principles. Assess's one-question demo uses the repository's answer key; it is not the full adaptive assessment and does not invoke AI scoring.

## Source material

Product copy was based on the local `aicumen` and `saica` repositories in the same parent directory. The detailed Composer specification takes precedence over older README descriptions. Downloadable source material is in `public/documents`; demo questions are in `app/demo-data.json`.

## Development

React, TypeScript, Vinext/Vite, Tailwind CSS, and Base UI. The original site history is preserved. Sites hosting configuration and direct Cloudflare hosting dependencies have been removed. No Git remote is configured.
