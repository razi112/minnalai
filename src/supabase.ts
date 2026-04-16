import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
  throw new Error(
    '⚠️  Missing VITE_SUPABASE_URL in .env\n' +
    'Create a .env file in the project root with:\n' +
    'VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
