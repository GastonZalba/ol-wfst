# AGENTS.md

## Project

`ol-wfst` (v4.4.0) is a Tiny WFS-T client for GeoServer built on top of OpenLayers. It lets you view, edit and insert features against a geoserver using WFS-T transactions, with a small UI (toolbar, layers control, edit fields modal, edit geometry overlay).

- Written in TypeScript + JSX compiled through the automatic JSX runtime `src/jsx-runtime.ts`, NOT React.
- Exports: `Wfst` (default class) plus `WfsLayer`, `WmsLayer`, `Geoserver` attached to it (see `src/index-umd.ts`).
- Peer dependencies: `ol >= 5.0.0`, `modal-vanilla`, and a bootstrap 5 build variant.
- Source comments/JSDoc are in English. UI strings are i18n'd (es/en/zh, default `en`).
- README is generated from JSDoc via `documentation.js` (`npm run doc`).

## IMPORTANT: only edit `src/`

**`lib/` and `dist/` are generated build outputs — never edit or read them for reference. They are recreated by `npm run build`.** Always work from `src/` and, when you change `src/`, run the build so example/demo and bundles stay in sync.

### Source layout (`src/`)

| Path | Purpose |
|---|---|
| `ol-wfst.ts` | Main `Wfst` class: `Options` interface, defaults, map element creation, controls (upload/draw/select/fullscreen...), `_createMapElements()`. |
| `Geoserver.ts` | GeoServer client (WFS capabilities, DescribeFeatureType, WFS-T transactions, lock feature). |
| `WfsLayer.ts`, `WmsLayer.ts` | Layers built with `Mixin(BaseLayer, VectorLayer / ImageLayer)` from `ts-mixer`; typed `declare on/once` overloads. |
| `defaults.ts` | `getDefaultOptions()` (default language `en`). |
| `@types.ts` | Shared interfaces (`IOptions`-like `Options`, `IWfstLayersList`, `I18n`, ...) named with `I` prefix. |
| `@enums.ts` | Enums (`GeometryType`, `TransactionType`, ...). |
| `custom.d.ts` | Ambient declarations for `*.svg` and `*.scss` modules. |
| `jsx-runtime.ts` | The JSX runtime (`jsx`, `jsxs`, `Fragment`). See #JSX below. |
| `index-umd.ts` | UMD entry that attaches `WfsLayer`, `WmsLayer`, `Geoserver` to `Wfst`. |
| `modules/` | `.tsx` = UI components using JSX (`LayersControl.tsx`, `EditOverlay.tsx`, `EditFieldsModal.tsx`, `EditControlChanges.tsx`); `.ts` = helpers (`state.ts`, `errors.ts`, `loading.ts`, `helpers.ts`, `editLayer.ts`, `Uploads.ts`, `styleFunction.ts`, `base/WfsSource.ts`, `base/WmsSource.ts`, `base/BaseLayer.ts`). |
| `modules/i18n/` | `es.ts`, `en.ts`, `zh.ts` translations + `index.ts` (`setLang()`, `I18N_()` for `{}` placeholders). |
| `assets/images/` | SVG icons (see #Icons below). |
| `assets/scss/` | `ol-wfst.scss` (main styles), `_variables.scss` (variables), `-ol-wfst.bootstrap5.scss` (bootstrap 5 variant bundle). |

Other: `examples/basic.{html,js}` (demo using `dist/ol-wfst.min.js` UMD + `ol` UMD), `index.html`, `rollup.config.js` (lib build), `rollup.config.dist.js` (dist/UMD build), `postcss.config.cjs`.

## Icons (CRITICAL)

- **Always use SVGs stored in `src/assets/images/`.** Never inline graphics another way.
- Import them: `import fullscreenSvg from '../assets/images/fullscreen.svg';`
- The imports resolve to a **function that returns the SVG DOM element**. Both builds (`rollup.config.js` and `rollup.config.dist.js`) use `rollup-plugin-svg-import` (`svg()`), which inlines the SVG and returns a function that does `new DOMParser().parseFromString(...).firstChild`. Use them by calling:
  - `{icono()}` as a JSX child (see `EditOverlay.tsx`),
  - `element.appendChild(icono())`,
  - or pass the returned element directly to an option that accepts elements (e.g. OL `FullScreen` `label` / `labelActive`).
- **Never do** `const img = document.createElement('img'); img.src = icono;` — the import is a function, not a string/URI; assigning it to `src` breaks the image.
- Keep icons Material-style 24×24 (`viewBox="0 0 24 24"`), default `fill` black (no fill attribute, same as the other icons: `select`, `upload`, `draw`, `visibilityOn/Off`, etc.).
- Size/color via CSS in `src/assets/scss/ol-wfst.scss`: `.ol-wfst--... svg { width: ...; height: ...; }` and reuse the Sass variables from `_variables.scss` (`$btnBack`, `$btnHover`, `$borderRadius`).

## JSX

- `tsconfig.json` sets `"jsx": "react-jsx"` with `"jsxImportSource": "src"` — JSX compiles through the automatic runtime, emitting `import { jsx, jsxs, Fragment } from "src/jsx-runtime"` as needed.
- **Do NOT import React**, and do **not** add manual pragma imports in `.tsx` files — the runtime import is automatic. `.tsx` files still import their own SVGs, OL classes and helpers.
- The runtime (`src/jsx-runtime.ts`) supports: regular tag names, `on*` listeners (functions), `className`, `htmlFor`, the `fragment` tag / `Fragment`, any attribute set as a string, and children as elements, arrays, or strings (`props.children`).
- **Fragments (`<>`/`</>`) are not supported** — the runtime `Fragment` signature is `Fragment(type, children)`, not the React-style `Fragment({ children })`. Use plain wrapper elements (e.g. `<div>`) instead.

## Styling

- SCSS sources live in `src/assets/scss/`; both `ol-wfst.scss` and the `-ol-wfst.bootstrap5.scss` variant are compiled by the rollup/postcss pipeline into `dist/css/*.min.css`.
- Class naming: prefix `ol-wfst--` (`ol-wfst--edit-button`, `ol-wfst--tools-control`, `ol-wfst--fullscreen`, ...). No BEM suffixes required; keep it consistent with existing classes.
- Buttons: define `outline: 0`, `cursor: pointer`, sizing, and `:hover`/`:active` (hover uses `$btnHover`).

## Code conventions

- **Prettier**: tabWidth 4, singleQuote, trailingComma none, **endOfLine crlf**. Files are CRLF — match that.
- **ESLint** (`.eslintrc`): `@typescript-eslint/recommended`; `no-explicit-any` off; `ban-ts-comment` off; `no-unused-vars` = error with `argsIgnorePattern: '^_'`.
- Classes PascalCase; private/protected members prefixed with `_` (`this._options`, `_createMapElements()`).
- OL integration: import from `ol/...` with the `.js` suffix (ES modules) e.g. `import FullScreen from 'ol/control/FullScreen.js';`; `import { Mixin } from 'ts-mixer';` for layered classes; layer properties stored via OL Object `get`/`set` keyed by the `BaseLayerProperty` enum (`modules/base/BaseLayer.ts`); events fired with `dispatchEvent(...)` (e.g. `change:capabilities`, `layerRendered`) and typed with `declare on`/`once` overloads in `WfsLayer.ts`/`WmsLayer.ts`.
- Public methods get JSDoc (`@public`, `@param`, `@returns`, `@fires`, `@extends {ol/...}`) — this is what generates the README.
- **i18n**: every new UI string must be added to `I18n.labels` in `src/@types.ts` (optional prop) AND to the three files `es.ts`, `en.ts`, `zh.ts`. Default language is `en` (`DEFAULT_LANGUAGE` in `defaults.ts`); use `I18N_('key', arg)` when the string has a `{}` placeholder.

## Build & verification

```sh
npm run lint    # eslint src/*.ts + prettier --check src
npm run build   # lint + rollup -> dist/ol-wfst.js, dist/ol-wfst.min.js, dist/css/*.min.css, lib/ol-wfst.js
npm run doc     # documentation.js regenerates README.md
```

- Run `npm run lint` and `npm run build` after every change; both must pass.
- Known/pre-existing build warnings — do NOT "fix" them:
  - "Circular dependency" between `src/ol-wfst.ts` and `src/modules/LayersControl.tsx`.
  - Sass deprecation warnings (node-sass).
- `npm run doc` regenerates `README.md` — with the current prettier/docs versions it introduces massive formatting noise. Prefer small hand-made edits to README; if you do run `npm run doc`, remember it will rewrite the whole file.
- There is no automated test suite (`TODO tests` in README).

## Git

- Do NOT commit unless explicitly asked. The working tree may already contain unrelated local changes (e.g. regenerated `dist/`/`lib/`); leave them untouched.