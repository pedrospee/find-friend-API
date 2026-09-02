import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    exclude: ['**/node_modules/**', '**/*.e2e-spec.ts'],
  },
})
