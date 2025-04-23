import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmqbzsefjboizldfxwfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // mantém sua chave

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

