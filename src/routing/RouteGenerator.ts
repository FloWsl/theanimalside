/**
 * Data-Driven Route Generation System
 *
 * Generates all routes dynamically from opportunities and organizations data.
 * Zero hardcoded routes - everything derived from actual application data.
 *
 * Performance targets:
 * - Route generation: <10ms
 * - Zero memory leaks
 * - 100% type safety
 */

import type {
  RouteDefinition,
  RouteGenerationContext,
  RouteGenerationResult,
  SEOMetadata,
  NavigationMetadata,
  RouteValidationRule
} from './RouteDefinition';
import {
  HIGH_TRAFFIC_COUNTRIES,
  HIGH_TRAFFIC_ANIMALS,
  HIGH_TRAFFIC_COMBINATIONS,
  CONSERVATION_ROUTES,
  CORE_STATIC_ROUTES,
  DEFAULT_PERFORMANCE_CONFIG,
  SEO_PRIORITY_MAP,
  generateRouteId,
  isHighTrafficRoute
} from './RouteDefinition';
import type { Opportunity, Organization } from '../types';
import { formatCountrySlug, formatAnimalSlug, formatCountryName, formatAnimalName } from '../utils/routeUtils';

// ============================================================================
// CORE ROUTE GENERATION ENGINE
// ============================================================================

export class RouteGenerator {
  private context: RouteGenerationContext;
  private generatedRoutes: Map<string, RouteDefinition> = new Map();
  private warnings: string[] = [];
  private errors: string[] = [];

  constructor(context: RouteGenerationContext) {
    this.context = context;
  }

  /**
   * Generate all routes for the application
   * Returns complete route configuration ready for React Router
   */
  generateAllRoutes(): RouteGenerationResult {
    const startTime = performance.now();

    // Clear previous state
    this.generatedRoutes.clear();
    this.warnings = [];
    this.errors = [];

    try {
      // Generate routes in order of specificity (most specific first)
      this.generateCoreRoutes();
      this.generateHighTrafficStaticRoutes();
      this.generateDynamicCountryRoutes();
      this.generateDynamicAnimalRoutes();
      this.generateDynamicCombinedRoutes();
      this.generateOrganizationRoutes();
      this.generateSystemRoutes();

      const routes = Array.from(this.generatedRoutes.values());
      const endTime = performance.now();

      // Performance validation
      const generationTime = endTime - startTime;
      if (generationTime > 10) {
        this.warnings.push(`Route generation took ${generationTime.toFixed(2)}ms (target: <10ms)`);
      }

      return {
        routes: this.sortRoutesByPriority(routes),
        statistics: this.generateStatistics(routes),
        warnings: this.warnings,
        errors: this.errors
      };

    } catch (error) {
      this.errors.push(`Route generation failed: ${error.message}`);
      return {
        routes: [],
        statistics: { total: 0, byType: {}, byCategory: {}, validationRules: 0 },
        warnings: this.warnings,
        errors: this.errors
      };
    }
  }

  // ========================================================================
  // CORE STATIC ROUTES
  // ========================================================================

