import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./app/tests/setup.ts'],
    include: ['./app/tests/*.{test,spec}.{ts,tsx}'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['./app/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app')
    },
  },
})
