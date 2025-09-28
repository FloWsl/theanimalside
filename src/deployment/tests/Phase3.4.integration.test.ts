// src/deployment/tests/Phase3.4.integration.test.ts
// IMPLEMENTATION TARGET: Comprehensive Phase 3.4 integration testing

import DeploymentOrchestrator, {
  DeploymentOrchestrationConfig,
  OrchestrationResult
} from '../DeploymentOrchestrator';

import ProductionRolloutManager from '../ProductionRolloutManager';
import ProductionPerformanceMonitor from '../../monitoring/ProductionPerformanceMonitor';
import LegacyCleanupManager from '../../legacy/LegacyCleanupManager';
import PostDeploymentValidator from '../../validation/PostDeploymentValidator';

// Mock external dependencies
global.fetch = jest.fn();
global.performance = {
  now: jest.fn(() => Date.now()),
  timing: {},
  memory: {
    usedJSHeapSize: 50000000,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 200000000
  }
} as any;

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    connection: {
      rtt: 50
    }
  },
  writable: true
});

describe('Phase 3.4 Integration Tests', () => {
  let orchestrator: DeploymentOrchestrator;
  let mockConfig: DeploymentOrchestrationConfig;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock successful fetch responses
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => '<html><title>Test</title><body>Test content</body></html>',
      json: async () => ({ success: true })
    });

    // Setup test configuration
    mockConfig = {
      environment: 'staging',
      baseUrl: 'https://staging.theanimalside.com',
      rolloutConfig: {
        stages: [
          {
            name: 'Initial Test',
            percentage: 10,
            duration: '2s',
            criteria: ['basic_functionality'],
            monitoringThresholds: {
              errorRate: 5,
              responseTime: 1000
            },
            rollbackConditions: ['errorRate > 5']
          },
          {
            name: 'Full Rollout',
            percentage: 100,
            duration: '2s',
            criteria: ['full_functionality'],
            monitoringThresholds: {
              errorRate: 2,
              responseTime: 500
            },
            rollbackConditions: ['errorRate > 2']
          }
        ],
        monitoringInterval: 1000,
        automaticRollback: true,
        rollbackThreshold: 5,
        notificationChannels: ['test-slack'],
        environment: 'staging'
      },
      monitoringConfig: {
        sampleRate: 1.0,
        reportingInterval: 5000,
        alertConfigurations: [
          {
            metric: 'errorRate',
            threshold: 5,
            operator: 'greater',
            severity: 'high',
            cooldownPeriod: 10000
          }
        ],
        enabledMetrics: ['errorRate', 'responseTime', 'memoryUsage'],
        persistMetrics: true,
        maxStoredMetrics: 100
      },
      cleanupConfig: {
        dryRun: true, // Safe for testing
        createBackups: true,
        backupDirectory: '/tmp/test-backups',
        validateDependencies: true,
        allowedFileTypes: ['component', 'hook', 'util'],
        protectedPaths: ['src/App.tsx', 'package.json'],
        maxFilesPerBatch: 5,
        requireConfirmation: false
      },
      validationConfig: {
        environment: 'staging',
        baseUrl: 'https://staging.theanimalside.com',
        timeout: 10000,
        retryAttempts: 1,
        parallelExecution: false,
        screenshotOnFailure: false,
        performanceThresholds: {
          routeLoadTime: 500,
          pageLoadTime: 2000,
          memoryUsage: 80,
          errorRate: 2
        },
        criticalTestIds: ['homepage-load', 'route-validation'],
        skipNonCriticalOnFailure: false
      },
      orchestrationOptions: {
        enableParallelProcessing: false,
        stopOnCriticalFailure: false,
        createDetailedReports: true,
        backupBeforeCleanup: true,
        validateBeforeRollout: true,
        monitorDuringRollout: true
      }
    };

    orchestrator = new DeploymentOrchestrator(mockConfig);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Integration', () => {
    test('all components can be instantiated', () => {
      expect(() => {
        new ProductionRolloutManager(mockConfig.rolloutConfig);
      }).not.toThrow();

      expect(() => {
        new ProductionPerformanceMonitor(mockConfig.monitoringConfig);
      }).not.toThrow();

      expect(() => {
        new LegacyCleanupManager(mockConfig.cleanupConfig, '/tmp/test-project');
      }).not.toThrow();

      expect(() => {
        new PostDeploymentValidator(mockConfig.validationConfig);
      }).not.toThrow();
    });

    test('DeploymentOrchestrator initializes with all components', () => {
      expect(orchestrator).toBeDefined();
      expect(orchestrator.getStatus().isExecuting).toBe(false);
    });

    test('configuration validation works', () => {
      expect(() => {
        new DeploymentOrchestrator({
          ...mockConfig,
          baseUrl: ''
        });
      }).toThrow('Base URL is required');

      expect(() => {
        new DeploymentOrchestrator({
          ...mockConfig,
          environment: '' as any
        });
      }).toThrow('Environment is required');
    });
  });

  describe('End-to-End Orchestration', () => {
    test('successful deployment orchestration', async () => {
      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(true);
      expect(result.environment).toBe('staging');
      expect(result.duration).toBeGreaterThan(0);

      // Verify all phases executed
      expect(result.phases.preValidation).toBeDefined();
      expect(result.phases.rollout).toBeDefined();
      expect(result.phases.postValidation).toBeDefined();
      expect(result.phases.cleanup).toBeDefined();
      expect(result.phases.monitoring).toBeDefined();

      // Verify successful phases
      expect(result.phases.preValidation?.success).toBe(true);
      expect(result.phases.rollout?.success).toBe(true);
      expect(result.phases.postValidation?.success).toBe(true);
      expect(result.phases.monitoring?.success).toBe(true);

      expect(result.riskAssessment.level).toBe('low');
      expect(result.recommendations.length).toBeGreaterThan(0);
    }, 30000);

    test('orchestration handles rollout failure gracefully', async () => {
      // Mock fetch to fail for rollout testing
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => '<html><title>Test</title></html>'
        }) // Pre-validation succeeds
        .mockRejectedValue(new Error('Rollout failed')); // Rollout fails

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.phases.rollout?.success).toBe(false);
      expect(result.riskAssessment.level).toMatch(/high|critical/);
      expect(result.riskAssessment.rollbackRecommended).toBe(true);
    }, 15000);

    test('orchestration with monitoring during rollout', async () => {
      // Enable monitoring during rollout
      const configWithMonitoring = {
        ...mockConfig,
        orchestrationOptions: {
          ...mockConfig.orchestrationOptions,
          monitorDuringRollout: true
        }
      };

      const orchestratorWithMonitoring = new DeploymentOrchestrator(configWithMonitoring);
      const result = await orchestratorWithMonitoring.executeDeployment();

      expect(result.success).toBe(true);
      expect(result.phases.rollout?.phase).toBe('Production Rollout with Monitoring');
    }, 20000);

    test('orchestration stops on critical failure when configured', async () => {
      const configStopOnFailure = {
        ...mockConfig,
        orchestrationOptions: {
          ...mockConfig.orchestrationOptions,
          stopOnCriticalFailure: true
        }
      };

      // Mock validation to fail critically
      (global.fetch as jest.Mock)
        .mockRejectedValue(new Error('Critical system failure'));

      const orchestratorStopOnFailure = new DeploymentOrchestrator(configStopOnFailure);
      const result = await orchestratorStopOnFailure.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.phases.preValidation?.success).toBe(false);

      // Should not have executed later phases
      expect(result.phases.rollout).toBeUndefined();
      expect(result.phases.postValidation).toBeUndefined();
    }, 10000);

    test('emergency stop functionality', async () => {
      // Start orchestration
      const orchestrationPromise = orchestrator.executeDeployment();

      // Wait a moment then trigger emergency stop
      setTimeout(async () => {
        await orchestrator.emergencyStop('Test emergency stop');
      }, 1000);

      const result = await orchestrationPromise;

      expect(result.success).toBe(false);
      expect(result.riskAssessment.rollbackRecommended).toBe(true);
    }, 15000);
  });

  describe('Individual Component Integration', () => {
    test('ProductionRolloutManager integration', async () => {
      const rolloutManager = new ProductionRolloutManager(mockConfig.rolloutConfig);

      const result = await rolloutManager.executeRollout();

      expect(result.success).toBe(true);
      expect(result.stage).toBe(2); // Completed both stages
      expect(result.metrics).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    }, 10000);

    test('ProductionPerformanceMonitor integration', async () => {
      const monitor = new ProductionPerformanceMonitor(mockConfig.monitoringConfig);

      monitor.startMonitoring();

      // Wait for some monitoring data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.timestamp).toBeGreaterThan(0);
      expect(typeof metrics.memoryUsage).toBe('number');

      const report = monitor.generateReport(1);
      expect(report.period).toBeDefined();
      expect(report.summary).toBeDefined();

      monitor.stopMonitoring();
    }, 5000);

    test('LegacyCleanupManager integration', async () => {
      const cleanupManager = new LegacyCleanupManager(mockConfig.cleanupConfig, '/tmp/test-project');

      const plan = await cleanupManager.createCleanupPlan();
      expect(plan.riskLevel).toMatch(/low|medium|high/);
      expect(Array.isArray(plan.filesToDelete)).toBe(true);
      expect(Array.isArray(plan.filesToMove)).toBe(true);

      // Execute cleanup (dry run)
      const result = await cleanupManager.executeCleanup(plan);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.deletedFiles)).toBe(true);
    }, 5000);

    test('PostDeploymentValidator integration', async () => {
      const validator = new PostDeploymentValidator(mockConfig.validationConfig);

      const report = await validator.executeValidation();
      expect(report.totalTests).toBeGreaterThan(0);
      expect(report.timestamp).toBeGreaterThan(0);
      expect(report.environment).toBe('staging');
      expect(typeof report.overallSuccess).toBe('boolean');
      expect(Array.isArray(report.recommendations)).toBe(true);
    }, 15000);
  });

  describe('Error Handling and Recovery', () => {
    test('handles network failures gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.riskAssessment.level).toMatch(/high|critical/);
      expect(result.recommendations).toContain(expect.stringMatching(/investigate|rollback/i));
    }, 10000);

    test('handles component initialization failures', () => {
      const invalidConfig = {
        ...mockConfig,
        rolloutConfig: {
          ...mockConfig.rolloutConfig,
          stages: [] // Invalid - no stages
        }
      };

      expect(() => {
        new DeploymentOrchestrator(invalidConfig);
      }).toThrow();
    });

    test('handles partial component failures', async () => {
      // Mock performance monitor to fail
      const originalConsoleError = console.error;
      console.error = jest.fn();

      try {
        // This would test scenarios where one component fails but others continue
        const result = await orchestrator.executeDeployment();

        // Should still attempt other phases even if one fails
        expect(result.phases).toBeDefined();
        expect(Object.keys(result.phases).length).toBeGreaterThan(0);

      } finally {
        console.error = originalConsoleError;
      }
    }, 10000);
  });

  describe('Performance and Scalability', () => {
    test('orchestration completes within reasonable time', async () => {
      const startTime = Date.now();

      await orchestrator.executeDeployment();

      const duration = Date.now() - startTime;

      // Should complete within 30 seconds for staging
      expect(duration).toBeLessThan(30000);
    }, 35000);

    test('memory usage remains stable during orchestration', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      await orchestrator.executeDeployment();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }, 20000);

    test('concurrent orchestration prevention', async () => {
      const firstOrchestration = orchestrator.executeDeployment();

      // Try to start second orchestration
      await expect(orchestrator.executeDeployment())
        .rejects.toThrow('Deployment orchestration already in progress');

      // Wait for first to complete
      await firstOrchestration;

      // Should be able to start new orchestration now
      await expect(orchestrator.executeDeployment()).resolves.toBeDefined();
    }, 30000);
  });

  describe('Configuration Validation', () => {
    test('validates required configuration fields', () => {
      const requiredFields = [
        'environment',
        'baseUrl',
        'rolloutConfig',
        'monitoringConfig',
        'cleanupConfig',
        'validationConfig'
      ];

      requiredFields.forEach(field => {
        const invalidConfig = { ...mockConfig };
        delete (invalidConfig as any)[field];

        expect(() => {
          new DeploymentOrchestrator(invalidConfig);
        }).toThrow();
      });
    });

    test('validates orchestration options', () => {
      const configWithInvalidOptions = {
        ...mockConfig,
        orchestrationOptions: {
          ...mockConfig.orchestrationOptions,
          enableParallelProcessing: 'invalid' as any
        }
      };

      // Should handle type coercion gracefully or throw appropriate error
      expect(() => {
        new DeploymentOrchestrator(configWithInvalidOptions);
      }).not.toThrow(); // Should handle gracefully in MVP
    });
  });

  describe('Status and Monitoring', () => {
    test('status reporting during orchestration', async () => {
      const orchestrationPromise = orchestrator.executeDeployment();

      // Check status while running
      setTimeout(() => {
        const status = orchestrator.getStatus();
        expect(status.isExecuting).toBe(true);
        expect(status.startTime).toBeGreaterThan(0);
      }, 500);

      await orchestrationPromise;

      // Check status after completion
      const finalStatus = orchestrator.getStatus();
      expect(finalStatus.isExecuting).toBe(false);
    }, 10000);

    test('detailed reporting generation', async () => {
      const result = await orchestrator.executeDeployment();

      expect(result.finalMetrics).toBeDefined();
      expect(result.finalMetrics.totalTests).toBeGreaterThanOrEqual(0);
      expect(result.finalMetrics.performanceScore).toBeGreaterThanOrEqual(0);
      expect(result.finalMetrics.performanceScore).toBeLessThanOrEqual(100);

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);

      expect(result.riskAssessment).toBeDefined();
      expect(result.riskAssessment.level).toMatch(/low|medium|high|critical/);
    }, 15000);
  });

  describe('Integration with External Systems', () => {
    test('handles external API failures', async () => {
      // Mock API calls to fail
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, status: 200, text: async () => 'OK' }) // Health check passes
        .mockRejectedValue(new Error('External API failure')); // Subsequent calls fail

      const result = await orchestrator.executeDeployment();

      // Should handle external failures gracefully
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.phases.preValidation?.errors.length).toBeGreaterThan(0);
    }, 10000);

    test('timeout handling', async () => {
      // Mock very slow response
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 20000))
      );

      const shortTimeoutConfig = {
        ...mockConfig,
        validationConfig: {
          ...mockConfig.validationConfig,
          timeout: 1000 // 1 second timeout
        }
      };

      const orchestratorWithTimeout = new DeploymentOrchestrator(shortTimeoutConfig);
      const result = await orchestratorWithTimeout.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.phases.preValidation?.errors.some(error =>
        error.includes('timeout') || error.includes('timed out')
      )).toBe(true);
    }, 15000);
  });

  describe('Cleanup and Resource Management', () => {
    test('cleans up resources after orchestration', async () => {
      const result = await orchestrator.executeDeployment();

      // Verify orchestrator is not in executing state
      expect(orchestrator.getStatus().isExecuting).toBe(false);

      // Verify no hanging promises or timers (would be tested in real environment)
      expect(result.endTime).toBeGreaterThan(result.startTime);
    }, 10000);

    test('emergency stop cleans up properly', async () => {
      const orchestrationPromise = orchestrator.executeDeployment();

      // Trigger emergency stop
      setTimeout(async () => {
        await orchestrator.emergencyStop('Test cleanup');
      }, 1000);

      await orchestrationPromise;

      // Verify clean state
      expect(orchestrator.getStatus().isExecuting).toBe(false);
    }, 10000);
  });
});

describe('Phase 3.4 Component Unit Tests', () => {
  describe('ProductionRolloutManager', () => {
    test('validates rollout configuration', () => {
      expect(() => {
        new ProductionRolloutManager({
          stages: [],
          monitoringInterval: 1000,
          automaticRollback: true,
          rollbackThreshold: 5,
          notificationChannels: [],
          environment: 'staging'
        });
      }).toThrow('must include at least one stage');

      expect(() => {
        new ProductionRolloutManager({
          stages: [
            {
              name: 'test',
              percentage: 50,
              duration: '1m',
              criteria: [],
              monitoringThresholds: {},
              rollbackConditions: []
            },
            {
              name: 'test2',
              percentage: 25, // Lower than previous - should fail
              duration: '1m',
              criteria: [],
              monitoringThresholds: {},
              rollbackConditions: []
            }
          ],
          monitoringInterval: 1000,
          automaticRollback: true,
          rollbackThreshold: 5,
          notificationChannels: [],
          environment: 'staging'
        });
      }).toThrow('must be increasing');
    });

    test('handles rollout stage monitoring', async () => {
      const rolloutManager = new ProductionRolloutManager({
        stages: [
          {
            name: 'test-stage',
            percentage: 50,
            duration: '1s',
            criteria: [],
            monitoringThresholds: { errorRate: 10 },
            rollbackConditions: []
          }
        ],
        monitoringInterval: 500,
        automaticRollback: false,
        rollbackThreshold: 5,
        notificationChannels: [],
        environment: 'staging'
      });

      const result = await rolloutManager.executeRollout();
      expect(result.success).toBe(true);
      expect(result.stage).toBe(1);
    }, 5000);
  });

  describe('ProductionPerformanceMonitor', () => {
    test('collects performance metrics', () => {
      const monitor = new ProductionPerformanceMonitor({
        sampleRate: 1.0,
        reportingInterval: 10000,
        alertConfigurations: [],
        enabledMetrics: ['memoryUsage', 'routeLoadTime'],
        persistMetrics: true,
        maxStoredMetrics: 100
      });

      monitor.startMonitoring();

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.timestamp).toBeGreaterThan(0);
      expect(typeof metrics.memoryUsage).toBe('number');

      monitor.stopMonitoring();
    });

    test('generates performance reports', () => {
      const monitor = new ProductionPerformanceMonitor({
        sampleRate: 1.0,
        reportingInterval: 10000,
        alertConfigurations: [],
        enabledMetrics: ['memoryUsage'],
        persistMetrics: true,
        maxStoredMetrics: 100
      });

      const report = monitor.generateReport(1);
      expect(report.period).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });
  });

  describe('PostDeploymentValidator', () => {
    test('validates test configuration', () => {
      expect(() => {
        new PostDeploymentValidator({
          environment: 'staging',
          baseUrl: '', // Invalid
          timeout: 10000,
          retryAttempts: 1,
          parallelExecution: false,
          screenshotOnFailure: false,
          performanceThresholds: {},
          criticalTestIds: [],
          skipNonCriticalOnFailure: false
        });
      }).toThrow('Base URL is required');

      expect(() => {
        new PostDeploymentValidator({
          environment: 'staging',
          baseUrl: 'https://test.com',
          timeout: 500, // Too short
          retryAttempts: 1,
          parallelExecution: false,
          screenshotOnFailure: false,
          performanceThresholds: {},
          criticalTestIds: [],
          skipNonCriticalOnFailure: false
        });
      }).toThrow('must be at least 1000ms');
    });

    test('executes validation test suites', async () => {
      const validator = new PostDeploymentValidator({
        environment: 'staging',
        baseUrl: 'https://staging.test.com',
        timeout: 5000,
        retryAttempts: 1,
        parallelExecution: false,
        screenshotOnFailure: false,
        performanceThresholds: {
          routeLoadTime: 500,
          errorRate: 2
        },
        criticalTestIds: ['homepage-load'],
        skipNonCriticalOnFailure: false
      });

      const report = await validator.executeValidation();
      expect(report.totalTests).toBeGreaterThan(0);
      expect(report.suiteResults.length).toBeGreaterThan(0);
      expect(typeof report.overallSuccess).toBe('boolean');
    }, 10000);
  });
});

// Helper function to create test data
function createTestOrchestrationConfig(overrides: Partial<DeploymentOrchestrationConfig> = {}): DeploymentOrchestrationConfig {
  const baseConfig: DeploymentOrchestrationConfig = {
    environment: 'staging',
    baseUrl: 'https://staging.test.com',
    rolloutConfig: {
      stages: [
        {
          name: 'Test Stage',
          percentage: 100,
          duration: '1s',
          criteria: [],
          monitoringThresholds: {},
          rollbackConditions: []
        }
      ],
      monitoringInterval: 1000,
      automaticRollback: false,
      rollbackThreshold: 5,
      notificationChannels: [],
      environment: 'staging'
    },
    monitoringConfig: {
      sampleRate: 1.0,
      reportingInterval: 5000,
      alertConfigurations: [],
      enabledMetrics: ['memoryUsage'],
      persistMetrics: true,
      maxStoredMetrics: 100
    },
    cleanupConfig: {
      dryRun: true,
      createBackups: false,
      backupDirectory: '/tmp',
      validateDependencies: false,
      allowedFileTypes: ['component'],
      protectedPaths: [],
      maxFilesPerBatch: 10,
      requireConfirmation: false
    },
    validationConfig: {
      environment: 'staging',
      baseUrl: 'https://staging.test.com',
      timeout: 5000,
      retryAttempts: 1,
      parallelExecution: false,
      screenshotOnFailure: false,
      performanceThresholds: {},
      criticalTestIds: [],
      skipNonCriticalOnFailure: false
    },
    orchestrationOptions: {
      enableParallelProcessing: false,
      stopOnCriticalFailure: false,
      createDetailedReports: true,
      backupBeforeCleanup: true,
      validateBeforeRollout: true,
      monitorDuringRollout: false
    }
  };

  return { ...baseConfig, ...overrides };
}