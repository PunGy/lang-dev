import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ['a-0']: resolve(__dirname, 'A-0.html'),
        ['f-0']: resolve(__dirname, 'F-0.html'),
      },
    },
  },
})
