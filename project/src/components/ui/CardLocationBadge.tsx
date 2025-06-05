// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\CardLocationBadge.tsx

import React from 'react';
import { MapPin } from 'lucide-react';

interface CardLocationBadgeProps {
  country: string;
  city?: string;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

/**
 * Reusable Location Badge Component
 * 
 * Displays location information with consistent styling
 * across different card contexts.
 */
const CardLocationBadge: React.FC<CardLocationBadgeProps> = ({
  country,
  city,
  variant = 'default',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-2 py-1 text-xs';
      case 'minimal':
        return 'px-3 py-1 text-xs bg-white/70';
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const displayText = city ? `${city}, ${country}` : country;

  return (
    <div 
      className={`
        inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm 
        rounded-full shadow-sm border border-white/20 font-medium text-deep-forest
        transition-all duration-200 hover:bg-white/95 hover:shadow-md
        ${getVariantStyles()} ${className}
      `}
      role="text"
      aria-label={`Location: ${displayText}`}
    >
      <MapPin 
        className={`text-rich-earth ${variant === 'compact' ? 'w-3 h-3' : 'w-3 h-3'}`} 
        aria-hidden="true" 
      />
      <span className="truncate max-w-32">
        {displayText}
      </span>
    </div>
  );
};

export default CardLocationBadge;