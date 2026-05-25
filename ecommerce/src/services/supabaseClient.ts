import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Forzar URLs públicas sin transformación
export const getPublicImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)
  return data.publicUrl
}