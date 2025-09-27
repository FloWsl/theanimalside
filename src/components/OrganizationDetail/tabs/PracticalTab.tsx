// src/components/OrganizationDetail/tabs/PracticalTab.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Heart, 
  Shield,
  Plane,
  CheckCircle,
  Calendar,
  MapPin,
  Home,
  Utensils,
  Users,
  Camera,
  Wifi,
  Car
} from 'lucide-react';
import { OrganizationDetail, Program } from '../../../types';
import SharedTabSection from '../SharedTabSection';
import { scrollToTabContent } from '../../../lib/scrollUtils';
import { useOrganizationPractical, useTabDataState } from '../../../hooks/useOrganizationTabData';
import { generatePackingGuide, getGuideButtonStyling } from '../../../utils/guideUtils';

interface PracticalTabProps {
  organization: OrganizationDetail;
  selectedProgram: Program;
  isDesktop?: boolean;
  sidebarVisible?: boolean;
  hideDuplicateInfo?: boolean;
  onTabChange?: (tabId: string) => void;
}

// Photo-First Accommodation Gallery Component
const AccommodationGallery: React.FC<{ photos: string[] }> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-warm-beige/30 to-gentle-lemon/20 rounded-xl p-8 text-center border border-beige/40">
        <Camera className="w-12 h-12 text-forest/30 mx-auto mb-3" />
        <div className="text-sm font-medium text-forest/60 mb-1">Accommodation Photos</div>
        <p className="text-xs text-forest/50">Images coming soon</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-3">
        {/* Main Photo Display */}
        <div 
          className="aspect-[4/3] bg-warm-beige/30 rounded-xl overflow-hidden cursor-pointer group relative"
          onClick={() => setIsModalOpen(true)}
        >
          <img 
            src={photos[selectedPhoto]} 
            alt="Accommodation view"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-3 left-3 text-white">
              <div className="text-xs font-medium bg-forest/60 px-2 py-1 rounded">Click to enlarge</div>
            </div>
          </div>
          
          {/* Photo Counter */}
          {photos.length > 1 && (
            <div className="absolute top-3 right-3 bg-forest/60 text-white text-xs px-2 py-1 rounded">
              {selectedPhoto + 1} / {photos.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail Navigation */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPhoto === index 
                    ? 'border-sage-green shadow-lg scale-105' 
                    : 'border-transparent hover:border-sage-green/50'
                }`}
              >
                <img 
                  src={photo} 
                  alt={`Accommodation view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Simple Modal for Full-Size View */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-forest/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={photos[selectedPhoto]} 
              alt="Accommodation full view"
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-forest rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const PracticalTab: React.FC<PracticalTabProps> = ({ 
  organization, 
  selectedProgram, 
  isDesktop = false,
  sidebarVisible = false,
  hideDuplicateInfo = false,
  onTabChange 
}) => {
  const navigate = useNavigate();
  
  // Fetch real database data using proper service method
  const practicalQuery = useOrganizationPractical(organization.slug);
  const { data: practicalData, isLoading, error } = useTabDataState(practicalQuery, 'Practical');

  // Use database primary program data if available, otherwise fallback to selectedProgram
  const programData = practicalData?.primary_program || selectedProgram;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-warm-beige/40 rounded w-1/3"></div>
          <div className="h-20 bg-warm-beige/40 rounded"></div>
          <div className="h-32 bg-warm-beige/40 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="text-center py-8">
          <p className="text-forest/60 mb-4">Unable to load practical information</p>
          <button 
            onClick={() => practicalQuery.refetch()}
            className="px-4 py-2 bg-rich-earth text-white rounded hover:bg-deep-earth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      {/* LEVEL 1: ESSENTIAL - Always Visible */}
      <SharedTabSection
        title="Essential Information"
        variant="hero"
        level="essential"
        icon={Shield}
      >
        <p className="text-body-large text-forest/90 max-w-3xl mx-auto text-center">
          The key details you need to know about this volunteer program.
        </p>
        
        {/* Essential Quick Facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-rich-earth/20">
            <div className="text-xl sm:text-2xl font-bold text-rich-earth mb-1">
              {programData?.cost_amount === 0 || programData?.cost_amount === "0.00" ? 'FREE' : 
               programData?.cost_amount ? `${programData.cost_currency || 'USD'}${programData.cost_amount}` :
               (selectedProgram?.cost?.amount === 0 ? 'FREE' : `${selectedProgram?.cost?.currency || 'USD'}${selectedProgram?.cost?.amount || 'TBD'}`)
              }
            </div>
            <div className="text-xs sm:text-sm text-deep-forest/70">Program cost</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-warm-sunset/20">
            <div className="text-xl sm:text-2xl font-bold text-warm-sunset mb-1">
              {programData?.duration_min_weeks ? 
                `${programData.duration_min_weeks}-${programData.duration_max_weeks || '∞'}` :
                `${selectedProgram?.duration?.min || 1}-${selectedProgram?.duration?.max || '∞'}`
              }
            </div>
            <div className="text-xs sm:text-sm text-deep-forest/70">Weeks</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-sage-green/20">
            <div className="text-xl sm:text-2xl font-bold text-sage-green mb-1">
              {practicalData?.age_requirement?.min_age || 18}+
            </div>
            <div className="text-xs sm:text-sm text-deep-forest/70">Years old</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-golden-hour/20">
            <div className="text-sm sm:text-lg font-bold text-golden-hour mb-1">
              {practicalData?.accommodation?.provided ? '✓' : '✗'}
            </div>
            <div className="text-xs sm:text-sm text-deep-forest/70">Housing</div>
          </div>
        </div>
      </SharedTabSection>
      
      {/* LEVEL 1: ACCOMMODATION - Essential */}
      <SharedTabSection
        title="Your Accommodation"
        variant="section"
        level="essential"
        icon={Home}
        className="mt-8"
      >
        <div className="space-y-6">
          {practicalData?.accommodation?.description ? (
            <div className="text-center">
              <h3 className="text-lg sm:text-xl text-forest mb-3">Where You'll Stay</h3>
              <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
                {practicalData.accommodation.description}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-lg sm:text-xl text-forest mb-3">Accommodation Information</h3>
              <p className="text-sm sm:text-base text-forest/60 italic max-w-2xl mx-auto">
                Accommodation details not provided by organization.
              </p>
            </div>
          )}
          
          {/* Full-width accommodation showcase */}
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige to-gentle-lemon/20 rounded-2xl overflow-hidden shadow-nature border border-beige/60">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Photo gallery takes full width */}
              <AccommodationGallery photos={
                practicalData?.accommodation_photos?.length > 0 
                  ? practicalData.accommodation_photos.map(photo => photo.url)
                  : (organization.accommodation?.photos || [])
              } />
              
              {/* Details flow below in single column */}
              <div className="mt-8 space-y-6">
                
                {/* Accommodation description - Only show if provided and different from above */}
                {practicalData?.accommodation?.description && practicalData.accommodation.description !== 'Accommodation details not provided by organization' && (
                  <div className="text-center">
                    <p className="text-forest leading-relaxed text-lg max-w-3xl mx-auto">
                      {practicalData.accommodation.description}
                    </p>
                  </div>
                )}

                {/* Accommodation Details - Type and Capacity */}
                {(practicalData?.accommodation?.accommodation_type || practicalData?.accommodation?.max_capacity) && (
                  <div className="bg-warm-beige/30 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                      {practicalData.accommodation.accommodation_type && (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-rich-earth" />
                          <span className="font-medium text-forest">
                            {practicalData.accommodation.accommodation_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                      {practicalData.accommodation.max_capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-rich-earth" />
                          <span className="font-medium text-forest">
                            Up to {practicalData.accommodation.max_capacity} volunteers
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Amenities - Only show if organization provided real data */}
                {practicalData?.amenities && 
                 practicalData.amenities.length > 0 && 
                 practicalData.amenities[0]?.amenity_name ? (
                  <div className="bg-sage-green/5 rounded-lg p-4">
                    <h4 className="text-card-title text-sage-green mb-3 text-center">✨ Key Amenities</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {practicalData.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-white text-forest rounded-full text-sm border border-sage-green/20">
                          {amenity.amenity_name || amenity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-sage-green/5 rounded-lg p-4 text-center">
                    <h4 className="text-card-title text-sage-green mb-2">Amenities Not Specified</h4>
                    <p className="text-forest/60 italic text-sm">
                      Accommodation amenities not provided by organization.
                    </p>
                  </div>
                )}
                
                {/* Meals & Support - Essential admin-friendly info */}
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  
                  {/* Meals Information - Only show if organization provided real data */}
                  {practicalData?.meal_plan && practicalData.meal_plan.description ? (
                    <div className="bg-rich-earth/5 rounded-xl p-4 lg:p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Utensils className="w-5 h-5 text-rich-earth" />
                        <h4 className="text-card-title text-forest">Meals Included</h4>
                      </div>
                      <p className="text-forest/80 mb-4">
                        {practicalData.meal_plan.description}
                      </p>
                      {practicalData?.dietary_options && 
                       practicalData.dietary_options.length > 0 && 
                       practicalData.dietary_options[0]?.option_name && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-forest">Dietary Options:</div>
                          <div className="flex flex-wrap gap-2">
                            {practicalData.dietary_options.map((option, index) => (
                              <span key={index} className="px-3 py-1 bg-rich-earth/10 text-rich-earth rounded-full text-sm">
                                {option.option_name || option.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-rich-earth/5 rounded-xl p-4 lg:p-5 text-center">
                      <Utensils className="w-8 h-8 text-rich-earth/30 mx-auto mb-3" />
                      <h4 className="text-card-title text-forest mb-2">Meal Information Not Provided</h4>
                      <p className="text-forest/60 italic text-sm">
                        Meal details and dietary options not provided by organization.
                      </p>
                    </div>
                  )}
                  
                  {/* Program Support - Using database inclusions */}
                  {practicalData?.program_inclusions && practicalData.program_inclusions.length > 0 ? (
                    <div className="bg-sage-green/5 rounded-xl p-4 lg:p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-sage-green" />
                        <h4 className="text-card-title text-forest">Program Support & Inclusions</h4>
                      </div>
                      <div className="space-y-3">
                        {practicalData.program_inclusions
                          .filter(inclusion => inclusion.inclusion_type === 'included')
                          .slice(0, 6)
                          .map((inclusion, index) => (
                            <div key={index} className="text-sm text-forest/80 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-sage-green mt-0.5 flex-shrink-0" />
                              <span>{inclusion.item_name}</span>
                            </div>
                          ))}
                        {practicalData.program_inclusions.filter(inc => inc.inclusion_type === 'included').length > 6 && (
                          <div className="text-xs text-forest/60 italic">
                            + {practicalData.program_inclusions.filter(inc => inc.inclusion_type === 'included').length - 6} more inclusions
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-sage-green/5 rounded-xl p-4 lg:p-5 text-center">
                      <Users className="w-8 h-8 text-sage-green/30 mx-auto mb-3" />
                      <h4 className="text-card-title text-forest mb-2">Program Support Details Not Provided</h4>
                      <p className="text-forest/60 italic text-sm">
                        Support and coordination details not provided by organization.
                      </p>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>

      {/* LEVEL 1: BASIC REQUIREMENTS - Essential */}
      <SharedTabSection
        title="Basic Requirements"
        variant="section"
        level="essential"
        icon={CheckCircle}
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-sage-green/20">
            <Calendar className="w-8 h-8 text-sage-green mx-auto mb-3" />
            <div className="font-semibold text-forest mb-2">Age Requirement</div>
            <div className="text-sage-green font-bold">
              {practicalData?.age_requirement?.min_age || 18}+ years
              {practicalData?.age_requirement?.max_age && ` - ${practicalData.age_requirement.max_age} years`}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-rich-earth/20">
            <Heart className="w-8 h-8 text-rich-earth mx-auto mb-3" />
            <div className="font-semibold text-forest mb-2">Fitness Level</div>
            <div className="text-rich-earth font-bold text-sm">
              {(() => {
                // Check health requirements for fitness
                const healthFitness = practicalData?.health_requirements?.find(req => 
                  req.requirement_type === 'fitness' || req.requirement_name?.toLowerCase().includes('fitness')
                );
                // Check skill requirements for physical fitness
                const skillFitness = practicalData?.skill_requirements?.find(req => 
                  req.skill_name?.toLowerCase().includes('fitness') || req.skill_name?.toLowerCase().includes('physical')
                );
                
                if (healthFitness) {
                  return healthFitness.requirement_name || 'Basic fitness required';
                } else if (skillFitness) {
                  return skillFitness.skill_name || 'Physical fitness required';
                } else {
                  return 'Not specified';
                }
              })()}
            </div>
            <div className="text-xs text-forest/60 mt-1">
              {(() => {
                const healthFitness = practicalData?.health_requirements?.find(req => 
                  req.requirement_type === 'fitness' || req.requirement_name?.toLowerCase().includes('fitness')
                );
                const skillFitness = practicalData?.skill_requirements?.find(req => 
                  req.skill_name?.toLowerCase().includes('fitness') || req.skill_name?.toLowerCase().includes('physical')
                );
                
                if (healthFitness?.requirement_description) {
                  return healthFitness.requirement_description;
                } else if (skillFitness?.skill_description) {
                  return skillFitness.skill_description;
                } else {
                  return 'Contact organization for details';
                }
              })()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-warm-sunset/20">
            <MapPin className="w-8 h-8 text-warm-sunset mx-auto mb-3" />
            <div className="font-semibold text-forest mb-2">Languages</div>
            <div className="text-warm-sunset font-bold text-sm">
              {practicalData?.languages && practicalData.languages.length > 0 && practicalData.languages[0]?.language_name
                ? [...new Set(practicalData.languages.map(lang => lang.language_name || lang.name))].join(', ')
                : 'Not specified'
              }
            </div>
          </div>
        </div>
      </SharedTabSection>

      {/* LEVEL 2: EXPANDABLE SECTIONS */}
      
      {/* Internet & Communication */}
      <SharedTabSection
        title="Internet & Communication"
        variant="section"
        level="essential"
        icon={Wifi}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">Staying Connected</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              Essential information about internet access during your volunteer program.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                practicalData?.internet_access?.available ? 'bg-sage-green/20' : 'bg-gray-100'
              }`}>
                <Wifi className={`w-8 h-8 ${
                  practicalData?.internet_access?.available ? 'text-sage-green' : 'text-gray-400'
                }`} />
              </div>
              
              <div className="mb-4">
                <div className="text-lg font-semibold text-forest mb-2">
                  {practicalData?.internet_access?.available 
                    ? `${practicalData.internet_access.quality?.charAt(0).toUpperCase() + practicalData.internet_access.quality?.slice(1)} WiFi Available` 
                    : 'Limited Internet Access'
                  }
                </div>
                <p className="text-forest/80 leading-relaxed max-w-lg mx-auto">
                  {practicalData?.internet_access?.description || 'Internet access details not provided by organization'}
                </p>
              </div>
              
              {practicalData?.internet_access?.available && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {practicalData.internet_access.quality === 'excellent' || practicalData.internet_access.quality === 'good' 
                      ? 'Video calls and messaging supported'
                      : practicalData.internet_access.quality === 'fair'
                      ? 'Messaging and email supported'
                      : 'Basic connectivity available'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SharedTabSection>
      
      {/* Cost Breakdown */}
      <SharedTabSection
        title="Cost Breakdown"
        variant="section"
        level="important"
        icon={DollarSign}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">Program Investment</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              Complete breakdown of what's included and what you'll need to arrange separately.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Program Cost */}
              <div className="lg:col-span-1 bg-white rounded-xl p-6 text-center border border-rich-earth/30">
                <DollarSign className="w-12 h-12 text-rich-earth mx-auto mb-3" />
                <div className="text-sm font-medium text-forest/70 mb-2">Total Program Cost</div>
                <div className="text-3xl font-bold text-rich-earth mb-2">
                  {programData?.cost_amount === 0 || programData?.cost_amount === "0.00" ? 'FREE' : 
                   programData?.cost_amount ? `${programData.cost_currency || 'USD'}${programData.cost_amount}` :
                   'Contact for pricing'
                  }
                </div>
                <div className="text-forest/70 font-medium text-sm">per {programData?.cost_period || 'program'}</div>
              </div>
              
              {/* What's Included & Not Included */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* What's Included - Using database program_inclusions */}
                {practicalData?.program_inclusions?.filter(inc => inc.inclusion_type === 'included').length > 0 ? (
                  <div className="bg-white rounded-xl p-5 border border-sage-green/30">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-5 h-5 text-sage-green" />
                      <h4 className="font-semibold text-forest">What's Included</h4>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                      {practicalData.program_inclusions
                        .filter(inc => inc.inclusion_type === 'included')
                        .map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-forest">{item.item_name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-5 border border-sage-green/30 text-center">
                    <CheckCircle className="w-8 h-8 text-sage-green/30 mx-auto mb-3" />
                    <h4 className="font-semibold text-forest mb-2">Inclusions Not Specified</h4>
                    <p className="text-forest/60 italic text-sm">
                      Program inclusions not provided by organization. Contact them for details.
                    </p>
                  </div>
                )}
                
                {/* What's Not Included - Using database program_inclusions */}
                {practicalData?.program_inclusions?.filter(inc => inc.inclusion_type === 'excluded').length > 0 ? (
                  <div className="bg-white rounded-xl p-5 border border-warm-sunset/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Plane className="w-5 h-5 text-warm-sunset" />
                      <h4 className="font-semibold text-forest">Additional Expenses</h4>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                      {practicalData.program_inclusions
                        .filter(inc => inc.inclusion_type === 'excluded')
                        .map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 border border-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-forest/80">{item.item_name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-5 border border-warm-sunset/30 text-center">
                    <Plane className="w-8 h-8 text-warm-sunset/30 mx-auto mb-3" />
                    <h4 className="font-semibold text-forest mb-2">Additional Expenses Not Specified</h4>
                    <p className="text-forest/60 italic text-sm">
                      Additional expenses not specified by organization. Contact them for details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>
      
      {/* What You Need to Arrange */}
      <SharedTabSection
        title="What You Need to Arrange"
        variant="section"
        level="important"
        icon={Plane}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">Travel Arrangements</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              {practicalData?.program_inclusions?.filter(inc => inc.inclusion_type === 'excluded').length > 0 
                ? 'These services are not included in the program cost. You\'ll need to arrange them separately.'
                : 'Essential travel arrangements you\'ll need to organize independently.'
              }
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            <div className="space-y-6">
              {/* Essential Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Flights */}
                <div className="bg-white p-5 border border-rich-earth/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Plane className="w-5 h-5 text-rich-earth" />
                    <h4 className="font-semibold text-forest">International Flights</h4>
                  </div>
                  <p className="text-sm text-forest/70 mb-3">
                    To {organization.nearest_airport || organization.city}. Book 2-3 months ahead for better rates.
                  </p>
                  <button 
                    className="text-sm text-rich-earth hover:underline transition-colors hover:text-deep-forest"
                    data-affiliate-type="flights"
                    data-destination={organization.country}
                    onClick={() => {
                      // TODO: Add affiliate flight search functionality
                      console.log('Flight search clicked for:', organization.country);
                    }}
                  >
                    Search flights →
                  </button>
                </div>
                
                {/* Insurance */}
                <div className="bg-white p-5 border border-sage-green/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-sage-green" />
                    <h4 className="font-semibold text-forest">Travel Insurance</h4>
                  </div>
                  <p className="text-sm text-forest/70 mb-3">
                    Recommended for medical coverage and trip protection.
                  </p>
                  <button 
                    className="text-sm text-sage-green hover:underline transition-colors hover:text-deep-forest"
                    data-affiliate-type="insurance"
                    data-destination={organization.country}
                    onClick={() => {
                      // TODO: Add affiliate insurance search functionality
                      console.log('Insurance search clicked for:', organization.country);
                    }}
                  >
                    Get insurance quote →
                  </button>
                </div>
              </div>
              
              {/* Other Services */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-warm-beige/30">
                <div className="text-center p-3 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-warm-sunset mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Visas</div>
                  <button 
                    className="text-xs text-warm-sunset hover:underline transition-colors hover:text-deep-forest"
                    data-affiliate-type="visa"
                    data-destination={organization.country}
                    onClick={() => {
                      // TODO: Add affiliate visa service functionality
                      console.log('Visa service clicked for:', organization.country);
                    }}
                  >
                    Check requirements
                  </button>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Heart className="w-5 h-5 text-golden-hour mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Health prep</div>
                  <button 
                    className="text-xs text-golden-hour hover:underline transition-colors hover:text-deep-forest"
                    data-affiliate-type="health"
                    data-destination={organization.country}
                    onClick={() => {
                      // TODO: Add affiliate travel health service functionality
                      console.log('Travel health service clicked for:', organization.country);
                    }}
                  >
                    Find clinics
                  </button>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Camera className="w-5 h-5 text-sage-green mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Travel gear</div>
                  <button 
                    onClick={() => {
                      const packingSection = document.querySelector('[data-section="packing"]');
                      if (packingSection) {
                        packingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-xs text-sage-green hover:underline cursor-pointer"
                  >
                    See packing guide ↓
                  </button>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Car className="w-5 h-5 text-rich-earth mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Airport transfer</div>
                  <button 
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('location');
                        scrollToTabContent();
                      }
                    }}
                    className="text-xs text-rich-earth hover:underline cursor-pointer"
                  >
                    See Location tab →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>
      
      {/* Packing Essentials */}
      <SharedTabSection
        title="Packing Essentials"
        variant="section"
        level="important"
        icon={CheckCircle}
        className="mt-8"
      >
        <div className="space-y-6" data-section="packing">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">What to Bring</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              Essential items for conservation work and comfortable living in {organization.country}.
            </p>
          </div>
          
          {/* Show packing lists from database if organization provided them */}
          {(() => {
            const programData = practicalData?.primary_program;
            const hasPackingData = programData && (
              (programData.packing_essential && programData.packing_essential.length > 0) ||
              (programData.packing_work_gear && programData.packing_work_gear.length > 0) ||
              (programData.packing_optional && programData.packing_optional.length > 0)
            );
            
            return hasPackingData ? (
              <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Essential Items - Only show if provided */}
                  {programData.packing_essential && programData.packing_essential.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-warm-sunset/20">
                      <h4 className="font-semibold text-forest mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-warm-sunset/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-warm-sunset" />
                        </div>
                        Essential Items
                      </h4>
                      <div className="space-y-2">
                        {programData.packing_essential.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-forest">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Gear - Only show if provided */}
                  {programData.packing_work_gear && programData.packing_work_gear.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-sage-green/20">
                      <h4 className="font-semibold text-forest mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-sage-green" />
                        </div>
                        Conservation Work Gear
                      </h4>
                      <div className="space-y-2">
                        {programData.packing_work_gear.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-forest">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Items - Only show if provided */}
                  {programData.packing_optional && programData.packing_optional.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-golden-hour/20">
                      <h4 className="font-semibold text-forest mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-golden-hour/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-golden-hour" />
                        </div>
                        Optional Items
                      </h4>
                      <div className="space-y-2">
                        {programData.packing_optional.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-golden-hour rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-forest">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-forest/30 mx-auto mb-4" />
                  <h4 className="font-semibold text-forest mb-2">Packing Information Not Provided</h4>
                  <p className="text-forest/60 italic max-w-lg mx-auto">
                    The organization hasn't provided specific packing recommendations.
                  </p>
                </div>
              </div>
            );
          })()}
          
          {/* Always show packing guide - great for UX, SEO, and affiliate value */}
          {(() => {
            // Generate context-dependent guide info
            const guideInfo = generatePackingGuide({
              country: organization.country,
              climate: organization.climate?.type,
              animalTypes: organization.animalTypes?.map(type => type.animalType) || [],
              region: organization.region
            });
            
            const buttonStyling = getGuideButtonStyling(guideInfo.guideSlug);
            
            return (
              <div className="mt-6 pt-6 border-t border-warm-beige/40 text-center">
                <p className="text-sm text-forest/70 mb-4">Need packing inspiration?</p>
                <button 
                  className={`inline-flex items-center gap-2 px-4 py-3 bg-white border ${buttonStyling.borderColor} rounded-xl ${buttonStyling.textColor} ${buttonStyling.hoverBg} transition-colors font-medium`}
                  data-guide-slug={guideInfo.guideSlug}
                  data-guide-context={JSON.stringify(guideInfo.context)}
                  onClick={() => {
                    navigate(guideInfo.url);
                  }}
                >
                  {guideInfo.emoji} {guideInfo.buttonText}
                </button>
              </div>
            );
          })()}
        </div>
      </SharedTabSection>

      {/* Detailed Requirements */}
      <SharedTabSection
        title="Program Requirements"
        variant="section"
        level="important"
        icon={Shield}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">What's Expected</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              Specific requirements for this conservation program to ensure safety and program effectiveness.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            {(() => {
              // Organize requirements by category from database
              const requirementCategories = {
                essential: [],
                health: [],
                language: [],
                preferred: []
              };
              
              // Add required skill requirements
              if (practicalData?.skill_requirements) {
                practicalData.skill_requirements
                  .filter(req => req.requirement_type === 'required')
                  .forEach(req => {
                    requirementCategories.essential.push({
                      text: req.skill_name,
                      description: req.skill_description,
                      icon: '🎯'
                    });
                  });
                
                // Add preferred skills separately
                practicalData.skill_requirements
                  .filter(req => req.requirement_type === 'preferred')
                  .forEach(req => {
                    requirementCategories.preferred.push({
                      text: req.skill_name,
                      description: req.skill_description,
                      icon: '⭐'
                    });
                  });
              }
              
              // Add mandatory health requirements
              if (practicalData?.health_requirements) {
                practicalData.health_requirements
                  .filter(req => req.is_mandatory)
                  .forEach(req => {
                    const icon = req.requirement_type === 'fitness' ? '💪' : 
                                req.requirement_type === 'vaccination' ? '💉' :
                                req.requirement_type === 'medical_clearance' ? '🏥' :
                                req.requirement_type === 'insurance' ? '🛡️' : '❤️';
                    
                    requirementCategories.health.push({
                      text: req.requirement_name,
                      description: req.requirement_description,
                      icon
                    });
                  });
              }
              
              // Add required language requirements
              if (practicalData?.languages) {
                practicalData.languages
                  .filter(lang => lang.is_required)
                  .forEach(lang => {
                    const proficiencyText = lang.proficiency_level === 'native' ? 'Native' :
                                          lang.proficiency_level === 'fluent' ? 'Fluent' :
                                          lang.proficiency_level === 'conversational' ? 'Conversational' :
                                          lang.proficiency_level === 'basic' ? 'Basic' : 'Required';
                    
                    requirementCategories.language.push({
                      text: lang.language_name,
                      description: `${proficiencyText} level required`,
                      icon: '🗣️'
                    });
                  });
              }
              
              // Check if we have any requirements
              const totalRequirements = Object.values(requirementCategories).flat().length;
              
              if (totalRequirements === 0) {
                return (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-forest/30 mx-auto mb-4" />
                    <h4 className="font-semibold text-forest mb-2">Program Requirements Not Specified</h4>
                    <p className="text-forest/60 italic max-w-lg mx-auto">
                      This organization hasn't provided detailed program requirements yet.
                    </p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-6">
                  {/* Essential Requirements */}
                  {requirementCategories.essential.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-forest mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-warm-sunset/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">🎯</span>
                        </div>
                        Essential Requirements
                      </h4>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
                        {requirementCategories.essential.map((req, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-warm-sunset/20">
                            <span className="text-sm mt-0.5">{req.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-forest">{req.text}</div>
                              {req.description && (
                                <div className="text-xs text-forest/70 mt-1">{req.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Health & Safety Requirements */}
                  {requirementCategories.health.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-forest mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">❤️</span>
                        </div>
                        Health & Safety
                      </h4>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
                        {requirementCategories.health.map((req, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sage-green/20">
                            <span className="text-sm mt-0.5">{req.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-forest">{req.text}</div>
                              {req.description && (
                                <div className="text-xs text-forest/70 mt-1">{req.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Language Requirements */}
                  {requirementCategories.language.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-forest mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-golden-hour/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">🗣️</span>
                        </div>
                        Language Requirements
                      </h4>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
                        {requirementCategories.language.map((req, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-golden-hour/20">
                            <span className="text-sm mt-0.5">{req.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-forest">{req.text}</div>
                              {req.description && (
                                <div className="text-xs text-forest/70 mt-1">{req.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preferred Qualifications */}
                  {requirementCategories.preferred.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-forest mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-rich-earth/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">⭐</span>
                        </div>
                        Preferred (Not Required)
                      </h4>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3">
                        {requirementCategories.preferred.map((req, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-rich-earth/20">
                            <span className="text-sm mt-0.5">{req.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-forest">{req.text}</div>
                              {req.description && (
                                <div className="text-xs text-forest/70 mt-1">{req.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </SharedTabSection>

      {/* OPTIONAL CANCELLATION POLICY - Only show if organization provides it */}
      {/* Note: organization.cancellationPolicy doesn't exist in mock data, but would be added for real implementation */}
      {false && ( // Will be: organization.cancellationPolicy && (
        <SharedTabSection
          title="Cancellation Policy"
          variant="section"
          level="important"
          icon={Shield}
          className="mt-8"
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-forest leading-relaxed">
              {/* organization.cancellationPolicy */}
              Sample: Cancel 90+ days before for full refund minus $50 admin fee. 30-89 days: 75% refund. 0-29 days: 50% credit valid for 2 years.
            </p>
          </div>
        </SharedTabSection>
      )}


      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center py-8 bg-gradient-to-r from-soft-cream/50 to-warm-beige/20 rounded-xl border border-warm-beige/30">
        <h3 className="text-lg font-semibold text-deep-forest mb-3">
          Questions About This Program?
        </h3>
        <p className="text-sm text-forest/70 mb-6">
          Get in touch with the organization for more details or to start your application.
        </p>
        {onTabChange && (
          <button
            onClick={() => {
              onTabChange('connect');
              scrollToTabContent();
            }}
            className="inline-flex items-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Contact Organization
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticalTab;