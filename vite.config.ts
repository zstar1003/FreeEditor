import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/', // Electron 打包用相对路径，开发用根路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
