import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径，适配 Electron
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
