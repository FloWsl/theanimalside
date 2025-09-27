// src/routing/core/RouteGenerator.ts
// IMPLEMENTATION TARGET: Data-driven route generation from Phase 2

import { RouteDefinition, RouteCategory, SEOMetadata, PerformanceConfig, NavigationMetadata } from './RouteDefinition';
import { RoutePriorityCalculator } from './RoutePriorityCalculator';
import type { Opportunity } from '../../types/index';

export class RouteGenerator {
  private opportunities: Opportunity[];
  private routeCache: Map<string, RouteDefinition[]> = new Map();

  constructor(opportunities: Opportunity[]) {
    this.opportunities = opportunities;
  }

  /**
   * Generate all routes based on Phase 1 findings and Phase 2 architecture
   * Returns 22 routes total (25 legacy - 3 deleted)
   */
  generateAllRoutes(): RouteDefinition[] {
    const allRoutes: RouteDefinition[] = [
      ...this.generateCoreRoutes(),
      ...this.generateCountryRoutes(),
      ...this.generateAnimalRoutes(),
      ...this.generateCombinedRoutes(),
      ...this.generateOrganizationRoutes(),
      ...this.generateSystemRoutes()
    ];

    // Use RoutePriorityCalculator for proper ordering (fixes route conflicts)
    const calculator = new RoutePriorityCalculator();
    const orderingResult = calculator.calculateOrder(allRoutes);

    // Log any critical conflicts for debugging
    const criticalConflicts = orderingResult.conflicts.filter(c => c.severity === 'critical');
    if (criticalConflicts.length > 0) {
      console.warn(`⚠️  ${criticalConflicts.length} critical route conflicts detected and resolved`);
    }

    return orderingResult.orderedRoutes;
  }

  private generateCoreRoutes(): RouteDefinition[] {
    return [
      {
        id: 'home',
        path: '/',
        component: 'HomePage',
        priority: 'critical',
        type: 'static',
        seo: {
          title: 'Wildlife Conservation Volunteer Programs | The Animal Side',
          description: 'Discover authentic wildlife conservation volunteer opportunities worldwide. Work with animals, protect habitats, and make a real impact with vetted organizations.',
          keywords: ['wildlife volunteer', 'conservation programs', 'animal volunteer', 'eco tourism'],
          changefreq: 'weekly',
          priority: 1.0
        },
        performance: this.getHighPerformanceConfig(),
        navigation: {
          enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
          contextPreservation: false,
          analyticsEvents: ['home_page_view'],
          breadcrumbPath: ['Home']
        }
      },
      {
        id: 'opportunities',
        path: '/opportunities',
        component: 'OpportunitiesPage',
        priority: 'critical',
        type: 'static',
        seo: {
          title: 'Browse All Wildlife Conservation Volunteer Programs | The Animal Side',
          description: 'Browse and filter wildlife conservation volunteer opportunities worldwide. Find the perfect program for your interests and experience level.',
          keywords: ['browse volunteer programs', 'wildlife opportunities', 'conservation jobs'],
          changefreq: 'daily',
          priority: 0.9
        },
        performance: this.getHighPerformanceConfig(),
        navigation: {
          enabledFlows: ['to-country', 'to-animal', 'to-organization'],
          contextPreservation: true,
          analyticsEvents: ['opportunities_page_view', 'filter_applied'],
          breadcrumbPath: ['Home', 'Opportunities']
        }
      }
    ];
  }

  private generateCountryRoutes(): RouteDefinition[] {
    const countries = this.extractValidCountries();
    return countries.map(country => {
      const slug = this.formatCountrySlug(country);
      const name = this.formatCountryName(country);

      return {
        id: `country-${slug}`,
        path: `/volunteer-${slug}`,
        component: 'CountryLandingPage',
        priority: this.getCountryPriority(country),
        type: 'static',
        seo: this.generateCountrySEO(country),
        performance: this.getHighPerformanceConfig(),
        navigation: this.getCountryNavigationConfig(slug, name)
      } as RouteDefinition;
    });
  }

  private generateAnimalRoutes(): RouteDefinition[] {
    const animals = this.extractValidAnimals();
    return animals.map(animal => {
      const slug = this.formatAnimalSlug(animal);
      const name = this.formatAnimalName(animal);

      return {
        id: `animal-${slug}`,
        path: `/${slug}-volunteer`,
        component: 'AnimalLandingPage',
        priority: this.getAnimalPriority(animal),
        type: 'static',
        seo: this.generateAnimalSEO(animal),
        performance: this.getHighPerformanceConfig(),
        navigation: this.getAnimalNavigationConfig(slug, name)
      } as RouteDefinition;
    });
  }

  private generateCombinedRoutes(): RouteDefinition[] {
    const combinations = this.extractValidCombinations();
    const routes: RouteDefinition[] = [];

    combinations.forEach(([animal, country]) => {
      const animalSlug = this.formatAnimalSlug(animal);
      const countrySlug = this.formatCountrySlug(country);

      // Country-first format: /volunteer-costa-rica/lions
      routes.push({
        id: `combined-country-${countrySlug}-${animalSlug}`,
        path: `/volunteer-${countrySlug}/${animalSlug}`,
        component: 'CombinedPage',
        priority: 'high',
        type: 'static',
        seo: this.generateCombinedSEO(animal, country, 'country-first'),
        performance: this.getHighPerformanceConfig(),
        navigation: this.getCombinedNavigationConfig(animalSlug, countrySlug)
      } as RouteDefinition);

      // Animal-first format: /lions-volunteer/costa-rica
      routes.push({
        id: `combined-animal-${animalSlug}-${countrySlug}`,
        path: `/${animalSlug}-volunteer/${countrySlug}`,
        component: 'CombinedPage',
        priority: 'high',
        type: 'static',
        seo: this.generateCombinedSEO(animal, country, 'animal-first'),
        performance: this.getHighPerformanceConfig(),
        navigation: this.getCombinedNavigationConfig(animalSlug, countrySlug)
      } as RouteDefinition);
    });

    return routes;
  }

  private generateOrganizationRoutes(): RouteDefinition[] {
    // Generate organization routes based on opportunities data
    const organizations = this.extractUniqueOrganizations();

    return organizations.map(org => ({
      id: `organization-${org.slug}`,
      path: `/organization/${org.slug}`,
      component: 'OrganizationDetailPage',
      priority: 'medium',
      type: 'static',
      seo: {
        title: `${org.name} | Wildlife Conservation Volunteer Programs`,
        description: `Volunteer with ${org.name} in wildlife conservation programs. Authentic experiences focused on animal protection and habitat preservation.`,
        keywords: [org.name, 'volunteer', 'conservation', 'wildlife'],
        changefreq: 'monthly',
        priority: 0.7
      },
      performance: this.getHighPerformanceConfig(),
      navigation: {
        enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
        contextPreservation: true,
        analyticsEvents: ['organization_page_view', `org_${org.slug}_view`],
        breadcrumbPath: ['Home', 'Organizations', org.name]
      }
    }));
  }

  private generateSystemRoutes(): RouteDefinition[] {
    return [
      {
        id: 'not-found',
        path: '*',
        component: 'NotFoundPage',
        priority: 'low',
        type: 'system',
        seo: {
          title: 'Page Not Found | The Animal Side',
          description: 'The page you are looking for could not be found. Explore our wildlife conservation volunteer programs.',
          keywords: ['404', 'not found'],
          changefreq: 'yearly',
          priority: 0.1
        },
        performance: {
          lazyLoad: false,
          preload: 'none',
          cacheStrategy: 'none',
          bundleSplit: false
        },
        navigation: {
          enabledFlows: ['to-home', 'to-opportunities'],
          contextPreservation: false,
          analyticsEvents: ['404_page_view'],
          breadcrumbPath: ['Home', 'Not Found']
        }
      }
    ];
  }

  private extractValidCountries(): string[] {
    const countriesSet = new Set<string>();
    this.opportunities.forEach(opp => {
      countriesSet.add(opp.location.country);
    });
    return Array.from(countriesSet);
  }

  private extractValidAnimals(): string[] {
    const animalsSet = new Set<string>();
    this.opportunities.forEach(opp => {
      opp.animalTypes.forEach(animal => {
        animalsSet.add(animal);
      });
    });
    return Array.from(animalsSet);
  }

  private extractValidCombinations(): Array<[string, string]> {
    const combinations: Array<[string, string]> = [];
    this.opportunities.forEach(opp => {
      opp.animalTypes.forEach(animal => {
        combinations.push([animal, opp.location.country]);
      });
    });

    // Remove duplicates
    return Array.from(new Set(combinations.map(c => JSON.stringify(c))))
      .map(c => JSON.parse(c));
  }

  private extractUniqueOrganizations(): { name: string, slug: string }[] {
    const organizations = new Map<string, { name: string, slug: string }>();

    this.opportunities.forEach(opp => {
      if (opp.organizationSlug) {
        organizations.set(opp.organizationSlug, {
          name: opp.organization,
          slug: opp.organizationSlug
        });
      }
    });

    return Array.from(organizations.values());
  }

  // Removed sortByPriority and calculatePathSpecificity methods -
  // now using RoutePriorityCalculator for proper conflict-free ordering

  // Helper methods for SEO, performance, and navigation config
  private generateCountrySEO(country: string): SEOMetadata {
    const name = this.formatCountryName(country);
    return {
      title: `${name} Volunteer Programs | Wildlife Conservation | The Animal Side`,
      description: `Discover authentic wildlife conservation volunteer programs in ${name}. Work with animals, protect habitats, and make a real impact with vetted organizations.`,
      keywords: [name.toLowerCase(), 'volunteer', 'wildlife', 'conservation', 'programs'],
      changefreq: 'weekly',
      priority: 0.8
    };
  }

  private generateAnimalSEO(animal: string): SEOMetadata {
    const name = this.formatAnimalName(animal);
    return {
      title: `${name} Conservation Volunteer Programs | The Animal Side`,
      description: `Join ${name.toLowerCase()} conservation programs worldwide. Hands-on wildlife volunteering with ethical organizations focused on species protection.`,
      keywords: [name.toLowerCase(), 'conservation', 'volunteer', 'wildlife', 'programs'],
      changefreq: 'weekly',
      priority: 0.8
    };
  }

  private generateCombinedSEO(animal: string, country: string, format: 'country-first' | 'animal-first'): SEOMetadata {
    const animalName = this.formatAnimalName(animal);
    const countryName = this.formatCountryName(country);
    const canonical = `/volunteer-${this.formatCountrySlug(country)}/${this.formatAnimalSlug(animal)}`;

    return {
      title: `${animalName} Conservation Volunteer Programs in ${countryName} | The Animal Side`,
      description: `Volunteer with ${animalName.toLowerCase()} in ${countryName}. Authentic conservation programs focused on ${animalName.toLowerCase()} protection and habitat preservation.`,
      keywords: [animalName.toLowerCase(), countryName.toLowerCase(), 'volunteer', 'conservation', 'programs'],
      canonical,
      changefreq: 'monthly',
      priority: 0.9
    };
  }

  private getHighPerformanceConfig(): PerformanceConfig {
    return {
      lazyLoad: true,
      preload: 'hover',
      cacheStrategy: 'aggressive',
      bundleSplit: true
    };
  }

  private getCountryNavigationConfig(countrySlug: string, countryName: string): NavigationMetadata {
    return {
      enabledFlows: ['to-animal', 'to-combined', 'to-opportunities'],
      contextPreservation: true,
      analyticsEvents: [`country_page_view`, `country_${countrySlug}_navigation`],
      breadcrumbPath: ['Home', 'Countries', countryName]
    };
  }

  private getAnimalNavigationConfig(animalSlug: string, animalName: string): NavigationMetadata {
    return {
      enabledFlows: ['to-country', 'to-combined', 'to-opportunities'],
      contextPreservation: true,
      analyticsEvents: [`animal_page_view`, `animal_${animalSlug}_navigation`],
      breadcrumbPath: ['Home', 'Animals', animalName]
    };
  }

  private getCombinedNavigationConfig(animalSlug: string, countrySlug: string): NavigationMetadata {
    return {
      enabledFlows: ['to-opportunities', 'to-country', 'to-animal'],
      contextPreservation: true,
      analyticsEvents: [`combined_page_view`, `${animalSlug}_${countrySlug}_programs`],
      breadcrumbPath: ['Home', this.formatCountryName(countrySlug), this.formatAnimalName(animalSlug)]
    };
  }

  private getCountryPriority(country: string): 'critical' | 'high' | 'medium' | 'low' {
    // Based on Phase 1 SEO critical routes
    const highTrafficCountries = ['Costa Rica', 'Thailand', 'South Africa'];
    return highTrafficCountries.includes(country) ? 'critical' : 'high';
  }

  private getAnimalPriority(animal: string): 'critical' | 'high' | 'medium' | 'low' {
    // Based on Phase 1 SEO critical routes
    const highTrafficAnimals = ['Lions', 'Elephants', 'Sea Turtles'];
    return highTrafficAnimals.includes(animal) ? 'critical' : 'high';
  }

  // Utility methods for string formatting
  private formatCountrySlug(country: string): string {
    return country.toLowerCase().replace(/\s+/g, '-');
  }

  private formatAnimalSlug(animal: string): string {
    return animal.toLowerCase().replace(/\s+/g, '-');
  }

  private formatCountryName(countryInput: string): string {
    // Handle both slug format and regular country names
    if (countryInput.includes('-')) {
      // Convert slug back to proper name
      return countryInput.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return countryInput;
  }

  private formatAnimalName(animalInput: string): string {
    // Handle both slug format and regular animal names
    if (animalInput.includes('-')) {
      // Convert slug back to proper name
      return animalInput.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return animalInput;
  }
}

export default RouteGenerator;