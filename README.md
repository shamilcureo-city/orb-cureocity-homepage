# Orb connected-care homepage

A standalone, owner-private website concept based on **Cureocity_Orb_Product_and_Website_Brief.pdf**. The page sells Orb as the member-facing daily app in a connected-care journey: understand, plan, act, review and adapt. The conversion path is Get Orb → download → choose a plan in the app. This project is separate from the Cureocity Mind clinical application.

## Current experience

1. Original compact navy-to-white hero, original handset and sharp daily-view HTML.
2. Records, everyday context and agreed guidance brought into one picture.
3. Understand → Plan → Act & review feedback loop.
4. Three interactive day views: plan the day, understand a change, prepare for review.
5. Health Vault original/verification/share/revoke demonstration.
6. Meal and workout plans with original product artwork, distinct logging and feedback.
7. Dated insight graphics showing source, sync time, partial, absent and historical data.
8. App-led, professional online and hybrid care routes; distinct professional roles and coach coordination. Blueprint and hubs remain optional.
9. Explicitly illustrative Family Circle invitation, selected summaries and revocation.
10. Trust, in-app plan selection, FAQs and final Get Orb action.

Wearables are one source of context. No claim of competitor inferiority or exclusive functionality is made. The earlier broad ecosystem and wearable-first fragments are retained as historical source but are not assembled into the current page.

## Build and preview

```sh
npm run build
npm run check
npm run dev
```

Node 20+; local preview http://127.0.0.1:4178. `build.mjs` assembles HTML and generates public `dist/config.js` from `site-content.json`. CSS/JS/assets are served from `dist`. Syntax checks do not replace browser checks.

## Active files

- `parts/head.html`: metadata, navigation, icons and imports.
- `parts/main.html`: original hero and new daily view.
- `parts/journey-story.html`, `dist/journey-story.css/js`: context, loop, daily tabs.
- `parts/journey-features.html`, `dist/journey-features.css/js`: records, food/movement, insight states.
- `parts/journey-care.html`, `dist/journey-care.css/js`: care modes, permission demo, trust, plans, FAQs, footer.
- `parts/foot.html`: shared honest destination dialog and mobile Get Orb bar.
- `dist/journey.css/js`: hero refinements, sticky CTA and configured policy destinations.
- `dist/app.js`: shared modal, destination and navigation handling; unused legacy handlers are inert.
- `dist/motion.js/css`: finite original hero/source animation with reduced-motion and visibility handling.
- Earlier base styles remain loaded for the established hero, dialogs and shared layout.

## Original assets

Original PNG/JPEG/SVG files are unchanged. Separate WebP derivatives retain source artwork at suitable web sizes. The hero handset is 350px desktop, 300px mobile, 280px narrow. New daily-screen text is HTML so it remains sharp. Original meal-plan, mobility-check, gradient, logo and coral Orb artwork are used. See `ASSETS.md` and image manifest for provenance. Other earlier assets remain preserved but unused.

## Interaction boundaries

All demonstrations are local and fictional. This website does not connect to health sources, upload records, share information, book appointments, run live AI or process subscriptions. No data is saved or transmitted by demo controls. Record verification is a visible simulated state. Family sharing needs an explicit sample selection and revocation clears that preview. Missing data is not scored as zero or portrayed as good health. No clinical or product release validation is implied.

Day and care tabs support keyboard arrows, Home and End. All day panels remain available without JavaScript. Native disclosures work without script. Motion is finite; reduced motion and hidden-tab state are respected. The mobile CTA appears below the hero and hides near the final conversion section.

## Product status and destinations

`site-content.json` records source, availability, markets, eligibility, prerequisites, CTA and claim approval for each featured concept. Current features are unverified because the brief is not release evidence. `mode: design-preview` builds the reviewable private concept, visibly qualified on the page. A public build (`ORB_PUBLIC_BUILD=1`) fails until included feature releases/claims and essential destinations are confirmed. This is a source safeguard, not a replacement for the host's audience controls or product review.

Store URLs were deferred by the user. App Store, Google Play and enquiry URLs remain null. Download buttons open the existing honest selection dialog and do not redirect to invented destinations. Policy, terms, support, data-request and professional destinations are also pending. Add approved HTTPS URLs to `site-content.json`, rebuild and verify the complete journey before public use.

## Hosting

The existing Sites project is retained in `.openai/hosting.json`. Publish the exact pushed source and matching static archive through Sites, preserving owner-private access. Website publication does not establish app release, paid conversion, clinical safety or availability of professional services.
