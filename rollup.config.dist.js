import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import image from '@rollup/plugin-image';
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';
import { mkdirSync, writeFileSync } from 'fs';
import CleanCss from 'clean-css';

let globals = {
    'ol': 'ol',
    'ol/Map': 'ol.Map',
    'ol/source': 'ol.source',
    'ol/layer': 'ol.layer',
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
    'ol/events/condition': 'ol.events.condition',
    'ol/interaction': 'ol.interaction',
    'ol/geom/GeometryType': 'ol.geom.GeometryType',
    'ol/OverlayPositioning': 'ol.OverlayPositioning',
    'ol/TileState': 'ol.TileState',
    'ol/coordinate': 'ol.coordinate',
    'modal-vanilla': 'Modal',
    'events': 'EventEmitter'
};

module.exports = {
    input: 'tmp-dist/ol-wfst.js',
    output: [
        {
            file: 'dist/ol-wfst.js',
            format: 'umd',
            name: 'Wfst',
            globals: globals
        },
        {
            file: 'dist/ol-wfst.min.js',
            format: 'umd',
            plugins: [terser()],
            name: 'Wfst',
            globals: globals
        }
    ],
    plugins: [
        builtins(),
        resolve(),
        commonjs(),
        babel({
            babelrc: false,
            plugins: ["@babel/plugin-transform-runtime"],
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            presets: [
                [
                    '@babel/preset-env',
                    {                        
                        targets: {
                            browsers: [
                                "Chrome >= 52",
                                "FireFox >= 44",
                                "Safari >= 7",
                                "Explorer 11",
                                "last 4 Edge versions"
                            ]
                        }
                    }
                ]
            ]
        }),
        image(),
        css({
            output: function (styles, styleNodes) {
                mkdirSync('dist/css', { recursive: true });
                writeFileSync('dist/css/ol-wfst.css', styles)
                const compressed = new CleanCss().minify(styles).styles;
                writeFileSync('dist/css/ol-wfst.min.css', compressed)
            }
        })
    ],
    external: [
        'ol',
        'ol/Map',
        'ol/source',
        'ol/layer',
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
        'ol/geom/Polygon',
        'ol/events/condition',
        'ol/coordinate'
    ]
};