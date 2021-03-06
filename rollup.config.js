const { terser } = require("rollup-plugin-terser");

export default {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.js', format: 'cjs' },
      { file: 'dist/index.mjs', format: 'es' }
    ],
    external: ['path','fs-extra','tmp','https','tar'],
    plugins: [
      terser()
    ]
  };