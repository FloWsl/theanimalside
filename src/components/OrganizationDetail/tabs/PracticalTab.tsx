// src/components/OrganizationDetail/tabs/PracticalTab.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Heart, 
  Stethoscope,
  Shield,
  Plane,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Thermometer,
  Umbrella,
  Sun,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download
} from 'lucide-react';
import { OrganizationDetail, Program } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import SharedTabSection from '../SharedTabSection';

interface PracticalTabProps {
  organization: OrganizationDetail;
  selectedProgram: Program;
  isDesktop?: boolean;
  sidebarVisible?: boolean;
  hideDuplicateInfo?: boolean;
  onTabChange?: (tabId: string) => void;
}

const PracticalTab: React.FC<PracticalTabProps> = ({ 
  organization, 
  selectedProgram, 
  isDesktop = false,
  sidebarVisible = false,
  hideDuplicateInfo = false,
  onTabChange 
}) => {
  // State for expandable sections in comprehensive health guide
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['requirements']));
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  const isExpanded = (section: string) => expandedSections.has(section);
  return (
    <div className="space-nature-md">
      {/* Level 1: Essential Practical Overview - Conditional based on desktop sidebar */}
      {!hideDuplicateInfo && (
        <SharedTabSection
          title="Practical Information"
          variant="hero"
          level="essential"
          icon={Briefcase}
        >
          <p className="text-body-large text-forest/90 max-w-3xl mx-auto mb-6">
            Everything you need to know about costs, requirements, and logistics for your volunteer experience.
          </p>
          
          {/* Quick Practical Facts - Only on mobile since sidebar shows this on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-nature-sm">
            {/* Cost */}
            <div className="bg-white rounded-2xl p-4 text-center border border-rich-earth/20">
              <div className="text-2xl font-bold text-rich-earth mb-1">
                {selectedProgram.cost.amount === 0 ? 'FREE' : `${selectedProgram.cost.currency} ${selectedProgram.cost.amount}`}
              </div>
              <div className="text-sm text-deep-forest/70">per {selectedProgram.cost.period}</div>
            </div>
            
            {/* Duration */}
            <div className="bg-white rounded-2xl p-4 text-center border border-sage-green/20">
              <div className="text-2xl font-bold text-sage-green mb-1">
                {selectedProgram.duration.min}-{selectedProgram.duration.max || '∞'}
              </div>
              <div className="text-sm text-deep-forest/70">weeks</div>
            </div>
            
            {/* Age Requirement */}
            <div className="bg-white rounded-2xl p-4 text-center border border-warm-sunset/20">
              <div className="text-2xl font-bold text-warm-sunset mb-1">
                {organization.ageRequirement.min}+
              </div>
              <div className="text-sm text-deep-forest/70">years old</div>
            </div>
            
            {/* Languages */}
            <div className="bg-white rounded-2xl p-4 text-center border border-golden-hour/20">
              <div className="text-2xl font-bold text-golden-hour mb-1">
                {organization.languages.length}
              </div>
              <div className="text-sm text-deep-forest/70">languages</div>
            </div>
          </div>
          
          {/* Quick Requirements List */}
          <div className="mt-6 p-4 bg-white/80 rounded-2xl border border-sage-green/20">
            <h4 className="text-sm font-semibold text-deep-forest mb-2">Key Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProgram.requirements.slice(0, 3).map((req, index) => (
                <span key={index} className="px-3 py-1 bg-sage-green/10 text-sage-green rounded-full text-xs font-medium">
                  {req}
                </span>
              ))}
              {selectedProgram.requirements.length > 3 && (
                <span className="px-3 py-1 bg-forest/10 text-forest rounded-full text-xs font-medium">
                  +{selectedProgram.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        </SharedTabSection>
      )}
      
      {/* Desktop: Focus on detailed logistics since basics are in sidebar */}
      {hideDuplicateInfo && (
        <SharedTabSection
          title="Detailed Logistics & Preparation"
          variant="hero"
          level="essential"
          icon={Briefcase}
        >
          <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
            Comprehensive preparation guide and logistics information for your volunteer experience.
          </p>
        </SharedTabSection>
      )}

      {/* Level 2: Important Practical Details - Expandable */}
      <ExpandableSection
        title="Costs & What's Included"
        level="important"
        icon={DollarSign}
        preview={hideDuplicateInfo ? 
          "Detailed cost breakdown and comprehensive list of included services and amenities" :
          `${selectedProgram.cost.amount === 0 ? 'Free program' : `${selectedProgram.cost.currency} ${selectedProgram.cost.amount}/${selectedProgram.cost.period}`} including ${selectedProgram.cost.includes.slice(0, 2).join(', ').toLowerCase()} and more`
        }
        className="mt-8"
        isDesktop={isDesktop}
        forceExpanded={hideDuplicateInfo}
      >
        <div className="space-nature-sm">
          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-nature-sm">
            <div className="bg-gradient-to-br from-rich-earth/5 to-rich-earth/10 rounded-2xl section-padding-sm border border-rich-earth/20">
              <h4 className="text-xl font-semibold text-deep-forest mb-4">What's Included</h4>
              <div className="space-y-2">
                {selectedProgram.cost.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rich-earth flex-shrink-0" />
                    <span className="text-sm text-deep-forest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 rounded-2xl section-padding-sm border border-warm-sunset/20">
              <h4 className="text-xl font-semibold text-deep-forest mb-4">Not Included</h4>
              <div className="space-y-2">
                {selectedProgram.cost.excludes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-warm-sunset rounded flex-shrink-0"></div>
                    <span className="text-sm text-deep-forest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Accommodation & Meals */}
          <div className="grid md:grid-cols-2 gap-nature-sm">
            <div className="bg-sage-green/5 rounded-2xl section-padding-sm border border-sage-green/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-3">Accommodation</h4>
              <p className="text-sm text-deep-forest/80 mb-3">{organization.accommodation.description}</p>
              <div className="space-y-1">
                {organization.accommodation.amenities.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="text-xs text-sage-green">• {amenity}</div>
                ))}
              </div>
            </div>
            
            <div className="bg-golden-hour/5 rounded-2xl section-padding-sm border border-golden-hour/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-3">Meals</h4>
              <p className="text-sm text-deep-forest/80 mb-3">{organization.meals.description}</p>
              <div className="flex flex-wrap gap-1">
                {organization.meals.dietaryOptions.map((option, index) => (
                  <span key={index} className="px-2 py-1 bg-golden-hour/10 text-golden-hour rounded text-xs">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Requirements & Logistics"
        level="important"
        icon={Clock}
        preview={hideDuplicateInfo ? 
          "Comprehensive logistics information including transportation, location details, and language requirements" :
          `Age ${organization.ageRequirement.min}+, ${organization.languages.join('/')} speaking, with ${selectedProgram.requirements.length} specific requirements`
        }
        className="mt-8"
        isDesktop={isDesktop}
        forceExpanded={hideDuplicateInfo}
      >
        <div className="space-nature-sm">
          {/* Requirements Grid */}
          <div>
            <h4 className="text-lg font-semibold text-deep-forest mb-4">Program Requirements</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {selectedProgram.requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-rich-earth/5 rounded-xl">
                  <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-sm text-deep-forest">{req}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Transportation & Logistics */}
          <div className="bg-sage-green/5 rounded-2xl section-padding-sm border border-sage-green/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-3">Transportation & Location</h4>
            <p className="text-sm text-deep-forest/80 mb-4">{organization.transportation.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-semibold text-sage-green mb-2">Location Details</h5>
                <div className="space-y-1 text-xs text-deep-forest/70">
                  <div>• {organization.location.city}, {organization.location.region}</div>
                  <div>• {organization.location.country}</div>
                  <div>• Timezone: {organization.location.timezone}</div>
                  {organization.location.nearestAirport && (
                    <div>• Airport: {organization.location.nearestAirport}</div>
                  )}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-sage-green mb-2">Languages</h5>
                <div className="flex flex-wrap gap-1">
                  {organization.languages.map((lang, index) => (
                    <span key={index} className="px-2 py-1 bg-sage-green/10 text-sage-green rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Level 3: Comprehensive Health & Preparation - Detailed Expandable */}
      <ExpandableSection
        title="Health Requirements & Preparation"
        level="comprehensive"
        icon={Stethoscope}
        preview={`${organization.healthRequirements.vaccinations.length} required vaccinations, travel insurance ${organization.healthRequirements.insurance ? 'mandatory' : 'recommended'}, plus detailed preparation guidance`}
        className="mt-8"
        isDesktop={isDesktop}
      >
        <div className="space-nature-sm">
          {/* Integrated Comprehensive Health & Preparation Guide */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="text-section text-forest">Essential Preparation Guide</h2>
              <p className="text-body-large text-forest/80 max-w-3xl mx-auto">
                Everything you need to know to prepare for your volunteer experience. 
                We've compiled all the practical details to help you feel confident and ready.
              </p>
            </div>
            
            {/* Quick Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Age Requirements */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-beige/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sage-green/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-sage-green" />
                  </div>
                  <h3 className="font-semibold text-forest">Age Requirement</h3>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest">
                    {organization.ageRequirement.min}+
                    {organization.ageRequirement.max && (
                      <span className="text-base font-normal text-forest/70">
                        - {organization.ageRequirement.max}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-forest/70 mt-1">
                    years old
                  </div>
                </div>
              </div>
              
              {/* Physical Fitness */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-beige/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rich-earth/10 rounded-lg">
                    <Heart className="w-5 h-5 text-rich-earth" />
                  </div>
                  <h3 className="font-semibold text-forest">Fitness Level</h3>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-forest mb-2">
                    Moderate
                  </div>
                  <p className="text-sm text-forest/70 leading-relaxed">
                    {organization.healthRequirements.physicalFitness}
                  </p>
                </div>
              </div>
              
              {/* Insurance */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-beige/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sunset/10 rounded-lg">
                    <Shield className="w-5 h-5 text-sunset" />
                  </div>
                  <h3 className="font-semibold text-forest">Insurance</h3>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold mb-2 ${
                    organization.healthRequirements.insurance ? 'text-red-600' : 'text-sage-green'
                  }`}>
                    {organization.healthRequirements.insurance ? 'Required' : 'Optional'}
                  </div>
                  <p className="text-sm text-forest/70">
                    {organization.healthRequirements.insurance 
                      ? 'Comprehensive travel insurance with medical coverage'
                      : 'Recommended for peace of mind'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Detailed Information Sections */}
            <div className="space-y-4">
              
              {/* Skill Requirements */}
              <div className="bg-white rounded-2xl shadow-nature border border-beige/60 overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-beige/30 transition-colors"
                  onClick={() => toggleSection('requirements')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rich-earth/10 rounded-lg">
                        <Briefcase className="w-5 h-5 text-rich-earth" />
                      </div>
                      <h3 className="text-xl font-semibold text-forest">Skills & Requirements</h3>
                    </div>
                    {isExpanded('requirements') ? (
                      <ChevronUp className="w-5 h-5 text-forest/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest/50" />
                    )}
                  </div>
                </div>
                
                {isExpanded('requirements') && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Required Skills */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Required</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {organization.skillRequirements.required.map((skill, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-forest">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Preferred Skills */}
                    {organization.skillRequirements.preferred.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-forest text-lg">Preferred (Not Required)</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {organization.skillRequirements.preferred.map((skill, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-sage-green/10 border border-sage-green/20 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-sage-green flex-shrink-0" />
                              <span className="text-forest">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Training Provided */}
                    {organization.skillRequirements.training.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-forest text-lg">Training We Provide</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {organization.skillRequirements.training.map((training, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-sunset/10 border border-sunset/20 rounded-lg">
                              <Info className="w-4 h-4 text-sunset flex-shrink-0" />
                              <span className="text-forest">{training}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Health & Vaccinations */}
              <div className="bg-white rounded-2xl shadow-nature border border-beige/60 overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-beige/30 transition-colors"
                  onClick={() => toggleSection('health')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sage-green/10 rounded-lg">
                        <Heart className="w-5 h-5 text-sage-green" />
                      </div>
                      <h3 className="text-xl font-semibold text-forest">Health & Vaccinations</h3>
                    </div>
                    {isExpanded('health') ? (
                      <ChevronUp className="w-5 h-5 text-forest/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest/50" />
                    )}
                  </div>
                </div>
                
                {isExpanded('health') && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Vaccinations */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Recommended Vaccinations</h4>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-forest font-medium mb-2">Consult your doctor or travel clinic at least 6 weeks before departure</p>
                            <div className="grid md:grid-cols-2 gap-2">
                              {organization.healthRequirements.vaccinations.map((vaccination, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-sage-green" />
                                  <span className="text-forest text-sm">{vaccination}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Medical Clearance */}
                    {organization.healthRequirements.medicalClearance && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-forest text-lg">Medical Clearance</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-forest font-medium">Medical clearance required</p>
                              <p className="text-forest/70 text-sm mt-1">
                                You'll need a doctor's certificate confirming you're fit for physical work with animals.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Physical Fitness Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Physical Fitness Requirements</h4>
                      <div className="bg-cream rounded-lg p-4">
                        <p className="text-forest leading-relaxed">
                          {organization.healthRequirements.physicalFitness}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Travel & Logistics */}
              <div className="bg-white rounded-2xl shadow-nature border border-beige/60 overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-beige/30 transition-colors"
                  onClick={() => toggleSection('travel')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sunset/10 rounded-lg">
                        <Plane className="w-5 h-5 text-sunset" />
                      </div>
                      <h3 className="text-xl font-semibold text-forest">Travel & Logistics</h3>
                    </div>
                    {isExpanded('travel') ? (
                      <ChevronUp className="w-5 h-5 text-forest/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest/50" />
                    )}
                  </div>
                </div>
                
                {isExpanded('travel') && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Airport & Transportation */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Getting There</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-cream rounded-lg p-4">
                          <h5 className="font-medium text-forest mb-2">Nearest Airport</h5>
                          <p className="text-forest/70 text-sm">{organization.location.nearestAirport}</p>
                        </div>
                        <div className="bg-cream rounded-lg p-4">
                          <h5 className="font-medium text-forest mb-2">Airport Pickup</h5>
                          <p className="text-forest/70 text-sm">
                            {organization.transportation.airportPickup 
                              ? 'Complimentary pickup included' 
                              : 'Not provided - arrange your own transport'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transportation Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Local Transportation</h4>
                      <div className="bg-cream rounded-lg p-4">
                        <p className="text-forest leading-relaxed">
                          {organization.transportation.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timezone */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Time Zone</h4>
                      <div className="bg-cream rounded-lg p-4">
                        <p className="text-forest">
                          {organization.location.timezone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Climate & Packing */}
              <div className="bg-white rounded-2xl shadow-nature border border-beige/60 overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-beige/30 transition-colors"
                  onClick={() => toggleSection('packing')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rich-earth/10 rounded-lg">
                        <Thermometer className="w-5 h-5 text-rich-earth" />
                      </div>
                      <h3 className="text-xl font-semibold text-forest">Climate & What to Pack</h3>
                    </div>
                    {isExpanded('packing') ? (
                      <ChevronUp className="w-5 h-5 text-forest/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest/50" />
                    )}
                  </div>
                </div>
                
                {isExpanded('packing') && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Climate Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Climate in {organization.location.region}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <Sun className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                          <div className="font-medium text-forest">Dry Season</div>
                          <div className="text-sm text-forest/70">Dec - Apr</div>
                          <div className="text-xs text-forest/60 mt-1">Less rain, more sun</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <Umbrella className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="font-medium text-forest">Wet Season</div>
                          <div className="text-sm text-forest/70">May - Nov</div>
                          <div className="text-xs text-forest/60 mt-1">Daily afternoon rain</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                          <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                          <div className="font-medium text-forest">Temperature</div>
                          <div className="text-sm text-forest/70">22-28°C</div>
                          <div className="text-xs text-forest/60 mt-1">Year-round tropical</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Essential Packing List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest text-lg">Essential Packing List</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Clothing */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-forest">Clothing</h5>
                          <div className="space-y-2">
                            {[
                              'Lightweight, quick-dry shirts',
                              'Long pants for animal work',
                              'Rain jacket or poncho',
                              'Comfortable walking shoes',
                              'Waterproof boots',
                              'Hat with sun protection'
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-sage-green" />
                                <span className="text-sm text-forest">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Essentials */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-forest">Essentials</h5>
                          <div className="space-y-2">
                            {[
                              'Strong insect repellent',
                              'High SPF sunscreen',
                              'Personal medications',
                              'Reusable water bottle',
                              'Head torch/flashlight',
                              'Personal first aid kit'
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-sage-green" />
                                <span className="text-sm text-forest">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Download Packing List */}
                    <div className="bg-sage-green/10 border border-sage-green/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-forest">Complete Packing Checklist</h5>
                          <p className="text-sm text-forest/70">Download our comprehensive packing guide</p>
                        </div>
                        <button className="flex items-center gap-2 text-sage-green hover:text-forest transition-colors">
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Support Section */}
            <div className="bg-gradient-to-r from-rich-earth/5 to-sunset/5 rounded-2xl p-8 border border-rich-earth/20">
              <div className="text-center space-y-4">
                <h3 className="text-feature text-forest">Still Have Questions?</h3>
                <p className="text-body text-forest/80 max-w-2xl mx-auto">
                  We're here to help you prepare for your volunteer experience. Don't hesitate to reach out 
                  with any questions about requirements, preparation, or what to expect.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary">
                    Contact {organization.name}
                  </button>
                  <button className="btn-outline flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Preparation Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* NEW: Visa & Documentation Requirements */}
      <ExpandableSection
        title="Visa & Documentation"
        level="important"
        icon={Plane}
        preview="Required documents, visa information, and entry requirements for international volunteers"
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-warm-sunset/5 to-golden-hour/5 rounded-2xl p-6 border border-warm-sunset/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-warm-sunset" />
              Entry Requirements
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-warm-sunset/10">
                  <div className="font-medium text-deep-forest mb-1">Tourist Visa</div>
                  <div className="text-sm text-deep-forest/70">Most volunteers can enter on tourist visa (check with your embassy)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-warm-sunset/10">
                  <div className="font-medium text-deep-forest mb-1">Passport Validity</div>
                  <div className="text-sm text-deep-forest/70">Must be valid for at least 6 months from entry date</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-warm-sunset/10">
                  <div className="font-medium text-deep-forest mb-1">Return Ticket</div>
                  <div className="text-sm text-deep-forest/70">Proof of onward travel required at border</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-warm-sunset/10">
                  <div className="font-medium text-deep-forest mb-1">Immigration Support</div>
                  <div className="text-sm text-deep-forest/70">We provide invitation letters and documentation support</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 mb-1">Important Note</div>
                <div className="text-sm text-blue-800">
                  Visa requirements vary by nationality. Contact us for specific guidance based on your passport.
                  We recommend applying for visas 4-6 weeks before travel.
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* NEW: Cancellation & Refund Policy */}
      <ExpandableSection
        title="Cancellation & Refund Policy"
        level="important"
        icon={Shield}
        preview="Clear cancellation terms, refund conditions, and flexibility options for peace of mind"
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sage-green/5 to-rich-earth/5 rounded-2xl p-6 border border-sage-green/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-sage-green" />
              Cancellation Timeline
            </h4>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-sage-green/10 text-center">
                  <div className="text-2xl font-bold text-sage-green mb-2">90+ days</div>
                  <div className="text-sm font-medium text-deep-forest mb-1">Full Refund</div>
                  <div className="text-xs text-deep-forest/70">Minus $50 admin fee</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-warm-sunset/10 text-center">
                  <div className="text-2xl font-bold text-warm-sunset mb-2">30-89 days</div>
                  <div className="text-sm font-medium text-deep-forest mb-1">75% Refund</div>
                  <div className="text-xs text-deep-forest/70">or 100% credit</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rich-earth/10 text-center">
                  <div className="text-2xl font-bold text-rich-earth mb-2">0-29 days</div>
                  <div className="text-sm font-medium text-deep-forest mb-1">50% Credit</div>
                  <div className="text-xs text-deep-forest/70">Valid for 2 years</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900 mb-1">Emergency Situations</div>
                <div className="text-sm text-yellow-800">
                  Special consideration for medical emergencies, family crises, or travel restrictions. 
                  We work with you to find fair solutions including date transfers and extended credits.
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* NEW: Emergency Support & Safety */}
      <ExpandableSection
        title="Emergency Support & Safety"
        level="important"
        icon={Heart}
        preview="24/7 emergency contacts, safety protocols, and comprehensive volunteer support systems"
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rich-earth/5 to-warm-sunset/5 rounded-2xl p-6 border border-rich-earth/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rich-earth" />
              Safety & Support Network
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-rich-earth/10">
                  <div className="font-medium text-deep-forest mb-2">24/7 Emergency Hotline</div>
                  <div className="text-sm text-deep-forest/70 mb-2">
                    Dedicated emergency line for urgent situations, medical emergencies, or safety concerns
                  </div>
                  <div className="text-xs text-rich-earth font-medium">+[Country Code] Emergency Number</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rich-earth/10">
                  <div className="font-medium text-deep-forest mb-2">On-Site Coordinator</div>
                  <div className="text-sm text-deep-forest/70">
                    Experienced local coordinator available daily for support, guidance, and assistance
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-rich-earth/10">
                  <div className="font-medium text-deep-forest mb-2">Medical Support</div>
                  <div className="text-sm text-deep-forest/70 mb-2">
                    Partnership with local medical facilities and English-speaking healthcare providers
                  </div>
                  <div className="text-xs text-rich-earth font-medium">Hospital: 5 minutes • Clinic: 2 minutes</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-rich-earth/10">
                  <div className="font-medium text-deep-forest mb-2">Embassy Support</div>
                  <div className="text-sm text-deep-forest/70">
                    Direct contacts and assistance with embassy/consulate services if needed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* NEW: Insurance Requirements */}
      <ExpandableSection
        title="Insurance Requirements"
        level="important" 
        icon={Shield}
        preview="Mandatory travel insurance, health coverage requirements, and recommended protection levels"
        className="mt-8"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-golden-hour/5 to-gentle-lemon/10 rounded-2xl p-6 border border-golden-hour/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-golden-hour" />
              Required Coverage
            </h4>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-golden-hour/10">
                  <div className="font-medium text-deep-forest mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-green" />
                    Medical Coverage
                  </div>
                  <div className="text-sm text-deep-forest/70 mb-2">Minimum $100,000 USD medical coverage</div>
                  <div className="text-xs text-golden-hour font-medium">Must include emergency evacuation</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-golden-hour/10">
                  <div className="font-medium text-deep-forest mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-green" />
                    Activity Coverage
                  </div>
                  <div className="text-sm text-deep-forest/70 mb-2">Covers volunteer work and animal handling</div>
                  <div className="text-xs text-golden-hour font-medium">Adventure activities optional</div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Insurance Verification Required</div>
                    <div className="text-sm text-blue-800">
                      You must provide proof of insurance before arrival. We can recommend trusted providers 
                      if you need assistance finding suitable coverage.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-sage-green/10 to-rich-earth/5 rounded-xl border border-sage-green/20">
                <div className="font-medium text-deep-forest mb-2">Recommended Providers</div>
                <div className="text-sm text-deep-forest/70">
                  World Nomads, SafetyWing, or IMG Global - all offer volunteer-specific coverage with competitive rates
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>
      
      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center">
        <p className="text-body text-deep-forest/70 mb-4">
          All set with the details? Time to get in touch!
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('connect')}
            className="inline-flex items-center gap-2 bg-sage-green hover:bg-sage-green/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Ready to Apply
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