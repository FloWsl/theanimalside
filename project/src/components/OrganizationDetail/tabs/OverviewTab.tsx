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
  return (
    <div className="space-y-6">
      {/* Level 1: Essential Information - Always Visible */}
      {/* Mission & Impact Hero - Essential */}
      <div className="bg-gradient-to-br from-[#F8F3E9] via-[#FCF59E]/10 to-[#F5E8D4] rounded-3xl p-6 lg:p-8 shadow-nature-xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#8B4513]/20 to-[#D2691E]/15 rounded-2xl">
              <Target className="w-6 h-6 text-[#8B4513]" />
            </div>
          </div>
          <h2 className="text-feature text-[#1a2e1a]">Our Mission</h2>
          <p className="text-body-large text-[#2C392C]/90 max-w-3xl mx-auto">
            {organization.mission}
          </p>
          <div className="text-body text-[#D2691E] font-semibold">
            {organization.tagline}
          </div>
        </div>
      </div>

      {/* Quick Facts Grid - Conditional based on desktop sidebar */}
      {!hideDuplicateInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Established */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-nature border border-[#F5E8D4]/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#8B4513]/10 rounded-xl">
                <Calendar className="w-5 h-5 text-[#8B4513]" />
              </div>
              <h3 className="text-subtitle font-semibold text-[#2C392C]">Established</h3>
            </div>
            <div className="text-center">
              <div className="text-card-title font-bold text-[#2C392C]">{organization.yearFounded}</div>
              <div className="text-caption text-[#2C392C]/70 mt-1">
                {new Date().getFullYear() - organization.yearFounded} years of conservation
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-nature border border-[#F5E8D4]/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#87A96B]/10 rounded-xl">
                <MapPin className="w-5 h-5 text-[#87A96B]" />
              </div>
              <h3 className="text-subtitle font-semibold text-[#2C392C]">Location</h3>
            </div>
            <div className="text-center">
              <div className="text-subtitle font-bold text-[#2C392C]">{organization.location.city}</div>
              <div className="text-caption text-[#2C392C]/70">{organization.location.region}, {organization.location.country}</div>
            </div>
          </div>

          {/* Volunteers Hosted */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-nature border border-[#F5E8D4]/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#D2691E]/10 rounded-xl">
                <Users className="w-5 h-5 text-[#D2691E]" />
              </div>
              <h3 className="text-subtitle font-semibold text-[#2C392C]">Volunteers</h3>
            </div>
            <div className="text-center">
              <div className="text-card-title font-bold text-[#2C392C]">{organization.statistics.volunteersHosted.toLocaleString()}</div>
              <div className="text-caption text-[#2C392C]/70 mt-1">volunteers hosted</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop: Enhanced focus on mission and impact since basics are in sidebar */}
      {hideDuplicateInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Organization Heritage */}
          <div className="bg-white rounded-2xl p-6 shadow-nature border border-[#F5E8D4]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#8B4513]/10 rounded-xl">
                <Calendar className="w-5 h-5 text-[#8B4513]" />
              </div>
              <h3 className="text-subtitle font-semibold text-[#2C392C]">Heritage & Experience</h3>
            </div>
            <div className="space-y-3">
              <div className="text-center bg-gradient-to-br from-[#8B4513]/5 to-[#D2691E]/5 rounded-xl p-4">
                <div className="text-feature font-bold text-[#8B4513]">{new Date().getFullYear() - organization.yearFounded}</div>
                <div className="text-body-small text-[#2C392C]/80">Years of Conservation Excellence</div>
              </div>
              <div className="text-center bg-gradient-to-br from-[#D2691E]/5 to-[#DAA520]/5 rounded-xl p-4">
                <div className="text-feature font-bold text-[#D2691E]">{organization.statistics.volunteersHosted.toLocaleString()}</div>
                <div className="text-body-small text-[#2C392C]/80">Volunteers Guided & Trained</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Impact Statistics */}
          <div className="bg-white rounded-2xl p-6 shadow-nature border border-[#F5E8D4]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#87A96B]/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#87A96B]" />
              </div>
              <h3 className="text-subtitle font-semibold text-[#2C392C]">Conservation Impact</h3>
            </div>
            <div className="space-y-3">
              {organization.statistics.animalsRescued && (
                <div className="text-center bg-gradient-to-br from-[#87A96B]/5 to-[#DAA520]/5 rounded-xl p-4">
                  <div className="text-feature font-bold text-[#87A96B]">{organization.statistics.animalsRescued.toLocaleString()}</div>
                  <div className="text-body-small text-[#2C392C]/80">Animals Rescued & Rehabilitated</div>
                </div>
              )}
              <div className="text-center bg-gradient-to-br from-[#DAA520]/5 to-[#FCF59E]/10 rounded-xl p-4">
                <div className="text-feature font-bold text-[#DAA520]">{organization.location.city}</div>
                <div className="text-body-small text-[#2C392C]/80">{organization.location.region}, {organization.location.country}</div>
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
        className="mt-6"
      >
        <div className="space-y-4">
          {/* Verification Status */}
          <div className="flex items-center gap-4 p-4 bg-[#87A96B]/5 rounded-xl">
            {organization.verified && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#87A96B]/10 text-[#87A96B] rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-body-small font-medium">Verified Organization</span>
              </div>
            )}
            <span className="text-body-small text-[#1a2e1a]/70">Trusted and certified conservation center</span>
          </div>
          
          {/* Certifications Grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {organization.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#87A96B]/5 rounded-xl">
                <Award className="w-4 h-4 text-[#87A96B] flex-shrink-0" />
                <span className="text-body-small text-[#2C392C] font-medium">{cert}</span>
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
        className="mt-6"
      >
        <div className="space-y-6">
          {/* Impact Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#87A96B]/10 to-[#87A96B]/5 rounded-2xl p-6 border border-[#87A96B]/20">
              <div className="text-feature font-bold text-[#87A96B] mb-2">
                {organization.statistics.animalsRescued?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-body text-[#1a2e1a]/80 font-medium">Animals Rescued & Rehabilitated</div>
            </div>
            
            <div className="bg-gradient-to-br from-[#D2691E]/10 to-[#D2691E]/5 rounded-2xl p-6 border border-[#D2691E]/20">
              <div className="text-feature font-bold text-[#D2691E] mb-2">
                {organization.statistics.yearsOperating}
              </div>
              <div className="text-body text-[#1a2e1a]/80 font-medium">Years of Conservation Work</div>
            </div>
          </div>
          
          {/* Impact Description */}
          {organization.statistics.conservationImpact && (
            <div className="bg-gradient-to-br from-[#8B4513]/5 to-[#8B4513]/10 rounded-2xl p-6 border border-[#8B4513]/20">
              <p className="text-body text-[#1a2e1a]/90">
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
        className="mt-6"
      >
        <div className="space-y-6">
          {organization.programs.map((program, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-[#F5E8D4]/30 to-[#F8F3E9]/50 rounded-2xl border border-[#F5E8D4]/40">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-card-title font-semibold text-[#2C392C] mb-2">{program.title}</h4>
                  <p className="text-body text-[#2C392C]/80">{program.description}</p>
                </div>
                <div className="lg:text-right">
                  <div className="text-card-title font-bold text-[#8B4513]">
                    {program.cost.amount === 0 ? 'FREE' : `${program.cost.amount} ${program.cost.currency}`}
                  </div>
                  <div className="text-body-small text-[#2C392C]/70">
                    {program.duration.min}-{program.duration.max || '∞'} weeks
                  </div>
                </div>
              </div>
              
              {/* Animal Types */}
              <div className="flex flex-wrap gap-2">
                {program.animalTypes.slice(0, 4).map((animal, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#87A96B]/10 text-[#87A96B] rounded-full text-body-small font-medium">
                    {animal}
                  </span>
                ))}
                {program.animalTypes.length > 4 && (
                  <span className="px-3 py-1 bg-[#2C392C]/10 text-[#2C392C] rounded-full text-body-small font-medium">
                    +{program.animalTypes.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Enhanced Actions & Cross-Tab Navigation - Optimized for desktop */}
      <div className="mt-8">
        <h3 className="text-card-title font-semibold text-deep-forest mb-4">
          {hideDuplicateInfo ? 'Explore More Details' : 'Get Started'}
        </h3>
        <div className={`grid ${hideDuplicateInfo ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          {/* Cost preview - Only show if not in sidebar */}
          {!hideDuplicateInfo && (
            <div className="bg-gradient-to-br from-rich-earth/5 to-warm-sunset/5 rounded-2xl p-4 border border-rich-earth/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-2">Investment</h4>
              <div className="text-2xl font-bold text-rich-earth mb-1">
                {organization.programs[0].cost.amount === 0 ? 'FREE' : `${organization.programs[0].cost.currency} ${organization.programs[0].cost.amount}`}
              </div>
              <div className="text-sm text-deep-forest/70 mb-3">per {organization.programs[0].cost.period}</div>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('practical')}
                  className="text-sm text-rich-earth hover:text-warm-sunset transition-colors"
                >
                  View full cost details →
                </button>
              )}
            </div>
          )}
          
          {/* Enhanced experience preview for desktop */}
          {hideDuplicateInfo && onTabChange && (
            <div className="bg-gradient-to-br from-warm-sunset/5 to-golden-hour/5 rounded-2xl p-4 border border-warm-sunset/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-2">Daily Experience</h4>
              <div className="text-sm text-deep-forest/80 mb-3">
                Work directly with {organization.animalTypes.length} animal types in hands-on conservation
              </div>
              <button
                onClick={() => onTabChange('experience')}
                className="text-sm text-warm-sunset hover:text-golden-hour transition-colors"
              >
                Explore daily activities →
              </button>
            </div>
          )}
          
          {/* Enhanced logistics preview for desktop */}
          {hideDuplicateInfo && onTabChange && (
            <div className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 rounded-2xl p-4 border border-sage-green/20">
              <h4 className="text-lg font-semibold text-deep-forest mb-2">Location & Logistics</h4>
              <div className="text-sm text-deep-forest/80 mb-3">
                {organization.location.city}, {organization.location.country} with {organization.transportation.airportPickup ? 'airport pickup' : 'local transport'}
              </div>
              <button
                onClick={() => onTabChange('location')}
                className="text-sm text-sage-green hover:text-warm-sunset transition-colors"
              >
                View location details →
              </button>
            </div>
          )}
          
          {/* Application preview */}
          <div className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 rounded-2xl p-4 border border-sage-green/20">
            <h4 className="text-lg font-semibold text-deep-forest mb-2">Ready to Apply?</h4>
            <div className="text-sm text-deep-forest/80 mb-3">
              {organization.applicationProcess.processingTime} processing time
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('connect')}
                className="text-sm text-sage-green hover:text-warm-sunset transition-colors"
              >
                Start your application →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;