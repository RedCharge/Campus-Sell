import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if variables are loaded
console.log('Supabase URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('Supabase Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

// If missing, show error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase credentials missing!');
  console.error('Make sure .env file exists with:');
  console.error('REACT_APP_SUPABASE_URL=your_url');
  console.error('REACT_APP_SUPABASE_ANON_KEY=your_key');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});