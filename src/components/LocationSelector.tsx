// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\LocationSelector.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Globe } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  flag: string;
  continent: string;
  popularDestinations: string[];
}

const countries: Country[] = [
  {
    name: 'Costa Rica',
    code: 'CR',
    flag: '🇨🇷',
    continent: 'Central America',
    popularDestinations: ['Tortuguero', 'Manuel Antonio', 'Monteverde']
  },
  {
    name: 'Thailand', 
    code: 'TH',
    flag: '🇹🇭',
    continent: 'Southeast Asia',
    popularDestinations: ['Chiang Mai', 'Bangkok', 'Phuket']
  },
  {
    name: 'Australia',
    code: 'AU', 
    flag: '🇦🇺',
    continent: 'Oceania',
    popularDestinations: ['Brisbane', 'Sydney', 'Melbourne']
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦', 
    continent: 'Africa',
    popularDestinations: ['Johannesburg', 'Cape Town', 'Kruger National Park']
  },
  {
    name: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    continent: 'Southeast Asia', 
    popularDestinations: ['Kalimantan', 'Bali', 'Jakarta']
  },
  {
    name: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    continent: 'Africa',
    popularDestinations: ['Nairobi', 'Maasai Mara', 'Amboseli']
  },
  {
    name: 'Ecuador',
    code: 'EC',
    flag: '🇪🇨',
    continent: 'South America',
    popularDestinations: ['Quito', 'Galápagos Islands', 'Amazon Rainforest']
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    continent: 'South America',
    popularDestinations: ['Amazon Rainforest', 'Pantanal', 'Rio de Janeiro']
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    continent: 'Asia',
    popularDestinations: ['Kerala', 'Rajasthan', 'Himalayas']
  },
  {
    name: 'Peru',
    code: 'PE',
    flag: '🇵🇪',
    continent: 'South America',
    popularDestinations: ['Amazon Basin', 'Cusco', 'Lima']
  }
];

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select destination',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.continent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.popularDestinations.some(dest => 
      dest.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          handleSelect(filteredCountries[highlightedIndex].name);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const selectedCountry = countries.find(c => c.name === value);
  const displayValue = value || searchTerm;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div 
        className="relative bg-white/10 border border-white/20 rounded-xl p-3 cursor-pointer transition-all duration-300 focus-within:border-[#DAA520] hover:border-white/40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                <MapPin className="w-4 h-4 text-[#FCF59E]/80" />
              </div>
            ) : (
              <Globe className="w-5 h-5 text-[#FCF59E]/80" />
            )}
          </div>
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-[#FCF59E]/60 border-none outline-none"
          />
          
          {/* Dropdown Arrow */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-[#FCF59E]/80" />
          </motion.div>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
          >
            {filteredCountries.length > 0 ? (
              <div className="p-2">
                {/* Popular Destinations Header */}
                {searchTerm === '' && (
                  <div className="px-3 py-2 text-[#FCF59E]/60 text-xs font-medium uppercase tracking-wider">
                    Popular Destinations
                  </div>
                )}
                
                {filteredCountries.map((country, index) => (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      index === highlightedIndex
                        ? 'bg-[#DAA520]/20 border border-[#DAA520]/30'
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => handleSelect(country.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{country.flag}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{country.name}</span>
                          <span className="text-[#FCF59E]/60 text-sm">{country.continent}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {country.popularDestinations.slice(0, 2).map((dest, idx) => (
                            <span 
                              key={idx}
                              className="text-xs text-[#DAA520] bg-[#DAA520]/10 px-2 py-0.5 rounded-full"
                            >
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-[#DAA520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[#FCF59E]/60">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No destinations found</p>
                <p className="text-xs mt-1">Try searching for a country or continent</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;