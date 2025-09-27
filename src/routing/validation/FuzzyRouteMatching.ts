/**
 * Fuzzy Route Matching System
 *
 * Intelligent route suggestion system for 404 recovery.
 * Provides smart suggestions when users enter invalid or mistyped routes.
 *
 * Features:
 * - Levenshtein distance calculation for typo detection
 * - Context-aware suggestions based on route patterns
 * - Performance-optimized matching algorithms
 * - Confidence scoring for suggestion quality
 */

import type { RouteDefinition } from '../core/RouteDefinition';

// ============================================================================
// MATCHING RESULT TYPES
// ============================================================================

export interface RouteSuggestion {
  route: string;
  title: string;
  matchReason: string;
  confidence: number;        // 0-1 scale, higher = better match
  matchType: 'exact' | 'typo' | 'partial' | 'semantic' | 'fallback';
  originalQuery: string;
  editDistance?: number;     // For typo corrections
}

export interface MatchingContext {
  userLocation?: string;     // User's geographic context
  previousRoute?: string;    // Where they came from
  sessionRoutes?: string[];  // Routes visited in session
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;         // How they got here
}

export interface MatchingStatistics {
  totalMatches: number;
  averageConfidence: number;
  matchTypeDistribution: Record<string, number>;
  averageResponseTime: number;
  popularSuggestions: Array<{ route: string; count: number }>;
}

// ============================================================================
// FUZZY MATCHING CONFIGURATION
// ============================================================================

interface MatchingConfig {
  maxSuggestions: number;
  minConfidence: number;
  typoThreshold: number;        // Max edit distance for typo detection
  partialMatchThreshold: number; // Min similarity for partial matches
  semanticMatchEnabled: boolean;
  contextWeightingEnabled: boolean;
  performanceTargetMs: number;
}

const DEFAULT_CONFIG: MatchingConfig = {
  maxSuggestions: 3,
  minConfidence: 0.3,
  typoThreshold: 3,
  partialMatchThreshold: 0.4,
  semanticMatchEnabled: true,
  contextWeightingEnabled: true,
  performanceTargetMs: 10
};

// ============================================================================
// ROUTE PATTERN ANALYSIS
// ============================================================================

class RoutePatternAnalyzer {
  /**
   * Analyze route to determine intended pattern and extract components
   */
  static analyzeRoute(attemptedRoute: string): {
    type: 'country' | 'animal' | 'combined' | 'organization' | 'unknown';
    components: {
      country?: string;
      animal?: string;
      orgSlug?: string;
    };
    confidence: number;
  } {
    const path = attemptedRoute.toLowerCase().trim();

    // Country pattern: /volunteer-{country}
    if (path.match(/^\/volunteer-[\w-]+$/)) {
      const country = path.replace('/volunteer-', '');
      return {
        type: 'country',
        components: { country },
        confidence: 0.9
      };
    }

    // Animal pattern: /{animal}-volunteer
    if (path.match(/^\/[\w-]+-volunteer$/)) {
      const animal = path.replace('/', '').replace('-volunteer', '');
      return {
        type: 'animal',
        components: { animal },
        confidence: 0.9
      };
    }

    // Combined pattern: /volunteer-{country}/{animal}
    if (path.match(/^\/volunteer-[\w-]+\/[\w-]+$/)) {
      const parts = path.split('/');
      const country = parts[1].replace('volunteer-', '');
      const animal = parts[2];
      return {
        type: 'combined',
        components: { country, animal },
        confidence: 0.95
      };
    }

    // Combined pattern: /{animal}-volunteer/{country}
    if (path.match(/^\/[\w-]+-volunteer\/[\w-]+$/)) {
      const parts = path.split('/');
      const animal = parts[1].replace('-volunteer', '');
      const country = parts[2];
      return {
        type: 'combined',
        components: { country, animal },
        confidence: 0.95
      };
    }

    // Organization pattern: /{slug}
    if (path.match(/^\/[\w-]+$/) && !path.includes('volunteer')) {
      const orgSlug = path.replace('/', '');
      return {
        type: 'organization',
        components: { orgSlug },
        confidence: 0.7
      };
    }

    return {
      type: 'unknown',
      components: {},
      confidence: 0.1
    };
  }
}

// ============================================================================
// SEMANTIC MATCHING ENGINE
// ============================================================================

class SemanticMatcher {
  private static readonly ANIMAL_SYNONYMS: Record<string, string[]> = {
    'lions': ['lion', 'big-cats', 'cats', 'felines'],
    'elephants': ['elephant', 'pachyderm'],
    'sea-turtles': ['turtle', 'turtles', 'marine-turtle', 'sea-turtle'],
    'orangutans': ['orangutan', 'ape', 'primates'],
    'dolphins': ['dolphin', 'marine-mammals', 'cetaceans'],
    'whales': ['whale', 'marine-mammals', 'cetaceans'],
    'primates': ['primate', 'apes', 'monkeys']
  };

  private static readonly COUNTRY_SYNONYMS: Record<string, string[]> = {
    'costa-rica': ['costarica', 'cr', 'costa', 'rica'],
    'south-africa': ['southafrica', 'sa', 'south', 'africa'],
    'thailand': ['thai', 'siam'],
    'australia': ['aussie', 'oz', 'aus'],
    'indonesia': ['indo']
  };

  static findSemanticMatches(
    component: string,
    type: 'animal' | 'country',
    validOptions: string[]
  ): Array<{ option: string; confidence: number }> {
    const synonyms = type === 'animal' ? this.ANIMAL_SYNONYMS : this.COUNTRY_SYNONYMS;
    const matches: Array<{ option: string; confidence: number }> = [];

    // Direct synonym matching
    for (const [canonical, synonymList] of Object.entries(synonyms)) {
      if (validOptions.includes(canonical)) {
        // Check if attempted component matches any synonym
        if (synonymList.some(synonym =>
          synonym.includes(component) || component.includes(synonym)
        )) {
          matches.push({
            option: canonical,
            confidence: 0.8
          });
        }
      }
    }

    // Partial word matching
    validOptions.forEach(option => {
      const words = option.split('-');
      const componentWords = component.split('-');

      let wordMatches = 0;
      const totalWords = Math.max(words.length, componentWords.length);

      for (const word of words) {
        if (componentWords.some(cWord =>
          word.includes(cWord) || cWord.includes(word)
        )) {
          wordMatches++;
        }
      }

      if (wordMatches > 0) {
        const confidence = wordMatches / totalWords;
        if (confidence >= 0.3) {
          matches.push({ option, confidence });
        }
      }
    });

    return matches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Top 3 semantic matches
  }
}

// ============================================================================
// MAIN FUZZY MATCHING ENGINE
// ============================================================================

export class FuzzyRouteMatching {
  private config: MatchingConfig;
  private statistics: MatchingStatistics;
  private validRoutes: Map<string, RouteDefinition>;

  constructor(
    validRoutes: RouteDefinition[],
    config: Partial<MatchingConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.statistics = this.initializeStatistics();
    this.validRoutes = new Map(validRoutes.map(route => [route.path, route]));
  }

  // ========================================================================
  // PUBLIC MATCHING API
  // ========================================================================

  /**
   * Find suggestions for invalid route with context awareness
   */
  findSuggestions(
    attemptedRoute: string,
    context: MatchingContext = {}
  ): RouteSuggestion[] {
    const startTime = performance.now();

    try {
      const suggestions = this.performMatching(attemptedRoute, context);
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Update statistics
      this.updateStatistics(suggestions, duration);

      // Warn if matching is slow
      if (duration > this.config.performanceTargetMs) {
        console.warn(`Fuzzy matching exceeded ${this.config.performanceTargetMs}ms target: ${duration.toFixed(2)}ms`);
      }

      return suggestions;

    } catch (error) {
      console.error('Fuzzy matching error:', error);
      return this.generateFallbackSuggestions(attemptedRoute);
    }
  }

  /**
   * Get statistics about matching performance
   */
  getStatistics(): MatchingStatistics {
    return { ...this.statistics };
  }

  /**
   * Reset statistics counters
   */
  resetStatistics(): void {
    this.statistics = this.initializeStatistics();
  }

  // ========================================================================
  // CORE MATCHING LOGIC
  // ========================================================================

