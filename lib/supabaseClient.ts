import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY.!"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
