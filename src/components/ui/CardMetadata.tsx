// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\CardMetadata.tsx

import React from 'react';
import { Clock, Calendar, Users, MapPin, Heart } from 'lucide-react';

interface CardMetadataProps {
  duration?: { min: number; max: number | null };
  animalTypes?: string[];
  location?: { city: string; country: string };
  volunteerCount?: number;
  cost?: { amount: number | null; currency: string; period: string };
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
  showIcons?: boolean;
  maxAnimalTypes?: number;
}

/**
 * Reusable Card Metadata Component
 * 
 * Displays opportunity metadata with flexible layouts
 * and consistent formatting across different contexts.
 */
const CardMetadata: React.FC<CardMetadataProps> = ({
  duration,
  animalTypes = [],
  location,
  volunteerCount,
  cost,
  variant = 'default',
  layout = 'horizontal',
  className = '',
  showIcons = true,
  maxAnimalTypes = 2
}) => {
  // Utility functions
  const formatDuration = (dur: { min: number; max: number | null }) => {
    return dur.max ? `${dur.min}-${dur.max} weeks` : `${dur.min}+ weeks`;
  };

  const formatCost = (costData: { amount: number | null; currency: string; period: string }) => {
    if (!costData.amount) return 'Ask us';
    return `${costData.currency}${costData.amount.toLocaleString()}`;
  };

  const formatVolunteers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k volunteers`;
    }
    return `${count} volunteers`;
  };

  // Style variants
  const getTextSize = () => {
    switch (variant) {
      case 'compact':
        return 'text-xs';
      case 'detailed':
        return 'text-base';
      case 'minimal':
        return 'text-xs';
      default:
        return 'text-sm';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 'w-3 h-3';
      case 'detailed':
        return 'w-5 h-5';
      case 'minimal':
        return 'w-3 h-3';
      default:
        return 'w-4 h-4';
    }
  };

  const getLayoutStyles = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-2';
      case 'grid':
        return 'grid grid-cols-2 gap-2';
      default:
        return 'flex items-center gap-4';
    }
  };

  // Metadata items
  const metadataItems = [];

  // Duration
  if (duration) {
    metadataItems.push({
      id: 'duration',
      icon: Clock,
      label: formatDuration(duration),
      ariaLabel: `Duration: ${formatDuration(duration)}`
    });
  }

  // Animal types
  if (animalTypes.length > 0) {
    const displayTypes = animalTypes.slice(0, maxAnimalTypes);
    const remainingCount = animalTypes.length - maxAnimalTypes;
    const typeText = displayTypes.join(', ') + 
      (remainingCount > 0 ? ` +${remainingCount} more` : '');
    
    metadataItems.push({
      id: 'animals',
      icon: Heart,
      label: typeText,
      ariaLabel: `Animal types: ${animalTypes.join(', ')}`
    });
  }

  // Location (for detailed variant)
  if (location && variant === 'detailed') {
    metadataItems.push({
      id: 'location',
      icon: MapPin,
      label: `${location.city}, ${location.country}`,
      ariaLabel: `Location: ${location.city}, ${location.country}`
    });
  }

  // Volunteer count
  if (volunteerCount && variant === 'detailed') {
    metadataItems.push({
      id: 'volunteers',
      icon: Users,
      label: formatVolunteers(volunteerCount),
      ariaLabel: `${volunteerCount} volunteers have participated`
    });
  }

  // Cost information
  if (cost && (variant === 'detailed' || variant === 'default')) {
    metadataItems.push({
      id: 'cost',
      icon: Calendar,
      label: `From ${formatCost(cost)}`,
      ariaLabel: `Cost: From ${formatCost(cost)} per ${cost.period}`
    });
  }

  return (
    <div 
      className={`
        ${getLayoutStyles()} ${getTextSize()} ${className}
        text-white/90 font-medium
      `}
      role="list"
      aria-label="Opportunity details"
    >
      {metadataItems.map((item, index) => {
        const IconComponent = item.icon;
        
        return (
          <div 
            key={item.id}
            className="flex items-center gap-2"
            role="listitem"
            aria-label={item.ariaLabel}
          >
            {showIcons && (
              <IconComponent 
                className={`${getIconSize()} flex-shrink-0`} 
                aria-hidden="true" 
              />
            )}
            <span className="truncate">
              {item.label}
            </span>
            
            {/* Separator for horizontal layout */}
            {layout === 'horizontal' && index < metadataItems.length - 1 && (
              <div 
                className="w-1 h-1 bg-white/60 rounded-full flex-shrink-0" 
                aria-hidden="true" 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardMetadata;