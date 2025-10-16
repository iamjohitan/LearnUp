import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carga las variables de entorno manualmente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Faltan variables SUPABASE_URL o SUPABASE_KEY en el archivo .env',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase inicializado correctamente');
