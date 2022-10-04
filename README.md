# OpenLayers WFST

Tiny WFST-T client to insert (drawing/uploading), modify and delete features on GeoServers using OpenLayers. Layers with these types of geometries are supported: _GeometryCollection_ (in this case, you can choose the geometry type of each element to draw), _Point_, _MultiPoint_, _LineString_, _MultiLineString_, _Polygon_ and _MultiPolygon_.

Tested with OpenLayers version 5, 6 and 7.

<img src="screenshots/example-1.jpg" alt="Drawing" style="width:50%; float:left;">
<img src="screenshots/example-2.jpg" alt="Editing fields" style="width:50%; float:left;">

## Usage

See [Wfst Options](#options) for more details.

```javascript
import Wfst from 'ol-wfst';
import { Fill, Stroke, Circle, Style } from 'ol/style';

// Style
import 'ol-wfst/lib/scss/ol-wfst.css';
import 'ol-wfst/lib/scss/ol-wfst.bootstrap5.css'; // Do not import if you already have boostrap css

// Optional credentials
const password = 123456;
const username = 'username';

const wfst = new Wfst({
    geoServerUrl: 'https://mysite.com/geoserver/myworkspace/ows',
    geoServerAdvanced: {
        getCapabilitiesVersion: '1.3.0',
        getFeatureVersion: '1.0.0',
        describeFeatureTypeVersion: '1.1.0',
        lockFeatureVersion: '1.1.0',
        projection: 'EPSG:3857'
    },
    // Maybe you wanna add this on a proxy, at the backend
    headers: { Authorization: 'Basic ' + btoa(username + ':' + password) },
    layers: [
        {
            name: 'myPointsLayer', // Name of the layer on the GeoServer
            label: 'Photos', // Optional Label to be displayed in the controller
            mode: 'wfs',
            zIndex: 99,
            style: new Style({
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#000000'
                    }),
                    stroke: new Stroke({
                        color: [255, 0, 0],
                        width: 2
                    })
                })
            }),
            geoserverOptions: {
                cql_filter: 'id > 50',
                maxFeatures: 500
            }
        },
        {
            name: 'myMultiGeometryLayer',
            label: 'Other elements'
        },
        {
            name: 'myLineStringLayer',
            label: 'Routes',
            visible: false
        },
        {
            name: 'myMultiPointLayer',
            label: 'Markers',
            visible: false
        }
    ],
    language: 'en',
    minZoom: 12,
    showUpload: true,
    beforeInsertFeature: function (feature) {
        // Add a custom value o perform an action before insert features
        feature.set('customProperty', 'customValue', true);
        return feature;
    }
});

map.addControl(wfst);
```

### Adding features programatically

```js
const feature = new ol.Feature({
    geometry: new ol.geom.MultiPoint([[`-57.1145}`, `-36.2855`]])
});
const inserted = await wfst.transactFeatures('myMultiPointLayer', [feature]);

if (inserted) {
    alert('Feature inserted');
} else {
    alert('Feature not inserted');
}
```

### wfst instance events

```js
wfst.on(['getCapabilities', 'allDescribeFeatureTypeLoaded'], function (evt) {
    console.log(evt.type, evt.data);
});

wfst.on(
    ['modifystart', 'modifyend', 'drawstart', 'drawend', 'load', 'visible'],
    function (evt) {
        console.log(evt.type, evt);
    }
);

wfst.on(['describeFeatureType', 'getFeature'], function (evt) {
    console.log(evt.type, evt.layer, evt.data);
});
```

### wfst sources events

```js
wfst;
```

### Some considerations

-   If the features/vertex appear to be slightly offset after adding them, check the _Number of Decimals_ in your Workplace, you may have to increment that to have a more accurete preview.
-   You can configure a _Basic Authentication_ or an _HTTP Header Proxy Authentication_ with this client, but in some cases is recommended setting that on an reverse proxy on the backend.
-   If you don't use a reverse proxy, remeber configure [cors](https://docs.geoserver.org/latest/en/user/production/container.html#enable-cors)

## Changelog

See [CHANGELOG](./CHANGELOG.md) for details of changes in each release.

## Install

### Browser

#### JS

Load `ol-wfst.js` after OpenLayers. Wfst is available as `Wfst`.

```HTML
<script src="https://unpkg.com/ol-wfst@3.0.3"></script>
```

#### CSS

```HTML
<link rel="stylesheet" href="https://unpkg.com/ol-wfst@3.0.3/dist/css/ol-wfst.min.css" />
<link rel="stylesheet" href="https://unpkg.com/ol-wfst@3.0.3/dist/css/ol-wfst.bootstrap5.min.css" />
```

### Parcel, Webpack, etc.

NPM package: [ol-wfst](https://www.npmjs.com/package/ol-wfst).

Install the package via `npm`

    npm install ol-wfst

#### JS

```js
import Wfst from 'ol-wfst';
```

#### CSS

```js
// scss
import 'ol-wfst/dist/scss/ol-wfst.scss';
import 'ol-wfst/dist/scss/-ol-wfst.bootstrap5.scss';

// or css
import 'ol-wfst/dist/css/ol-wfst.css';
import 'ol-wfst/dist/css/ol-wfst.bootstrap5.css';
```

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for Wfst Options.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Wfst](#wfst)
    -   [Parameters](#parameters)
    -   [getLayers](#getlayers)
    -   [getLayerByName](#getlayerbyname)
        -   [Parameters](#parameters-1)
    -   [activateDrawMode](#activatedrawmode)
        -   [Parameters](#parameters-2)
    -   [activateEditMode](#activateeditmode)
        -   [Parameters](#parameters-3)
-   [GeoServerAdvanced](#geoserveradvanced)
-   [Options](#options)
    -   [layers](#layers)
    -   [active](#active)
    -   [evtType](#evttype)
    -   [showControl](#showcontrol)
    -   [modal](#modal)
    -   [language](#language)
    -   [i18n](#i18n)
    -   [showUpload](#showupload)
    -   [uploadFormats](#uploadformats)
    -   [processUpload](#processupload)
        -   [Parameters](#parameters-4)
-   [LayerParams](#layerparams)
    -   [name](#name)
    -   [geoserver](#geoserver)
    -   [label](#label)
    -   [wfsStrategy](#wfsstrategy)
    -   [geoServerVendor](#geoservervendor)

### Wfst

**Extends ol/control/Control~Control**

Tiny WFST-T client to insert (drawing/uploading), modify and delete
features on GeoServers using OpenLayers. Layers with these types
of geometries are supported: "GeometryCollection" (in this case, you can
choose the geometry type of each element to draw), "Point", "MultiPoint",
"LineString", "MultiLineString", "Polygon" and "MultiPolygon".

#### Parameters

-   `options` **[Options](#options)?** Wfst options, see [Wfst Options](#options) for more details.

#### getLayers

Gat all the layers in the ol-wfst instance

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<(WfsLayer | WmsLayer)>**

#### getLayerByName

Gat the layer

##### Parameters

-   `layerName` (optional, default `''`)

Returns **(WfsLayer | WmsLayer)**

#### activateDrawMode

Activate/deactivate the draw mode

##### Parameters

-   `layer` **(WfsLayer | WmsLayer | `false`)**

Returns **void**

#### activateEditMode

Activate/desactivate the edit mode

##### Parameters

-   `bool` (optional, default `true`)

Returns **void**

### GeoServerAdvanced

**_\[interface]_**

### Options

**_\[interface]_** - Wfst Options specified when creating a Wfst instance

Default values:

```javascript
{
 layers: null,
 evtType: 'singleclick',
 active: true,
 showControl: true,
 language: 'en',
 i18n: {...}, // according to language selection
 uploadFormats: '.geojson,.json,.kml',
 processUpload: null,
}
```

#### layers

Layers to be loaded from the geoserver

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<(WfsLayer | WmsLayer)>

#### active

Init active

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### evtType

The click event to allow selection of Features to be edited

Type: (`"singleclick"` | `"dblclick"`)

#### showControl

Show/hide the control map

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### modal

Modal configuration

Type: {animateClass: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, animateInClass: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, transition: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?, backdropTransition: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?, templates: {dialog: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element))?, headerClose: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element))?}?}

#### language

Language to be used

Type: (`"es"` | `"en"` | `"zh"`)

#### i18n

Custom translations

Type: I18n

#### showUpload

Show/hide the upload button

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### uploadFormats

Accepted extension formats on upload
Example: ".json,.geojson"

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### processUpload

Triggered to allow implement custom functions or to parse other formats than default
by filtering the extension. If this doesn't return features, the default function
will be used to extract them.

##### Parameters

-   `file` **File**

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Feature\<Geometry>>**

### LayerParams

**Extends Omit\<[VectorLayerOptions](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)\<any>, 'source'>**

**_\[interface]_** - Parameters to create the layers and connect to the GeoServer

You can use all the parameters supported by OpenLayers

Default values:

```javascript
{
 name: null,
 label: null, // `name` if not provided
 mode: 'wfs',
 wfsStrategy: 'bbox',
 geoServerVendor: null
}
```

#### name

Layer name in the GeoServer

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### geoserver

Geoserver Object

Type: Geoserver

#### label

Label to be displayed in the widget control

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### wfsStrategy

Strategy function for loading features.
Only for WFS

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### geoServerVendor

Available geoserver options

Type: (WfsGeoserverVendor | WmsGeoserverVendor)

## TODO

-   \~~Add support to diferent layer styles~~
-   \~~Improve widget controller: visibility toggle~~
-   \~~Add events~~
-   Add `Don't show again` option in the error modal
-   Allow selection of multiples features and bulk edit
-   Add customizables styles
-   Improve scss (add variables)
-   Add cookies to persist widget controller state
-   Geometry type _LinearRing_ support
-   Tests!
-   Improve comments and documentation
-   Improve interface
-   Change svg imports to preserve svg structure

## License

MIT (c) Gastón Zalba.
