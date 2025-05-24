// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// debug logging
console.log('VITE_SUPABASE_URL=', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY=', import.meta.env.VITE_SUPABASE_ANON_KEY)

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your .env file'
  )
}

export const supabase = createClient(url, anonKey)
