import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@fichron/ui': '../../../packages/ui/src',
      '@fichron/core': '../../../packages/core/src',
      '@fichron/types': '../../../packages/types/src'
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
