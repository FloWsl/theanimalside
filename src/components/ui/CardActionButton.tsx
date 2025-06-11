// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\CardActionButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Heart, Compass } from 'lucide-react';

interface CardActionButtonProps {
  isExplored: boolean;
  isActive: boolean;
  variant?: 'default' | 'compact' | 'prominent' | 'minimal';
  actionType?: 'explore' | 'view' | 'learn' | 'discover';
  iconType?: 'arrow' | 'external' | 'heart' | 'compass';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable Card Action Button
 * 
 * Provides consistent interaction patterns across different
 * card contexts with various visual treatments.
 */
const CardActionButton: React.FC<CardActionButtonProps> = ({
  isExplored,
  isActive,
  variant = 'default',
  actionType = 'explore',
  iconType = 'arrow',
  onClick,
  className = '',
  children
}) => {
  const IconComponent = {
    arrow: ArrowRight,
    external: ExternalLink,
    heart: Heart,
    compass: Compass
  }[iconType];

  const getActionText = () => {
    if (isExplored) {
      return {
        explore: 'Explore Again',
        view: 'View Again',
        learn: 'Learn More',
        discover: 'Rediscover'
      }[actionType];
    }
    
    return {
      explore: 'Touch & Discover',
      view: 'View Details',
      learn: 'Learn More',
      discover: 'Discover'
    }[actionType];
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-3 py-1.5 text-xs gap-1';
      case 'prominent':
        return 'px-6 py-3 text-base gap-3 shadow-lg hover:shadow-xl';
      case 'minimal':
        return 'px-2 py-1 text-xs gap-1 bg-white/10 border-white/20';
      default:
        return 'px-4 py-2 text-sm gap-2';
    }
  };

  const getHoverStyles = () => {
    return isActive 
      ? 'bg-white/35 border-white/50 shadow-md' 
      : 'bg-white/20 border-white/30';
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center backdrop-blur-sm rounded-full 
        border font-medium text-white transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98] focus:outline-none 
        focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
        ${getVariantStyles()} ${getHoverStyles()} ${className}
      `}
      whileHover={{ 
        backgroundColor: "rgba(255,255,255,0.35)",
        borderColor: "rgba(255,255,255,0.5)"
      }}
      whileTap={{ scale: 0.98 }}
      role="button"
      aria-label={
        isExplored 
          ? `View this opportunity again` 
          : `Learn more about this opportunity`
      }
      tabIndex={0}
    >
      {children || (
        <>
          <span className="font-medium">
            {getActionText()}
          </span>
          <IconComponent 
            className={`
              ${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'}
              transition-transform duration-200 group-hover:translate-x-0.5
            `} 
            aria-hidden="true" 
          />
        </>
      )}
    </motion.button>
  );
};

export default CardActionButton;