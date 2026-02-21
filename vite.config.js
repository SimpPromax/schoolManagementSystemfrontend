import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // or '0.0.0.0' - this allows network access
    port: 5173,
    strictPort: true, // fail if port is in use
    hmr: {
      host: '192.168.100.126', // your PC's network IP
      protocol: 'ws',
      clientPort: 5173
    },
    allowedHosts: [
      '192.168.100.126',
      'localhost',
      '.localhost',
      'all' // temporarily allow all hosts for testing
    ],
    cors: true, // enable CORS for dev server
    watch: {
      usePolling: true, // useful for some network setups
    }
  },
  preview: {
    host: true,
    port: 5173
  }
})