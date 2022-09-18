import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  plugins: [
    babel({ 
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled'
    }),
    terser()
  ],
  output: [
    {
      file: 'public/index.js',
      format: 'esm'
    }
  ]
};