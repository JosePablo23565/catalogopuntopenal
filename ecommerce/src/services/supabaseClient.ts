import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.URL
const supabaseAnonKey = import.meta.env.ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)