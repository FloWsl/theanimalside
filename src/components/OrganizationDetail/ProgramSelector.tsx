// src/components/OrganizationDetail/ProgramSelector.tsx - Database-Integrated Version
import React from 'react';
import { Clock, Users, Calendar } from 'lucide-react';
import { Program } from '../../types/database';

interface ProgramSelectorProps {
  programs: Program[];
  selectedProgram: Program;
  onProgramChange: (program: Program) => void;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({ 
  programs, 
  selectedProgram, 
  onProgramChange 
}) => {
  // Only show if there are multiple programs
  if (programs.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-nature border border-beige/60">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-card-title text-forest">Choose Your Program</h3>
          <p className="text-body-small text-forest/70">
            This organization offers multiple volunteer programs. Select the one that interests you most.
          </p>
        </div>
        
        <div className="grid gap-4">
          {programs.map((program) => {
            const isSelected = selectedProgram.id === program.id;
            
            return (
              <button
                key={program.id}
                onClick={() => onProgramChange(program)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-rich-earth bg-rich-earth/5 shadow-md'
                    : 'border-beige/60 hover:border-rich-earth/30 hover:bg-beige/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${
                        isSelected ? 'text-rich-earth' : 'text-forest'
                      }`}>
                        {program.title}
                      </h4>
                      <p className="text-sm text-forest/70 mt-1 leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                    
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-rich-earth rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Program Quick Info */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-xs text-forest/60">
                      <Calendar className="w-3 h-3" />
                      <span>{program.duration_min_weeks}-{program.duration_max_weeks || '∞'} weeks</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-forest/60">
                      <Clock className="w-3 h-3" />
                      <span>{program.hours_per_day}h/day</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-forest/60">
                      <Users className="w-3 h-3" />
                      <span>{program.days_per_week} days/week</span>
                    </div>
                  </div>
                  
                  {/* Cost Display */}
                  <div className="pt-2 border-t border-beige/50">
                    <div className="text-sm font-medium text-forest">
                      {program.cost_amount === 0 || program.cost_amount === null ? 'Free Program' : `${program.cost_amount} ${program.cost_currency}/${program.cost_period}`}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgramSelector;