// 🗃️ Supabase Configuration and Client Setup
// This file will be the main Supabase client configuration

import { createClient } from '@supabase/supabase-js';
// Note: Database types will be auto-generated when connected to live Supabase
// For now, using any to allow development
type Database = any;

// Environment variables (Vite syntax)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug environment variables in development
if (import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
  console.log('Supabase Config:', {
    url: supabaseUrl ? `${supabaseUrl.slice(0, 20)}...` : 'NOT SET',
    key: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'NOT SET'
  });
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export types for use throughout the app
export type { Database };

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): never {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'Database operation failed');
}

// Helper function for pagination
export interface PaginationOptions {
  page: number;
  limit: number;
}

export function getPaginationRange(page: number, limit: number) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}