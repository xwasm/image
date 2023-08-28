import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

const pkgDir = path.join(__dirname, '../../pkg')

export default defineConfig({
  base: '/image-wasm',
  server: {
    fs: {
      allow: ['.', pkgDir]
    }
  },
  plugins: [wasm(), react()]
})
