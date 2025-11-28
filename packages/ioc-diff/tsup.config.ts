import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'bin/ioc-diff.ts'],
  format: ['esm'],
  target: 'es2021',
  dts: true,
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
});