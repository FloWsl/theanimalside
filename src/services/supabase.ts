// 🗃️ Supabase Configuration and Client Setup
// This file will be the main Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import { config, isDevelopment } from '../config/environment';

// Note: Database types will be auto-generated when connected to live Supabase
// For now, using any to allow development
type Database = any;

// Get configuration from environment system
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

// Debug environment variables in development
if (isDevelopment() && config.debug.enableLogs) {
  console.log('🗃️ Supabase Configuration:', {
    url: supabaseUrl ? `${supabaseUrl.slice(0, 20)}...` : 'NOT SET',
    key: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'NOT SET',
    enabled: config.supabase.enabled
  });
}

// Create Supabase client with enhanced configuration (only if configured)
export const supabase = config.supabase.enabled
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit'
      },
      realtime: {
        params: {
          eventsPerSecond: isDevelopment() ? 10 : 5
        }
      },
      global: {
        headers: {
          'X-Client-Info': `theanimalside-${config.name}`
        }
      }
    })
  : null;

// Export types for use throughout the app
export type { Database };

// Connection validation and health check
export async function validateSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
  latency?: number;
}> {
  if (!config.supabase.enabled || !supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const start = performance.now();

    // Simple health check query
    const { error } = await supabase.from('organizations').select('id').limit(1);

    const latency = performance.now() - start;

    if (error) {
      return { connected: false, error: error.message };
    }

    return { connected: true, latency };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

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

// Enhanced error handling with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      // Only retry on network or temporary errors
      const isRetryable = error instanceof Error && (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout')
      );

      if (!isRetryable) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw new Error('Maximum retries exceeded');
}