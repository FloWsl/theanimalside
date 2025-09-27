// Brutal test of Phase 3.1 routing foundation
// Tests if components actually work as claimed

import fs from 'fs';
import { performance } from 'perf_hooks';

console.log('🔥 BRUTAL PHASE 3.1 FOUNDATION TEST');
console.log('Testing if implementation actually works...\n');

// Test 1: Check if all files exist
console.log('📁 Test 1: File existence check');
const requiredFiles = [
  'src/routing/core/RouteDefinition.ts',
  'src/routing/core/RouteGenerator.ts',
  'src/routing/core/RoutePriorityCalculator.ts',
  'src/routing/validation/RouteValidationEngine.ts',
  'src/routing/navigation/NavigationFlowSystem.ts',
  'src/routing/performance/RoutePerformanceMonitor.ts',
  'src/routing/index.ts'
];

let missingFiles = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.log('❌ MISSING FILES:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ All required files exist');
}
console.log();

// Test 2: Check TypeScript compilation
console.log('🔧 Test 2: TypeScript compilation check');
try {
  // Try to import and use the routing components
  console.log('   Checking if routing modules can be imported...');

  // Read the actual source files to check for basic syntax errors
  const routeDefContent = fs.readFileSync('src/routing/core/RouteDefinition.ts', 'utf8');
  const routeGenContent = fs.readFileSync('src/routing/core/RouteGenerator.ts', 'utf8');

  // Basic syntax check - look for export statements
  if (!routeDefContent.includes('export interface RouteDefinition')) {
    console.log('❌ RouteDefinition interface not properly exported');
  } else if (!routeGenContent.includes('export class RouteGenerator')) {
    console.log('❌ RouteGenerator class not properly exported');
  } else {
    console.log('✅ Core exports appear to be present');
  }
} catch (error) {
  console.log(`❌ TypeScript compilation issue: ${error.message}`);
}
console.log();

// Test 3: Check test files exist and are comprehensive
console.log('🧪 Test 3: Test file coverage check');
const testFiles = [
  'src/routing/tests/RouteDefinition.test.ts',
  'src/routing/tests/RouteGenerator.test.ts',
  'src/routing/tests/RoutePriorityCalculator.test.ts',
  'src/routing/tests/RouteValidationEngine.test.ts',
  'src/routing/tests/Integration.test.ts',
  'src/routing/tests/FoundationValidation.test.ts'
];

let missingTests = [];
for (const testFile of testFiles) {
  if (!fs.existsSync(testFile)) {
    missingTests.push(testFile);
  }
}

if (missingTests.length > 0) {
  console.log('❌ MISSING TEST FILES:');
  missingTests.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ All test files exist');

  // Check if tests have actual content
  try {
    const integrationTest = fs.readFileSync('src/routing/tests/Integration.test.ts', 'utf8');
    if (integrationTest.includes('describe(') && integrationTest.includes('test(')) {
      console.log('✅ Tests appear to have proper structure');
    } else {
      console.log('❌ Tests may be incomplete or malformed');
    }
  } catch (error) {
    console.log('❌ Cannot read test files');
  }
}
console.log();

// Test 4: Check dependencies and imports
console.log('📦 Test 4: Import dependency check');
try {
  const indexContent = fs.readFileSync('src/routing/index.ts', 'utf8');
  const routeGenContent = fs.readFileSync('src/routing/core/RouteGenerator.ts', 'utf8');

  // Check critical imports
  if (routeGenContent.includes("import type { Opportunity } from '../../types/index'")) {
    // Check if the types file actually exists and has Opportunity interface
    const typesContent = fs.readFileSync('src/types/index.ts', 'utf8');
    if (typesContent.includes('export interface Opportunity')) {
      console.log('✅ Opportunity type import chain is valid');
    } else {
      console.log('❌ Opportunity interface not found in types file');
    }
  } else {
    console.log('❌ RouteGenerator missing critical Opportunity import');
  }

  // Check if all exports are present in index.ts
  if (indexContent.includes('RouteGenerator') &&
      indexContent.includes('RouteValidationEngine') &&
      indexContent.includes('RoutePriorityCalculator')) {
    console.log('✅ Main exports appear to be present');
  } else {
    console.log('❌ Missing critical exports in index.ts');
  }
} catch (error) {
  console.log(`❌ Import check failed: ${error.message}`);
}
console.log();

// Test 5: Performance simulation (basic)
console.log('⚡ Test 5: Basic performance test');
try {
  // Simulate what the RouteGenerator would do
  const mockOpportunities = Array.from({length: 100}, (_, i) => ({
    id: `opp-${i}`,
    title: `Opportunity ${i}`,
    organization: `Org ${i}`,
    location: {
      country: `Country ${i % 10}`,
      city: `City ${i}`,
      coordinates: [0, 0]
    },
    animalTypes: [`Animal ${i % 5}`],
    duration: { min: 1, max: 4 },
    description: 'Test',
    requirements: [],
    cost: { amount: 500, currency: 'USD', period: 'week', includes: [] },
    images: [],
    featured: false,
    datePosted: '2024-01-01T00:00:00Z'
  }));

  const start = performance.now();
  // Simulate route generation (extract countries and animals)
  const countries = new Set(mockOpportunities.map(o => o.location.country));
  const animals = new Set(mockOpportunities.flatMap(o => o.animalTypes));
  const routeCount = countries.size + animals.size + (countries.size * animals.size * 2); // bidirectional
  const end = performance.now();

  console.log(`   Simulated generation of ${routeCount} routes from ${mockOpportunities.length} opportunities`);
  console.log(`   Time: ${(end - start).toFixed(2)}ms`);

  if (end - start < 100) {
    console.log('✅ Performance target met (<100ms)');
  } else {
    console.log('❌ Performance target missed (≥100ms)');
  }
} catch (error) {
  console.log(`❌ Performance test failed: ${error.message}`);
}
console.log();

// Test 6: Integration readiness
console.log('🔗 Test 6: Integration readiness check');
try {
  const indexContent = fs.readFileSync('src/routing/index.ts', 'utf8');
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');

  // Check if App.tsx is ready to integrate the new routing system
  if (appContent.includes('import') && appContent.includes('Route')) {
    console.log('✅ App.tsx has routing imports');

    // Check if there's any reference to the new routing system
    if (appContent.includes('src/routing') || indexContent.includes('RouteGenerator')) {
      console.log('⚠️  New routing system might already be partially integrated');
    } else {
      console.log('✅ App.tsx ready for new routing integration');
    }
  } else {
    console.log('❌ App.tsx may not be ready for routing integration');
  }
} catch (error) {
  console.log(`❌ Integration readiness check failed: ${error.message}`);
}
console.log();

// FINAL VERDICT
console.log('🏁 FINAL BRUTAL ASSESSMENT:');
console.log('==================================');

let criticalIssues = 0;
if (missingFiles.length > 0) criticalIssues++;
if (missingTests.length > 0) criticalIssues++;

if (criticalIssues === 0) {
  console.log('🟡 PARTIALLY COMPLETE - Files exist but actual functionality untested');
  console.log('   ❗ Missing: Actual test execution and performance validation');
  console.log('   ❗ Missing: Real integration testing');
  console.log('   ❗ Missing: Performance metrics measurement');
  console.log('   ❗ Status: NOT READY for Phase 3.2');
} else {
  console.log('🔴 INCOMPLETE - Critical files or tests missing');
  console.log('   ❗ Phase 3.1 checklist is FALSE');
  console.log('   ❗ Cannot proceed to Phase 3.2');
}

console.log('\n💡 Next steps needed:');
console.log('   1. Run actual tests with a testing framework');
console.log('   2. Measure real performance metrics');
console.log('   3. Test component integration');
console.log('   4. Validate all imports resolve correctly');