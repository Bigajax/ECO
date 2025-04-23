// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmqbzsefjboizldfxwfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcWJ6c2VmamJvaXpsZGZ4d2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDMyMzQsImV4cCI6MjA2MDQ3OTIzNH0.5jHpcQrG9gCWx97nVbXQr_wSMsrG1Urumso7YlQStP4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
