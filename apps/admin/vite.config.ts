import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Partner & Admin Portal Vite Config - Dedicated Port 5180
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom')
    }
  }
});
