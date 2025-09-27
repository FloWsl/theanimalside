// src/components/OrganizationDetail/tabs/ExperienceTab.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  Camera, 
  Clock, 
  CheckSquare,
  Heart
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import SharedTabSection from '../SharedTabSection';
import AnimalPhotoGallery from '../AnimalPhotoGallery';
import { scrollToTabContent } from '../../../lib/scrollUtils';
import { useOrganizationExperience, useTabDataState } from '../../../hooks/useOrganizationTabData';

interface ExperienceTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ organization, onTabChange }) => {
  // Fetch real database data using proper service method
  const experienceQuery = useOrganizationExperience(organization.slug);
  const { data: experienceData, isLoading, error } = useTabDataState(experienceQuery, 'Experience');

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
          <p className="text-forest/60 mb-4">Unable to load experience information</p>
          <button 
            onClick={() => experienceQuery.refetch()}
            className="px-4 py-2 bg-rich-earth text-white rounded hover:bg-deep-earth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get the primary program from experience data with fallback to organization data
  const primaryProgram = experienceData?.programs?.find(p => p.is_primary) || 
                         experienceData?.programs?.[0] || 
                         organization.programs?.[0];

  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      {/* Level 1: Essential Experience Overview - Always Visible */}
      <SharedTabSection
        title="Your Wildlife Experience"
        variant="hero"
        level="essential"
        icon={Zap}
      >
        <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
          Join our conservation mission working directly with rescued wildlife. Gain hands-on experience in animal care, 
          habitat maintenance, and conservation education while making a real difference.
        </p>
        
        {/* Quick Experience Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-sage-green/20">
            <div className="text-card-title font-bold text-sage-green mb-1">
              {primaryProgram?.hours_per_day || primaryProgram?.schedule?.hoursPerDay || 8}h
            </div>
            <div className="text-caption text-deep-forest/70">Daily activities</div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-warm-sunset/20">
            <div className="text-card-title font-bold text-warm-sunset mb-1">
              {experienceData?.animal_types?.length || organization.animalTypes?.length || 4}
            </div>
            <div className="text-caption text-deep-forest/70">Animal species</div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-rich-earth/20">
            <div className="text-card-title font-bold text-rich-earth mb-1">
              {primaryProgram?.days_per_week || primaryProgram?.schedule?.daysPerWeek || 5}
            </div>
            <div className="text-caption text-deep-forest/70">Days per week</div>
          </div>
        </div>
      </SharedTabSection>

      {/* Essential Wildlife Animals - Show if we have database or organization animal data */}
      {((experienceData?.animal_types && experienceData.animal_types.length > 0 && 
         experienceData.animal_types[0]?.animal_type && experienceData.animal_types[0].animal_type !== 'Wildlife') ||
        (organization.animalTypes && organization.animalTypes.length > 0)) ? (
        <div className="bg-gradient-to-br from-sage-green/5 to-warm-sunset/5 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-nature-xl border border-sage-green/10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sage-green/20 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-sage-green" />
              </div>
              <h3 className="text-section text-deep-forest">Meet the Wildlife</h3>
            </div>
          </div>
          <AnimalPhotoGallery animalTypes={
            (experienceData?.animal_types?.length > 0 
              ? experienceData.animal_types?.map(at => ({
                  animalType: at?.animal_type || 'Unknown',
                  species: at?.animal_species?.map(s => s.species_name) || [],
                  description: at?.description || 'Description not available',
                  conservationStatus: at?.conservation_status || 'Status unknown',
                  careActivities: at?.animal_care_activities?.map(aca => aca.activity_description) || [],
                  currentAnimals: at?.current_count || 0,
                  successStories: at?.animal_success_stories?.map(ass => ass.story_description) || [],
                  image: at?.featured_image || '/placeholder-animal.jpg'
                }))
              : organization.animalTypes) || []
          } />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-sage-green/5 to-warm-sunset/5 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-nature-xl border border-sage-green/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sage-green/20 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-sage-green" />
              </div>
              <h3 className="text-section text-deep-forest">Meet the Wildlife</h3>
            </div>
            <p className="text-forest/60 italic">
              Specific animal types not provided by organization.
              <br />
              Contact them directly to learn about the wildlife you'll work with.
            </p>
          </div>
        </div>
      )}
     

      {/* Your Daily Schedule - Visual Timeline */}
      <SharedTabSection
        title="Your Daily Schedule"
        variant="section"
        level="important"
        icon={Clock}
        className="mt-8"
      >
        <div className="bg-gradient-to-br from-soft-cream via-gentle-lemon/10 to-warm-beige rounded-2xl p-4 sm:p-6 lg:p-8 shadow-nature border border-warm-beige/60">
          <div className="text-center mb-6">
            <h3 className="text-section text-deep-forest mb-3">A Realistic Look at Your Workday</h3>
            <p className="text-body text-forest/80 max-w-2xl mx-auto">
              See exactly what you'll be doing from morning to evening, based on our actual volunteer schedule.
            </p>
          </div>
          
          {/* Daily Timeline - Simplified */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {(experienceData?.schedule_items && experienceData.schedule_items.length > 0 && experienceData.schedule_items[0]?.time_slot) || 
             (primaryProgram?.schedule?.dailyActivities && primaryProgram.schedule.dailyActivities.length > 0) ? (
              // Use database schedule items if available, otherwise use organization program schedule
              (experienceData?.schedule_items?.length > 0 && experienceData.schedule_items[0]?.time_slot ? experienceData.schedule_items : primaryProgram?.schedule?.dailyActivities || []).map((scheduleItem, idx) => {
                return (
                  <div key={idx} className="flex items-center gap-6 bg-white/80 rounded-xl p-4 border border-warm-beige/60">
                    <div className="flex-shrink-0">
                      <div className="w-28 h-10 bg-rich-earth/10 rounded-lg flex items-center justify-center px-2">
                        <span className="text-rich-earth font-medium text-xs whitespace-nowrap">{scheduleItem.time_slot || scheduleItem.time || scheduleItem.timeRange || '9:00 AM'}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-forest font-medium">{scheduleItem.activity_description || scheduleItem.activity || scheduleItem.description || 'Conservation activity'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-forest/60 italic">
                  Daily schedule details not provided by organization.
                  <br />
                  Contact them directly for specific schedule information.
                </p>
              </div>
            )}
          </div>
        </div>
      </SharedTabSection>

      {/* Your Daily Impact - Persona-Focused */}
      <SharedTabSection
        title="Your Daily Impact"
        variant="section"
        level="important"
        icon={Heart}
        className="mt-8"
      >
        <div className="bg-gradient-to-br from-soft-cream via-gentle-lemon/10 to-warm-beige rounded-2xl p-4 sm:p-6 lg:p-8 shadow-nature border border-warm-beige/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* What You'll Accomplish - Using program activities from database */}
            {(experienceData?.program_activities && experienceData.program_activities.length > 0) && (
              <div className="space-y-3">
                <h4 className="font-semibold text-forest text-base flex items-center gap-2">
                  <div className="w-6 h-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-3 h-3 text-sage-green" />
                  </div>
                  What You'll Accomplish
                </h4>
                <div className="space-y-3">
                  {experienceData.program_activities.slice(0, 6).map((activity, index) => (
                    <div key={index} className="text-body text-forest/80">• {activity.activity_name}</div>
                  ))}
                  {experienceData.program_activities.length > 6 && (
                    <div className="text-sm text-forest/60 italic">
                      + {experienceData.program_activities.length - 6} more activities
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What You'll Learn - Using program learning outcomes from database */}
            {(primaryProgram?.program_learning_outcomes && primaryProgram.program_learning_outcomes.length > 0) && (
              <div className="space-y-3">
                <h4 className="font-semibold text-forest text-base flex items-center gap-2">
                  <div className="w-6 h-6 bg-rich-earth/20 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-3 h-3 text-rich-earth" />
                  </div>
                  What You'll Learn
                </h4>
                <div className="space-y-3">
                  {primaryProgram.program_learning_outcomes.map((outcome, index) => (
                    <div key={index} className="text-body text-forest/80">• {outcome.outcome_description}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Message when no accomplishments or learning outcomes provided */}
            {(!experienceData?.program_activities || experienceData.program_activities.length === 0) && 
             (!primaryProgram?.program_learning_outcomes || primaryProgram.program_learning_outcomes.length === 0) && (
              <div className="col-span-full text-center py-8">
                <p className="text-forest/60 italic">
                  Detailed accomplishments and learning outcomes not provided by organization.
                  <br />
                  Contact them directly for specific program details.
                </p>
              </div>
            )}
          </div>
        </div>
      </SharedTabSection>

      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center">
        <p className="text-body text-deep-forest/70 mb-4">
          Ready to learn about costs, requirements, and logistics?
        </p>
        {onTabChange && (
          <button
            onClick={() => {
              onTabChange('practical');
              scrollToTabContent();
            }}
            className="inline-flex items-center gap-2 bg-warm-sunset hover:bg-warm-sunset/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Check Practical Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ExperienceTab;