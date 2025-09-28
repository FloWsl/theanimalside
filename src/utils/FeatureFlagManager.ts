// src/utils/FeatureFlagManager.ts
// IMPLEMENTATION TARGET: Centralized feature flag management with lifecycle and dependency tracking

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  enabledUsers: string[];
  enabledEnvironments: ('development' | 'staging' | 'production')[];
  dependencies: string[]; // Flag IDs that must be enabled first
  killSwitch: boolean; // Emergency disable flag
  metadata: {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    lastModifiedBy: string;
    version: number;
  };
  analytics: {
    totalExposures: number;
    uniqueUsers: number;
    conversionRate?: number;
    errorRate: number;
    performanceImpact?: number;
  };
  lifecycle: {
    stage: 'development' | 'testing' | 'rollout' | 'full-release' | 'deprecated';
    scheduledCleanup?: number; // Timestamp for automated cleanup
    rolloutStartDate?: number;
    fullReleaseDate?: number;
  };
}

export interface FeatureFlagConfiguration {
  flags: Record<string, FeatureFlag>;
  globalConfig: {
    defaultRolloutPercentage: number;
    maxRolloutDurationMs: number;
    analyticsEnabled: boolean;
    automaticCleanup: boolean;
    cleanupGracePeriodMs: number;
  };
}

export interface FlagEvaluationContext {
  userId?: string;
  sessionId?: string;
  environment: string;
  timestamp: number;
  userAgent?: string;
  customAttributes?: Record<string, any>;
}

export interface FlagEvaluationResult {
  flagId: string;
  enabled: boolean;
  reason: string;
  rolloutPercentage: number;
  variant?: string;
  experimentId?: string;
}

export interface FlagUpdateOperation {
  flagId: string;
  operation: 'enable' | 'disable' | 'updateRollout' | 'killSwitch' | 'updateMetadata';
  value?: any;
  reason: string;
  performedBy: string;
}

export interface DependencyValidationResult {
  valid: boolean;
  violations: string[];
  warnings: string[];
  dependencies: Array<{
    flagId: string;
    required: boolean;
    current: boolean;
  }>;
}

