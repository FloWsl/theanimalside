import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  emoji?: string;
}

interface ScalableMultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  maxDisplayed?: number;
}

const ScalableMultiSelect: React.FC<ScalableMultiSelectProps> = ({
  options,
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder,
  maxDisplayed = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleToggleOption = (optionLabel: string) => {
    const newSelected = selected.includes(optionLabel)
      ? selected.filter(item => item !== optionLabel)
      : [...selected, optionLabel];
    
    onSelectionChange(newSelected);
  };

  const handleRemoveSelected = (item: string) => {
    onSelectionChange(selected.filter(s => s !== item));
  };

  const displayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length <= maxDisplayed) return selected.join(', ');
    return `${selected.slice(0, maxDisplayed).join(', ')} +${selected.length - maxDisplayed} more`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected items chips - always visible */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(item => {
            const option = options.find(opt => opt.label === item);
            return (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-sage-green/10 text-sage-green px-3 py-1.5 rounded-full text-sm font-medium border border-sage-green/20"
              >
                {option?.emoji && <span className="text-sm">{option.emoji}</span>}
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveSelected(item)}
                  className="ml-1 hover:bg-sage-green/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            );
          })}
        </div>
      )}

      {/* Compact dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-warm-beige/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-left transition-colors hover:border-sage-green/40"
      >
        <span className={`text-sm truncate ${selected.length === 0 ? 'text-forest/50' : 'text-deep-forest'}`}>
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <ChevronDown className={`w-4 h-4 text-forest/40 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-warm-beige/60 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden"
          >
            {/* Search input */}
            <div className="p-3 border-b border-warm-beige/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest/40 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-warm-beige/20 border border-warm-beige/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 text-sm"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-forest/60">
                  No matches found for "{searchTerm}"
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selected.includes(option.label);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleToggleOption(option.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-warm-beige/30 ${
                        isSelected ? 'bg-sage-green/5' : ''
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-sage-green border-sage-green' 
                          : 'border-warm-beige/60'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {option.emoji && <span className="text-base">{option.emoji}</span>}
                      <span className={`text-sm ${isSelected ? 'font-medium text-sage-green' : 'text-deep-forest'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with selection count */}
            {selected.length > 0 && (
              <div className="p-3 border-t border-warm-beige/40 bg-warm-beige/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest/70">
                    {selected.length} selected
                  </span>
                  <button
                    onClick={() => onSelectionChange([])}
                    className="text-sage-green hover:text-rich-earth font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScalableMultiSelect;