import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    babel({ 
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled'
    })
  ],
  output: [
    {
      file: 'public/index.js',
      format: 'esm'
    }
  ]
};