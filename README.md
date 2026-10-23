# Orb homepage

A standalone responsive homepage design for Orb by Cureocity, using the supplied homepage copy and the approved hero direction. The site is plain HTML, CSS and browser JavaScript; it has no runtime framework or package dependencies.

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
- `parts/main.html`: hero, how it works, feature explorer, voice demo and connection selector.
- `parts/lower.html`: care, Blueprint, programmes, hubs, plans, guides, FAQs, privacy, final call to action and footer.
- `parts/foot.html`: shared detail dialog and closing document markup.
- `dist/styles.css`: shared styles and upper-page layouts.
- `dist/lower.css`: lower-page layouts.
- `dist/app.js`: browser-local interactions.
- `dist/config.js`: external destinations, pending real URLs.
- `build.mjs`: joins the four HTML parts into `dist/index.html`.
- `server.mjs`: local static preview server.

Edit the HTML parts rather than the generated `dist/index.html`.

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

The navigation, six-feature explorer, FAQ disclosures, dialogs, conversation replay, voice-entry review and information selector operate locally in the browser. The voice demo uses the supplied example text; it does not request microphone access, call an AI service or save a workout. The information selector does not connect a device, upload reports or store health information. Device compatibility is explicitly unconfirmed until a supported-integration mapping is provided.

Product examples and hub illustrations are labelled as illustrative. App availability, professional services, integrations and clinical workflows have not been validated by this design preview. Fonts load from Google Fonts, with system fallbacks if unavailable.

## Deployment boundary

This directory is separate from the Cureocity Mind clinical application checkout. The `.openai/hosting.json` manifest identifies this standalone Sites project. Running `build`, `check` or `dev` does not deploy it, publish changes to the clinical application, run migrations or alter clinical data.

Sites publication is a separate operation performed against the exact checked source version. Store-link configuration, private preview deployment and any later public launch are distinct steps.
