# Orb sales homepage

A standalone, owner-private website concept based on **Cureocity_Orb_Product_and_Website_Brief.pdf**. It presents Orb through a practical weekly routine: make a plan, fit it into real life, and bring feedback into the next week. The conversion path is Get Orb → download → choose a subscription in the app. This project is separate from Cureocity Mind.

## Current experience

1. Original compact navy-to-white hero, original handset and sharp daily-plan HTML.
2. Confirmed annual offer: ₹7,500/year. ₹625 is a monthly equivalent, billed annually, not a separate monthly product.
3. A three-stage interactive week with familiar meals, three planned training days, an office-lunch choice and a next-week request.
4. Original meal/mobility product graphics with concrete everyday benefits.
5. Optional, separately arranged professional care: daily feedback → professional review → revised routine.
6. A clear annual offer, five purchase-objection FAQs and repeated Get Orb actions.
7. Health-record verification and permissions are available in an expandable supporting section.

The app's own planning, daily actions and progress story stand separately from professional care. No competitor exclusivity, clinical outcomes, testimonials, free trial, discounts or fabricated app entitlements are claimed. Earlier ecosystem, wearable-first and connected-care fragments are retained as historical source but are not assembled.

## Build and preview

```sh
npm run build
npm run check
npm run dev
```

Node 20+; local preview http://127.0.0.1:4178. `build.mjs` assembles HTML and generates `dist/config.js` from `site-content.json`. Prices in `data-orb-price` slots are generated from the annual price. CSS/JS/assets are served from `dist`.

## Active files

- `parts/head.html`: metadata, navigation, icons and imports.
- `parts/main.html`: original hero with a useful daily-plan example and annual price.
- `parts/value-week.html`, `dist/value-week.css/js`: interactive practical week.
- `parts/value-product.html`, `dist/value-product.css/js`: original product artwork, health context and optional professional care.
- `parts/value-offer.html`, `dist/value-offer.css/js`: annual offer, FAQs, final action and footer.
- `parts/foot.html`: shared destination dialog and mobile Get Orb bar.
- `dist/value.css`: hero sales refinements and sharp illustrative meal-plan overlay.
- `dist/journey.css/js`: compact hero screen, sticky CTA and configured policy destinations.
- `dist/app.js`: shared modal, destination and navigation handling; unused legacy handlers remain inert.
- `dist/motion.js/css`: finite hero/source/product animations with reduced-motion and visibility handling.
- Earlier base styles remain loaded for the established hero, dialogs and shared layout.

## Original assets

Original PNG/JPEG/SVG files are unchanged. Separate WebP derivatives retain source artwork at web-appropriate sizes. The hero handset is 350px desktop, 300px mobile, 280px narrow. Hero content is sharp HTML. The meal phone has an HTML overlay over inconsistent legacy numerical targets, retaining the original handset and meal choices. No raster artwork was regenerated or modified in this version. See `ASSETS.md` for provenance.

## Interaction boundaries

All demonstrations are local and fictional. This website does not connect health sources, upload records, share information, book appointments, run live AI or process subscriptions. The lunch choice changes only the displayed illustration. The next-week proposal is explicitly a draft. Professional plans are not automatically changed. No entered data is saved or transmitted.

Week tabs support arrow keys, Home and End. All week panels remain visible without JavaScript. Native disclosures remain functional without script. Motion is finite, respects reduced motion and stops when the tab is hidden. The mobile download bar appears below the hero and hides when the final download section enters view.

## Product status and destinations

The user confirmed ₹7,500/year on 24 October 2026. Final paid inclusions, release status, tax treatment, renewal and cancellation terms remain unconfirmed. `site-content.json` records feature release/claim status; publication of the website is not evidence of app availability. `mode: design-preview` builds the private concept. A public build (`ORB_PUBLIC_BUILD=1`) fails until featured release claims and essential destinations are confirmed.

App Store and Google Play URLs were deferred by the user and remain null. Download buttons open an honest store-selection dialog with disabled unconfigured links. Enquiry, privacy, terms, support, data-request and professional URLs are also pending. Add approved HTTPS destinations, rebuild and verify the actual user journey before public use.

## Hosting

The existing Sites project is retained in `.openai/hosting.json`. Publish exact pushed source with its matching static archive, preserving owner-private access. Website QA does not establish paid conversion, app release, clinical safety or professional-service availability.
