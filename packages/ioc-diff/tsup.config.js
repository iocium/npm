import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'bin/ioc-diff.ts'],
  format: ['esm'],
  target: 'es2021',
  splitting: false,
  clean: true,
  dts: true,
  banner: {
    js: ''
  }
});