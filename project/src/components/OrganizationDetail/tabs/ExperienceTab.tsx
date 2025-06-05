// src/components/OrganizationDetail/tabs/ExperienceTab.tsx
import React from 'react';
import { Zap, Camera, Clock, CheckSquare } from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import ProgramDescription from '../ProgramDescription';
import PhotoGallery from '../PhotoGallery';
import QuickInfoCards from '../QuickInfoCards';
import AnimalPhotoGallery from '../AnimalPhotoGallery';

interface ExperienceTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ organization, onTabChange }) => {
  const program = organization.programs[0]; // Get first program for experience details
  
  return (
    <div className="space-y-6">
      {/* Level 1: Essential Experience Overview - Always Visible */}
      <div className="bg-gradient-to-br from-sage-green/5 via-gentle-lemon/5 to-warm-sunset/5 rounded-3xl p-6 lg:p-8 shadow-nature-xl border border-sage-green/10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sage-green/20 to-warm-sunset/15 rounded-2xl">
              <Zap className="w-6 h-6 text-sage-green" />
            </div>
          </div>
          <h2 className="text-feature text-deep-forest">Your Wildlife Experience</h2>
          <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
            Join our conservation mission working directly with rescued wildlife. Gain hands-on experience in animal care, 
            habitat maintenance, and conservation education while making a real difference.
          </p>
        </div>
        
        {/* Quick Experience Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-sage-green/20">
            <div className="text-card-title font-bold text-sage-green mb-1">
              {program?.schedule.hoursPerDay || 8}h
            </div>
            <div className="text-caption text-deep-forest/70">Daily activities</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-warm-sunset/20">
            <div className="text-card-title font-bold text-warm-sunset mb-1">
              {program?.animalTypes.length || 4}
            </div>
            <div className="text-caption text-deep-forest/70">Animal species</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-rich-earth/20">
            <div className="text-card-title font-bold text-rich-earth mb-1">
              {program?.schedule.daysPerWeek || 5}
            </div>
            <div className="text-caption text-deep-forest/70">Days per week</div>
          </div>
        </div>
      </div>


      {/* Essential Wildlife Animals - CORE FEATURE */}
    <div className="mt-8">
      <AnimalPhotoGallery animalTypes={organization.animalTypes} />
    </div>


      {/* Level 2: Important Experience Details - Expandable */}
      <ExpandableSection
        title="Daily Activities & Schedule"
        level="important"
        icon={Clock}
        preview="Structured daily program with animal care, feeding, habitat maintenance, and educational activities"
        className="mt-6"
      >
        <div className="space-y-4">
          {/* Reusing existing ProgramDescription component */}
          <ProgramDescription organization={organization} />
          
          {/* Cost Context within Experience */}
          <div className="bg-rich-earth/5 rounded-2xl p-4 border border-rich-earth/20">
            <h5 className="text-lg font-semibold text-deep-forest mb-2">Investment for This Experience</h5>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-rich-earth">
                  {program.cost.amount === 0 ? 'FREE' : `${program.cost.currency} ${program.cost.amount}`}
                </div>
                <div className="text-sm text-deep-forest/70">per {program.cost.period}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-deep-forest/80">
                  Includes: {program.cost.includes.slice(0, 2).join(', ').toLowerCase()}
                </div>
                {onTabChange && (
                  <button
                    onClick={() => onTabChange('practical')}
                    className="text-sm text-rich-earth hover:text-warm-sunset transition-colors mt-1"
                  >
                    View full cost breakdown →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Skills & Learning Outcomes"
        level="important"
        icon={CheckSquare}
        preview={`Develop practical conservation skills including ${program?.learningOutcomes.slice(0, 2).join(', ').toLowerCase()} and more`}
        className="mt-6"
      >
        <div className="space-y-6">
          {/* Learning Outcomes */}
          <div>
            <h4 className="text-card-title font-semibold text-deep-forest mb-4">What You'll Learn</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {program?.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-sage-green/5 rounded-xl">
                  <CheckSquare className="w-4 h-4 text-sage-green flex-shrink-0 mt-0.5" />
                  <span className="text-body-small text-deep-forest font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Activities */}
          <div>
            <h4 className="text-card-title font-semibold text-deep-forest mb-4">Key Activities</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {program?.activities.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-warm-sunset/5 rounded-xl">
                  <div className="w-2 h-2 bg-warm-sunset rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-body-small text-deep-forest">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Level 3: Comprehensive Visual Content - Detailed Expandable */}
      <ExpandableSection
        title="Photo Gallery & Stories"
        level="comprehensive"
        icon={Camera}
        preview={`${organization.gallery.images.length} photos and ${organization.gallery.videos.length} videos showcasing real volunteer experiences and wildlife interactions`}
        className="mt-6"
      >
        <div className="space-y-6">
          {/* Photo Gallery - Reusing existing component */}
          <PhotoGallery 
            gallery={organization.gallery} 
            organizationName={organization.name} 
          />
          
          {/* Additional Experience Content */}
          <div className="bg-gradient-to-br from-rich-earth/5 to-warm-sunset/5 rounded-2xl p-6 border border-rich-earth/20">
            <h4 className="text-card-title font-semibold text-deep-forest mb-3">Experience Highlights</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {program?.highlights.slice(0, 6).map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-body-small text-deep-forest">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonial Preview */}
          {organization.testimonials.length > 0 && (
            <div className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 rounded-2xl p-6 border border-sage-green/20">
              <h4 className="text-card-title font-semibold text-deep-forest mb-3">Volunteer Experience</h4>
              <div className="italic text-deep-forest mb-2">
                "{organization.testimonials[0].quote.slice(0, 200)}{organization.testimonials[0].quote.length > 200 ? '...' : ''}"
              </div>
              <div className="text-sm text-deep-forest/70">
                — {organization.testimonials[0].volunteerName}, {organization.testimonials[0].volunteerCountry}
              </div>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('stories')}
                  className="mt-3 text-sm text-sage-green hover:text-warm-sunset transition-colors"
                >
                  Read more volunteer stories →
                </button>
              )}
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* Contextual Information & Quick Actions */}
      <div className="mt-8">
        <h3 className="text-card-title font-semibold text-deep-forest mb-4">Essential Info & Next Steps</h3>
        <QuickInfoCards 
          organization={organization} 
          selectedProgram={program}
          currentTab="experience"
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};

export default ExperienceTab;