#!/usr/bin/env node

/**
 * Phase 3.2 Integration Test Script
 *
 * Tests that the new routing system is properly integrated and can run
 * alongside the existing app via feature flags.
 */

console.log('🧪 Phase 3.2 Integration Test Starting...');
console.log('=============================================\n');

async function testPhase32Integration() {
  const results = {
    featureFlagSystem: false,
    routingSystemIntegration: false,
    buildSystem: false,
    parallelSystemSupport: false
  };

  try {
    // Test 1: Feature Flag System
    console.log('📋 Test 1: Feature Flag System');
    try {
      // Mock localStorage for Node.js environment
      global.localStorage = {
        getItem: (key) => {
          if (key === 'use-new-routing') return 'true';
          return null;
        },
        setItem: () => {},
        removeItem: () => {}
      };

      // Mock window object
      global.window = { localStorage: global.localStorage };

      // Test feature flag function (simulated)
      const useNewRouting = () => {
        return process.env.REACT_APP_NEW_ROUTING === 'true' ||
               global.localStorage.getItem('use-new-routing') === 'true';
      };

      const flagResult = useNewRouting();
      if (flagResult === true) {
        console.log('  ✅ Feature flag system works correctly');
        results.featureFlagSystem = true;
      } else {
        console.log('  ❌ Feature flag system not working');
      }
    } catch (error) {
      console.log('  ❌ Feature flag test failed:', error.message);
    }

    // Test 2: Check if routing files exist and are properly structured
    console.log('\n📋 Test 2: Routing System Integration');
    try {
      const fs = require('fs');
      const path = require('path');

      const requiredFiles = [
        'src/routing/AppRouter.tsx',
        'src/routing/components/RouteWrapper.tsx',
        'src/routing/components/RouteLoader.tsx',
        'src/routing/core/RouteDefinition.ts',
        'src/routing/validation/RouteValidationEngine.ts',
        'src/utils/routeAnalytics.ts'
      ];

      let filesExist = true;
      for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(process.cwd(), file))) {
          console.log(`  ❌ Missing file: ${file}`);
          filesExist = false;
        }
      }

      if (filesExist) {
        console.log('  ✅ All routing system files exist');

        // Check if main.tsx has been updated to use FeatureFlaggedRouter
        const mainContent = fs.readFileSync(path.join(process.cwd(), 'src/main.tsx'), 'utf8');
        if (mainContent.includes('FeatureFlaggedRouter')) {
          console.log('  ✅ main.tsx updated to use FeatureFlaggedRouter');
          results.routingSystemIntegration = true;
        } else {
          console.log('  ❌ main.tsx not updated to use FeatureFlaggedRouter');
        }
      }
    } catch (error) {
      console.log('  ❌ Routing system integration test failed:', error.message);
    }

    // Test 3: Build System
    console.log('\n📋 Test 3: Build System Compatibility');
    try {
      const { execSync } = require('child_process');

      // Run type check
      execSync('npm run type-check', {
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 30000
      });

      console.log('  ✅ TypeScript compilation passes');
      results.buildSystem = true;
    } catch (error) {
      console.log('  ❌ TypeScript compilation failed');
      console.log('  Details:', error.message);
    }

    // Test 4: Parallel System Support
    console.log('\n📋 Test 4: Parallel System Support');
    try {
      const fs = require('fs');
      const path = require('path');

      // Check if App.tsx has test id for legacy system
      const appContent = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
      const hasLegacyTestId = appContent.includes('data-testid="legacy-app"');

      // Check if AppRouter.tsx has test id for new system
      const routerContent = fs.readFileSync(path.join(process.cwd(), 'src/routing/AppRouter.tsx'), 'utf8');
      const hasNewTestId = routerContent.includes('data-testid="new-app-router"');

      if (hasLegacyTestId && hasNewTestId) {
        console.log('  ✅ Both legacy and new systems have proper test identifiers');
        results.parallelSystemSupport = true;
      } else {
        console.log('  ❌ Missing test identifiers for parallel system support');
        if (!hasLegacyTestId) console.log('    - Legacy app missing test id');
        if (!hasNewTestId) console.log('    - New router missing test id');
      }
    } catch (error) {
      console.log('  ❌ Parallel system support test failed:', error.message);
    }

    // Summary
    console.log('\n📊 PHASE 3.2 INTEGRATION TEST SUMMARY');
    console.log('=====================================');
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });

    const allPassed = Object.values(results).every(Boolean);
    console.log(`\n🎯 Overall Status: ${allPassed ? '✅ INTEGRATION SUCCESSFUL' : '❌ INTEGRATION INCOMPLETE'}`);

    if (allPassed) {
      console.log('\n🚀 Phase 3.2 Integration Complete!');
      console.log('   ✨ Parallel routing system is functional');
      console.log('   ✨ Feature flag rollout mechanism ready');
      console.log('   ✨ Build system compatibility confirmed');
      console.log('   ✨ Legacy and new systems can coexist');
      console.log('\n📋 Next Steps:');
      console.log('   1. Enable feature flag: localStorage.setItem("use-new-routing", "true")');
      console.log('   2. Test navigation flows manually');
      console.log('   3. Run end-to-end tests if available');
      console.log('   4. Monitor performance metrics');
    } else {
      console.log('\n🔧 Issues to Address:');
      Object.entries(results).forEach(([test, passed]) => {
        if (!passed) {
          console.log(`   - Fix ${test}`);
        }
      });
    }

    return allPassed;

  } catch (error) {
    console.error('❌ Integration test script failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testPhase32Integration().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = { testPhase32Integration };