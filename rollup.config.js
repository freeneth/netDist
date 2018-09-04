import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import imageBase64 from 'rollup-plugin-image-base64';

export default {
  input: 'src/main.js',
  output: [{
    // file: 'dist/main.esm.js',
    file: 'dist/main.esm.js',
    format: 'es',
  }, {
    file: '../../pages/net_disk/react-net-disk.js',
    format: 'es',
  }],
  plugins: [
    postcss({
      plugins: [
        require('postcss-import'),
        require('postcss-define-property'),
        require('postcss-mixins'),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('postcss-cssnext'),
        require('postcss-define-property')
      ]
    }),
    imageBase64(),
    babel({
      exclude: 'node_modules/**',
    }),
    cjs(),
    resolve({
      only: [
        'p-queue',
        'streamsaver'
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  external: [
    'react',
    'react-dom',
    'styled-components',
    'jszip',
    'lodash/curry'
  ],
  onwarn(warning, warn) {
    if (isNodeModulesWarning(warning, 'EVAL')) return;
    warn(warning);
  }
}

function isNodeModulesWarning (warning, code) {
  if (code && code !== warning.code) {
    return false
  }

  return warning.loc.file.includes('node_modules')
}
