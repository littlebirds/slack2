import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:5000/api',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
        },
        '/ws': {
            target: 'ws://localhost:5173',
            ws: true,
            changeOrigin: true,
            rewrite: path => path.replace(/^\/ws/, '')
        }    
    }
    }
})
