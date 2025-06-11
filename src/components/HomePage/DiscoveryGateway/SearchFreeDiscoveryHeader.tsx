// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\SearchFreeDiscoveryHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Sparkles } from 'lucide-react';
import AnimalFilterButtons from './shared/AnimalFilterButtons';

/**
 * Search-Free Discovery Header Component
 * 
 * Focuses purely on exploration without search functionality. This component combines
 * emotional positioning with animal filter buttons to provide a clear, confusion-free
 * discovery experience that eliminates search redundancy with the Hero section.
 * 
 * Key Features:
 * - Emotional headline encouraging exploration
 * - Integrated animal filter buttons (no search)
 * - Clean, focused user experience
 * - Maintains existing design system and animations
 * - Height optimized for Discovery section (~120px)
 */

interface SearchFreeDiscoveryHeaderProps {
  onAnimalSelect: (animalId: string) => void;
  selectedAnimal?: string | null;
  className?: string;
}

const SearchFreeDiscoveryHeader: React.FC<SearchFreeDiscoveryHeaderProps> = ({
  onAnimalSelect,
  selectedAnimal = null,
  className = ''
}) => {
  // Animation variants consistent with existing headers
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div 
      className={`text-center space-y-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: '120px' }}
    >
      {/* Emotional Discovery Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1a2e1a] font-bold leading-tight">
          Where Will Your{' '}
          <span className="relative">
            <span className="text-gradient-nature">Conservation Journey</span>
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#8B4513]/30 via-[#D2691E]/50 to-[#DAA520]/30 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
          {' '}Begin?
        </h2>
        
        <p className="text-[#2C392C]/70 text-xl max-w-3xl mx-auto leading-relaxed">
          Discover authentic wildlife conservation opportunities
        </p>
      </motion.div>

      {/* Animal Filter Buttons Integration */}
      <motion.div 
        variants={itemVariants}
        className="max-w-4xl mx-auto"
      >
        <AnimalFilterButtons 
          onAnimalSelect={onAnimalSelect}
          selectedAnimal={selectedAnimal}
          maxAnimals={5}
          showProjectCounts={true}
          className=""
        />
      </motion.div>

      {/* Trust Indicators - Simplified Version */}
      <motion.div 
        className="flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-[#2C392C]/60 pt-1"
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#87A96B]" />
          <span>200+ verified locations</span>
        </div>
        <div className="hidden sm:block w-1 h-1 bg-[#87A96B]/40 rounded-full" />
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 md:w-4 md:h-4 text-[#D2691E]" />
          <span>Ethical conservation only</span>
        </div>
        <div className="hidden md:block w-1 h-1 bg-[#87A96B]/40 rounded-full" />
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#DAA520]" />
          <span>Life-changing experiences</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchFreeDiscoveryHeader;