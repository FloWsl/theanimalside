// src/deployment/tests/ProductionRolloutManager.test.ts
// Integration tests for ProductionRolloutManager with FeatureFlagManager

import { ProductionRolloutManager, DeploymentConfig } from '../ProductionRolloutManager';
import FeatureFlagManager from '../../utils/FeatureFlagManager';

describe('ProductionRolloutManager', () => {
  let rolloutManager: ProductionRolloutManager;
  let featureFlagManager: FeatureFlagManager;

  const mockConfig: DeploymentConfig = {
    stages: [
      {
        name: 'Initial Rollout',
        percentage: 5,
        duration: '5m',
        criteria: ['error_rate_below_1_percent'],
        monitoringThresholds: {
          errorRate: 1.0,
          responseTime: 1000,
          userSatisfaction: 8.0
        },
        rollbackConditions: ['error_rate_above_5_percent']
      },
      {
        name: 'Expanded Rollout',
        percentage: 25,
        duration: '10m',
        criteria: ['stable_performance'],
        monitoringThresholds: {
          errorRate: 0.5,
          responseTime: 800,
          userSatisfaction: 8.5
        },
        rollbackConditions: ['performance_degradation']
      }
    ],
    monitoringInterval: 1000, // 1 second for testing
    automaticRollback: true,
    rollbackThreshold: 0.05,
    notificationChannels: ['console'],
    environment: 'staging'
  };

  beforeEach(() => {
    // Reset singleton instances for each test
    (FeatureFlagManager as any).instance = undefined;
    featureFlagManager = FeatureFlagManager.getInstance();
    rolloutManager = new ProductionRolloutManager(mockConfig);
  });

  describe('Initialization', () => {
    it('should initialize with valid configuration', () => {
      expect(rolloutManager).toBeDefined();
    });

    it('should integrate with FeatureFlagManager', () => {
      expect(featureFlagManager).toBeDefined();
      const config = featureFlagManager.getConfiguration();
      expect(config.flags['new-routing']).toBeDefined();
    });
  });

  describe('Feature Flag Integration', () => {
    it('should update feature flags during rollout stages', async () => {
      // Mock the rollout execution to avoid full deployment
      const updateFeatureFlagSpy = jest.spyOn(rolloutManager as any, 'updateFeatureFlag');

      // Mock other methods to prevent actual deployment
      jest.spyOn(rolloutManager as any, 'preStageValidation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'waitForConfigurationPropagation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'monitorStage').mockResolvedValue({ success: true });
      jest.spyOn(rolloutManager as any, 'postStageValidation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'postRolloutActions').mockResolvedValue(undefined);

      const result = await rolloutManager.executeRollout();

      expect(updateFeatureFlagSpy).toHaveBeenCalledWith(5);  // First stage 5%
      expect(updateFeatureFlagSpy).toHaveBeenCalledWith(25); // Second stage 25%
      expect(result.success).toBe(true);
    });

    it('should activate kill switch during emergency rollback', async () => {
      const activateKillSwitchSpy = jest.spyOn(featureFlagManager, 'activateKillSwitch');

      // Mock methods to trigger rollback scenario
      jest.spyOn(rolloutManager as any, 'preStageValidation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'updateFeatureFlag').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'waitForConfigurationPropagation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'monitorStage').mockResolvedValue({
        success: false,
        reason: 'High error rate detected'
      });
      jest.spyOn(rolloutManager as any, 'waitForRollbackPropagation').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'validateRollback').mockResolvedValue(undefined);
      jest.spyOn(rolloutManager as any, 'collectMetrics').mockResolvedValue({});
      jest.spyOn(rolloutManager as any, 'sendRollbackNotification').mockResolvedValue(undefined);

      const result = await rolloutManager.executeRollout();

      expect(activateKillSwitchSpy).toHaveBeenCalledWith(
        'new-routing',
        'Emergency rollback: Stage 1 monitoring failure: High error rate detected',
        'ProductionRolloutManager'
      );
      expect(result.success).toBe(false);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate deployment configuration on initialization', () => {
      const invalidConfig = {
        ...mockConfig,
        stages: [] // Invalid: no stages
      };

      expect(() => new ProductionRolloutManager(invalidConfig)).toThrow();
    });

    it('should require valid monitoring thresholds', () => {
      const invalidConfig = {
        ...mockConfig,
        stages: [{
          ...mockConfig.stages[0],
          monitoringThresholds: {} // Invalid: empty thresholds
        }]
      };

      expect(() => new ProductionRolloutManager(invalidConfig)).toThrow();
    });
  });

  describe('Rollback Validation', () => {
    it('should verify kill switch activation after rollback', async () => {
      // Activate kill switch
      await featureFlagManager.activateKillSwitch('new-routing', 'Test rollback', 'test');

      // Test the private validateRollback method
      const validateRollbackMethod = (rolloutManager as any).validateRollback.bind(rolloutManager);

      await expect(validateRollbackMethod()).resolves.not.toThrow();
    });

    it('should fail validation if kill switch not activated', async () => {
      // Ensure flag is enabled (not rolled back)
      await featureFlagManager.updateConfiguration('new-routing', {
        enabled: true,
        killSwitch: false,
        rolloutPercentage: 100
      }, {
        flagId: 'new-routing',
        operation: 'enable',
        reason: 'Test setup',
        performedBy: 'test'
      });

      const validateRollbackMethod = (rolloutManager as any).validateRollback.bind(rolloutManager);

      await expect(validateRollbackMethod()).rejects.toThrow('Rollback validation failed');
    });
  });

  describe('Monitoring Integration', () => {
    it('should collect metrics during monitoring stages', async () => {
      const collectMetricsSpy = jest.spyOn(rolloutManager as any, 'collectMetrics');
      collectMetricsSpy.mockResolvedValue({
        errorRate: 0.1,
        responseTime: 200,
        userSatisfaction: 9.0,
        featureAdoption: 15.0,
        memoryUsage: 50,
        routeValidationTime: 0.5
      });

      const monitorStageMethod = (rolloutManager as any).monitorStage.bind(rolloutManager);
      const result = await monitorStageMethod(mockConfig.stages[0]);

      expect(collectMetricsSpy).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should detect threshold violations during monitoring', async () => {
      jest.spyOn(rolloutManager as any, 'collectMetrics').mockResolvedValue({
        errorRate: 2.0, // Exceeds threshold of 1.0
        responseTime: 200,
        userSatisfaction: 9.0,
        featureAdoption: 15.0,
        memoryUsage: 50,
        routeValidationTime: 0.5
      });

      const monitorStageMethod = (rolloutManager as any).monitorStage.bind(rolloutManager);
      const result = await monitorStageMethod(mockConfig.stages[0]);

      expect(result.success).toBe(false);
      expect(result.reason).toContain('Threshold violations');
    });
  });

  describe('Error Handling', () => {
    it('should handle feature flag update failures gracefully', async () => {
      // Mock FeatureFlagManager to return failure
      jest.spyOn(featureFlagManager, 'updateConfiguration').mockResolvedValue(false);

      const updateFeatureFlagMethod = (rolloutManager as any).updateFeatureFlag.bind(rolloutManager);

      await expect(updateFeatureFlagMethod(50)).rejects.toThrow('Feature flag update failed');
    });

    it('should handle metrics collection errors', async () => {
      jest.spyOn(rolloutManager as any, 'getErrorRate').mockRejectedValue(new Error('Metrics collection failed'));

      const collectMetricsMethod = (rolloutManager as any).collectMetrics.bind(rolloutManager);
      const result = await collectMetricsMethod();

      expect(result).toEqual({}); // Should return empty object on error
    });
  });
});