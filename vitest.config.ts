import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((env) => {
  return mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
      },
    })
  )
})
