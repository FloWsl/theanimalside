// Feature Gate Component for Conditional Rendering
// PATTERN: Higher-order component for feature flag gates

import React from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

export interface FeatureGateProps {
  flagId: string;
  userId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component wrapper for feature flag conditional rendering
 * PATTERN: Higher-order component for feature flag gates
 */
export function FeatureGate({ flagId, userId, fallback = null, children }: FeatureGateProps) {
  const { enabled, loading } = useFeatureFlag(flagId, { userId });

  if (loading) {
    return <>{fallback}</>;
  }

  return enabled ? <>{children}</> : <>{fallback}</>;
}

export default FeatureGate;