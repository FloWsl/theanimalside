import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for feature flag testing
export interface FeatureFlagTestConfig {
  flagName: string;
  testScenarios: TestScenario[];
  validationRules: ValidationRule[];
  rollbackThreshold: number;
}

export interface TestScenario {
  id: string;
  name: string;
  userSegment: string;
  expectedBehavior: string;
  validationCriteria: string[];
  route?: string;
  userActions?: UserAction[];
}

export interface ValidationRule {
  id: string;
  name: string;
  condition: (result: any) => boolean;
  errorMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UserAction {
  type: 'click' | 'navigate' | 'input' | 'wait';
  target?: string;
  value?: string;
  timeout?: number;
}

export interface TestProgress {
  current: number;
  total: number;
  status: 'initializing' | 'running' | 'completed' | 'failed' | 'paused';
  currentScenario?: string;
}

export interface TestResults {
  scenarioResults: ScenarioResult[];
  overallScore: number;
  passRate: number;
  failedTests: string[];
  recommendations: string[];
  performanceMetrics: PerformanceMetric[];
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  validationResults: ValidationResult[];
  errorMessage?: string;
  performanceData?: Record<string, number>;
}

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  actualValue?: any;
  expectedValue?: any;
  errorMessage?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  benchmark?: number;
  status: 'good' | 'warning' | 'critical';
}

// Component Props
interface FeatureFlagTesterProps {
  config: FeatureFlagTestConfig;
  onTestComplete: (results: TestResults) => void;
  onProgressUpdate?: (progress: TestProgress) => void;
  autoStart?: boolean;
  className?: string;
}

// Main Component
export const FeatureFlagTester: React.FC<FeatureFlagTesterProps> = ({
  config,
  onTestComplete,
  onProgressUpdate,
  autoStart = false,
  className = ''
}) => {
  const [testProgress, setTestProgress] = useState<TestProgress>({
    current: 0,
    total: config.testScenarios.length,
    status: 'initializing'
  });

  const [testResults, setTestResults] = useState<TestResults>({
    scenarioResults: [],
    overallScore: 0,
    passRate: 0,
    failedTests: [],
    recommendations: [],
    performanceMetrics: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<TestScenario | null>(null);

  // Execute individual test scenario
  const executeTestScenario = useCallback(async (scenario: TestScenario): Promise<ScenarioResult> => {
    const startTime = performance.now();

    try {
      // Set current scenario for UI updates
      setCurrentScenario(scenario);

      // Execute the scenario
      const scenarioResults = await runScenarioTests(scenario);

      // Validate results against criteria
      const validationResults = validateResults(scenarioResults, scenario.validationCriteria);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Determine if scenario passed
      const passed = validationResults.every(result => result.passed);

      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        status: passed ? 'passed' : 'failed',
        duration,
        validationResults,
        performanceData: {
          executionTime: duration,
          memoryUsage: await getMemoryUsage(),
          networkRequests: await getNetworkRequestCount()
        }
      };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        status: 'failed',
        duration,
        validationResults: [],
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, []);

  // Run all test scenarios
  const runAllTests = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    setTestProgress(prev => ({ ...prev, status: 'running', current: 0 }));

    const results: ScenarioResult[] = [];

    for (let i = 0; i < config.testScenarios.length; i++) {
      const scenario = config.testScenarios[i];

      // Update progress
      const progress: TestProgress = {
        current: i + 1,
        total: config.testScenarios.length,
        status: 'running',
        currentScenario: scenario.name
      };
      setTestProgress(progress);
      onProgressUpdate?.(progress);

      // Execute scenario
      const result = await executeTestScenario(scenario);
      results.push(result);

      // Check rollback threshold
      const failureRate = results.filter(r => r.status === 'failed').length / results.length;
      if (failureRate > config.rollbackThreshold) {
        console.warn(`🚨 Failure rate ${failureRate} exceeds rollback threshold ${config.rollbackThreshold}`);
        break;
      }
    }

    // Calculate final results
    const finalResults: TestResults = {
      scenarioResults: results,
      overallScore: calculateOverallScore(results),
      passRate: results.filter(r => r.status === 'passed').length / results.length,
      failedTests: results.filter(r => r.status === 'failed').map(r => r.scenarioName),
      recommendations: generateRecommendations(results),
      performanceMetrics: aggregatePerformanceMetrics(results)
    };

    setTestResults(finalResults);
    setTestProgress(prev => ({ ...prev, status: 'completed' }));
    setIsRunning(false);
    setCurrentScenario(null);

    onTestComplete(finalResults);
  }, [config, executeTestScenario, onTestComplete, onProgressUpdate]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isRunning) {
      runAllTests();
    }
  }, [autoStart, runAllTests, isRunning]);

  return (
    <div className={`feature-flag-tester bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Feature Flag Testing</h2>
          <p className="text-gray-600 mt-1">Testing flag: <span className="font-mono font-medium">{config.flagName}</span></p>
        </div>

        {/* Test Progress */}
        <TestProgressIndicator progress={testProgress} />

        {/* Current Scenario */}
        <AnimatePresence>
          {currentScenario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 rounded-lg p-4"
            >
              <h3 className="font-semibold text-blue-900 mb-2">Current Test Scenario</h3>
              <div className="text-sm text-blue-800">
                <p><strong>Name:</strong> {currentScenario.name}</p>
                <p><strong>User Segment:</strong> {currentScenario.userSegment}</p>
                <p><strong>Expected Behavior:</strong> {currentScenario.expectedBehavior}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scenario Runner */}
        <ScenarioRunner
          scenarios={config.testScenarios}
          onScenarioComplete={executeTestScenario}
          isRunning={isRunning}
        />

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Start Tests'}
          </button>

          {isRunning && (
            <button
              onClick={() => setIsRunning(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
            >
              Stop Tests
            </button>
          )}
        </div>

        {/* Results */}
        {testResults.scenarioResults.length > 0 && (
          <TestResultsDisplay results={testResults} />
        )}
      </div>
    </div>
  );
};

// Supporting Components
const TestProgressIndicator: React.FC<{ progress: TestProgress }> = ({ progress }) => {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  const statusColors = {
    initializing: 'bg-gray-400',
    running: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
    paused: 'bg-yellow-500'
  };

  const statusLabels = {
    initializing: 'Initializing',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
    paused: 'Paused'
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-600">
          {progress.current} / {progress.total} scenarios
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${statusColors[progress.status]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className={`px-2 py-1 rounded text-white ${statusColors[progress.status]}`}>
          {statusLabels[progress.status]}
        </span>
        {progress.currentScenario && (
          <span className="text-gray-600">Current: {progress.currentScenario}</span>
        )}
      </div>
    </div>
  );
};

const ScenarioRunner: React.FC<{
  scenarios: TestScenario[];
  onScenarioComplete: (scenario: TestScenario) => Promise<ScenarioResult>;
  isRunning: boolean;
}> = ({ scenarios, isRunning }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Test Scenarios</h3>
      <div className="space-y-2">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            className={`p-3 rounded-lg border ${
              isRunning ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                <p className="text-sm text-gray-600">{scenario.userSegment}</p>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                #{index + 1}
              </span>
            </div>
            {scenario.validationCriteria.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Validation criteria:</p>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {scenario.validationCriteria.map((criteria, i) => (
                    <li key={i}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestResultsDisplay: React.FC<{ results: TestResults }> = ({ results }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Test Results</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900">Overall Score</h4>
          <p className="text-2xl font-bold text-green-700">{results.overallScore}%</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900">Pass Rate</h4>
          <p className="text-2xl font-bold text-blue-700">{Math.round(results.passRate * 100)}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-900">Failed Tests</h4>
          <p className="text-2xl font-bold text-red-700">{results.failedTests.length}</p>
        </div>
      </div>

      {/* Failed Tests */}
      {results.failedTests.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Failed Test Scenarios</h4>
          <ul className="text-sm text-red-800 list-disc list-inside">
            {results.failedTests.map((test, index) => (
              <li key={index}>{test}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-yellow-800 list-disc list-inside">
            {results.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper Functions
async function runScenarioTests(scenario: TestScenario): Promise<any> {
  // Simulate scenario execution
  // In real implementation, this would interact with the actual routing system
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        routeResolved: true,
        componentLoaded: true,
        navigationSuccessful: true,
        userSegmentMatched: scenario.userSegment
      });
    }, Math.random() * 1000 + 500); // Random delay to simulate real testing
  });
}

function validateResults(scenarioResults: any, validationCriteria: string[]): ValidationResult[] {
  return validationCriteria.map((criteria, index) => ({
    ruleId: `rule-${index}`,
    ruleName: criteria,
    passed: Math.random() > 0.1, // 90% pass rate for simulation
    actualValue: scenarioResults,
    expectedValue: criteria
  }));
}

async function getMemoryUsage(): Promise<number> {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
}

async function getNetworkRequestCount(): Promise<number> {
  return performance.getEntriesByType('resource').length;
}

function calculateOverallScore(results: ScenarioResult[]): number {
  if (results.length === 0) return 0;

  const passedCount = results.filter(r => r.status === 'passed').length;
  return Math.round((passedCount / results.length) * 100);
}

function generateRecommendations(results: ScenarioResult[]): string[] {
  const recommendations: string[] = [];

  const failedResults = results.filter(r => r.status === 'failed');

  if (failedResults.length > 0) {
    recommendations.push(`Address ${failedResults.length} failed test scenarios`);
  }

  const slowResults = results.filter(r => r.duration > 5000); // 5 seconds
  if (slowResults.length > 0) {
    recommendations.push(`Optimize performance for ${slowResults.length} slow scenarios`);
  }

  const highFailureRate = results.filter(r => r.status === 'failed').length / results.length > 0.1;
  if (highFailureRate) {
    recommendations.push('Consider postponing deployment due to high failure rate');
  }

  return recommendations;
}

function aggregatePerformanceMetrics(results: ScenarioResult[]): PerformanceMetric[] {
  const durations = results.map(r => r.duration);
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

  return [
    {
      name: 'Average Execution Time',
      value: Math.round(avgDuration),
      unit: 'ms',
      benchmark: 3000,
      status: avgDuration < 3000 ? 'good' : avgDuration < 5000 ? 'warning' : 'critical'
    },
    {
      name: 'Success Rate',
      value: Math.round((results.filter(r => r.status === 'passed').length / results.length) * 100),
      unit: '%',
      benchmark: 95,
      status: results.filter(r => r.status === 'passed').length / results.length >= 0.95 ? 'good' : 'warning'
    }
  ];
}

export default FeatureFlagTester;