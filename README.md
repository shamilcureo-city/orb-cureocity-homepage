# Orb comprehensive homepage

A standalone, owner-private website concept based on **Cureocity_Orb_Product_and_Website_Brief.pdf**, separate from Cureocity Mind. The page makes the breadth of Orb visible through original product artwork, readable interface illustrations and practical examples. Conversion remains Get Orb → download → choose a subscription in the app.

## Current experience — v12

1. Original navy-to-white hero, three original handset images, sharp Orb Intelligence and daily-plan previews.
2. Eight-feature navigation and four visitor-priority paths: understand my day, make food work, build fitness and connected care.
3. Detailed nutrition planning, meal logging and weekly feedback, with familiar-food and preparation-time examples.
4. Workout planning, movement assessment, session logging and a finite voice-log demonstration.
5. A visible Health Vault: originals, review of extracted information, history and permission-based sharing.
6. Interactive sleep/recovery, activity/stress, health-trend and glucose illustrations, with sources, dates, gaps and interpretation boundaries.
7. Original cycle-tracking handset, coherent date overlays and a personal journal illustration.
8. A three-stage interactive week: plan, adapt an office lunch, carry feedback forward.
9. Optional connected care, distinct professional roles, app-led/online/hybrid routes, Blueprint and consent-based Family Circle.
10. Original wearable/lifestyle photography, a no-wearable path, sharing and AI boundaries.
11. Confirmed annual offer: ₹7,500/year; ₹625 monthly equivalent, billed annually. Professional care is separate. Ten FAQs and comprehensive footer navigation.

Final app inclusions and released features remain unconfirmed. No competitor exclusivity, clinical outcomes, fabricated testimonials, trial, discount or automatic treatment changes are claimed. Bevel's official website was reviewed for breadth and product visibility; its assets, copy and customer proof were not reused.

## Build and preview

```sh
npm run build
npm run check
npm run dev
```

Node 20+; local preview http://127.0.0.1:4178. `build.mjs` assembles HTML and generates `dist/config.js` from `site-content.json`. Price slots are generated from the confirmed annual price. CSS/JS/assets are served from `dist`.

## Active files

- `parts/head.html`: metadata, navigation, icons and imports.
- `parts/main.html`: original hero with two sharp interface previews.
- `parts/complete-overview.html`, `dist/complete.css/js`: feature atlas, visitor priorities, responsive foundation and persistent navigation.
- `parts/complete-routine.html`, `dist/complete-routine.css/js`: nutrition, training and voice logging.
- `parts/complete-health.html`, `dist/complete-health.css/js`: records, contextual insights, cycle and journal.
- `parts/value-week.html`, `dist/value-week.css/js`: interactive practical week.
- `parts/complete-care.html`, `dist/complete-care.css/js`: care, assessments, family, connected information and trust.
- `parts/value-offer.html`, `dist/value-offer.css/js`: annual offer, FAQs, final action and footer.
- `parts/foot.html`: shared dialog and mobile Get Orb bar.
- `dist/journey.css/js`: daily-screen styles, sticky CTA and configured policy destinations.
- `dist/app.js`: destination dialogs and navigation. Unused legacy handlers remain inert.
- `dist/motion.css`: retained reduced-motion styling. Legacy base, fidelity and value-product files remain in source history but are no longer loaded.

## Original artwork

Original PNG/JPEG/SVG files are unchanged. Existing WebP derivatives preserve the supplied artwork at web-appropriate sizes. The centre hero handset is 320px desktop, 300px mobile and 280px on narrow phones. Hero content is sharp HTML. HTML overlays cover inconsistent legacy meal numbers and cycle dates without modifying the image files. The Health Vault uses an original HTML document illustration rather than the old clinical-score screenshot. See `ASSETS.md`.

## Interaction boundaries

All demonstrations are local and fictional. The website does not connect health sources, upload records, share information, book appointments, run live AI or process subscriptions. The office-lunch choice only changes the displayed example; the next-week proposal is a draft. The voice example does not use a microphone and confirms only an illustrative entry. No entered information is persisted or transmitted.

Tabs support keyboard arrows, Home and End. Feature panels stay visible without JavaScript, except the alternate hero view whose information is also presented elsewhere. Native disclosures work without script. Motion is finite and respects reduced-motion settings. The mobile Get Orb bar hides at the final download section. Persistent navigation provides shortcuts through the complete page.

## Release and destinations

The user confirmed ₹7,500/year on 24 October 2026. Final paid inclusions, release status, tax treatment, renewal and cancellation terms remain unconfirmed. `site-content.json` records feature release/claim status. Publishing this website concept does not verify the app's availability. `ORB_PUBLIC_BUILD=1` fails until featured claims and essential destinations are confirmed.

App Store and Google Play URLs were explicitly deferred. Download buttons therefore open a store-selection dialog with disabled unconfigured links. Enquiry, privacy, terms, support, data-request and professional URLs are also pending. Add approved HTTPS destinations, rebuild and verify the actual journey before public use.

## Hosting

The existing Sites identity remains in `.openai/hosting.json`. Publish exact pushed source with its matching static archive, preserving owner-private access. Browser QA verifies this website's layout and interactions, not app release, clinical effectiveness or paid conversion.
