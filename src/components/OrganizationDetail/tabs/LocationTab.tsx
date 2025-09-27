// src/components/OrganizationDetail/tabs/LocationTab.tsx
import React from 'react';
import {
  MapPin,
  Plane,
  Clock,
  Thermometer,
  Car,
  Globe,
  Mountain,
  Camera,
  Heart,
  Calendar,
  Cloud,
  CheckCircle
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SharedTabSection from '../SharedTabSection';
import { scrollToTabContent } from '../../../lib/scrollUtils';
import { useOrganizationLocation, useTabDataState } from '../../../hooks/useOrganizationTabData';

interface LocationTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
  hideDuplicateInfo?: boolean;
}

const LocationTab: React.FC<LocationTabProps> = ({ organization, onTabChange, hideDuplicateInfo = false }) => {
  // Fetch real database data using proper service method
  const locationQuery = useOrganizationLocation(organization.slug);
  const { data: locationData, isLoading, error } = useTabDataState(locationQuery, 'Location');

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
          <p className="text-forest/60 mb-4">Unable to load location information</p>
          <button 
            onClick={() => locationQuery.refetch()}
            className="px-4 py-2 bg-rich-earth text-white rounded hover:bg-deep-earth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use database data if available, otherwise fallback to organization data
  const locationInfo = locationData?.organization || organization;
  const transportation = locationData?.transportation || organization.transportation;
  const activities = locationData?.activities || [];
  const languages = locationData?.languages || [];
  const primaryProgram = locationData?.primary_program || organization.programs?.[0];
  
  // Ensure we have a valid program with fallback data
  const program = primaryProgram || {
    title: 'Wildlife Conservation Program',
    highlights: [],
    schedule: {
      daysPerWeek: 5,
      hoursPerDay: 6
    }
  };

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      {/* Location Overview - Discovery-First Hero */}
      <SharedTabSection
        title="Your Conservation Location"
        variant="hero"
        level="essential"
        icon={MapPin}
      >
        <div className="text-center max-w-3xl mx-auto px-4">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-deep-forest mb-3 sm:mb-4">
            {locationInfo.city}, {locationInfo.region}
          </div>
          <div className="text-lg sm:text-xl text-forest/80 mb-4 sm:mb-6">{locationInfo.country}</div>
          <p className="text-base sm:text-lg text-forest/90 leading-relaxed">
            Discover the incredible {locationInfo.region} region where your conservation work will make a lasting impact on local wildlife and communities.
          </p>
        </div>
      </SharedTabSection>

      {/* Getting There & Arrival - Discovery-First Design */}
      <SharedTabSection
        title="Getting There & Arrival"
        variant="section"
        level="important"
        icon={Plane}
        className="mt-8"
      >
        <div className="space-y-6">
          {/* Section Introduction */}
          <div className="text-center px-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-deep-forest mb-3">Your Journey Begins Here</h3>
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto">
              Complete travel guide to help you reach {locationInfo.city} and start your conservation journey with confidence.
            </p>
          </div>

          {/* Main Transportation Container */}
          <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-warm-beige/40 shadow-nature-xl">
            
            {/* Airport & Transportation Section */}
            <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 mb-8 sm:mb-10">
              
              {/* Airport Information - Enhanced */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warm-sunset/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-warm-sunset" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-deep-forest">Travel to {locationInfo.city}</h3>
                </div>

                {/* Airport Details */}
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-warm-beige/30">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warm-sunset/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-warm-sunset" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-forest mb-2 text-sm sm:text-base">Nearest International Airport</h4>
                        <p className="text-sm sm:text-base text-forest/80 leading-relaxed">{locationInfo.nearest_airport || 'Airport information not provided'}</p>
                      </div>
                    </div>
                    
                    {/* Gateway Badge - Full Width on Mobile */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-warm-sunset/10 text-warm-sunset rounded-lg sm:rounded-full text-xs sm:text-sm font-medium">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-center sm:text-left">Primary gateway to {locationInfo.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transportation Services - Enhanced */}
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-warm-beige/30">
                  <h4 className="font-semibold text-forest mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-sage-green flex-shrink-0" />
                    Transportation Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-center ${transportation?.airport_pickup
                      ? 'border-sage-green bg-sage-green/5 text-sage-green hover:bg-sage-green/10'
                      : 'border-orange-200 bg-orange-50 text-orange-600'
                      }`}>
                      <Car className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-3" />
                      <div className="font-semibold mb-1 text-xs sm:text-sm">Airport Pickup</div>
                      <div className="text-xs sm:text-sm">
                        {transportation?.airport_pickup ? 'Included' : 'Arrange separately'}
                      </div>
                    </div>

                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-center ${transportation?.local_transport
                      ? 'border-sage-green bg-sage-green/5 text-sage-green hover:bg-sage-green/10'
                      : 'border-orange-200 bg-orange-50 text-orange-600'
                      }`}>
                      <Car className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-3" />
                      <div className="font-semibold mb-1 text-xs sm:text-sm">Local Transport</div>
                      <div className="text-xs sm:text-sm">
                        {transportation?.local_transport ? 'Available' : 'Arrange separately'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrival Information - Styled Card */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-sage-green" />
                  </div>
                  <h4 className="font-semibold text-deep-forest text-sm sm:text-base">Arrival Planning</h4>
                </div>

                {/* Quick Facts */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-sage-green/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-sage-green flex-shrink-0" />
                      <span className="font-medium text-forest text-xs sm:text-sm">Arrival Days</span>
                    </div>
                    <div className="text-xs sm:text-sm text-forest/70">
                      {transportation?.preferred_arrival_days || 'Any day - flexible arrival'}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-rich-earth/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-rich-earth flex-shrink-0" />
                      <span className="font-medium text-forest text-xs sm:text-sm">Best Arrival Time</span>
                    </div>
                    <div className="text-xs sm:text-sm text-forest/70">
                      {transportation?.preferred_arrival_time || 'Daytime arrivals recommended'}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-golden-hour/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-golden-hour flex-shrink-0" />
                      <span className="font-medium text-forest text-xs sm:text-sm">Time Zone</span>
                    </div>
                    <div className="text-xs sm:text-sm text-forest/70">
                      {locationInfo.timezone || 'Local time zone'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Details - Full Width */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-warm-beige/40">
              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rich-earth/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rich-earth" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-forest mb-2 sm:mb-3 text-sm sm:text-base">Transportation Details</h4>
                    {transportation?.description ? (
                      <p className="text-sm sm:text-base text-forest/80 leading-relaxed">
                        {transportation.description}
                      </p>
                    ) : (
                      <p className="text-sm sm:text-base text-forest/60 italic leading-relaxed">
                        Transportation details will be provided after booking confirmation.
                      </p>
                    )}
                    
                    {/* Show additional cost information if available */}
                    {transportation?.additional_cost && parseFloat(transportation.additional_cost) > 0 && (
                      <div className="mt-3 p-3 bg-warm-sunset/10 border border-warm-sunset/20 rounded-lg">
                        <div className="text-sm text-warm-sunset font-medium">
                          Additional transportation cost: ${transportation.additional_cost}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Instructions Badge - Mobile Optimized */}
                <div className="bg-rich-earth/5 border border-rich-earth/20 rounded-lg p-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Calendar className="w-4 h-4 text-rich-earth flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-rich-earth leading-relaxed">
                      <span className="font-semibold block sm:inline">Travel Planning:</span>
                      <span className="block sm:inline sm:ml-1">
                        {transportation?.airport_pickup 
                          ? 'Pickup details provided after booking confirmation'
                          : 'Detailed directions and transport options provided after booking'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>

      {/* Local Information - Community Focus */}
      <SharedTabSection
        title="Local Community & Culture"
        variant="section"
        level="important"
        icon={Globe}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center px-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-deep-forest mb-3">Connect with Your New Community</h3>
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto">
              Essential local information to help you settle in and connect with the community in {locationInfo.region || locationInfo.city || 'your destination'}.
            </p>
          </div>

          <div className="bg-gradient-to-br from-warm-beige/20 to-gentle-lemon/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-warm-beige/40 shadow-nature-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Local Context */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rich-earth/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-rich-earth" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-deep-forest">Local Context</h4>
                </div>

                {/* Location Details */}
                <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-warm-beige/30">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rich-earth flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-forest text-sm sm:text-base">
                          {locationInfo.city}, {locationInfo.region}
                        </div>
                        <div className="text-xs sm:text-sm text-forest/70">{locationInfo.country}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-rich-earth flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-forest text-sm sm:text-base">Time Zone</div>
                        <div className="text-xs sm:text-sm text-forest/70">{locationInfo.timezone || 'Local time zone'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-sage-green" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-deep-forest">Communication</h4>
                </div>

                {/* Languages */}
                <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-warm-beige/30">
                  <h5 className="font-semibold text-forest mb-3 sm:mb-4 text-sm sm:text-base">Languages Spoken</h5>
                  {languages && languages.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {languages.map((language, index) => (
                          <span key={index} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sage-green/15 text-sage-green rounded-full text-xs sm:text-sm font-medium border border-sage-green/20">
                            {language.language_name}
                            {language.proficiency_level && (
                              <span className="ml-1 text-sage-green/70 font-normal">
                                ({language.proficiency_level})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-forest/70">
                        Our team speaks multiple languages to support international volunteers
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-forest/60 italic">
                        Language information will be provided during the application process.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SharedTabSection>

      {/* Local Adventures - Discovery Section */}
      {(activities && activities.length > 0) || (locationData?.primary_program?.days_per_week) ? (
        <div className="bg-gradient-to-br from-deep-forest via-forest to-sage-green/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 text-white shadow-nature-xl">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10 px-4">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sunset/30 to-golden-hour/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gentle-lemon" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">Local Adventures & Activities</h3>
            <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Explore the incredible natural beauty and cultural richness of {locationInfo.region || locationInfo.city || 'your destination'} during your free time.
            </p>
          </div>

          {/* Activities from Database */}
          {activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {activities.map((activity, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mountain className="w-3 h-3 sm:w-4 sm:h-4 text-gentle-lemon" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white mb-1 text-sm sm:text-base">{activity.activity_name}</div>
                      {activity.activity_description && (
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{activity.activity_description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 border border-white/20">
                <Camera className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70 text-sm sm:text-base">
                  Local activity information will be provided after booking confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Schedule Information from Database */}
          {locationData?.primary_program && (
            <div className="text-center mt-6 sm:mt-8 lg:mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Your Schedule</h4>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gentle-lemon mb-1">
                      {locationData.primary_program.days_per_week || 5}
                    </div>
                    <div className="text-sm sm:text-base text-white/90">days of work per week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-sunset mb-1">
                      {7 - (locationData.primary_program.days_per_week || 5)}
                    </div>
                    <div className="text-sm sm:text-base text-white/90">days free for exploration</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Climate Information - Preparation Focus */}
      <SharedTabSection
        title="Climate & Weather"
        variant="section"
        level="important"
        icon={Thermometer}
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="text-center px-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-deep-forest mb-3">What to Expect Weather-Wise</h3>
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto">
              Understanding {locationInfo.region || locationInfo.city}'s climate helps you pack smart and prepare for your outdoor conservation work.
            </p>
          </div>

          <div className="bg-gradient-to-br from-warm-beige/20 to-gentle-lemon/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-warm-beige/40 shadow-nature">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-warm-sunset/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warm-sunset/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-warm-sunset" />
                </div>
                <div className="font-semibold text-forest mb-2 text-sm sm:text-base">Climate Type</div>
                <div className="text-xs sm:text-sm text-forest/70 leading-relaxed">
                  No information available
                </div>
              </div>
              <div className="text-center bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rich-earth/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rich-earth/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-rich-earth" />
                </div>
                <div className="font-semibold text-forest mb-2 text-sm sm:text-base">Temperature</div>
                <div className="text-xs sm:text-sm text-forest/70 leading-relaxed">
                  No information available
                </div>
              </div>
              <div className="text-center bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-sage-green/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage-green/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-sage-green" />
                </div>
                <div className="font-semibold text-forest mb-2 text-sm sm:text-base">Rainfall</div>
                <div className="text-xs sm:text-sm text-forest/70 leading-relaxed">
                  No information available
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-golden-hour/30 text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-golden-hour/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-golden-hour" />
                </div>
                <span className="font-semibold text-forest text-sm sm:text-base">Packing Tip</span>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed">
                Pack light, quick-dry materials and waterproof gear. Check our detailed packing guide in the Practical tab for complete preparation tips.
              </p>
            </div>
          </div>
        </div>
      </SharedTabSection>

      {/* Stories Tab CTA - Enhanced */}
      <div className="text-center py-8 sm:py-10 lg:py-12 px-4 bg-gradient-to-r from-soft-cream/50 to-warm-beige/20 rounded-2xl border border-warm-beige/30">
        <h3 className="text-lg sm:text-xl lg:text-2xl text-deep-forest mb-3 sm:mb-4">
          Real Stories from {locationInfo.region || locationInfo.city}
        </h3>
        <p className="text-base sm:text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8">
          Discover what other volunteers experienced living and working in this incredible location through their authentic stories and insights.
        </p>
        {onTabChange && (
          <button
            onClick={() => {
              onTabChange('stories');
              scrollToTabContent();
            }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-rich-earth hover:bg-rich-earth/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Read Volunteer Stories</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationTab;