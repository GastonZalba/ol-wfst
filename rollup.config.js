import babel from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-css-only'
import { mkdirSync, writeFileSync } from 'fs';

module.exports = {
    input: 'tmp-lib/ol-wfst.js',
    output: [
        {
            file: 'lib/ol-wfst.js',
            format: 'es',
            name: 'Wfst',
            globals: {
                'ol': 'ol',
                'ol/Map': 'ol.Map',
                'ol/source': 'ol.source',
                'ol/layer': 'ol.layer',
                'ol/layer/VectorTile': 'ol.layer.VectorTile',
                'ol/geom': 'ol.geom',
                'ol/geom/Polygon': 'ol.geom.Polygon',
                'ol/Feature': 'ol.Feature',
                'ol/Overlay': 'ol.Overlay',
                'ol/style': 'ol.style',
                'ol/control': 'ol.control',
                'ol/proj': 'ol.proj',
                'ol/extent': 'ol.extent',
                'ol/loadingstrategy': 'ol.loadingstrategy',
                'ol/Observable': 'ol.Observable',
                'ol/format': 'ol.format',
                'ol/events': 'ol.events',
                'ol/interaction': 'ol.interaction',
                'ol/geom/GeometryType': 'ol.geom.GeometryType',
                'ol/OverlayPositioning': 'ol.OverlayPositioning',
                'ol/TileState': 'ol.TileState',
                'modal-vanilla': 'Modal',
                'events': 'EventEmitter'
            }
        }
    ],
    plugins: [
        builtins(),
        babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            esmodules: true
                        }
                    }
                ]
            ],
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        image(),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('lib/css', { recursive: true });
                writeFileSync('lib/css/ol-wfst.css', styles)
            }
        })
    ],
    external: [
        'ol',
        'ol/Map',
        'ol/source',
        'ol/layer',
        'ol/layer/VectorTile',
        'ol/geom',
        'ol/Feature',
        'ol/Overlay',
        'ol/style',
        'ol/control',
        'ol/proj',
        'ol/extent',
        'ol/loadingstrategy',
        'ol/Observable',
        'ol/format',
        'ol/events',
        'ol/interaction',
        'ol/TileState',
        'ol/OverlayPositioning',
        'ol/geom/GeometryType',
        'ol/geom/Polygon',
        'ol/events/condition',
        'modal-vanilla',
        'events'
    ]
};