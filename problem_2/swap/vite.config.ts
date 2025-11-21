import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    port: 4000,
    // allow any host (development only — use with caution)
    allowedHosts: true,
  },
});
