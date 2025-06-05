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

interface LocationTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const LocationTab: React.FC<LocationTabProps> = ({ organization, onTabChange }) => {
  const program = organization.programs[0]; // Main program for activities

  return (
    <div className="space-y-8">
      {/* Location Overview */}
      <div className="bg-gradient-to-br from-soft-cream via-gentle-lemon/10 to-warm-beige rounded-3xl p-8 lg:p-12 shadow-nature-xl">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-4 bg-gradient-to-br from-sage-green/20 to-rich-earth/15 rounded-2xl">
              <MapPin className="w-8 h-8 text-sage-green" />
            </div>
          </div>
          <h2 className="text-feature text-deep-forest">Location & Setting</h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-2xl font-bold text-forest mb-2">
              {organization.location.city}, {organization.location.region}
            </div>
            <div className="text-xl text-forest/80 mb-4">{organization.location.country}</div>
            {organization.location.address && (
              <div className="text-body text-forest/70">{organization.location.address}</div>
            )}
          </div>
        </div>
      </div>

      {/* Transportation & Access */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Getting There */}
        <div className="bg-white rounded-2xl p-8 shadow-nature border border-beige/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sunset/10 rounded-xl">
              <Plane className="w-6 h-6 text-sunset" />
            </div>
            <h3 className="text-xl font-semibold text-forest">Getting There</h3>
          </div>
          
          <div className="space-y-6">
            {/* Airport Information */}
            <div className="p-4 bg-sunset/5 rounded-xl">
              <h4 className="font-semibold text-forest mb-2">Nearest Airport</h4>
              <p className="text-forest/80 leading-relaxed">{organization.location.nearestAirport}</p>
            </div>
            
            {/* Transportation Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-forest">Transportation Services</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  organization.transportation.airportPickup 
                    ? 'border-sage-green bg-sage-green/5 text-sage-green' 
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}>
                  <Car className="w-6 h-6 mb-2" />
                  <div className="text-sm font-medium">Airport Pickup</div>
                  <div className="text-xs mt-1">
                    {organization.transportation.airportPickup ? 'Included' : 'Not Available'}
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  organization.transportation.localTransport 
                    ? 'border-sage-green bg-sage-green/5 text-sage-green' 
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}>
                  <Car className="w-6 h-6 mb-2" />
                  <div className="text-sm font-medium">Local Transport</div>
                  <div className="text-xs mt-1">
                    {organization.transportation.localTransport ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-beige/30 rounded-xl">
                <p className="text-forest/80 text-sm leading-relaxed">
                  {organization.transportation.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Information */}
        <div className="bg-white rounded-2xl p-8 shadow-nature border border-beige/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rich-earth/10 rounded-xl">
              <Globe className="w-6 h-6 text-rich-earth" />
            </div>
            <h3 className="text-xl font-semibold text-forest">Local Details</h3>
          </div>
          
          <div className="space-y-6">
            {/* Time Zone */}
            <div className="flex items-center gap-4 p-4 bg-rich-earth/5 rounded-xl">
              <Clock className="w-6 h-6 text-rich-earth" />
              <div>
                <div className="font-semibold text-forest">Time Zone</div>
                <div className="text-forest/70">{organization.location.timezone}</div>
              </div>
            </div>
            
            {/* Languages */}
            <div>
              <h4 className="font-semibold text-forest mb-3">Languages Spoken</h4>
              <div className="flex flex-wrap gap-2">
                {organization.languages.map((language, index) => (
                  <span key={index} className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Internet Access */}
            <div className="flex items-center gap-4 p-4 bg-beige/30 rounded-xl">
              <Wifi className={`w-6 h-6 ${
                organization.internetAccess.available ? 'text-sage-green' : 'text-gray-400'
              }`} />
              <div>
                <div className="font-semibold text-forest">Internet Access</div>
                <div className="text-forest/70 capitalize">
                  {organization.internetAccess.available 
                    ? `${organization.internetAccess.quality} WiFi available` 
                    : 'No internet access'
                  }
                </div>
                <div className="text-xs text-forest/60 mt-1">
                  {organization.internetAccess.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Activities & Exploration */}
      {program.highlights && program.highlights.length > 0 && (
        <div className="bg-gradient-to-br from-deep-forest via-forest to-sage-green/20 rounded-3xl p-8 lg:p-12 text-white shadow-nature-xl">
          <div className="text-center space-y-6 mb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="p-4 bg-gradient-to-br from-sunset/30 to-golden-hour/20 rounded-2xl">
                <Camera className="w-8 h-8 text-gentle-lemon" />
              </div>
            </div>
            <h3 className="text-feature text-white">Local Adventures & Activities</h3>
            <p className="text-body-large text-white/90 max-w-3xl mx-auto leading-relaxed">
              Explore the incredible natural beauty and cultural richness of {organization.location.region} during your free time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {program.highlights.map((highlight, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                    <Mountain className="w-5 h-5 text-gentle-lemon" />
                  </div>
                  <div>
                    <p className="text-white/90 leading-relaxed">{highlight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-semibold text-white mb-3">Your Schedule</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-gentle-lemon">{program.schedule.daysPerWeek}</div>
                  <div className="text-white/90">days of work per week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sunset">{7 - program.schedule.daysPerWeek}</div>
                  <div className="text-white/90">days free for exploration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Climate & What to Pack */}
      <div className="bg-white rounded-2xl p-8 shadow-nature border border-beige/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-sunset/10 rounded-xl">
            <Thermometer className="w-6 h-6 text-sunset" />
          </div>
          <h3 className="text-xl font-semibold text-forest">Climate & Preparation</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-forest mb-4">Climate Information</h4>
            <div className="space-y-3">
              <div className="p-4 bg-sunset/5 rounded-xl">
                <div className="font-medium text-forest mb-1">Tropical Climate</div>
                <div className="text-forest/70 text-sm">Warm temperatures year-round with distinct wet and dry seasons</div>
              </div>
              <div className="p-4 bg-sunset/5 rounded-xl">
                <div className="font-medium text-forest mb-1">Average Temperature</div>
                <div className="text-forest/70 text-sm">24-30°C (75-86°F) throughout the year</div>
              </div>
              <div className="p-4 bg-sunset/5 rounded-xl">
                <div className="font-medium text-forest mb-1">Rainfall</div>
                <div className="text-forest/70 text-sm">Higher rainfall May-November, drier December-April</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-forest mb-4">What to Pack</h4>
            <div className="space-y-3">
              <div className="p-4 bg-beige/30 rounded-xl">
                <div className="font-medium text-forest mb-2">Essential Items</div>
                <ul className="text-forest/70 text-sm space-y-1">
                  <li>• Lightweight, quick-dry clothing</li>
                  <li>• Waterproof jacket and pants</li>
                  <li>• Sturdy hiking boots</li>
                  <li>• Insect repellent and sunscreen</li>
                </ul>
              </div>
              <div className="p-4 bg-beige/30 rounded-xl">
                <div className="font-medium text-forest mb-2">Work Gear</div>
                <ul className="text-forest/70 text-sm space-y-1">
                  <li>• Work gloves</li>
                  <li>• Old clothes for animal care</li>
                  <li>• Rubber boots</li>
                  <li>• Hat and sunglasses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Other Sections */}
      {onTabChange && (
        <div className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 rounded-2xl p-6 border border-sage-green/20">
          <h3 className="text-lg font-semibold text-deep-forest mb-4">Ready for the Next Step?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => onTabChange('practical')}
              className="text-left p-4 bg-white rounded-xl border border-sage-green/30 hover:border-sage-green/60 transition-all"
            >
              <div className="font-medium text-deep-forest mb-1">View Requirements</div>
              <div className="text-sm text-deep-forest/70">Costs, visas, and preparation details</div>
            </button>
            <button
              onClick={() => onTabChange('connect')}
              className="text-left p-4 bg-white rounded-xl border border-rich-earth/30 hover:border-rich-earth/60 transition-all"
            >
              <div className="font-medium text-deep-forest mb-1">Start Application</div>
              <div className="text-sm text-deep-forest/70">Connect with the organization</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTab;