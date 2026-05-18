import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',   // Expose ra ngoài container
    port: 5173,
    strictPort: true,
    watch: {
      // Bật polling vì Windows/WSL2 không gửi inotify event
      usePolling: true,
      interval: 300,   // Kiểm tra mỗi 300ms
    },
    hmr: {
      clientPort: 5173, // Client kết nối qua port này
    },
  },
})
