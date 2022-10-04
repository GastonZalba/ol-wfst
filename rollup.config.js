import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

module.exports = {
    input: 'src/index-es.js',
    output: [
        {
            dir: 'lib',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        del({ targets: 'lib/*' }),
        typescript({
            outDir: 'lib',
            declarationMap: true,
            declarationDir: 'lib',
            outputToFilesystem: true
        }),
        babel({
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            esmodules: true
                        }
                    }
                ]
            ],
            babelHelpers: 'bundled',
            exclude: ["node_modules/**", "src/assets/**"]
        }),
        image(),
        postcss({
            include: 'src/assets/scss/-ol-wfst.bootstrap5.scss',
            extensions: ['.css', '.sass', '.scss'],
            extract: path.resolve('lib/style/css/ol-wfst.bootstrap5.css'),
            config: {
                path: './postcss.config.js',
                ctx: {
                    isDev: false
                }
            }
        }),
        postcss({
            include: 'src/assets/scss/ol-wfst.scss',
            extensions: ['.css', '.sass', '.scss'],
            extract: path.resolve('lib/style/css/ol-gisify.css'),
            config: {
                path: './postcss.config.js',
                ctx: {
                    isDev: false
                }
            }
        }),
        copy({
            targets: [
                { src: 'src/assets/scss', dest: 'lib/style' }
            ]
        })
    ],
    external: id => !(path.isAbsolute(id) || id.startsWith("."))
};