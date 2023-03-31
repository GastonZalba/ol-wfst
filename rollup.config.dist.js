import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

let globals = {
    'ol': 'ol',
    'ol/Map': 'ol.Map',
    'ol/source': 'ol.source',
    'ol/source/Vector': 'ol.source.Vector',
    'ol/source/TileWMS': 'ol.source.TileWMS',
    'ol/layer': 'ol.layer',
    'ol/layer/Tile': 'ol.layer.Tile',
    'ol/layer/Vector': 'ol.layer.Vector',
    'ol/layer/Layer': 'ol.layer.Layer',
    'ol/layer/Base': 'ol.layer.Base',
    'ol/Object': 'ol.Object',

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
    'ol/format/GeoJSON': 'ol.format.GeoJSON',    
    'ol/events': 'ol.events',
    'ol/events/Event': 'ol.events.Event',
    'ol/events/condition': 'ol.events.condition',
    'ol/interaction': 'ol.interaction',
    'ol/geom/GeometryType': 'ol.geom.GeometryType',
    'ol/OverlayPositioning': 'ol.OverlayPositioning',
    'ol/TileState': 'ol.TileState',
    'ol/coordinate': 'ol.coordinate',
    'modal-vanilla': 'Modal',
    'events': 'EventEmitter'
};

export default function (commandOptions) {
    const outputs = [{
        input: 'src/index-umd.js',
        output: [
            {
                file: 'dist/ol-wfst.js',
                format: 'umd',
                name: 'Wfst',
                globals: globals,
                sourcemap: true,                
                exports: 'named'
            },
            {
                file: 'dist/ol-wfst.min.js',
                format: 'umd',
                plugins: [terser()],
                name: 'Wfst',
                globals: globals,
                sourcemap: true
            }
        ],
        plugins: [
            del({ targets: 'dist/*' }),
            typescript(
                {
                    outDir: 'dist',
                    outputToFilesystem: true                    
                }
            ),
            nodePolyfills(),
            resolve(
                { browser: true }
            ),
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
            commonjs(),
            image(),
            postcss({
                include: 'src/assets/scss/-ol-wfst.bootstrap5.scss',
                extensions: ['.css', '.sass', '.scss'],
                inject: commandOptions.dev,
                extract: commandOptions.dev ? false : path.resolve('dist/css/ol-wfst.bootstrap5.css'),
                config: {
                    path: './postcss.config.cjs',
                    ctx: {
                        isDev: commandOptions.dev ? true : false
                    }
                }
            }),
            postcss({
                include: 'src/assets/scss/ol-wfst.scss',
                extensions: ['.css', '.sass', '.scss'],
                inject: commandOptions.dev ? true : false,
                extract: commandOptions.dev ? false : path.resolve('dist/css/ol-wfst.css'),
                sourceMap: commandOptions.dev ? true : false,
                minimize: false,
                config: {
                    path: './postcss.config.cjs',
                    ctx: {
                        isDev: commandOptions.dev ? true : false
                    }
                }
            }),
            commandOptions.dev && serve({
                open: false,
                verbose: true,
                contentBase: ['', 'examples'],
                historyApiFallback: '/basic.html',
                host: 'localhost',
                port: 3000,
                // execute function after server has begun listening
                onListening: function (server) {
                    const address = server.address()
                    // by using a bound function, we can access options as `this`
                    const protocol = this.https ? 'https' : 'http'
                    console.log(`Server listening at ${protocol}://localhost:${address.port}/`)
                }
            }),
            commandOptions.dev && livereload({
                watch: ['dist'],
                delay: 500
            })
        ],
        external: id => {
            return /(?!ol\/TileState)(^ol(\\|\/))/.test(id)
        }
    }];

    // Minified css
    if (!commandOptions.dev) {
        outputs.push({
            input: path.resolve('dist/css/ol-wfst.css'),
            plugins: [
                postcss({
                    extract: true,
                    minimize: true,
                    config: {
                        path: './postcss.config.cjs',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
            ],
            output: {
                file: path.resolve('dist/css/ol-wfst.min.css'),
            },
            onwarn(warning, warn) {
                if (warning.code === 'FILE_NAME_CONFLICT') return
                warn(warning)
            }
        })

        outputs.push({
            input: path.resolve('dist/css/ol-wfst.bootstrap5.css'),
            plugins: [
                postcss({
                    extract: true,
                    minimize: true,
                    config: {
                        path: './postcss.config.cjs',
                        ctx: {
                            isDev: commandOptions.dev ? true : false
                        }
                    }
                }),
            ],
            output: {
                file: path.resolve('dist/css/ol-wfst.bootstrap5.min.css'),
            },
            onwarn(warning, warn) {
                if (warning.code === 'FILE_NAME_CONFLICT') return
                warn(warning)
            }
        })
    }

    return outputs;
};