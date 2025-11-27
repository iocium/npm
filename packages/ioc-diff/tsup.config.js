import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'bin/ioc-diff.ts'],
  format: ['esm'],
  splitting: false,
  clean: true,
  dts: true,
  banner: {
    js: ''
  }
});