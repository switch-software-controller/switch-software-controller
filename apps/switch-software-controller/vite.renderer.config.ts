import { defineConfig } from 'vite';
import path from 'node:path';

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
  }
});