export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private configuration: FeatureFlagConfiguration;
  private evaluationHistory: Map<string, FlagEvaluationResult[]> = new Map();
  private updateHistory: FlagUpdateOperation[] = [];

  private constructor() {
    this.configuration = this.initializeDefaultConfiguration();
    this.startPeriodicMaintenance();
  }

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  /**
   * Initialize default configuration with production-ready defaults
   * PATTERN: Fail-safe configuration that prioritizes stability
   */
  private initializeDefaultConfiguration(): FeatureFlagConfiguration {
    return {
      flags: {
        // Core routing system flag (for production deployments)
        newRouting: {
          id: 'new-routing',
          name: 'New Routing System',
          description: 'Enable the new dynamic routing system',
          enabled: false,
          rolloutPercentage: 0,
          enabledUsers: [],
          enabledEnvironments: ['development', 'staging'],
          dependencies: [],
          killSwitch: false,
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            createdBy: 'system',
            lastModifiedBy: 'system',
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
        }
      },
      globalConfig: {
        defaultRolloutPercentage: 5, // Conservative 5% default
        maxRolloutDurationMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        analyticsEnabled: true,
        automaticCleanup: true,
        cleanupGracePeriodMs: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    };
  }

  /**
   * Evaluate a feature flag for a given context with comprehensive validation
   * PATTERN: Defense in depth with fallbacks and dependency checking
   */
  public evaluateFlag(flagId: string, context: FlagEvaluationContext): FlagEvaluationResult {
    const flag = this.configuration.flags[flagId];

    // CRITICAL: Return safe default if flag doesn't exist
    if (!flag) {
      const result: FlagEvaluationResult = {
        flagId,
        enabled: false,
        reason: 'Flag not found',
        rolloutPercentage: 0
      };
      this.recordEvaluation(flagId, result, context);
      return result;
    }

    // CRITICAL: Check kill switch first
    if (flag.killSwitch) {
      const result: FlagEvaluationResult = {
        flagId,
        enabled: false,
        reason: 'Kill switch activated',
        rolloutPercentage: 0
      };
      this.recordEvaluation(flagId, result, context);
      return result;
    }

    // VALIDATION: Check environment enablement
    if (!flag.enabledEnvironments.includes(context.environment as any)) {
      const result: FlagEvaluationResult = {
        flagId,
        enabled: false,
        reason: `Environment ${context.environment} not enabled`,
        rolloutPercentage: flag.rolloutPercentage
      };
      this.recordEvaluation(flagId, result, context);
      return result;
    }

    // VALIDATION: Check dependencies
    const dependencyCheck = this.validateDependencies(flagId);
    if (!dependencyCheck.valid) {
      const result: FlagEvaluationResult = {
        flagId,
        enabled: false,
        reason: `Dependency violation: ${dependencyCheck.violations.join(', ')}`,
        rolloutPercentage: flag.rolloutPercentage
      };
      this.recordEvaluation(flagId, result, context);
      return result;
    }

    // PATTERN: User-specific enablement (override percentage)
    if (context.userId && flag.enabledUsers.includes(context.userId)) {
      const result: FlagEvaluationResult = {
        flagId,
        enabled: flag.enabled,
        reason: 'User explicitly enabled',
        rolloutPercentage: 100
      };
      this.recordEvaluation(flagId, result, context);
      return result;
    }

    // PATTERN: Percentage-based rollout with deterministic hash
    const enabled = flag.enabled && this.isUserInRollout(context, flag.rolloutPercentage);
    const result: FlagEvaluationResult = {
      flagId,
      enabled,
      reason: enabled
        ? `Enabled via rollout (${flag.rolloutPercentage}%)`
        : `Not in rollout group (${flag.rolloutPercentage}%)`,
      rolloutPercentage: flag.rolloutPercentage
    };

    this.recordEvaluation(flagId, result, context);
    return result;
  }

  /**
   * Update feature flag configuration with comprehensive validation
   * PATTERN: Atomic updates with rollback capability
   */
  public async updateConfiguration(flagId: string, updates: Partial<FeatureFlag>, operation: FlagUpdateOperation): Promise<boolean> {
    console.log(`🏗️ Updating flag ${flagId}:`, operation.operation);

    try {
      const currentFlag = this.configuration.flags[flagId];
      if (!currentFlag) {
        throw new Error(`Flag ${flagId} not found`);
      }

      // CRITICAL: Validate dependencies before applying changes
      if (updates.enabled !== undefined || updates.rolloutPercentage !== undefined) {
        const tempFlag = { ...currentFlag, ...updates };
        this.configuration.flags[flagId] = tempFlag;

        const dependencyCheck = this.validateDependencies(flagId);
        if (!dependencyCheck.valid) {
          // ROLLBACK: Restore original flag
          this.configuration.flags[flagId] = currentFlag;
          throw new Error(`Dependency validation failed: ${dependencyCheck.violations.join(', ')}`);
        }
      }

      // PATTERN: Atomic update with version tracking
      const updatedFlag: FeatureFlag = {
        ...currentFlag,
        ...updates,
        metadata: {
          ...currentFlag.metadata,
          ...updates.metadata,
          updatedAt: Date.now(),
          lastModifiedBy: operation.performedBy,
          version: currentFlag.metadata.version + 1
        }
      };

      this.configuration.flags[flagId] = updatedFlag;

      // VALIDATION: Record the operation for audit trail
      this.updateHistory.push({
        ...operation,
        value: updates
      });

      // PATTERN: Trim history to prevent memory leaks
      if (this.updateHistory.length > 1000) {
        this.updateHistory.splice(0, this.updateHistory.length - 1000);
      }

      console.log(`✅ Flag ${flagId} updated successfully`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to update flag ${flagId}:`, error.message);
      return false;
    }
  }

  /**
   * Validate flag dependencies with comprehensive checking
   * PATTERN: Topological dependency validation
   */
  private validateDependencies(flagId: string): DependencyValidationResult {
    const flag = this.configuration.flags[flagId];
    if (!flag) {
      return {
        valid: false,
        violations: ['Flag not found'],
        warnings: [],
        dependencies: []
      };
    }

    const violations: string[] = [];
    const warnings: string[] = [];
    const dependencies: Array<{flagId: string; required: boolean; current: boolean}> = [];

    // Check each dependency
    for (const depId of flag.dependencies) {
      const depFlag = this.configuration.flags[depId];

      if (!depFlag) {
        violations.push(`Dependency flag ${depId} not found`);
        dependencies.push({ flagId: depId, required: true, current: false });
        continue;
      }

      const isDepEnabled = depFlag.enabled && depFlag.rolloutPercentage > 0;
      dependencies.push({ flagId: depId, required: true, current: isDepEnabled });

      if (!isDepEnabled) {
        violations.push(`Dependency ${depId} is not enabled`);
      }

      // PATTERN: Check for circular dependencies
      if (depFlag.dependencies.includes(flagId)) {
        violations.push(`Circular dependency detected between ${flagId} and ${depId}`);
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      warnings,
      dependencies
    };
  }

  /**
   * Deterministic user rollout calculation
   * PATTERN: Consistent hash-based distribution
   */
  private isUserInRollout(context: FlagEvaluationContext, percentage: number): boolean {
    if (percentage === 0) return false;
    if (percentage === 100) return true;

    // PATTERN: Use stable identifier for consistent results
    const identifier = context.userId || context.sessionId || 'anonymous';
    const hash = this.hashString(identifier);
    return (hash % 100) < percentage;
  }

  /**
   * Simple hash function for consistent distribution
   * PATTERN: Deterministic hash for stable rollout behavior
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Record flag evaluation for analytics and debugging
   * PATTERN: Efficient history tracking with memory management
   */
  private recordEvaluation(flagId: string, result: FlagEvaluationResult, context: FlagEvaluationContext): void {
    if (!this.configuration.globalConfig.analyticsEnabled) return;

    const history = this.evaluationHistory.get(flagId) || [];
    history.push({
      ...result,
      timestamp: context.timestamp
    });

    // PATTERN: Limit history size to prevent memory issues
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }

    this.evaluationHistory.set(flagId, history);

    // Update analytics on the flag
    const flag = this.configuration.flags[flagId];
    if (flag) {
      flag.analytics.totalExposures++;
      if (context.userId) {
        // Simple unique user counting (would be more sophisticated in production)
        flag.analytics.uniqueUsers = Math.max(flag.analytics.uniqueUsers, 1);
      }
    }
  }

  /**
   * Get current feature flag configuration
   * PATTERN: Immutable configuration access
   */
  public getConfiguration(): FeatureFlagConfiguration {
    return JSON.parse(JSON.stringify(this.configuration));
  }

  /**
   * Get flag evaluation history for analytics
   * PATTERN: Read-only analytics access
   */
  public getFlagAnalytics(flagId: string): FlagEvaluationResult[] {
    return [...(this.evaluationHistory.get(flagId) || [])];
  }

  /**
   * Start periodic maintenance for automated cleanup and optimization
   * PATTERN: Background maintenance with configurable intervals
   */
  private startPeriodicMaintenance(): void {
    // Run maintenance every hour
    setInterval(() => {
      this.performMaintenance();
    }, 60 * 60 * 1000);
  }

  /**
   * Perform automated maintenance tasks
   * PATTERN: Automated lifecycle management
   */
  private performMaintenance(): void {
    if (!this.configuration.globalConfig.automaticCleanup) return;

    const now = Date.now();
    const cleanupGracePeriod = this.configuration.globalConfig.cleanupGracePeriodMs;

    for (const [flagId, flag] of Object.entries(this.configuration.flags)) {
      // Check for flags scheduled for cleanup
      if (flag.lifecycle.scheduledCleanup && flag.lifecycle.scheduledCleanup < now) {
        console.log(`🧹 Auto-cleaning deprecated flag: ${flagId}`);
        // In production, this would archive rather than delete
        delete this.configuration.flags[flagId];
        this.evaluationHistory.delete(flagId);
      }

      // Auto-schedule cleanup for flags at 100% rollout for extended period
      if (flag.lifecycle.stage === 'full-release' &&
          flag.rolloutPercentage === 100 &&
          !flag.lifecycle.scheduledCleanup &&
          flag.lifecycle.fullReleaseDate &&
          (now - flag.lifecycle.fullReleaseDate) > cleanupGracePeriod) {

        flag.lifecycle.scheduledCleanup = now + (7 * 24 * 60 * 60 * 1000); // 7 days notice
        console.log(`📋 Scheduled cleanup for fully-released flag: ${flagId}`);
      }
    }
  }

  /**
   * Emergency kill switch activation
   * PATTERN: Immediate safety mechanism
   */
  public activateKillSwitch(flagId: string, reason: string, performedBy: string): boolean {
    console.warn(`🚨 KILL SWITCH ACTIVATED for ${flagId}: ${reason}`);

    return this.updateConfiguration(flagId, {
      killSwitch: true,
      enabled: false,
      rolloutPercentage: 0
    }, {
      flagId,
      operation: 'killSwitch',
      value: true,
      reason,
      performedBy
    });
  }

  /**
   * Safe flag cleanup with validation
   * PATTERN: Multi-step cleanup with confirmation
   */
  public async cleanupFlag(flagId: string, reason: string, performedBy: string): Promise<boolean> {
    const flag = this.configuration.flags[flagId];
    if (!flag) {
      console.error(`Cannot cleanup ${flagId}: flag not found`);
      return false;
    }

    // VALIDATION: Ensure flag is safe to cleanup
    if (flag.lifecycle.stage !== 'deprecated' && flag.rolloutPercentage > 0) {
      console.error(`Cannot cleanup ${flagId}: flag is still active`);
      return false;
    }

    console.log(`🧹 Cleaning up flag: ${flagId} - ${reason}`);

    // Archive the flag data before deletion
    const archiveData = {
      flag: JSON.parse(JSON.stringify(flag)),
      evaluationHistory: this.getFlagAnalytics(flagId),
      cleanupTimestamp: Date.now(),
      cleanupReason: reason,
      performedBy
    };

    // In production, save to persistent storage
    console.log('📦 Archived flag data:', archiveData);

    // Remove from active configuration
    delete this.configuration.flags[flagId];
    this.evaluationHistory.delete(flagId);

    return true;
  }
}

export default FeatureFlagManager;