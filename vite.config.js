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
            target: 'http://127.0.0.1:5174/api',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
        },
        '/socket.io': {
            target: 'ws://localhost:5174',
            ws: true,
            rewriteWsOrigin: true,
        }    
    }
    }
})
