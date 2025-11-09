import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8086', // Django后端实际运行在8086
        changeOrigin: true,
      },
      '/public': {
        target: 'http://localhost:8086',
        changeOrigin: true,
      }
    }
  }
})
