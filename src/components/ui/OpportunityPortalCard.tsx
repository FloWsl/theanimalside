import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import type { Opportunity } from '@/types';

/**
 * OpportunityPortalCard - A Modular Living Portal Component
 * 
 * Each card is a breathing portal that can be reused across the application.
 * Maintains the mystical, dreamlike aesthetic while providing flexible variants.
 */

export interface OpportunityPortalCardProps {
  opportunity: Opportunity;
  index: number;
  onExplore?: (opportunity: Opportunity) => void;
  variant?: 'default' | 'compact' | 'featured';
  isActive?: boolean;
  isExplored?: boolean;
  onHover?: (id: string | null) => void;
}


const formatDuration = (duration: { min: number; max: number | null }) => {
  return duration.max ? `${duration.min}-${duration.max} weeks` : `${duration.min}+ weeks`;
};

const formatCost = (cost: { amount: number | null; currency: string; period: string }) => {
  if (!cost.amount) return 'Ask us';
  return `${cost.currency} ${cost.amount.toLocaleString()}`;
};

const OpportunityPortalCard: React.FC<OpportunityPortalCardProps> = ({
  opportunity,
  index,
  onExplore,
  variant = 'default',
  isActive = false,
  isExplored = false,
  onHover
}) => {
  const [localActive, setLocalActive] = useState(false);
  const [localExplored, setLocalExplored] = useState(false);
  
  // Use props or local state for flexibility
  const cardIsActive = isActive || localActive;
  const cardIsExplored = isExplored || localExplored;


  const handleCardExplore = () => {
    setLocalExplored(true);
    onExplore?.(opportunity);
  };

  const handleMouseEnter = () => {
    setLocalActive(true);
    onHover?.(opportunity.id);
  };

  const handleMouseLeave = () => {
    setLocalActive(false);
    onHover?.(null);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: 45
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Variant-specific sizing
  const getCardHeight = () => {
    switch (variant) {
      case 'compact': return 'h-80';
      case 'featured': return 'h-[32rem]';
      default: return 'h-96 sm:h-[28rem]';
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'compact': return 'text-xl sm:text-2xl';
      case 'featured': return 'text-3xl sm:text-4xl';
      default: return 'text-2xl sm:text-3xl';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group cursor-pointer perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardExplore}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: -5,
        z: 50
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="article"
      aria-label={`${opportunity.title} conservation opportunity`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardExplore();
        }
      }}
    >
      {/* Living Portal Card */}
      <div className={`
        relative ${getCardHeight()} rounded-3xl overflow-hidden transform-gpu
        transition-all duration-1000 ease-out
        ${cardIsActive ? 'shadow-2xl ring-2 ring-[#8B4513]/20' : 'shadow-xl'}
        ${cardIsExplored ? 'ring-2 ring-[#87A96B]/30' : ''}
        focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2
      `}>

        {/* Magical Background Layer */}
        <div className="absolute inset-0">
          <img 
            src={opportunity.images[0]}
            alt={`Conservation work in ${opportunity.location.country}`}
            className={`
              w-full h-full object-cover transition-all duration-2000 ease-out
              ${cardIsActive ? 'scale-125 brightness-110 contrast-110' : 'scale-110'}
              ${cardIsExplored ? 'hue-rotate-15 saturate-110' : ''}
            `}
            loading="lazy"
          />

          {/* Breathing overlay that responds to interaction */}
          <motion.div
            className="absolute inset-0 transition-all duration-1000"
            animate={{
              background: cardIsActive 
                ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(245, 232, 212, 0.2), transparent)'
                : 'linear-gradient(135deg, rgba(26, 46, 26, 0.6), rgba(44, 57, 44, 0.4), transparent)'
            }}
          />

        </div>

        {/* Mystical compass indicator */}
        <CardElementIcon 
          element={cardIsExplored ? 'explored' : 'compass'}
          isActive={cardIsActive}
          variant={variant}
        />

        {/* Whispered location */}
        <motion.div 
          className="absolute top-6 left-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ 
            x: cardIsActive ? 0 : -10, 
            opacity: cardIsActive ? 1 : 0.7 
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-[#F5E8D4]/80 backdrop-blur-lg rounded-full px-4 py-2 border border-[#8B4513]/30">
            <MapPin className="w-4 h-4 text-[#8B4513]" />
            <span className="text-sm font-medium text-[#1a2e1a]">
              {opportunity.location.country}
            </span>
          </div>
        </motion.div>

        {/* Revealing content from the depths */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">

          {/* Title emerges like a revelation */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: cardIsActive ? 0 : 20, 
              opacity: cardIsActive ? 1 : 0.9 
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-4"
          >
            <h3 className={`${getTextSize()} font-medium text-white mb-3 leading-tight line-clamp-2 drop-shadow-lg`}>
              {opportunity.title.split(' ').slice(0, 5).join(' ')}
              {opportunity.title.split(' ').length > 5 && '...'}
            </h3>

            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(opportunity.duration)}</span>
              </div>
              <motion.div 
                className="w-1 h-1 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium">{opportunity.animalTypes[0]}</span>
            </div>
          </motion.div>

          {/* Interactive revelation */}
          <CardInteractionHint 
            isActive={cardIsActive}
            isExplored={cardIsExplored}
            cost={opportunity.cost}
            variant={variant}
          />
        </div>

        {/* Magical ripple when explored */}
        {cardIsExplored && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="w-full h-full bg-gradient-radial from-[#87A96B]/40 via-[#FCF59E]/20 to-transparent rounded-3xl"></div>
          </motion.div>
        )}

        {/* Living border that breathes */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none border-2"
          animate={{
            borderColor: cardIsActive 
              ? ["rgba(139,69,19,0.3)", "rgba(210,105,30,0.6)", "rgba(139,69,19,0.3)"]
              : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Screen reader content */}
      <span className="sr-only">
        {opportunity.title} in {opportunity.location.country}. 
        Duration: {formatDuration(opportunity.duration)}. 
        Investment: {formatCost(opportunity.cost)}. 
        Working with: {opportunity.animalTypes.join(', ')}.
        Click to learn more about this conservation opportunity.
      </span>
    </motion.div>
  );
};

// Supporting utility component for element icons
export const CardElementIcon: React.FC<{ 
  element: string; 
  isActive: boolean; 
  variant?: string;
}> = ({ element, isActive, variant = 'default' }) => {
  const iconSize = variant === 'compact' ? 'w-12 h-12' : 'w-14 h-14';
  
  return (
    <div className="absolute top-6 right-6">
      <motion.div 
        className={`
          ${iconSize} rounded-full backdrop-blur-lg flex items-center justify-center
          transition-all duration-700 border-2
          ${isActive 
            ? 'bg-[#F5E8D4]/90 border-[#8B4513]/60 shadow-xl' 
            : 'bg-white/20 border-white/40'
          }
          ${element === 'explored' ? 'bg-[#87A96B]/30 border-[#87A96B]/60' : ''}
        `}
        animate={{ 
          rotate: isActive ? [0, 180, 360] : 0,
          scale: isActive ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          rotate: { duration: 3, ease: "easeInOut" },
          scale: { duration: 1.5, ease: "easeInOut" }
        }}
      >
        {element === 'explored' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Sparkles className="w-6 h-6 text-[#87A96B] fill-current" />
          </motion.div>
        ) : (
          <motion.div
            animate={{ 
              rotateY: isActive ? [0, 180, 360] : 0 
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Navigation className={`w-6 h-6 transition-colors duration-500 ${
              isActive ? 'text-[#8B4513]' : 'text-white'
            }`} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Supporting utility component for interaction hints
export const CardInteractionHint: React.FC<{ 
  isActive: boolean; 
  isExplored: boolean; 
  cost: { amount: number | null; currency: string; period: string };
  variant?: string;
}> = ({ isActive, isExplored, cost, variant = 'default' }) => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ 
        y: isActive ? 0 : 30, 
        opacity: isActive ? 1 : 0 
      }}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      className="flex items-center justify-between"
    >
      <div className="text-white/95">
        <motion.div 
          className="text-sm font-medium text-[#FCF59E] mb-1"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Starting from
        </motion.div>
        <div className={`${variant === 'compact' ? 'text-base' : 'text-lg'} font-semibold drop-shadow-sm`}>
          {formatCost(cost)}
        </div>
      </div>

      <motion.div 
        className="flex items-center gap-3 bg-white/25 backdrop-blur-lg rounded-full px-5 py-3 border border-white/40"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.35)" }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} font-medium text-white`}>
          {isExplored ? 'Explore Again' : 'Touch & Discover'}
        </span>
        <motion.div
          animate={{ x: isActive ? [0, 5, 0] : 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OpportunityPortalCard;