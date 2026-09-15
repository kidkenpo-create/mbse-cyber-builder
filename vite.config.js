import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/' is the default — correct for Vercel root deployments.
  // If you deploy to a GitHub Pages sub-path (e.g. /mbse-cyber-builder/),
  // change base to: '/mbse-cyber-builder/'
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
})
