import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FLOODGUARD-AI/', // <-- Add this line
  server: {
    host: true,
    port: 5173,
  },
})
