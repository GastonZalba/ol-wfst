# OpenLayers WFST
Very simple and small WFST-T client to insert (drawing or uploading), modify and delete features directly on GeoServers using OpenLayers. Layers with these types of geometry are supported: "GeometryCollection" (in this case, you can choose what geometry type to draw), "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon" and "MultiPolygon".

Tested with OpenLayers version 5 and 6.

<img src="screenshots/example-1.jpg" alt="Drawing" style="width:50%; float:left;">
<img src="screenshots/example-2.jpg" alt="Editing fields" style="width:50%; float:left;">

## Usage

```javascript
// Credentials, if necessary
var password = 123456;
var username = 'username';

var wfst = new Wfst(map, {
    geoServerUrl: 'http://localhost:8080/geoserver/myworkspace/ows',
    headers: { Authorization: 'Basic ' + btoa(username + ':' + password) },
    layers: [
        {
            name: 'myPointsLayer',
            label: 'Photos'
        },
        {
            name: 'myMultiGeometryLayer',
            label: 'Other elements'
        }
    ],
    layerMode: 'wfs',
    wfsStrategy: 'bbox',
    language: 'en',
    minZoom: 12,
    showUpload: true,
    beforeInsertFeature: function (feature) {
        feature.set('customProperty', 'customValue', true);
        return feature;
    }
});
```

## Some considerations

-   If your draws appear to be sligliy off after the draws, check the Number of Decimals in your Workplace. You may have to increment that.
-   You can configure a Basic Authentication with this client, but in some cases is recommended set that in an reverse proxy on the backend.

## Changelog

See [CHANGELOG](./CHANGELOG.md) for details of changes in each release.

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

The CSS file `ol-wfst.css` can be found in `./node_modules/ol-wfst/lib`

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for Wfst Options.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Wfst](#wfst)
    -   [Parameters](#parameters)
    -   [insertFeaturesTo](#insertfeaturesto)
        -   [Parameters](#parameters-1)
    -   [activateDrawMode](#activatedrawmode)
        -   [Parameters](#parameters-2)
    -   [activateEditMode](#activateeditmode)
        -   [Parameters](#parameters-3)
-   [Options](#options)
    -   [geoServerUrl](#geoserverurl)
    -   [headers](#headers)
    -   [layers](#layers)
    -   [layerMode](#layermode)
    -   [wfsStrategy](#wfsstrategy)
    -   [evtType](#evttype)
    -   [active](#active)
    -   [useLockFeature](#uselockfeature)
    -   [showControl](#showcontrol)
    -   [minZoom](#minzoom)
    -   [language](#language)
    -   [showUpload](#showupload)
    -   [uploadFormats](#uploadformats)
    -   [processUpload](#processupload)
        -   [Parameters](#parameters-4)
    -   [beforeInsertFeature](#beforeinsertfeature)
        -   [Parameters](#parameters-5)
-   [i18n](#i18n)
-   [LayerParams](#layerparams)

### Wfst

#### Parameters

-   `map` **class**
-   `opt_options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**

#### insertFeaturesTo

Add features to the geoserver, in a custom layer
witout verifiyn geometry and showing modal to confirm.

##### Parameters

-   `layerName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**
-   `features` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Feature>**

Returns **void**

#### activateDrawMode

Activate/deactivate the draw mode

##### Parameters

-   `layerName` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))**
-   `geomDrawTypeSelected` **GeometryType** (optional, default `null`)

Returns **void**

#### activateEditMode

Activate/desactivate the edit mode

##### Parameters

-   `bool` (optional, default `true`)

Returns **void**

### Options

**_[interface]_** - Wfst Options specified when creating a Wfst instance

Default values:

```javascript
{
 geoServerUrl: null,
 headers: {},
 layers: null,
 layerMode: 'wms',
 evtType: 'singleclick',
 active: true,
 showControl: true,
 useLockFeature: true,
 minZoom: 9,
 language: 'es',
 uploadFormats: '.geojson,.json,.kml'
 processUpload: null,
 beforeInsertFeature: null,
}
```

#### geoServerUrl

Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### headers

Url headers for GeoServer requests. You can use it to add the Authorization credentials

Type: HeadersInit

#### layers

Layers names to be loaded from teh geoserver

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[LayerParams](#layerparams)>

#### layerMode

Service to use as base layer. You can choose to use vectors or raster images

Type: (`"wfs"` \| `"wms"`)

#### wfsStrategy

Strategy function for loading features if layerMode is on "wfs" requests

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### evtType

Click event to select the features

Type: (`"singleclick"` \| `"dblclick"`)

#### active

Initialize activated

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### useLockFeature

Use LockFeatue request on GeoServer when selecting features.
This is not always supportedd by the GeoServer.

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### showControl

Display the control map

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### minZoom

Zoom level to hide features to prevent too much features being loaded

Type: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)

#### language

Language to be used

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### showUpload

Show/hide the upload button

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### uploadFormats

Accepted extension formats on upload

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### processUpload

Triggered to process the uploaded files.
Use this to apply custom preocces or parse custom formats by filtering the extension.
If this doesn't return features, the default function will be used to extract the features.

##### Parameters

-   `file` **File**

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Feature>**

#### beforeInsertFeature

Triggered before insert new features to the Geoserver.
Use this to insert custom properties, modify the feature, etc.

##### Parameters

-   `feature` **Feature**

Returns **Feature**

### i18n

**_[interface]_** - Custom Language specified when creating a WFST instance

### LayerParams

**_[interface]_** - Parameters to create an load the GeoServer layers

## TODO

-   Add diferrents styles
-   Visibility toggle
-   LinearRing support
-   Tests

## License

MIT (c) Gastón Zalba.
