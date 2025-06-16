// 🚀 Performance-Optimized Organization Service
// Wrapper with monitoring and caching optimizations

import { OrganizationService as BaseOrganizationService } from './organizationService';
import { ContactService as BaseContactService } from './contactService';
import { measureDatabaseOperation } from '../utils/performance/databaseMetrics';
import type {
  OrganizationOverview,
  OrganizationExperience,
  OrganizationPractical,
  OrganizationLocation,
  OrganizationStories,
  OrganizationEssentials,
  TestimonialFilters,
  MediaFilters,
  OrganizationFilters,
  PaginationOptions,
  ContactFormData,
  ApplicationFormData
} from '../types/database';

/**
 * Performance-monitored Organization Service
 * Wraps all operations with performance tracking
 */
export class OrganizationService {
  /**
   * Get basic organization information with performance monitoring
   */
  static async getBasicInfo(slug: string) {
    return measureDatabaseOperation(
      'organization.getBasicInfo',
      () => BaseOrganizationService.getBasicInfo(slug),
      { slug }
    );
  }

  /**
   * Get complete overview data with performance monitoring
   */
  static async getOverview(organizationId: string): Promise<OrganizationOverview> {
    return measureDatabaseOperation(
      'organization.getOverview',
      () => BaseOrganizationService.getOverview(organizationId),
      { organizationId, dataPoints: ['organization', 'primary_program', 'featured_photos', 'statistics'] }
    );
  }

  /**
   * Get experience data with performance monitoring
   */
  static async getExperience(organizationId: string): Promise<OrganizationExperience> {
    return measureDatabaseOperation(
      'organization.getExperience',
      () => BaseOrganizationService.getExperience(organizationId),
      { organizationId, dataPoints: ['programs', 'animal_types', 'activities', 'schedule'] }
    );
  }

  /**
   * Get practical data with performance monitoring
   */
  static async getPractical(organizationId: string): Promise<OrganizationPractical> {
    return measureDatabaseOperation(
      'organization.getPractical',
      () => BaseOrganizationService.getPractical(organizationId),
      { organizationId, dataPoints: ['accommodation', 'meals', 'transport', 'requirements'] }
    );
  }

  /**
   * Get location data with performance monitoring
   */
  static async getLocation(organizationId: string): Promise<OrganizationLocation> {
    return measureDatabaseOperation(
      'organization.getLocation',
      () => BaseOrganizationService.getLocation(organizationId),
      { organizationId, dataPoints: ['organization', 'transportation', 'activities'] }
    );
  }

  /**
   * Get stories data with performance monitoring
   */
  static async getStories(
    organizationId: string, 
    filters: TestimonialFilters = {}
  ): Promise<OrganizationStories> {
    return measureDatabaseOperation(
      'organization.getStories',
      () => BaseOrganizationService.getStories(organizationId, filters),
      { 
        organizationId, 
        filters,
        dataPoints: ['testimonials', 'statistics'] 
      }
    );
  }

  /**
   * Get essential info with performance monitoring
   */
  static async getEssentials(organizationId: string): Promise<OrganizationEssentials> {
    return measureDatabaseOperation(
      'organization.getEssentials',
      () => BaseOrganizationService.getEssentials(organizationId),
      { 
        organizationId, 
        dataPoints: ['organization', 'primary_program', 'accommodation', 'meals', 'requirements'] 
      }
    );
  }

  /**
   * Get paginated testimonials with performance monitoring
   */
  static async getTestimonials(
    organizationId: string,
    filters: TestimonialFilters = {}
  ) {
    return measureDatabaseOperation(
      'testimonials.getPaginated',
      () => BaseOrganizationService.getTestimonials(organizationId, filters),
      { 
        organizationId, 
        filters,
        page: filters.page || 1,
        limit: filters.limit || 10 
      }
    );
  }

  /**
   * Get media items with performance monitoring
   */
  static async getMedia(
    organizationId: string,
    filters: MediaFilters = {}
  ) {
    return measureDatabaseOperation(
      'media.getPaginated',
      () => BaseOrganizationService.getMedia(organizationId, filters),
      { 
        organizationId, 
        filters,
        category: filters.category,
        page: filters.page || 1,
        limit: filters.limit || 20 
      }
    );
  }

  /**
   * Search organizations with performance monitoring
   */
  static async searchOrganizations(
    filters: OrganizationFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ) {
    return measureDatabaseOperation(
      'organization.search',
      () => BaseOrganizationService.searchOrganizations(filters, pagination),
      { 
        filters,
        pagination,
        filterCount: Object.keys(filters).length 
      }
    );
  }
}

/**
 * Performance-monitored Contact Service
 */
export class ContactService {
  /**
   * Submit contact form with performance monitoring
   */
  static async submitContactForm(
    organizationId: string,
    formData: ContactFormData
  ) {
    return measureDatabaseOperation(
      'contact.submit',
      () => BaseContactService.submitContactForm(organizationId, formData),
      { 
        organizationId,
        formFields: Object.keys(formData).length,
        hasPhone: !!formData.phone 
      }
    );
  }

  /**
   * Submit application with performance monitoring
   */
  static async submitApplication(
    organizationId: string,
    applicationData: ApplicationFormData
  ) {
    return measureDatabaseOperation(
      'application.submit',
      () => BaseContactService.submitApplication(organizationId, applicationData),
      { 
        organizationId,
        programId: applicationData.program_id,
        hasEmergencyContact: !!(applicationData.emergency_name && applicationData.emergency_phone)
      }
    );
  }

