import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is '/bodylog/' in production (GitHub Pages serves at /<repo-name>/)
// and '/' in dev so localhost stays clean.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/bodylog/' : '/',
  server: {
    host: true,
    port: 5173,
  },
}))
