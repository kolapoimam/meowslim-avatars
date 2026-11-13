# Meowslim Avatars

**An original, culturally thoughtful Muslim avatar studio and HTTP API**, with a DiceBear-inspired user experience (seed, editor, URL API, downloadable SVG and PNG). All artwork and UI are independently implemented for Meowslim.

## Features

- **Working avatar studio:** live preview, face, covering, colors, expressions, beard, glasses, outfit, backgrounds, patterns and more.
- **Inclusive covering categories:** hijab, khimar, niqab, burqa, kufi, turban, tagelmust and no covering. Head covering choices are grouped by gender for a coherent starting point.
- **Deterministic:** the same seed and settings always render the same SVG. Random seeds are optional; explicit options override seeded defaults.
- **Real export:** PNG at 256 / 512 / 1024 / 2048 pixels; crisp SVG download. Both work entirely in browser.
- **HTTP API:** SVG and raster PNG produced by the same shared rendering engine; CORS enabled.
- **Original code-drawn assets:** layered SVG paths rendered to reusable transparent PNG samples by Sharp, in `public/assets`.
- **Vercel-ready:** Vite static frontend plus serverless API endpoints.
- **No user account, tracking, storage, or paid API dependencies.**

## Get started

Requires Node.js 20+.

```sh
npm install
npm run dev
```

Open the local Vite URL. For the API locally, run `npx vercel dev` (requires the Vercel CLI) or deploy to Vercel. Vite's local server runs the UI only, not the Vercel functions.

```sh
npm run test
npm run assets
npm run build
```

## Deploy to Vercel

Import `kolapoimam/meowslim-avatars` in Vercel. Framework: **Vite**. Build command: `npm run build`, output directory: `dist`. No environment variables are required. Vercel automatically deploys the `api/` functions as Node.js serverless functions.

## API

SVG:

`GET /api/avatar.svg?seed=Amina&gender=female&covering=hijab&fabricColor=%23276D5C`

PNG:

`GET /api/avatar.png?seed=Yusuf&gender=male&covering=turban&size=512`

Metadata:

`GET /api/options`

Both avatar endpoints accept: `seed`, `preset`, `gender`, `covering`, `hijabStyle`, `turbanStyle`, `kufiStyle`, `face`, `eyes`, `mouth`, `brows`, `beard`, `glasses`, `pattern`, `clothing`, `skinColor`, `fabricColor`, `backgroundColor`, `outfitColor`, `hairColor`, `eyeColor`, `transparent`, `flip`, and `size` (PNG only, 32–2048).

`size` must be an integer. Colors must be six-digit hex (URL-encode the `#`). Invalid enum options revert to deterministic defaults. Content is escaped and the SVG renderer only emits allowlisted shapes. Outputs may be cached for efficiency.

> **Privacy:** prefer random or opaque user IDs, not personal email addresses, for public URL seeds. Anyone seeing the URL can see its query parameters.

## PNG asset library

`npm run assets` creates 12 original, 512 × 512 transparent-background sample PNG characters under `public/assets/`, and `manifest.json`. These are actual renderable artwork assets, not AI-generated final illustration packs. Unlike incompatible sprite sheets, every part is drawn in the exact same 512 × 512 coordinate system. The engine directly composes vector paths for limitless coherent combinations; the sample PNGs can be used independently in other interfaces.

## Next art upgrade

The engine is deliberately modular: `src/avatar.js` contains individual cover, face, hair, eyes, mouth, beard, outfit, pattern and glasses layers. You can replace these layers with hand-drawn art or transparent ChatGPT-generated PNGs, provided all elements are aligned to the same 512 × 512 face anchor. For pixel-perfect PNG accessories, use separate transparent layers at the final canvas size rather than misaligned grid sprite cells.

## Credits

Original Meowslim artwork and implementation. DiceBear is a source of product UX inspiration only, not a source of copied code or illustration assets. This is an independent project and is not affiliated with DiceBear.
