# Firmament Guardian — migration and deployment plan

## Goal and implementation approach

Turn the supplied Firmament Guardian codebase into a public, managed website without replacing its astrology functionality. Reuse the uploaded React 19/Vite client and Express/tRPC application, its Swiss Ephemeris calculations, source assets, route manifest, and existing Drizzle schema. Run the app as a Node container on the managed Web service, listening on the platform-provided `PORT` (default 3000); use the provisioned managed MySQL for durable application records. Keep all private configuration at runtime and out of browser bundles. Build the client and server from the checked-in lockfile in the container. Preserve `/health` as an unauthenticated health endpoint. After runtime configuration and checks, create a canonical checkpoint and publish the deployed app at its managed public URL. Do not enable always-on hosting absent an explicit request; published availability can use the managed platform's default residency policy.

## Existing project structure to preserve

- `client/`: React application, Vite entry, pages, components, styles, public images/audio, and `public/manus-routes.json`.
- `server/`: Express/tRPC server, chart and horary logic, interpretation and integration services; `_core/index.ts` registers `/health`, APIs, and Vite/static serving.
- `shared/`: shared types and application logic.
- `drizzle/`, `drizzle.config.ts`, `server/db.ts`, `server/storage.ts`: schema, migration material, database and application persistence.
- Root `package.json`, `pnpm-lock.yaml`, TypeScript/Vite config, `Dockerfile`, `.env.example`, and existing docs/audit reports: toolchain, build, deployment and reference materials.

The managed project will retain this structure at its root. Build with the committed pnpm lockfile and a pinned package-manager version; explicitly allow required native build scripts such as Swiss Ephemeris/esbuild where needed. Keep `.env` and secrets out of Git and image layers.

## Runtime and persistent data

Use the managed server and MySQL capabilities already enabled for this project. Connect through runtime `DATABASE_URL`, preserve the existing data model and migration history, and verify the persistence paths used by reading history. The app's uploaded code supports the platform API and external model providers; prefer credentials supplied by the managed runtime where the source already supports them. Request only any separate provider values proven to be necessary for requested functionality. Do not expose secrets in the client. Do not run destructive schema operations against the managed database.

## Production deployment

Use a production container build that installs dependencies from `pnpm-lock.yaml`, builds the Vite frontend and server bundle, and starts the existing Express production server. Keep `/health` public and successful for readiness, bind `0.0.0.0:$PORT`, and make the static client root available to `serveStatic`. Declare the container and health-path deployment contract in WebDev config. Preserve the source route manifest and verify that it is served as JSON. Publish only from an accepted checkpoint on `main`; a successful checkpoint is not itself proof of successful publication.

## Design direction

Create an original Firmament Guardian interface that combines the tidy card layout and clear actions the user liked in Canopy with the dark, high-contrast, modern astrology presentation they identify as AstroCode AI/AstroCodice. Do not copy either product's wording, branding, or artwork. Keep the app's own deep midnight palette, starfield, cyan/cool-blue highlights with pale gold, and editorial serif headlines paired with readable sans-serif interface text.

The product's visual cosmography is the user's requested Genesis-inspired firmament: a level Earth plane beneath a curved celestial dome, with the Sun, Moon, fixed stars, and calculated planetary positions shown across the sky above it. Remove the atom-like multi-orbit illustration and avoid heliocentric planets circling a central Sun. On the home hero and interactive chart, draw a clear cross-section of the Earth plane beneath the dome; put calculated planet positions along the dome projection and chart aspects between them, clearly distinguishing aspects from trajectories. Keep visible labels aligned with the app's chosen cosmography and factual about computation: retain Swiss Ephemeris longitude, house, and aspect calculations unchanged. Do not imply the illustration is a measured physical survey.

Keep the before-chart welcome choices as consistent, easy-to-scan card rows with their five existing destinations and guided/deep-study toggle. In the later chart selector, use plain-language labels for the three existing sky perspectives and three reading modes; preserve its selection and calculation behavior and make cards align on phone and desktop.

For the follow-up map polish, preserve the approved Earth-under-dome cosmography and upgrade only the interactive dome map into a more detailed, premium celestial atlas: richer dome construction, clearly indexed zodiac sectors and coordinates, nuanced night-sky depth, readable fixed-star and selected-body annotations, and an integrated earth-plane base. Make the selected chart layer and calculation moment/location legible, retain layer comparison and planet inspection, and keep chart-aspect connectors visually distinct and explicitly non-orbital. Optimize legibility and hierarchy for phone as well as desktop; do not change the rest of the website or chart calculations.

## Open Guide & Patterns — deeper, evidence-grounded self-knowledge

Reuse the existing `buildAstrologyEvidencePacket` and the multi-method interpretation pipeline. The direct report must receive actual method evidence and source traces; do not call the packet builder from inside the behavioral engine because packet assembly already invokes that engine. Replace the fixed 16 prose conclusions and misleading “16 systems” audit with chart-specific, evidence-linked hypotheses, method contribution/status counts, counter-evidence, and explicit gaps. If evidence is weak or unavailable, state that instead of filling the gap with a generic personality claim.

For each supported trigger/defense/repeating-cycle pattern, explain the relevant chart evidence, possible inner need, automatic response, possible short-term protection, likely cost, counter-signal, and a mature alternative. Give the user specific questions about recent real situations and a clear way to answer; keep answers in browser state unless the user deliberately shares them with the existing Guide. Use the app's full multi-method Guide when a longer synthesis is requested. Its output must answer the user's focus on strengths, vulnerabilities, triggers, and self-sabotage while remaining conditional, non-clinical, and careful not to invent biography. Distinguish active methods from reference-only, incomplete, unavailable, or non-contributing ones. Preserve calculations, house systems, mode selection, chart privacy, and existing product features.

Project structure: `client/src/components/BehavioralIntelligencePanel.tsx` will display chart-specific reflection units, method provenance, and optional user-led answers; `server/routers.ts` will return the full evidence packet/source-status bundle for that panel; `server/astrologyKnowledge/behavioral/engine.ts` will build supported per-dimension hypotheses and reflection prompts, with focused deterministic tests in its test module. The full narrative continues through `server/interpretation.ts` and its existing tRPC route; no duplicate external model service is introduced. `TODO.md` records these separate outcomes and completion evidence.
