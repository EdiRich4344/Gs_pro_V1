
import { createClient } from '@supabase/supabase-js';

// Configuration: Prefer environment variables for production builds, fall back to hardcoded keys for development/preview.
const supabaseUrl = process.env.SUPABASE_URL || 'https://wchugpunyivaahfjazck.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaHVncHVueWl2YWFoZmphemNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzQ4NjQsImV4cCI6MjA3NjgxMDg2NH0.R2vzyCE0G54d2G4qLzYyeybCAe-dUT5CiWbWZeDK8IU';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
