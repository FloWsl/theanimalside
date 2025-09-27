// src/routing/tests/RouteDefinition.test.ts
import { RouteDefinition, RouteCategory, SEOMetadata, PerformanceConfig, NavigationMetadata } from '../core/RouteDefinition';

describe('RouteDefinition Implementation', () => {
  test('RouteDefinition interface is properly typed', () => {
    const testRoute: RouteDefinition = {
      id: 'test-route',
      path: '/test',
      component: 'TestComponent',
      priority: 'high',
      type: 'static',
      seo: {
        title: 'Test Route',
        description: 'Test description',
        keywords: ['test'],
        changefreq: 'weekly',
        priority: 0.8
      },
      performance: {
        lazyLoad: true,
        preload: 'hover',
        cacheStrategy: 'normal',
        bundleSplit: true
      },
      navigation: {
        enabledFlows: ['test-flow'],
        contextPreservation: true,
        analyticsEvents: ['test-event'],
        breadcrumbPath: ['Home', 'Test']
      }
    };

    expect(testRoute).toBeDefined();
    expect(testRoute.id).toBe('test-route');
    expect(testRoute.priority).toBe('high');
    expect(testRoute.type).toBe('static');
  });

  test('All route categories are properly defined', () => {
    const categories: RouteCategory[] = ['core', 'country', 'animal', 'combined', 'organization', 'system'];
    expect(categories).toHaveLength(6);

    // Ensure all expected categories are present
    expect(categories).toContain('core');
    expect(categories).toContain('country');
    expect(categories).toContain('animal');
    expect(categories).toContain('combined');
    expect(categories).toContain('organization');
    expect(categories).toContain('system');
  });

  test('SEOMetadata has all required fields', () => {
    const seoData: SEOMetadata = {
      title: 'Test SEO Title',
      description: 'Test SEO description',
      keywords: ['test', 'seo'],
      changefreq: 'weekly',
      priority: 0.8
    };

    expect(seoData.title).toBeDefined();
    expect(seoData.description).toBeDefined();
    expect(seoData.keywords).toBeInstanceOf(Array);
    expect(seoData.changefreq).toBe('weekly');
    expect(seoData.priority).toBe(0.8);
  });

  test('PerformanceConfig has correct default options', () => {
    const perfConfig: PerformanceConfig = {
      lazyLoad: true,
      preload: 'hover',
      cacheStrategy: 'aggressive',
      bundleSplit: true
    };

    expect(perfConfig.lazyLoad).toBe(true);
    expect(['immediate', 'hover', 'none']).toContain(perfConfig.preload);
    expect(['aggressive', 'normal', 'none']).toContain(perfConfig.cacheStrategy);
    expect(perfConfig.bundleSplit).toBe(true);
  });

  test('NavigationMetadata supports flow configuration', () => {
    const navConfig: NavigationMetadata = {
      enabledFlows: ['to-country', 'to-animal'],
      contextPreservation: true,
      analyticsEvents: ['page_view', 'navigation'],
      breadcrumbPath: ['Home', 'Test']
    };

    expect(navConfig.enabledFlows).toBeInstanceOf(Array);
    expect(navConfig.enabledFlows).toContain('to-country');
    expect(navConfig.contextPreservation).toBe(true);
    expect(navConfig.analyticsEvents).toBeInstanceOf(Array);
    expect(navConfig.breadcrumbPath).toBeInstanceOf(Array);
  });
});