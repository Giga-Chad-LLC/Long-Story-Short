import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from "vite-plugin-web-extension";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Включаем source maps для отладки
    minify: true,
  },
  plugins: [
    react(),
    webExtension()
  ],
})
