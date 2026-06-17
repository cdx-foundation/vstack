import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite-plus';
import solid from 'vite-plugin-solid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// prettier-ignore
export default defineConfig({
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
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
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
  lint: {
    ignorePatterns: ['dist/**', 'node_modules/**', '.chromium_profile/**', 'bin/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
  fmt: {
    ignorePatterns: ['dist/**', 'node_modules/**', '.chromium_profile/**', 'bin/**'],
    singleQuote: true,
    semi: true,
    indentStyle: 'space',
    indentWidth: 2,
    lineWidth: 100,
  },
});
