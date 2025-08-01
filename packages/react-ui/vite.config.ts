import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: '../landing/src/js/components',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // Ignore everything in src/notes
        /^src\/notes\/.+/,
        // ignore firebase cli config files
        'firebase.json',
        '.firebaserc',
        'firebase-debug.log',
        'storage.rules',
        'cors.json',
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-chunk.js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  base: './',
});
