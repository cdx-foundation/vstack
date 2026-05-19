import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig(() => ({
  plugins: [solid(), tailwindcss()],
  esbuild: {
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    target: 'chrome103',
  },
  server: {
    port: 8337,
    fs: {
      allow: ['..'],
    },
  },
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'chrome103',
    cssMinify: 'lightningcss' as const,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        // Ensure consistent naming for FiveM asset tracking
        entryFileNames: 'assets/[name].js', // Removed hash for easier referencing if needed
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    root: 'src',
  },
}));
