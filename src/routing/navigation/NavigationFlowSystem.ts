/**
 * Navigation Flow Architecture System
 *
 * Preserves and enhances the sophisticated UX navigation patterns that enable
 * seamless user flow between country pages, animal pages, and combined pages.
 *
 * Key Features:
 * - Explicit navigation flow definitions
 * - Context preservation across route transitions
 * - Analytics tracking for navigation patterns
 * - Bidirectional route equivalence management
 */

import type { RouteDefinition } from './RouteDefinition';

// ============================================================================
// NAVIGATION FLOW TYPES
// ============================================================================

export interface NavigationFlow {
  id: string;
  fromPattern: string;              // Source route pattern
  toPattern: string;                // Destination route pattern
  trigger: NavigationTrigger;
  preserveContext: boolean;
  analyticsEvent: string;
  weight: number;                   // Flow priority (1-10)
  conditions?: NavigationCondition[];
  transformations?: ContextTransformation[];
}

export type NavigationTrigger =
  | 'click'           // User clicks navigation element
  | 'filter'          // User applies filter
  | 'search'          // User performs search
  | 'breadcrumb'      // User clicks breadcrumb
  | 'canonical'       // Automatic canonical redirect
  | 'suggestion'      // From 404 suggestion
  | 'back'            // Browser back button
  | 'bookmark';       // Direct bookmark access

export interface NavigationCondition {
  type: 'parameter' | 'context' | 'data' | 'device';
  check: string;                    // Condition expression
  required: boolean;
}

export interface ContextTransformation {
  source: string;                   // Source context key
  target: string;                   // Target context key
  transform?: (value: any) => any;  // Optional transformation function
}

export interface NavigationContext {
  searchFilters?: Record<string, any>;
  scrollPosition?: number;
  selectedProgram?: string;
  userPreferences?: Record<string, any>;
  currentRoute?: string;
  parameters?: Record<string, string>;
}

export interface FlowValidationResult {
  isValid: boolean;
  redirectTo?: string;
  preservedContext?: NavigationContext;
  analyticsData?: Record<string, any>;
  issues?: string[];
}

// ============================================================================
// NAVIGATION FLOW DEFINITIONS
// ============================================================================

/**
 * Core navigation flows that preserve the sophisticated UX patterns
 * identified in Phase 1 analysis.
 */
export const CORE_NAVIGATION_FLOWS: NavigationFlow[] = [
  // ========================================================================
  // COUNTRY → ANIMAL FLOWS (Progressive Discovery)
  // ========================================================================
  {
    id: 'country-to-animal-specific',
    fromPattern: '/volunteer-:country',
    toPattern: '/volunteer-:country/:animal',
    trigger: 'click',
    preserveContext: true,
    analyticsEvent: 'country_to_animal_navigation',
    weight: 9,
    transformations: [
      { source: 'country', target: 'country' }, // Preserve country context
      { source: 'animalSelection', target: 'animal' }
    ]
  },

  {
    id: 'country-to-animal-list',
    fromPattern: '/volunteer-:country',
    toPattern: '/opportunities',
    trigger: 'filter',
    preserveContext: true,
    analyticsEvent: 'country_to_filtered_opportunities',
    weight: 7,
    transformations: [
      { source: 'country', target: 'locationFilter' }
    ]
  },

  // ========================================================================
  // ANIMAL → COUNTRY FLOWS (Progressive Discovery)
  // ========================================================================
  {
    id: 'animal-to-country-specific',
    fromPattern: '/:animal-volunteer',
    toPattern: '/:animal-volunteer/:country',
    trigger: 'click',
    preserveContext: true,
    analyticsEvent: 'animal_to_country_navigation',
    weight: 9,
    transformations: [
      { source: 'animal', target: 'animal' }, // Preserve animal context
      { source: 'countrySelection', target: 'country' }
    ]
  },

  {
    id: 'animal-to-country-list',
    fromPattern: '/:animal-volunteer',
    toPattern: '/opportunities',
    trigger: 'filter',
    preserveContext: true,
    analyticsEvent: 'animal_to_filtered_opportunities',
    weight: 7,
    transformations: [
      { source: 'animal', target: 'animalTypeFilter' }
    ]
  },

  // ========================================================================
  // BIDIRECTIONAL EQUIVALENCE FLOWS
  // ========================================================================
  {
    id: 'bidirectional-canonical-country-first',
    fromPattern: '/:animal-volunteer/:country',
    toPattern: '/volunteer-:country/:animal',
    trigger: 'canonical',
    preserveContext: true,
    analyticsEvent: 'bidirectional_canonical_redirect',
    weight: 10,
    conditions: [
      { type: 'parameter', check: 'animal.exists && country.exists', required: true }
    ],
    transformations: [
      { source: 'animal', target: 'animal' },
      { source: 'country', target: 'country' }
    ]
  },

  {
    id: 'bidirectional-equivalent-access',
    fromPattern: '/volunteer-:country/:animal',
    toPattern: '/:animal-volunteer/:country',
    trigger: 'bookmark',
    preserveContext: true,
    analyticsEvent: 'bidirectional_equivalent_access',
    weight: 8,
    transformations: [
      { source: 'country', target: 'country' },
      { source: 'animal', target: 'animal' }
    ]
  },

  // ========================================================================
  // OPPORTUNITIES HUB FLOWS
  // ========================================================================
  {
    id: 'opportunities-to-country',
    fromPattern: '/opportunities',
    toPattern: '/volunteer-:country',
    trigger: 'click',
    preserveContext: false, // Fresh country exploration
    analyticsEvent: 'opportunities_to_country',
    weight: 6,
    transformations: [
      { source: 'selectedCountry', target: 'country' }
    ]
  },

  {
    id: 'opportunities-to-animal',
    fromPattern: '/opportunities',
    toPattern: '/:animal-volunteer',
    trigger: 'click',
    preserveContext: false, // Fresh animal exploration
    analyticsEvent: 'opportunities_to_animal',
    weight: 6,
    transformations: [
      { source: 'selectedAnimal', target: 'animal' }
    ]
  },

  {
    id: 'opportunities-to-combined',
    fromPattern: '/opportunities',
    toPattern: '/volunteer-:country/:animal',
    trigger: 'click',
    preserveContext: false, // Direct access to specific combination
    analyticsEvent: 'opportunities_to_combined',
    weight: 8,
    transformations: [
      { source: 'selectedCountry', target: 'country' },
      { source: 'selectedAnimal', target: 'animal' }
    ]
  },

  // ========================================================================
  // ORGANIZATION FLOWS
  // ========================================================================
  {
    id: 'combined-to-organization',
    fromPattern: '/volunteer-:country/:animal',
    toPattern: '/:orgSlug',
    trigger: 'click',
    preserveContext: true,
    analyticsEvent: 'combined_to_organization',
    weight: 10, // High conversion flow
    conditions: [
      { type: 'data', check: 'organization.exists', required: true }
    ],
    transformations: [
      { source: 'selectedOrganization', target: 'orgSlug' },
      { source: 'country', target: 'referralCountry' },
      { source: 'animal', target: 'referralAnimal' }
    ]
  },

  {
    id: 'country-to-organization',
    fromPattern: '/volunteer-:country',
    toPattern: '/:orgSlug',
    trigger: 'click',
    preserveContext: true,
    analyticsEvent: 'country_to_organization',
    weight: 8,
    transformations: [
      { source: 'selectedOrganization', target: 'orgSlug' },
      { source: 'country', target: 'referralCountry' }
    ]
  },

  {
    id: 'animal-to-organization',
    fromPattern: '/:animal-volunteer',
    toPattern: '/:orgSlug',
    trigger: 'click',
    preserveContext: true,
    analyticsEvent: 'animal_to_organization',
    weight: 8,
    transformations: [
      { source: 'selectedOrganization', target: 'orgSlug' },
      { source: 'animal', target: 'referralAnimal' }
    ]
  },

  // ========================================================================
  // RECOVERY FLOWS (404 → Valid Routes)
  // ========================================================================
  {
    id: 'recovery-to-similar-country',
    fromPattern: '*',
    toPattern: '/volunteer-:country',
    trigger: 'suggestion',
    preserveContext: false,
    analyticsEvent: '404_recovery_to_country',
    weight: 5,
    conditions: [
      { type: 'context', check: 'attemptedRoute.type === "country"', required: true }
    ]
  },

  {
    id: 'recovery-to-similar-animal',
    fromPattern: '*',
    toPattern: '/:animal-volunteer',
    trigger: 'suggestion',
    preserveContext: false,
    analyticsEvent: '404_recovery_to_animal',
    weight: 5,
    conditions: [
      { type: 'context', check: 'attemptedRoute.type === "animal"', required: true }
    ]
  },

  {
    id: 'recovery-to-opportunities',
    fromPattern: '*',
    toPattern: '/opportunities',
    trigger: 'suggestion',
    preserveContext: false,
    analyticsEvent: '404_recovery_to_opportunities',
    weight: 4
  },

  // ========================================================================
  // HOME PAGE FLOWS
  // ========================================================================
  {
    id: 'home-to-opportunities',
    fromPattern: '/',
    toPattern: '/opportunities',
    trigger: 'click',
    preserveContext: false,
    analyticsEvent: 'home_to_opportunities',
    weight: 7
  },

  {
    id: 'home-to-country',
    fromPattern: '/',
    toPattern: '/volunteer-:country',
    trigger: 'click',
    preserveContext: false,
    analyticsEvent: 'home_to_country',
    weight: 6
  },

  {
    id: 'home-to-animal',
    fromPattern: '/',
    toPattern: '/:animal-volunteer',
    trigger: 'click',
    preserveContext: false,
    analyticsEvent: 'home_to_animal',
    weight: 6
  }
];

// ============================================================================
// NAVIGATION FLOW VALIDATOR
// ============================================================================

export class NavigationFlowValidator {
  private flows: Map<string, NavigationFlow>;
  private routeDefinitions: Map<string, RouteDefinition>;

  constructor(flows: NavigationFlow[], routes: RouteDefinition[]) {
    this.flows = new Map(flows.map(flow => [flow.id, flow]));
    this.routeDefinitions = new Map(routes.map(route => [route.path, route]));
  }

  /**
   * Validate all navigation flows for correctness and completeness
   */
  validateAllFlows(): FlowValidationResult[] {
    return Array.from(this.flows.values()).map(flow => this.validateSingleFlow(flow));
  }

  /**
   * Validate a specific navigation flow
   */
  validateSingleFlow(flow: NavigationFlow): FlowValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check that flow patterns exist in route definitions
    const fromRouteExists = this.patternExistsInRoutes(flow.fromPattern);
    const toRouteExists = this.patternExistsInRoutes(flow.toPattern);

    if (!fromRouteExists) {
      issues.push(`Source pattern "${flow.fromPattern}" not found in route definitions`);
    }

    if (!toRouteExists) {
      issues.push(`Target pattern "${flow.toPattern}" not found in route definitions`);
    }

    // Validate analytics event naming
    if (!flow.analyticsEvent || flow.analyticsEvent.length === 0) {
      issues.push('Analytics event is required');
    }

    // Validate weight range
    if (flow.weight < 1 || flow.weight > 10) {
      issues.push('Flow weight must be between 1 and 10');
    }

    // Validate context transformations
    if (flow.preserveContext && (!flow.transformations || flow.transformations.length === 0)) {
      suggestions.push('Consider adding context transformations for context-preserving flows');
    }

    // Validate critical flows have high weight
    if (this.isCriticalFlow(flow) && flow.weight < 7) {
      suggestions.push('Critical navigation flows should have weight >= 7');
    }

