import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import arraybuffer from 'vite-plugin-arraybuffer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    arraybuffer(),
    TanStackRouterVite({
      quoteStyle: 'single',
      semicolons: false,
    }),
    react(),
    tsconfigPaths(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 3500,
  },
})
