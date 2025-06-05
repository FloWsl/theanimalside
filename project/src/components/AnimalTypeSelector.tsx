// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\AnimalTypeSelector.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import AnimalIllustration from './illustrations/AnimalIllustration';

interface AnimalType {
  id: string;
  name: string;
  illustration: 'koala' | 'orangutan' | 'lion' | 'turtle' | 'elephant';
  category: string;
  popularLocations: string[];
  projectCount: number;
}

const animalTypes: AnimalType[] = [
  {
    id: 'lions',
    name: 'Lions',
    illustration: 'lion',
    category: 'Big Cats',
    popularLocations: ['South Africa', 'Kenya', 'Tanzania'],
    projectCount: 73
  },
  {
    id: 'elephants',
    name: 'Elephants',
    illustration: 'elephant', 
    category: 'Large Mammals',
    popularLocations: ['Thailand', 'Kenya', 'Sri Lanka'],
    projectCount: 127
  },
  {
    id: 'sea-turtles',
    name: 'Sea Turtles',
    illustration: 'turtle',
    category: 'Marine Life',
    popularLocations: ['Costa Rica', 'Australia', 'Greece'],
    projectCount: 156
  },
  {
    id: 'orangutans',
    name: 'Orangutans',
    illustration: 'orangutan',
    category: 'Primates',
    popularLocations: ['Indonesia', 'Malaysia'],
    projectCount: 89
  },
  {
    id: 'koalas',
    name: 'Koalas',
    illustration: 'koala',
    category: 'Marsupials',
    popularLocations: ['Australia'],
    projectCount: 52
  },
  {
    id: 'cheetahs',
    name: 'Cheetahs',
    illustration: 'lion', // Using lion as placeholder
    category: 'Big Cats',
    popularLocations: ['South Africa', 'Namibia'],
    projectCount: 34
  },
  {
    id: 'dolphins',
    name: 'Dolphins',
    illustration: 'turtle', // Using turtle as marine placeholder
    category: 'Marine Life',
    popularLocations: ['Portugal', 'New Zealand', 'Croatia'],
    projectCount: 92
  },
  {
    id: 'sloths',
    name: 'Sloths',
    illustration: 'koala', // Using koala as tree-dwelling placeholder
    category: 'Small Mammals',
    popularLocations: ['Costa Rica', 'Panama'],
    projectCount: 28
  },
  {
    id: 'rhinos',
    name: 'Rhinos',
    illustration: 'elephant', // Using elephant as large mammal placeholder
    category: 'Large Mammals',
    popularLocations: ['South Africa', 'Nepal'],
    projectCount: 41
  },
  {
    id: 'penguins',
    name: 'Penguins',
    illustration: 'turtle', // Using turtle as placeholder
    category: 'Marine Birds',
    popularLocations: ['South Africa', 'Argentina', 'Chile'],
    projectCount: 45
  }
];

interface AnimalTypeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}

