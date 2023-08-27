import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const pkgDir = path.join(__dirname, '../../pkg')

export default defineConfig({
  resolve: {
    alias: {
      'image-wasm': pkgDir
    }
  },
  server: {
    fs: {
      allow: ['.', pkgDir]
    }
  },
  plugins: [react()]
})
