import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          vendor: ['react', 'react-dom', 'zustand', 'framer-motion'],
        },
      },
    },
  },
  server: {
    host: true,
    proxy: {
      '/api/textures': {
        target: 'https://www.solarsystemscope.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/textures/, '/textures/download'),
      },
    },
  },
});
