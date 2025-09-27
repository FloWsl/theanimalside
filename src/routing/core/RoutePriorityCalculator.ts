// src/routing/core/RoutePriorityCalculator.ts
// IMPLEMENTATION TARGET: Automated route ordering that prevents conflicts

import { RouteDefinition } from './RouteDefinition';

export interface RouteOrderingResult {
  orderedRoutes: RouteDefinition[];
  conflicts: RouteConflict[];
  warnings: RouteWarning[];
}

export interface RouteConflict {
  route1: RouteDefinition;
  route2: RouteDefinition;
  conflictType: 'path-overlap' | 'parameter-conflict' | 'catch-all-early';
  severity: 'critical' | 'warning' | 'info';
  suggestion: string;
}

export interface RouteWarning {
  route: RouteDefinition;
  warningType: 'performance' | 'seo' | 'navigation';
  message: string;
}

export class RoutePriorityCalculator {

  /**
   * Calculate optimal route ordering based on Phase 2 algorithm
   * Prevents React Router conflicts through specificity analysis
   */
  calculateOrder(routes: RouteDefinition[]): RouteOrderingResult {
    const conflicts: RouteConflict[] = [];
    const warnings: RouteWarning[] = [];

    // 1. Detect conflicts before ordering
    this.detectConflicts(routes, conflicts);

    // 2. Sort routes by priority algorithm
    const orderedRoutes = this.sortRoutes(routes);

    // 3. Validate ordering and generate warnings
    this.validateOrdering(orderedRoutes, warnings);

    return {
      orderedRoutes,
      conflicts,
      warnings
    };
  }

  private sortRoutes(routes: RouteDefinition[]): RouteDefinition[] {
    return routes.sort((a, b) => {
      // 1. Static before dynamic (CRITICAL for React Router)
      if (a.type === 'static' && b.type === 'dynamic') return -1;
      if (a.type === 'dynamic' && b.type === 'static') return 1;

      // 2. More specific paths first (prevents parameter conflicts)
      const aSpecificity = this.calculatePathSpecificity(a.path);
      const bSpecificity = this.calculatePathSpecificity(b.path);
      if (aSpecificity !== bSpecificity) return bSpecificity - aSpecificity;

      // 3. Priority level (SEO and performance considerations)
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const aPriorityScore = priorityOrder[a.priority];
      const bPriorityScore = priorityOrder[b.priority];
      if (aPriorityScore !== bPriorityScore) return aPriorityScore - bPriorityScore;

      // 4. Route type ordering (system routes last)
      const typeOrder = { static: 0, dynamic: 1, legacy: 2, system: 3 };
      return (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0);
    });
  }

