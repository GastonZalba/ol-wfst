# AGENTS.md

## Project

`ol-wfst` (v5.1.0) is a Tiny WFS-T client for GeoServer built on top of OpenLayers. It lets you view, edit and insert features against a geoserver using WFS-T transactions, with a small UI: toolbar with layers control, feature selection (single/box/freehand), draw mode, query/info tool, CQL filters per layer, uploads (GeoJSON/KML/WFS), edit fields modal (form + table mode for multi-edit), edit geometry overlay (move/extend lines), fullscreen and an apply/cancel/delete changes bar.

- Written in TypeScript + JSX compiled through the automatic JSX runtime `src/jsx-runtime.ts`, NOT React.
- Exports: `Wfst` (default class) plus `WfsLayer`, `WmsLayer`, `Geoserver` attached to it (see `src/index-umd.ts`).
- Peer dependencies: `ol >= 5.0.0` and `tiny-popup-menu` (layer "More" menu). Modals use `tiny-modal-dialog` (a regular dependency: bundled into the dist UMD build, external in the lib build). No Bootstrap.
- Source comments/JSDoc are in English. UI strings are i18n'd (es/en/zh, default `en`).
- README is generated from JSDoc via `documentation.js` (`npm run doc`).
- See [ARCHITECTURE.md](ARCHITECTURE.md) for how the pieces fit together (entry points, data flows, state, events). This file covers conventions and how to work; that one covers why the code is shaped the way it is.

## IMPORTANT: only edit `src/`

**`lib/` and `dist/` are generated build outputs — never edit or read them for reference. They are recreated by `npm run build`.** Always work from `src/` and, when you change `src/`, run the build so example/demo and bundles stay in sync.

### Source layout (`src/`)

| Path                         | Purpose                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ol-wfst.ts`                 | Main `Wfst` class: `Options` interface, defaults, map element creation, controls (upload/draw/select/fullscreen...), `_createMapElements()`.                                                                                                                                                                                                                                                     |
| `Geoserver.ts`               | GeoServer client (WFS capabilities, DescribeFeatureType, WFS-T transactions, lock feature).                                                                                                                                                                                                                                                                                                      |
| `WfsLayer.ts`, `WmsLayer.ts` | Layers built with `Mixin(BaseLayer, VectorLayer / TileLayer)` from `ts-mixer`; typed `declare on/once` overloads. `WfsLayer` uses a `WfsSource` (VectorSource), `WmsLayer` a `WmsSource` (TileWMS) and re-queries WFS for precise geometries.                                                                                                                                                    |
| `defaults.ts`                | `getDefaultOptions()` (default language `en`).                                                                                                                                                                                                                                                                                                                                                   |
| `@types.ts`                  | Shared interfaces (`IWfstLayersList`, `IGeoserverDescribeFeatureType`, `I18n`, `IGeoserverOptions`, ...) named with `I` prefix. `Options`/`LayerOptions` themselves live in `ol-wfst.ts`.                                                                                                                                                                                                        |
| `@enums.ts`                  | Enums (`GeometryType`, `TransactionType`).                                                                                                                                                                                                                                                                                                                                                       |
| `custom.d.ts`                | Ambient declarations for `*.svg` and `*.scss` modules.                                                                                                                                                                                                                                                                                                                                           |
| `jsx-runtime.ts`             | The JSX runtime (`jsx`, `jsxs`, `Fragment`). See #JSX below.                                                                                                                                                                                                                                                                                                                                     |
| `index-umd.ts`               | UMD entry that attaches `WfsLayer`, `WmsLayer`, `Geoserver` to `Wfst`.                                                                                                                                                                                                                                                                                                                           |
| `modules/`                   | `.tsx` = UI components using JSX (`LayersControl.tsx`, `EditOverlay.tsx`, `EditFieldsModal.tsx`, `EditControlChanges.tsx`, `QueryOverlay.tsx`, `FilterCqlModal.tsx`, `ExtendLineOverlay.tsx`); `.ts` = helpers (`state.ts`, `errors.ts`, `loading.ts`, `helpers.ts`, `editLayer.ts`, `Uploads.ts`, `styleFunction.ts`, `cql.ts`, `base/WfsSource.ts`, `base/WmsSource.ts`, `base/BaseLayer.ts`). |
| `modules/i18n/`              | `es.ts`, `en.ts`, `zh.ts` translations + `index.ts` (`setLang()`, `I18N_()` for `{}` placeholders).                                                                                                                                                                                                                                                                                              |
| `assets/images/`             | SVG icons (see #Icons below).                                                                                                                                                                                                                                                                                                                                                                    |
| `assets/scss/`               | `ol-wfst.scss` (main styles; inlines `tiny-modal-dialog` css via `@use '~tiny-modal-dialog/dist/modal.css'`), `_variables.scss` (variables).                                                                                                                                                                                                                                                |

Other: `examples/basic.{html,js}` (demo using `dist/ol-wfst.min.js` UMD + `ol` UMD) + `examples/reset.css`, `CHANGELOG.md`, `rollup.config.js` (lib build), `rollup.config.dist.js` (dist/UMD build), `postcss.config.cjs`, `scripts/external-links.js` (post-processes README links after `npm run doc`).

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
- The runtime (`src/jsx-runtime.ts`) supports: regular tag names, function tags (components, called as `props` + positional `children`; `props.children` carries the normalized array), `on*` listeners, `className`, `htmlFor`, `fragment` tag / `Fragment` / `<>...</>`, and children as elements, nested arrays, strings, numbers, `null`/`undefined`/booleans (the last two are skipped).
- Children strings/numbers are inserted as **text nodes** (never `innerHTML`) — safe against HTML in server-provided data (feature attributes, layer labels).
- **JSX is typed**: `src/jsx-runtime.ts` exports a `JSX` namespace (`IntrinsicElements`, `HTMLAttributes`, `Element`). Typos fail `tsc` (e.g. `class=` → use `className`). Adding a new tag or prop means extending those interfaces — that friction is intentional. `JSX.Element` is typed as `HTMLElement`; fragments are really `DocumentFragment`, so use them as children, never as the root passed to an OL control/overlay option.

## Styling

- SCSS sources live in `src/assets/scss/`; `ol-wfst.scss` is compiled by the rollup/postcss pipeline into `dist/css/*.min.css` (it inlines the `tiny-modal-dialog` stylesheet, so no extra css link is needed for modals).
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
npm run lint    # eslint "src/**/*.{ts,tsx}" + prettier --check src
npm run format  # eslint --fix "src/**/*.{ts,tsx}" + prettier --write src
npm run build   # lint + rollup -> dist/ol-wfst.js, dist/ol-wfst.min.js, dist/css/*.min.css, lib/ol-wfst.js
npm run watch   # rollup -w dist build (dev, no minify, livereload on localhost:3000)
npm run doc     # documentation.js regenerates README.md
```

- Run `npm run lint` and `npm run build` after every change; both must pass.
- `npm run lint` covers **all** `.ts`/`.tsx` under `src/` (eslint) plus formatting of the whole `src/` tree (prettier). Type-level errors (`tsc`) are surfaced by the build via rollup; you can also run `npx tsc --noEmit` for a fast check.
- Known/pre-existing build warnings — do NOT "fix" them:
    - Sass deprecation warnings (dart-sass `sass` package legacy API + `darken()`/`lighten()` global builtins in `_variables.scss`).
- `npm run doc` regenerates `README.md` — with the current prettier/docs versions it introduces massive formatting noise. Prefer small hand-made edits to README; if you do run `npm run doc`, remember it will rewrite the whole file.
- There is no automated test suite (`TODO tests` in README).

## Git

- Do NOT commit unless explicitly asked. The working tree may already contain unrelated local changes (e.g. regenerated `dist/`/`lib/`); leave them untouched.
