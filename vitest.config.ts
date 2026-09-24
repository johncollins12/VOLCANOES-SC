import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Node-environment config — deliberately scoped to pure-logic unit tests
 * (utils, pagination, sanitization, slug generation) rather than full
 * component/DOM rendering. Component testing would need jsdom +
 * @testing-library/react added as devDependencies; not included here to
 * avoid pulling in dependencies beyond what this pass's tests actually
 * need — see docs/TESTING.md for how to extend this when component tests
 * are wanted.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
