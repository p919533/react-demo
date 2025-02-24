import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3001, // 修改为你想要的端口号
  },
  resolve: {
    alias: {
      // 正确的配置  
      '@': '/src',
    },
  },
  plugins: [react()],
})
