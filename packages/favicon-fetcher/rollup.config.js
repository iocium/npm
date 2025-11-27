import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'FaviconFetcherLib'
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm'
    }
  ],
  plugins: [typescript()]
};
