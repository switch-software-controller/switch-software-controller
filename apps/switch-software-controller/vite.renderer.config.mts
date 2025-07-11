import { defineConfig } from 'vite';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(__dirname, 'src', 'renderer'),
  build: {
    outDir: path.resolve(__dirname, '.vite', 'renderer'),
    rollupOptions: {
      input: {
        main_window: path.resolve(__dirname, 'src', 'renderer', 'index.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src', 'renderer', 'src'),
    }
  },
  plugins: [
    tailwindcss(),
    renderer(),
  ],
});
