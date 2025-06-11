// src/components/OrganizationDetail/tabs/OverviewTab.tsx - Photo-First Overview
import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  MapPin,
  Clock,
  ChevronRight,
  Image,
  Heart
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SimplePhotoModal from '../SimplePhotoModal';

interface OverviewTabProps {
  organization: OrganizationDetail;
  isDesktop?: boolean;
  sidebarVisible?: boolean;
  hideDuplicateInfo?: boolean;
  onTabChange?: (tabId: string) => void;
}

// Generate conservation context based on animal type and location
const generateConservationContext = (animalType: string, country: string): string => {
  const contexts: Record<string, Record<string, string>> = {
    'Sea Turtles': {
      'Costa Rica': 'Costa Rica\'s Pacific coast hosts critical nesting beaches for endangered sea turtles. Rising sea levels, beach development, and plastic pollution threaten these ancient migration routes that have existed for millions of years.',
      'default': 'Sea turtles face unprecedented challenges from climate change, pollution, and coastal development. Each nesting season is critical for species survival, making conservation efforts more urgent than ever.'
    },
    'Elephants': {
      'Thailand': 'Thailand\'s elephant population has declined by 90% over the past century. Human-elephant conflict increases as habitats shrink, making ethical elephant care and community education essential for coexistence.',
      'default': 'Elephant populations worldwide face severe pressure from habitat loss and human encroachment. These intelligent, social animals require dedicated protection and community-based conservation solutions.'
    },
    'Lions': {
      'South Africa': 'Africa has lost 75% of its lion population in just two decades. South Africa\'s conservation areas provide crucial refuges, but ongoing anti-poaching efforts and community engagement remain vital.',
      'default': 'Lion populations across Africa continue to decline due to habitat loss and human-wildlife conflict. Conservation efforts focus on protecting pride territories and fostering coexistence with local communities.'
    },
    'default': {
      'default': 'Wildlife conservation efforts worldwide face increasing urgency as habitats shrink and climate change accelerates. Every conservation action, no matter how small, contributes to preserving our planet\'s biodiversity for future generations.'
    }
  };

  const animalContexts = contexts[animalType] || contexts['default'];
  return animalContexts[country] || animalContexts['default'];
};

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  organization, 
  isDesktop = false,
  sidebarVisible = false,
  hideDuplicateInfo = false,
  onTabChange 
}) => {
  const program = organization.programs[0]; // Get first program for essential info
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  

  // Generate simple context line
  const contextLine = `Protecting ${organization.animalTypes[0]?.animalType || 'wildlife'} in the heart of ${organization.location.country}`;

  // Photo-First Discovery Strategy - Intelligent Photo Curation
  const getCuratedPhotoCollections = () => {
    const allPhotos = organization.gallery.images || [];
    
    // Categorize photos by emotional impact and story type
    const emotionalMoments = allPhotos.filter(photo => 
      photo.emotionalWeight === 'high' && 
      ['wildlife-interaction', 'animal-care', 'release-preparation'].includes(photo.category)
    );
    
    const conservationWork = allPhotos.filter(photo => 
      ['volunteer-work', 'medical-care', 'habitat-restoration'].includes(photo.category)
    );
    
    const volunteerLife = allPhotos.filter(photo => 
      ['accommodation', 'education', 'exploration', 'volunteer-experience'].includes(photo.category)
    );
    
    const ecosystemMoments = allPhotos.filter(photo => 
      ['ecosystem-conservation', 'research'].includes(photo.category)
    );

    return {
      emotional: emotionalMoments.slice(0, 6), // Most emotional wildlife moments
      conservation: conservationWork.slice(0, 4), // Hands-on conservation work
      lifestyle: volunteerLife.slice(0, 4), // Volunteer experience & community
      ecosystem: ecosystemMoments.slice(0, 3), // Environmental impact
      featured: emotionalMoments.slice(0, 3) // Hero gallery - most compelling
    };
  };

  const photoCollections = getCuratedPhotoCollections();
  
  // Create unified photo array for lightbox navigation
  const allGalleryPhotos = [
    ...photoCollections.emotional,
    ...photoCollections.conservation,
    ...photoCollections.lifestyle,
    ...photoCollections.ecosystem
  ];
  
  // Smart hero rotation - use most emotional photos for maximum impact
  const getHeroGalleryPhotos = () => {
    const featured = photoCollections.featured;
    if (featured.length === 0) return [organization.heroImage];
    
    // Prioritize wildlife interaction photos for emotional connection
    return [organization.heroImage, ...featured.map(photo => photo.url)];
  };

  const heroPhotos = getHeroGalleryPhotos();
  
  // Simple modal handlers
  const openModal = (photoIndex: number) => {
    console.log('openModal called with index:', photoIndex);
    setLightboxInitialIndex(photoIndex);
    setLightboxOpen(true);
    console.log('Modal state set to open');
  };
  
  const closeModal = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setLightboxInitialIndex((prev) => (prev + 1) % allGalleryPhotos.length);
  };

  const previousPhoto = () => {
    setLightboxInitialIndex((prev) => (prev - 1 + allGalleryPhotos.length) % allGalleryPhotos.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Photo-Driven Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-96 lg:h-[500px]">
          {/* Main hero image */}
          <img 
            src={organization.heroImage} 
            alt={`${organization.name} conservation work`}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-deep-forest/20 to-transparent" />
          
          {/* Hero text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {organization.name}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-4">
              {contextLine}
            </p>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{organization.location.region}, {organization.location.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Volunteer Information Cards - Mobile Only */}
      {!hideDuplicateInfo && (
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          
          {/* Duration */}
          <div className="bg-white rounded-xl shadow-sm border border-warm-beige/40 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-sage-green/10 rounded-full mb-3">
              <Calendar className="w-5 h-5 text-sage-green" />
            </div>
            <h3 className="font-medium text-deep-forest mb-1 text-sm">Duration</h3>
            <p className="text-lg font-bold text-rich-earth">
              {program.duration.min}-{program.duration.max || '∞'} weeks
            </p>
          </div>

          {/* Cost */}
          <div className="bg-white rounded-xl shadow-sm border border-warm-beige/40 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-warm-sunset/10 rounded-full mb-3">
              <DollarSign className="w-5 h-5 text-warm-sunset" />
            </div>
            <h3 className="font-medium text-deep-forest mb-1 text-sm">From</h3>
            <p className="text-lg font-bold text-rich-earth">
              {program.cost.currency}{program.cost.amount.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Conservation Context Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-beige/40 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-deep-forest mb-4">
            Why This Work Matters
          </h3>
          <p className="text-lg text-forest/80 leading-relaxed mb-6">
            {generateConservationContext(organization.animalTypes[0]?.animalType, organization.location.country)}
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-forest/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage-green rounded-full"></div>
              <span>Direct Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
              <span>Local Community</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warm-sunset rounded-full"></div>
              <span>Long-term Conservation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo-First Discovery Gallery - Emotional Storytelling Through Images */}
      {photoCollections.emotional.length > 0 && (
        <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-3xl p-8 lg:p-12 border border-warm-beige/40 shadow-nature-xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-semibold text-deep-forest mb-4">
              Stories That Change Lives
            </h3>
            <p className="text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto mb-6">
              Every photo tells a story of rescue, rehabilitation, and hope. These are the real moments that define our conservation mission.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-forest/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                <span>Wildlife Rescue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warm-sunset rounded-full"></div>
                <span>Rehabilitation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-golden-hour rounded-full"></div>
                <span>Release & Freedom</span>
              </div>
            </div>
          </div>
          
          {/* Emotional Wildlife Moments - Primary Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {photoCollections.emotional.map((photo, index) => (
              <div 
                key={photo.id} 
                className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.altText}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          
          {/* Conservation Work in Action */}
          {photoCollections.conservation.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h4 className="text-xl font-semibold text-deep-forest mb-3">
                  Hands-On Conservation Work
                </h4>
                <p className="text-base text-forest/70 max-w-xl mx-auto">
                  See volunteers in action building enclosures, providing medical care, and restoring habitats
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {photoCollections.conservation.map((photo, index) => {
                  const lightboxIndex = photoCollections.emotional.length + index;
                  return (
                    <div 
                      key={photo.id} 
                      className="rounded-xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => openModal(lightboxIndex)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.altText}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Volunteer Experience Gallery */}
          {photoCollections.lifestyle.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h4 className="text-xl font-semibold text-deep-forest mb-3">
                  Your Volunteer Experience
                </h4>
                <p className="text-base text-forest/70 max-w-xl mx-auto">
                  From comfortable accommodation to weekend adventures - see what your time here looks like
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {photoCollections.lifestyle.map((photo, index) => {
                  const lightboxIndex = photoCollections.emotional.length + photoCollections.conservation.length + index;
                  return (
                    <div 
                      key={photo.id} 
                      className="rounded-xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => openModal(lightboxIndex)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.altText}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Photo Gallery CTA */}
          <div className="text-center mt-10 pt-8 border-t border-warm-beige/40">
            <p className="text-forest/70 mb-4">
              <span className="font-semibold text-rich-earth">{organization.gallery.images.length}</span> photos showcase real volunteer experiences
            </p>
            <p className="text-sm text-forest/60">
              These unfiltered moments capture the authentic conservation work and meaningful connections you'll experience
            </p>
          </div>
        </div>
      )}

      {/* Impact & Community Section */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Our Impact */}
        <div className="bg-gradient-to-br from-sage-green/5 to-sage-green/10 rounded-2xl p-6 border border-sage-green/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sage-green/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-sage-green" />
            </div>
            <h4 className="text-lg font-semibold text-deep-forest">Conservation Impact</h4>
          </div>
          <p className="text-forest/80 leading-relaxed mb-4">
            Through hands-on conservation work, our volunteers directly contribute to the protection and rehabilitation of {organization.animalTypes[0]?.animalType.toLowerCase()}.
          </p>
          <div className="text-sm text-sage-green font-medium">
            Every volunteer makes a measurable difference
          </div>
        </div>

        {/* Community Connection */}
        <div className="bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 rounded-2xl p-6 border border-warm-sunset/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warm-sunset/20 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-warm-sunset" />
            </div>
            <h4 className="text-lg font-semibold text-deep-forest">Local Partnership</h4>
          </div>
          <p className="text-forest/80 leading-relaxed mb-4">
            We work closely with local communities in {organization.location.country}, creating sustainable conservation solutions that benefit both wildlife and people.
          </p>
          <div className="text-sm text-warm-sunset font-medium">
            Building bridges between conservation and community
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center py-12 bg-gradient-to-r from-soft-cream/50 to-warm-beige/20 rounded-2xl border border-warm-beige/30">
        <h3 className="text-2xl font-semibold text-deep-forest mb-4">
          Ready to Make a Difference?
        </h3>
        <p className="text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto mb-8">
          Join our conservation team and experience the rewarding work of protecting {organization.animalTypes[0]?.animalType.toLowerCase()} while immersing yourself in {organization.location.country}'s incredible natural environment.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onTabChange && (
            <>
              <button
                onClick={() => onTabChange('experience')}
                className="inline-flex items-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                See Daily Activities
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onTabChange('practical')}
                className="inline-flex items-center gap-2 bg-white hover:bg-warm-beige/10 text-rich-earth border-2 border-rich-earth px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Check Requirements
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Simple Photo Modal */}
      <SimplePhotoModal
        photos={allGalleryPhotos}
        currentIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={closeModal}
        onNext={nextPhoto}
        onPrevious={previousPhoto}
      />
    </div>
  );
};

export default OverviewTab;