// 🧪 Integration Tests for Organization Service
// Comprehensive testing of database operations and service layer

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { OrganizationService } from '../organizationService';
import { ContactService } from '../contactService';
import type { Database } from '../../types/supabase-generated';

// Test environment setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials for testing');
}

const testClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test data
const testOrganizationId = 'test-org-123';
const testSlug = 'test-organization';

describe('OrganizationService Integration Tests', () => {
  beforeAll(async () => {
    // Set up test data
    await setupTestData();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
  });

  describe('Basic Organization Operations', () => {
    it('should fetch organization by slug', async () => {
      const organization = await OrganizationService.getBasicInfo(testSlug);
      
      expect(organization).toBeDefined();
      expect(organization.slug).toBe(testSlug);
      expect(organization.name).toBe('Test Organization');
      expect(organization.status).toBe('active');
    });

    it('should throw error for non-existent organization', async () => {
      await expect(
        OrganizationService.getBasicInfo('non-existent-slug')
      ).rejects.toThrow();
    });

    it('should fetch organization overview data', async () => {
      const overview = await OrganizationService.getOverview(testOrganizationId);
      
      expect(overview).toBeDefined();
      expect(overview.organization).toBeDefined();
      expect(overview.primary_program).toBeDefined();
      expect(overview.featured_photos).toBeInstanceOf(Array);
      expect(overview.statistics).toBeDefined();
      
      // Verify primary program is correctly identified
      expect(overview.primary_program.is_primary).toBe(true);
    });

    it('should fetch organization experience data', async () => {
      const experience = await OrganizationService.getExperience(testOrganizationId);
      
      expect(experience).toBeDefined();
      expect(experience.programs).toBeInstanceOf(Array);
      expect(experience.animal_types).toBeInstanceOf(Array);
      expect(experience.program_activities).toBeInstanceOf(Array);
      expect(experience.schedule_items).toBeInstanceOf(Array);
      
      // Verify programs are ordered with primary first
      expect(experience.programs[0].is_primary).toBe(true);
    });

    it('should fetch organization practical data', async () => {
      const practical = await OrganizationService.getPractical(testOrganizationId);
      
      expect(practical).toBeDefined();
      expect(practical.accommodation).toBeDefined();
      expect(practical.amenities).toBeInstanceOf(Array);
      expect(practical.meal_plan).toBeDefined();
      expect(practical.dietary_options).toBeInstanceOf(Array);
      expect(practical.transportation).toBeDefined();
      expect(practical.internet_access).toBeDefined();
      expect(practical.age_requirement).toBeDefined();
      expect(practical.skill_requirements).toBeInstanceOf(Array);
      expect(practical.health_requirements).toBeInstanceOf(Array);
      expect(practical.languages).toBeInstanceOf(Array);
    });

    it('should fetch organization location data', async () => {
      const location = await OrganizationService.getLocation(testOrganizationId);
      
      expect(location).toBeDefined();
      expect(location.organization).toBeDefined();
      expect(location.transportation).toBeDefined();
      expect(location.activities).toBeInstanceOf(Array);
      
      // Verify location data structure
      expect(location.organization.coordinates).toBeDefined();
      expect(location.organization.country).toBeDefined();
    });

    it('should fetch organization stories data', async () => {
      const stories = await OrganizationService.getStories(testOrganizationId);
      
      expect(stories).toBeDefined();
      expect(stories.testimonials).toBeInstanceOf(Array);
      expect(stories.statistics).toBeDefined();
      expect(typeof stories.total_testimonials).toBe('number');
      expect(typeof stories.average_rating).toBe('number');
    });

    it('should fetch organization essentials data', async () => {
      const essentials = await OrganizationService.getEssentials(testOrganizationId);
      
      expect(essentials).toBeDefined();
      expect(essentials.organization).toBeDefined();
      expect(essentials.primary_program).toBeDefined();
      expect(essentials.accommodation).toBeDefined();
      expect(essentials.meal_plan).toBeDefined();
      expect(essentials.transportation).toBeDefined();
      expect(essentials.internet_access).toBeDefined();
      expect(essentials.age_requirement).toBeDefined();
      expect(essentials.key_requirements).toBeInstanceOf(Array);
      expect(essentials.languages).toBeInstanceOf(Array);
      
      // Verify only required skills are returned
      essentials.key_requirements.forEach(req => {
        expect(req.requirement_type).toBe('required');
      });
    });
  });

  describe('Testimonials and Media', () => {
    it('should fetch testimonials with pagination', async () => {
      const testimonials = await OrganizationService.getTestimonials(testOrganizationId, {
        page: 1,
        limit: 2
      });
      
      expect(testimonials).toBeDefined();
      expect(testimonials.data).toBeInstanceOf(Array);
      expect(testimonials.data.length).toBeLessThanOrEqual(2);
      expect(typeof testimonials.count).toBe('number');
      expect(typeof testimonials.page).toBe('number');
      expect(typeof testimonials.limit).toBe('number');
      expect(typeof testimonials.has_more).toBe('boolean');
    });

    it('should filter testimonials by rating', async () => {
      const testimonials = await OrganizationService.getTestimonials(testOrganizationId, {
        min_rating: 4,
        limit: 10
      });
      
      expect(testimonials.data.every(t => t.rating >= 4)).toBe(true);
    });

    it('should filter testimonials by verification status', async () => {
      const testimonials = await OrganizationService.getTestimonials(testOrganizationId, {
        verified_only: true,
        limit: 10
      });
      
      expect(testimonials.data.every(t => t.verified === true)).toBe(true);
    });

    it('should fetch media items with filtering', async () => {
      const media = await OrganizationService.getMedia(testOrganizationId, {
        category: 'gallery',
        page: 1,
        limit: 5
      });
      
      expect(media).toBeDefined();
      expect(media.data).toBeInstanceOf(Array);
      expect(media.data.every(m => m.category === 'gallery')).toBe(true);
    });

    it('should fetch featured media only', async () => {
      const media = await OrganizationService.getMedia(testOrganizationId, {
        featured_only: true,
        limit: 10
      });
      
      expect(media.data.every(m => m.featured === true)).toBe(true);
    });
  });

  describe('Search and Filtering', () => {
    it('should search organizations with country filter', async () => {
      const results = await OrganizationService.searchOrganizations({
        country: 'Test Country'
      });
      
      expect(results).toBeDefined();
      expect(results.data).toBeInstanceOf(Array);
      expect(results.data.every(org => org.country === 'Test Country')).toBe(true);
    });

    it('should search organizations with verification filter', async () => {
      const results = await OrganizationService.searchOrganizations({
        verified_only: true
      });
      
      expect(results.data.every(org => org.verified === true)).toBe(true);
    });

    it('should handle pagination in search results', async () => {
      const page1 = await OrganizationService.searchOrganizations({}, { page: 1, limit: 2 });
      const page2 = await OrganizationService.searchOrganizations({}, { page: 2, limit: 2 });
      
      expect(page1.data.length).toBeLessThanOrEqual(2);
      expect(page2.data.length).toBeLessThanOrEqual(2);
      expect(page1.page).toBe(1);
      expect(page2.page).toBe(2);
      
      // Ensure different data on different pages
      if (page1.data.length > 0 && page2.data.length > 0) {
        expect(page1.data[0].id).not.toBe(page2.data[0].id);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock a database error by using invalid ID format
      await expect(
        OrganizationService.getBasicInfo('invalid-id-format-that-will-fail')
      ).rejects.toThrow();
    });

    it('should handle malformed filter parameters', async () => {
      await expect(
        OrganizationService.getTestimonials(testOrganizationId, {
          min_rating: -1 // Invalid rating
        })
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should fetch overview data within performance target (2s)', async () => {
      const startTime = Date.now();
      await OrganizationService.getOverview(testOrganizationId);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('should handle concurrent requests efficiently', async () => {
      const startTime = Date.now();
      
      // Run multiple requests concurrently
      const promises = [
        OrganizationService.getOverview(testOrganizationId),
        OrganizationService.getExperience(testOrganizationId),
        OrganizationService.getPractical(testOrganizationId),
        OrganizationService.getStories(testOrganizationId)
      ];
      
      await Promise.all(promises);
      const endTime = Date.now();
      
      // Should complete all requests in reasonable time
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });
});

describe('ContactService Integration Tests', () => {
  const testContactData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'United States',
    phone: '+1234567890',
    message: 'I am interested in volunteering with your organization.',
    source: 'test'
  };

  const testApplicationData = {
    ...testContactData,
    program_id: 'test-program-123',
    date_of_birth: '1990-01-01',
    occupation: 'Software Developer',
    experience_level: 'Beginner',
    motivation: 'I want to help wildlife conservation.',
    emergency_name: 'Jane Doe',
    emergency_relationship: 'Spouse',
    emergency_phone: '+1234567891',
    emergency_email: 'jane.doe@example.com',
    agreement_accepted: true
  };

  describe('Contact Form Submission', () => {
    it('should submit contact form successfully', async () => {
      const submission = await ContactService.submitContactForm(
        testOrganizationId,
        testContactData
      );
      
      expect(submission).toBeDefined();
      expect(submission.name).toBe(testContactData.name);
      expect(submission.email).toBe(testContactData.email);
      expect(submission.status).toBe('new');
      expect(submission.organization_id).toBe(testOrganizationId);
    });

    it('should validate required fields', async () => {
      const invalidData = { ...testContactData, name: '', email: '' };
      
      await expect(
        ContactService.submitContactForm(testOrganizationId, invalidData)
      ).rejects.toThrow();
    });

    it('should check for existing submissions', async () => {
      // First submission
      await ContactService.submitContactForm(testOrganizationId, testContactData);
      
      // Check existing
      const existing = await ContactService.checkExistingSubmission(
        testOrganizationId,
        testContactData.email
      );
      
      expect(existing.hasContact).toBe(true);
      expect(existing.hasApplication).toBe(false);
    });
  });

  describe('Application Submission', () => {
    it('should submit application successfully', async () => {
      const application = await ContactService.submitApplication(
        testOrganizationId,
        testApplicationData
      );
      
      expect(application).toBeDefined();
      expect(application.name).toBe(testApplicationData.name);
      expect(application.email).toBe(testApplicationData.email);
      expect(application.application_status).toBe('submitted');
      expect(application.agreement_accepted).toBe(true);
    });

    it('should validate emergency contact information', async () => {
      const invalidData = { 
        ...testApplicationData, 
        emergency_name: '',
        emergency_phone: ''
      };
      
      await expect(
        ContactService.submitApplication(testOrganizationId, invalidData)
      ).rejects.toThrow();
    });

    it('should require agreement acceptance', async () => {
      const invalidData = { 
        ...testApplicationData, 
        agreement_accepted: false
      };
      
      await expect(
        ContactService.submitApplication(testOrganizationId, invalidData)
      ).rejects.toThrow();
    });
  });
});

// Test setup and cleanup functions
async function setupTestData() {
  // Insert test organization
  await testClient.from('organizations').insert({
    id: testOrganizationId,
    name: 'Test Organization',
    slug: testSlug,
    tagline: 'Test Tagline',
    mission: 'Test Mission',
    logo: 'https://example.com/logo.jpg',
    hero_image: 'https://example.com/hero.jpg',
    website: 'https://example.com',
    email: 'test@example.com',
    year_founded: 2020,
    verified: true,
    country: 'Test Country',
    region: 'Test Region',
    city: 'Test City',
    coordinates: '(0,0)',
    timezone: 'UTC',
    status: 'active',
    featured: true
  });

  // Insert test program
  await testClient.from('programs').insert({
    id: 'test-program-123',
    organization_id: testOrganizationId,
    title: 'Test Program',
    description: 'Test Program Description',
    is_primary: true,
    duration_min_weeks: 4,
    duration_max_weeks: 12,
    hours_per_day: 8,
    days_per_week: 5,
    cost_amount: 0,
    cost_currency: 'USD',
    cost_period: 'week',
    status: 'active'
  });

  // Insert test accommodation
  await testClient.from('accommodations').insert({
    id: 'test-accommodation-123',
    organization_id: testOrganizationId,
    provided: true,
    accommodation_type: 'shared_room',
    description: 'Test accommodation'
  });

  // Insert test meal plan
  await testClient.from('meal_plans').insert({
    id: 'test-meal-plan-123',
    organization_id: testOrganizationId,
    provided: true,
    meal_type: 'all_meals',
    description: 'Test meal plan'
  });

  // Insert test transportation
  await testClient.from('transportation').insert({
    organization_id: testOrganizationId,
    airport_pickup: true,
    local_transport: true,
    description: 'Test transportation'
  });

  // Insert test internet access
  await testClient.from('internet_access').insert({
    organization_id: testOrganizationId,
    available: true,
    quality: 'good',
    description: 'Test internet'
  });

  // Insert test age requirement
  await testClient.from('age_requirements').insert({
    organization_id: testOrganizationId,
    min_age: 18,
    max_age: 65
  });

  // Insert test skill requirements
  await testClient.from('skill_requirements').insert([
    {
      organization_id: testOrganizationId,
      requirement_type: 'required',
      skill_name: 'Physical fitness',
      order_index: 0
    },
    {
      organization_id: testOrganizationId,
      requirement_type: 'preferred',
      skill_name: 'Wildlife experience',
      order_index: 1
    }
  ]);

  // Insert test languages
  await testClient.from('languages').insert([
    {
      organization_id: testOrganizationId,
      language_name: 'English',
      proficiency_level: 'conversational',
      is_required: true,
      order_index: 0
    }
  ]);

  // Insert test statistics
  await testClient.from('organization_statistics').insert({
    organization_id: testOrganizationId,
    volunteers_hosted: 100,
    years_operating: 5,
    animals_rescued: 200,
    total_reviews: 0,
    average_rating: 0
  });

  // Insert test testimonials
  await testClient.from('testimonials').insert([
    {
      organization_id: testOrganizationId,
      volunteer_name: 'Alice Smith',
      volunteer_country: 'USA',
      rating: 5,
      quote: 'Amazing experience!',
      program_name: 'Test Program',
      duration_weeks: 4,
      experience_date: '2024-01-01',
      verified: true,
      featured: true,
      moderation_status: 'approved'
    },
    {
      organization_id: testOrganizationId,
      volunteer_name: 'Bob Johnson',
      volunteer_country: 'Canada',
      rating: 4,
      quote: 'Great organization!',
      program_name: 'Test Program',
      duration_weeks: 6,
      experience_date: '2024-02-01',
      verified: true,
      featured: false,
      moderation_status: 'approved'
    }
  ]);

  // Insert test media items
  await testClient.from('media_items').insert([
    {
      organization_id: testOrganizationId,
      item_type: 'image',
      url: 'https://example.com/image1.jpg',
      caption: 'Test Image 1',
      alt_text: 'Test Alt 1',
      category: 'hero',
      featured: true,
      order_index: 0
    },
    {
      organization_id: testOrganizationId,
      item_type: 'image',
      url: 'https://example.com/image2.jpg',
      caption: 'Test Image 2',
      alt_text: 'Test Alt 2',
      category: 'gallery',
      featured: false,
      order_index: 1
    }
  ]);
}

async function cleanupTestData() {
  // Clean up in reverse order of foreign key dependencies
  const tables = [
    'contact_submissions',
    'volunteer_applications', 
    'testimonials',
    'media_items',
    'organization_statistics',
    'languages',
    'skill_requirements',
    'age_requirements',
    'internet_access',
    'transportation',
    'meal_plans',
    'accommodations',
    'programs',
    'organizations'
  ];

  for (const table of tables) {
    await testClient
      .from(table)
      .delete()
      .eq('organization_id', testOrganizationId);
  }
}