// src/deployment/tests/FeatureFlagManager.test.ts
// Comprehensive tests for FeatureFlagManager

import FeatureFlagManager from '../../utils/FeatureFlagManager';

describe('FeatureFlagManager', () => {
  let featureFlagManager: FeatureFlagManager;

  beforeEach(() => {
    // Reset singleton instance for each test
    (FeatureFlagManager as any).instance = undefined;
    featureFlagManager = FeatureFlagManager.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = FeatureFlagManager.getInstance();
      const instance2 = FeatureFlagManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Flag Evaluation', () => {
    it('should return false for non-existent flags', () => {
      const result = featureFlagManager.evaluateFlag('non-existent-flag', {
        environment: 'production',
        timestamp: Date.now()
      });

      expect(result.enabled).toBe(false);
      expect(result.reason).toBe('Flag not found');
    });

    it('should respect kill switch activation', async () => {
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
      await featureFlagManager.activateKillSwitch('new-routing', 'Emergency test', 'test');

      const result = featureFlagManager.evaluateFlag('new-routing', {
        environment: 'production',
        timestamp: Date.now()
      });

      expect(result.enabled).toBe(false);
      expect(result.reason).toBe('Kill switch activated');
    });

    it('should respect environment restrictions', () => {
      const result = featureFlagManager.evaluateFlag('new-routing', {
        environment: 'production',
        timestamp: Date.now()
      });

      expect(result.enabled).toBe(false);
      expect(result.reason).toContain('Environment production not enabled');
    });

    it('should handle percentage-based rollouts consistently', () => {
      const context = {
        userId: 'test-user-123',
        environment: 'development',
        timestamp: Date.now()
      };

      // Test multiple evaluations with same user - should be consistent
      const result1 = featureFlagManager.evaluateFlag('new-routing', context);
      const result2 = featureFlagManager.evaluateFlag('new-routing', context);

      expect(result1.enabled).toBe(result2.enabled);
    });
  });

  describe('Flag Configuration Updates', () => {
    it('should successfully update flag configuration', async () => {
      const success = await featureFlagManager.updateConfiguration('new-routing', {
        enabled: true,
        rolloutPercentage: 50
      }, {
        flagId: 'new-routing',
        operation: 'updateRollout',
        reason: 'Test update',
        performedBy: 'test-suite'
      });

      expect(success).toBe(true);

      const config = featureFlagManager.getConfiguration();
      expect(config.flags['new-routing'].enabled).toBe(true);
      expect(config.flags['new-routing'].rolloutPercentage).toBe(50);
    });

    it('should maintain version tracking on updates', async () => {
      const initialConfig = featureFlagManager.getConfiguration();
      const initialVersion = initialConfig.flags['new-routing'].metadata.version;

      await featureFlagManager.updateConfiguration('new-routing', {
        rolloutPercentage: 25
      }, {
        flagId: 'new-routing',
        operation: 'updateRollout',
        reason: 'Version test',
        performedBy: 'test'
      });

      const updatedConfig = featureFlagManager.getConfiguration();
      expect(updatedConfig.flags['new-routing'].metadata.version).toBe(initialVersion + 1);
    });
  });

  describe('Dependency Validation', () => {
    it('should prevent enabling flags with missing dependencies', async () => {
      // Create a flag with a dependency that doesn't exist
      const config = featureFlagManager.getConfiguration();
      config.flags['dependent-flag'] = {
        id: 'dependent-flag',
        name: 'Dependent Flag',
        description: 'A flag that depends on another',
        enabled: false,
        rolloutPercentage: 0,
        enabledUsers: [],
        enabledEnvironments: ['development'],
        dependencies: ['non-existent-dependency'],
        killSwitch: false,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          createdBy: 'test',
          lastModifiedBy: 'test',
          version: 1
        },
        analytics: {
          totalExposures: 0,
          uniqueUsers: 0,
          errorRate: 0
        },
        lifecycle: {
          stage: 'development'
        }
      };

      const success = await featureFlagManager.updateConfiguration('dependent-flag', {
        enabled: true,
        rolloutPercentage: 100
      }, {
        flagId: 'dependent-flag',
        operation: 'enable',
        reason: 'Dependency test',
        performedBy: 'test'
      });

      expect(success).toBe(false);
    });
  });

  describe('Analytics and History', () => {
    it('should track flag evaluations when analytics enabled', () => {
      const context = {
        userId: 'analytics-test-user',
        environment: 'development',
        timestamp: Date.now()
      };

      featureFlagManager.evaluateFlag('new-routing', context);

      const analytics = featureFlagManager.getFlagAnalytics('new-routing');
      expect(analytics.length).toBeGreaterThan(0);
    });

    it('should update analytics counters', () => {
      const context = {
        userId: 'counter-test-user',
        environment: 'development',
        timestamp: Date.now()
      };

      const initialConfig = featureFlagManager.getConfiguration();
      const initialExposures = initialConfig.flags['new-routing'].analytics.totalExposures;

      featureFlagManager.evaluateFlag('new-routing', context);

      const updatedConfig = featureFlagManager.getConfiguration();
      expect(updatedConfig.flags['new-routing'].analytics.totalExposures).toBe(initialExposures + 1);
    });
  });

  describe('Configuration Management', () => {
    it('should return immutable configuration copies', () => {
      const config1 = featureFlagManager.getConfiguration();
      const config2 = featureFlagManager.getConfiguration();

      expect(config1).not.toBe(config2); // Different object instances
      expect(config1).toEqual(config2); // Same content
    });

    it('should prevent external configuration mutations', () => {
      const config = featureFlagManager.getConfiguration();
      const originalRollout = config.flags['new-routing'].rolloutPercentage;

      // Attempt to mutate the returned configuration
      config.flags['new-routing'].rolloutPercentage = 999;

      // Verify internal state unchanged
      const freshConfig = featureFlagManager.getConfiguration();
      expect(freshConfig.flags['new-routing'].rolloutPercentage).toBe(originalRollout);
    });
  });
});