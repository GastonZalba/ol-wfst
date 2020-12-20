import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

module.exports = {
    input: 'lib/ol-wfst.js',
    output: [
        {
            file: 'dist/ol-wfst.js',
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
                'modal-vanilla': 'Modal',
                'events': 'EventEmitter'
            }
        }
    ],
    plugins: [
        builtins(),
        resolve(),
        commonjs({
            include: ['node_modules/events/*', 'node_modules/modal-vanilla/*']
        }),
        babel({
            babelHelpers: "bundled",
            exclude: 'node_modules/**'
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
        'ol/interaction'
    ]
};