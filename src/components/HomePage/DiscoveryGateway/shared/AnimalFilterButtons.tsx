// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\shared\AnimalFilterButtons.tsx

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAnimalCategoriesFromStats } from '@/hooks/useStatistics';
// import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';

/**
 * Enhanced Animal Filter Buttons Component
 * 
 * Premium visual discovery experience with larger cards and beautiful imagery.
 * Optimized for award-winning user engagement and exploration.
 * 
 * Features:
 * - Larger, more engaging card layout with high-quality images
 * - Beautiful Unsplash placeholder images for each animal type
 * - Enhanced hover effects and micro-interactions
 * - Responsive design optimized for all devices
 * - Maintains earth-tone styling with premium polish
 * - Accessibility optimized with proper ARIA labels
 * - Performance optimized with lazy loading
 */

interface AnimalFilterButtonsProps {
  onAnimalSelect: (animalId: string) => void;
  className?: string;
  maxAnimals?: number;
  showProjectCounts?: boolean;
  selectedAnimal?: string | null;
}

const AnimalFilterButtons: React.FC<AnimalFilterButtonsProps> = ({
  onAnimalSelect,
  className = '',
  maxAnimals = 5,
  showProjectCounts = true,
  selectedAnimal = null
}) => {
  const [hoveredAnimal, setHoveredAnimal] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  // Enhanced animation variants for premium feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        damping: 20
      }
    }
  };

  // Enhanced formatting utilities
  const formatCount = (count: number): string => {
    if (count >= 100) {
      return `${Math.floor(count / 10) * 10}+`;
    }
    return count.toString();
  };

  // High-quality animal images from Unsplash
  const getAnimalImage = (animalId: string): string => {
    const imageMap: Record<string, string> = {
      'lions': 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'elephants': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'sea-turtles': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'orangutans': 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'koalas': 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };
    return imageMap[animalId] || imageMap['lions'];
  };

  // Handle image loading errors
  const handleImageError = (animalId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(animalId));
  };

  // Get dynamic animal data from database with React Query caching
  const animalCategories = useAnimalCategoriesFromStats();

  // Enhanced animal selection with visual feedback
  const handleAnimalClick = (animal: typeof animalCategories[0]) => {
    onAnimalSelect(animal.id);
    
    // Add haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Get animals to display (limit for header usage)
  const displayAnimals = animalCategories.slice(0, maxAnimals);

  return (
    <div 
      ref={ref}
      className={`w-full ${className}`}
    >
      {/* Horizontal Animal Filter Grid - Optimized for Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto"
      >
        {displayAnimals.map((animal) => {
          const isHovered = hoveredAnimal === animal.id;
          const isSelected = selectedAnimal === animal.id;
          const hasImageError = imageLoadErrors.has(animal.id);
          
          return (
            <motion.div
              key={animal.id}
              variants={cardVariants}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredAnimal(animal.id)}
              onMouseLeave={() => setHoveredAnimal(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleAnimalClick(animal)}
                className={`relative w-full bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 group-hover:shadow-2xl min-h-[140px] md:min-h-[180px] flex flex-col ${
                  isSelected 
                    ? 'border-[#8B4513] shadow-xl ring-2 ring-[#8B4513]/30' 
                    : 'border-[#F0E5D0]/60 group-hover:border-[#87A96B]/60'
                }`}
                aria-label={`Filter by ${animal.name} - ${animal.projects} projects available`}
                role="button"
                tabIndex={0}
              >
                {/* Animal Image */}
                <div className="relative w-full h-20 md:h-28 overflow-hidden">
                  {!hasImageError ? (
                    <img
                      src={getAnimalImage(animal.id)}
                      alt={`${animal.name} in their natural habitat`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={() => handleImageError(animal.id)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: animal.bgColor }}
                    >
                      {animal.id === 'lions' && '🦁'}
                      {animal.id === 'elephants' && '🐘'}
                      {animal.id === 'sea-turtles' && '🐢'}
                      {animal.id === 'orangutans' && '🦧'}
                      {animal.id === 'koalas' && '🐨'}
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-[#8B4513] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Star className="w-3 h-3 text-white fill-current" />
                    </motion.div>
                  )}
                  
                  {/* Trending Badge */}
                  {animal.trending && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#D2691E]/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                  {/* Animal Name */}
                  <div className="text-center mb-2">
                    <h3 className={`font-display text-base md:text-lg font-bold leading-tight transition-colors duration-300 ${
                      isSelected ? 'text-[#8B4513]' : 'text-[#1a2e1a] group-hover:text-[#8B4513]'
                    }`}>
                      {animal.name}
                    </h3>
                  </div>
                  
                  {/* Project Count & Stats */}
                  {showProjectCounts && (
                    <div className="text-center space-y-1">
                      <div className="text-sm font-semibold" style={{ color: animal.color }}>
                        {formatCount(animal.projects)} projects
                      </div>
                      <div className="text-xs text-[#2C392C]/60">
                        {animal.countries} countries
                      </div>
                    </div>
                  )}
                </div>

                {/* Color Accent - Enhanced */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ${
                    isSelected ? 'opacity-100' : isHovered ? 'opacity-80' : 'opacity-30'
                  }`}
                  style={{ backgroundColor: animal.color }}
                />
                
                {/* Hover Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AnimalFilterButtons;