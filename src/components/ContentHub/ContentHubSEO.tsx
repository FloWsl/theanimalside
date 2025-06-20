/**
 * Content Hub SEO Component
 * 
 * Applies SEO optimization including meta tags, structured data,
 * and OpenGraph tags for content hub pages. Uses React Helmet
 * for head management.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { ContentHubData } from '../../data/contentHubs';
import type { Opportunity } from '../../types';
import { generateContentHubSEO, validateContentHubSEO } from '../../utils/contentSEO';

interface ContentHubSEOProps {
  hubData: ContentHubData;
  opportunities?: Opportunity[];
}

const ContentHubSEO: React.FC<ContentHubSEOProps> = ({ 
  hubData, 
  opportunities = [] 
}) => {
  // Generate SEO data
  const seoData = React.useMemo(() => {
    return generateContentHubSEO(hubData, opportunities);
  }, [hubData, opportunities]);

  // Validate SEO quality (development only)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const validation = validateContentHubSEO(seoData);
      if (validation.issues.length > 0) {
        console.warn('SEO Issues for', hubData.id, validation.issues);
      }
      if (validation.recommendations.length > 0) {
        console.info('SEO Recommendations for', hubData.id, validation.recommendations);
      }
      console.log('SEO Score for', hubData.id, validation.score);
    }
  }, [seoData, hubData.id]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      <link rel="canonical" href={seoData.canonical} />
      
      {/* OpenGraph Tags */}
      <meta property="og:type" content={seoData.openGraph.type} />
      <meta property="og:title" content={seoData.openGraph.title} />
      <meta property="og:description" content={seoData.openGraph.description} />
      <meta property="og:image" content={seoData.openGraph.image} />
      <meta property="og:url" content={seoData.openGraph.url} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoData.twitterCard.card} />
      <meta name="twitter:title" content={seoData.twitterCard.title} />
      <meta name="twitter:description" content={seoData.twitterCard.description} />
      <meta name="twitter:image" content={seoData.twitterCard.image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Conservation-specific meta tags */}
      <meta name="subject" content="Wildlife Conservation Volunteering" />
      <meta name="classification" content="Conservation, Volunteering, Wildlife Protection" />
      <meta name="target" content="gap year students, conservation volunteers, wildlife enthusiasts" />
      
      {/* Article-specific tags for conservation content */}
      {hubData.conservation.lastReviewed && (
        <meta name="article:modified_time" content={hubData.conservation.lastReviewed} />
      )}
      <meta name="article:author" content="The Animal Side Conservation Team" />
      <meta name="article:section" content="Wildlife Conservation" />
      
      {/* Structured Data */}
      {seoData.structuredData.map((schema, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* Alternative language versions (future enhancement) */}
      <link rel="alternate" hrefLang="en" href={seoData.canonical} />
      
      {/* Preload critical resources */}
      <link 
        rel="preload" 
        as="image" 
        href={hubData.heroImage}
        media="(min-width: 768px)"
      />
    </Helmet>
  );
};

export default ContentHubSEO;