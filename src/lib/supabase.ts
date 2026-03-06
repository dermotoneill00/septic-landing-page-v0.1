import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[ProGuard] Supabase environment variables are not set. " +
      "Copy .env.example to .env.local and add your project URL and anon key. " +
      "Portal authentication will not work until this is configured."
  );
}

// createClient accepts placeholder strings safely; actual API calls will fail
// with a network error until real credentials are provided.
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
