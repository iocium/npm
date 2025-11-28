import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'ThrowawayLookup',
  dts: true,
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  target: 'es2021'
});
