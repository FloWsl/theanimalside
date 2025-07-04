// src/components/OrganizationDetail/QuickInfoCards.tsx - Database-Integrated Version
import React from 'react';
import { 
  Heart, 
  MapPin, 
  DollarSign, 
  ChevronRight, 
  Star,
  Shield,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import CardMetadata from '../ui/CardMetadata';
import { useOrganizationOverview, useOrganizationPractical, useOrganizationLocation, useOrganizationStories, useOrganizationMedia } from '../../hooks/useOrganizationData';

interface QuickInfoCardsProps {
  organizationId: string;
  selectedProgramId?: string;
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'compact' | 'default' | 'detailed';
  maxCards?: number;
  className?: string;
}

/**
 * Enhanced QuickInfoCards component using CardMetadata patterns
 * Database-integrated version using React Query hooks for data fetching.
 * 
 * Displays contextual information cards with flexible variant system
 * and consistent styling following ui component architecture.
 * 
 * @param organizationId - Organization UUID
 * @param selectedProgramId - Currently selected program UUID
 * @param currentTab - Current active tab to avoid duplication
 * @param onTabChange - Function to handle tab navigation
 * @param variant - Display variant: 'compact' | 'default' | 'detailed'
 * @param maxCards - Maximum number of cards to display
 * @param className - Additional CSS classes
 */
const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({ 
  organizationId, 
  selectedProgramId, 
  currentTab,
  onTabChange,
  variant = 'default',
  maxCards = 4,
  className = ''
}) => {
  // Database hooks for different data sets
  const { data: overviewData, isLoading: overviewLoading } = useOrganizationOverview(organizationId);
  const { data: practicalData, isLoading: practicalLoading } = useOrganizationPractical(organizationId);
  const { data: locationData } = useOrganizationLocation(organizationId);
  const { data: storiesData } = useOrganizationStories(organizationId, { limit: 1 });
  const { data: mediaData } = useOrganizationMedia(organizationId, { category: 'gallery', limit: 3 });

  // Get the selected program or primary program
  const selectedProgram = selectedProgramId 
    ? practicalData?.primary_program // Need to extend this to get specific program by ID
    : overviewData?.primary_program || practicalData?.primary_program;

  // Loading state for any critical data
  const isLoading = overviewLoading || practicalLoading;

  // Card configuration based on variant
  const getCardVariant = () => {
    switch (variant) {
      case 'compact': return 'compact';
      case 'detailed': return 'detailed';
      default: return 'default';
    }
  };

  // Define available cards with their configurations
  const availableCards = [
    {
      id: 'cost',
      excludeTab: 'practical',
      icon: DollarSign,
      title: 'Quick Cost Info',
      colorScheme: 'rich-earth',
      tabTarget: 'practical',
      tabLabel: 'View full details'
    },
    {
      id: 'location',
      excludeTab: 'location',
      icon: MapPin,
      title: 'Location & Access',
      colorScheme: 'sage-green',
      tabTarget: 'location',
      tabLabel: 'View location details'
    },
    {
      id: 'experience',
      excludeTab: 'experience',
      icon: Heart,
      title: 'Experience Preview',
      colorScheme: 'warm-sunset',
      tabTarget: 'experience',
      tabLabel: 'Explore activities'
    },
    {
      id: 'trust',
      excludeTab: 'overview',
      icon: Shield,
      title: 'Trust & Verification',
      colorScheme: 'golden-hour',
      tabTarget: 'overview',
      tabLabel: 'View credentials'
    },
    {
      id: 'testimonial',
      excludeTab: 'stories',
      icon: Star,
      title: 'Volunteer Voice',
      colorScheme: 'deep-forest',
      tabTarget: 'stories',
      tabLabel: 'Read more stories',
      condition: () => storiesData && storiesData.testimonials.length > 0
    },
    {
      id: 'gallery',
      excludeTab: 'experience',
      icon: Camera,
      title: 'Experience Gallery',
      colorScheme: 'warm-beige',
      tabTarget: 'experience',
      tabLabel: 'View full gallery',
      condition: () => mediaData && mediaData.data.length > 0
    }
  ];

  // Filter cards based on current tab and conditions
  const visibleCards = availableCards.filter(card => {
    if (card.excludeTab === currentTab) return false;
    if (card.condition && !card.condition()) return false;
    return true;
  }).slice(0, maxCards);

  // Render individual card with CardMetadata patterns
  const renderCard = (cardConfig: typeof availableCards[0]) => {
    const Icon = cardConfig.icon;
    const cardVariant = getCardVariant();
    
    // Color scheme mapping
    const colorSchemes = {
      'rich-earth': {
        gradient: 'from-rich-earth/5 to-warm-sunset/5',
        border: 'border-rich-earth/20 hover:border-rich-earth/40',
        icon: 'text-rich-earth',
        accent: 'text-rich-earth hover:text-warm-sunset'
      },
      'sage-green': {
        gradient: 'from-sage-green/5 to-gentle-lemon/5',
        border: 'border-sage-green/20 hover:border-sage-green/40',
        icon: 'text-sage-green',
        accent: 'text-sage-green hover:text-warm-sunset'
      },
      'warm-sunset': {
        gradient: 'from-warm-sunset/5 to-golden-hour/5',
        border: 'border-warm-sunset/20 hover:border-warm-sunset/40',
        icon: 'text-warm-sunset',
        accent: 'text-warm-sunset hover:text-rich-earth'
      },
      'golden-hour': {
        gradient: 'from-gentle-lemon/5 to-soft-cream',
        border: 'border-golden-hour/20 hover:border-golden-hour/40',
        icon: 'text-golden-hour',
        accent: 'text-golden-hour hover:text-rich-earth'
      },
      'deep-forest': {
        gradient: 'from-deep-forest/5 to-sage-green/5',
        border: 'border-deep-forest/20 hover:border-sage-green/40',
        icon: 'text-golden-hour',
        accent: 'text-deep-forest hover:text-sage-green'
      },
      'warm-beige': {
        gradient: 'from-warm-beige to-soft-cream',
        border: 'border-warm-beige hover:border-warm-sunset/40',
        icon: 'text-warm-sunset',
        accent: 'text-warm-sunset hover:text-rich-earth'
      }
    };
    
    const colors = colorSchemes[cardConfig.colorScheme];
    
    return (
      <Card key={cardConfig.id} className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} transition-all duration-300`}>
        <CardHeader className={cardVariant === 'compact' ? 'pb-2' : 'pb-3'}>
          <CardTitle className={`${cardVariant === 'compact' ? 'text-base' : 'text-lg'} flex items-center gap-2 text-deep-forest`}>
            <Icon className={`${cardVariant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} ${colors.icon}`} />
            {cardConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent className={cardVariant === 'compact' ? 'space-y-2' : 'space-y-3'}>
          {renderCardContent(cardConfig, cardVariant)}
          {onTabChange && (
            <button
              onClick={() => onTabChange(cardConfig.tabTarget)}
              className={`w-full flex items-center justify-center gap-2 text-sm ${colors.accent} transition-colors py-2`}
            >
              {cardConfig.tabLabel} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </CardContent>
      </Card>
    );
  };

  // Early return if loading critical data
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: Math.min(maxCards, 3) }).map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-warm-beige/10 to-soft-cream animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-warm-beige/40 rounded-lg w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-warm-beige/30 rounded w-full"></div>
              <div className="h-4 bg-warm-beige/30 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Early return if no data available
  if (!overviewData?.organization || !selectedProgram) {
    return null;
  }

  // Render card-specific content using CardMetadata
  const renderCardContent = (cardConfig: typeof availableCards[0], cardVariant: string) => {
    switch (cardConfig.id) {
      case 'cost':
        return (
          <>
            <CardMetadata
              duration={{
                min: selectedProgram.duration_min_weeks,
                max: selectedProgram.duration_max_weeks
              }}
              cost={{
                amount: selectedProgram.cost_amount ? parseFloat(selectedProgram.cost_amount.toString()) : 0,
                currency: selectedProgram.cost_currency || 'USD'
              }}
              variant={cardVariant as 'default' | 'compact' | 'detailed' | 'minimal'}
              layout="grid"
              showIcons={false}
              className="text-deep-forest/80"
            />
            <div className="text-xs text-deep-forest/80">
              {practicalData?.program_inclusions?.slice(0, 2).map(inc => inc.inclusion_type).join(', ').toLowerCase()}
              {(practicalData?.program_inclusions?.length || 0) > 2 && ' + more'}
            </div>
          </>
        );
      
      case 'location':
        return (
          <>
            <CardMetadata
              location={{
                country: locationData?.organization.country || '',
                region: locationData?.organization.region || '',
                city: locationData?.organization.city || ''
              }}
              variant={cardVariant as 'default' | 'compact' | 'detailed' | 'minimal'}
              layout="vertical"
              showIcons={false}
              className="text-deep-forest/80"
            />
            <div className="text-xs text-deep-forest/80">
              Airport pickup: {locationData?.transportation?.airport_pickup ? 'Included' : 'Not included'}
            </div>
            {locationData?.organization.nearest_airport && (
              <div className="text-xs text-deep-forest/80">
                Nearest: {locationData.organization.nearest_airport}
              </div>
            )}
          </>
        );
      
      case 'experience':
        return (
          <>
            <CardMetadata
              animalTypes={overviewData?.organization.animal_types || []}
              variant={cardVariant as 'default' | 'compact' | 'detailed' | 'minimal'}
              layout="grid"
              showIcons={false}
              maxAnimalTypes={3}
              className="text-deep-forest/80"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-warm-sunset">
                  {selectedProgram.hours_per_day}h
                </div>
                <div className="text-xs text-deep-forest/70">daily work</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-golden-hour">
                  {overviewData?.organization.animal_types?.length || 0}
                </div>
                <div className="text-xs text-deep-forest/70">species</div>
              </div>
            </div>
          </>
        );
      
      case 'trust':
        return (
          <>
            <div className="flex items-center gap-2">
              {overviewData?.organization.verified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-sage-green/10 text-sage-green rounded-full text-xs">
                  <Shield className="w-3 h-3" />
                  Verified
                </div>
              )}
              <div className="text-sm text-deep-forest font-medium">
                Est. {overviewData?.organization.year_founded || 'N/A'}
              </div>
            </div>
            <CardMetadata
              volunteerCount={overviewData?.statistics?.volunteers_hosted || 0}
              variant={cardVariant as 'default' | 'compact' | 'detailed' | 'minimal'}
              layout="vertical"
              showIcons={false}
              className="text-deep-forest/80"
            />
            <div className="text-xs text-deep-forest/80">
              {overviewData?.organization.certifications?.length || 0} official certification{(overviewData?.organization.certifications?.length || 0) > 1 ? 's' : ''}
            </div>
          </>
        );
      
      case 'testimonial': {
        const testimonial = storiesData?.testimonials[0];
        if (!testimonial) return null;
        return (
          <>
            <div className="text-sm text-deep-forest italic leading-relaxed">
              "{testimonial.content.slice(0, 120)}{testimonial.content.length > 120 ? '...' : ''}"
            </div>
            <div className="text-xs text-deep-forest/70">
              — {testimonial.volunteer_name}, {testimonial.volunteer_country}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-golden-hour text-golden-hour" />
              ))}
            </div>
          </>
        );
      }
      
      case 'gallery':
        if (!mediaData?.data.length) return null;
        return (
          <>
            <div className="grid grid-cols-3 gap-2">
              {mediaData.data.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image.file_url} 
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-deep-forest/80 text-center">
              {mediaData.count} media items
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Early return if no cards to show
  if (visibleCards.length === 0) {
    return (
      <div className={`p-4 bg-warm-beige/20 rounded-xl border border-sage-green/20 text-center ${className}`}>
        <p className="text-sm text-deep-forest/70">
          Explore other tabs for more detailed information about this organization.
        </p>
      </div>
    );
  }

  const getGridCols = () => {
    const cardCount = Math.min(visibleCards.length, 3);
    if (cardCount === 1) return 'grid-cols-1';
    if (cardCount === 2) return 'md:grid-cols-2';
    return 'md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className={`grid gap-4 ${getGridCols()} ${className}`}>
      {visibleCards.map(renderCard)}
    </div>
  );
};

export default QuickInfoCards;