// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\index.tsx

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SimplifiedStoryMap from './SimplifiedStoryMap';
import SearchFreeDiscoveryHeader from './SearchFreeDiscoveryHeader';
import type { AnimalLocation } from '@/lib/animal-coordinates';

/**
 * KISS Discovery Gateway - Mobile-First Contained Design
 * 
 * Simple, contained map that doesn't dominate viewport:
 * - Contained map with reasonable heights (250px mobile → 350px desktop)
 * - Clear visual separation between sections
 * - Mobile-first responsive design that scrolls naturally
 * - Map is one section, not the whole experience
 */

interface DiscoveryGatewayProps {
  className?: string;
  onLocationSelect?: (location: AnimalLocation) => void;
}

const DiscoveryGateway: React.FC<DiscoveryGatewayProps> = ({ 
  className = '',
  onLocationSelect
}) => {
  // State for inter-component communication
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Enhanced header handlers
  const handleAnimalSelect = (animalId: string) => {
    setSelectedAnimal(animalId);
  };  // 

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Simple motion patterns
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={ref}
      className={`py-8 bg-gradient-to-br from-[#FDF8F0] via-[#FAF3D7]/20 to-[#F0E5D0]/30 ${className}`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div 
          variants={sectionVariants}
          className="container mx-auto px-6 lg:px-12 max-w-6xl"
        >
          <SearchFreeDiscoveryHeader 
            onAnimalSelect={handleAnimalSelect}
            selectedAnimal={selectedAnimal}
            className=""
          />
        </motion.div>

        {/* Map Section - Contained & Reasonable Size */}
        <motion.div 
          variants={sectionVariants}
          className="container mx-auto px-6 lg:px-12 max-w-4xl"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-[#F0E5D0]/40 shadow-lg">
            <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] relative overflow-hidden rounded-xl">
              <SimplifiedStoryMap 
                className="w-full h-full relative z-10"
                selectedAnimal={selectedAnimal}
                onLocationSelect={onLocationSelect}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default DiscoveryGateway;