/**
 * Content Hub Data Tests
 * 
 * Unit tests for content hub data structure and validation functions
 */

import {
  contentHubs,
  getContentHub,
  getContentHubsByType,
  getAllContentHubs,
  validateContentHub,
  getContentHubSEO,
  transformForDatabase,
  transformFromDatabase,
  type ContentHubData,
  type ConservationContent
} from '../contentHubs';

describe('Content Hub Data Structure', () => {
  test('should have initial content hubs defined', () => {
    expect(contentHubs).toBeDefined();
    expect(contentHubs.length).toBeGreaterThan(0);
  });

  test('should include lions conservation hub', () => {
    const lionsHub = contentHubs.find(hub => hub.id === 'lions');
    expect(lionsHub).toBeDefined();
    expect(lionsHub?.type).toBe('animal');
    expect(lionsHub?.status).toBe('published');
  });

  test('should include costa rica regional hub', () => {
    const costaRicaHub = contentHubs.find(hub => hub.id === 'costa-rica');
    expect(costaRicaHub).toBeDefined();
    expect(costaRicaHub?.type).toBe('country');
    expect(costaRicaHub?.status).toBe('published');
  });
});

describe('Content Hub Utility Functions', () => {
  describe('getContentHub', () => {
    test('should return published content hub by id', () => {
      const hub = getContentHub('lions');
      expect(hub).toBeDefined();
      expect(hub?.id).toBe('lions');
    });

    test('should return undefined for non-existent id', () => {
      const hub = getContentHub('non-existent');
      expect(hub).toBeUndefined();
    });
  });

  describe('getContentHubsByType', () => {
    test('should return animal content hubs', () => {
      const animalHubs = getContentHubsByType('animal');
      expect(animalHubs.length).toBeGreaterThan(0);
      animalHubs.forEach(hub => expect(hub.type).toBe('animal'));
    });

    test('should return country content hubs', () => {
      const countryHubs = getContentHubsByType('country');
      expect(countryHubs.length).toBeGreaterThan(0);
      countryHubs.forEach(hub => expect(hub.type).toBe('country'));
    });
  });

  describe('getAllContentHubs', () => {
    test('should return all published content hubs', () => {
      const allHubs = getAllContentHubs();
      expect(allHubs.length).toBe(contentHubs.filter(h => h.status === 'published').length);
    });
  });
});

describe('Content Validation', () => {
  const validHub: ContentHubData = {
    id: 'test-hub',
    type: 'animal',
    seoTitle: 'Test Conservation Volunteer Program',
    metaDescription: 'Test description for conservation volunteering',
    heroImage: 'https://example.com/image.jpg',
    conservation: {
      challenge: 'Test conservation challenge',
      solution: 'Test volunteer solution',
      impact: 'Test conservation impact',
      lastReviewed: '2025-01-18',
      reviewedBy: 'test-reviewer'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: ['test', 'conservation'],
    searchVolume: 100
  };

  test('should validate correct content hub', () => {
    const validation = validateContentHub(validHub);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should detect missing required fields', () => {
    const invalidHub = { ...validHub, id: '', seoTitle: '' };
    const validation = validateContentHub(invalidHub);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('ID is required');
    expect(validation.errors).toContain('SEO title is required');
  });

  test('should warn about long meta description', () => {
    const longDescHub = {
      ...validHub,
      metaDescription: 'A'.repeat(200) // Exceeds 155 character limit
    };
    const validation = validateContentHub(longDescHub);
    expect(validation.warnings).toContain('Meta description exceeds 155 characters');
  });

  test('should warn about long SEO title', () => {
    const longTitleHub = {
      ...validHub,
      seoTitle: 'A'.repeat(70) // Exceeds 60 character limit
    };
    const validation = validateContentHub(longTitleHub);
    expect(validation.warnings).toContain('SEO title exceeds 60 characters');
  });
});

describe('SEO Data Generation', () => {
  test('should generate SEO data for animal hub', () => {
    const lionsHub = getContentHub('lions')!;
    const seoData = getContentHubSEO(lionsHub, 'https://example.com');
    
    expect(seoData.title).toBe(lionsHub.seoTitle);
    expect(seoData.description).toBe(lionsHub.metaDescription);
    expect(seoData.canonical).toBe('https://example.com/lions-volunteer');
    expect(seoData.openGraph.title).toBe(lionsHub.seoTitle);
  });

  test('should generate SEO data for country hub', () => {
    const costaRicaHub = getContentHub('costa-rica')!;
    const seoData = getContentHubSEO(costaRicaHub, 'https://example.com');
    
    expect(seoData.canonical).toBe('https://example.com/volunteer-costa-rica');
  });
});

describe('Database Transformation', () => {
  const sampleHub = getContentHub('lions')!;

  test('should transform content hub for database storage', () => {
    const dbRecord = transformForDatabase(sampleHub);
    
    expect(dbRecord.slug).toBe(sampleHub.id);
    expect(dbRecord.type).toBe(sampleHub.type);
    expect(dbRecord.seo_title).toBe(sampleHub.seoTitle);
    expect(dbRecord.conservation_content).toEqual(sampleHub.conservation);
  });

  test('should transform database record to content hub', () => {
    const dbRecord = {
      slug: 'test-hub',
      type: 'animal',
      seo_title: 'Test Title',
      meta_description: 'Test description',
      hero_image: 'https://example.com/image.jpg',
      conservation_content: {
        challenge: 'Test challenge',
        solution: 'Test solution',
        impact: 'Test impact',
        lastReviewed: '2025-01-18',
        reviewedBy: 'test'
      },
      target_keywords: ['test'],
      search_volume: 100,
      status: 'published',
      updated_at: '2025-01-18T00:00:00Z'
    };

    const contentHub = transformFromDatabase(dbRecord);
    
    expect(contentHub.id).toBe(dbRecord.slug);
    expect(contentHub.type).toBe(dbRecord.type);
    expect(contentHub.seoTitle).toBe(dbRecord.seo_title);
    expect(contentHub.conservation).toEqual(dbRecord.conservation_content);
  });
});

describe('Content Quality Standards', () => {
  test('all content hubs should meet quality standards', () => {
    contentHubs.forEach(hub => {
      const validation = validateContentHub(hub);
      expect(validation.isValid).toBe(true);
      
      // SEO standards
      expect(hub.metaDescription.length).toBeLessThanOrEqual(155);
      expect(hub.seoTitle.length).toBeLessThanOrEqual(60);
      
      // Content standards
      expect(hub.conservation.challenge.length).toBeGreaterThan(50);
      expect(hub.conservation.solution.length).toBeGreaterThan(50);
      expect(hub.conservation.impact.length).toBeGreaterThan(20);
      
      // Source verification
      expect(hub.conservation.sources).toBeDefined();
      expect(hub.conservation.sources!.length).toBeGreaterThan(0);
    });
  });

  test('target keywords should be relevant and specific', () => {
    contentHubs.forEach(hub => {
      expect(hub.targetKeywords.length).toBeGreaterThan(0);
      
      // Keywords should include hub type
      const hasRelevantKeyword = hub.targetKeywords.some(keyword => 
        keyword.includes('volunteer') || keyword.includes('conservation')
      );
      expect(hasRelevantKeyword).toBe(true);
    });
  });
});