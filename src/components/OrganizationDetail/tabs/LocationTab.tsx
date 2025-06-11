// src/components/OrganizationDetail/tabs/LocationTab.tsx
import React from 'react';
import { 
  MapPin, 
  Plane, 
  Clock, 
  Thermometer,
  Car,
  Wifi,
  Globe,
  Mountain,
  Camera
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SharedTabSection from '../SharedTabSection';

interface LocationTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
  hideDuplicateInfo?: boolean;
}

const LocationTab: React.FC<LocationTabProps> = ({ organization, onTabChange, hideDuplicateInfo = false }) => {
  const program = organization.programs[0]; // Main program for activities

  return (
    <div className="space-nature-md">
      {/* Location Overview */}
      <SharedTabSection
        title="Location & Setting"
        variant="hero"
        level="essential"
        icon={MapPin}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-card-title font-bold text-forest mb-2">
            {organization.location.city}, {organization.location.region}
          </div>
          <div className="text-subtitle text-forest/80 mb-4">{organization.location.country}</div>
          {organization.location.address && (
            <div className="text-body text-forest/70">{organization.location.address}</div>
          )}
        </div>
      </SharedTabSection>

      {/* Transportation & Access */}
      <div className="grid md:grid-cols-2 gap-nature-md">
        {/* Getting There */}
        <div className="bg-white rounded-2xl section-padding-md shadow-nature border border-warm-beige/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sunset/10 rounded-xl">
              <Plane className="w-6 h-6 text-sunset" />
            </div>
            <h3 className="text-card-title font-display font-semibold text-deep-forest">Getting There</h3>
          </div>
          
          <div className="space-nature-sm">
            {/* Airport Information */}
            <div className="section-padding-sm bg-sunset/5 rounded-xl">
              <h4 className="text-body font-semibold text-forest mb-2">Nearest Airport</h4>
              <p className="text-body text-forest/80 leading-relaxed">{organization.location.nearestAirport}</p>
            </div>
            
            {/* Transportation Services */}
            <div className="space-nature-xs">
              <h4 className="text-body font-semibold text-forest">Transportation Services</h4>
              <div className="grid grid-cols-2 gap-nature-xs">
                <div className={`section-padding-sm rounded-xl border-2 transition-all ${
                  organization.transportation.airportPickup 
                    ? 'border-sage-green bg-sage-green/5 text-sage-green' 
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}>
                  <Car className="w-6 h-6 mb-2" />
                  <div className="text-body-small font-medium">Airport Pickup</div>
                  <div className="text-caption mt-1">
                    {organization.transportation.airportPickup ? 'Included' : 'Not Available'}
                  </div>
                </div>
                
                <div className={`section-padding-sm rounded-xl border-2 transition-all ${
                  organization.transportation.localTransport 
                    ? 'border-sage-green bg-sage-green/5 text-sage-green' 
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}>
                  <Car className="w-6 h-6 mb-2" />
                  <div className="text-body-small font-medium">Local Transport</div>
                  <div className="text-caption mt-1">
                    {organization.transportation.localTransport ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>
              
              <div className="section-padding-sm bg-warm-beige/30 rounded-xl">
                <p className="text-body-small text-forest/80 leading-relaxed">
                  {organization.transportation.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Information */}
        <div className="bg-white rounded-2xl section-padding-md shadow-nature border border-warm-beige/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rich-earth/10 rounded-xl">
              <Globe className="w-6 h-6 text-rich-earth" />
            </div>
            <h3 className="text-card-title font-display font-semibold text-deep-forest">Local Details</h3>
          </div>
          
          <div className="space-nature-sm">
            {/* Time Zone */}
            <div className="flex items-center gap-4 section-padding-sm bg-rich-earth/5 rounded-xl">
              <Clock className="w-6 h-6 text-rich-earth" />
              <div>
                <div className="text-body font-semibold text-forest">Time Zone</div>
                <div className="text-body-small text-forest/70">{organization.location.timezone}</div>
              </div>
            </div>
            
            {/* Languages */}
            <div>
              <h4 className="text-body font-semibold text-forest mb-3">Languages Spoken</h4>
              <div className="flex flex-wrap gap-nature-xs">
                {organization.languages.map((language, index) => (
                  <span key={index} className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-body-small font-medium">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Internet Access */}
            <div className="flex items-center gap-4 section-padding-sm bg-warm-beige/30 rounded-xl">
              <Wifi className={`w-6 h-6 ${
                organization.internetAccess.available ? 'text-sage-green' : 'text-gray-400'
              }`} />
              <div>
                <div className="text-body font-semibold text-forest">Internet Access</div>
                <div className="text-body-small text-forest/70 capitalize">
                  {organization.internetAccess.available 
                    ? `${organization.internetAccess.quality} WiFi available` 
                    : 'No internet access'
                  }
                </div>
                <div className="text-caption text-forest/60 mt-1">
                  {organization.internetAccess.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Activities & Exploration */}
      {program.highlights && program.highlights.length > 0 && (
        <div className="bg-gradient-to-br from-deep-forest via-forest to-sage-green/20 rounded-3xl section-padding-lg text-white shadow-nature-xl">
          <div className="text-center space-nature-sm mb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-gradient-to-br from-sunset/30 to-golden-hour/20 rounded-2xl">
                <Camera className="w-8 h-8 text-gentle-lemon" />
              </div>
            </div>
            <h3 className="text-card-title font-display font-semibold text-white">Local Adventures & Activities</h3>
            <p className="text-body-large text-white/90 max-w-3xl mx-auto leading-relaxed">
              Explore the incredible natural beauty and cultural richness of {organization.location.region} during your free time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-nature-sm">
            {program.highlights.map((highlight, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl section-padding-sm border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                    <Mountain className="w-5 h-5 text-gentle-lemon" />
                  </div>
                  <div>
                    <p className="text-body-small text-white/90 leading-relaxed">{highlight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl section-padding-sm border border-white/20">
              <h4 className="text-subtitle font-display font-semibold text-white mb-3">Your Schedule</h4>
              <div className="grid md:grid-cols-2 gap-nature-sm">
                <div>
                  <div className="text-card-title font-bold text-gentle-lemon">{program.schedule.daysPerWeek}</div>
                  <div className="text-body-small text-white/90">days of work per week</div>
                </div>
                <div>
                  <div className="text-card-title font-bold text-sunset">{7 - program.schedule.daysPerWeek}</div>
                  <div className="text-body-small text-white/90">days free for exploration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Climate & What to Pack */}
      <SharedTabSection
        title="Climate & Preparation"
        variant="section"
        level="important"
        icon={Thermometer}
      >
        <div className="grid md:grid-cols-2 gap-nature-md">
          <div>
            <h4 className="text-subtitle font-display font-semibold text-forest mb-4">Climate Information</h4>
            <div className="space-nature-xs">
              <div className="section-padding-sm bg-sunset/5 rounded-xl">
                <div className="text-body font-medium text-forest mb-1">Tropical Climate</div>
                <div className="text-body-small text-forest/70">Warm temperatures year-round with distinct wet and dry seasons</div>
              </div>
              <div className="section-padding-sm bg-sunset/5 rounded-xl">
                <div className="text-body font-medium text-forest mb-1">Average Temperature</div>
                <div className="text-body-small text-forest/70">24-30°C (75-86°F) throughout the year</div>
              </div>
              <div className="section-padding-sm bg-sunset/5 rounded-xl">
                <div className="text-body font-medium text-forest mb-1">Rainfall</div>
                <div className="text-body-small text-forest/70">Higher rainfall May-November, drier December-April</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-subtitle font-display font-semibold text-forest mb-4">What to Pack</h4>
            <div className="space-nature-xs">
              <div className="section-padding-sm bg-warm-beige/30 rounded-xl">
                <div className="text-body font-medium text-forest mb-2">Essential Items</div>
                <ul className="text-body-small text-forest/70 space-y-1">
                  <li>• Lightweight, quick-dry clothing</li>
                  <li>• Waterproof jacket and pants</li>
                  <li>• Sturdy hiking boots</li>
                  <li>• Insect repellent and sunscreen</li>
                </ul>
              </div>
              <div className="section-padding-sm bg-warm-beige/30 rounded-xl">
                <div className="text-body font-medium text-forest mb-2">Work Gear</div>
                <ul className="text-body-small text-forest/70 space-y-1">
                  <li>• Work gloves</li>
                  <li>• Old clothes for animal care</li>
                  <li>• Rubber boots</li>
                  <li>• Hat and sunglasses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>
      
      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center">
        <p className="text-body text-deep-forest/70 mb-4">
          Have questions about the location or logistics?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('connect')}
            className="inline-flex items-center gap-2 bg-golden-hour hover:bg-golden-hour/90 text-deep-forest px-6 py-3 rounded-xl font-semibold transition-colors border border-golden-hour/30"
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

export default LocationTab;