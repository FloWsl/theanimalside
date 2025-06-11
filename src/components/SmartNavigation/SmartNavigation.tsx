import React, { useCallback, useMemo } from 'react';
import { useSmartNavigation, type TabId } from '../../hooks/useSmartNavigation';
import { OrganizationDetail } from '../../types';
import NavigationContainer from './NavigationContainer';
import NavigationCard from './NavigationCard';

interface SmartNavigationProps {
  organization: OrganizationDetail;
  currentTab: TabId;
  className?: string;
  variant?: 'sidebar' | 'inline' | 'footer';
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({
  organization,
  currentTab,
  className = '',
  variant = 'inline'
}) => {
  // Performance: Memoize navigation context with stable sessionData
  const navigationContext = useMemo(() => ({
    organization,
    currentTab,
    sessionData: {
      viewedOrganizations: [], // TODO: Get from session storage in future
      timeOnPage: 0, // Remove dynamic time calculation to prevent infinite updates
      referrerUrl: typeof document !== 'undefined' ? document.referrer : ''
    }
  }), [organization.id, currentTab]);

  const { recommendations } = useSmartNavigation(navigationContext);

  // Performance: Memoize click handler to prevent re-renders
  const handleNavigationClick = useCallback((recommendation: any) => {
    // Performance: Batch analytics calls
    requestIdleCallback(() => {
      // Track navigation click for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'smart_navigation_click', {
          recommendation_id: recommendation.id,
          category: recommendation.category,
          organization: organization.slug,
          tab: currentTab,
          timestamp: Date.now()
        });
      }
    });
    
    // SEO: Use proper navigation for better crawlability
    if (recommendation.url.startsWith('/')) {
      // Internal links - use proper navigation
      window.location.href = recommendation.url;
    } else {
      // External links - open in new tab with security
      window.open(recommendation.url, '_blank', 'noopener,noreferrer');
    }
  }, [organization.slug, currentTab]);

  // SEO: Generate structured data for recommendations
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Related Wildlife Conservation Opportunities",
    "description": "Similar wildlife conservation and volunteer opportunities",
    "numberOfItems": recommendations.length,
    "itemListElement": recommendations.map((rec, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": rec.title,
        "url": rec.url.startsWith('/') ? `${window.location.origin}${rec.url}` : rec.url,
        "description": rec.description || `Explore ${rec.title} conservation opportunities`
      }
    }))
  }), [recommendations]);

  // Early return if no recommendations
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <>
      {/* SEO: Inject structured data for better search visibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <NavigationContainer variant={variant} className={className}>
        {recommendations.slice(0, 4).map((rec) => (
          <NavigationCard
            key={rec.id}
            recommendation={rec}
            variant={variant}
            onClick={handleNavigationClick}
          />
        ))}
      </NavigationContainer>
    </>
  );
};


export default SmartNavigation;