// src/components/OrganizationDetail/OrganizationHeader.tsx
import React from 'react';
import { MapPin, Star, Verified, Compass } from 'lucide-react';
import { OrganizationDetail } from '../../types';
import { calculateAverageRating, generateStarDisplay } from '../../lib/rating-utils';

interface OrganizationHeaderProps {
  organization: OrganizationDetail;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ organization }) => {
  // Minimal rating calculation
  const averageRating = calculateAverageRating(organization.testimonials);
  const starDisplay = generateStarDisplay(averageRating);
  const reviewCount = organization.testimonials.length;
  
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Immersive Adventure Background with enhanced positioning */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${organization.heroImage})` }}
      >
        {/* Enhanced signature adventure gradient overlay with design system colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-forest/90 via-forest/75 to-forest/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/70 via-deep-forest/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warm-sunset/8 to-transparent" />
        
        {/* Additional depth overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-deep-forest/20 to-deep-forest/40" />
      </div>
      
      {/* Enhanced floating adventure elements with design system colors */}
      <div className="absolute top-16 right-8 w-24 h-24 lg:w-40 lg:h-40 bg-gradient-to-br from-warm-sunset/25 to-rich-earth/20 rounded-full blur-3xl animate-pulse-golden" />
      <div className="absolute bottom-28 left-6 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-sage-green/30 to-forest/25 rounded-full blur-2xl animate-float" />
      <div className="hidden lg:block absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-rich-earth/15 to-warm-sunset/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}} />
      
      {/* Adventure Content - mobile responsive with enhanced structure */}
      <div className="relative z-10 container-nature-wide">
        <div className="pb-12 lg:pb-20">
          <div className="max-w-5xl space-y-8 lg:space-y-12 pt-4 lg:pt-8 animate-fade-in-up">
            
            {/* Enhanced Adventure Location + Trust - mobile responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
              <div className="flex items-center gap-2 bg-gradient-to-r from-rich-earth/95 to-warm-sunset/90 backdrop-blur-md px-4 lg:px-5 py-2 lg:py-3 rounded-full border border-white/30 shadow-2xl">
                <Compass className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm" />
                <span className="text-white font-bold tracking-wide text-body">{organization.location.country}</span>
                <span className="text-white/80 hidden sm:inline">•</span>
                <span className="text-white/95 text-body hidden sm:inline">{organization.animalTypes.slice(0, 3).map(a => a.animalType).join(', ')}</span>
              </div>
              
              {/* Enhanced immersive rating display - mobile responsive */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2 lg:gap-3 bg-white/20 backdrop-blur-md px-4 lg:px-5 py-2 lg:py-3 rounded-full border border-white/30 shadow-2xl">
                  <div className="flex items-center gap-1">
                    {starDisplay.slice(0, 5).map((star, index) => (
                      <Star 
                        key={index}
                        className={`w-4 h-4 lg:w-5 lg:h-5 drop-shadow-sm ${
                          star.type === 'full' 
                            ? 'text-golden-hour fill-current' 
                            : 'text-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold text-body drop-shadow-sm">{averageRating}</span>
                  <span className="text-white/90 text-caption font-medium">({reviewCount})</span>
                </div>
              )}
              
              {/* Mobile animal types display */}
              <div className="sm:hidden text-white/85 text-body">
                {organization.animalTypes.slice(0, 3).map(a => a.animalType).join(' • ')}
              </div>
            </div>
              {/* Enhanced Immersive Organization Identity - mobile responsive */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10 text-center lg:text-left">
                <div className="flex-shrink-0 relative">
                  {/* Enhanced logo glow effect with design system colors */}
                  <div className="absolute -inset-2 lg:-inset-3 bg-gradient-to-br from-warm-sunset/40 to-rich-earth/35 rounded-3xl blur-xl lg:blur-2xl" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl" />
                  <img 
                    src={organization.logo} 
                    alt={`${organization.name} logo`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-3xl object-cover border-2 lg:border-3 border-white/40 shadow-2xl"
                  />
                  {organization.verified && (
                    <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-sage-green/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-xl border border-sage-green/70">
                      <Verified className="w-3 h-3 text-white drop-shadow-sm" />
                      <span className="text-white text-xs font-bold tracking-wide">VERIFIED</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 lg:space-y-6">
                  <div>
                    <h1 className="text-hero text-white drop-shadow-2xl leading-tight">
                      {organization.name}
                    </h1>
                  </div>
                  
                  {/* Enhanced elegant info chips with design system colors */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-4">
                    <div className="bg-white/15 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-white/25 shadow-xl">
                      <span className="text-white/95 text-caption font-semibold tracking-wide">
                        {organization.programs[0]?.duration.min}-{organization.programs[0]?.duration.max || '∞'} weeks
                      </span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-white/25 shadow-xl">
                      <span className="text-white/95 text-caption font-semibold tracking-wide">
                        {organization.location.city}
                      </span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-white/25 shadow-xl">
                      <span className="text-white/95 text-caption font-semibold tracking-wide">
                        Since {organization.yearFounded}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            {/* Enhanced description with design system colors */}
            <div className="text-center max-w-3xl mx-auto px-4">
              <p className="text-body-large text-white/90 font-light drop-shadow-lg leading-relaxed">
                Work hands-on with rescued {organization.animalTypes.map(a => a.animalType.toLowerCase()).slice(0, -1).join(', ')} and {organization.animalTypes[organization.animalTypes.length - 1]?.animalType.toLowerCase()} in {organization.location.country}'s pristine wilderness. Help with daily care, rehabilitation, and release programs while living among the wildlife you're protecting.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced adventure transition with design system colors */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-soft-cream via-soft-cream/80 to-transparent" />
    </div>
  );
};

export default OrganizationHeader;