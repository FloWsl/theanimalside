import { useEffect } from 'react';
import { animalCategories } from '../data/animals';
import type { Opportunity, OrganizationDetail } from '../types';

// SEO Metadata Interface
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

// Hook to update document head with SEO metadata
export const useSEO = (metadata: SEOMetadata) => {
  useEffect(() => {
    // Update document title
    document.title = metadata.title;

    // Update meta description
    updateMetaTag('description', metadata.description);

    // Update meta keywords
    updateMetaTag('keywords', metadata.keywords.join(', '));

    // Update Open Graph tags
    updateMetaTag('og:title', metadata.ogTitle || metadata.title, 'property');
    updateMetaTag('og:description', metadata.ogDescription || metadata.description, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    if (metadata.ogImage) {
      updateMetaTag('og:image', metadata.ogImage, 'property');
    }

    // Update canonical URL
    if (metadata.canonicalUrl) {
      updateLinkTag('canonical', metadata.canonicalUrl);
    }

    // Add structured data
    if (metadata.structuredData) {
      addStructuredData(metadata.structuredData);
    }
  }, [metadata]);
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

// Helper function to update link tags
const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};

// Helper function to add structured data
const addStructuredData = (data: Record<string, any>) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

// SEO metadata generators for different page types

export const generateCountryPageSEO = (country: string, relatedOpportunities: Opportunity[]): SEOMetadata => {
  const formattedCountry = formatCountryName(country);
  const opportunityCount = relatedOpportunities.length;
  const animalTypes = [...new Set(relatedOpportunities.flatMap(opp => opp.animalTypes))];
  
  return {
    title: `Volunteer with Wildlife in ${formattedCountry} | ${opportunityCount}+ Conservation Programs | The Animal Side`,
    description: `Discover ${opportunityCount} wildlife conservation volunteer opportunities in ${formattedCountry}. Work with ${animalTypes.slice(0, 3).join(', ')} and more. Find your perfect conservation mission today.`,
    keywords: [
      `wildlife volunteer ${formattedCountry.toLowerCase()}`,
      `conservation volunteer ${formattedCountry.toLowerCase()}`,
      `animal rescue ${formattedCountry.toLowerCase()}`,
      ...animalTypes.map(type => `${type.toLowerCase()} volunteer`),
      'wildlife conservation',
      'volunteer abroad',
      'conservation programs'
    ],
    ogTitle: `Wildlife Volunteer Opportunities in ${formattedCountry}`,
    ogDescription: `Join ${opportunityCount} conservation programs working with ${animalTypes.slice(0, 2).join(' and ')} in ${formattedCountry}`,
    ogImage: relatedOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Wildlife Conservation Volunteers in ${formattedCountry}`,
      description: `Wildlife conservation volunteer opportunities in ${formattedCountry}`,
      url: window.location.href,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: opportunityCount,
        itemListElement: relatedOpportunities.slice(0, 5).map((opp, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'VolunteerOpportunity',
            name: opp.title,
            description: opp.description,
            location: {
              '@type': 'Place',
              name: `${opp.location.city}, ${opp.location.country}`,
              geo: {
                '@type': 'GeoCoordinates',
                latitude: opp.location.coordinates[0],
                longitude: opp.location.coordinates[1]
              }
            }
          }
        }))
      }
    }
  };
};

export const generateAnimalPageSEO = (animal: string, relatedOpportunities: Opportunity[]): SEOMetadata => {
  const formattedAnimal = formatAnimalName(animal);
  const opportunityCount = relatedOpportunities.length;
  const countries = [...new Set(relatedOpportunities.map(opp => opp.location.country))];
  const animalCategory = animalCategories.find(cat => cat.id === animal);
  
  return {
    title: `${formattedAnimal} Conservation Volunteer Programs | ${opportunityCount}+ Opportunities Worldwide | The Animal Side`,
    description: `Join ${formattedAnimal.toLowerCase()} conservation efforts across ${countries.length} countries. ${opportunityCount} volunteer programs in ${countries.slice(0, 3).join(', ')}. Make a difference for endangered ${formattedAnimal.toLowerCase()}s.`,
    keywords: [
      `${formattedAnimal.toLowerCase()} conservation volunteer`,
      `${formattedAnimal.toLowerCase()} rescue volunteer`,
      `${formattedAnimal.toLowerCase()} sanctuary volunteer`,
      'wildlife conservation',
      'endangered species',
      'conservation volunteer abroad',
      ...countries.map(country => `${formattedAnimal.toLowerCase()} volunteer ${country.toLowerCase()}`)
    ],
    ogTitle: `${formattedAnimal} Conservation Volunteer Programs`,
    ogDescription: `Help protect ${formattedAnimal.toLowerCase()}s through ${opportunityCount} volunteer programs in ${countries.slice(0, 2).join(' and ')}`,
    ogImage: animalCategory?.image || relatedOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${formattedAnimal} Conservation Volunteer Programs`,
      description: `Volunteer opportunities for ${formattedAnimal.toLowerCase()} conservation worldwide`,
      url: window.location.href,
      about: {
        '@type': 'Thing',
        name: formattedAnimal,
        description: animalCategory?.description || `Conservation efforts for ${formattedAnimal.toLowerCase()}s`
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: opportunityCount,
        itemListElement: relatedOpportunities.slice(0, 5).map((opp, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'VolunteerOpportunity',
            name: opp.title,
            description: opp.description,
            location: {
              '@type': 'Place',
              name: `${opp.location.city}, ${opp.location.country}`
            }
          }
        }))
      }
    }
  };
};

