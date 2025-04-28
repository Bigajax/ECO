// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL ou Anon Key não estão definidos nas variáveis de ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```typescript
// src/sendMessageToOpenAI.ts
import { supabase } from './supabaseClient';

export const sendMessageToOpenAI = async (message: string, userName: string, conversation: { role: 'user' | 'assistant'; content: string; }[]) => {
    try {
        const { data, error } = await supabase.functions.invoke('process-message', {
            body: {
                message,
                userName,
                conversation
            }
        });

        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
        throw error;
    }
};
```typescript
