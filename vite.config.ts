import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/FreeEditor/', // Electron 打包用相对路径，GitHub Pages 用仓库名路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
