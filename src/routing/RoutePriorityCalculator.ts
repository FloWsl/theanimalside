/**
 * Route Priority Calculation System
 *
 * Ensures correct React Router ordering to prevent route conflicts.
 * Automated conflict detection and resolution for complex routing patterns.
 *
 * Critical for proper functioning - wrong order = broken routes.
 */

import type { RouteDefinition } from './RouteDefinition';

// ============================================================================
// PRIORITY CALCULATION ENGINE
// ============================================================================

export interface RoutePriorityResult {
  orderedRoutes: RouteDefinition[];
  conflicts: RouteConflict[];
  warnings: string[];
  statistics: PriorityStatistics;
}

export interface RouteConflict {
  route1: RouteDefinition;
  route2: RouteDefinition;
  conflictType: 'path-overlap' | 'parameter-ambiguity' | 'priority-mismatch';
  severity: 'critical' | 'warning' | 'info';
  recommendation: string;
}

export interface PriorityStatistics {
  totalRoutes: number;
  specificityRange: { min: number; max: number; avg: number };
  routesByPriority: Record<string, number>;
  routesByType: Record<string, number>;
  conflictsResolved: number;
}

export class RoutePriorityCalculator {
  private conflicts: RouteConflict[] = [];
  private warnings: string[] = [];

  /**
   * Calculate optimal route ordering to prevent conflicts
   * Returns routes sorted by specificity and priority
   */
  calculateOptimalOrder(routes: RouteDefinition[]): RoutePriorityResult {
    // Clear previous state
    this.conflicts = [];
    this.warnings = [];

    // Step 1: Validate individual routes
    const validatedRoutes = this.validateRoutes(routes);

    // Step 2: Detect potential conflicts
    this.detectConflicts(validatedRoutes);

    // Step 3: Sort routes by calculated priority
    const orderedRoutes = this.sortRoutesByCalculatedPriority(validatedRoutes);

    // Step 4: Final conflict check on ordered routes
    this.validateFinalOrder(orderedRoutes);

    return {
      orderedRoutes,
      conflicts: this.conflicts,
      warnings: this.warnings,
      statistics: this.generateStatistics(orderedRoutes)
    };
  }

  // ========================================================================
  // PRIORITY CALCULATION ALGORITHM
  // ========================================================================

  /**
   * Calculate numeric priority score for route ordering
   * Higher score = higher priority = earlier in React Router
   */
  private calculateRoutePriority(route: RouteDefinition): number {
    let score = 0;

    // 1. Route type priority (static routes first)
    score += this.getTypePriorityScore(route.type);

    // 2. Path specificity (more specific = higher priority)
    score += this.calculatePathSpecificity(route.path);

    // 3. Explicit priority level
    score += this.getPriorityLevelScore(route.priority);

    // 4. SEO importance (high-traffic routes get priority)
    score += this.getSEOPriorityScore(route);

    // 5. Parameter complexity (fewer parameters = higher priority)
    score += this.getParameterComplexityScore(route.path);

    // 6. Special route handling
    score += this.getSpecialRouteScore(route);

    return score;
  }

  private getTypePriorityScore(type: string): number {
    const typeScores = {
      'static': 1000,  // Static routes always first
      'dynamic': 500,  // Dynamic routes in middle
      'system': 100    // System routes last
    };
    return typeScores[type] || 0;
  }

  private calculatePathSpecificity(path: string): number {
    let specificity = 0;

    // Count path segments (more segments = more specific)
    const segments = path.split('/').filter(Boolean);
    specificity += segments.length * 100;

    // Penalize parameters (less specific)
    const paramCount = (path.match(/:/g) || []).length;
    specificity -= paramCount * 50;

    // Heavily penalize catch-all routes
    if (path.includes('*')) {
      specificity -= 1000;
    }

    // Bonus for exact matches vs patterns
    if (!path.includes(':') && !path.includes('*')) {
      specificity += 200; // Exact path bonus
    }

    // Bonus for specific patterns we know are high-priority
    if (this.isHighPriorityPattern(path)) {
      specificity += 150;
    }

    return specificity;
  }

  private getPriorityLevelScore(priority: string): number {
    const priorityScores = {
      'critical': 400,
      'high': 300,
      'medium': 200,
      'low': 100
    };
    return priorityScores[priority] || 0;
  }

  private getSEOPriorityScore(route: RouteDefinition): number {
    // High SEO priority routes get bonus points
    return route.seo.priority * 100;
  }

  private getParameterComplexityScore(path: string): number {
    const paramCount = (path.match(/:/g) || []).length;

    // Heavy penalty for multiple parameters (most complex)
    if (paramCount >= 2) return -100;
    if (paramCount === 1) return -50;
    return 0; // No parameters = no penalty
  }

