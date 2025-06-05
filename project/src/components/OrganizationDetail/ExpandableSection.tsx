// src/components/OrganizationDetail/ExpandableSection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

export type DisclosureLevel = 'essential' | 'important' | 'comprehensive';

interface ExpandableSectionProps {
  title: string;
  level: DisclosureLevel;
  icon?: React.ComponentType<{ className?: string }>;
  preview?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  expandedContent?: React.ReactNode; // Additional content shown only when expanded
  isDesktop?: boolean; // Desktop-aware behavior
  forceExpanded?: boolean; // Force expansion (useful for essential info on desktop)
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  level,
  icon: Icon = Info,
  preview,
  children,
  defaultExpanded = false,
  className = '',
  expandedContent,
  isDesktop = false,
  forceExpanded = false
}) => {
  // Smart defaults for desktop: show more content by default on larger screens
  const getDefaultExpanded = () => {
    if (forceExpanded) return true;
    if (isDesktop) {
      // On desktop, expand essential and important sections by default
      return level === 'essential' || level === 'important';
    }
    return defaultExpanded;
  };
  
  const [isExpanded, setIsExpanded] = useState(getDefaultExpanded);

  // Style configuration based on disclosure level
  const levelConfig = {
    essential: {
      bgColor: 'bg-rich-earth/5',
      borderColor: 'border-rich-earth/20',
      iconColor: 'text-rich-earth',
      iconBg: 'bg-rich-earth/10',
      textColor: 'text-deep-forest',
      badgeText: 'Essential',
      badgeColor: 'bg-rich-earth/10 text-rich-earth'
    },
    important: {
      bgColor: 'bg-sage-green/5',
      borderColor: 'border-sage-green/20',
      iconColor: 'text-sage-green',
      iconBg: 'bg-sage-green/10',
      textColor: 'text-deep-forest',
      badgeText: 'Important',
      badgeColor: 'bg-sage-green/10 text-sage-green'
    },
    comprehensive: {
      bgColor: 'bg-warm-sunset/5',
      borderColor: 'border-warm-sunset/20',
      iconColor: 'text-warm-sunset',
      iconBg: 'bg-warm-sunset/10',
      textColor: 'text-deep-forest',
      badgeText: 'Detailed',
      badgeColor: 'bg-warm-sunset/10 text-warm-sunset'
    }
  };

  const config = levelConfig[level];

  const toggleExpanded = () => {
    // Prevent collapse if forced expanded (e.g., essential info on desktop)
    if (forceExpanded) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${className}`}>
      <Card className={`${config.bgColor} ${config.borderColor} border-2 hover:shadow-md transition-all duration-300 overflow-hidden`}>
        {/* Expandable Header */}
        <CardHeader className="pb-4">
          <button
          onClick={toggleExpanded}
          className={`w-full flex items-center justify-between text-left group touch-manipulation min-h-[48px] focus:outline-none focus:ring-2 focus:ring-rich-earth/40 rounded-lg p-2 -m-2 ${
            forceExpanded ? 'cursor-default' : 'cursor-pointer'
          }`}
            aria-expanded={isExpanded}
              aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
              disabled={forceExpanded}
            >
            <div className="flex items-center gap-4 flex-1">
              {/* Icon */}
              <div className={`p-3 ${config.iconBg} rounded-xl transition-transform duration-200 group-hover:scale-105`}>
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              
              {/* Title and Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`text-subtitle font-semibold ${config.textColor} group-hover:text-[#8B4513] transition-colors`}>
                    {title}
                  </h3>
                </div>
                
                {/* Preview text when collapsed */}
                {!isExpanded && preview && (
                  <p className="text-body-small text-[#1a2e1a]/70 line-clamp-2">
                    {preview}
                  </p>
                )}
              </div>
            </div>

            {/* Expand/Collapse Indicator - Hide if forced expanded */}
            {!forceExpanded && (
              <div className="flex items-center gap-2 ml-4">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2 ${config.iconBg} rounded-lg`}
                >
                  <ChevronDown className={`w-4 h-4 ${config.iconColor}`} />
                </motion.div>
              </div>
            )}
          </button>
        </CardHeader>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              <CardContent className="pt-0 pb-6">
                {/* Border separator */}
                <div className={`border-t ${config.borderColor} mb-6`}></div>
                
                {/* Main content */}
                <div className="space-y-4">
                  {children}
                </div>
                
                {/* Additional expanded content if provided */}
                {expandedContent && (
                  <div className="mt-6 pt-6 border-t border-deep-forest/10">
                    {expandedContent}
                  </div>
                )}
                
                {/* Collapse hint for mobile - Hide if forced expanded or on desktop where it's less needed */}
                {!forceExpanded && !isDesktop && (
                  <div className="mt-6 pt-4 border-t border-deep-forest/5">
                    <button
                      onClick={toggleExpanded}
                      className="w-full flex items-center justify-center gap-2 text-body-small text-[#1a2e1a]/60 hover:text-[#8B4513] transition-colors py-2 touch-manipulation min-h-[44px]"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>Collapse section</span>
                    </button>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ExpandableSection;