    return {
      flow,
      isValid: issues.length === 0,
      issues,
      suggestions,
      contextPreserved: flow.preserveContext
    };
  }

  /**
   * Find all flows from a specific route pattern
   */
  getFlowsFromPattern(pattern: string): NavigationFlow[] {
    return Array.from(this.flows.values()).filter(flow =>
      this.patternsMatch(flow.fromPattern, pattern)
    );
  }

  /**
   * Find all flows to a specific route pattern
   */
  getFlowsToPattern(pattern: string): NavigationFlow[] {
    return Array.from(this.flows.values()).filter(flow =>
      this.patternsMatch(flow.toPattern, pattern)
    );
  }

  /**
   * Get flows by trigger type
   */
  getFlowsByTrigger(trigger: NavigationTrigger): NavigationFlow[] {
    return Array.from(this.flows.values()).filter(flow => flow.trigger === trigger);
  }

  /**
   * Validate that critical UX patterns are preserved
   */
  validateCriticalPatterns(): {
    countryToAnimal: boolean;
    animalToCountry: boolean;
    bidirectionalEquivalence: boolean;
    progressiveDiscovery: boolean;
  } {
    const results = {
      countryToAnimal: false,
      animalToCountry: false,
      bidirectionalEquivalence: false,
      progressiveDiscovery: false
    };

    // Check Country → Animal flow exists
    results.countryToAnimal = this.flows.has('country-to-animal-specific');

    // Check Animal → Country flow exists
    results.animalToCountry = this.flows.has('animal-to-country-specific');

    // Check bidirectional equivalence
    results.bidirectionalEquivalence = this.flows.has('bidirectional-canonical-country-first');

    // Check progressive discovery flows
    const progressiveFlows = [
      'country-to-animal-list',
      'animal-to-country-list',
      'opportunities-to-country',
      'opportunities-to-animal'
    ];
    results.progressiveDiscovery = progressiveFlows.every(flowId => this.flows.has(flowId));

    return results;
  }

  // ========================================================================
  // PRIVATE VALIDATION HELPERS
  // ========================================================================

  private patternExistsInRoutes(pattern: string): boolean {
    // Check exact pattern match
    if (this.routeDefinitions.has(pattern)) {
      return true;
    }

    // Check if pattern matches any route definition pattern
    const routePaths = Array.from(this.routeDefinitions.keys());
    return routePaths.some(path => this.patternsMatch(pattern, path));
  }

  private patternsMatch(pattern1: string, pattern2: string): boolean {
    // Handle exact matches
    if (pattern1 === pattern2) return true;

    // Handle wildcard patterns
    if (pattern1 === '*' || pattern2 === '*') return true;

    // Handle parameter patterns
    const regex1 = this.patternToRegex(pattern1);
    const regex2 = this.patternToRegex(pattern2);

    // Test if patterns could match the same routes
    const testPaths = ['/volunteer-costa-rica', '/lions-volunteer', '/volunteer-costa-rica/lions'];
    return testPaths.some(testPath => regex1.test(testPath) && regex2.test(testPath));
  }

  private patternToRegex(pattern: string): RegExp {
    const regexPattern = pattern
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^/]+)')
      .replace(/\*/g, '.*');

    return new RegExp(`^${regexPattern}$`);
  }

  private isCriticalFlow(flow: NavigationFlow): boolean {
    const criticalFlowIds = [
      'country-to-animal-specific',
      'animal-to-country-specific',
      'bidirectional-canonical-country-first',
      'combined-to-organization'
    ];
    return criticalFlowIds.includes(flow.id);
  }
}

// ============================================================================
// NAVIGATION ANALYTICS TRACKER
// ============================================================================

export class NavigationAnalyticsTracker {
  private flowMetrics: Map<string, {
    count: number;
    avgDuration: number;
    conversionRate: number;
    lastTracked: number;
  }> = new Map();

  /**
   * Track a navigation flow execution
   */
  trackFlow(
    flowId: string,
    context: NavigationContext,
    duration: number,
    successful: boolean
  ): void {
    const existing = this.flowMetrics.get(flowId) || {
      count: 0,
      avgDuration: 0,
      conversionRate: 0,
      lastTracked: 0
    };

    // Update metrics
    existing.count++;
    existing.avgDuration = (existing.avgDuration * (existing.count - 1) + duration) / existing.count;
    existing.conversionRate = successful
      ? (existing.conversionRate * (existing.count - 1) + 1) / existing.count
      : (existing.conversionRate * (existing.count - 1)) / existing.count;
    existing.lastTracked = Date.now();

    this.flowMetrics.set(flowId, existing);
  }

