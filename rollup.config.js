import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
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

export default {
    input: 'src/ol-wfst.ts',
    output: [
        {
            file: 'lib/ol-wfst.js',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        del({ targets: 'lib/*' }),
        banner2(() => banner),
        typescript({
            outDir: './lib',
            outputToFilesystem: true,
            declarationMap: true,
            incremental: false
        }),
        image(),
        postcss({
            include: 'src/assets/scss/-ol-wfst.bootstrap5.scss',
            extensions: ['.css', '.sass', '.scss'],
            extract: path.resolve('lib/style/css/ol-wfst.bootstrap5.css'),
            config: {
                path: './postcss.config.cjs',
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
                path: './postcss.config.cjs',
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