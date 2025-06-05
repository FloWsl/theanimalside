// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\SimpleHeroSearch.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimalIllustration from '../illustrations/AnimalIllustration';

interface SearchOption {
  id: string;
  name: string;
  type: 'animal' | 'location';
  slug: string;
  count: number;
  illustration?: 'koala' | 'orangutan' | 'lion' | 'turtle' | 'elephant';
  flag?: string;
  description: string;
}

const searchOptions: SearchOption[] = [
  // Animals
  {
    id: 'lions',
    name: 'Lions',
    type: 'animal',
    slug: 'lions',
    count: 73,
    illustration: 'lion',
    description: 'Big cat conservation in Africa'
  },
  {
    id: 'elephants', 
    name: 'Elephants',
    type: 'animal',
    slug: 'elephants',
    count: 127,
    illustration: 'elephant',
    description: 'Gentle giants across Africa & Asia'
  },
  {
    id: 'sea-turtles',
    name: 'Sea Turtles',
    type: 'animal', 
    slug: 'sea-turtles',
    count: 156,
    illustration: 'turtle',
    description: 'Marine conservation worldwide'
  },
  {
    id: 'orangutans',
    name: 'Orangutans',
    type: 'animal',
    slug: 'orangutans', 
    count: 89,
    illustration: 'orangutan',
    description: 'Primate rescue in Southeast Asia'
  },
  {
    id: 'koalas',
    name: 'Koalas',
    type: 'animal',
    slug: 'koalas',
    count: 52,
    illustration: 'koala', 
    description: 'Marsupial care in Australia'
  },
  
  // Locations
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    type: 'location',
    slug: 'costa-rica',
    count: 94,
    flag: '🇨🇷',
    description: 'Tropical wildlife conservation'
  },
  {
    id: 'thailand',
    name: 'Thailand', 
    type: 'location',
    slug: 'thailand',
    count: 68,
    flag: '🇹🇭',
    description: 'Elephant sanctuaries & rescue'
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    type: 'location',
    slug: 'south-africa', 
    count: 112,
    flag: '🇿🇦',
    description: 'Big Five conservation'
  },
  {
    id: 'australia',
    name: 'Australia',
    type: 'location',
    slug: 'australia',
    count: 85,
    flag: '🇦🇺', 
    description: 'Wildlife rehabilitation'
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    type: 'location',
    slug: 'indonesia',
    count: 76,
    flag: '🇮🇩',
    description: 'Rainforest & marine protection'
  }
];

interface SimpleHeroSearchProps {
  className?: string;
  placeholder?: string;
}

const SimpleHeroSearch: React.FC<SimpleHeroSearchProps> = ({
  className = '',
  placeholder = 'Search animals or destinations...'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = searchOptions.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6); // Limit to 6 results for clean UI

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && filteredOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault(); 
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (option: SearchOption) => {
    // This will navigate to SEO-friendly URLs like:
    // /opportunities/lions or /opportunities/costa-rica
    window.location.href = `/opportunities/${option.slug}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.length > 0);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    if (searchQuery.length > 0) {
      setIsOpen(true);
    }
  };

  const groupedOptions = {
    animals: filteredOptions.filter(opt => opt.type === 'animal'),
    locations: filteredOptions.filter(opt => opt.type === 'location')
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-4 focus-within:border-[#DAA520] transition-all duration-300 backdrop-blur-sm">
          <Search className="w-5 h-5 text-[#FCF59E]/80 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-[#FCF59E]/60 border-none outline-none text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="text-[#FCF59E]/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {/* Animals Section */}
              {groupedOptions.animals.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-[#FCF59E]/60 text-xs font-medium uppercase tracking-wider border-b border-white/10 mb-2">
                    🦁 Animals
                  </div>
                  <div className="space-y-1">
                    {groupedOptions.animals.map((option, index) => {
                      const globalIndex = filteredOptions.indexOf(option);
                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`w-full p-3 rounded-lg cursor-pointer transition-all duration-200 group text-left ${
                            globalIndex === highlightedIndex
                              ? 'bg-[#DAA520]/20 border border-[#DAA520]/30'
                              : 'hover:bg-white/10'
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0">
                              {option.illustration && (
                                <AnimalIllustration 
                                  variant={option.illustration}
                                  className="w-full h-full transition-transform duration-200 group-hover:scale-110"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{option.name}</span>
                                <span className="text-[#DAA520] text-sm font-semibold">{option.count} projects</span>
                              </div>
                              <p className="text-[#FCF59E]/70 text-sm">{option.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#DAA520] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Locations Section */}
              {groupedOptions.locations.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[#FCF59E]/60 text-xs font-medium uppercase tracking-wider border-b border-white/10 mb-2">
                    🌍 Destinations
                  </div>
                  <div className="space-y-1">
                    {groupedOptions.locations.map((option, index) => {
                      const globalIndex = filteredOptions.indexOf(option);
                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupedOptions.animals.length + index) * 0.05 }}
                          className={`w-full p-3 rounded-lg cursor-pointer transition-all duration-200 group text-left ${
                            globalIndex === highlightedIndex
                              ? 'bg-[#DAA520]/20 border border-[#DAA520]/30'
                              : 'hover:bg-white/10'
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                              <span className="text-2xl">{option.flag}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{option.name}</span>
                                <span className="text-[#87A96B] text-sm font-semibold">{option.count} projects</span>
                              </div>
                              <p className="text-[#FCF59E]/70 text-sm">{option.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#DAA520] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Browse All Option */}
              <div className="border-t border-white/10 mt-4 pt-4">
                <Link
                  to="/opportunities"
                  className="flex items-center justify-center gap-2 w-full p-3 text-[#FCF59E]/80 hover:text-white transition-colors text-sm font-medium"
                >
                  <Search className="w-4 h-4" />
                  Browse all opportunities
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {searchQuery && filteredOptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50"
        >
          <div className="text-center text-[#FCF59E]/60">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for "{searchQuery}"</p>
            <Link 
              to="/opportunities"
              className="text-[#DAA520] hover:text-white transition-colors text-sm font-medium mt-2 inline-block"
            >
              Browse all opportunities →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SimpleHeroSearch;