import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Configure Hot Module Replacement based on environmental triggers
      hmr: process.env.DISABLE_HMR !== 'true',
      // Optimize container CPU loads under high-frequency rebuild conditions
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
