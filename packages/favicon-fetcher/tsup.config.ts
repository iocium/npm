import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2021',
  dts: true,
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
});
