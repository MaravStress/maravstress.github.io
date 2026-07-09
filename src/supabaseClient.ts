import { createClient } from '@supabase/supabase-js';
import supabaseKeys from './data/supabase.json';

// Las llaves se leen ahora del archivo supabase.json
const supabaseUrl = supabaseKeys.supabaseUrl || 'https://your-project-id.supabase.co';
const supabaseAnonKey = supabaseKeys.supabaseAnonKey || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
