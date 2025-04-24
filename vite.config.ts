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
      '../../supabaseClient': '/src/supabaseClient.ts', // Alias adicionado
      'supabaseClient': '/src/supabaseClient.ts',      // Alias mais direto (recomendado para imports)
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    // Adicione aqui outras variáveis de ambiente que você possa estar usando com o prefixo VITE_
  },
});
