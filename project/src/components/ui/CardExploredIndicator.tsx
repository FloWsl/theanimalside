// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\ui\CardExploredIndicator.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Eye } from 'lucide-react';

interface CardExploredIndicatorProps {
  isExplored: boolean;
  variant?: 'default' | 'minimal' | 'prominent';
  iconType?: 'sparkles' | 'check' | 'eye';
  className?: string;
  showLabel?: boolean;
}

/**
 * Reusable Explored State Indicator
 * 
 * Shows whether an opportunity has been previously explored
 * with various visual treatments.
 */
const CardExploredIndicator: React.FC<CardExploredIndicatorProps> = ({
  isExplored,
  variant = 'default',
  iconType = 'sparkles',
  className = '',
  showLabel = false
}) => {
  if (!isExplored) return null;

  const IconComponent = {
    sparkles: Sparkles,
    check: Check,
    eye: Eye
  }[iconType];

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'w-2 h-2 bg-sage-green rounded-full';
      case 'prominent':
        return 'w-8 h-8 bg-sage-green/20 backdrop-blur-sm rounded-full border border-sage-green/40';
      default:
        return 'w-6 h-6 bg-sage-green/30 backdrop-blur-sm rounded-full border border-sage-green/60';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'minimal':
        return null; // No icon for minimal variant
      case 'prominent':
        return 'w-4 h-4 text-sage-green';
      default:
        return 'w-3 h-3 text-sage-green';
    }
  };

  return (
    <motion.div 
      className={`
        inline-flex items-center justify-center shadow-sm
        ${getVariantStyles()} ${className}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: 0.1 
      }}
      aria-label="Previously explored"
      role="status"
    >
      {variant !== 'minimal' && IconComponent && (
        <IconComponent 
          className={`${getIconStyles()} fill-current`}
          aria-hidden="true"
        />
      )}
      
      {showLabel && (
        <span className="sr-only">
          This opportunity has been previously explored
        </span>
      )}
      
      {/* Enhanced screen reader content */}
      <span className="sr-only">
        Explored - This conservation opportunity has been viewed before
      </span>
    </motion.div>
  );
};

export default CardExploredIndicator;