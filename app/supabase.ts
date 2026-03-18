import { createClient } from '@supabase/supabase-js'

// 1. Paste your actual URL inside these quotes
const supabaseUrl = "https://bvsdxdgqlcvdszmrfbrk.supabase.co"

// 2. Paste your actual long Anon Key inside these quotes
const supabaseAnonKey = "sb_publishable_fxCOQzAC9RXH08aCvx0f_A_n852Dkwr"

// 3. Export the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)