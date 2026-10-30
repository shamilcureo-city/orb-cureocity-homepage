# Orb by Cureocity

Responsive, dependency-free website preview built with HTML, CSS and JavaScript. Implements the updated [Figma Website Design](https://www.figma.com/design/AwydaKZ3UdxjHtLi1rrhBX/Client-App-V3?node-id=6031-51867), with a comfortable web scale and the supplied Orb graphics.

## Run locally

Requires Node.js 18 or newer. No dependency installation is needed.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4183/. The server reads `dist`; rebuild and reload after source changes. Video byte ranges are supported.

## Source

- `parts/`: homepage sections.
- `app.js`: navigation, dialogs, tabs, carousels and media behavior.
- `styles.css`, `features.css`, `lower.css`, `carousel.css`, `motion.css`: responsive layout and motion.
- `site-content.json`: shared pricing, plan definitions, destination configuration and synthetic example data.
- `website-copy.json`: shared hero and final-action copy.
- `assets/`: only the 44 assets displayed by this preview; see `ASSETS.md`.
- `dist/`: generated website, included for static preview hosting.

The user-approved preview price is **₹7,999/year**, equivalent to **₹666.58/month, billed annually**. This does not advertise a monthly payment plan.

Videos play silently when visible and pause offscreen. Seven carousels provide automatic rotation, progress indicators and manual controls. Motion pauses for interaction and respects reduced-motion preferences and the shared pause controls.

## Release status

This repository publishes the preview source. It does not establish commercial release readiness. Unconfirmed destinations open distinct information panels; no account creation, booking, payment or form submission is simulated as successful. `ORB_PUBLIC_BUILD=1 npm run build` intentionally fails until product claims, destinations, integrations and commercial details are approved. See `HANDOFF.md`.

Local review screenshots, full Figma exports and unused original graphics are excluded. Earlier design notes are retained under `docs/archive` for historical context. Existing `.openai/hosting.json` is preserved; this source update does not perform a deployment.
