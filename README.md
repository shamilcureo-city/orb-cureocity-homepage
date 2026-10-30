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
- `parts/voice.html`, `voice.js`, `voice.css`: real browser speech trial, timer, transcript and editable workout entry.
- `styles.css`, `features.css`, `lower.css`, `carousel.css`, `motion.css`: responsive layout and motion.
- `site-content.json`: shared pricing, plan definitions, destination configuration and synthetic example data.
- `website-copy.json`: shared hero and final-action copy.
- `assets/`: supplied artwork, original Figma exports and selected derivatives; the build copies only referenced media. See `ASSETS.md`.
- `dist/`: generated website, included for static preview hosting.

The user-approved preview price is **₹7,999/year**, equivalent to **₹666.58/month, billed annually**. This does not advertise a monthly payment plan.

Videos play silently when visible and pause offscreen. Carousels provide automatic rotation, progress indicators and labelled controls. Motion pauses for interaction and respects reduced-motion preferences and the footer pause control. The hero fills the viewport; only the navigation capsule stays fixed while the brand and Get Orb action scroll with the page.

The annotated correction release restores the supplied original app screens, the original Health Vault document animation, a permanently redacted original report, and original Pro icon exports. The doctor portrait is reframed and its original Figma quotation restored.

The voice trial requests microphone access only after an intentional start action. Supported browsers provide up to 60 seconds of cumulative listening per page visit, a countdown, transcript and editable result. Speech recognition is handled by the browser and may use its speech provider. Orb does not upload audio or save the draft to an account. Unsupported browsers retain typed-entry and review controls.

## Release status

This repository publishes the preview source. It does not establish commercial release readiness. Unconfirmed destinations open distinct information panels; no account creation, booking, payment or form submission is simulated as successful. `ORB_PUBLIC_BUILD=1 npm run build` intentionally fails until product claims, destinations, integrations and commercial details are approved. See `HANDOFF.md`.

Local review screenshots, full Figma exports and unused original graphics are excluded. Earlier design notes are retained under `docs/archive` for historical context. Existing `.openai/hosting.json` identifies the hosted preview. Sharing access is controlled by Sites; `audience` in the content configuration is descriptive metadata.
