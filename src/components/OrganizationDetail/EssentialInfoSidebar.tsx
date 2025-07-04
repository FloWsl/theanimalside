// 🗃️ Database-Integrated EssentialInfoSidebar Component
// Updated to use normalized data structure and Supabase integration

import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Globe, 
  Home, 
  UtensilsCrossed, 
  MapPin, 
  Clock,
  Wifi,
  Car,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useOrganizationEssentials, useTabData } from '../../hooks/useOrganizationData';
import type { Program } from '../../types/database';

interface EssentialInfoSidebarProps {
  organizationId: string; // Changed from full organization object
  selectedProgramId?: string; // Allow program selection
  isDesktop?: boolean;
  sidebarExpanded?: boolean;
  className?: string;
}

// Loading skeleton component
const SidebarSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 border border-warm-beige/60">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Error component
const SidebarError: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="max-w-7xl mx-auto px-4">
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Information</h3>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button 
        onClick={retry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EssentialInfoSidebar: React.FC<EssentialInfoSidebarProps> = ({ 
  organizationId, 
  selectedProgramId,
  isDesktop = false, 
  className = ''
}) => {
  // Use the new data hook
  const essentialsQuery = useOrganizationEssentials(organizationId);
  const { data: essentials, isLoading, isError, error, refetch } = useTabData(
    essentialsQuery, 
    'Essential Information'
  );

  // Enhanced responsive disclosure state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cost: true,
    duration: true, 
    requirements: isDesktop ? true : false,
    accommodation: isDesktop ? true : false,
    meals: isDesktop ? true : false,
    location: isDesktop ? true : false
  });

  // Update expanded sections when switching to/from desktop
  React.useEffect(() => {
    if (isDesktop) {
      setExpandedSections({
        cost: true,
        duration: true,
        requirements: true,
        accommodation: true,
        meals: true,
        location: true
      });
    }
  }, [isDesktop]);

  const toggleSection = (section: string) => {
    if (!isDesktop) {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

  // Loading state
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  // Error state
  if (isError || !essentials) {
    return <SidebarError error={error || new Error('Data not found')} retry={refetch} />;
  }

  // Select the correct program (either selected or primary)
  const currentProgram = essentials.primary_program;

  // Enhanced responsive card component
  const ResponsiveCard: React.FC<{ 
    children: React.ReactNode; 
    className?: string;
    expandable?: boolean;
    expanded?: boolean;
    onToggle?: () => void;
    title?: string;
  }> = ({ children, className = "", expandable = false, expanded = true, onToggle, title }) => {
    const shouldShowToggle = expandable && !isDesktop;
    
    return (
      <div className={`bg-white rounded-2xl shadow-nature border border-warm-beige/60 overflow-hidden ${
        isDesktop ? 'lg:rounded-xl lg:shadow-sm' : ''
      } ${className}`}>
        {shouldShowToggle && (
          <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-white to-warm-beige/20 border-b border-warm-beige/30 hover:bg-warm-beige/10 transition-colors duration-200 min-h-[44px] touch-manipulation"
            aria-expanded={expanded}
            aria-controls={`section-${title?.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="text-lg font-semibold text-forest">{title}</span>
            {expanded ? 
              <ChevronUp className="w-5 h-5 text-forest/70" /> : 
              <ChevronDown className="w-5 h-5 text-forest/70" />
            }
          </button>
        )}
        {title && isDesktop && (
          <div className="p-4 border-b border-warm-beige/20">
            <h3 className="text-lg font-semibold text-forest">{title}</h3>
          </div>
        )}
        {expanded && (
          <div 
            id={expandable ? `section-${title?.toLowerCase().replace(/\s+/g, '-')}` : undefined}
            className={isDesktop ? "p-4 lg:p-6" : (expandable ? "p-4 sm:p-6" : "p-4 sm:p-6")}
          >
            {children}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`max-w-7xl mx-auto px-4 space-nature-sm ${isDesktop ? 'lg:space-nature-xs' : ''} ${className}`}>
      {/* Quick Facts Header */}
      <ResponsiveCard>
        <h2 className={`text-xl font-semibold text-forest mb-3 ${
          isDesktop ? 'lg:text-lg lg:mb-2' : ''
        }`}>Essential Information</h2>
        <p className={`text-sm text-forest/70 ${
          isDesktop ? 'lg:text-sm' : ''
        }`}>
          Key details for planning your volunteer experience
        </p>
      </ResponsiveCard>
      
      {/* Cost Information */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rich-earth/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-rich-earth" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Cost</h3>
        </div>
        
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-warm-sunset/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-forest mb-1">
              {currentProgram.cost_amount === 0 ? 'FREE' : `${currentProgram.cost_amount} ${currentProgram.cost_currency}`}
            </div>
            <div className="text-sm text-forest/70">
              {currentProgram.cost_amount === 0 ? 'No program fees' : `per ${currentProgram.cost_period}`}
            </div>
          </div>
          
          {/* Note: Program inclusions would come from separate query */}
          <div className="text-center text-sm text-forest/60">
            <button className="text-sage-green hover:text-deep-forest transition-colors">
              View complete cost breakdown in Practical tab
            </button>
          </div>
        </div>
      </ResponsiveCard>
      
      {/* Duration */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warm-sunset/10 rounded-lg">
            <Calendar className="w-5 h-5 text-warm-sunset" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Duration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-forest mb-1">
              {currentProgram.duration_min_weeks} - {currentProgram.duration_max_weeks || '∞'} weeks
            </div>
            <div className="text-sm text-forest/70">
              Flexible length options
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Minimum stay:</span>
                <span className="font-semibold text-forest">{currentProgram.duration_min_weeks} weeks</span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Work schedule:</span>
                <span className="font-semibold text-forest">{currentProgram.days_per_week} days/week</span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Daily hours:</span>
                <span className="font-semibold text-forest">{currentProgram.hours_per_day} hours/day</span>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveCard>
      
      {/* Age Requirements */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.requirements}
        onToggle={() => toggleSection('requirements')}
        title="Age & Requirements"
      >
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-sage-green/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-forest mb-1">
              {essentials.age_requirement.min_age}+ years old
              {essentials.age_requirement.max_age && ` (max ${essentials.age_requirement.max_age})`}
            </div>
            <div className="text-sm text-forest/70">
              Minimum age for volunteers
            </div>
          </div>
        </div>
        
        {/* Key Requirements */}
        {essentials.key_requirements.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-forest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-warm-sunset" />
              Key Requirements
            </h4>
            {essentials.key_requirements.length <= 3 ? (
              <div className="space-y-2">
                {essentials.key_requirements.map((requirement, index) => (
                  <div key={requirement.id} className="text-sm text-forest/80 flex items-center gap-3 p-3 bg-warm-sunset/5 rounded-lg">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{requirement.skill_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
                <div className="text-sm text-forest/80 leading-relaxed mb-3">
                  <strong>{essentials.key_requirements.length} essential requirements</strong> including physical fitness, wildlife experience, and language skills.
                </div>
                <button className="text-sm font-medium text-warm-sunset hover:text-deep-earth transition-colors duration-200 flex items-center gap-2">
                  <span>View complete requirements in Experience tab</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </ResponsiveCard>
      
      {/* Languages */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
        title="Languages & Communication"
      >
        <div className="space-y-3">
          {essentials.languages.length <= 3 ? (
            <div className="flex flex-wrap gap-3">
              {essentials.languages.map((language) => (
                <span 
                  key={language.id}
                  className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium flex items-center gap-2 border border-sage-green/20"
                >
                  <Globe className="w-4 h-4" />
                  {language.language_name}
                </span>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-sage-green/5 to-forest/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-sage-green" />
                <span className="font-medium text-forest">{essentials.languages[0]?.language_name}</span>
                <span className="text-sm text-forest/60">+ {essentials.languages.length - 1} more</span>
              </div>
              <div className="text-sm text-forest/70 leading-relaxed">
                Multiple language support available for international volunteers.
              </div>
            </div>
          )}
        </div>
      </ResponsiveCard>
      
      {/* Accommodation */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.accommodation}
        onToggle={() => toggleSection('accommodation')}
        title="Accommodation & Amenities"
      >
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-warm-beige/20 rounded-xl p-4">
            <div className="text-lg font-bold text-forest mb-2 capitalize">
              {essentials.accommodation.provided ? 
                essentials.accommodation.accommodation_type.replace('_', ' ') : 
                'Not Provided'
              }
            </div>
            <div className="text-sm text-forest/70 leading-relaxed">
              {essentials.accommodation.description}
            </div>
          </div>
          
          {essentials.accommodation.provided && (
            <div className="text-center text-sm text-forest/60">
              <button className="text-rich-earth hover:text-deep-earth transition-colors">
                View complete amenities list in Practical tab
              </button>
            </div>
          )}
        </div>
      </ResponsiveCard>
      
      {/* Meals */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.meals}
        onToggle={() => toggleSection('meals')}
        title="Meals & Dietary Options"
      >
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
            <div className="text-lg font-bold text-forest mb-2">
              {essentials.meal_plan.provided ? 'Meals Included' : 'Meals Not Provided'}
            </div>
            {essentials.meal_plan.provided && (
              <div className="text-sm text-forest/70 capitalize mb-2">
                {essentials.meal_plan.meal_type.replace('_', ' ')}
              </div>
            )}
            {essentials.meal_plan.provided && (
              <div className="text-sm text-forest/70 leading-relaxed">
                {essentials.meal_plan.description}
              </div>
            )}
          </div>
          
          {essentials.meal_plan.provided && (
            <div className="text-center text-sm text-forest/60">
              <button className="text-warm-sunset hover:text-deep-earth transition-colors">
                View dietary options in Practical tab
              </button>
            </div>
          )}
        </div>
      </ResponsiveCard>
      
      {/* Location & Logistics */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sage-green/10 rounded-lg">
            <MapPin className="w-5 h-5 text-sage-green" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Location & Access</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-sage-green/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Organization:</span>
                <span className="font-semibold text-forest">{essentials.organization.name}</span>
              </div>
            </div>
            {essentials.organization.phone && (
              <div className="bg-sage-green/5 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/70">Contact:</span>
                  <span className="font-semibold text-forest">{essentials.organization.phone}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Transportation & Services */}
          <div className="bg-gradient-to-r from-sage-green/5 to-rich-earth/5 rounded-xl p-4">
            <h4 className="font-medium text-forest text-sm mb-3">Services & Connectivity</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Car className={`w-5 h-5 ${
                  essentials.transportation.airport_pickup ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Airport Pickup
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  essentials.transportation.airport_pickup ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Car className={`w-5 h-5 ${
                  essentials.transportation.local_transport ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Local Transport
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  essentials.transportation.local_transport ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Wifi className={`w-5 h-5 ${
                  essentials.internet_access.available ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium capitalize">
                  {essentials.internet_access.quality} WiFi
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  essentials.internet_access.available ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-forest/70 leading-relaxed">
                {essentials.transportation.description}
              </p>
            </div>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  );
};

export default EssentialInfoSidebar;