import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqvrtwslyfhzdozmwomo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdnJ0d3NseWZoemRvem13b21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTI5MzIsImV4cCI6MjA3NTI2ODkzMn0.0ueNcP66mXB8MA1ZyVbodPiVuHJ0qq4ZlfxgH_w6YMA"; // no la cambies, solo usa la anon

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
