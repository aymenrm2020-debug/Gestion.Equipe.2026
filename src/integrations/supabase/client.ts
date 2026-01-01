import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined in environment variables.');
  // Fallback or throw an error if environment variables are missing
  // For now, we'll use placeholder values to prevent immediate crash during development
  // In a production environment, you'd want to ensure these are always set.
  // For this project, I will use the provided project ID and anon key directly.
}

export const supabase = createClient(
  supabaseUrl || "https://otlrwuhoojqgygtllvya.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bHJ3dWhvb2pxZ3lndGxsdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODE4NjUsImV4cCI6MjA4Mjg1Nzg2NX0.mYvBnMCy3Oy0WS8HuoDBj4tQOtRUxTNYedSNVNvzR10"
);