  private performMatching(
    attemptedRoute: string,
    context: MatchingContext
  ): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];

    // 1. Exact match check (shouldn't happen, but safety net)
    const exactMatch = this.findExactMatch(attemptedRoute);
    if (exactMatch) {
      suggestions.push(exactMatch);
    }

    // 2. Typo correction
    const typoSuggestions = this.findTypoCorrections(attemptedRoute);
    suggestions.push(...typoSuggestions);

    // 3. Partial match suggestions
    const partialSuggestions = this.findPartialMatches(attemptedRoute);
    suggestions.push(...partialSuggestions);

    // 4. Semantic matching
    if (this.config.semanticMatchEnabled) {
      const semanticSuggestions = this.findSemanticMatches(attemptedRoute);
      suggestions.push(...semanticSuggestions);
    }

    // 5. Context-aware suggestions
    if (this.config.contextWeightingEnabled) {
      const contextSuggestions = this.findContextualSuggestions(attemptedRoute, context);
      suggestions.push(...contextSuggestions);
    }

    // 6. Fallback suggestions if nothing found
    if (suggestions.length === 0) {
      suggestions.push(...this.generateFallbackSuggestions(attemptedRoute));
    }

    // Filter, deduplicate, and rank suggestions
    return this.rankAndFilterSuggestions(suggestions, attemptedRoute);
  }

  private findExactMatch(attemptedRoute: string): RouteSuggestion | null {
    const route = this.validRoutes.get(attemptedRoute);
    if (route) {
      return {
        route: attemptedRoute,
        title: this.generateRouteTitle(route),
        matchReason: 'Exact match',
        confidence: 1.0,
        matchType: 'exact',
        originalQuery: attemptedRoute
      };
    }
    return null;
  }

  private findTypoCorrections(attemptedRoute: string): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];
    const validPaths = Array.from(this.validRoutes.keys());

    for (const validPath of validPaths) {
      const distance = this.calculateEditDistance(attemptedRoute, validPath);

      if (distance <= this.config.typoThreshold && distance > 0) {
        const confidence = 1 - (distance / Math.max(attemptedRoute.length, validPath.length));

        if (confidence >= this.config.minConfidence) {
          const route = this.validRoutes.get(validPath)!;

          suggestions.push({
            route: validPath,
            title: this.generateRouteTitle(route),
            matchReason: `Possible typo (${distance} character${distance !== 1 ? 's' : ''} different)`,
            confidence,
            matchType: 'typo',
            originalQuery: attemptedRoute,
            editDistance: distance
          });
        }
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private findPartialMatches(attemptedRoute: string): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];
    const validPaths = Array.from(this.validRoutes.keys());

    for (const validPath of validPaths) {
      const similarity = this.calculateSimilarity(attemptedRoute, validPath);

      if (similarity >= this.config.partialMatchThreshold) {
        const route = this.validRoutes.get(validPath)!;

        suggestions.push({
          route: validPath,
          title: this.generateRouteTitle(route),
          matchReason: `Similar path (${Math.round(similarity * 100)}% match)`,
          confidence: similarity,
          matchType: 'partial',
          originalQuery: attemptedRoute
        });
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private findSemanticMatches(attemptedRoute: string): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];
    const analysis = RoutePatternAnalyzer.analyzeRoute(attemptedRoute);

    if (analysis.type === 'unknown') {
      return suggestions;
    }

    const validPaths = Array.from(this.validRoutes.keys());

    // Extract valid countries and animals from routes
    const validCountries = this.extractValidCountries(validPaths);
    const validAnimals = this.extractValidAnimals(validPaths);

    // Find semantic matches for each component
    if (analysis.components.country) {
      const countryMatches = SemanticMatcher.findSemanticMatches(
        analysis.components.country,
        'country',
        validCountries
      );

      countryMatches.forEach(match => {
        const suggestedRoute = `/volunteer-${match.option}`;
        if (this.validRoutes.has(suggestedRoute)) {
          const route = this.validRoutes.get(suggestedRoute)!;
          suggestions.push({
            route: suggestedRoute,
            title: this.generateRouteTitle(route),
            matchReason: 'Similar country name',
            confidence: match.confidence * 0.9, // Slight penalty for semantic matching
            matchType: 'semantic',
            originalQuery: attemptedRoute
          });
        }
      });
    }

    if (analysis.components.animal) {
      const animalMatches = SemanticMatcher.findSemanticMatches(
        analysis.components.animal,
        'animal',
        validAnimals
      );

      animalMatches.forEach(match => {
        const suggestedRoute = `/${match.option}-volunteer`;
        if (this.validRoutes.has(suggestedRoute)) {
          const route = this.validRoutes.get(suggestedRoute)!;
          suggestions.push({
            route: suggestedRoute,
            title: this.generateRouteTitle(route),
            matchReason: 'Similar animal name',
            confidence: match.confidence * 0.9,
            matchType: 'semantic',
            originalQuery: attemptedRoute
          });
        }
      });
    }

    return suggestions;
  }

  private findContextualSuggestions(
    attemptedRoute: string,
    context: MatchingContext
  ): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];

    // Previous route context
    if (context.previousRoute) {
      const relatedSuggestions = this.findRelatedRoutes(context.previousRoute);
      suggestions.push(...relatedSuggestions.map(suggestion => ({
        ...suggestion,
        matchReason: `Related to previous page: ${suggestion.matchReason}`,
        confidence: suggestion.confidence * 0.8, // Context bonus
        matchType: 'semantic' as const
      })));
    }

    // Geographic context
    if (context.userLocation) {
      const geoSuggestions = this.findGeographicSuggestions(context.userLocation);
      suggestions.push(...geoSuggestions);
    }

    // Device-specific suggestions
    if (context.deviceType === 'mobile') {
      // Prefer shorter, simpler routes on mobile
      const mobileFriendlyRoutes = Array.from(this.validRoutes.keys())
        .filter(route => route.length < 30 && !route.includes('/:'))
        .slice(0, 2);

      mobileFriendlyRoutes.forEach(route => {
        const routeDefinition = this.validRoutes.get(route)!;
        suggestions.push({
          route,
          title: this.generateRouteTitle(routeDefinition),
          matchReason: 'Mobile-friendly route',
          confidence: 0.6,
          matchType: 'fallback',
          originalQuery: attemptedRoute
        });
      });
    }

    return suggestions;
  }

  private generateFallbackSuggestions(attemptedRoute: string): RouteSuggestion[] {
    // Popular fallback routes when nothing else matches
    const fallbackRoutes = ['/', '/opportunities', '/volunteer-costa-rica', '/lions-volunteer'];

    return fallbackRoutes
      .filter(route => this.validRoutes.has(route))
      .map(route => {
        const routeDefinition = this.validRoutes.get(route)!;
        return {
          route,
          title: this.generateRouteTitle(routeDefinition),
          matchReason: 'Popular destination',
          confidence: 0.4,
          matchType: 'fallback' as const,
          originalQuery: attemptedRoute
        };
      });
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private rankAndFilterSuggestions(
    suggestions: RouteSuggestion[],
    originalQuery: string
  ): RouteSuggestion[] {
    // Remove duplicates
    const uniqueSuggestions = suggestions.filter((suggestion, index, array) =>
      array.findIndex(s => s.route === suggestion.route) === index
    );

    // Filter by minimum confidence
    const filteredSuggestions = uniqueSuggestions.filter(
      suggestion => suggestion.confidence >= this.config.minConfidence
    );

    // Sort by confidence (descending) and match type priority
    const matchTypePriority = {
      exact: 5,
      typo: 4,
      semantic: 3,
      partial: 2,
      fallback: 1
    };

    const rankedSuggestions = filteredSuggestions.sort((a, b) => {
      // Primary sort: match type priority
      const priorityDiff = matchTypePriority[b.matchType] - matchTypePriority[a.matchType];
      if (priorityDiff !== 0) return priorityDiff;

      // Secondary sort: confidence
      return b.confidence - a.confidence;
    });

    // Limit to max suggestions
    return rankedSuggestions.slice(0, this.config.maxSuggestions);
  }

  private calculateEditDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i += 1) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j += 1) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.calculateEditDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
  }

  private generateRouteTitle(route: RouteDefinition): string {
    // Generate user-friendly title from route definition
    if (route.seo?.title) {
      return route.seo.title;
    }

    // Fallback title generation
    const path = route.path;
    if (path === '/') return 'Home';
    if (path === '/opportunities') return 'Browse All Opportunities';
    if (path.includes('volunteer-')) {
      const country = path.replace('/volunteer-', '').replace('/', ' ');
      return `${country.charAt(0).toUpperCase()}${country.slice(1)} Volunteer Programs`;
    }
    if (path.includes('-volunteer')) {
      const animal = path.replace('/', '').replace('-volunteer', '').replace('/', ' ');
      return `${animal.charAt(0).toUpperCase()}${animal.slice(1)} Conservation Programs`;
    }

    return 'Wildlife Conservation Programs';
  }

  private extractValidCountries(validPaths: string[]): string[] {
    const countries = new Set<string>();

    validPaths.forEach(path => {
      const match = path.match(/\/volunteer-([^/]+)/);
      if (match) {
        countries.add(match[1]);
      }
    });

    return Array.from(countries);
  }

  private extractValidAnimals(validPaths: string[]): string[] {
    const animals = new Set<string>();

    validPaths.forEach(path => {
      const match = path.match(/\/([^/]+)-volunteer/);
      if (match) {
        animals.add(match[1]);
      }
    });

    return Array.from(animals);
  }

  private findRelatedRoutes(previousRoute: string): RouteSuggestion[] {
    // Find routes related to the previous route visited
    const analysis = RoutePatternAnalyzer.analyzeRoute(previousRoute);
    const suggestions: RouteSuggestion[] = [];

    if (analysis.type === 'country' && analysis.components.country) {
      // Suggest animals for this country
      const countryPrefix = `/volunteer-${analysis.components.country}`;
      const relatedRoutes = Array.from(this.validRoutes.keys())
        .filter(route => route.startsWith(countryPrefix) && route !== previousRoute);

      relatedRoutes.forEach(route => {
        const routeDefinition = this.validRoutes.get(route)!;
        suggestions.push({
          route,
          title: this.generateRouteTitle(routeDefinition),
          matchReason: 'Related to previous country visit',
          confidence: 0.7,
          matchType: 'semantic',
          originalQuery: ''
        });
      });
    }

    return suggestions;
  }

  private findGeographicSuggestions(userLocation: string): RouteSuggestion[] {
    // This would integrate with IP geolocation or user preferences
    // For now, return empty array - would be enhanced with real geo data
    return [];
  }

  private updateStatistics(suggestions: RouteSuggestion[], responseTime: number): void {
    this.statistics.totalMatches++;

    if (suggestions.length > 0) {
      const avgConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length;
      this.statistics.averageConfidence =
        (this.statistics.averageConfidence * (this.statistics.totalMatches - 1) + avgConfidence) / this.statistics.totalMatches;

      // Update match type distribution
      suggestions.forEach(suggestion => {
        this.statistics.matchTypeDistribution[suggestion.matchType] =
          (this.statistics.matchTypeDistribution[suggestion.matchType] || 0) + 1;
      });

      // Track popular suggestions
      suggestions.forEach(suggestion => {
        const existing = this.statistics.popularSuggestions.find(p => p.route === suggestion.route);
        if (existing) {
          existing.count++;
        } else {
          this.statistics.popularSuggestions.push({ route: suggestion.route, count: 1 });
        }
      });

      // Keep only top 10 popular suggestions
      this.statistics.popularSuggestions.sort((a, b) => b.count - a.count);
      this.statistics.popularSuggestions = this.statistics.popularSuggestions.slice(0, 10);
    }

    // Update response time
    this.statistics.averageResponseTime =
      (this.statistics.averageResponseTime * (this.statistics.totalMatches - 1) + responseTime) / this.statistics.totalMatches;
  }

  private initializeStatistics(): MatchingStatistics {
    return {
      totalMatches: 0,
      averageConfidence: 0,
      matchTypeDistribution: {},
      averageResponseTime: 0,
      popularSuggestions: []
    };
  }
}

export default FuzzyRouteMatching;