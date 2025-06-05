// src/components/OrganizationDetail/PracticalInformation.tsx
import React, { useState } from 'react';
import { 
  Shield, 
  Heart, 
  Briefcase, 
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
import { OrganizationDetail } from '../../types';

interface PracticalInformationProps {
  organization: OrganizationDetail;
}

const PracticalInformation: React.FC<PracticalInformationProps> = ({ organization }) => {
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
  );
};

export default PracticalInformation;