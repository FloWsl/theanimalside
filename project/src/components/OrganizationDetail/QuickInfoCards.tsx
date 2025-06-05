// src/components/OrganizationDetail/QuickInfoCards.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  Star,
  Users,
  Shield,
  Camera
} from 'lucide-react';
import { OrganizationDetail, Program, OrganizationTestimonial } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface QuickInfoCardsProps {
  organization: OrganizationDetail;
  selectedProgram?: Program;
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({ 
  organization, 
  selectedProgram, 
  currentTab,
  onTabChange 
}) => {
  const program = selectedProgram || organization.programs[0];

  return (
    <div className="space-y-4">
      {/* Cost & Logistics Quick Info - Always Useful */}
      {currentTab !== 'practical' && (
        <Card className="bg-gradient-to-br from-rich-earth/5 to-warm-sunset/5 border border-rich-earth/20 hover:border-rich-earth/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <DollarSign className="w-5 h-5 text-rich-earth" />
              Quick Cost Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-rich-earth">
                  {program.cost.amount === 0 ? 'FREE' : `${program.cost.currency} ${program.cost.amount}`}
                </div>
                <div className="text-xs text-deep-forest/70">per {program.cost.period}</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-sage-green">
                  {program.duration.min}-{program.duration.max || '∞'}
                </div>
                <div className="text-xs text-deep-forest/70">weeks</div>
              </div>
            </div>
            <div className="text-xs text-deep-forest/80">
              Includes: {program.cost.includes.slice(0, 2).join(', ').toLowerCase()}
              {program.cost.includes.length > 2 && ' + more'}
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('practical')}
                className="w-full flex items-center justify-center gap-2 text-sm text-rich-earth hover:text-warm-sunset transition-colors py-2"
              >
                View full details <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Location & Logistics Info */}
      {currentTab !== 'location' && (
        <Card className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 border border-sage-green/20 hover:border-sage-green/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <MapPin className="w-5 h-5 text-sage-green" />
              Location & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-semibold text-deep-forest">{organization.location.city}</div>
              <div className="text-sm text-deep-forest/70">{organization.location.region}, {organization.location.country}</div>
            </div>
            <div className="text-xs text-deep-forest/80">
              Airport pickup: {organization.transportation.airportPickup ? 'Included' : 'Not included'}
            </div>
            {organization.location.nearestAirport && (
              <div className="text-xs text-deep-forest/80">
                Nearest: {organization.location.nearestAirport}
              </div>
            )}
            {onTabChange && (
              <button
                onClick={() => onTabChange('location')}
                className="w-full flex items-center justify-center gap-2 text-sm text-sage-green hover:text-warm-sunset transition-colors py-2"
              >
                View location details <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Experience Highlights */}
      {currentTab !== 'experience' && (
        <Card className="bg-gradient-to-br from-warm-sunset/5 to-golden-hour/5 border border-warm-sunset/20 hover:border-warm-sunset/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <Heart className="w-5 h-5 text-warm-sunset" />
              Experience Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-warm-sunset">
                  {program.schedule.hoursPerDay}h
                </div>
                <div className="text-xs text-deep-forest/70">daily work</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <div className="text-lg font-bold text-golden-hour">
                  {program.animalTypes.length}
                </div>
                <div className="text-xs text-deep-forest/70">species</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {program.animalTypes.slice(0, 3).map((animal, index) => (
                <span key={index} className="px-2 py-1 bg-warm-sunset/10 text-warm-sunset rounded text-xs">
                  {animal}
                </span>
              ))}
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('experience')}
                className="w-full flex items-center justify-center gap-2 text-sm text-warm-sunset hover:text-rich-earth transition-colors py-2"
              >
                Explore activities <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trust & Verification */}
      {currentTab !== 'overview' && (
        <Card className="bg-gradient-to-br from-gentle-lemon/5 to-soft-cream border border-golden-hour/20 hover:border-golden-hour/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <Shield className="w-5 h-5 text-golden-hour" />
              Trust & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {organization.verified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-sage-green/10 text-sage-green rounded-full text-xs">
                  <Shield className="w-3 h-3" />
                  Verified
                </div>
              )}
              <div className="text-sm text-deep-forest font-medium">
                Est. {organization.yearFounded}
              </div>
            </div>
            <div className="text-sm text-deep-forest">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-golden-hour" />
                <span>{organization.statistics.volunteersHosted.toLocaleString()} volunteers hosted</span>
              </div>
            </div>
            <div className="text-xs text-deep-forest/80">
              {organization.certifications.length} official certification{organization.certifications.length > 1 ? 's' : ''}
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('overview')}
                className="w-full flex items-center justify-center gap-2 text-sm text-golden-hour hover:text-rich-earth transition-colors py-2"
              >
                View credentials <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Testimonial Snippet */}
      {currentTab !== 'stories' && organization.testimonials.length > 0 && (
        <Card className="bg-gradient-to-br from-deep-forest/5 to-sage-green/5 border border-deep-forest/20 hover:border-sage-green/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <Star className="w-5 h-5 text-golden-hour" />
              Volunteer Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const testimonial = organization.testimonials[0];
              return (
                <>
                  <div className="text-sm text-deep-forest italic leading-relaxed">
                    "{testimonial.quote.slice(0, 120)}{testimonial.quote.length > 120 ? '...' : ''}"
                  </div>
                  <div className="text-xs text-deep-forest/70">
                    — {testimonial.volunteerName}, {testimonial.volunteerCountry}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-golden-hour text-golden-hour" />
                    ))}
                  </div>
                </>
              );
            })()}
            {onTabChange && (
              <button
                onClick={() => onTabChange('stories')}
                className="w-full flex items-center justify-center gap-2 text-sm text-deep-forest hover:text-sage-green transition-colors py-2"
              >
                Read more stories <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual Preview */}
      {currentTab !== 'experience' && organization.gallery.images.length > 0 && (
        <Card className="bg-gradient-to-br from-warm-beige to-soft-cream border border-warm-beige hover:border-warm-sunset/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-deep-forest">
              <Camera className="w-5 h-5 text-warm-sunset" />
              Experience Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {organization.gallery.images.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image.url} 
                    alt={image.altText}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-deep-forest/80 text-center">
              {organization.gallery.images.length} photos + {organization.gallery.videos.length} videos
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('experience')}
                className="w-full flex items-center justify-center gap-2 text-sm text-warm-sunset hover:text-rich-earth transition-colors py-2"
              >
                View full gallery <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickInfoCards;