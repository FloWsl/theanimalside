import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '../../types';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

const animalTypeOptions = [
  'Sea Turtles', 'Marine Life', 'Elephants', 'Lions', 'Leopards', 
  'Cheetahs', 'Primates', 'Orangutans', 'Marsupials', 'Birds', 'Reptiles'
];

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    location: '',
    animalTypes: [],
    durationMin: undefined,
    durationMax: undefined,
    costMax: undefined
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'durationMin' || name === 'durationMax' || name === 'costMax'
      ? value ? parseInt(value, 10) : undefined
      : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleAnimalTypeChange = (type: string) => {
    setFilters(prev => {
      const newAnimalTypes = prev.animalTypes?.includes(type)
        ? prev.animalTypes.filter(t => t !== type)
        : [...(prev.animalTypes || []), type];
      
      return {
        ...prev,
        animalTypes: newAnimalTypes
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      location: '',
      animalTypes: [],
      durationMin: undefined,
      durationMax: undefined,
      costMax: undefined
    });
    onFilterChange({});
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <input 
            type="text" 
            name="searchTerm"
            value={filters.searchTerm || ''}
            onChange={handleInputChange}
            placeholder="Search by keywords..." 
            className="w-full bg-secondary-50 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300"
          />
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-600 hover:text-secondary-800 transition-colors"
            aria-label={isExpanded ? "Hide filters" : "Show filters"}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-1">
                Location
              </label>
              <input 
                type="text" 
                id="location" 
                name="location"
                value={filters.location || ''}
                onChange={handleInputChange}
                placeholder="Country or city"
                className="w-full bg-secondary-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300"
              />
            </div>
            
            <div>
              <label htmlFor="durationRange" className="block text-sm font-medium text-secondary-700 mb-1">
                Duration (weeks)
              </label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  id="durationMin" 
                  name="durationMin"
                  value={filters.durationMin || ''}
                  onChange={handleInputChange}
                  placeholder="Min"
                  min="1"
                  className="w-full bg-secondary-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300"
                />
                <span className="text-secondary-500">to</span>
                <input 
                  type="number" 
                  id="durationMax" 
                  name="durationMax"
                  value={filters.durationMax || ''}
                  onChange={handleInputChange}
                  placeholder="Max"
                  min="1"
                  className="w-full bg-secondary-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="costMax" className="block text-sm font-medium text-secondary-700 mb-1">
                Maximum Cost (USD)
              </label>
              <input 
                type="number" 
                id="costMax" 
                name="costMax"
                value={filters.costMax || ''}
                onChange={handleInputChange}
                placeholder="Any budget"
                min="0"
                className="w-full bg-secondary-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300"
              />
            </div>
          </div>
        )}
        
        {/* Animal Types */}
        {isExpanded && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Animal Types
            </label>
            <div className="flex flex-wrap gap-2">
              {animalTypeOptions.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAnimalTypeChange(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.animalTypes?.includes(type)
                      ? 'bg-accent-500 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="submit"
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
          
          {(filters.searchTerm || filters.location || (filters.animalTypes && filters.animalTypes.length > 0) || 
            filters.durationMin || filters.durationMax || filters.costMax) && (
            <button
              type="button"
              onClick={clearFilters}
              className="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchFiltersComponent;