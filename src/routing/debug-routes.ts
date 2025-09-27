// Debug script to see route generation and ordering
import { RouteGenerator } from './core/RouteGenerator.js';
import { RoutePriorityCalculator } from './core/RoutePriorityCalculator.js';
import type { Opportunity } from '../types/index.js';

const mockOpportunities: Opportunity[] = [
  {
    id: 'test-1',
    title: 'Sea Turtle Conservation in Costa Rica',
    organization: 'Costa Rica Wildlife Foundation',
    organizationSlug: 'costa-rica-wildlife',
    location: {
      country: 'Costa Rica',
      city: 'Guanacaste',
      coordinates: [10.6345, -85.4478]
    },
    animalTypes: ['Sea Turtles'],
    duration: { min: 1, max: 4 },
    description: 'Protect sea turtle nesting sites.',
    requirements: [],
    cost: {
      amount: 750,
      currency: 'USD',
      period: 'week',
      includes: []
    },
    images: [],
    featured: true,
    datePosted: '2024-01-01T00:00:00Z'
  }
];

console.log('🔍 Debug Route Generation and Ordering\n');

const generator = new RouteGenerator(mockOpportunities);
const routes = generator.generateAllRoutes();

console.log('📋 Generated Routes (in order):');
routes.forEach((route, index) => {
  console.log(`${index + 1}. [${route.type}] ${route.path} (${route.priority})`);
});

console.log('\n🎯 Looking for potential conflicts:');
for (let i = 0; i < routes.length; i++) {
  for (let j = i + 1; j < routes.length; j++) {
    const route1 = routes[i];
    const route2 = routes[j];

    // Simple conflict detection
    if (route2.path === '*' && route1.path !== '/') {
      console.log(`⚠️  Route ${i + 1} (${route1.path}) comes before catch-all route ${j + 1} (*) - This should be OK`);
    }

    if (route1.path === '*' && route2.path !== '*') {
      console.log(`🔴 CONFLICT: Catch-all route ${i + 1} (*) comes before specific route ${j + 1} (${route2.path}) - This is BAD`);
    }
  }
}

console.log('\n✅ Debug complete');