  private getSpecialRouteScore(route: RouteDefinition): number {
    let score = 0;

    // Critical system routes
    if (route.path === '/') score += 500;                    // Home page always first
    if (route.path === '/opportunities') score += 450;      // Main content page
    if (route.path === '*') score -= 2000;                  // Catch-all always last
    if (route.path === '/404') score -= 1000;               // 404 before catch-all

    // High-traffic SEO routes get priority
    if (this.isHighTrafficRoute(route.path)) {
      score += 300;
    }

    // Organization routes need to be last among dynamic routes
    if (route.path === '/:orgSlug') {
      score -= 500; // Ensure it comes after other patterns
    }

    return score;
  }

  private isHighPriorityPattern(path: string): boolean {
    const highPriorityPatterns = [
      '/volunteer-costa-rica',
      '/volunteer-thailand',
      '/volunteer-south-africa',
      '/lions-volunteer',
      '/elephants-volunteer',
      '/sea-turtles-volunteer'
    ];
    return highPriorityPatterns.includes(path);
  }

  private isHighTrafficRoute(path: string): boolean {
    // Match against known high-traffic patterns
    const highTrafficPatterns = [
      /^\/volunteer-(costa-rica|thailand|south-africa)$/,
      /^\/(lions|elephants|sea-turtles)-volunteer$/,
      /^\/volunteer-(costa-rica|thailand)\/[^/]+$/,
      /^\/(lions|elephants|sea-turtles)-volunteer\/[^/]+$/
    ];

    return highTrafficPatterns.some(pattern => pattern.test(path));
  }

  // ========================================================================
  // CONFLICT DETECTION
  // ========================================================================

  private detectConflicts(routes: RouteDefinition[]): void {
    for (let i = 0; i < routes.length; i++) {
      for (let j = i + 1; j < routes.length; j++) {
        const conflicts = this.checkRouteConflict(routes[i], routes[j]);
        this.conflicts.push(...conflicts);
      }
    }
  }

  private checkRouteConflict(route1: RouteDefinition, route2: RouteDefinition): RouteConflict[] {
    const conflicts: RouteConflict[] = [];

    // Check for path overlap conflicts
    if (this.hasPathOverlap(route1.path, route2.path)) {
      conflicts.push({
        route1,
        route2,
        conflictType: 'path-overlap',
        severity: this.determineConflictSeverity(route1, route2),
        recommendation: this.generateConflictRecommendation(route1, route2, 'path-overlap')
      });
    }

    // Check for parameter ambiguity
    if (this.hasParameterAmbiguity(route1.path, route2.path)) {
      conflicts.push({
        route1,
        route2,
        conflictType: 'parameter-ambiguity',
        severity: 'warning',
        recommendation: this.generateConflictRecommendation(route1, route2, 'parameter-ambiguity')
      });
    }

    // Check for priority mismatches
    if (this.hasPriorityMismatch(route1, route2)) {
      conflicts.push({
        route1,
        route2,
        conflictType: 'priority-mismatch',
        severity: 'info',
        recommendation: this.generateConflictRecommendation(route1, route2, 'priority-mismatch')
      });
    }

    return conflicts;
  }

  private hasPathOverlap(path1: string, path2: string): boolean {
    // Convert paths to regex patterns for overlap detection
    const pattern1 = this.pathToRegex(path1);
    const pattern2 = this.pathToRegex(path2);

    // Test if either pattern could match the other's examples
    const testPaths1 = this.generateTestPaths(path1);
    const testPaths2 = this.generateTestPaths(path2);

    // Check if path1 could match path2's test cases
    const path1MatchesPath2 = testPaths2.some(testPath => pattern1.test(testPath));
    // Check if path2 could match path1's test cases
    const path2MatchesPath1 = testPaths1.some(testPath => pattern2.test(testPath));

    return path1MatchesPath2 || path2MatchesPath1;
  }

  private hasParameterAmbiguity(path1: string, path2: string): boolean {
    // Look for routes that have similar parameter patterns
    const params1 = this.extractParameters(path1);
    const params2 = this.extractParameters(path2);

    if (params1.length === 0 || params2.length === 0) return false;

    // Check if routes have same parameter structure but different names
    return params1.length === params2.length &&
           this.haveSimilarStructure(path1, path2) &&
           !this.areIdenticalPaths(path1, path2);
  }

