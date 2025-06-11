// src/components/OrganizationDetail/tabs/OverviewTab.tsx
import React from 'react';
import { 
  CheckCircle, 
  Award, 
  Calendar, 
  MapPin,
  Users,
  Target,
  Shield,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import SharedTabSection from '../SharedTabSection';

interface OverviewTabProps {
  organization: OrganizationDetail;
  isDesktop?: boolean;
  sidebarVisible?: boolean;
  hideDuplicateInfo?: boolean;
  onTabChange?: (tabId: string) => void;
}


const OverviewTab: React.FC<OverviewTabProps> = ({ 
  
  organization, 
  isDesktop = false,
  sidebarVisible = false,
  hideDuplicateInfo = false,
  onTabChange 
}) => {

    const program = organization.programs[0]; // Get first program for experience details

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Level 1: Essential Information - Always Visible */}
      <SharedTabSection
        title="Our Mission"
        variant="hero"
        level="essential"
        icon={Target}
      >
        <p className="text-lg sm:text-xl leading-relaxed text-[#2C392C]/90 max-w-3xl mx-auto">
          {organization.mission}
        </p>
        <div className="text-base text-[#D2691E] font-semibold mt-4">
          {organization.tagline}
        </div>
      </SharedTabSection>

      {/* Quick Facts Grid - Conditional based on desktop sidebar */}
      {!hideDuplicateInfo && (
        <div className="bg-white rounded-2xl shadow-md border border-[#F5E8D4]/60 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Established */}
            <div className="bg-gradient-to-br from-[#F5E8D4]/20 to-[#F8F3E9]/30 rounded-xl p-6 text-center border border-[#F5E8D4]/40">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a2e1a]">Established</h3>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-[#2C392C]">{organization.yearFounded}</div>
                <div className="text-sm text-[#2C392C]/70">
                  {new Date().getFullYear() - organization.yearFounded} years of conservation
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-[#F5E8D4]/20 to-[#F8F3E9]/30 rounded-xl p-6 text-center border border-[#F5E8D4]/40">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-[#87A96B]/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-[#87A96B]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a2e1a]">Location</h3>
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-[#2C392C]">{organization.location.city}</div>
                <div className="text-sm text-[#2C392C]/70">{organization.location.region}, {organization.location.country}</div>
              </div>
            </div>

            {/* Volunteers Hosted */}
            <div className="bg-gradient-to-br from-[#F5E8D4]/20 to-[#F8F3E9]/30 rounded-xl p-6 text-center border border-[#F5E8D4]/40">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-[#D2691E]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#D2691E]" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a2e1a]">Volunteers</h3>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-[#2C392C]">{organization.statistics.volunteersHosted.toLocaleString()}</div>
                <div className="text-sm text-[#2C392C]/70">volunteers hosted</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop: Enhanced focus on mission and impact since basics are in sidebar */}
      {hideDuplicateInfo && (
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhanced Organization Heritage */}
            <div className="bg-gradient-to-br from-[#F5E8D4]/20 to-[#F8F3E9]/30 rounded-xl p-6 border border-[#F5E8D4]/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#8B4513]/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-l sm:text-xl lg:text-2xl font-semibold text-[#1a2e1a]">Heritage & Experience</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#8B4513]/5 to-[#D2691E]/5 border border-[#8B4513]/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#8B4513]">{new Date().getFullYear() - organization.yearFounded}</div>
                  <div className="text-sm text-[#2C392C]/80">Years of Conservation Excellence</div>
                </div>
                <div className="bg-gradient-to-r from-[#D2691E]/5 to-[#DAA520]/5 border border-[#D2691E]/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#D2691E]">{organization.statistics.volunteersHosted.toLocaleString()}</div>
                  <div className="text-sm text-[#2C392C]/80">Volunteers Guided & Trained</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Impact Statistics */}
            <div className="bg-gradient-to-br from-[#F5E8D4]/20 to-[#F8F3E9]/30 rounded-xl p-6 border border-[#F5E8D4]/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#87A96B]/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-[#87A96B]" />
                </div>
                <h3 className="text-l sm:text-xl lg:text-2xl font-semibold text-[#1a2e1a]">Conservation Impact</h3>
              </div>
              <div className="space-y-4">
                {organization.statistics.animalsRescued && (
                  <div className="bg-gradient-to-r from-[#87A96B]/5 to-[#DAA520]/5 border border-[#87A96B]/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-[#87A96B]">{organization.statistics.animalsRescued.toLocaleString()}</div>
                    <div className="text-sm text-[#2C392C]/80">Animals Rescued & Rehabilitated</div>
                  </div>
                )}
                <div className="bg-gradient-to-r from-[#DAA520]/5 to-[#FCF59E]/10 border border-[#DAA520]/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#DAA520]">{organization.location.city}</div>
                  <div className="text-sm text-[#2C392C]/80">{organization.location.region}, {organization.location.country}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level 2: Important Details - Expandable */}
      <ExpandableSection
        title="Verification & Trust"
        level="important"
        icon={Shield}
        preview="Certified conservation center with verified credentials and official certifications"
        className="mt-8"
      >
        <div className="space-y-4">
          {/* Verification Status */}
          <div className="flex items-center gap-4 p-4 bg-[#87A96B]/5 rounded-xl">
            {organization.verified && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#87A96B]/10 text-[#87A96B] rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verified Organization</span>
              </div>
            )}
            <span className="text-sm text-[#1a2e1a]/70">Trusted and certified conservation center</span>
          </div>
          
          {/* Certifications Grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {organization.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#87A96B]/5 rounded-xl">
                <Award className="w-4 h-4 text-[#87A96B] flex-shrink-0" />
                <span className="text-sm text-[#2C392C] font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Conservation Impact"
        level="important"
        icon={TrendingUp}
        preview={`${organization.statistics.animalsRescued?.toLocaleString() || 'Hundreds of'} animals rescued and rehabilitated over ${organization.statistics.yearsOperating} years`}
        className="mt-8"
      >
        <div className="space-y-6">
          {/* Impact Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#87A96B]/10 to-[#87A96B]/5 rounded-2xl p-6 border border-[#87A96B]/20">
              <div className="text-3xl font-bold text-[#87A96B] mb-2">
                {organization.statistics.animalsRescued?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-base text-[#1a2e1a]/80 font-medium">Animals Rescued & Rehabilitated</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#D2691E]/10 to-[#D2691E]/5 rounded-2xl p-6 border border-[#D2691E]/20">
              <div className="text-3xl font-bold text-[#D2691E] mb-2">
                {organization.statistics.yearsOperating}
              </div>
              <div className="text-base text-[#1a2e1a]/80 font-medium">Years of Conservation Work</div>
            </div>
          </div>
          
          {/* Impact Description */}
          {organization.statistics.conservationImpact && (
            <div className="bg-gradient-to-br from-[#8B4513]/5 to-[#8B4513]/10 rounded-2xl p-6 border border-[#8B4513]/20">
              <p className="text-base text-[#1a2e1a]/90">
                {organization.statistics.conservationImpact}
              </p>
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* Level 3: Comprehensive Details - Detailed Expandable */}
      <ExpandableSection
        title="Available Programs"
        level="comprehensive"
        icon={BookOpen}
        preview={`${organization.programs.length} volunteer program${organization.programs.length > 1 ? 's' : ''} available with detailed requirements and activities`}
        className="mt-8"
      >
        <div className="space-y-6">
          {organization.programs.map((program, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-[#F5E8D4]/30 to-[#F8F3E9]/50 rounded-2xl border border-[#F5E8D4]/40">
              <div className="mb-4">
                <h4 className="text-xl font-semibold text-[#1a2e1a] mb-2">{program.title}</h4>
                <p className="text-base text-[#2C392C]/80 leading-relaxed">{program.description}</p>
                <div className="mt-3 text-sm text-[#8B4513] font-medium">
                  Duration: {program.duration.min}-{program.duration.max || '∞'} weeks • 
                  <span className="text-[#87A96B] ml-1">See Practical tab for complete details</span>
                </div>
              </div>
              
              {/* Animal Types */}
              <div className="flex flex-wrap gap-2">
                {program.animalTypes.slice(0, 4).map((animal, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#87A96B]/10 text-[#87A96B] rounded-full text-sm font-medium">
                    {animal}
                  </span>
                ))}
                {program.animalTypes.length > 4 && (
                  <span className="px-3 py-1 bg-[#2C392C]/10 text-[#2C392C] rounded-full text-sm font-medium">
                    +{program.animalTypes.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center">
        <p className="text-body text-deep-forest/70 mb-4">
          Interested in what you'll be doing day-to-day?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('experience')}
            className="inline-flex items-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Explore the Experience
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
};

export default OverviewTab;