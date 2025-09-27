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
import { OrganizationDetail } from '../../types';
import { useOrganizationEssentials, useTabDataState } from '../../hooks/useOrganizationTabData';

interface EssentialInfoSidebarProps {
  organization: OrganizationDetail;
  isDesktop?: boolean;
  className?: string;
}

const EssentialInfoSidebar: React.FC<EssentialInfoSidebarProps> = ({
  organization,
  isDesktop = false,
  className = ''
}) => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Fetch real database data using proper service method
  const essentialsQuery = useOrganizationEssentials(organization?.slug || '');
  const { data: essentialsData, isLoading, error } = useTabDataState(essentialsQuery, 'Essential Info');

  // Enhanced responsive disclosure state - all expanded on desktop, progressive on mobile
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cost: true, // Keep cost always visible as it's critical
    duration: true, // Keep duration always visible as it's critical
    requirements: isDesktop ? true : false,
    accommodation: isDesktop ? true : false,
    meals: isDesktop ? true : false,
    location: isDesktop ? true : false
  });

  // Update expanded sections when switching to/from desktop - MOVED TO TOP
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

  // Early return if organization is not provided
  if (!organization) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-4">
          <p className="text-forest/60 text-sm">Organization information not available</p>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-warm-beige/40 rounded w-3/4"></div>
          <div className="h-4 bg-warm-beige/40 rounded w-1/2"></div>
          <div className="h-20 bg-warm-beige/40 rounded"></div>
          <div className="h-16 bg-warm-beige/40 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle error state - show basic fallback
  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-4">
          <p className="text-forest/60 text-sm mb-2">Unable to load essential info</p>
          <button 
            onClick={() => essentialsQuery.refetch()}
            className="px-3 py-1 bg-rich-earth text-white text-xs rounded hover:bg-deep-earth"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use database data if available, otherwise fallback to organization data
  const contactInfo = essentialsData?.organization || {
    id: organization.id,
    name: organization.name,
    region: organization.location?.region || 'Region not provided',
    nearest_airport: organization.location?.nearestAirport || 'Airport information not provided'
  };
  const primaryProgram = essentialsData?.primary_program;
  const accommodation = essentialsData?.accommodation;
  const mealPlan = essentialsData?.meal_plan;
  const transportation = essentialsData?.transportation;
  const internetAccess = essentialsData?.internet_access;
  const ageRequirement = essentialsData?.age_requirement;
  const keyRequirements = essentialsData?.key_requirements || [];
  const languages = essentialsData?.languages || [];

  // Create fallback program structure with proper database-ready format
  const mainProgram = primaryProgram || {
    title: 'Wildlife Conservation Program',
    cost_amount: null,
    cost_currency: 'USD',
    cost_period: 'week',
    duration_min_weeks: 1,
    duration_max_weeks: null,
    hours_per_day: null,
    days_per_week: null
  };
  
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
              {mainProgram?.cost_amount === 0 ? 'FREE' : 
               mainProgram?.cost_amount ? `${mainProgram.cost_amount} ${mainProgram.cost_currency || 'USD'}` : 
               'Cost not provided'}
            </div>
            <div className="text-sm text-forest/70">
              {mainProgram?.cost_amount === 0 ? 'No program fees' : 
               mainProgram?.cost_amount ? `per ${mainProgram.cost_period || 'week'}` :
               'Contact organization for pricing details'}
            </div>
          </div>
          
          {/* What's Included - Database or fallback */}
          <div className="space-y-3">
            <h4 className="font-medium text-forest text-sm">What's Included:</h4>
            {essentialsData?.cost_includes && essentialsData.cost_includes.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {essentialsData.cost_includes.map((item, index) => (
                  <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-2 bg-sage-green/5 rounded-lg">
                    <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{item.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-sage-green/5 rounded-lg p-3 text-center">
                <p className="text-sm text-forest/60 italic">
                  Cost breakdown details not provided by organization.
                </p>
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
              {mainProgram?.duration_min_weeks || 1} - {mainProgram?.duration_max_weeks || '∞'} weeks
            </div>
            <div className="text-sm text-forest/70">
              {mainProgram?.duration_min_weeks && mainProgram?.duration_max_weeks ? 
                'Flexible duration options' : 
                'Duration details not provided'}
            </div>
          </div>
          
          {/* Schedule details - mobile-optimized */}
          <div className="space-y-3">
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Minimum stay:</span>
                <span className="font-semibold text-forest">
                  {mainProgram?.duration_min_weeks ? `${mainProgram.duration_min_weeks} weeks` : 'Not specified'}
                </span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Work schedule:</span>
                <span className="font-semibold text-forest">
                  {mainProgram?.days_per_week ? `${mainProgram.days_per_week} days/week` : 'Not specified'}
                </span>
              </div>
            </div>
            <div className="bg-warm-sunset/5 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forest/70">Daily hours:</span>
                <span className="font-semibold text-forest">
                  {mainProgram?.hours_per_day ? `${mainProgram.hours_per_day} hours/day` : 'Not specified'}
                </span>
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
              {ageRequirement?.min_age || 18}+ years old
              {ageRequirement?.max_age && ` (max ${ageRequirement.max_age})`}
            </div>
            <div className="text-sm text-forest/70">
              {ageRequirement?.min_age ? 'Minimum age requirement' : 'Default minimum age (contact to confirm)'}
            </div>
            {ageRequirement?.special_conditions && (
              <div className="text-xs text-forest/60 mt-2 italic">
                {ageRequirement.special_conditions}
              </div>
            )}
          </div>
        </div>
        
        {/* Essential Requirements */}
        {keyRequirements.length > 0 ? (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-forest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-warm-sunset" />
              Key Requirements
            </h4>
            {keyRequirements.length <= 3 ? (
              <div className="space-y-2">
                {keyRequirements.map((requirement, index) => (
                  <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-3 bg-warm-sunset/5 rounded-lg">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{requirement.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-xl p-4">
                <div className="text-sm text-forest/80 leading-relaxed mb-3">
                  <strong>{keyRequirements.length} essential requirements</strong> including various volunteer prerequisites.
                </div>
                <button className="text-sm font-medium text-warm-sunset hover:text-deep-earth transition-colors duration-200 flex items-center gap-2">
                  <span>View complete requirements in Experience tab</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-forest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-warm-sunset" />
              Key Requirements
            </h4>
            <div className="bg-warm-sunset/5 rounded-lg p-3 text-center">
              <p className="text-sm text-forest/60 italic">
                Specific requirements not provided by organization.
              </p>
            </div>
          </div>
        )}
      </ResponsiveCard>
      
      {/* Languages - Streamlined for decision-making */}
      <ResponsiveCard 
        expandable={!isDesktop}
        expanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
        title="Languages & Communication"
      >
        <div className="space-y-3">
          {languages.length > 0 ? (
            languages.length <= 3 ? (
              <div className="flex flex-wrap gap-3">
                {languages.map((language, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium flex items-center gap-2 border border-sage-green/20"
                  >
                    <Globe className="w-4 h-4" />
                    {language.name}
                    {language.proficiency_level && (
                      <span className="text-xs bg-sage-green/20 px-2 py-1 rounded">
                        {language.proficiency_level}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-sage-green/5 to-forest/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-sage-green" />
                  <span className="font-medium text-forest">{languages[0]?.name}</span>
                  <span className="text-sm text-forest/60">+ {languages.length - 1} more</span>
                </div>
                <div className="text-sm text-forest/70 leading-relaxed">
                  Multiple language support available for international volunteers.
                </div>
              </div>
            )
          ) : (
            <div className="bg-sage-green/5 rounded-lg p-4 text-center">
              <Globe className="w-8 h-8 text-sage-green/30 mx-auto mb-2" />
              <p className="text-sm text-forest/60 italic">
                Language information not provided by organization.
              </p>
            </div>
          )}
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
              {accommodation?.provided ? (
                accommodation.accommodation_type && accommodation.accommodation_type !== 'none' ?
                  accommodation.accommodation_type.replace('_', ' ') :
                  'Type not specified'
              ) : 'Not Provided'}
            </div>
            <div className="text-sm text-forest/70 leading-relaxed">
              {accommodation?.description || 'Accommodation details not provided by organization'}
            </div>
            {accommodation?.max_capacity && (
              <div className="text-xs text-forest/60 mt-2">
                Max capacity: {accommodation.max_capacity} volunteers
              </div>
            )}
          </div>
          
          {/* Amenities - Smart summary approach */}
          {accommodation?.provided && essentialsData?.amenities && essentialsData.amenities.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-rich-earth" />
                Key Amenities
              </h4>
              {essentialsData.amenities.length <= 4 ? (
                <div className="grid grid-cols-1 gap-2">
                  {essentialsData.amenities.map((amenity, index) => (
                    <div key={index} className="text-sm text-forest/80 flex items-center gap-3 p-2 bg-rich-earth/5 rounded-lg">
                      <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0" />
                      <span className="leading-relaxed">{amenity.amenity_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-rich-earth/5 to-warm-beige/20 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {essentialsData.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-rich-earth/10 text-rich-earth rounded-full text-xs font-medium">
                        {amenity.amenity_name}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-forest/70 leading-relaxed mb-2">
                    <strong>{essentialsData.amenities.length} total amenities</strong> including essentials and comfort features.
                  </div>
                  <button className="text-sm font-medium text-rich-earth hover:text-deep-earth transition-colors duration-200 flex items-center gap-2">
                    <span>Complete amenities list in Practical tab</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : accommodation?.provided ? (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-rich-earth" />
                Amenities
              </h4>
              <div className="bg-rich-earth/5 rounded-lg p-4 text-center">
                <p className="text-sm text-forest/60 italic">
                  Accommodation amenities not specified by organization.
                </p>
              </div>
            </div>
          ) : null}
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
              {mealPlan?.provided ? 'Meals Included' : 'Meals Not Provided'}
            </div>
            {mealPlan?.provided && mealPlan.meal_type && mealPlan.meal_type !== 'none' && (
              <div className="text-sm text-forest/70 capitalize mb-2">
                {mealPlan.meal_type.replace('_', ' ')}
              </div>
            )}
            {mealPlan?.provided && (
              <div className="text-sm text-forest/70 leading-relaxed">
                {mealPlan.description || 'Meal details not provided by organization'}
              </div>
            )}
          </div>
          
          {/* Dietary options - Complete and accessible */}
          {mealPlan?.provided && essentialsData?.dietary_options && essentialsData.dietary_options.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-warm-sunset" />
                Dietary Options Available
              </h4>
              <div className="flex flex-wrap gap-2">
                {essentialsData.dietary_options.map((option, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-warm-sunset/10 text-warm-sunset rounded-full text-sm font-medium border border-warm-sunset/20"
                  >
                    {option.option_name}
                  </span>
                ))}
              </div>
            </div>
          ) : mealPlan?.provided ? (
            <div className="space-y-3">
              <h4 className="font-medium text-forest text-sm flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-warm-sunset" />
                Dietary Options
              </h4>
              <div className="bg-warm-sunset/5 rounded-lg p-3 text-center">
                <p className="text-sm text-forest/60 italic">
                  Dietary options not specified by organization.
                </p>
              </div>
            </div>
          ) : null}
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
                <span className="font-semibold text-forest">{contactInfo.region || 'Region not provided'}</span>
              </div>
            </div>
            <div className="bg-sage-green/5 rounded-lg p-3">
              <div className="flex flex-col gap-1">
                <span className="text-forest/70 text-sm">Nearest Airport:</span>
                <span className="font-semibold text-forest text-sm leading-relaxed">
                  {contactInfo.nearest_airport || 'Airport information not provided'}
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
                  transportation?.airport_pickup ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Airport Pickup
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  transportation?.airport_pickup ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Car className={`w-5 h-5 ${
                  transportation?.local_transport ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium">
                  Local Transport
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  transportation?.local_transport ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-white/70 rounded-lg">
                <Wifi className={`w-5 h-5 ${
                  internetAccess?.available ? 'text-sage-green' : 'text-gray-400'
                }`} />
                <span className="text-xs text-forest/80 text-center font-medium capitalize">
                  {internetAccess?.quality ? `${internetAccess.quality} WiFi` : 'WiFi not specified'}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  internetAccess?.available ? 'bg-sage-green' : 'bg-gray-300'
                }`} />
              </div>
            </div>
            
            {/* Transportation description */}
            <div className="mt-3 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-forest/70 leading-relaxed">
                {transportation?.description || 'Transportation details not provided by organization.'}
                {transportation?.additional_cost && transportation.additional_cost > 0 && (
                  <span className="block mt-1 font-medium text-warm-sunset">
                    Additional cost: ${transportation.additional_cost}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </ResponsiveCard>

    </div>
  );
};

export default EssentialInfoSidebar;