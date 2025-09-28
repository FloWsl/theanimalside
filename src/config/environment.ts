// Environment Configuration for Deployment System
// PATTERN: Centralized environment management with type safety

export type Environment = 'development' | 'staging' | 'production';

/**
 * Safe environment variable accessor that works in both browser and Node.js
 * PATTERN: Universal environment variable access
 */
function getEnvVar(key: string): string {
  // Browser environment (Vite) - import.meta.env is available in Vite
  if (typeof window !== 'undefined' && import.meta?.env) {
    return import.meta.env[key] || '';
  }

  // Node.js environment (testing, SSR)
  if (typeof process !== 'undefined' && process?.env) {
    return process.env[key] || '';
  }

  // Fallback
  return '';
}

export interface EnvironmentConfig {
  name: Environment;
  supabase: {
    url: string;
    anonKey: string;
    enabled: boolean;
  };
  deployment: {
    enableFeatureFlags: boolean;
    enableMonitoring: boolean;
    enableRollback: boolean;
    defaultRolloutPercentage: number;
    monitoringInterval: number;
  };
  monitoring: {
    enableRealTime: boolean;
    enableWebVitals: boolean;
    enableErrorTracking: boolean;
    alertThresholds: {
      errorRate: number;
      responseTime: number;
      memoryUsage: number;
    };
  };
  notifications: {
    channels: ('console' | 'email' | 'slack' | 'webhook')[];
    webhookUrl?: string;
    slackWebhook?: string;
  };
  debug: {
    enableLogs: boolean;
    enablePerformanceMetrics: boolean;
    enableFeatureFlagDebug: boolean;
  };
}

/**
 * Get current environment from various sources
 * PATTERN: Multiple fallback sources for reliability
 */
function getCurrentEnvironment(): Environment {
  // Check Vite environment variables
  const viteEnv = getEnvVar('VITE_ENVIRONMENT');
  if (viteEnv && ['development', 'staging', 'production'].includes(viteEnv)) {
    return viteEnv as Environment;
  }

  // Check React environment variables (legacy support)
  const reactEnv = getEnvVar('REACT_APP_ENVIRONMENT');
  if (reactEnv && ['development', 'staging', 'production'].includes(reactEnv)) {
    return reactEnv as Environment;
  }

  // Check Node environment
  const nodeEnv = getEnvVar('NODE_ENV');
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'development') return 'development';

  // Check hostname patterns for deployment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('preview')) {
      return 'staging';
    }
    if (hostname.includes('.com') || hostname.includes('.org')) {
      return 'production';
    }
  }

  // Default to development for safety
  return 'development';
}

/**
 * Environment-specific configurations
 * PATTERN: Safe defaults with environment-specific overrides
 */
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL'),
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
      enabled: Boolean(getEnvVar('VITE_SUPABASE_URL') && getEnvVar('VITE_SUPABASE_ANON_KEY'))
    },
    deployment: {
      enableFeatureFlags: true,
      enableMonitoring: true,
      enableRollback: true,
      defaultRolloutPercentage: 100, // Full rollout in development
      monitoringInterval: 10000 // 10 seconds for fast feedback
    },
    monitoring: {
      enableRealTime: true,
      enableWebVitals: true,
      enableErrorTracking: true,
      alertThresholds: {
        errorRate: 10, // Relaxed thresholds for development
        responseTime: 2000,
        memoryUsage: 90
      }
    },
    notifications: {
      channels: ['console'] // Console only for development
    },
    debug: {
      enableLogs: true,
      enablePerformanceMetrics: true,
      enableFeatureFlagDebug: true
    }
  },

  staging: {
    name: 'staging',
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL'),
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
      enabled: Boolean(getEnvVar('VITE_SUPABASE_URL') && getEnvVar('VITE_SUPABASE_ANON_KEY'))
    },
    deployment: {
      enableFeatureFlags: true,
      enableMonitoring: true,
      enableRollback: true,
      defaultRolloutPercentage: 50, // 50% rollout in staging
      monitoringInterval: 30000 // 30 seconds
    },
    monitoring: {
      enableRealTime: true,
      enableWebVitals: true,
      enableErrorTracking: true,
      alertThresholds: {
        errorRate: 5, // Stricter than development
        responseTime: 1500,
        memoryUsage: 80
      }
    },
    notifications: {
      channels: ['console', 'webhook'],
      webhookUrl: getEnvVar('VITE_STAGING_WEBHOOK_URL')
    },
    debug: {
      enableLogs: true,
      enablePerformanceMetrics: true,
      enableFeatureFlagDebug: false
    }
  },

  production: {
    name: 'production',
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL'),
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
      enabled: Boolean(getEnvVar('VITE_SUPABASE_URL') && getEnvVar('VITE_SUPABASE_ANON_KEY'))
    },
    deployment: {
      enableFeatureFlags: true,
      enableMonitoring: true,
      enableRollback: true,
      defaultRolloutPercentage: 5, // Conservative 5% in production
      monitoringInterval: 60000 // 1 minute
    },
    monitoring: {
      enableRealTime: true,
      enableWebVitals: true,
      enableErrorTracking: true,
      alertThresholds: {
        errorRate: 1, // Strict production thresholds
        responseTime: 1000,
        memoryUsage: 70
      }
    },
    notifications: {
      channels: ['webhook', 'slack'],
      webhookUrl: getEnvVar('VITE_PRODUCTION_WEBHOOK_URL'),
      slackWebhook: getEnvVar('VITE_SLACK_WEBHOOK_URL')
    },
    debug: {
      enableLogs: false, // No debug logs in production
      enablePerformanceMetrics: true,
      enableFeatureFlagDebug: false
    }
  }
};

// Get current environment configuration
export const currentEnvironment = getCurrentEnvironment();
export const config = environmentConfigs[currentEnvironment];

// Validation function to ensure critical configuration is present
export function validateEnvironmentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate Supabase configuration if enabled
  if (config.supabase.enabled) {
    if (!config.supabase.url) {
      errors.push('VITE_SUPABASE_URL is required when Supabase is enabled');
    }
    if (!config.supabase.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required when Supabase is enabled');
    }
  }

  // Validate production notification channels
  if (currentEnvironment === 'production') {
    if (config.notifications.channels.includes('webhook') && !config.notifications.webhookUrl) {
      errors.push('VITE_PRODUCTION_WEBHOOK_URL is required for production webhook notifications');
    }
    if (config.notifications.channels.includes('slack') && !config.notifications.slackWebhook) {
      errors.push('VITE_SLACK_WEBHOOK_URL is required for Slack notifications');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export helper functions
export function isProduction(): boolean {
  return currentEnvironment === 'production';
}

export function isDevelopment(): boolean {
  return currentEnvironment === 'development';
}

export function isStaging(): boolean {
  return currentEnvironment === 'staging';
}

// Debug information (only in development)
if (isDevelopment() && config.debug.enableLogs) {
  console.log('🌍 Environment Configuration:', {
    environment: currentEnvironment,
    featureFlags: config.deployment.enableFeatureFlags,
    monitoring: config.monitoring.enableRealTime,
    supabaseEnabled: config.supabase.enabled,
    supabaseConfigured: Boolean(config.supabase.url && config.supabase.anonKey)
  });

  const validation = validateEnvironmentConfig();
  if (!validation.valid) {
    console.warn('⚠️ Environment configuration warnings:', validation.errors);
  }
}