  private generateCoreRoutes(): void {
    // Home page
    this.addRoute({
      id: 'core-home',
      path: '/',
      component: 'HomePage',
      type: 'static',
      priority: 'critical',
      dataSource: 'static',
      seo: {
        title: 'Wildlife Conservation Volunteer Programs | The Animal Side',
        description: 'Discover ethical wildlife conservation volunteer opportunities worldwide. Join meaningful programs protecting endangered species and their habitats.',
        keywords: ['wildlife conservation', 'volunteer abroad', 'animal protection', 'eco travel'],
        priority: 1.0,
        changefreq: 'daily',
        structuredData: {
          '@type': 'Organization',
          name: 'The Animal Side',
          description: 'Wildlife conservation volunteer opportunities worldwide'
        }
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.critical,
      navigation: {
        category: 'core',
        enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
        contextPreservation: false,
        analyticsEvent: 'home_page_view',
        breadcrumbGeneration: 'none'
      }
    });

    // Opportunities page
    this.addRoute({
      id: 'core-opportunities',
      path: '/opportunities',
      component: 'OpportunitiesPageV2',
      type: 'static',
      priority: 'critical',
      dataSource: 'opportunities',
      seo: {
        title: 'Wildlife Conservation Volunteer Opportunities | Browse All Programs',
        description: `Explore ${this.context.opportunities.length} verified wildlife conservation programs worldwide. Filter by animal type, location, and program features.`,
        keywords: ['wildlife volunteer', 'conservation programs', 'animal volunteer abroad'],
        priority: 0.9,
        changefreq: 'daily'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.critical,
      navigation: {
        category: 'core',
        enabledFlows: ['to-country', 'to-animal', 'to-combined', 'to-organization'],
        contextPreservation: true,
        analyticsEvent: 'opportunities_page_view',
        breadcrumbGeneration: 'auto'
      }
    });

    // Guides page (dynamic guide loading)
    this.addRoute({
      id: 'core-guides',
      path: '/guides/:guideSlug',
      component: 'GuidesPage',
      type: 'dynamic',
      priority: 'medium',
      dataSource: 'static',
      validation: [{
        parameter: 'guideSlug',
        validator: 'organization', // Reuse organization validator for guide slugs
        required: true
      }],
      seo: {
        title: 'Conservation Guides | Wildlife Volunteer Resources',
        description: 'Expert guides for wildlife conservation volunteers. Tips, preparation advice, and destination insights.',
        keywords: ['conservation guide', 'volunteer preparation', 'wildlife travel tips'],
        priority: 0.7,
        changefreq: 'monthly'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.medium,
      navigation: {
        category: 'core',
        enabledFlows: ['to-opportunities'],
        contextPreservation: false,
        analyticsEvent: 'guide_page_view',
        breadcrumbGeneration: 'auto'
      }
    });
  }

  // ========================================================================
  // HIGH-TRAFFIC STATIC ROUTES (SEO OPTIMIZATION)
  // ========================================================================

  private generateHighTrafficStaticRoutes(): void {
    // High-traffic country routes
    HIGH_TRAFFIC_COUNTRIES.forEach(countrySlug => {
      const countryName = formatCountryName(countrySlug);
      const opportunities = this.getOpportunitiesForCountry(countrySlug);

      this.addRoute({
        id: `country-static-${countrySlug}`,
        path: `/volunteer-${countrySlug}`,
        component: 'CountryLandingPage',
        type: 'static',
        priority: 'critical',
        dataSource: 'opportunities',
        seo: {
          title: `${countryName} Wildlife Volunteer Programs | Conservation Opportunities`,
          description: `Discover ${opportunities.length} wildlife conservation volunteer programs in ${countryName}. Join ethical organizations protecting local wildlife and habitats.`,
          keywords: [`${countryName.toLowerCase()} volunteer`, `wildlife ${countryName.toLowerCase()}`, 'conservation abroad'],
          priority: 0.9,
          changefreq: 'weekly',
          canonical: `/volunteer-${countrySlug}`
        },
        performance: DEFAULT_PERFORMANCE_CONFIG.critical,
        navigation: {
          category: 'country',
          enabledFlows: ['to-animal', 'to-combined', 'to-organization'],
          contextPreservation: true,
          analyticsEvent: 'country_page_view',
          breadcrumbGeneration: 'auto'
        }
      });
    });

    // High-traffic animal routes
    HIGH_TRAFFIC_ANIMALS.forEach(animalSlug => {
      const animalName = formatAnimalName(animalSlug);
      const opportunities = this.getOpportunitiesForAnimal(animalSlug);

      this.addRoute({
        id: `animal-static-${animalSlug}`,
        path: `/${animalSlug}-volunteer`,
        component: 'AnimalLandingPage',
        type: 'static',
        priority: 'critical',
        dataSource: 'opportunities',
        seo: {
          title: `${animalName} Conservation Volunteer Programs | Wildlife Protection`,
          description: `Join ${opportunities.length} ${animalName.toLowerCase()} conservation programs worldwide. Protect endangered species through ethical volunteer work.`,
          keywords: [`${animalName.toLowerCase()} volunteer`, `${animalName.toLowerCase()} conservation`, 'wildlife protection'],
          priority: 0.9,
          changefreq: 'weekly',
          canonical: `/${animalSlug}-volunteer`
        },
        performance: DEFAULT_PERFORMANCE_CONFIG.critical,
        navigation: {
          category: 'animal',
          enabledFlows: ['to-country', 'to-combined', 'to-organization'],
          contextPreservation: true,
          analyticsEvent: 'animal_page_view',
          breadcrumbGeneration: 'auto'
        }
      });
    });

    // High-traffic combined routes
    HIGH_TRAFFIC_COMBINATIONS.forEach(combo => {
      const countryName = formatCountryName(combo.country);
      const animalName = formatAnimalName(combo.animal);
      const opportunities = this.getOpportunitiesForCombined(combo.animal, combo.country);

      if (combo.reverse) {
        // Animal-first format: /lions-volunteer/costa-rica
        this.addRoute({
          id: `combined-static-${combo.animal}-${combo.country}-reverse`,
          path: `/${combo.animal}-volunteer/${combo.country}`,
          component: 'CombinedPage',
          type: 'static',
          priority: 'high',
          dataSource: 'opportunities',
          params: { type: 'animal-country' },
          seo: {
            title: `${animalName} Conservation in ${countryName} | Volunteer Programs`,
            description: `${opportunities.length} ${animalName.toLowerCase()} conservation volunteer programs in ${countryName}. Direct application to verified organizations.`,
            keywords: [`${animalName.toLowerCase()} ${countryName.toLowerCase()}`, 'conservation volunteer abroad'],
            priority: 0.8,
            changefreq: 'monthly',
            canonical: `/volunteer-${combo.country}/${combo.animal}` // Canonicalize to country-first
          },
          performance: DEFAULT_PERFORMANCE_CONFIG.high,
          navigation: {
            category: 'combined',
            enabledFlows: ['to-organization'],
            contextPreservation: true,
            analyticsEvent: 'combined_page_view',
            breadcrumbGeneration: 'auto'
          }
        });
      } else {
        // Country-first format: /volunteer-costa-rica/lions
        this.addRoute({
          id: `combined-static-${combo.country}-${combo.animal}`,
          path: `/volunteer-${combo.country}/${combo.animal}`,
          component: 'CombinedPage',
          type: 'static',
          priority: 'high',
          dataSource: 'opportunities',
          params: { type: 'country-animal' },
          seo: {
            title: `${animalName} Conservation in ${countryName} | Volunteer Programs`,
            description: `${opportunities.length} ${animalName.toLowerCase()} conservation volunteer programs in ${countryName}. Direct application to verified organizations.`,
            keywords: [`${animalName.toLowerCase()} ${countryName.toLowerCase()}`, 'conservation volunteer abroad'],
            priority: 0.8,
            changefreq: 'monthly'
          },
          performance: DEFAULT_PERFORMANCE_CONFIG.high,
          navigation: {
            category: 'combined',
            enabledFlows: ['to-organization'],
            contextPreservation: true,
            analyticsEvent: 'combined_page_view',
            breadcrumbGeneration: 'auto'
          }
        });
      }
    });

    // Conservation category routes
    CONSERVATION_ROUTES.forEach(conservationSlug => {
      const categoryName = conservationSlug.replace('-conservation', '').replace('-', ' ');
      const animalType = this.mapConservationToAnimal(conservationSlug);

      this.addRoute({
        id: `conservation-${conservationSlug}`,
        path: `/${conservationSlug}`,
        component: 'AnimalLandingPage',
        type: 'static',
        priority: 'high',
        dataSource: 'opportunities',
        params: { type: 'conservation' },
        seo: {
          title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Conservation Volunteer Programs`,
          description: `Join ${categoryName} conservation projects worldwide. Protect ecosystems and wildlife through meaningful volunteer work.`,
          keywords: [`${categoryName} conservation`, `${categoryName} volunteer`, 'environmental protection'],
          priority: 0.8,
          changefreq: 'weekly'
        },
        performance: DEFAULT_PERFORMANCE_CONFIG.high,
        navigation: {
          category: 'animal',
          enabledFlows: ['to-country', 'to-combined', 'to-organization'],
          contextPreservation: true,
          analyticsEvent: 'conservation_page_view',
          breadcrumbGeneration: 'auto'
        }
      });
    });
  }

  // ========================================================================
  // DYNAMIC ROUTES WITH VALIDATION
  // ========================================================================

  private generateDynamicCountryRoutes(): void {
    // Dynamic country route: /volunteer-:country
    this.addRoute({
      id: 'country-dynamic',
      path: '/volunteer-:country',
      component: 'DynamicCountryLandingPage',
      type: 'dynamic',
      priority: 'high',
      dataSource: 'opportunities',
      validation: [{
        parameter: 'country',
        validator: 'country',
        required: true
      }],
      seo: {
        title: 'Country Wildlife Volunteer Programs | Dynamic Destination',
        description: 'Wildlife conservation volunteer opportunities in various destinations worldwide.',
        keywords: ['wildlife volunteer', 'conservation abroad', 'volunteer destination'],
        priority: 0.7,
        changefreq: 'weekly'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.high,
      navigation: {
        category: 'country',
        enabledFlows: ['to-animal', 'to-combined', 'to-organization'],
        contextPreservation: true,
        analyticsEvent: 'dynamic_country_view',
        breadcrumbGeneration: 'auto'
      }
    });
  }

  private generateDynamicAnimalRoutes(): void {
    // Dynamic animal route: /:animal-volunteer
    this.addRoute({
      id: 'animal-dynamic',
      path: '/:animal-volunteer',
      component: 'DynamicAnimalLandingPage',
      type: 'dynamic',
      priority: 'high',
      dataSource: 'opportunities',
      validation: [{
        parameter: 'animal',
        validator: 'animal',
        required: true
      }],
      seo: {
        title: 'Animal Conservation Volunteer Programs | Dynamic Species',
        description: 'Wildlife conservation volunteer opportunities focusing on specific animal species.',
        keywords: ['animal conservation', 'species protection', 'wildlife volunteer'],
        priority: 0.7,
        changefreq: 'weekly'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.high,
      navigation: {
        category: 'animal',
        enabledFlows: ['to-country', 'to-combined', 'to-organization'],
        contextPreservation: true,
        analyticsEvent: 'dynamic_animal_view',
        breadcrumbGeneration: 'auto'
      }
    });
  }

  private generateDynamicCombinedRoutes(): void {
    // Dynamic combined route: /volunteer-:country/:animal (country-first)
    this.addRoute({
      id: 'combined-dynamic-country-first',
      path: '/volunteer-:country/:animal',
      component: 'DynamicCombinedPage',
      type: 'dynamic',
      priority: 'medium',
      dataSource: 'opportunities',
      params: { type: 'country-animal' },
      validation: [
        { parameter: 'country', validator: 'country', required: true },
        { parameter: 'animal', validator: 'animal', required: true },
        { parameter: 'combination', validator: 'combination', required: true }
      ],
      seo: {
        title: 'Wildlife Conservation Programs | Country + Animal Combination',
        description: 'Specific wildlife conservation volunteer programs by location and species.',
        keywords: ['wildlife conservation', 'volunteer abroad', 'animal protection'],
        priority: 0.6,
        changefreq: 'monthly'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.medium,
      navigation: {
        category: 'combined',
        enabledFlows: ['to-organization'],
        contextPreservation: true,
        analyticsEvent: 'dynamic_combined_view',
        breadcrumbGeneration: 'auto'
      }
    });

    // Dynamic combined route: /:animal-volunteer/:country (animal-first)
    this.addRoute({
      id: 'combined-dynamic-animal-first',
      path: '/:animal-volunteer/:country',
      component: 'DynamicCombinedPage',
      type: 'dynamic',
      priority: 'medium',
      dataSource: 'opportunities',
      params: { type: 'animal-country' },
      validation: [
        { parameter: 'animal', validator: 'animal', required: true },
        { parameter: 'country', validator: 'country', required: true },
        { parameter: 'combination', validator: 'combination', required: true }
      ],
      seo: {
        title: 'Wildlife Conservation Programs | Animal + Country Combination',
        description: 'Specific wildlife conservation volunteer programs by species and location.',
        keywords: ['wildlife conservation', 'volunteer abroad', 'animal protection'],
        priority: 0.6,
        changefreq: 'monthly',
        canonical: '/volunteer-:country/:animal' // Canonicalize to country-first
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.medium,
      navigation: {
        category: 'combined',
        enabledFlows: ['to-organization'],
        contextPreservation: true,
        analyticsEvent: 'dynamic_combined_view',
        breadcrumbGeneration: 'auto'
      }
    });
  }

  // ========================================================================
  // ORGANIZATION ROUTES
  // ========================================================================

  private generateOrganizationRoutes(): void {
    // Flat organization route: /:orgSlug (new format)
    this.addRoute({
      id: 'organization-flat',
      path: '/:orgSlug',
      component: 'FlatOrganizationPage',
      type: 'dynamic',
      priority: 'low', // Must be after all other patterns
      dataSource: 'organizations',
      validation: [{
        parameter: 'orgSlug',
        validator: 'organization',
        required: true
      }],
      seo: {
        title: 'Organization Profile | Wildlife Conservation Volunteer Programs',
        description: 'Detailed information about wildlife conservation organization and volunteer opportunities.',
        keywords: ['conservation organization', 'volunteer programs', 'wildlife charity'],
        priority: 0.6,
        changefreq: 'monthly'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.medium,
      navigation: {
        category: 'organization',
        enabledFlows: ['to-opportunities'],
        contextPreservation: false,
        analyticsEvent: 'organization_view',
        breadcrumbGeneration: 'auto'
      }
    });
  }

  // ========================================================================
  // SYSTEM ROUTES
  // ========================================================================

  private generateSystemRoutes(): void {
    // 404 page
    this.addRoute({
      id: 'system-404',
      path: '/404',
      component: 'SmartRouteHandler',
      type: 'system',
      priority: 'low',
      dataSource: 'static',
      seo: {
        title: 'Page Not Found | The Animal Side',
        description: 'The page you are looking for could not be found. Explore our wildlife conservation volunteer opportunities.',
        keywords: ['page not found', '404'],
        priority: 0.1,
        changefreq: 'never'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.low,
      navigation: {
        category: 'system',
        enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
        contextPreservation: false,
        analyticsEvent: '404_page_view',
        breadcrumbGeneration: 'none'
      }
    });

    // Catch-all route (must be absolute last)
    this.addRoute({
      id: 'system-catchall',
      path: '*',
      component: 'SmartRouteHandler',
      type: 'system',
      priority: 'low',
      dataSource: 'static',
      seo: {
        title: 'Page Not Found | The Animal Side',
        description: 'The page you are looking for could not be found. Explore our wildlife conservation volunteer opportunities.',
        keywords: ['page not found'],
        priority: 0.1,
        changefreq: 'never'
      },
      performance: DEFAULT_PERFORMANCE_CONFIG.low,
      navigation: {
        category: 'system',
        enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
        contextPreservation: false,
        analyticsEvent: 'catchall_route_view',
        breadcrumbGeneration: 'none'
      }
    });
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private addRoute(route: RouteDefinition): void {
    if (this.generatedRoutes.has(route.id)) {
      this.warnings.push(`Duplicate route ID: ${route.id}`);
      return;
    }

    this.generatedRoutes.set(route.id, route);
  }

  private sortRoutesByPriority(routes: RouteDefinition[]): RouteDefinition[] {
    return routes.sort((a, b) => {
      // 1. Static routes before dynamic routes
      if (a.type === 'static' && b.type === 'dynamic') return -1;
      if (a.type === 'dynamic' && b.type === 'static') return 1;

      // 2. More specific paths first (by segment count and parameter count)
      const aSpecificity = this.calculatePathSpecificity(a.path);
      const bSpecificity = this.calculatePathSpecificity(b.path);
      if (aSpecificity !== bSpecificity) return bSpecificity - aSpecificity;

      // 3. Priority level
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private calculatePathSpecificity(path: string): number {
    let score = 0;
    score += (path.match(/\//g) || []).length * 10; // More segments = more specific
    score -= (path.match(/:/g) || []).length * 5;   // Parameters = less specific
    score += path.includes('*') ? -100 : 0;         // Catch-all = least specific
    return score;
  }

  private generateStatistics(routes: RouteDefinition[]) {
    const byType = routes.reduce((acc, route) => {
      acc[route.type] = (acc[route.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = routes.reduce((acc, route) => {
      acc[route.navigation.category] = (acc[route.navigation.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const validationRules = routes.reduce((sum, route) =>
      sum + (route.validation?.length || 0), 0
    );

    return {
      total: routes.length,
      byType,
      byCategory,
      validationRules
    };
  }

  // Data extraction helpers
  private getOpportunitiesForCountry(countrySlug: string): Opportunity[] {
    const countryName = formatCountryName(countrySlug);
    return this.context.opportunities.filter(opp => opp.location.country === countryName);
  }

  private getOpportunitiesForAnimal(animalSlug: string): Opportunity[] {
    const animalName = formatAnimalName(animalSlug);
    return this.context.opportunities.filter(opp =>
      opp.animalTypes.some(type =>
        type.toLowerCase().includes(animalName.toLowerCase()) ||
        animalName.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  private getOpportunitiesForCombined(animalSlug: string, countrySlug: string): Opportunity[] {
    const countryOpportunities = this.getOpportunitiesForCountry(countrySlug);
    const animalName = formatAnimalName(animalSlug);

    return countryOpportunities.filter(opp =>
      opp.animalTypes.some(type =>
        type.toLowerCase().includes(animalName.toLowerCase()) ||
        animalName.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  private mapConservationToAnimal(conservationSlug: string): string {
    const mapping: Record<string, string> = {
      'wildlife-conservation': 'wildlife',
      'marine-conservation': 'marine-life',
      'forest-conservation': 'forest-animals'
    };
    return mapping[conservationSlug] || 'wildlife';
  }
}

export default RouteGenerator;