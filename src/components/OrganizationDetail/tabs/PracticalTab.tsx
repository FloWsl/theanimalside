// src/components/OrganizationDetail/tabs/PracticalTab.tsx
import React, { useState } from 'react';
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
import { useOrganizationPractical } from '../../../hooks/useOrganizationData';
import SharedTabSection from '../SharedTabSection';
import { scrollToTabContent } from '../../../lib/scrollUtils';

interface PracticalTabProps {
  organizationId: string;
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
  organizationId,
  hideDuplicateInfo = false,
  onTabChange 
}) => {
  // Fetch practical data using React Query
  const { data: practicalData, isLoading, error } = useOrganizationPractical(organizationId);
  
  
  // Get accommodation photos from database
  const accommodationPhotos = practicalData?.accommodation_media?.map(media => media.url) || [];
  
  // Get fitness requirements from database
  const fitnessRequirement = practicalData?.skill_requirements?.find(
    req => req.skill_name.toLowerCase().includes('fitness') || req.skill_name.toLowerCase().includes('physical')
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-forest/60">Loading practical information...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600">Error loading practical information. Please try again.</div>
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
              {practicalData?.primary_program?.cost_amount == 0 ? 'FREE' : `${practicalData?.primary_program?.cost_currency || '$'}${practicalData?.primary_program?.cost_amount || 'Contact'}`}
            </div>
            <div className="text-xs sm:text-sm text-deep-forest/70">Program cost</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-warm-sunset/20">
            <div className="text-xl sm:text-2xl font-bold text-warm-sunset mb-1">
              {practicalData?.primary_program?.duration_min_weeks || 1}-{practicalData?.primary_program?.duration_max_weeks || '∞'}
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
          <div className="text-center">
            <h3 className="text-lg sm:text-xl text-forest mb-3">Where You'll Stay</h3>
            <p className="text-sm sm:text-base text-forest/80 max-w-2xl mx-auto">
              {practicalData?.accommodation?.description || 'Accommodation details available upon inquiry'}
            </p>
          </div>
          
          {/* Full-width accommodation showcase */}
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige to-gentle-lemon/20 rounded-2xl overflow-hidden shadow-nature border border-beige/60">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Photo gallery takes full width */}
              <AccommodationGallery photos={accommodationPhotos} />
              
              {/* Details flow below in single column */}
              <div className="mt-8 space-y-6">
                
                {/* Accommodation description */}
                <div className="text-center">
                  <p className="text-forest leading-relaxed text-lg max-w-3xl mx-auto">
                    {practicalData?.accommodation?.description || 'Accommodation details available upon inquiry'}
                  </p>
                </div>
                
                {/* Amenities - Compact display without non-clickable counters */}
                <div className="bg-sage-green/5 rounded-lg p-4">
                  <h4 className="text-card-title text-sage-green mb-3 text-center">✨ Key Amenities</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(practicalData?.amenities || []).map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-white text-forest rounded-full text-sm border border-sage-green/20">
                        {amenity.amenity_name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Meals & Support - Essential admin-friendly info */}
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  
                  {/* Meals Information */}
                  <div className="bg-rich-earth/5 rounded-xl p-4 lg:p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Utensils className="w-5 h-5 text-rich-earth" />
                      <h4 className="text-card-title text-forest">Meals Included</h4>
                    </div>
                    <p className="text-forest/80 mb-4">
                      {practicalData?.meal_plan?.description || 'Meal details available upon inquiry'}
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-forest">Dietary Options:</div>
                      <div className="flex flex-wrap gap-2">
                        {(practicalData?.dietary_options || []).map((option, index) => (
                          <span key={index} className="px-3 py-1 bg-rich-earth/10 text-rich-earth rounded-full text-sm">
                            {option.option_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Program Support - Simple, admin-friendly */}
                  <div className="bg-sage-green/5 rounded-xl p-4 lg:p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-5 h-5 text-sage-green" />
                      <h4 className="text-card-title text-forest">Program Support</h4>
                    </div>
                    <div className="space-y-3 text-sm text-forest/80">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                        <span>Dedicated volunteer coordinators on-site</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                        <span>Flexible programming to match your interests</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                        <span>Pre-arrival coordination and guidance</span>
                      </div>
                    </div>
                  </div>
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
              {practicalData?.age_requirement?.max_age && ` - ${practicalData?.age_requirement?.max_age} years`}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-rich-earth/20">
            <Heart className="w-8 h-8 text-rich-earth mx-auto mb-3" />
            <div className="font-semibold text-forest mb-2">Fitness Level</div>
            <div className="text-rich-earth font-bold">{fitnessRequirement?.skill_name || 'Moderate'}</div>
            <div className="text-xs text-forest/60 mt-1">{fitnessRequirement?.skill_description || 'Walking, lifting, outdoor work'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-warm-sunset/20">
            <MapPin className="w-8 h-8 text-warm-sunset mx-auto mb-3" />
            <div className="font-semibold text-forest mb-2">Languages</div>
            <div className="text-warm-sunset font-bold text-sm">
              {(practicalData?.languages || []).map(lang => lang.language_name).join(', ') || 'English'}
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
                    ? `${(practicalData?.internet_access?.quality || 'basic').charAt(0).toUpperCase() + (practicalData?.internet_access?.quality || 'basic').slice(1)} WiFi Available` 
                    : 'Limited Internet Access'
                  }
                </div>
                <p className="text-forest/80 leading-relaxed max-w-lg mx-auto">
                  {practicalData?.internet_access?.description || 'Internet details available upon inquiry'}
                </p>
              </div>
              
              {practicalData?.internet_access?.available && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Video calls and messaging supported</span>
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
                  {practicalData?.primary_program?.cost_amount == 0 ? 'FREE' : `${practicalData?.primary_program?.cost_currency || '$'}${practicalData?.primary_program?.cost_amount || 'Contact'}`}
                </div>
                <div className="text-forest/70 font-medium text-sm">per {practicalData?.primary_program?.cost_period || 'week'}</div>
              </div>
              
              {/* What's Included & Not Included */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* What's Included */}
                <div className="bg-white rounded-xl p-5 border border-sage-green/30">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-sage-green" />
                    <h4 className="font-semibold text-forest">What's Included</h4>
                  </div>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                    {(practicalData?.program_inclusions?.filter(item => item.inclusion_type === 'included') || []).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-sm text-forest">{item.item_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* What's Not Included */}
                <div className="bg-white rounded-xl p-5 border border-warm-sunset/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Plane className="w-5 h-5 text-warm-sunset" />
                    <h4 className="font-semibold text-forest">Additional Expenses</h4>
                  </div>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                    {(practicalData?.program_inclusions?.filter(item => item.inclusion_type === 'excluded') || []).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 border border-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-sm text-forest/80">{item.item_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
              These services are not included in the program cost. You'll need to arrange them separately.
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
                    To {practicalData?.transportation?.description?.includes('airport') ? 'the airport pickup location' : 'the nearest airport'}. Book 2-3 months ahead for better rates.
                  </p>
                  <button className="text-sm text-rich-earth hover:underline">
                    Flight search resources →
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
                  <button className="text-sm text-sage-green hover:underline">
                    Insurance information →
                  </button>
                </div>
              </div>
              
              {/* Other Services */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-warm-beige/30">
                <div className="text-center p-3 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-warm-sunset mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Visas</div>
                  <button className="text-xs text-warm-sunset hover:underline">Check requirements</button>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Heart className="w-5 h-5 text-golden-hour mx-auto mb-2" />
                  <div className="text-sm font-medium text-forest mb-1">Health prep</div>
                  <button className="text-xs text-golden-hour hover:underline">Find clinics</button>
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
              Essential items for conservation work and comfortable living in this destination.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              
              {/* Essential Items */}
              <div className="bg-white rounded-xl p-5 border border-warm-sunset/20">
                <h4 className="font-semibold text-forest mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-warm-sunset/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-warm-sunset" />
                  </div>
                  Essential Items
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Lightweight, quick-dry clothing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Waterproof jacket and pants</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Sturdy hiking boots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Insect repellent and sunscreen</span>
                  </div>
                </div>
              </div>

              {/* Work Gear */}
              <div className="bg-white rounded-xl p-5 border border-sage-green/20">
                <h4 className="font-semibold text-forest mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-sage-green" />
                  </div>
                  Conservation Work Gear
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Work gloves</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Old clothes for animal care</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Rubber boots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-sm text-forest">Hat and sunglasses</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Future Comprehensive Guide CTA */}
            <div className="bg-gradient-to-r from-golden-hour/10 to-warm-sunset/10 rounded-xl p-5 border border-golden-hour/30 text-center">
              <div className="w-12 h-12 bg-golden-hour/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-golden-hour" />
              </div>
              <h4 className="font-semibold text-forest mb-2">Complete Packing Guide</h4>
              <p className="text-sm text-forest/70 mb-4 max-w-lg mx-auto">
                Get our comprehensive guide with detailed packing lists, climate info, and insider tips for this destination.
              </p>
              <button 
                onClick={() => {
                  console.log('Download guide for: this destination');
                  alert('Comprehensive packing guide coming soon! We\'ll notify you when it\'s available.');
                }}
                className="inline-flex items-center gap-2 text-sm text-golden-hour hover:text-white hover:bg-golden-hour font-medium bg-golden-hour/10 px-4 py-2 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Download Complete Guide
              </button>
            </div>
          </div>
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
              {(practicalData?.health_requirements || []).map((req, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sage-green/20">
                  <CheckCircle className="w-5 h-5 text-sage-green flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-forest">
                    <div className="font-medium">{req.requirement_name}</div>
                    {req.requirement_description && (
                      <div className="text-xs text-forest/70 mt-1">{req.requirement_description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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