  private calculatePathSpecificity(path: string): number {
    let score = 0;

    // More path segments = more specific
    score += (path.match(/\//g) || []).length * 10;

    // Parameters reduce specificity
    score -= (path.match(/:/g) || []).length * 5;

    // Catch-all routes are least specific
    if (path.includes('*')) score -= 100;

    // Optional parameters reduce specificity slightly
    score -= (path.match(/\?/g) || []).length * 2;

    return score;
  }

  private detectConflicts(routes: RouteDefinition[], conflicts: RouteConflict[]): void {
    for (let i = 0; i < routes.length; i++) {
      for (let j = i + 1; j < routes.length; j++) {
        const route1 = routes[i];
        const route2 = routes[j];

        // Check for genuine routing conflicts (when ordering matters)
        if (this.hasGenuineConflict(route1, route2)) {
          conflicts.push({
            route1,
            route2,
            conflictType: 'path-overlap',
            severity: 'critical',
            suggestion: `Ensure ${route1.path} comes before ${route2.path} in route definition`
          });
        }

        // Check for parameter conflicts
        if (this.hasParameterConflict(route1.path, route2.path)) {
          conflicts.push({
            route1,
            route2,
            conflictType: 'parameter-conflict',
            severity: 'warning',
            suggestion: `Consider more specific path patterns to avoid parameter ambiguity`
          });
        }
      }
    }
  }

  private hasGenuineConflict(route1: RouteDefinition, route2: RouteDefinition): boolean {
    // No conflict if one is a catch-all and it comes after specific routes
    if (route1.path === '*' && route2.path !== '*') {
      // Catch-all route comes before specific route - this is bad
      return true;
    }

    if (route2.path === '*' && route1.path !== '*') {
      // Specific route comes before catch-all - this is correct, no conflict
      return false;
    }

    // For non-catch-all routes, check for genuine overlap issues
    if (route1.path !== '*' && route2.path !== '*') {
      return this.pathsOverlap(route1.path, route2.path);
    }

    return false;
  }

  private pathsOverlap(path1: string, path2: string): boolean {
    // Convert React Router paths to RegExp patterns
    const pattern1 = this.pathToRegex(path1);
    const pattern2 = this.pathToRegex(path2);

    // Test if paths could match the same URL
    const testUrls = [
      '/volunteer-costa-rica',
      '/volunteer-costa-rica/lions',
      '/lions-volunteer',
      '/lions-volunteer/costa-rica',
      '/some-organization-slug'
    ];

    return testUrls.some(url =>
      pattern1.test(url) && pattern2.test(url)
    );
  }

  private pathToRegex(path: string): RegExp {
    // Simple conversion of React Router path to RegExp
    const pattern = path
      .replace(/:[^/]+/g, '[^/]+')  // Parameters match non-slash characters
      .replace(/\*/g, '.*')         // Wildcards match anything
      .replace(/\//g, '\\/');       // Escape slashes

    return new RegExp(`^${pattern}$`);
  }

  private hasParameterConflict(path1: string, path2: string): boolean {
    // Check if paths have parameters in same positions with different names
    const segments1 = path1.split('/');
    const segments2 = path2.split('/');

    if (segments1.length !== segments2.length) return false;

    for (let i = 0; i < segments1.length; i++) {
      const seg1 = segments1[i];
      const seg2 = segments2[i];

      // Both are parameters but different names
      if (seg1.startsWith(':') && seg2.startsWith(':') && seg1 !== seg2) {
        return true;
      }
    }

    return false;
  }

  private validateOrdering(routes: RouteDefinition[], warnings: RouteWarning[]): void {
    // Check for performance issues in ordering
    routes.forEach((route, index) => {
      if (route.type === 'system' && index < routes.length - 5) {
        warnings.push({
          route,
          warningType: 'performance',
          message: 'System routes should be placed near the end for optimal performance'
        });
      }

      if (route.path.includes('*') && index < routes.length - 1) {
        warnings.push({
          route,
          warningType: 'performance',
          message: 'Catch-all routes should be the last route to prevent unintended matches'
        });
      }

      if (route.priority === 'critical' && index > 10) {
        warnings.push({
          route,
          warningType: 'seo',
          message: 'Critical priority routes should be positioned early for SEO benefits'
        });
      }
    });
  }

  /**
   * Utility method to generate React Router Routes JSX from ordered routes
   */
  generateReactRouterJSX(routes: RouteDefinition[]): string {
    const routeElements = routes.map(route => {
      const componentImport = route.performance.lazyLoad
        ? `React.lazy(() => import('./components/${route.component}'))`
        : route.component;

      return `<Route path="${route.path}" element={
        <Suspense fallback={<RouteLoader />}>
          <${route.component} />
        </Suspense>
      } />`;
    });

    return `
      <Routes>
        <Route path="/" element={<Layout />}>
          ${routeElements.join('\n          ')}
        </Route>
      </Routes>
    `;
  }

  /**
   * Analyze route conflicts and provide resolution suggestions
   */
  analyzeRouteHealth(routes: RouteDefinition[]): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const result = this.calculateOrder(routes);
    const criticalConflicts = result.conflicts.filter(c => c.severity === 'critical');
    const performanceWarnings = result.warnings.filter(w => w.warningType === 'performance');

    let score = 100;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Deduct points for conflicts
    score -= criticalConflicts.length * 20;
    score -= result.warnings.length * 5;

    if (criticalConflicts.length > 0) {
      issues.push(`${criticalConflicts.length} critical route conflicts detected`);
      suggestions.push('Reorder routes to resolve path overlaps');
    }

    if (performanceWarnings.length > 0) {
      issues.push(`${performanceWarnings.length} performance warnings`);
      suggestions.push('Review route ordering for optimal performance');
    }

    // Check for catch-all route placement
    const catchAllRoute = routes.find(r => r.path.includes('*'));
    if (catchAllRoute) {
      const catchAllIndex = routes.indexOf(catchAllRoute);
      if (catchAllIndex < routes.length - 1) {
        issues.push('Catch-all route not placed last');
        suggestions.push('Move catch-all route (*) to the end');
        score -= 10;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  /**
   * Generate route performance report
   */
  generatePerformanceReport(routes: RouteDefinition[]): {
    totalRoutes: number;
    staticRoutes: number;
    dynamicRoutes: number;
    systemRoutes: number;
    averageSpecificity: number;
    mostSpecificRoute: RouteDefinition;
    leastSpecificRoute: RouteDefinition;
  } {
    const specificityScores = routes.map(route => ({
      route,
      specificity: this.calculatePathSpecificity(route.path)
    }));

    const avgSpecificity = specificityScores.reduce((sum, item) => sum + item.specificity, 0) / specificityScores.length;
    const mostSpecific = specificityScores.reduce((max, item) => item.specificity > max.specificity ? item : max);
    const leastSpecific = specificityScores.reduce((min, item) => item.specificity < min.specificity ? item : min);

    return {
      totalRoutes: routes.length,
      staticRoutes: routes.filter(r => r.type === 'static').length,
      dynamicRoutes: routes.filter(r => r.type === 'dynamic').length,
      systemRoutes: routes.filter(r => r.type === 'system').length,
      averageSpecificity: avgSpecificity,
      mostSpecificRoute: mostSpecific.route,
      leastSpecificRoute: leastSpecific.route
    };
  }
}

export default RoutePriorityCalculator;