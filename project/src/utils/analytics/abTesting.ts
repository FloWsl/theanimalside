// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\utils\analytics\abTesting.ts

/**
 * A/B Testing Infrastructure for Discovery Section Optimization
 * 
 * Provides feature flag management and testing capabilities for comparing
 * search-free vs enhanced header versions.
 */

// A/B test configuration
export interface ABTestConfig {
  testId: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // Percentage of users to include in test (0-100)
  isActive: boolean;
  startDate: string;
  endDate?: string;
  successMetrics: string[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage of test traffic (0-100)
  config: Record<string, any>;
}

export interface UserAssignment {
  userId: string;
  testId: string;
  variantId: string;
  assignmentTime: number;
  sessionId: string;
}

// Discovery section specific test configurations
const DISCOVERY_HEADER_TEST: ABTestConfig = {
  testId: 'discovery_header_search_free',
  name: 'Discovery Header Search-Free vs Enhanced',
  description: 'Compare search-free header against enhanced header with search functionality',
  variants: [
    {
      id: 'search_free',
      name: 'Search-Free Header',
      description: 'Header with only animal filter buttons, no search input',
      weight: 50,
      config: {
        enableSearchFreeHeader: true,
        enableEnhancedHeader: false,
        headerType: 'search-free'
      }
    },
    {
      id: 'enhanced',
      name: 'Enhanced Header',
      description: 'Header with search input and animal filters',
      weight: 50,
      config: {
        enableSearchFreeHeader: false,
        enableEnhancedHeader: true,
        headerType: 'enhanced'
      }
    }
  ],
  trafficAllocation: 100, // 100% of users in test initially
  isActive: true,
  startDate: new Date().toISOString(),
  successMetrics: [
    'animal_filter_click_rate',
    'discovery_section_time',
    'search_confusion_reduction',
    'opportunity_conversion_rate'
  ]
};

class ABTestingManager {
  private assignments: Map<string, UserAssignment> = new Map();
  private testConfigs: Map<string, ABTestConfig> = new Map();
  private userId: string;
  private sessionId: string;

  constructor() {
    this.userId = this.getUserId();
    this.sessionId = this.getSessionId();
    this.initializeTests();
    this.loadExistingAssignments();
  }

  /**
   * Initialize available tests
   */
  private initializeTests() {
    this.testConfigs.set(DISCOVERY_HEADER_TEST.testId, DISCOVERY_HEADER_TEST);
  }

  /**
   * Load existing user assignments from localStorage
   */
  private loadExistingAssignments() {
    try {
      const stored = localStorage.getItem('ab_test_assignments');
      if (stored) {
        const assignments: UserAssignment[] = JSON.parse(stored);
        assignments.forEach(assignment => {
          this.assignments.set(assignment.testId, assignment);
        });
      }
    } catch (error) {
      console.warn('Failed to load A/B test assignments:', error);
    }
  }

  /**
   * Save assignments to localStorage
   */
  private saveAssignments() {
    try {
      const assignments = Array.from(this.assignments.values());
      localStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
    } catch (error) {
      console.warn('Failed to save A/B test assignments:', error);
    }
  }

  /**
   * Get or create user ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  }

  /**
   * Get current session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ab_test_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ab_test_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get variant assignment for a test
   */
  getVariant(testId: string): ABTestVariant | null {
    const testConfig = this.testConfigs.get(testId);
    if (!testConfig || !testConfig.isActive) {
      return null;
    }

    // Check if user already has assignment
    let assignment = this.assignments.get(testId);
    if (!assignment) {
      // Create new assignment
      assignment = this.assignUserToVariant(testConfig);
      if (assignment) {
        this.assignments.set(testId, assignment);
        this.saveAssignments();
      }
    }

    if (!assignment) return null;

    // Find and return the variant
    return testConfig.variants.find(v => v.id === assignment!.variantId) || null;
  }

  /**
   * Assign user to a variant based on test configuration
   */
  private assignUserToVariant(testConfig: ABTestConfig): UserAssignment | null {
    // Check if user should be included in test
    const userHash = this.hashUserId(this.userId);
    if (userHash > testConfig.trafficAllocation) {
      return null; // User not in test
    }

    // Determine variant based on user hash and weights
    const variantHash = userHash % 100;
    let cumulativeWeight = 0;
    
    for (const variant of testConfig.variants) {
      cumulativeWeight += variant.weight;
      if (variantHash < cumulativeWeight) {
        return {
          userId: this.userId,
          testId: testConfig.testId,
          variantId: variant.id,
          assignmentTime: Date.now(),
          sessionId: this.sessionId
        };
      }
    }

    // Fallback to first variant
    return {
      userId: this.userId,
      testId: testConfig.testId,
      variantId: testConfig.variants[0].id,
      assignmentTime: Date.now(),
      sessionId: this.sessionId
    };
  }

  /**
   * Hash user ID to number for consistent assignment
   */
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  /**
   * Get discovery header configuration based on A/B test
   */
  getDiscoveryHeaderConfig(): {
    enableSearchFreeHeader: boolean;
    enableEnhancedHeader: boolean;
    headerType: 'search-free' | 'enhanced' | 'original';
    variantId: string | null;
  } {
    const variant = this.getVariant(DISCOVERY_HEADER_TEST.testId);
    
    if (variant) {
      return {
        enableSearchFreeHeader: variant.config.enableSearchFreeHeader,
        enableEnhancedHeader: variant.config.enableEnhancedHeader,
        headerType: variant.config.headerType,
        variantId: variant.id
      };
    }

    // Default fallback configuration
    return {
      enableSearchFreeHeader: false,
      enableEnhancedHeader: true,
      headerType: 'enhanced',
      variantId: null
    };
  }

  /**
   * Force user into specific variant (for testing/debugging)
   */
  forceVariant(testId: string, variantId: string) {
    const testConfig = this.testConfigs.get(testId);
    if (!testConfig) return;

    const variant = testConfig.variants.find(v => v.id === variantId);
    if (!variant) return;

    const assignment: UserAssignment = {
      userId: this.userId,
      testId,
      variantId,
      assignmentTime: Date.now(),
      sessionId: this.sessionId
    };

    this.assignments.set(testId, assignment);
    this.saveAssignments();
  }

  /**
   * Get all current assignments for debugging
   */
  getAssignments(): UserAssignment[] {
    return Array.from(this.assignments.values());
  }

  /**
   * Check if user is in a specific test
   */
  isInTest(testId: string): boolean {
    return this.assignments.has(testId);
  }

  /**
   * Get test configuration
   */
  getTestConfig(testId: string): ABTestConfig | undefined {
    return this.testConfigs.get(testId);
  }

  /**
   * Export test data for analysis
   */
  exportTestData(): {
    userId: string;
    sessionId: string;
    assignments: UserAssignment[];
    configs: ABTestConfig[];
  } {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      assignments: this.getAssignments(),
      configs: Array.from(this.testConfigs.values())
    };
  }
}

// Singleton instance
export const abTestingManager = new ABTestingManager();

// Convenience function for getting discovery header config
export const getDiscoveryHeaderConfig = () => abTestingManager.getDiscoveryHeaderConfig();

// Export types
export type { ABTestConfig, ABTestVariant, UserAssignment };
