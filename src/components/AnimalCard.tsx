// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\AnimalCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimalIllustration from './illustrations/AnimalIllustration';
import type { AnimalCategory } from '@/data/animals';

interface AnimalCardProps {
  animal: AnimalCategory;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  variant?: 'default' | 'compact' | 'featured';
}

const AnimalCard: React.FC<AnimalCardProps> = ({ 
  animal, 
  index, 
  isHovered, 
  onHover, 
  variant = 'default' 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.1
      }
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        className="flex-shrink-0 w-72 group cursor-pointer"
        onMouseEnter={() => onHover(animal.id)}
        onMouseLeave={() => onHover(null)}
      >
        <Link to={`/opportunities?animal=${animal.id}`}>
          <div className="relative h-80 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-500 group-hover:shadow-2xl group-hover:transform group-hover:scale-[1.02]">
            {/* Illustration Header */}
            <div className="relative h-32 flex items-center justify-center" style={{ backgroundColor: animal.bgColor }}>
              <AnimalIllustration 
                variant={animal.illustration} 
                className="w-20 h-20 transition-transform duration-700 group-hover:scale-110" 
              />
              
              {animal.trending && (
                <div className="absolute top-3 right-3 bg-[#D2691E]/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Hot
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-display text-xl text-[#1a2e1a] font-bold mb-1 group-hover:text-[#8B4513] transition-colors">
                  {animal.name}
                </h3>
                <p className="text-[#2C392C]/70 text-sm leading-relaxed">
                  {animal.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-lg font-bold font-display" style={{ color: animal.color }}>
                    {animal.projects}
                  </p>
                  <p className="text-xs text-[#2C392C]/60 font-medium">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold font-display" style={{ color: animal.color }}>
                    {formatNumber(animal.volunteers)}
                  </p>
                  <p className="text-xs text-[#2C392C]/60 font-medium">Volunteers</p>
                </div>
              </div>
            </div>

            {/* Color Accent */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
              style={{ 
                backgroundColor: animal.color,
                opacity: isHovered ? 1 : 0.3
              }}
            />
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      className="flex-shrink-0 w-80 group cursor-pointer"
      onMouseEnter={() => onHover(animal.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link to={`/opportunities?animal=${animal.id}`}>
        <div className="relative h-[420px] bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/20 transition-all duration-500 group-hover:shadow-2xl group-hover:transform group-hover:scale-[1.02] group-hover:border-white/40">
          {/* Image Header */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={animal.image}
              alt={`${animal.name} conservation`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Trending Badge */}
            {animal.trending && (
              <div className="absolute top-4 right-4 bg-[#D2691E]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending
              </div>
            )}
            
            {/* Animal Illustration Overlay */}
            <div className="absolute bottom-4 left-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 p-2">
                <AnimalIllustration 
                  variant={animal.illustration} 
                  className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-display text-2xl text-[#1a2e1a] font-bold mb-2 group-hover:text-[#8B4513] transition-colors">
                {animal.name}
              </h3>
              <p className="text-[#2C392C]/70 text-sm leading-relaxed">
                {animal.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" style={{ color: animal.color }} />
                  <p className="text-xl font-bold font-display" style={{ color: animal.color }}>
                    {animal.projects}
                  </p>
                </div>
                <p className="text-xs text-[#2C392C]/60 font-medium tracking-wide">Projects</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4" style={{ color: animal.color }} />
                  <p className="text-xl font-bold font-display" style={{ color: animal.color }}>
                    {formatNumber(animal.volunteers)}
                  </p>
                </div>
                <p className="text-xs text-[#2C392C]/60 font-medium tracking-wide">Volunteers</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="w-4 h-4" style={{ color: animal.color }} />
                  <p className="text-xl font-bold font-display" style={{ color: animal.color }}>
                    {animal.countries}
                  </p>
                </div>
                <p className="text-xs text-[#2C392C]/60 font-medium tracking-wide">Countries</p>
              </div>
            </div>

            {/* Hover Action Hint */}
            <motion.div 
              className="absolute bottom-6 left-6 right-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-[#8B4513] font-medium bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full border border-white/40">
                Click to explore {animal.name.toLowerCase()} opportunities →
              </div>
            </motion.div>
          </div>

          {/* Color Accent */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
            style={{ 
              backgroundColor: animal.color,
              opacity: isHovered ? 1 : 0.3
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimalCard;