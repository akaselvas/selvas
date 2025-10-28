// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/selvas/', // Match your GitHub repo name
  build: {
    outDir: 'docs', // <- GitHub Pages will read from /docs folder
  }
});