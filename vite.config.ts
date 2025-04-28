import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'dist',
    },
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    resolve: {
        alias: {
            '../../sendMessageToOpenAI': '/src/sendMessageToOpenAI.ts',
            '../../salvarMensagemComMemoria': '/src/salvarMensagemComMemoria.js',
            '../../supabaseClient': '/src/supabaseClient.ts',
            'supabaseClient': '/src/supabaseClient.ts',
        },
    },
    define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
        'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY),
    },
});
