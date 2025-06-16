// 🗃️ Supabase Configuration and Client Setup
// This file will be the main Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase-generated'; // This will be auto-generated

// Environment variables (to be set up)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
export type { Database } from '../types/supabase-generated';

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