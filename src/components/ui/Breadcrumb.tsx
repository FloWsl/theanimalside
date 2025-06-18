import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-forest/40 mx-2" />
            )}
            {item.current ? (
              <span className="text-deep-forest font-medium" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-forest/70 hover:text-deep-forest transition-colors duration-200"
              >
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-forest/70">
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Utility function to generate breadcrumbs based on current route
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    // Handle different route patterns
    if (pathSegments.length === 0) {
      return [{ label: 'Home', current: true }];
    }

    // Legacy organization route: /organization/{slug}
    if (pathSegments[0] === 'organization' && pathSegments[1]) {
      breadcrumbs.push(
        { label: 'Organizations', href: '/opportunities' },
        { label: formatOrganizationName(pathSegments[1]), current: true }
      );
      return breadcrumbs;
    }

    // Opportunities page: /opportunities
    if (pathSegments[0] === 'opportunities') {
      breadcrumbs.push({ label: 'Opportunities', current: true });
      return breadcrumbs;
    }

    // Country landing: /volunteer-{country}
    if (pathSegments[0]?.startsWith('volunteer-') && pathSegments.length === 1) {
      const country = formatCountryName(pathSegments[0]);
      breadcrumbs.push({ label: `Volunteer in ${country}`, current: true });
      return breadcrumbs;
    }

    // Animal landing: /{animal}-volunteer
    if (pathSegments[0]?.endsWith('-volunteer') && pathSegments.length === 1) {
      const animal = formatAnimalName(pathSegments[0]);
      breadcrumbs.push({ label: `${animal} Conservation`, current: true });
      return breadcrumbs;
    }

    // Conservation category: /{category}-conservation
    if (pathSegments[0]?.endsWith('-conservation') && pathSegments.length === 1) {
      const category = formatCategoryName(pathSegments[0]);
      breadcrumbs.push({ label: `${category} Conservation`, current: true });
      return breadcrumbs;
    }

    // Combined routes: /volunteer-{country}/{animal} or /{animal}-volunteer/{country}
    if (pathSegments.length === 2) {
      if (pathSegments[0]?.startsWith('volunteer-')) {
        const country = formatCountryName(pathSegments[0]);
        const animal = formatAnimalName(pathSegments[1]);
        breadcrumbs.push(
          { label: `Volunteer in ${country}`, href: `/${pathSegments[0]}` },
          { label: `${animal} Programs`, current: true }
        );
      } else if (pathSegments[0]?.endsWith('-volunteer')) {
        const animal = formatAnimalName(pathSegments[0]);
        const country = formatCountryName(`volunteer-${pathSegments[1]}`);
        breadcrumbs.push(
          { label: `${animal} Conservation`, href: `/${pathSegments[0]}` },
          { label: `Programs in ${country}`, current: true }
        );
      }
      return breadcrumbs;
    }

    // Flat organization page: /{orgSlug}
    if (pathSegments.length === 1) {
      breadcrumbs.push({ label: formatOrganizationName(pathSegments[0]), current: true });
      return breadcrumbs;
    }

    // Default fallback
    breadcrumbs.push({ label: 'Page', current: true });
    return breadcrumbs;
  };

  return generateBreadcrumbs();
};

// Helper functions to format names from URL segments
const formatCountryName = (segment: string): string => {
  if (segment.startsWith('volunteer-')) {
    segment = segment.replace('volunteer-', '');
  }
  
  const countryMap: Record<string, string> = {
    'costa-rica': 'Costa Rica',
    'south-africa': 'South Africa',
    'thailand': 'Thailand',
    'australia': 'Australia',
    'indonesia': 'Indonesia',
    'kenya': 'Kenya',
    'ecuador': 'Ecuador',
    'peru': 'Peru',
    'brazil': 'Brazil',
    'india': 'India'
  };
  
  return countryMap[segment] || segment.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatAnimalName = (segment: string): string => {
  if (segment.endsWith('-volunteer')) {
    segment = segment.replace('-volunteer', '');
  }
  
  const animalMap: Record<string, string> = {
    'lions': 'Lion',
    'elephants': 'Elephant',
    'sea-turtles': 'Sea Turtle',
    'orangutans': 'Orangutan',
    'koalas': 'Koala',
    'tigers': 'Tiger',
    'pandas': 'Panda',
    'rhinos': 'Rhino',
    'whales': 'Whale',
    'dolphins': 'Dolphin',
    'primates': 'Primate',
    'marine': 'Marine Life'
  };
  
  return animalMap[segment] || segment.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatCategoryName = (segment: string): string => {
  if (segment.endsWith('-conservation')) {
    segment = segment.replace('-conservation', '');
  }
  
  return segment.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatOrganizationName = (slug: string): string => {
  // This would ideally fetch from data, but for breadcrumbs we'll format the slug
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default Breadcrumb;