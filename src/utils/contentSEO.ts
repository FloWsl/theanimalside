/**
 * Content Hub SEO Utilities
 * 
 * Provides SEO optimization utilities specifically for content hub pages.
 * Generates structured data, meta tags, and OpenGraph data for conservation
 * content to improve search engine ranking and social sharing.
 */

import type { ContentHubData } from '../data/contentHubs';
import type { Opportunity } from '../types';

// Base URL for canonical links (will be configured from environment)
const BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://theanimalside.com';

/**
 * SEO metadata interface
 */
export interface ContentSEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: {
    type: string;
    title: string;
    description: string;
    image: string;
    url: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  structuredData: any[];
}

/**
 * Generate comprehensive SEO data for content hub pages
 * @param hubData - Content hub data
 * @param opportunities - Related opportunities for structured data
 * @returns Complete SEO metadata
 */
export const generateContentHubSEO = (
  hubData: ContentHubData, 
  opportunities: Opportunity[] = []
): ContentSEOData => {
  // Generate canonical URL based on hub type
  const canonical = hubData.type === 'animal' 
    ? `${BASE_URL}/${hubData.id}-volunteer`
    : `${BASE_URL}/volunteer-${hubData.id}`;

  // Enhanced meta description with search intent
  const description = `${hubData.metaDescription} Browse ${opportunities.length}+ verified programs with hands-on conservation work.`;

  return {
    title: hubData.seoTitle,
    description: description.slice(0, 155), // Ensure under 155 chars
    keywords: [
      ...hubData.targetKeywords,
      'wildlife conservation',
      'volunteer abroad',
      'gap year programs',
      'conservation volunteering',
      'wildlife protection'
    ],
    canonical,
    openGraph: {
      type: 'website',
      title: hubData.seoTitle,
      description: hubData.metaDescription,
      image: hubData.heroImage,
      url: canonical
    },
    twitterCard: {
      card: 'summary_large_image',
      title: hubData.seoTitle,
      description: hubData.metaDescription,
      image: hubData.heroImage
    },
    structuredData: generateStructuredData(hubData, opportunities, canonical)
  };
};

/**
 * Generate structured data (JSON-LD) for content hubs
 * @param hubData - Content hub data
 * @param opportunities - Related opportunities
 * @param canonical - Canonical URL
 * @returns Array of structured data objects
 */