const AnimalTypeSelector: React.FC<AnimalTypeSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select animals',
  className = '',
  maxSelections = 5
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter animals based on search term
  const filteredAnimals = animalTypes.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.popularLocations.some(loc => 
      loc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Group animals by category
  const groupedAnimals = filteredAnimals.reduce((groups, animal) => {
    const category = animal.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(animal);
    return groups;
  }, {} as Record<string, AnimalType[]>);

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

  const handleToggle = (animalId: string) => {
    const isSelected = value.includes(animalId);
    let newValue: string[];
    
    if (isSelected) {
      newValue = value.filter(id => id !== animalId);
    } else {
      if (value.length >= maxSelections) {
        // Replace first selection if at max
        newValue = [...value.slice(1), animalId];
      } else {
        newValue = [...value, animalId];
      }
    }
    
    onChange(newValue);
  };

  const removeSelection = (animalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(id => id !== animalId));
  };

  const getSelectedAnimals = () => {
    return animalTypes.filter(animal => value.includes(animal.id));
  };

  const selectedAnimals = getSelectedAnimals();

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div 
        className="relative bg-white/10 border border-white/20 rounded-xl p-3 cursor-pointer transition-all duration-300 focus-within:border-[#DAA520] hover:border-white/40 min-h-[3.5rem]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selected Animals */}
          {selectedAnimals.length > 0 ? (
            <>
              {selectedAnimals.map((animal) => (
                <motion.div
                  key={animal.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-2 bg-[#DAA520]/20 text-[#DAA520] px-3 py-1.5 rounded-full text-sm font-medium border border-[#DAA520]/30"
                >
                  <div className="w-4 h-4">
                    <AnimalIllustration variant={animal.illustration} className="w-full h-full" />
                  </div>
                  <span>{animal.name}</span>
                  <button
                    onClick={(e) => removeSelection(animal.id, e)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              
              {selectedAnimals.length < maxSelections && (
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Add more..."
                  className="flex-1 min-w-[120px] bg-transparent text-white placeholder-[#FCF59E]/60 border-none outline-none text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </>
          ) : (
            <>
              <div className="w-5 h-5 text-[#FCF59E]/80">
                <AnimalIllustration variant="lion" className="w-full h-full opacity-60" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white placeholder-[#FCF59E]/60 border-none outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </>
          )}
          
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

      {/* Selection Counter */}
      {selectedAnimals.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-[#D2691E] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-black/50">
          {selectedAnimals.length}
        </div>
      )}

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
            {Object.keys(groupedAnimals).length > 0 ? (
              <div className="p-2">
                {Object.entries(groupedAnimals).map(([category, animals]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    {/* Category Header */}
                    <div className="px-3 py-2 text-[#FCF59E]/60 text-xs font-medium uppercase tracking-wider border-b border-white/10 mb-2">
                      {category}
                    </div>
                    
                    {/* Animals in Category */}
                    <div className="space-y-1">
                      {animals.map((animal, index) => {
                        const isSelected = value.includes(animal.id);
                        const isAtMaxLimit = value.length >= maxSelections && !isSelected;
                        
                        return (
                          <motion.div
                            key={animal.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                              isSelected
                                ? 'bg-[#DAA520]/20 border border-[#DAA520]/30'
                                : isAtMaxLimit
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white/10'
                            }`}
                            onClick={() => !isAtMaxLimit && handleToggle(animal.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex-shrink-0">
                                <AnimalIllustration 
                                  variant={animal.illustration} 
                                  className="w-full h-full transition-transform duration-200 group-hover:scale-110" 
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${
                                    isSelected ? 'text-[#DAA520]' : 'text-white'
                                  }`}>
                                    {animal.name}
                                  </span>
                                  <span className="text-[#FCF59E]/60 text-sm">
                                    {animal.projectCount} projects
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {animal.popularLocations.slice(0, 2).map((location, idx) => (
                                    <span 
                                      key={idx}
                                      className="text-xs text-[#87A96B] bg-[#87A96B]/10 px-2 py-0.5 rounded-full"
                                    >
                                      {location}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className={`transition-all duration-200 ${
                                isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-50'
                              }`}>
                                {isSelected ? (
                                  <div className="w-5 h-5 bg-[#DAA520] rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-white/40 rounded-full" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Selection Limit Warning */}
                {value.length >= maxSelections && (
                  <div className="p-3 bg-[#D2691E]/20 border border-[#D2691E]/30 rounded-lg mt-2">
                    <p className="text-[#D2691E] text-sm text-center">
                      Maximum {maxSelections} animals selected. Remove one to add another.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-[#FCF59E]/60">
                <div className="w-8 h-8 mx-auto mb-2 opacity-50">
                  <AnimalIllustration variant="lion" className="w-full h-full" />
                </div>
                <p>No animals found</p>
                <p className="text-xs mt-1">Try searching for a different animal type</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimalTypeSelector;