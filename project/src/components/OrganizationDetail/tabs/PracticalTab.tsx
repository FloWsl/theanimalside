// src/components/OrganizationDetail/tabs/PracticalTab.tsx
import React from 'react';
import { FileText, DollarSign, Clock, Briefcase, Heart, Stethoscope } from 'lucide-react';
import { OrganizationDetail, Program } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import PracticalInformation from '../PracticalInformation';
import EssentialInfoSidebar from '../EssentialInfoSidebar';
import QuickInfoCards from '../QuickInfoCards';

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
  return (
    <div className="space-y-6">
      {/* Level 1: Essential Practical Overview - Conditional based on desktop sidebar */}
      {!hideDuplicateInfo && (
        <div className="bg-gradient-to-br from-rich-earth/5 via-gentle-lemon/5 to-warm-sunset/5 rounded-3xl p-6 lg:p-8 shadow-nature-xl border border-rich-earth/10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rich-earth/20 to-warm-sunset/15 rounded-2xl">
                <Briefcase className="w-6 h-6 text-rich-earth" />
              </div>
            </div>
            <h2 className="text-feature font-bold text-[#1a2e1a]">Practical Information</h2>
            <p className="text-body-large text-[#2C392C]/90 max-w-3xl mx-auto">
              Everything you need to know about costs, requirements, and logistics for your volunteer experience.
            </p>
          </div>
          
          {/* Quick Practical Facts - Only on mobile since sidebar shows this on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {/* Cost */}
            <div className="bg-white rounded-2xl p-4 text-center border border-rich-earth/20">
              <div className="text-card-title font-bold text-[#8B4513] mb-1">
                {selectedProgram.cost.amount === 0 ? 'FREE' : `${selectedProgram.cost.currency} ${selectedProgram.cost.amount}`}
              </div>
              <div className="text-caption text-[#1a2e1a]/70">per {selectedProgram.cost.period}</div>
            </div>
            
            {/* Duration */}
            <div className="bg-white rounded-2xl p-4 text-center border border-sage-green/20">
              <div className="text-card-title font-bold text-[#87A96B] mb-1">
                {selectedProgram.duration.min}-{selectedProgram.duration.max || '∞'}
              </div>
              <div className="text-caption text-[#1a2e1a]/70">weeks</div>
            </div>
            
            {/* Age Requirement */}
            <div className="bg-white rounded-2xl p-4 text-center border border-warm-sunset/20">
              <div className="text-card-title font-bold text-[#D2691E] mb-1">
                {organization.ageRequirement.min}+
              </div>
              <div className="text-caption text-[#1a2e1a]/70">years old</div>
            </div>
            
            {/* Languages */}
            <div className="bg-white rounded-2xl p-4 text-center border border-golden-hour/20">
              <div className="text-card-title font-bold text-[#DAA520] mb-1">
                {organization.languages.length}
              </div>
              <div className="text-caption text-[#1a2e1a]/70">languages</div>
            </div>
          </div>
          
          {/* Quick Requirements List */}
          <div className="mt-6 p-4 bg-white/80 rounded-2xl border border-sage-green/20">
            <h4 className="text-body-small font-semibold text-[#1a2e1a] mb-2">Key Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProgram.requirements.slice(0, 3).map((req, index) => (
                <span key={index} className="px-3 py-1 bg-[#87A96B]/10 text-[#87A96B] rounded-full text-caption font-medium">
                  {req}
                </span>
              ))}
              {selectedProgram.requirements.length > 3 && (
                <span className="px-3 py-1 bg-[#2C392C]/10 text-[#2C392C] rounded-full text-caption font-medium">
                  +{selectedProgram.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop: Focus on detailed logistics since basics are in sidebar */}
      {hideDuplicateInfo && (
        <div className="bg-gradient-to-br from-rich-earth/5 via-gentle-lemon/5 to-warm-sunset/5 rounded-3xl p-6 lg:p-8 shadow-nature-xl border border-rich-earth/10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rich-earth/20 to-warm-sunset/15 rounded-2xl">
                <Briefcase className="w-6 h-6 text-rich-earth" />
              </div>
            </div>
            <h2 className="text-feature font-bold text-[#1a2e1a]">Detailed Logistics & Preparation</h2>
            <p className="text-body-large text-[#2C392C]/90 max-w-3xl mx-auto">
              Comprehensive preparation guide and logistics information for your volunteer experience.
            </p>
          </div>
        </div>
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
        className="mt-6"
        isDesktop={isDesktop}
        forceExpanded={hideDuplicateInfo} // Always show detailed costs on desktop since basics are in sidebar
      >
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-rich-earth/5 to-rich-earth/10 rounded-2xl p-6 border border-rich-earth/20">
              <h4 className="text-subtitle font-semibold text-[#1a2e1a] mb-4">What's Included</h4>
              <div className="space-y-2">
                {selectedProgram.cost.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#8B4513] flex-shrink-0" />
                    <span className="text-body-small text-[#1a2e1a]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 rounded-2xl p-6 border border-warm-sunset/20">
              <h4 className="text-subtitle font-semibold text-[#1a2e1a] mb-4">Not Included</h4>
              <div className="space-y-2">
                {selectedProgram.cost.excludes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-[#D2691E] rounded flex-shrink-0"></div>
                    <span className="text-body-small text-[#1a2e1a]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Accommodation & Meals */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-sage-green/5 rounded-2xl p-6 border border-sage-green/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-3">Accommodation</h4>
              <p className="text-sm text-deep-forest/80 mb-3">{organization.accommodation.description}</p>
              <div className="space-y-1">
                {organization.accommodation.amenities.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="text-xs text-sage-green">• {amenity}</div>
                ))}
              </div>
            </div>
            
            <div className="bg-golden-hour/5 rounded-2xl p-6 border border-golden-hour/20">
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
        className="mt-6"
        isDesktop={isDesktop}
        forceExpanded={hideDuplicateInfo} // Always show logistics details on desktop
      >
        <div className="space-y-6">
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
          <div className="bg-sage-green/5 rounded-2xl p-6 border border-sage-green/20">
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
        className="mt-6"
        isDesktop={isDesktop}
        // Don't force expand comprehensive sections - they remain collapsible even on desktop
      >
        <div className="space-y-6">
          {/* Reusing existing PracticalInformation component */}
          <PracticalInformation organization={organization} />
        </div>
      </ExpandableSection>

      {/* Contextual Information from Other Tabs */}
      <div className="mt-8">
        <h3 className="text-card-title font-semibold text-deep-forest mb-4">Related Information</h3>
        <QuickInfoCards 
          organization={organization} 
          selectedProgram={selectedProgram}
          currentTab="practical"
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};

export default PracticalTab;