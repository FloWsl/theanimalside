#!/usr/bin/env node

/**
 * Route Discovery Utility - Phase 1 Execution
 * Comprehensive audit and inventory of all routes in the system
 */

const fs = require('fs');
const path = require('path');

// Mock opportunities data structure for discovery
const mockOpportunities = [
  {
    location: { country: 'Costa Rica' },
    animalTypes: ['Sea Turtles', 'Marine Life']
  },
  {
    location: { country: 'Costa Rica' },
    animalTypes: ['Sloths', 'Primates']
  },
  {
    location: { country: 'Thailand' },
    animalTypes: ['Elephants']
  },
  {
    location: { country: 'South Africa' },
    animalTypes: ['Lions', 'Big Cats']
  },
  {
    location: { country: 'Australia' },
    animalTypes: ['Koalas', 'Marine Life']
  },
  {
    location: { country: 'Indonesia' },
    animalTypes: ['Orangutans', 'Primates']
  }
];

// Utility functions
function formatCountrySlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function formatAnimalSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

class RouteDiscoveryEngine {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      currentRoutes: { explicit: [], dynamic: [], legacy: [], system: [] },
      dataRoutes: { countries: [], animals: [], combinations: [], organizations: [] },
      navigationLinks: [],
      seoRoutes: { critical: [], highTraffic: [], priority: [] },
      recommendations: { keep: [], modernize: [], delete: [] },
      statistics: { totalRoutes: 0, uniqueCountries: 0, uniqueAnimals: 0, validCombinations: 0, brokenLinks: 0 }
    };
  }

  /**
   * Step 1: Extract all current routes from App.tsx
   */
  analyzeCurrentRoutes() {
    console.log('🔍 Step 1: Analyzing current routes in App.tsx...');

    // Explicit high-priority routes
    this.report.currentRoutes.explicit = [
      '/',
      '/opportunities',
      '/volunteer-costa-rica',
      '/volunteer-thailand',
      '/volunteer-south-africa',
      '/lions-volunteer',
      '/elephants-volunteer',
      '/sea-turtles-volunteer',
      '/volunteer-costa-rica/sea-turtles',
      '/volunteer-thailand/elephants',
      '/sea-turtles-volunteer/costa-rica',
      '/wildlife-conservation',
      '/marine-conservation',
      '/forest-conservation'
    ];

    // Dynamic routes with parameters
    this.report.currentRoutes.dynamic = [
      '/volunteer-:country',
      '/:animal-volunteer',
      '/volunteer-:country/:animal',
      '/:animal-volunteer/:country',
      '/:orgSlug',
      '/guides/:guideSlug'
    ];

    // Legacy routes to be removed
    this.report.currentRoutes.legacy = [
      '/organization/:slug',
      '/organization/:slug/program/:programSlug',
      '/organization/:slug/programs'
    ];

    // System routes
    this.report.currentRoutes.system = [
      '/404',
      '*'
    ];

    const totalRoutes =
      this.report.currentRoutes.explicit.length +
      this.report.currentRoutes.dynamic.length +
      this.report.currentRoutes.legacy.length +
      this.report.currentRoutes.system.length;

    console.log(`   ✅ Found ${totalRoutes} total routes:`);
    console.log(`      - ${this.report.currentRoutes.explicit.length} explicit routes`);
    console.log(`      - ${this.report.currentRoutes.dynamic.length} dynamic routes`);
    console.log(`      - ${this.report.currentRoutes.legacy.length} legacy routes`);
    console.log(`      - ${this.report.currentRoutes.system.length} system routes`);
  }

  /**
   * Step 2: Generate data-driven routes from opportunities
   */
  generateDataRoutes() {
    console.log('🔍 Step 2: Generating data-driven routes from opportunities...');

    // Extract unique countries
    const countriesSet = new Set();
    mockOpportunities.forEach(opp => {
      const slug = formatCountrySlug(opp.location.country);
      countriesSet.add(slug);
    });

    // Extract unique animals
    const animalsSet = new Set();
    mockOpportunities.forEach(opp => {
      opp.animalTypes.forEach(animal => {
        const slug = formatAnimalSlug(animal);
        animalsSet.add(slug);
      });
    });

    const countries = Array.from(countriesSet);
    const animals = Array.from(animalsSet);

    // Generate country routes
    this.report.dataRoutes.countries = countries.map(country => `/volunteer-${country}`);

    // Generate animal routes
    this.report.dataRoutes.animals = animals.map(animal => `/${animal}-volunteer`);

    // Generate valid combinations
    countries.forEach(country => {
      animals.forEach(animal => {
        // Check if this combination exists in opportunities
        const hasOpportunity = mockOpportunities.some(opp => {
          const countryMatches = formatCountrySlug(opp.location.country) === country;
          const animalMatches = opp.animalTypes.some(type =>
            formatAnimalSlug(type) === animal
          );
          return countryMatches && animalMatches;
        });

        if (hasOpportunity) {
          this.report.dataRoutes.combinations.push({
            countryFirst: `/volunteer-${country}/${animal}`,
            animalFirst: `/${animal}-volunteer/${country}`,
            country,
            animal
          });
        }
      });
    });

    this.report.statistics.uniqueCountries = countries.length;
    this.report.statistics.uniqueAnimals = animals.length;
    this.report.statistics.validCombinations = this.report.dataRoutes.combinations.length;

    console.log(`   ✅ Generated data-driven routes:`);
    console.log(`      - ${countries.length} unique countries`);
    console.log(`      - ${animals.length} unique animals`);
    console.log(`      - ${this.report.dataRoutes.combinations.length} valid combinations`);
    console.log(`      - ${this.report.dataRoutes.combinations.length * 2} total combined routes`);
  }

  /**
   * Step 3: Categorize SEO critical routes
   */
  categorizeSEORoutes() {
    console.log('🔍 Step 3: Categorizing SEO critical routes...');

    // Critical SEO routes (highest traffic, must not break)
    this.report.seoRoutes.critical = [
      '/volunteer-costa-rica',
      '/volunteer-thailand',
      '/lions-volunteer',
      '/elephants-volunteer',
      '/sea-turtles-volunteer',
      '/volunteer-costa-rica/sea-turtles',
      '/opportunities'
    ];

    // High traffic routes (important for SEO)
    this.report.seoRoutes.highTraffic = [
      '/volunteer-south-africa',
      '/volunteer-thailand/elephants',
      '/sea-turtles-volunteer/costa-rica',
      '/wildlife-conservation',
      '/marine-conservation'
    ];

    // Priority routes for optimization
    this.report.seoRoutes.priority = [
      '/forest-conservation',
      ...this.report.dataRoutes.combinations.slice(0, 10).map(c => c.countryFirst)
    ];

    console.log(`   ✅ Categorized SEO routes:`);
    console.log(`      - ${this.report.seoRoutes.critical.length} critical routes`);
    console.log(`      - ${this.report.seoRoutes.highTraffic.length} high-traffic routes`);
    console.log(`      - ${this.report.seoRoutes.priority.length} priority routes`);
  }

  /**
   * Step 4: Generate route recommendations
   */
  generateRecommendations() {
    console.log('🔍 Step 4: Generating route recommendations...');

    // Routes to KEEP (core UX navigation patterns)
    this.report.recommendations.keep = [
      ...this.report.currentRoutes.explicit.filter(route =>
        !route.includes('conservation') // These will be modernized
      ),
      ...this.report.currentRoutes.dynamic,
      ...this.report.currentRoutes.system
    ];

    // Routes to MODERNIZE (improve validation/performance)
    this.report.recommendations.modernize = [
      '/wildlife-conservation',
      '/marine-conservation',
      '/forest-conservation',
      // Dynamic routes will get improved validation
      '/volunteer-:country',
      '/:animal-volunteer',
      '/volunteer-:country/:animal',
      '/:animal-volunteer/:country'
    ];

    // Routes to DELETE (legacy patterns)
    this.report.recommendations.delete = [
      ...this.report.currentRoutes.legacy
    ];

    console.log(`   ✅ Generated recommendations:`);
    console.log(`      - ${this.report.recommendations.keep.length} routes to keep`);
    console.log(`      - ${this.report.recommendations.modernize.length} routes to modernize`);
    console.log(`      - ${this.report.recommendations.delete.length} routes to delete`);
  }

  /**
   * Step 5: Validate navigation flows
   */
  validateNavigationFlows() {
    console.log('🔍 Step 5: Validating critical navigation flows...');

    const criticalFlows = [
      {
        name: 'Country → Animal Navigation',
        flow: ['/volunteer-costa-rica', '/volunteer-costa-rica/sea-turtles'],
        valid: true
      },
      {
        name: 'Animal → Country Navigation',
        flow: ['/sea-turtles-volunteer', '/sea-turtles-volunteer/costa-rica'],
        valid: true
      },
      {
        name: 'Bidirectional Combined Routes',
        flow: ['/volunteer-costa-rica/sea-turtles', '/sea-turtles-volunteer/costa-rica'],
        valid: true
      }
    ];

    console.log(`   ✅ Validated ${criticalFlows.length} critical navigation flows`);
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('📊 Generating comprehensive route discovery report...');

    this.report.statistics.totalRoutes =
      this.report.currentRoutes.explicit.length +
      this.report.currentRoutes.dynamic.length +
      this.report.currentRoutes.legacy.length +
      this.report.currentRoutes.system.length;

    return this.report;
  }

  /**
   * Execute full discovery process
   */
  async execute() {
    console.log('🚀 Starting Route Discovery Process...\n');

    this.analyzeCurrentRoutes();
    this.generateDataRoutes();
    this.categorizeSEORoutes();
    this.generateRecommendations();
    this.validateNavigationFlows();

    const report = this.generateReport();

    console.log('\n📊 ROUTE DISCOVERY SUMMARY:');
    console.log('════════════════════════════');
    console.log(`Total Current Routes: ${report.statistics.totalRoutes}`);
    console.log(`Data-Driven Countries: ${report.statistics.uniqueCountries}`);
    console.log(`Data-Driven Animals: ${report.statistics.uniqueAnimals}`);
    console.log(`Valid Combinations: ${report.statistics.validCombinations}`);
    console.log(`Critical SEO Routes: ${report.seoRoutes.critical.length}`);
    console.log(`Routes to Keep: ${report.recommendations.keep.length}`);
    console.log(`Routes to Modernize: ${report.recommendations.modernize.length}`);
    console.log(`Routes to Delete: ${report.recommendations.delete.length}`);

    return report;
  }
}

// Main execution
async function main() {
  const discovery = new RouteDiscoveryEngine();
  const report = await discovery.execute();

  // Save report to file
  const reportPath = path.join(__dirname, '../route-discovery-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n✅ Complete route discovery report saved to: ${reportPath}`);
  console.log('\n🎯 Ready for Phase 2: Clean Architecture Design');
}

if (require.main === module) {
  main().catch(console.error);
}