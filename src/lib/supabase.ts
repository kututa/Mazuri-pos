import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values to help with debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL is not defined. Please add it to your .env file. You can find this value in your Supabase project settings.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY is not defined. Please add it to your .env file. You can find this value in your Supabase project settings.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);