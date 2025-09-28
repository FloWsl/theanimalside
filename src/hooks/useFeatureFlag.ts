// React Hook for Feature Flag Integration
// PATTERN: Simple, performant React integration with caching

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FeatureFlagManager, FlagEvaluationResult, FlagEvaluationContext } from '../utils/FeatureFlagManager';
import { config } from '../config/environment';

export interface UseFeatureFlagOptions {
  userId?: string;
  customAttributes?: Record<string, any>;
  enableRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseFeatureFlagResult {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  result: FlagEvaluationResult | null;
  refresh: () => void;
}

/**
 * React hook for feature flag evaluation
 * PATTERN: Reactive feature flag with automatic context management
 */
export function useFeatureFlag(
  flagId: string,
  options: UseFeatureFlagOptions = {}
): UseFeatureFlagResult {
  const [result, setResult] = useState<FlagEvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const manager = useMemo(() => FeatureFlagManager.getInstance(), []);

  // Build evaluation context
  const context = useMemo((): FlagEvaluationContext => ({
    userId: options.userId,
    sessionId: generateSessionId(),
    environment: config.name,
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
    customAttributes: options.customAttributes
  }), [options.userId, options.customAttributes]);

  // Evaluate flag
  const evaluateFlag = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const evaluation = manager.evaluateFlag(flagId, context);
      setResult(evaluation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [manager, flagId, context]);

  // Initial evaluation
  useEffect(() => {
    evaluateFlag();
  }, [evaluateFlag]);

  // Optional periodic refresh
  useEffect(() => {
    if (!options.enableRefresh) return;

    const interval = setInterval(evaluateFlag, options.refreshInterval || 30000);
    return () => clearInterval(interval);
  }, [evaluateFlag, options.enableRefresh, options.refreshInterval]);

  return {
    enabled: result?.enabled || false,
    loading,
    error,
    result,
    refresh: evaluateFlag
  };
}

/**
 * Hook for multiple feature flags
 * PATTERN: Batch evaluation for performance
 */
export function useFeatureFlags(
  flagIds: string[],
  options: UseFeatureFlagOptions = {}
): Record<string, UseFeatureFlagResult> {
  const [results, setResults] = useState<Record<string, UseFeatureFlagResult>>({});

  const manager = useMemo(() => FeatureFlagManager.getInstance(), []);

  const context = useMemo((): FlagEvaluationContext => ({
    userId: options.userId,
    sessionId: generateSessionId(),
    environment: config.name,
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
    customAttributes: options.customAttributes
  }), [options.userId, options.customAttributes]);

  const evaluateFlags = useCallback(() => {
    const newResults: Record<string, UseFeatureFlagResult> = {};

    flagIds.forEach(flagId => {
      try {
        const evaluation = manager.evaluateFlag(flagId, context);
        newResults[flagId] = {
          enabled: evaluation.enabled,
          loading: false,
          error: null,
          result: evaluation,
          refresh: () => evaluateFlags()
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        newResults[flagId] = {
          enabled: false,
          loading: false,
          error: errorMessage,
          result: null,
          refresh: () => evaluateFlags()
        };
      }
    });

    setResults(newResults);
  }, [manager, flagIds, context]);

  useEffect(() => {
    evaluateFlags();
  }, [evaluateFlags]);

  return results;
}

/**
 * Hook for routing-specific feature flags
 * PATTERN: Domain-specific convenience hook
 */
export function useRoutingFeatureFlags() {
  return useFeatureFlags(['newRouting'], {
    enableRefresh: true,
    refreshInterval: 60000 // Check every minute for routing changes
  });
}

/**
 * Simple boolean hook for common use cases
 * PATTERN: Simplified API for basic feature toggle
 */
export function useFeatureFlagEnabled(
  flagId: string,
  options: UseFeatureFlagOptions = {}
): boolean {
  const { enabled } = useFeatureFlag(flagId, options);
  return enabled;
}


/**
 * Generate session ID for consistent feature flag evaluation
 * PATTERN: Stable session identification
 */
function generateSessionId(): string {
  // Try to get existing session ID from sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const existingId = sessionStorage.getItem('theanimalside-session-id');
    if (existingId) {
      return existingId;
    }

    // Generate new session ID
    const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('theanimalside-session-id', newId);
    return newId;
  }

  // Fallback for SSR or when sessionStorage is not available
  return `ssr-session-${Date.now()}`;
}

export default useFeatureFlag;