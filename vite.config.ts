import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '../../sendMessageToOpenAI': '/src/sendMessageToOpenAI.ts',
      '../../salvarMensagemComMemoria': '/src/salvarMensagemComMemoria.js',
    },
  },
});
