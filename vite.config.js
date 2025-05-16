// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/selvas/', // <-- IMPORTANT: Your repository name
  build: {
    outDir: 'dist',
  }
});