export const generateCombinedPageSEO = (country: string, animal: string, relatedOpportunities: Opportunity[]): SEOMetadata => {
  const formattedCountry = formatCountryName(country);
  const formattedAnimal = formatAnimalName(animal);
  const opportunityCount = relatedOpportunities.length;
  
  // Generate canonical URL - prefer country-animal format for SEO consistency
  const canonicalUrl = `${window.location.origin}/volunteer-${country}/${animal}`;
  
  return {
    title: `${formattedAnimal} Conservation Volunteer in ${formattedCountry} | ${opportunityCount} Programs | The Animal Side`,
    description: `${opportunityCount} ${formattedAnimal.toLowerCase()} conservation volunteer programs in ${formattedCountry}. Work directly with ${formattedAnimal.toLowerCase()}s while supporting local conservation efforts. Apply today.`,
    keywords: [
      `${formattedAnimal.toLowerCase()} volunteer ${formattedCountry.toLowerCase()}`,
      `${formattedAnimal.toLowerCase()} conservation ${formattedCountry.toLowerCase()}`,
      `wildlife volunteer ${formattedCountry.toLowerCase()}`,
      `${formattedAnimal.toLowerCase()} sanctuary ${formattedCountry.toLowerCase()}`,
      'conservation volunteer abroad',
      'wildlife rescue volunteer'
    ],
    canonicalUrl,
    ogTitle: `${formattedAnimal} Conservation Volunteer Programs in ${formattedCountry}`,
    ogDescription: `Join ${opportunityCount} specialized ${formattedAnimal.toLowerCase()} conservation programs in ${formattedCountry}`,
    ogImage: relatedOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${formattedAnimal} Conservation Volunteers in ${formattedCountry}`,
      description: `${formattedAnimal} conservation volunteer opportunities in ${formattedCountry}`,
      url: canonicalUrl,
      spatialCoverage: {
        '@type': 'Country',
        name: formattedCountry
      },
      about: {
        '@type': 'Thing',
        name: `${formattedAnimal} Conservation in ${formattedCountry}`
      }
    }
  };
};

/**
 * Determine canonical URL for combined pages to prevent duplicate content
 * Always use /volunteer-{country}/{animal} format as canonical
 */
export const generateCanonicalCombinedUrl = (country: string, animal: string): string => {
  return `${window.location.origin}/volunteer-${country}/${animal}`;
};

export const generateOrganizationPageSEO = (organization: OrganizationDetail): SEOMetadata => {
  const primaryProgram = organization.programs?.[0];
  const animalTypes = organization.animalTypes?.map(at => at.animalType) || [];
  
  return {
    title: `${organization.name} | ${organization.tagline} | Volunteer in ${organization.location.country} | The Animal Side`,
    description: `${organization.mission} Located in ${organization.location.city}, ${organization.location.country}. Work with ${animalTypes.slice(0, 3).join(', ')} and more. ${organization.verified ? 'Verified organization.' : ''}`,
    keywords: [
      organization.name.toLowerCase(),
      `volunteer ${organization.location.country.toLowerCase()}`,
      `wildlife volunteer ${organization.location.city.toLowerCase()}`,
      ...animalTypes.map(type => `${type.toLowerCase()} volunteer`),
      ...organization.tags || []
    ],
    ogTitle: `${organization.name} - ${organization.tagline}`,
    ogDescription: organization.mission,
    ogImage: organization.heroImage || organization.gallery?.images?.[0]?.url,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: organization.name,
      description: organization.mission,
      url: organization.website,
      logo: organization.logo,
      foundingDate: organization.yearFounded?.toString(),
      location: {
        '@type': 'Place',
        name: `${organization.location.city}, ${organization.location.country}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: organization.location.city,
          addressCountry: organization.location.country
        }
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: organization.email,
        telephone: organization.phone,
        contactType: 'Volunteer Inquiries'
      },
      ...(primaryProgram && {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Volunteer Programs',
          itemListElement: [{
            '@type': 'Offer',
            name: primaryProgram.title,
            description: primaryProgram.description,
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: primaryProgram.cost.amount,
              priceCurrency: primaryProgram.cost.currency
            }
          }]
        }
      })
    }
  };
};

// Helper functions for formatting names
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
  if (segment.endsWith('-conservation')) {
    segment = segment.replace('-conservation', '');
  }
  
  const animalMap: Record<string, string> = {
    'lions': 'Lion',
    'elephants': 'Elephant',
    'sea-turtles': 'Sea Turtle',
    'orangutans': 'Orangutan',
    'koalas': 'Koala',
    'tigers': 'Tiger',
    'pandas': 'Giant Panda',
    'rhinos': 'Rhino',
    'whales': 'Whale',
    'dolphins': 'Dolphin',
    'primates': 'Primate',
    'marine': 'Marine Life',
    'birds': 'Bird',
    'reptiles': 'Reptile'
  };
  
  return animalMap[segment] || segment.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};