  /**
   * Get analytics for a specific flow
   */
  getFlowAnalytics(flowId: string) {
    return this.flowMetrics.get(flowId) || null;
  }

  /**
   * Get top performing flows
   */
  getTopFlows(limit: number = 10): Array<{ flowId: string; metrics: any }> {
    return Array.from(this.flowMetrics.entries())
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([flowId, metrics]) => ({ flowId, metrics }));
  }

  /**
   * Get conversion funnel analysis
   */
  getConversionFunnel(): {
    entryPoints: Record<string, number>;
    exitPoints: Record<string, number>;
    topPaths: Array<{ path: string; count: number }>;
  } {
    // This would be enhanced with real analytics data
    return {
      entryPoints: {
        '/': 45,
        '/opportunities': 30,
        '/volunteer-costa-rica': 15,
        '/lions-volunteer': 10
      },
      exitPoints: {
        'organization': 60,
        'opportunities': 25,
        'back': 10,
        'external': 5
      },
      topPaths: [
        { path: '/ → /opportunities → /volunteer-costa-rica → org', count: 120 },
        { path: '/ → /lions-volunteer → /lions-volunteer/south-africa → org', count: 85 },
        { path: '/opportunities → /volunteer-costa-rica/sea-turtles → org', count: 67 }
      ]
    };
  }
}

// ============================================================================
// NAVIGATION FLOW SYSTEM (Main Integration Class)
// ============================================================================

export class NavigationFlowSystem {
  private flows: NavigationFlow[] = [];
  private currentContext: NavigationContext = {
    currentRoute: '',
    parameters: {}
  };

  constructor() {
    this.initializeFlows();
  }

  /**
   * Initialize all navigation flows from Phase 2 specification
   */
  private initializeFlows(): void {
    this.flows = [
      // Core navigation flows (Phase 1 preservation)
      {
        id: 'country-to-animal',
        fromPattern: '/volunteer-:country',
        toPattern: '/volunteer-:country/:animal',
        trigger: 'click',
        preserveContext: true,
        analyticsEvent: 'country_to_animal_navigation',
        weight: 10
      },
      {
        id: 'animal-to-country',
        fromPattern: '/:animal-volunteer',
        toPattern: '/:animal-volunteer/:country',
        trigger: 'click',
        preserveContext: true,
        analyticsEvent: 'animal_to_country_navigation',
        weight: 10
      },

      // Bidirectional equivalence flows
      {
        id: 'bidirectional-access',
        fromPattern: '/volunteer-:country/:animal',
        toPattern: '/:animal-volunteer/:country',
        trigger: 'canonical',
        preserveContext: true,
        analyticsEvent: 'bidirectional_route_access',
        weight: 8
      },

      // Progressive discovery flows
      {
        id: 'opportunities-to-country',
        fromPattern: '/opportunities',
        toPattern: '/volunteer-:country',
        trigger: 'filter',
        preserveContext: true,
        analyticsEvent: 'opportunities_to_country',
        weight: 9
      },
      {
        id: 'opportunities-to-animal',
        fromPattern: '/opportunities',
        toPattern: '/:animal-volunteer',
        trigger: 'filter',
        preserveContext: true,
        analyticsEvent: 'opportunities_to_animal',
        weight: 9
      },

      // Search-driven flows
      {
        id: 'home-to-country-search',
        fromPattern: '/',
        toPattern: '/volunteer-:country',
        trigger: 'search',
        preserveContext: false,
        analyticsEvent: 'home_to_country_search',
        weight: 7
      },
      {
        id: 'home-to-animal-search',
        fromPattern: '/',
        toPattern: '/:animal-volunteer',
        trigger: 'search',
        preserveContext: false,
        analyticsEvent: 'home_to_animal_search',
        weight: 7
      }
    ];

    console.log(`🚀 NavigationFlowSystem: Initialized ${this.flows.length} navigation flows`);
  }

