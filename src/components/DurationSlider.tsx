// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\DurationSlider.tsx

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface DurationSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const DurationSlider: React.FC<DurationSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 24,
  step = 1,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, value: 0 });

  // Duration ranges for visual feedback
  const getDurationLabel = (weeks: number) => {
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;
    if (weeks < 12) {
      const months = Math.floor(weeks / 4);
      const remainingWeeks = weeks % 4;
      if (remainingWeeks === 0) {
        return `${months} month${months > 1 ? 's' : ''}`;
      }
      return `${months}mo ${remainingWeeks}w`;
    }
    if (weeks === 12) return '3 months';
    if (weeks < 24) {
      const months = Math.floor(weeks / 4);
      return `${months} months`;
    }
    return '6+ months';
  };

  const getDurationCategory = (weeks: number) => {
    if (weeks <= 2) return { label: 'Short-term', color: '#DAA520', bg: '#DAA520/20' };
    if (weeks <= 8) return { label: 'Medium-term', color: '#87A96B', bg: '#87A96B/20' };
    if (weeks <= 16) return { label: 'Long-term', color: '#D2691E', bg: '#D2691E/20' };
    return { label: 'Extended', color: '#8B4513', bg: '#8B4513/20' };
  };

  const getDurationIcon = (weeks: number) => {
    if (weeks <= 4) return '⚡';
    if (weeks <= 12) return '🌱';
    if (weeks <= 20) return '🌳';
    return '🏔️';
  };

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = useCallback((type: 'min' | 'max', e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
    setDragStart({ x: e.clientX, value: value[type === 'min' ? 0 : 1] });
  }, [value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round(min + (percentage / 100) * (max - min));

    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    if (isDragging === 'min') {
      onChange([Math.min(clampedValue, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(clampedValue, value[0])]);
    }
  }, [isDragging, min, max, value, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);
  const minCategory = getDurationCategory(value[0]);
  const maxCategory = getDurationCategory(value[1]);

  // Quick duration presets
  const quickPresets = [
    { label: '1-2 weeks', value: [1, 2] as [number, number], icon: '⚡' },
    { label: '1 month', value: [4, 4] as [number, number], icon: '📅' },
    { label: '2-3 months', value: [8, 12] as [number, number], icon: '🌱' },
    { label: '6+ months', value: [24, 24] as [number, number], icon: '🏔️' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Selection Display */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FCF59E]/80" />
            <span className="text-white font-medium">Duration Range</span>
          </div>
          <div className="flex items-center gap-2 text-[#DAA520] font-semibold">
            <span>{getDurationIcon(value[0])}</span>
            <span className="text-sm">
              {value[0] === value[1] 
                ? getDurationLabel(value[0])
                : `${getDurationLabel(value[0])} - ${getDurationLabel(value[1])}`
              }
            </span>
          </div>
        </div>

        {/* Slider Track */}
        <div className="relative h-8 bg-white/10 rounded-full cursor-pointer group">
          {/* Background Track */}
          <div className="absolute inset-y-0 left-0 right-0 bg-white/20 rounded-full" />
          
          {/* Active Range */}
          <motion.div 
            className="absolute inset-y-0 bg-gradient-to-r from-[#DAA520] to-[#D2691E] rounded-full"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`
            }}
            animate={{
              boxShadow: isDragging 
                ? '0 0 20px rgba(218, 165, 32, 0.6)' 
                : '0 0 10px rgba(218, 165, 32, 0.3)'
            }}
          />
          
          {/* Thumb Handles */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-[#DAA520] cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center"
            style={{ left: `${minPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
            onMouseDown={(e) => handleMouseDown('min', e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: isDragging === 'min' ? '#D2691E' : '#DAA520',
              scale: isDragging === 'min' ? 1.2 : 1
            }}
          >
            <div className="w-2 h-2 bg-[#DAA520] rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-[#DAA520] cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center"
            style={{ left: `${maxPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
            onMouseDown={(e) => handleMouseDown('max', e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: isDragging === 'max' ? '#D2691E' : '#DAA520',
              scale: isDragging === 'max' ? 1.2 : 1
            }}
          >
            <div className="w-2 h-2 bg-[#DAA520] rounded-full" />
          </motion.div>
          
          {/* Value Labels */}
          <div 
            className="absolute -top-10 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none transition-all duration-200"
            style={{ 
              left: `${minPercentage}%`, 
              transform: 'translateX(-50%)',
              opacity: isDragging === 'min' ? 1 : 0.7
            }}
          >
            {getDurationLabel(value[0])}
          </div>
          
          <div 
            className="absolute -top-10 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none transition-all duration-200"
            style={{ 
              left: `${maxPercentage}%`, 
              transform: 'translateX(-50%)',
              opacity: isDragging === 'max' ? 1 : 0.7
            }}
          >
            {getDurationLabel(value[1])}
          </div>
        </div>

        {/* Duration Categories */}
        <div className="flex justify-between mt-3 text-xs text-[#FCF59E]/60">
          <span>1 week</span>
          <span>3 months</span>
          <span>6 months</span>
          <span>6+ months</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {quickPresets.map((preset, index) => {
          const isActive = value[0] === preset.value[0] && value[1] === preset.value[1];
          
          return (
            <motion.button
              key={index}
              onClick={() => onChange(preset.value)}
              className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-[#DAA520]/20 border-[#DAA520]/50 text-[#DAA520]'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 justify-center">
                <span className="text-lg">{preset.icon}</span>
                <span>{preset.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Duration Insights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#87A96B]" />
            <span className="text-[#87A96B] text-sm font-medium">Minimum</span>
          </div>
          <div className="text-white font-semibold">{getDurationLabel(value[0])}</div>
          <div className="text-xs text-[#FCF59E]/60 mt-1">{minCategory.label}</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#D2691E]" />
            <span className="text-[#D2691E] text-sm font-medium">Maximum</span>
          </div>
          <div className="text-white font-semibold">{getDurationLabel(value[1])}</div>
          <div className="text-xs text-[#FCF59E]/60 mt-1">{maxCategory.label}</div>
        </div>
      </div>
    </div>
  );
};

export default DurationSlider;