import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // your backend server URL here
    },
  },
})