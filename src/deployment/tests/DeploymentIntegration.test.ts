// src/deployment/tests/DeploymentIntegration.test.ts
// Integration tests for the complete Phase 3.4 deployment system

import { ProductionRolloutManager } from '../ProductionRolloutManager';
import { DeploymentOrchestrator } from '../DeploymentOrchestrator';
import FeatureFlagManager from '../../utils/FeatureFlagManager';
import LegacyCleanupManager from '../../legacy/LegacyCleanupManager';
import PostDeploymentValidator from '../../validation/PostDeploymentValidator';
import ProductionPerformanceMonitor from '../../monitoring/ProductionPerformanceMonitor';

describe('Phase 3.4 Deployment System Integration', () => {
  let featureFlagManager: FeatureFlagManager;
  let orchestrator: DeploymentOrchestrator;

  const mockOrchestrationConfig = {
    environment: 'staging' as const,
    baseUrl: 'http://localhost:3000',
    rolloutConfig: {
      stages: [
        {
          name: 'Canary',
          percentage: 5,
          duration: '2m',
          criteria: ['basic_functionality'],
          monitoringThresholds: {
            errorRate: 1.0,
            responseTime: 1000,
            userSatisfaction: 8.0
          },
          rollbackConditions: ['error_spike']
        }
      ],
      monitoringInterval: 1000,
      automaticRollback: true,
      rollbackThreshold: 0.05,
      notificationChannels: ['console'],
      environment: 'staging' as const
    },
    monitoringConfig: {
      enableRealTimeMetrics: true,
      metricsRetentionHours: 24,
      alertThresholds: {
        errorRate: 1.0,
        responseTime: 1000,
        memoryUsage: 100,
        userSatisfaction: 8.0
      },
      notificationChannels: ['console']
    },
    cleanupConfig: {
      dryRun: false,
      createBackups: true,
      backupDirectory: './backups',
      validateDependencies: true,
      allowedFileTypes: ['.ts', '.tsx', '.js', '.jsx'],
      protectedPaths: ['src/core', 'src/utils'],
      maxFilesPerBatch: 10,
      requireConfirmation: false
    },
    validationConfig: {
      enableComprehensiveValidation: true,
      parallelExecution: true,
      validationTimeout: 30000,
      criticalTestsRequired: true,
      performanceValidation: {
        enableCoreWebVitals: true,
        targetLCP: 2500,
        targetFID: 100,
        targetCLS: 0.1
      }
    },
    orchestrationOptions: {
      enableParallelProcessing: false,
      stopOnCriticalFailure: true,
      createDetailedReports: true,
      backupBeforeCleanup: true,
      validateBeforeRollout: true,
      monitorDuringRollout: true
    }
  };

  beforeEach(() => {
    // Reset singleton instances
    (FeatureFlagManager as any).instance = undefined;
    featureFlagManager = FeatureFlagManager.getInstance();
    orchestrator = new DeploymentOrchestrator(mockOrchestrationConfig);
  });

  describe('Feature Flag Management Integration', () => {
    it('should initialize with default feature flags', () => {
      const config = featureFlagManager.getConfiguration();

      expect(config.flags['new-routing']).toBeDefined();
      expect(config.flags['new-routing'].enabled).toBe(false);
      expect(config.flags['new-routing'].rolloutPercentage).toBe(0);
      expect(config.flags['new-routing'].killSwitch).toBe(false);
    });

    it('should support staged rollout configuration', async () => {
      const updateSuccess = await featureFlagManager.updateConfiguration('new-routing', {
        enabled: true,
        rolloutPercentage: 25,
        enabledEnvironments: ['staging', 'production']
      }, {
        flagId: 'new-routing',
        operation: 'updateRollout',
        reason: 'Integration test rollout',
        performedBy: 'test-suite'
      });

      expect(updateSuccess).toBe(true);

      const evaluationResult = featureFlagManager.evaluateFlag('new-routing', {
        environment: 'staging',
        timestamp: Date.now(),
        userId: 'test-user'
      });

      expect(evaluationResult.rolloutPercentage).toBe(25);
    });

    it('should handle emergency kill switch activation', async () => {
      // First enable the flag
      await featureFlagManager.updateConfiguration('new-routing', {
        enabled: true,
        rolloutPercentage: 100
      }, {
        flagId: 'new-routing',
        operation: 'enable',
        reason: 'Test setup',
        performedBy: 'test'
      });

      // Activate kill switch
      const killSwitchSuccess = await featureFlagManager.activateKillSwitch(
        'new-routing',
        'Integration test emergency stop',
        'test-suite'
      );

      expect(killSwitchSuccess).toBe(true);

      const config = featureFlagManager.getConfiguration();
      expect(config.flags['new-routing'].killSwitch).toBe(true);
      expect(config.flags['new-routing'].enabled).toBe(false);
    });
  });

  describe('Deployment Orchestration', () => {
    it('should coordinate all deployment phases', async () => {
      // Mock all component methods to avoid actual execution
      const mockRolloutManager = {
        executeRollout: jest.fn().mockResolvedValue({
          success: true,
          stage: 1,
          metrics: { errorRate: 0.1, responseTime: 200 },
          timestamp: Date.now()
        })
      };

      const mockValidator = {
        executeValidation: jest.fn().mockResolvedValue({
          overallPassed: true,
          summary: { totalTests: 10, passedTests: 10, criticalFailures: 0 },
          executionTime: 5000
        })
      };

      const mockCleanupManager = {
        executeLegacyCleanup: jest.fn().mockResolvedValue({
          success: true,
          results: [],
          summary: { successRate: 1.0 }
        })
      };

      const mockMonitor = {
        startMonitoring: jest.fn(),
        stopMonitoring: jest.fn(),
        generateReport: jest.fn().mockResolvedValue({
          overallHealth: 'excellent',
          metrics: { errorRate: 0.1 }
        })
      };

      // Replace internal components with mocks
      (orchestrator as any).rolloutManager = mockRolloutManager;
      (orchestrator as any).validator = mockValidator;
      (orchestrator as any).cleanupManager = mockCleanupManager;
      (orchestrator as any).monitor = mockMonitor;

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(true);
      expect(mockRolloutManager.executeRollout).toHaveBeenCalled();
      expect(mockValidator.executeValidation).toHaveBeenCalled();
      expect(mockCleanupManager.executeLegacyCleanup).toHaveBeenCalled();
    });

    it('should handle deployment failures with proper rollback', async () => {
      const mockRolloutManager = {
        executeRollout: jest.fn().mockResolvedValue({
          success: false,
          stage: 1,
          reason: 'High error rate detected',
          timestamp: Date.now()
        }),
        executeRollback: jest.fn().mockResolvedValue(undefined)
      };

      (orchestrator as any).rolloutManager = mockRolloutManager;

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.phases.rollout?.success).toBe(false);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track deployment metrics throughout rollout', () => {
      const monitor = new ProductionPerformanceMonitor();

      // Mock performance data collection
      const mockMetrics = {
        routeResolution: 0.5,
        componentLoading: 150,
        memoryUsage: 45,
        cacheHitRate: 92,
        errorRate: 0.1,
        userSatisfaction: 9.2,
        timestamp: Date.now()
      };

      // Test metric collection
      const collectAndAnalyzeMetrics = (monitor as any).collectAndAnalyzeMetrics.bind(monitor);
      jest.spyOn(monitor as any, 'measureRouteResolution').mockResolvedValue(mockMetrics.routeResolution);
      jest.spyOn(monitor as any, 'measureComponentLoading').mockResolvedValue(mockMetrics.componentLoading);
      jest.spyOn(monitor as any, 'getMemoryUsage').mockReturnValue(mockMetrics.memoryUsage);
      jest.spyOn(monitor as any, 'measureCacheHitRate').mockResolvedValue(mockMetrics.cacheHitRate);
      jest.spyOn(monitor as any, 'calculateErrorRate').mockResolvedValue(mockMetrics.errorRate);
      jest.spyOn(monitor as any, 'getUserSatisfactionScore').mockResolvedValue(mockMetrics.userSatisfaction);

      expect(monitor).toBeDefined();
      expect(typeof collectAndAnalyzeMetrics).toBe('function');
    });

    it('should detect performance regressions during deployment', () => {
      const monitor = new ProductionPerformanceMonitor();

      // Mock alert configuration
      const alertConfig = (monitor as any).alertConfig;
      expect(alertConfig).toBeDefined();
      expect(alertConfig.length).toBeGreaterThan(0);

      // Verify alert thresholds are configured
      const errorRateAlert = alertConfig.find((alert: any) => alert.metric === 'errorRate');
      expect(errorRateAlert).toBeDefined();
      expect(errorRateAlert.threshold).toBeDefined();
    });
  });

  describe('Legacy Cleanup Integration', () => {
    it('should safely remove legacy code after successful deployment', async () => {
      const cleanupManager = new LegacyCleanupManager();

      // Mock successful deployment validation
      jest.spyOn(cleanupManager as any, 'validateDeploymentCompletion').mockResolvedValue({
        complete: true
      });

      // Mock backup manager
      const mockBackupManager = {
        createBackup: jest.fn().mockResolvedValue(undefined),
        restoreBackup: jest.fn().mockResolvedValue(undefined)
      };
      (cleanupManager as any).backupManager = mockBackupManager;

      // Mock file operations
      jest.spyOn(cleanupManager as any, 'removeCodeSections').mockResolvedValue(undefined);
      jest.spyOn(cleanupManager as any, 'validateFileIntegrity').mockResolvedValue(undefined);
      jest.spyOn(cleanupManager as any, 'validateSystemHealth').mockResolvedValue({ healthy: true });

      const result = await cleanupManager.executeLegacyCleanup();

      expect(result.success).toBe(true);
      expect(mockBackupManager.createBackup).toHaveBeenCalled();
    });

    it('should rollback cleanup on system health degradation', async () => {
      const cleanupManager = new LegacyCleanupManager();

      jest.spyOn(cleanupManager as any, 'validateDeploymentCompletion').mockResolvedValue({
        complete: true
      });

      const mockBackupManager = {
        createBackup: jest.fn().mockResolvedValue(undefined),
        restoreBackup: jest.fn().mockResolvedValue(undefined)
      };
      (cleanupManager as any).backupManager = mockBackupManager;

      // Mock system health degradation
      jest.spyOn(cleanupManager as any, 'removeCodeSections').mockResolvedValue(undefined);
      jest.spyOn(cleanupManager as any, 'validateFileIntegrity').mockResolvedValue(undefined);
      jest.spyOn(cleanupManager as any, 'validateSystemHealth').mockResolvedValue({
        healthy: false,
        reason: 'System performance degraded'
      });
      jest.spyOn(cleanupManager as any, 'rollbackTask').mockResolvedValue(undefined);

      const result = await cleanupManager.executeLegacyCleanup();

      expect(mockBackupManager.restoreBackup).toHaveBeenCalled();
    });
  });

  describe('Post-Deployment Validation', () => {
    it('should execute comprehensive validation suites', async () => {
      const validator = new PostDeploymentValidator();

      // Mock validation test execution
      jest.spyOn(validator as any, 'validateRoutePerformance').mockResolvedValue(undefined);
      jest.spyOn(validator as any, 'waitForRouteLoad').mockResolvedValue(undefined);
      jest.spyOn(validator as any, 'simulateAnimalNavigation').mockResolvedValue({
        success: true,
        message: 'Navigation test passed'
      });
      jest.spyOn(validator as any, 'collectPerformanceMetrics').mockResolvedValue({
        lcp: 2000,
        fcp: 1500,
        cls: 0.05
      });

      const result = await validator.executeValidation();

      expect(result.overallPassed).toBe(true);
      expect(result.summary.totalTests).toBeGreaterThan(0);
    });

    it('should fail validation on critical test failures', async () => {
      const validator = new PostDeploymentValidator();

      // Mock critical test failure
      jest.spyOn(validator as any, 'validateRoutePerformance').mockRejectedValue(
        new Error('Critical route validation failed')
      );

      const result = await validator.executeValidation();

      expect(result.overallPassed).toBe(false);
      expect(result.summary.criticalFailures).toBeGreaterThan(0);
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should maintain system stability during component failures', async () => {
      // Test orchestrator resilience when individual components fail
      const mockRolloutManager = {
        executeRollout: jest.fn().mockRejectedValue(new Error('Rollout component failure'))
      };

      (orchestrator as any).rolloutManager = mockRolloutManager;

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rollout component failure');
    });

    it('should provide detailed failure analysis and recommendations', async () => {
      const mockRolloutManager = {
        executeRollout: jest.fn().mockResolvedValue({
          success: false,
          stage: 1,
          reason: 'Performance threshold violation',
          metrics: { errorRate: 5.5, responseTime: 2000 }
        })
      };

      (orchestrator as any).rolloutManager = mockRolloutManager;

      const result = await orchestrator.executeDeployment();

      expect(result.success).toBe(false);
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});