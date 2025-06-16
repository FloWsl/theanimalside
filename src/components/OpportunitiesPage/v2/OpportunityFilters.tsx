import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, DollarSign, Calendar, ChevronDown, Sparkles, Globe } from 'lucide-react';
import { V2SearchFilters } from './index';
import ScalableMultiSelect from './ScalableMultiSelect';

interface OpportunityFiltersProps {
  filters: V2SearchFilters;
  onFilterChange: (filters: V2SearchFilters) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

// Comprehensive locations - scalable to 50+ countries
const allLocations = [
  { id: 'costa-rica', label: 'Costa Rica', emoji: '🇨🇷' },
  { id: 'thailand', label: 'Thailand', emoji: '🇹🇭' },
  { id: 'south-africa', label: 'South Africa', emoji: '🇿🇦' },
  { id: 'australia', label: 'Australia', emoji: '🇦🇺' },
  { id: 'kenya', label: 'Kenya', emoji: '🇰🇪' },
  { id: 'indonesia', label: 'Indonesia', emoji: '🇮🇩' },
  { id: 'brazil', label: 'Brazil', emoji: '🇧🇷' },
  { id: 'ecuador', label: 'Ecuador', emoji: '🇪🇨' },
  { id: 'peru', label: 'Peru', emoji: '🇵🇪' },
  { id: 'tanzania', label: 'Tanzania', emoji: '🇹🇿' },
  { id: 'namibia', label: 'Namibia', emoji: '🇳🇦' },
  { id: 'madagascar', label: 'Madagascar', emoji: '🇲🇬' },
  { id: 'india', label: 'India', emoji: '🇮🇳' },
  { id: 'nepal', label: 'Nepal', emoji: '🇳🇵' },
  { id: 'cambodia', label: 'Cambodia', emoji: '🇰🇭' },
  { id: 'malaysia', label: 'Malaysia', emoji: '🇲🇾' },
  { id: 'philippines', label: 'Philippines', emoji: '🇵🇭' },
  { id: 'sri-lanka', label: 'Sri Lanka', emoji: '🇱🇰' },
  { id: 'vietnam', label: 'Vietnam', emoji: '🇻🇳' },
  { id: 'botswana', label: 'Botswana', emoji: '🇧🇼' }
];

// Comprehensive animal types - scalable to 20+ species
const allAnimalTypes = [
  { id: 'sea-turtles', label: 'Sea Turtles', emoji: '🐢' },
  { id: 'elephants', label: 'Elephants', emoji: '🐘' },
  { id: 'lions', label: 'Lions', emoji: '🦁' },
  { id: 'primates', label: 'Primates', emoji: '🐒' },
  { id: 'orangutans', label: 'Orangutans', emoji: '🦧' },
  { id: 'marine-life', label: 'Marine Life', emoji: '🐠' },
  { id: 'dolphins', label: 'Dolphins', emoji: '🐬' },
  { id: 'whales', label: 'Whales', emoji: '🐋' },
  { id: 'sharks', label: 'Sharks', emoji: '🦈' },
  { id: 'birds', label: 'Birds', emoji: '🦅' },
  { id: 'big-cats', label: 'Big Cats', emoji: '🐆' },
  { id: 'leopards', label: 'Leopards', emoji: '🐆' },
  { id: 'cheetahs', label: 'Cheetahs', emoji: '🐆' },
  { id: 'tigers', label: 'Tigers', emoji: '🐅' },
  { id: 'rhinos', label: 'Rhinos', emoji: '🦏' },
  { id: 'hippos', label: 'Hippos', emoji: '🦛' },
  { id: 'giraffes', label: 'Giraffes', emoji: '🦒' },
  { id: 'penguins', label: 'Penguins', emoji: '🐧' },
  { id: 'koalas', label: 'Koalas', emoji: '🐨' },
  { id: 'sloths', label: 'Sloths', emoji: '🦥' },
  { id: 'bears', label: 'Bears', emoji: '🐻' },
  { id: 'wolves', label: 'Wolves', emoji: '🐺' },
  { id: 'reptiles', label: 'Reptiles', emoji: '🦎' },
  { id: 'small-mammals', label: 'Small Mammals', emoji: '🐿️' },
  { id: 'wildlife-rescue', label: 'Wildlife Rescue', emoji: '🏥' }
];

const costRanges = [
  { id: 'free', label: 'FREE Programs', description: 'No cost to volunteer' },
  { id: 'under-500', label: 'Under $500', description: 'Affordable options' },
  { id: 'under-1000', label: 'Under $1,000', description: 'Mid-range programs' },
  { id: 'any', label: 'Any Budget', description: 'All price ranges' }
];

const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  
  const hasActiveFilters = Object.keys(filters).length > 0;
  
  const handleFilterUpdate = (key: keyof V2SearchFilters, value: string | string[] | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };
  
  const handleLocationChange = (selectedLocations: string[]) => {
    handleFilterUpdate('locations', selectedLocations.length > 0 ? selectedLocations : undefined);
  };
  
  const handleAnimalTypeChange = (selectedAnimals: string[]) => {
    handleFilterUpdate('animalTypes', selectedAnimals.length > 0 ? selectedAnimals : undefined);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleFilterUpdate('searchTerm', value || undefined);
  };
  
  return (
    <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-beige/40 py-3 lg:py-4 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Compact header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3 lg:mb-4">
          <div className="flex items-center justify-between lg:justify-start lg:gap-4">
            <div>
              <h2 className="text-lg lg:text-xl font-display font-bold text-deep-forest">
                {resultCount} Adventures
                <span className="text-rich-earth font-normal hidden sm:inline"> Await</span>
              </h2>
              <p className="text-xs lg:text-sm text-forest/60">
                Discover conservation experiences worldwide
              </p>
            </div>
            {resultCount !== totalCount && (
              <span className="bg-sage-green/10 text-sage-green px-2 py-1 rounded-full text-xs font-medium">
                of {totalCount}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 bg-sage-green hover:bg-rich-earth text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{isExpanded ? 'Hide Filters' : 'Filters'}</span>
            <span className="sm:hidden">Filter</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Compact search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-green w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search animals, destinations, organizations..."
            className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-warm-beige/20 border border-warm-beige/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/40 focus:border-sage-green text-sm lg:text-base placeholder:text-forest/50"
          />
        </div>
        
        {/* Expandable filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-4">
                {/* Compact filter grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-deep-forest mb-2">
                      <MapPin className="w-3.5 h-3.5 text-sage-green" />
                      Countries
                    </label>
                    <ScalableMultiSelect
                      options={allLocations}
                      selected={filters.locations || []}
                      onSelectionChange={handleLocationChange}
                      placeholder="Select countries"
                      searchPlaceholder="Search countries..."
                      maxDisplayed={1}
                    />
                  </div>
                  
                  {/* Animal Types Filter */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-deep-forest mb-2">
                      <span className="text-sm">🦋</span>
                      Animals
                    </label>
                    <ScalableMultiSelect
                      options={allAnimalTypes}
                      selected={filters.animalTypes || []}
                      onSelectionChange={handleAnimalTypeChange}
                      placeholder="Select animals"
                      searchPlaceholder="Search animals..."
                      maxDisplayed={1}
                    />
                  </div>
                
                  {/* Budget Filter */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-deep-forest mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-rich-earth" />
                      Budget
                    </label>
                    <select
                      value={filters.costRange || 'any'}
                      onChange={(e) => handleFilterUpdate('costRange', e.target.value as 'free' | 'under-500' | 'under-1000' | 'any')}
                      className="w-full bg-white border border-warm-beige/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-sm"
                    >
                      {costRanges.map(range => (
                        <option key={range.id} value={range.id}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                
                  {/* Duration Filter */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-deep-forest mb-2">
                      <Calendar className="w-3.5 h-3.5 text-warm-sunset" />
                      Duration (weeks)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.durationMin || ''}
                        onChange={(e) => handleFilterUpdate('durationMin', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full bg-white border border-warm-beige/60 rounded-lg px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-sm"
                        min="1"
                        max="52"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.durationMax || ''}
                        onChange={(e) => handleFilterUpdate('durationMax', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full bg-white border border-warm-beige/60 rounded-lg px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-sm"
                        min="1"
                        max="52"
                      />
                    </div>
                  </div>
                
                </div>
                
                {/* Clear Filters - Only show when filters are active */}
                {hasActiveFilters && (
                  <div className="flex justify-center">
                    <button
                      onClick={onClearFilters}
                      className="flex items-center gap-2 bg-warm-beige/60 hover:bg-warm-beige/80 text-deep-forest px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Compact active filters display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-warm-beige/40"
          >
            <span className="text-xs text-forest/70 font-medium mr-1">Active:</span>
            
            {filters.locations?.map(location => {
              const locationOption = allLocations.find(opt => opt.label === location);
              return (
                <span key={location} className="flex items-center gap-1 bg-sage-green/10 text-sage-green px-2 py-0.5 rounded-full text-xs">
                  {locationOption?.emoji ? (
                    <span className="text-xs">{locationOption.emoji}</span>
                  ) : (
                    <MapPin className="w-2.5 h-2.5" />
                  )}
                  <span className="truncate max-w-16">{location}</span>
                </span>
              );
            })}
            
            {filters.costRange && filters.costRange !== 'any' && (
              <span className="flex items-center gap-1 bg-rich-earth/10 text-rich-earth px-2 py-0.5 rounded-full text-xs">
                <DollarSign className="w-2.5 h-2.5" />
                <span className="truncate max-w-16">{costRanges.find(r => r.id === filters.costRange)?.label}</span>
              </span>
            )}
            
            {filters.animalTypes?.map(type => {
              const animalOption = allAnimalTypes.find(opt => opt.label === type);
              return (
                <span key={type} className="flex items-center gap-1 bg-warm-sunset/10 text-warm-sunset px-2 py-0.5 rounded-full text-xs">
                  {animalOption?.emoji && <span className="text-xs">{animalOption.emoji}</span>}
                  <span className="truncate max-w-16">{type}</span>
                </span>
              );
            })}
            
            {(filters.durationMin || filters.durationMax) && (
              <span className="flex items-center gap-1 bg-golden-hour/10 text-golden-hour px-2 py-0.5 rounded-full text-xs">
                <Calendar className="w-2.5 h-2.5" />
                <span className="truncate">{filters.durationMin || 'Any'}-{filters.durationMax || 'Any'}w</span>
              </span>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OpportunityFilters;