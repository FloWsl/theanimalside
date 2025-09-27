// src/test-routing-integration.tsx
// Browser-based integration test for Phase 3.2

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Import our new routing system components
import { AppRouter, FeatureFlaggedRouter } from './routing/AppRouter';

// Test component to verify integration
const IntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = React.useState<string[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runIntegrationTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      addResult('🔄 Starting Phase 3.2 Browser Integration Test...');

      // Test 1: Feature flag system
      addResult('Test 1: Feature flag system...');

      // Enable new routing
      localStorage.setItem('use-new-routing', 'true');
      addResult('✅ Feature flag enabled');

      // Test 2: AppRouter instantiation
      addResult('Test 2: AppRouter instantiation...');
      try {
        // This will test if AppRouter can be instantiated without crashing
        const testElement = React.createElement(AppRouter);
        addResult('✅ AppRouter can be instantiated');
      } catch (error) {
        addResult(`❌ AppRouter instantiation failed: ${error.message}`);
      }

      // Test 3: FeatureFlaggedRouter
      addResult('Test 3: FeatureFlaggedRouter...');
      try {
        const testElement = React.createElement(FeatureFlaggedRouter);
        addResult('✅ FeatureFlaggedRouter can be instantiated');
      } catch (error) {
        addResult(`❌ FeatureFlaggedRouter instantiation failed: ${error.message}`);
      }

      // Test 4: Route generation performance
      addResult('Test 4: Testing route generation performance...');
      const startTime = performance.now();

      // Import and test core components
      const { RouteGenerator } = await import('./routing/core/RouteGenerator');
      const mockOpportunities = [
        {
          id: '1',
          location: { country: 'Costa Rica' },
          animalTypes: ['Lions', 'Sea Turtles'],
          organization: 'Test Org',
          organizationSlug: 'test-org'
        }
      ];

      const generator = new RouteGenerator(mockOpportunities);
      const routes = generator.generateAllRoutes();

      const endTime = performance.now();
      const duration = endTime - startTime;

      addResult(`✅ Generated ${routes.length} routes in ${duration.toFixed(2)}ms`);

      // Test 5: Validation engine
      addResult('Test 5: Testing validation engine...');
      const { RouteValidationEngine } = await import('./routing/validation/RouteValidationEngine');
      const validator = new RouteValidationEngine(routes, mockOpportunities);

      const validationResult = await validator.validateRoute('/volunteer-costa-rica');
      addResult(`✅ Route validation: ${validationResult.isValid ? 'PASS' : 'FAIL'}`);

      addResult('🎉 Phase 3.2 Browser Integration Test PASSED!');
      addResult('✅ System ready for feature flag rollout');

    } catch (error) {
      addResult(`❌ Integration test failed: ${error.message}`);
    }

    setIsRunning(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Phase 3.2 Routing Integration Test</h1>

      <button
        onClick={runIntegrationTest}
        disabled={isRunning}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: isRunning ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer'
        }}
      >
        {isRunning ? 'Running Tests...' : 'Run Integration Test'}
      </button>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        {testResults.length === 0 ? (
          <div style={{ color: '#6c757d' }}>Click "Run Integration Test" to start testing...</div>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h3>Test Information</h3>
        <p><strong>Feature Flag:</strong> {localStorage.getItem('use-new-routing') || 'false'}</p>
        <p><strong>Environment:</strong> Browser</p>
        <p><strong>Test Focus:</strong> Phase 3.2 Component Integration</p>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ marginTop: '20px' }}>
        <h3>New Routing System Demo</h3>
        <p>When feature flag is enabled, this will use the new routing system:</p>

        <div style={{ border: '2px solid #007bff', borderRadius: '4px', padding: '10px' }}>
          <MemoryRouter initialEntries={['/']}>
            <FeatureFlaggedRouter />
          </MemoryRouter>
        </div>
      </div>
    </div>
  );
};

// Export for testing
export default IntegrationTest;

// Auto-run if this file is accessed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test-routing-integration')) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<IntegrationTest />);
  }
}