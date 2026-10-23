# Orb homepage

A standalone Orb-only product website. The sales journey is download Orb, then compare plans and subscribe inside the app. This is separate from the Cureocity Mind application.

## Current experience

The homepage retains the original compact navy-to-white hero, clear HTML conversation in the original handset, and two restrained supporting illustrations. The new page order is:

1. Benefit-led hero with Download Orb and a conversation demonstration.
2. Four visitor-controlled moments in a day with Orb.
3. Meal and workout planning, plus a voice logging example.
4. Health context with report, recovery, cycle and glucose explanations.
5. Permission-based family sharing and eligible-plan professional follow-up.
6. Three getting-started steps, with wearable optional.
7. One Orb plan overview, with plan selection inside the app.
8. FAQs, final download action and compact Orb footer.

Broader Cureocity care programmes, Blueprint, hubs, guide cards and the unverified device selector are excluded from this sales page. Earlier fragments are retained as source references but are not included by the build.

## Run and build

Use Node.js 20 or newer:

```sh
npm run build
npm run check
npm run dev
```

Preview: http://127.0.0.1:4178. `build.mjs` assembles the HTML fragments into `dist/index.html`. CSS and JavaScript are served directly from `dist/`. The check script verifies JavaScript syntax; browser checks verify layout and interactions separately.

## Active source

- `parts/head.html`: metadata, navigation, shared icons and style/script references.
- `parts/main.html`: original compact hero with the new sales copy.
- `parts/sales-day.html`, `dist/sales-day.css`, `dist/sales-day.js`: progressive-enhancement day tabs, keyboard controls and illustrative examples.
- `parts/sales-features.html`: nutrition, fitness, voice demo and health context.
- `parts/sales-lower.html`, `dist/sales-lower.css`: support, onboarding, plan overview, FAQs and footer.
- `parts/foot.html`: accessible preview/download dialogs and mobile download bar.
- `dist/sales.css`: common sales layout, product compositions, responsive rules and hero refinements.
- `dist/sales.js`: context illustrations and the mobile download bar.
- `dist/app.js`: navigation, conversation replay, voice entry review and configured destinations. Earlier selector/guide logic is inert when those elements are absent.
- `dist/motion.js`: finite hero entrance and connector/wave sequence, with reduced-motion and hidden-tab cancellation.
- Original styles remain for the established hero, dialogs and reusable controls; sales styles load after them.

## Original artwork and delivery

Original PNG/JPEG files remain unchanged in `assets/figma-originals/` and `dist/assets/`. The active page serves WebP derivatives in `dist/assets/web/`; these are lossless encodings of native or appropriately sized source pixels. The nine selected assets are 65.7% smaller in aggregate. Report/cycle phones are 700px wide for high-density delivery; other phone art retains native dimensions. Full details and provenance are in `ASSETS.md` and the generated image manifest.

The hero phone remains 350px wide on desktop, 300px on mobile and 280px on narrow screens. The conversation is HTML above the original handset to keep its text sharp.

## Interactions and content boundaries

Day tabs support arrows, Home and End; all examples remain readable without JavaScript. Native FAQ disclosures and health-tool explanations remain usable without animation. Context scenes and day changes animate only after a visitor action. All motion respects reduced-motion settings. The mobile download bar appears after the hero and hides at the final download section.

Product examples are illustrative. Voice logging never requests microphone access or saves a workout. The page does not connect devices, collect health information, provide live AI responses or process subscriptions. PDF-described family/professional features are presented with plan and availability qualifications. No prices, trials, user numbers or testimonials are invented.

## Pending live destinations

The user deferred App Store and Google Play URLs. Both remain null in `dist/config.js`; download buttons show an honest store-selection preview with disabled unavailable destinations. Once approved HTTPS store links are added, the existing controls link to them. The website does not add a separate checkout because plans are selected inside Orb.

Privacy, terms and data-request destinations have not been supplied. Their dialogs explicitly state that the full destination is not yet connected. Real plan pricing, exact inclusions, integration compatibility and product availability require confirmation before a public sales launch.

## Hosting

`.openai/hosting.json` retains the existing Sites project and static `dist` output. Publication is a separate Sites operation, with existing private audience preserved. Local build/browser verification does not establish app availability, purchase success or clinical readiness.
