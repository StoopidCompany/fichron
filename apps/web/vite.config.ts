import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@fichron/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@fichron/core': path.resolve(__dirname, '../../packages/core/src'),
      '@fichron/types': path.resolve(__dirname, '../../packages/types/src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
