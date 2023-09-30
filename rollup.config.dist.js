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
import banner2 from 'rollup-plugin-banner2'
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner =
`/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.homepage}
 * Built: ${new Date()}
*/
`;

const globals = (id) => {

    const globals = {
        'modal-vanilla': 'Modal',
        'events': 'EventEmitter'
    }

    if (/ol(\\|\/)/.test(id)) {
        return id.replace(/\//g, '.').replace('.js', '');
    } else if (id in globals) {
        return globals[id];
    }

    return id;
}

export default function (commandOptions) {
    const outputs = [{
        input: 'src/index-umd.ts',
        output: [
            {
                file: 'dist/ol-wfst.js',
                format: 'umd',
                name: 'Wfst',
                globals: globals,
                sourcemap: true            
            },
            !commandOptions.dev && {
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
            banner2(() => banner),
            typescript(
                {
                    outDir: 'dist',
                    outputToFilesystem: true,
                    declaration: false
                }
            ),
            nodePolyfills(),
            resolve(
                { browser: true }
            ),
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