  /**
   * Check existing submission with performance monitoring
   */
  static async checkExistingSubmission(
    organizationId: string,
    email: string
  ) {
    return measureDatabaseOperation(
      'contact.checkExisting',
      () => BaseContactService.checkExistingSubmission(organizationId, email),
      { organizationId, emailDomain: email.split('@')[1] }
    );
  }

  // Pass through other methods without monitoring (admin functions)
  static getContactSubmissions = BaseContactService.getContactSubmissions;
  static getApplications = BaseContactService.getApplications;
  static updateContactStatus = BaseContactService.updateContactStatus;
  static updateApplicationStatus = BaseContactService.updateApplicationStatus;
}

// Performance analysis utilities
export class PerformanceAnalyzer {
  /**
   * Analyze tab loading performance
   */
  static async analyzeTabPerformance(organizationId: string): Promise<{
    overview: number;
    experience: number;
    practical: number;
    location: number;
    stories: number;
    essentials: number;
    totalTime: number;
    recommendations: string[];
  }> {
    console.log('🔍 Analyzing tab performance...');
    
    const startTime = performance.now();
    const timings: Record<string, number> = {};
    const recommendations: string[] = [];

    // Test each tab's performance
    const tabs = [
      { name: 'overview', fn: () => OrganizationService.getOverview(organizationId) },
      { name: 'experience', fn: () => OrganizationService.getExperience(organizationId) },
      { name: 'practical', fn: () => OrganizationService.getPractical(organizationId) },
      { name: 'location', fn: () => OrganizationService.getLocation(organizationId) },
      { name: 'stories', fn: () => OrganizationService.getStories(organizationId) },
      { name: 'essentials', fn: () => OrganizationService.getEssentials(organizationId) }
    ];

    for (const tab of tabs) {
      const tabStart = performance.now();
      try {
        await tab.fn();
        timings[tab.name] = performance.now() - tabStart;
        
        // Add recommendations based on performance
        if (timings[tab.name] > 1000) {
          recommendations.push(`${tab.name} tab is slow (${timings[tab.name].toFixed(0)}ms) - consider optimizing queries`);
        }
      } catch (error) {
        timings[tab.name] = -1;
        recommendations.push(`${tab.name} tab failed to load - check error handling`);
      }
    }

    const totalTime = performance.now() - startTime;

    // Overall recommendations
    if (totalTime > 3000) {
      recommendations.push('Overall loading time is high - consider implementing progressive loading');
    }

    const avgTime = Object.values(timings).filter(t => t > 0).reduce((a, b) => a + b, 0) / 6;
    if (avgTime > 800) {
      recommendations.push('Average tab load time is high - review database indexes and query optimization');
    }

    return {
      overview: timings.overview,
      experience: timings.experience,
      practical: timings.practical,
      location: timings.location,
      stories: timings.stories,
      essentials: timings.essentials,
      totalTime,
      recommendations
    };
  }

  /**
   * Stress test with concurrent operations
   */
  static async stressTest(organizationId: string, concurrency: number = 5): Promise<{
    averageTime: number;
    successRate: number;
    errors: string[];
    recommendations: string[];
  }> {
    console.log(`🏋️‍♂️ Running stress test with ${concurrency} concurrent operations...`);
    
    const operations: Promise<any>[] = [];
    const results: { success: boolean; time: number; error?: string }[] = [];
    
    // Create concurrent operations
    for (let i = 0; i < concurrency; i++) {
      operations.push(
        (async () => {
          const start = performance.now();
          try {
            await OrganizationService.getOverview(organizationId);
            return { success: true, time: performance.now() - start };
          } catch (error) {
            return { 
              success: false, 
              time: performance.now() - start, 
              error: error.message 
            };
          }
        })()
      );
    }

    // Wait for all operations
    const operationResults = await Promise.all(operations);
    results.push(...operationResults);

    // Calculate metrics
    const successfulOps = results.filter(r => r.success);
    const averageTime = successfulOps.reduce((sum, r) => sum + r.time, 0) / successfulOps.length;
    const successRate = (successfulOps.length / results.length) * 100;
    const errors = results.filter(r => !r.success).map(r => r.error || 'Unknown error');

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (successRate < 100) {
      recommendations.push(`${100 - successRate}% failure rate under load - check connection pooling and error handling`);
    }
    
    if (averageTime > 1500) {
      recommendations.push('High response times under load - consider database optimization or caching');
    }
    
    if (errors.length > 0) {
      recommendations.push('Database errors occurred under load - review connection limits and timeout settings');
    }

    return {
      averageTime,
      successRate,
      errors,
      recommendations
    };
  }

  /**
   * Memory usage analysis
   */
  static analyzeMemoryUsage(): {
    currentUsage: number;
    peakUsage: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    // Get memory info (if available)
    let currentUsage = 0;
    let peakUsage = 0;
    
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      currentUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      peakUsage = Math.round(memory.totalJSHeapSize / 1024 / 1024); // MB
      
      if (currentUsage > 100) {
        recommendations.push('High memory usage detected - review data caching strategies');
      }
      
      if (peakUsage > 200) {
        recommendations.push('Memory peaks are high - consider implementing data pagination');
      }
    } else {
      recommendations.push('Memory monitoring not available in this environment');
    }

    return {
      currentUsage,
      peakUsage,
      recommendations
    };
  }
}

// Export performance-monitored services as default
export { OrganizationService as default };