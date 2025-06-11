
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Comentado temporariamente para evitar erro
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// Cliente temporário - substitua pelas suas credenciais reais
const defaultUrl = supabaseUrl || 'https://your-project.supabase.co';
const defaultKey = supabaseAnonKey || 'your-anon-key';

export const supabase = createClient(defaultUrl, defaultKey);