export const generateStructuredData = (
  hubData: ContentHubData,
  opportunities: Opportunity[],
  canonical: string
): any[] => {
  const structuredData: any[] = [];

  // Organization schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Animal Side",
    "description": "Wildlife conservation volunteer discovery platform",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "sameAs": [
      "https://www.facebook.com/theanimalside",
      "https://www.instagram.com/theanimalside",
      "https://twitter.com/theanimalside"
    ]
  });

  // WebPage schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    "url": canonical,
    "name": hubData.seoTitle,
    "description": hubData.metaDescription,
    "isPartOf": {
      "@type": "WebSite",
      "name": "The Animal Side",
      "url": BASE_URL
    },
    "about": {
      "@type": "Thing",
      "name": hubData.type === 'animal' 
        ? `${hubData.id} conservation`
        : `${hubData.id} wildlife volunteering`,
      "description": hubData.conservation.challenge
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Opportunities",
          "item": `${BASE_URL}/opportunities`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": hubData.seoTitle.replace(' | The Animal Side', ''),
          "item": canonical
        }
      ]
    }
  });

  // Article schema for conservation content
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${hubData.seoTitle.replace(' | The Animal Side', '')} - Conservation Guide`,
    "description": hubData.conservation.challenge,
    "image": hubData.heroImage,
    "author": {
      "@type": "Organization",
      "name": "The Animal Side Conservation Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Animal Side",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "datePublished": hubData.lastUpdated,
    "dateModified": hubData.lastUpdated,
    "mainEntityOfPage": canonical,
    "about": {
      "@type": "Thing",
      "name": hubData.type === 'animal' 
        ? `${hubData.id} conservation`
        : `Wildlife conservation in ${hubData.id}`,
      "description": hubData.conservation.solution
    }
  });

  // VolunteerOpportunity schema for related opportunities
  if (opportunities.length > 0) {
    opportunities.slice(0, 5).forEach(opportunity => { // Limit to 5 for performance
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "VolunteerOpportunity",
        "name": opportunity.title,
        "description": opportunity.description,
        "url": `${BASE_URL}/${opportunity.organization.toLowerCase().replace(/\s+/g, '-')}`,
        "hiringOrganization": {
          "@type": "Organization",
          "name": opportunity.organization
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": opportunity.location.country,
            "addressLocality": opportunity.location.city
          }
        },
        "qualifications": opportunity.requirements?.join(', ') || '',
        "skills": opportunity.animalTypes?.join(', ') || '',
        "timeCommitment": `${opportunity.duration.min}-${opportunity.duration.max} weeks`,
        "incentiveCompensation": opportunity.cost.amount === 0 ? "Free program" : `${opportunity.cost.currency} ${opportunity.cost.amount}/${opportunity.cost.period}`
      });
    });
  }

  return structuredData;
};

/**
 * Generate internal linking suggestions for content hubs
 * @param hubData - Current content hub
 * @param allHubs - All available content hubs
 * @returns Array of related content hubs for internal linking
 */
export const generateInternalLinks = (
  hubData: ContentHubData,
  allHubs: ContentHubData[]
): Array<{
  title: string;
  url: string;
  description: string;
  type: 'animal' | 'country' | 'related';
}> => {
  const links: Array<{
    title: string;
    url: string;
    description: string;
    type: 'animal' | 'country' | 'related';
  }> = [];

  // Get related hubs (opposite type)
  const relatedHubs = allHubs.filter(hub => 
    hub.id !== hubData.id && hub.type !== hubData.type
  );

  // Add 3-5 most relevant related hubs
  relatedHubs.slice(0, 4).forEach(hub => {
    const url = hub.type === 'animal' 
      ? `/${hub.id}-volunteer`
      : `/volunteer-${hub.id}`;
    
    links.push({
      title: hub.seoTitle.replace(' | The Animal Side', ''),
      url,
      description: hub.metaDescription.slice(0, 100) + '...',
      type: hub.type
    });
  });

  // Add main opportunities page
  links.push({
    title: 'Browse All Conservation Opportunities',
    url: '/opportunities',
    description: 'Explore all wildlife volunteer programs worldwide',
    type: 'related'
  });

  return links;
};

/**
 * Generate sitemap entry for content hub
 * @param hubData - Content hub data
 * @returns Sitemap entry object
 */
export const generateSitemapEntry = (hubData: ContentHubData) => ({
  url: hubData.type === 'animal' 
    ? `/${hubData.id}-volunteer`
    : `/volunteer-${hubData.id}`,
  lastModified: hubData.lastUpdated,
  changeFrequency: 'weekly' as const,
  priority: hubData.searchVolume > 1000 ? 0.8 : 0.7
});

/**
 * Validate SEO quality for content hub
 * @param seoData - Generated SEO data
 * @returns SEO quality score and recommendations
 */
export interface SEOValidation {
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
}

export const validateContentHubSEO = (seoData: ContentSEOData): SEOValidation => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Title validation
  if (seoData.title.length > 60) {
    issues.push('Title exceeds 60 characters');
    score -= 10;
  }
  if (seoData.title.length < 30) {
    issues.push('Title too short (under 30 characters)');
    score -= 10;
  }

  // Description validation
  if (seoData.description.length > 155) {
    issues.push('Meta description exceeds 155 characters');
    score -= 10;
  }
  if (seoData.description.length < 120) {
    recommendations.push('Consider expanding meta description to 120-155 characters');
  }

  // Keywords validation
  if (seoData.keywords.length < 5) {
    recommendations.push('Consider adding more relevant keywords');
  }

  // Structured data validation
  if (seoData.structuredData.length < 3) {
    issues.push('Insufficient structured data schemas');
    score -= 15;
  }

  // Image validation
  if (!seoData.openGraph.image) {
    issues.push('Missing OpenGraph image');
    score -= 10;
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
};

/**
 * React hook for applying content hub SEO
 * @param hubData - Content hub data
 * @param opportunities - Related opportunities
 */
export const useContentHubSEO = (
  hubData: ContentHubData | null,
  opportunities: Opportunity[] = []
) => {
  if (!hubData) return null;

  const seoData = generateContentHubSEO(hubData, opportunities);
  
  // Apply meta tags (implementation depends on your SEO library)
  if (typeof document !== 'undefined') {
    // Update document title
    document.title = seoData.title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoData.description);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonical);
  }

  return seoData;
};