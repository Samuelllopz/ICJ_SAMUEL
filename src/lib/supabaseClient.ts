import { createClient } from '@supabase/supabase-js';

// URL y Clave Pública de Supabase (con fallback predeterminado para producción y Vercel)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://eltyghipdqiwutsukxgu.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l1Nyloh0sk0EtrQ0qr2eFA_RhOtmiDB';

// Inicializar cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

