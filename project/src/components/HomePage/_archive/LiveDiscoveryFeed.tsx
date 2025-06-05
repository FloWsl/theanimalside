// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\LiveDiscoveryFeed.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MapPin, Clock, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { opportunities } from '@/data/opportunities';
import { generateOpportunityURL } from '@/lib/search-utils';
import type { Opportunity } from '@/types';

/**
 * Live Discovery Feed Component
 * 
 * Features:
 * - Random selection of opportunities (equal treatment)
 * - Auto-rotating carousel every 5 seconds
 * - Responsive design: 3 cards desktop, 1 mobile
 * - Pause on hover, manual navigation
 * - Touch/swipe support for mobile
 * - Equal visual treatment for all opportunities
 */

interface LiveDiscoveryFeedProps {
  className?: string;
  onOpportunitySelect?: (opportunity: Opportunity) => void;
}

// Utility function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format duration for display
const formatDuration = (duration: { min: number; max: number | null }): string => {
  if (duration.max) {
    return `${duration.min}-${duration.max}w`;
  }
  return `${duration.min}w+`;
};

// Format cost for display
const formatCost = (cost: { amount: number | null; currency: string; period: string }): string => {
  if (!cost.amount) return 'Contact';
  if (cost.amount >= 1000) {
    return `${cost.currency}${(cost.amount / 1000).toFixed(1)}k`;
  }
  return `${cost.currency}${cost.amount}`;
};

const LiveDiscoveryFeed: React.FC<LiveDiscoveryFeedProps> = ({
  className = '',
  onOpportunitySelect
}) => {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [randomizedOpportunities, setRandomizedOpportunities] = useState<Opportunity[]>([]);
  const [direction, setDirection] = useState(0);
  
  // Refs
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive cards count
  const [cardsPerView, setCardsPerView] = useState(3);

  // Initialize randomized opportunities on mount
  useEffect(() => {
    const shuffled = shuffleArray([...opportunities]);
    setRandomizedOpportunities(shuffled.slice(0, 10)); // Show 10 random opportunities
  }, []);

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered && randomizedOpportunities.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % Math.max(1, randomizedOpportunities.length - cardsPerView + 1)
        );
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, randomizedOpportunities.length, cardsPerView]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % Math.max(1, randomizedOpportunities.length - cardsPerView + 1)
    );
  }, [randomizedOpportunities.length, cardsPerView]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 
        ? Math.max(0, randomizedOpportunities.length - cardsPerView) 
        : prevIndex - 1
    );
  }, [randomizedOpportunities.length, cardsPerView]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Touch/swipe handling
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrevious();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  }, [goToNext, goToPrevious]);

  // Handle opportunity click
  const handleOpportunityClick = (opportunity: Opportunity) => {
    const url = generateOpportunityURL('animal', opportunity.animalTypes[0].toLowerCase().replace(' ', '-'));
    window.open(url, '_blank');
    onOpportunitySelect?.(opportunity);
  };

  // Intersection Observer for performance (pause when not visible)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsAutoPlaying(false);
        } else {
          setIsAutoPlaying(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (randomizedOpportunities.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center text-[#2C392C]/60">
          <motion.div
            className="w-8 h-8 border-3 border-[#8B4513] border-t-transparent rounded-full mx-auto mb-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  const maxSlides = Math.max(1, randomizedOpportunities.length - cardsPerView + 1);

  return (
    <div 
      ref={containerRef}
      className={`relative h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-[#1a2e1a] mb-1">
            Live Activity
          </h3>
          <p className="text-sm text-[#2C392C]/70">
            Recent conservation opportunities
          </p>
        </div>
        
        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-2 rounded-lg bg-white/60 hover:bg-white/80 border border-[#F0E5D0]/60 transition-colors"
          aria-label={isAutoPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 text-[#8B4513]" />
          ) : (
            <Play className="w-4 h-4 text-[#8B4513]" />
          )}
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative h-80 overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-[#F0E5D0]/60">
        <motion.div
          className="flex h-full"
          animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 200,
            duration: 0.6
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ width: `${(randomizedOpportunities.length / cardsPerView) * 100}%` }}
        >
          {randomizedOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              className="flex-shrink-0 p-3"
              style={{ width: `${100 / randomizedOpportunities.length}%` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="h-full bg-white rounded-lg shadow-md border border-[#F0E5D0]/60 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg hover:border-[#87A96B]/40"
                onClick={() => handleOpportunityClick(opportunity)}
              >
                {/* Opportunity Image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={opportunity.images[0]}
                    alt={opportunity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Activity Indicator */}
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>

                {/* Opportunity Content */}
                <div className="p-3 space-y-2">
                  <h4 className="font-display text-sm font-bold text-[#1a2e1a] leading-tight line-clamp-2 group-hover:text-[#8B4513] transition-colors">
                    {opportunity.title}
                  </h4>

                  {/* Location & Duration */}
                  <div className="flex items-center justify-between text-xs text-[#2C392C]/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#87A96B]" />
                      <span>{opportunity.location.city}, {opportunity.location.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D2691E]" />
                      <span>{formatDuration(opportunity.duration)}</span>
                    </div>
                  </div>

                  {/* Animal Type Badges */}
                  <div className="flex flex-wrap gap-1">
                    {opportunity.animalTypes.slice(0, 2).map((animal, idx) => (
                      <Badge 
                        key={idx}
                        variant="animal"
                        className="text-xs px-2 py-0.5"
                      >
                        {animal}
                      </Badge>
                    ))}
                  </div>

                  {/* Organization & Cost */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F0E5D0]/60">
                    <span className="text-xs text-[#2C392C]/60 truncate">
                      {opportunity.organization}
                    </span>
                    <span className="text-xs font-bold text-[#8B4513]">
                      {formatCost(opportunity.cost)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        {maxSlides > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full border border-[#F0E5D0]/60 flex items-center justify-center transition-all hover:scale-110 z-10"
              aria-label="Previous opportunities"
            >
              <ChevronLeft className="w-4 h-4 text-[#8B4513]" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full border border-[#F0E5D0]/60 flex items-center justify-center transition-all hover:scale-110 z-10"
              aria-label="Next opportunities"
            >
              <ChevronRight className="w-4 h-4 text-[#8B4513]" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {maxSlides > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#8B4513] w-6'
                  : 'bg-[#8B4513]/30 hover:bg-[#8B4513]/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Footer Status */}
      <div className="mt-3 text-center">
        <p className="text-xs text-[#2C392C]/60">
          Showing {randomizedOpportunities.length} recent opportunities
          {isAutoPlaying && (
            <span className="ml-2 inline-flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Auto-updating
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LiveDiscoveryFeed;