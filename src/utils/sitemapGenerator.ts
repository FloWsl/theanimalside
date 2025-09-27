import { opportunities } from '../data/opportunities';
import { formatAnimalSlug, formatCountrySlug } from './routeUtils';

/**
 * Sitemap Generation Utility
 * Auto-generates XML sitemaps for all valid dynamic routes
 * Includes static routes, dynamic animal/country routes, and organization routes
 */

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Get dynamic route configuration without React hooks
 */
const getDynamicRouteConfig = () => {
  // Extract unique animals from all opportunities
  const animalsSet = new Set<string>();
  opportunities.forEach(opp => {
    opp.animalTypes.forEach(animal => {
      const slug = formatAnimalSlug(animal);
      animalsSet.add(slug);
    });
  });

  // Extract unique countries from all opportunities
  const countriesSet = new Set<string>();
  opportunities.forEach(opp => {
    const slug = formatCountrySlug(opp.location.country);
    countriesSet.add(slug);
  });

  const animals = Array.from(animalsSet);
  const countries = Array.from(countriesSet);

  // Generate valid combinations based on actual data
  const combinations: Array<{animal: string, country: string}> = [];
  animals.forEach(animal => {
    countries.forEach(country => {
      // Check if this combination actually exists in opportunities
      const hasOpportunity = opportunities.some(opp => {
        const countryMatches = formatCountrySlug(opp.location.country) === country;
        const animalMatches = opp.animalTypes.some(type =>
          formatAnimalSlug(type) === animal
        );
        return countryMatches && animalMatches;
      });

      if (hasOpportunity) {
        combinations.push({ animal, country });
      }
    });
  });

  return {
    supportedAnimals: animals,
    supportedCountries: countries,
    validCombinations: combinations
  };
};

/**
 * Generate all valid routes for sitemap
 */
