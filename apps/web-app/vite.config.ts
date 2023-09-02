import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

const pkgDir = path.join(__dirname, '../../pkg')

export default defineConfig({
  base: '/image',
  server: {
    fs: {
      allow: ['.', pkgDir]
    }
  },
  plugins: [wasm(), topLevelAwait(), react()]
})
