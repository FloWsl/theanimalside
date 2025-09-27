// src/routing/core/RouteDefinition.ts
// IMPLEMENTATION TARGET: Exact Phase 2 specification

export interface RouteDefinition {
  id: string;
  path: string;
  component: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'static' | 'dynamic' | 'legacy' | 'system';
  validation?: RouteValidationRule[];
  seo: SEOMetadata;
  performance: PerformanceConfig;
  navigation: NavigationMetadata;
}

export interface RouteValidationRule {
  field: string;
  validator: (value: string) => Promise<boolean>;
  errorMessage: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  structuredData?: Record<string, any>;
  canonical?: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

export interface PerformanceConfig {
  lazyLoad: boolean;
  preload: 'immediate' | 'hover' | 'none';
  cacheStrategy: 'aggressive' | 'normal' | 'none';
  bundleSplit: boolean;
}

export interface NavigationMetadata {
  enabledFlows: string[];
  contextPreservation: boolean;
  analyticsEvents: string[];
  breadcrumbPath: string[];
}

export interface RouteValidationResult {
  isValid: boolean;
  route?: RouteDefinition;
  reason?: string;
  confidence?: number;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

// Route categories based on Phase 1 findings
export type RouteCategory = 'core' | 'country' | 'animal' | 'combined' | 'organization' | 'system';

export interface RouteMetadata {
  category: RouteCategory;
  dataSource: 'static' | 'opportunities' | 'organizations';
  cacheStrategy: 'aggressive' | 'normal' | 'none';
  preloadStrategy: 'immediate' | 'hover' | 'none';
}