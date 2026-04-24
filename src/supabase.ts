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

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use localStorage (default) — avoids the IndexedDB lock contention
    // that causes "lock was released because another request stole it"
    storage: window.localStorage,
    // Prevent multiple tabs / concurrent requests from fighting over the lock
    lock: async (_name, _acquireTimeout, fn) => fn(),
  },
})
