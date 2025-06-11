// src/components/OrganizationDetail/EssentialInfoSidebar.tsx
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
  ChevronUp
} from 'lucide-react';
import { OrganizationDetail, Program } from '../../types';

interface EssentialInfoSidebarProps {
  organization: OrganizationDetail;
  selectedProgram: Program;
  isDesktop?: boolean;
  sidebarExpanded?: boolean;
  className?: string;
}

const EssentialInfoSidebar: React.FC<EssentialInfoSidebarProps> = ({ 
  organization, 
  selectedProgram, 
  isDesktop = false, 
  sidebarExpanded = true,
  className = ''
}) => {
  const mainProgram = selectedProgram;
  
  // Enhanced responsive disclosure state - all expanded on desktop, progressive on mobile
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cost: true, // Keep cost always visible as it's critical
    duration: true, // Keep duration always visible as it's critical
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
  
  // Enhanced responsive card component - simplified for desktop, touch-friendly for mobile
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
      {/* Quick Facts Header - Always visible for orientation */}
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
      
      {/* Cost Information - Critical info, always expanded */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rich-earth/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-rich-earth" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Cost</h3>
        </div>
        
        <div className="space-y-4">
          {/* Mobile-optimized cost display */}
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-warm-sunset/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-forest mb-1">
              {mainProgram.cost.amount === 0 ? 'FREE' : `${mainProgram.cost.amount} ${mainProgram.cost.currency}`}
            </div>
            <div className="text-sm text-forest/70">
              {mainProgram.cost.amount === 0 ? 'No program fees' : `per ${mainProgram.cost.period}`}
            </div>
          </div>
          
          {/* What's Included - Mobile-optimized */}
          <div className="space-y-3">
            <h4 className="font-medium text-forest text-sm">What's Included:</h4>
            <div className="grid grid-cols-1 gap-2">
              {mainProgram.cost.includes.slice(0, 4).map((item, index) => (
                <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-2 bg-sage-green/5 rounded-lg">
                  <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            {mainProgram.cost.includes.length > 4 && (
              <div className="text-sm text-sage-green font-medium text-center p-2 bg-sage-green/10 rounded-lg">
                +{mainProgram.cost.includes.length - 4} more benefits included
              </div>
            )}
          </div>
        </div>
      </ResponsiveCard>
      
      {/* Duration - Critical info, always expanded */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warm-sunset/10 rounded-lg">
            <Calendar className="w-5 h-5 text-warm-sunset" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Duration</h3>
        </div>
        
        <div className="space-y-4">
          {/* Mobile-optimized duration display */}
          <div className="text-center bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-forest mb-1">
              {mainProgram.duration.min} - {mainProgram.duration.max || '∞'} weeks
            </div>
            <div className="text-sm text-forest/70">
              Flexible length options
            </div>
          </div>
          
          {/* Schedule details - mobile-optimized */}
          <div className="space-y-3">
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Minimum stay:</span>
                <span className="font-semibold text-forest">{mainProgram.duration.min} weeks</span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Work schedule:</span>
                <span className="font-semibold text-forest">{mainProgram.schedule.daysPerWeek} days/week</span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Daily hours:</span>
                <span className="font-semibold text-forest">{mainProgram.schedule.hoursPerDay} hours/day</span>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveCard>
      
      {/* Age Requirements - Always expanded on desktop, expandable on mobile */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.requirements}
        onToggle={() => toggleSection('requirements')}
        title="Age & Requirements"
      >
        <div className="space-y-4">
          {/* Age requirements */}
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-sage-green/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-forest mb-1">
              {organization.ageRequirement.min}+ years old
              {organization.ageRequirement.max && ` (max ${organization.ageRequirement.max})`}
            </div>
            <div className="text-sm text-forest/70">
              Minimum age for volunteers
            </div>
          </div>
        </div>
        
        {/* Essential Requirements */}
        {organization.skillRequirements.required.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-forest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-warm-sunset" />
              Essential Requirements
            </h4>
            <div className="space-y-2">
              {organization.skillRequirements.required.slice(0, 4).map((requirement, index) => (
                <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-3 bg-warm-sunset/5 rounded-lg">
                  <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0" />
                  <span className="leading-relaxed">{requirement}</span>
                </div>
              ))}
              {organization.skillRequirements.required.length > 4 && (
                <div className="text-sm text-warm-sunset font-medium text-center p-2 bg-warm-sunset/10 rounded-lg">
                  +{organization.skillRequirements.required.length - 4} more requirements
                </div>
              )}
            </div>
          </div>
        )}
      </ResponsiveCard>
      
      {/* Languages - Always expanded on desktop, expandable on mobile */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
        title="Languages & Communication"
      >
        <div className="flex flex-wrap gap-3">
          {organization.languages.map((language, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language}
            </span>
          ))}
        </div>
      </ResponsiveCard>
      
      {/* Accommodation - Always expanded on desktop, expandable on mobile */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.accommodation}
        onToggle={() => toggleSection('accommodation')}
        title="Accommodation & Amenities"
      >
        <div className="space-y-4">
          {/* Accommodation type */}
          <div className="text-center bg-gradient-to-r from-rich-earth/5 to-warm-beige/20 rounded-xl p-4">
            <div className="text-lg font-bold text-forest mb-2 capitalize">
              {organization.accommodation.provided ? 
                organization.accommodation.type.replace('_', ' ') : 
                'Not Provided'
              }
            </div>
            <div className="text-sm text-forest/70 leading-relaxed">
              {organization.accommodation.description}
            </div>
          </div>
          
          {/* Amenities - mobile-optimized */}
          {organization.accommodation.provided && organization.accommodation.amenities.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-rich-earth" />
                Available Amenities
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {organization.accommodation.amenities.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-2 bg-rich-earth/5 rounded-lg">
                    <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{amenity}</span>
                  </div>
                ))}
              </div>
              {organization.accommodation.amenities.length > 6 && (
                <div className="text-sm text-rich-earth font-medium text-center p-2 bg-rich-earth/10 rounded-lg">
                  +{organization.accommodation.amenities.length - 6} more amenities
                </div>
              )}
            </div>
          )}
        </div>
      </ResponsiveCard>
      
      {/* Meals - Always expanded on desktop, expandable on mobile */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.meals}
        onToggle={() => toggleSection('meals')}
        title="Meals & Dietary Options"
      >
        <div className="space-y-4">
          {/* Meal provision status */}
          <div className="text-center bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
            <div className="text-lg font-bold text-forest mb-2">
              {organization.meals.provided ? 'Meals Included' : 'Meals Not Provided'}
            </div>
            {organization.meals.provided && (
              <div className="text-sm text-forest/70 capitalize mb-2">
                {organization.meals.type.replace('_', ' ')}
              </div>
            )}
            {organization.meals.provided && (
              <div className="text-sm text-forest/70 leading-relaxed">
                {organization.meals.description}
              </div>
            )}
          </div>
          
          {/* Dietary options - mobile-optimized */}
          {organization.meals.provided && organization.meals.dietaryOptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-warm-sunset" />
                Available Dietary Options
              </h4>
              <div className="flex flex-wrap gap-2">
                {organization.meals.dietaryOptions.map((option, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-warm-sunset/10 text-warm-sunset rounded-full text-sm font-medium"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ResponsiveCard>
      
      {/* Location & Logistics - Final section with transport details */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sage-green/10 rounded-lg">
            <MapPin className="w-5 h-5 text-sage-green" />
          </div>
          <h3 className="text-lg font-semibold text-forest">Location & Access</h3>
        </div>
        
        <div className="space-y-4">
          {/* Location details - mobile-optimized */}
          <div className="space-y-3">
            <div className="bg-sage-green/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Region:</span>
                <span className="font-semibold text-forest">{organization.location.region}</span>
              </div>
            </div>
            <div className="bg-sage-green/5 rounded-lg p-3">
              <div className="flex flex-col gap-1">
                <span className="text-forest/70 text-sm">Nearest Airport:</span>
                <span className="font-semibold text-forest text-sm leading-relaxed">
                  {organization.location.nearestAirport}
                </span>
              </div>
            </div>
          </div>
          
          {/* Transportation & Services - Enhanced mobile layout */}
          <div className="bg-gradient-to-r from-sage-green/5 to-rich-earth/5 rounded-xl p-4">
            <h4 className="font-medium text-forest text-sm mb-3">Services & Connectivity</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Car className={`w-5 h-5 ${
                  organization.transportation.airportPickup ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Airport Pickup
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  organization.transportation.airportPickup ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Car className={`w-5 h-5 ${
                  organization.transportation.localTransport ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Local Transport
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  organization.transportation.localTransport ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Wifi className={`w-5 h-5 ${
                  organization.internetAccess.available ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium capitalize">
                  {organization.internetAccess.quality} WiFi
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  organization.internetAccess.available ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
            </div>
            
            {/* Transportation description */}
            <div className="mt-3 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-forest/70 leading-relaxed">
                {organization.transportation.description}
              </p>
            </div>
          </div>
        </div>
      </ResponsiveCard>

    </div>
  );
};

export default EssentialInfoSidebar;