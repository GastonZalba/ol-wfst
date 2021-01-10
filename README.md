# OpenLayers WFST
This is a simple WFST-T client to edit, draw, delete and upload features directly on the Geoserver using OpenLayers. You can modify geometry and properties values.

## Install

### Browser

#### JS

Load `ol-wfst.js` after OpenLayers. Wfst is available as `Wfst`.

```HTML
<script src="https://unpkg.com/ol-wfst@1.0.0"></script>
```

#### CSS

```HTML
<link rel="stylesheet" href="https://unpkg.com/ol-wfst@1.0.0/dist/ol-wfst.css" />
```

### Parcel, Webpack, etc.

NPM package: [ol-wfst](https://www.npmjs.com/package/ol-wfst).

#### JS

Install the package via `npm`

    npm install ol-wfst --save-dev

#### CSS

The CSS file `ol-wfst.css` can be found in `./node_modules/ol-wfst/dist`

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for Wfst Options.

## API