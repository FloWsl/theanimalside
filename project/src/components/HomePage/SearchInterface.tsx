// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\SearchInterface.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSelector from '@/components/LocationSelector';
import AnimalTypeSelector from '@/components/AnimalTypeSelector';
import DurationSlider from '@/components/DurationSlider';
import { Link } from 'react-router-dom';

export interface SearchFilters {
  location: string;
  animalTypes: string[];
  duration: [number, number];
  keywords: string;
}

interface SearchInterfaceProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  variant?: 'hero' | 'page' | 'compact';
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  onSearch, 
  className = '',
  variant = 'hero'
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    animalTypes: [],
    duration: [1, 12],
    keywords: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Auto-show results when filters are applied
    if (key !== 'keywords' && (value.length > 0 || (Array.isArray(value) && value.length > 0))) {
      setShowResults(true);
    }
  };

  const handleSearch = () => {
    setShowResults(true);
    onSearch?.(filters);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      animalTypes: [],
      duration: [1, 12],
      keywords: ''
    });
    setShowResults(false);
  };

  const hasActiveFilters = filters.location || filters.animalTypes.length > 0 || filters.keywords;

  if (variant === 'compact') {
    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input 
              type="text" 
              value={filters.keywords}
              onChange={(e) => handleFilterChange('keywords', e.target.value)}
              placeholder="Search opportunities..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#DAA520] focus:border-transparent"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-[#D2691E] hover:bg-[#8B4513] text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DAA520]/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#DAA520]" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold font-display">Find Your Perfect Adventure</h3>
              <p className="text-[#FCF59E]/80 text-sm">Discover meaningful wildlife conservation opportunities</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[#FCF59E]/70 text-sm hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search Filters Grid */}
        <div className="space-y-4">
          {/* Keywords Search */}
          <div className="relative">
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-4 focus-within:border-[#DAA520] transition-all duration-300">
              <Search className="w-5 h-5 text-[#FCF59E]/80 flex-shrink-0" />
              <input 
                type="text" 
                value={filters.keywords}
                onChange={(e) => handleFilterChange('keywords', e.target.value)}
                placeholder="Search by animal, location, or experience type..."
                className="flex-1 bg-transparent text-white placeholder-[#FCF59E]/60 border-none outline-none text-lg"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#FCF59E]/80 text-sm hover:text-white transition-colors flex items-center gap-2"
            >
              <span>{isExpanded ? 'Hide' : 'Show'} Advanced Filters</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
          </div>

          {/* Advanced Filters */}
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Location Selector */}
                <div className="space-y-2">
                  <label className="text-[#FCF59E]/90 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    Destination
                  </label>
                  <LocationSelector 
                    value={filters.location}
                    onChange={(value) => handleFilterChange('location', value)}
                    placeholder="Choose destination"
                  />
                </div>

                {/* Animal Type Selector */}
                <div className="space-y-2">
                  <label className="text-[#FCF59E]/90 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">🦁</span>
                    Animals
                  </label>
                  <AnimalTypeSelector 
                    value={filters.animalTypes}
                    onChange={(value) => handleFilterChange('animalTypes', value)}
                    placeholder="Select animals"
                  />
                </div>

                {/* Duration Slider */}
                <div className="space-y-2">
                  <label className="text-[#FCF59E]/90 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    Duration
                  </label>
                  <DurationSlider 
                    value={filters.duration}
                    onChange={(value) => handleFilterChange('duration', value)}
                    min={1}
                    max={24}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Button */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSearch}
            className="flex-1 bg-[#D2691E] hover:bg-[#8B4513] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            asChild={!!onSearch === false}
          >
            {onSearch ? (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search Opportunities
              </>
            ) : (
              <Link to={`/opportunities?${new URLSearchParams({
                location: filters.location,
                animals: filters.animalTypes.join(','),
                duration: filters.duration.join('-'),
                q: filters.keywords
              }).toString()}`}>
                <Search className="w-5 h-5 mr-2" />
                Search Opportunities
              </Link>
            )}
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            asChild
          >
            <Link to="/opportunities">
              Browse All
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        {hasActiveFilters && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[#FCF59E]/70 text-sm">
              {filters.animalTypes.length > 0 && `${filters.animalTypes.length} animal type${filters.animalTypes.length !== 1 ? 's' : ''} selected`}
              {filters.location && filters.animalTypes.length > 0 && ' • '}
              {filters.location && `Searching in ${filters.location}`}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export type { SearchFilters };
export default SearchInterface;