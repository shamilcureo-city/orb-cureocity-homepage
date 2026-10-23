# Orb homepage

A standalone responsive homepage for Orb by Cureocity, using the supplied homepage copy and implementing the original Figma design from its browser-visible reference. The user approved this browser-reference rebuild. Original image assets and frame exports were subsequently obtained through Figma's browser inspector: the brand lockup, hero background and handset, six feature phones, voice orb, device-brand panel, Blueprint, programme artwork, gym and guide imagery now come from the supplied design. The original hero handset is displayed untouched. The user's revised illustrative conversation opens in an accessible modal through See Orb in Action.

The design follows the reference’s dark navy-to-white hero, centered handset, visible phone feature cards, black pill buttons and pale-blue-to-navy ending. The site is plain HTML, CSS and browser JavaScript; it has no runtime framework or package dependencies.

## Run locally

Use Node.js 20 or newer from this directory:

```sh
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4178`. Stop the local server with Ctrl+C. Build again after editing an HTML part; CSS, JavaScript and configuration are served directly from `dist/`.

`npm run check` checks JavaScript syntax. It does not replace browser checks of layout, keyboard operation or links.

## Source structure

- `parts/head.html`: document metadata, shared SVG icons, header and navigation.
- `parts/main.html`: hero, how it works and connection selector.
- `parts/guides.html`: guide cards and their horizontal navigation.
- `parts/features.html`: four visible product cards for reports, cycle tracking, meal logging and the daily view.
- `parts/devices.html`: original supported-device brand panel and link to the connection selector.
- `parts/voice.html`: illustrative voice workout logging demo.
- `parts/planning.html`: visible meal planning and workout planning cards.
- `parts/lower.html`: care, Blueprint, programmes, plans, FAQs, privacy, hubs, final call to action and footer.
- `parts/foot.html`: shared detail dialog and closing document markup.
- `dist/styles.css`: shared styles and upper-page layouts.
- `dist/features.css`: original phone artwork and layouts for all six visible product cards.
- `dist/lower.css`: lower-page layouts.
- `dist/app.js`: browser-local interactions.
- `dist/config.js`: external destinations, pending real URLs.
- `dist/fidelity*.css`: measured composition adjustments from the uploaded desktop reference.
- `dist/motion.css` and `dist/motion.js`: finite image entrances, Orb response, interaction feedback, and continuous ending-background alignment.
- `assets/figma-originals/`: the 17 exact PNG/JPEG downloads and exports from Figma, preserved unchanged.
- `assets/gym.png` and `assets/blueprint.png`: superseded generated replacements retained for provenance.
- `dist/assets/`: the 17 untouched original PNG/JPEG images and original logo SVG used by the homepage.
- `ASSETS.md`: original Figma source nodes, inspected asset dimensions, provenance, illustrative-use notes and superseded generation prompts.
- `build.mjs`: joins the nine HTML parts, in the order listed above, into `dist/index.html`.
- `server.mjs`: local static preview server.

Edit the HTML parts rather than the generated `dist/index.html`. The build joins HTML only; `dist/assets/` contains the images the preview serves. Preserve the untouched originals in both `assets/figma-originals/` and `dist/assets/`. This version serves the full original PNG/JPEG files at the user's request for clarity, without lossy conversion or resizing. These raster assets total 49,922,172 bytes; below-fold product imagery uses lazy loading. The source hero phone is 390 × 794 pixels, so displaying it at the original Figma size cannot create additional source detail. Image provenance is recorded in [ASSETS.md](ASSETS.md).

## Add live destinations later

The user deferred App Store, Google Play and enquiry URLs. They remain `null` in `dist/config.js`:

```js
window.ORB_CONFIG = {
  appStoreUrl: null,
  googlePlayUrl: null,
  enquiryUrl: null
};
```

Replace these values with the approved HTTPS destinations when available. Until then, download and enquiry controls clearly identify their unavailable destinations in the preview. Full guide, plan, service and policy pages are not supplied; their controls open explanatory preview dialogs rather than invented URLs or documents.

## Illustrative interactions

The navigation, guide-card rail, FAQ disclosures, dialogs, conversation replay, voice-entry review and information selector operate locally in the browser. The original handset settles once, product phones reveal once as they enter view, and the coral Orb performs a short breathing animation. Effects finish at the original layout positions, cancel when the tab is hidden, and respect changes to reduced-motion preferences. No animation hides content or intercepts scrolling. All six product cards are visible; there is no feature tab switcher. Their phone screens use illustrative artwork from the original design, while the Explore buttons open preview details. The voice demo uses the supplied example text; it does not request microphone access, call an AI service or save a workout. The information selector does not connect a device, upload reports or store health information. Device compatibility is explicitly unconfirmed until a supported-integration mapping is provided; the original device-brand panel is design artwork, not an independently verified compatibility list.

Product examples and hub illustrations are labelled as illustrative. The gym image is now the original source artwork from Figma; its location has not been verified as an actual Cureocity facility. App availability, professional services, integrations and clinical workflows have not been validated by this design preview. Fonts load from Google Fonts, with system fallbacks if unavailable.

## Deployment boundary

This directory is separate from the Cureocity Mind clinical application checkout. The `.openai/hosting.json` manifest identifies this standalone Sites project. Running `build`, `check` or `dev` does not deploy it, publish changes to the clinical application, run migrations or alter clinical data.

Sites publication is a separate operation performed against the exact checked source version. Store-link configuration, private preview deployment and any later public launch are distinct steps.
