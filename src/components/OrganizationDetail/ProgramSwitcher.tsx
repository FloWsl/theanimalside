import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Clock, DollarSign, Check, Loader2 } from 'lucide-react';
import type { Program } from '../../types';

interface ProgramSwitcherProps {
  programs: Program[];
  selectedProgram: Program | null;
  onProgramSwitch: (program: Program) => void;
  isLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

const ProgramSwitcher: React.FC<ProgramSwitcherProps> = ({
  programs,
  selectedProgram,
  onProgramSwitch,
  isLoading = false,
  error = null,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!programs || programs.length <= 1) {
    return null; // Don't show switcher for single programs
  }

  const formatCost = (program: Program): string => {
    if (program.cost_amount === 0) return 'FREE';
    if (program.cost_amount === null) return 'Contact';
    return `$${program.cost_amount}/${program.cost_period}`;
  };

  const formatDuration = (program: Program): string => {
    if (program.duration_max_weeks && program.duration_max_weeks !== program.duration_min_weeks) {
      return `${program.duration_min_weeks}-${program.duration_max_weeks} weeks`;
    }
    return `${program.duration_min_weeks} weeks`;
  };

  return (
    <div className="relative w-full">
      {/* Current Program Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`w-full p-4 bg-white border-2 border-sage-green/20 radius-nature-md transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-sage-green/40 hover:shadow-nature-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sage-green" />
                <span className="text-sm text-forest/70">Switching programs...</span>
              </div>
            ) : selectedProgram ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-deep-forest">{selectedProgram.title}</h3>
                  {selectedProgram.is_primary && (
                    <span className="px-2 py-0.5 bg-golden-hour/20 text-golden-hour text-xs font-medium radius-nature-full">
                      Main Program
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-forest/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(selectedProgram)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{formatCost(selectedProgram)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-forest/50">Select a program</span>
            )}
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-sage-green" />
          </motion.div>
        </div>
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 radius-nature-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Program Options Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-sage-green/20 radius-nature-md shadow-nature-lg overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {programs.map((program) => {
                const isSelected = selectedProgram?.id === program.id;
                
                return (
                  <motion.button
                    key={program.id}
                    onClick={() => {
                      onProgramSwitch(program);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 text-left transition-all duration-200 border-b border-sage-green/10 last:border-b-0 ${
                      isSelected 
                        ? 'bg-sage-green/5 border-l-4 border-l-sage-green' 
                        : 'hover:bg-sage-green/5'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-deep-forest">{program.title}</h4>
                          {program.is_primary && (
                            <span className="px-2 py-0.5 bg-golden-hour/20 text-golden-hour text-xs font-medium radius-nature-full">
                              Main
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-forest/70 mb-2 line-clamp-2">
                          {program.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-forest/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(program)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{formatCost(program)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{program.hours_per_day}h/day</span>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 ml-2"
                        >
                          <div className="w-6 h-6 bg-sage-green rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProgramSwitcher;