// src/components/OrganizationDetail/tabs/OverviewTab.tsx - Photo-First Overview
import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SimplePhotoModal from '../SimplePhotoModal';
import { scrollToTabContent } from '../../../lib/scrollUtils';

interface OverviewTabProps {
  organization: OrganizationDetail;
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
    'Primates': {
      'Costa Rica': 'Costa Rica\'s rainforests shelter endangered primates facing habitat fragmentation and illegal pet trade. Protecting these intelligent species requires immediate action as deforestation accelerates.',
      'default': 'Primate populations face critical threats from habitat destruction and human encroachment. Their complex social structures and intelligence make rehabilitation and protection efforts especially important.'
    },
    'Big Cats': {
      'South Africa': 'Big cat populations across Africa have declined dramatically due to human-wildlife conflict and habitat loss. Conservation efforts focus on protecting territories and reducing conflict with local communities.',
      'default': 'Big cats worldwide face severe population declines from habitat fragmentation and human conflict. These apex predators play crucial roles in ecosystem balance, making their protection vital.'
    },
    'Marine Wildlife': {
      'default': 'Marine ecosystems face unprecedented pressure from pollution, climate change, and overfishing. Protecting marine wildlife requires urgent action to preserve ocean biodiversity for future generations.'
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
  hideDuplicateInfo = false,
  onTabChange
}) => {
  const program = organization.programs[0]; // Get first program for essential info

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);


  // Generate simple context line
  const contextLine = `Protecting ${organization.animalTypes[0]?.animalType || 'wildlife'} in the heart of ${organization.location.country}`;

  // Simplified Photo Curation - Admin-friendly approach
  const getCuratedPhotoCollections = () => {
    const allPhotos = organization.gallery.images || [];
    
    // Simple division of photos into logical groups
    const totalPhotos = allPhotos.length;
    const third = Math.ceil(totalPhotos / 3);
    
    return {
      emotional: allPhotos.slice(0, Math.min(6, third)), // First third - primary moments
      conservation: allPhotos.slice(third, Math.min(third * 2, third + 4)), // Second third - work photos
      lifestyle: allPhotos.slice(third * 2, Math.min(totalPhotos, third * 2 + 4)), // Last third - experience
      featured: allPhotos.slice(0, Math.min(3, totalPhotos)) // First 3 photos for hero
    };
  };

  const photoCollections = getCuratedPhotoCollections();

  // Create unified photo array for lightbox navigation
  const allGalleryPhotos = [
    ...photoCollections.emotional,
    ...photoCollections.conservation,
    ...photoCollections.lifestyle
  ];


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
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-white">
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
              {program.cost.amount ? `${program.cost.currency}${program.cost.amount.toLocaleString()}` : 'Free'}
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
                onClick={() => {
                  onTabChange('experience');
                  scrollToTabContent();
                }}
                className="inline-flex items-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                See Daily Activities
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  onTabChange('practical');
                  scrollToTabContent();
                }}
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