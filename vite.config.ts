import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/FreeEditor/', // Electron 用相对路径，Web 用仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
