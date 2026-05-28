import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// missing env vars = silent failure in the app, so warn early
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — check your .env file')
}

// TODO: look into adding retry/offline handling here — supabase can be flaky on mobile
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)