  /**
   * Validate and execute navigation from one route to another
   */
  async validateNavigation(
    fromRoute: string,
    toRoute: string,
    trigger: NavigationTrigger,
    context?: NavigationContext
  ): Promise<FlowValidationResult> {
    // Find matching flow
    const flow = this.findMatchingFlow(fromRoute, toRoute, trigger);

    if (!flow) {
      return {
        isValid: false,
        issues: [`No matching navigation flow found for ${fromRoute} -> ${toRoute} (${trigger})`],
        analyticsData: {
          flow: 'unmatched_navigation',
          from: fromRoute,
          to: toRoute,
          trigger
        }
      };
    }

    // Update current context if preservation is enabled
    if (flow.preserveContext && context) {
      this.currentContext = { ...this.currentContext, ...context };
    }

    return {
      isValid: true,
      preservedContext: flow.preserveContext ? { ...this.currentContext, ...context } : undefined,
      analyticsData: {
        flow: flow.analyticsEvent,
        from: fromRoute,
        to: toRoute,
        trigger,
        priority: flow.weight > 7 ? 'high' : flow.weight > 4 ? 'medium' : 'low'
      }
    };
  }

  /**
   * Get available navigation options from current route
   */
  getNavigationOptions(currentRoute: string): Array<{
    targetRoute: string;
    trigger: NavigationTrigger;
    priority: 'high' | 'medium' | 'low';
    analytics: string;
    weight?: number;
    analyticsEvent?: string;
  }> {
    return this.flows
      .filter(flow => this.routeMatches(currentRoute, flow.fromPattern))
      .map(flow => ({
        targetRoute: flow.toPattern,
        trigger: flow.trigger,
        priority: flow.weight > 7 ? 'high' as const : flow.weight > 4 ? 'medium' as const : 'low' as const,
        analytics: flow.analyticsEvent,
        weight: flow.weight,
        analyticsEvent: flow.analyticsEvent
      }))
      .sort((a, b) => b.weight - a.weight);
  }

  /**
   * Context management for navigation flows
   */
  setNavigationContext(context: NavigationContext): void {
    this.currentContext = { ...this.currentContext, ...context };
  }

  getNavigationContext(): NavigationContext {
    return { ...this.currentContext };
  }

  clearNavigationContext(): void {
    this.currentContext = {
      currentRoute: '',
      parameters: {}
    };
  }

  /**
   * Generate navigation links with proper context preservation
   */
  generateNavigationLink(
    fromRoute: string,
    toRoute: string,
    trigger: NavigationTrigger,
    additionalParams?: Record<string, string>
  ): {
    href: string;
    onClick?: () => void;
    'data-analytics'?: string;
  } {
    const flow = this.findMatchingFlow(fromRoute, toRoute, trigger);

    if (!flow) {
      return { href: toRoute };
    }

    return {
      href: toRoute,
      onClick: () => {
        this.validateNavigation(fromRoute, toRoute, trigger, this.currentContext);
      },
      'data-analytics': flow.analyticsEvent
    };
  }

  /**
   * Private helper methods
   */
  private findMatchingFlow(
    fromRoute: string,
    toRoute: string,
    trigger: NavigationTrigger
  ): NavigationFlow | null {
    return this.flows.find(flow =>
      this.routeMatches(fromRoute, flow.fromPattern) &&
      this.routeMatches(toRoute, flow.toPattern) &&
      flow.trigger === trigger
    ) || null;
  }

  private routeMatches(actualRoute: string, pattern: string): boolean {
    if (pattern === '*') return true;
    if (pattern === actualRoute) return true;

    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/:[^/]+/g, '[^/]+')  // Parameters match non-slash characters
      .replace(/\*/g, '.*')         // Wildcards match anything
      .replace(/\//g, '\\/');       // Escape slashes

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(actualRoute);
  }
}

export { NavigationFlowValidator };
export default NavigationFlowValidator;