const getAllValidRoutes = () => {
  const config = getDynamicRouteConfig();
  const routes: SitemapEntry[] = [];

  // Add country routes
  config.supportedCountries.forEach(country => {
    routes.push({
      loc: `/volunteer-${country}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // Add animal routes
  config.supportedAnimals.forEach(animal => {
    routes.push({
      loc: `/${animal}-volunteer`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // Add combined routes (both directions)
  config.validCombinations.forEach(combo => {
    const currentDate = new Date().toISOString().split('T')[0];

    // Country-first format: /volunteer-costa-rica/lions
    routes.push({
      loc: `/volunteer-${combo.country}/${combo.animal}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.9
    });

    // Animal-first format: /lions-volunteer/costa-rica
    routes.push({
      loc: `/${combo.animal}-volunteer/${combo.country}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.9
    });
  });

  return routes;
};

/**
 * Generate complete sitemap with all routes
 */
export const generateDynamicSitemap = (): string => {
  const validRoutes = getAllValidRoutes();
  const baseUrl = 'https://theanimalside.com';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Static routes with high priority
  const staticRoutes: SitemapEntry[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/opportunities`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/for-organizations`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    }
  ];

  // Convert dynamic routes to sitemap entries
  const dynamicRoutes: SitemapEntry[] = validRoutes.map(route => ({
    loc: `${baseUrl}${route.path}`,
    lastmod: currentDate,
    changefreq: route.changefreq,
    priority: route.priority
  }));

  // Conservation routes (explicit for SEO value)
  const conservationRoutes: SitemapEntry[] = [
    {
      loc: `${baseUrl}/wildlife-conservation`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/marine-conservation`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/forest-conservation`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    }
  ];

  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes, ...conservationRoutes];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

/**
 * Generate sitemap entries for specific route type
 */
export const generateSitemapForRouteType = (
  routeType: 'animal' | 'country' | 'combined'
): SitemapEntry[] => {
  const validRoutes = getAllValidRoutes();
  const baseUrl = 'https://theanimalside.com';

  // Filter by route type based on path patterns
  return validRoutes.filter(route => {
    if (routeType === 'animal') {
      return route.loc.includes('-volunteer') && !route.loc.startsWith('/volunteer-');
    } else if (routeType === 'country') {
      return route.loc.startsWith('/volunteer-') && !route.loc.includes('/', 10);
    } else if (routeType === 'combined') {
      return route.loc.includes('/') && route.loc !== '/';
    }
    return false;
  }).map(route => ({
    ...route,
    loc: `${baseUrl}${route.loc}`
  }));
};

/**
 * Get sitemap statistics for analysis
 */
export const getSitemapStats = () => {
  const validRoutes = getAllValidRoutes();
  const config = getDynamicRouteConfig();

  const stats = {
    totalRoutes: validRoutes.length,
    routesByType: {
      animal: validRoutes.filter(r => r.loc.includes('-volunteer') && !r.loc.startsWith('/volunteer-')).length,
      country: validRoutes.filter(r => r.loc.startsWith('/volunteer-') && !r.loc.includes('/', 10)).length,
      combined: validRoutes.filter(r => r.loc.includes('/') && r.loc !== '/' && (r.loc.includes('-volunteer/') || r.loc.includes('/volunteer-'))).length
    },
    supportedAnimals: config.supportedAnimals.length,
    supportedCountries: config.supportedCountries.length,
    validCombinations: config.validCombinations.length,
    estimatedStaticRoutes: 5, // Homepage, opportunities, about, contact, for-organizations
    totalSitemapEntries: validRoutes.length + 5 + 3 // +3 for conservation routes
  };

  return stats;
};

/**
 * Validate sitemap XML structure
 */
export const validateSitemap = (sitemapXml: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic XML structure validation
  if (!sitemapXml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('Missing XML declaration');
  }

  if (!sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    errors.push('Missing or incorrect urlset declaration');
  }

  if (!sitemapXml.includes('</urlset>')) {
    errors.push('Missing closing urlset tag');
  }

  // Count URL entries
  const urlMatches = sitemapXml.match(/<url>/g);
  const urlCloseMatches = sitemapXml.match(/<\/url>/g);

  if (!urlMatches || !urlCloseMatches) {
    errors.push('No URL entries found');
  } else if (urlMatches.length !== urlCloseMatches.length) {
    errors.push('Mismatched URL opening and closing tags');
  }

  // Validate required elements in URLs
  const requiredElements = ['<loc>', '<lastmod>', '<changefreq>', '<priority>'];
  requiredElements.forEach(element => {
    if (!sitemapXml.includes(element)) {
      errors.push(`Missing required element: ${element}`);
    }
  });

  // Check for valid URLs (basic check)
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
  if (locMatches) {
    locMatches.forEach(match => {
      const url = match.replace(/<\/?loc>/g, '');
      if (!url.startsWith('https://theanimalside.com')) {
        errors.push(`Invalid URL found: ${url}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Export sitemap to file (for build process)
 */
export const exportSitemapToFile = async (sitemap: string, filename: string = 'sitemap.xml'): Promise<void> => {
  if (typeof window !== 'undefined') {
    // Browser environment - download file
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    // Node.js environment - write to file system
    const fs = await import('fs');
    fs.writeFileSync(filename, sitemap, 'utf8');
  }
};

/**
 * Hook for sitemap generation in React components
 */
export const useSitemapGenerator = () => {
  const generateSitemap = () => generateDynamicSitemap();
  const getStats = () => getSitemapStats();
  const validateXml = (xml: string) => validateSitemap(xml);

  return {
    generateSitemap,
    getStats,
    validateXml,
    exportToFile: exportSitemapToFile
  };
};

/**
 * Generate robots.txt content with sitemap reference
 */
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://theanimalside.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin/private areas (future)
# Disallow: /admin/
# Disallow: /api/private/
`;
};

export default { generateDynamicSitemap, getSitemapStats, validateSitemap };