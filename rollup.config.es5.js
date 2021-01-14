import babel from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import image from '@rollup/plugin-image';

module.exports = {
    input: 'tmp-es5/ol-wfst.js',
    output: [
        {
            file: 'lib/ol-wfst.js',
            format: 'umd',
            name: 'Wfst',
            globals: {
                'ol': 'ol',
                'ol/Map': 'ol.Map',
                'ol/source': 'ol.source',
                'ol/layer': 'ol.layer',
                'ol/geom': 'ol.geom',
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
                'ol/proj': 'ol.proj',
                'modal-vanilla': 'Modal',
                'events': 'EventEmitter'
            }
        }
    ],
    plugins: [
        builtins(),
        babel({
            babelHelpers: "bundled",
            exclude: 'node_modules/**'
        }),        
        image()
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
        'ol/OverlayPositioning',
        'ol/proj',
        'modal-vanilla',
        'events'
    ]
};