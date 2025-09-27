// src/routing/hooks/useRoutePerformance.ts
// IMPLEMENTATION TARGET: React hook for performance monitoring

import { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { RoutePerformanceMonitor, PerformanceAlert } from '../performance/RoutePerformanceMonitor';

// Global performance monitor instance
const globalMonitor = new RoutePerformanceMonitor();

export const useRoutePerformance = (routeId?: string) => {
  const location = useLocation();
  const renderStartTime = useRef<number>(performance.now());
  const currentRouteId = routeId || location.pathname;

  // Track route rendering time
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;

    globalMonitor.trackRouteRendering(currentRouteId, renderDuration, true);

    return () => {
      // Track when component unmounts (for navigation timing)
      const navigationTime = performance.now() - renderStartTime.current;
      if (navigationTime > 100) { // Only track significant navigation times
        globalMonitor.trackNavigation(
          'previous-route',
          currentRouteId,
          navigationTime,
          true
        );
      }
    };
  }, [currentRouteId]);

  return {
    trackValidation: (duration: number, success: boolean) =>
      globalMonitor.trackRouteValidation(currentRouteId, duration, success),

    trackResolution: (duration: number, success: boolean) =>
      globalMonitor.trackRouteResolution(currentRouteId, duration, success),

    getPerformance: () => globalMonitor.getRoutePerformance(currentRouteId),

    getSystemHealth: () => globalMonitor.getSystemHealth(),

    onAlert: (callback: (alert: PerformanceAlert) => void) =>
      globalMonitor.onAlert(callback)
  };
};

export const useSystemPerformance = () => {
  return {
    monitor: globalMonitor,
    getSystemHealth: () => globalMonitor.getSystemHealth(),
    getRecentAlerts: (limit?: number) => globalMonitor.getRecentAlerts(limit),
    getOptimizationRecommendations: () => globalMonitor.getOptimizationRecommendations(),
    exportMetrics: (timeRange?: { start: number; end: number }) =>
      globalMonitor.exportMetrics(timeRange),
    cleanup: () => globalMonitor.cleanup()
  };
};

export { globalMonitor as routePerformanceMonitor };