  private hasPriorityMismatch(route1: RouteDefinition, route2: RouteDefinition): boolean {
    const score1 = this.calculateRoutePriority(route1);
    const score2 = this.calculateRoutePriority(route2);

    // Check if explicit priority doesn't match calculated priority
    const priority1Value = this.priorityToNumber(route1.priority);
    const priority2Value = this.priorityToNumber(route2.priority);

    const calculatedOrder = score1 > score2 ? 1 : -1; // 1 if route1 should come first
    const explicitOrder = priority1Value > priority2Value ? 1 : -1;

    return calculatedOrder !== explicitOrder;
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private pathToRegex(path: string): RegExp {
    // Convert React Router path to regex
    const regexPattern = path
      .replace(/\//g, '\\/')           // Escape slashes
      .replace(/:(\w+)/g, '([^/]+)')   // Parameters to capture groups
      .replace(/\*/g, '.*');           // Wildcards

    return new RegExp(`^${regexPattern}$`);
  }

  private generateTestPaths(path: string): string[] {
    // Generate example paths that would match this pattern
    const testPaths: string[] = [];

    if (path.includes(':')) {
      // Generate examples for parameterized paths
      if (path.includes(':country')) {
        testPaths.push(path.replace(':country', 'costa-rica'));
        testPaths.push(path.replace(':country', 'thailand'));
      }
      if (path.includes(':animal')) {
        testPaths.push(path.replace(':animal', 'lions'));
        testPaths.push(path.replace(':animal', 'elephants'));
      }
      if (path.includes(':orgSlug')) {
        testPaths.push(path.replace(':orgSlug', 'test-organization'));
      }
    } else {
      // For exact paths, just use the path itself
      testPaths.push(path);
    }

    return testPaths;
  }

  private extractParameters(path: string): string[] {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map(match => match.slice(1)) : [];
  }

  private haveSimilarStructure(path1: string, path2: string): boolean {
    // Remove parameters and compare structure
    const structure1 = path1.replace(/:(\w+)/g, ':param');
    const structure2 = path2.replace(/:(\w+)/g, ':param');
    return structure1 === structure2;
  }

  private areIdenticalPaths(path1: string, path2: string): boolean {
    return path1 === path2;
  }

  private priorityToNumber(priority: string): number {
    const mapping = { critical: 4, high: 3, medium: 2, low: 1 };
    return mapping[priority] || 0;
  }

  private determineConflictSeverity(route1: RouteDefinition, route2: RouteDefinition): 'critical' | 'warning' | 'info' {
    // Critical if both routes are high priority and have path overlap
    if ((route1.priority === 'critical' || route1.priority === 'high') &&
        (route2.priority === 'critical' || route2.priority === 'high')) {
      return 'critical';
    }

    // Warning if one route is high priority
    if (route1.priority === 'critical' || route2.priority === 'critical') {
      return 'warning';
    }

    return 'info';
  }

  private generateConflictRecommendation(
    route1: RouteDefinition,
    route2: RouteDefinition,
    conflictType: string
  ): string {
    switch (conflictType) {
      case 'path-overlap':
        return `Consider reordering routes or making paths more specific. Route "${route1.path}" may shadow "${route2.path}".`;

      case 'parameter-ambiguity':
        return `Routes "${route1.path}" and "${route2.path}" have similar parameter patterns. Consider different naming or structure.`;

      case 'priority-mismatch':
        return `Explicit priority (${route1.priority}/${route2.priority}) doesn't match calculated priority. Review priority assignments.`;

      default:
        return 'Review route configuration for potential conflicts.';
    }
  }

  // ========================================================================
  // SORTING AND VALIDATION
  // ========================================================================

  private sortRoutesByCalculatedPriority(routes: RouteDefinition[]): RouteDefinition[] {
    return routes
      .map(route => ({
        route,
        priority: this.calculateRoutePriority(route)
      }))
      .sort((a, b) => b.priority - a.priority) // Higher priority first
      .map(item => item.route);
  }

  private validateRoutes(routes: RouteDefinition[]): RouteDefinition[] {
    return routes.filter(route => {
      if (!route.path || !route.component) {
        this.warnings.push(`Invalid route definition: ${route.id}`);
        return false;
      }
      return true;
    });
  }

  private validateFinalOrder(routes: RouteDefinition[]): void {
    // Check that catch-all is last
    const catchAllIndex = routes.findIndex(r => r.path === '*');
    if (catchAllIndex !== -1 && catchAllIndex !== routes.length - 1) {
      this.warnings.push('Catch-all route (*) should be last in the route list');
    }

    // Check that home page is first
    const homeIndex = routes.findIndex(r => r.path === '/');
    if (homeIndex !== -1 && homeIndex !== 0) {
      this.warnings.push('Home page route (/) should be first in the route list');
    }

    // Check for critical conflicts in final order
    for (let i = 0; i < routes.length - 1; i++) {
      const currentRoute = routes[i];
      const nextRoute = routes[i + 1];

      if (this.hasPathOverlap(currentRoute.path, nextRoute.path)) {
        const severity = this.determineConflictSeverity(currentRoute, nextRoute);
        if (severity === 'critical') {
          this.warnings.push(
            `Critical route conflict: "${currentRoute.path}" may shadow "${nextRoute.path}"`
          );
        }
      }
    }
  }

  private generateStatistics(routes: RouteDefinition[]): PriorityStatistics {
    const priorities = routes.map(r => this.calculateRoutePriority(r));

    return {
      totalRoutes: routes.length,
      specificityRange: {
        min: Math.min(...priorities),
        max: Math.max(...priorities),
        avg: priorities.reduce((a, b) => a + b, 0) / priorities.length
      },
      routesByPriority: routes.reduce((acc, route) => {
        acc[route.priority] = (acc[route.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      routesByType: routes.reduce((acc, route) => {
        acc[route.type] = (acc[route.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      conflictsResolved: this.conflicts.length
    };
  }
}

export default RoutePriorityCalculator;