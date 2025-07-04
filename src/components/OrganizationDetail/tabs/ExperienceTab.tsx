// src/components/OrganizationDetail/tabs/ExperienceTab.tsx
import React from 'react';
import { 
  Zap, 
  Camera, 
  Clock, 
  CheckSquare,
  Heart
} from 'lucide-react';
import { useOrganizationExperience } from '../../../hooks/useOrganizationData';
import SharedTabSection from '../SharedTabSection';
import AnimalPhotoGallery from '../AnimalPhotoGallery';
import { scrollToTabContent } from '../../../lib/scrollUtils';

interface ExperienceTabProps {
  organizationId: string;
  onTabChange?: (tabId: string) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ organizationId, onTabChange }) => {
  // Fetch experience data using React Query
  const { data: experienceData, isLoading, error } = useOrganizationExperience(organizationId);
  
  const programs = experienceData?.programs || [];
  const primaryProgram = programs.find(p => p.is_primary) || programs[0];
  const animalTypes = experienceData?.animal_types || [];
  const scheduleItems = experienceData?.schedule_items || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-forest/60">Loading experience details...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600">Error loading experience details. Please try again.</div>
        </div>
      </div>
    );
  }

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
              {primaryProgram?.hours_per_day || 6}h
            </div>
            <div className="text-caption text-deep-forest/70">Daily activities</div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-warm-sunset/20">
            <div className="text-card-title font-bold text-warm-sunset mb-1">
              {animalTypes.length || 5}
            </div>
            <div className="text-caption text-deep-forest/70">Animal species</div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-rich-earth/20">
            <div className="text-card-title font-bold text-rich-earth mb-1">
              {primaryProgram?.days_per_week || 5}
            </div>
            <div className="text-caption text-deep-forest/70">Days per week</div>
          </div>
        </div>
      </SharedTabSection>

      {/* Essential Wildlife Animals - CORE FEATURE */}
      <div className="bg-gradient-to-br from-sage-green/5 to-warm-sunset/5 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-nature-xl border border-sage-green/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sage-green/20 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-sage-green" />
            </div>
            <h3 className="text-section text-deep-forest">Meet the Wildlife</h3>
          </div>
        </div>
        <AnimalPhotoGallery organizationId={organizationId} />
      </div>
     

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
          
          {/* Daily Timeline - From Database */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {(scheduleItems.length > 0 ? scheduleItems : [
              { time_slot: '06:00', activity_description: 'Early morning wildlife observation and behavior documentation' },
              { time_slot: '07:30', activity_description: 'Breakfast and daily briefing with research team' }, 
              { time_slot: '09:00', activity_description: 'Field research activities: GPS tracking and data collection' },
              { time_slot: '12:00', activity_description: 'Lunch break and rest period' },
              { time_slot: '13:00', activity_description: 'Conservation work: habitat restoration or community education' },
              { time_slot: '16:00', activity_description: 'Data entry and research documentation' },
              { time_slot: '17:00', activity_description: 'Evening wildlife patrol with KWS rangers' }
            ]).map((scheduleItem, idx) => {
              return (
                <div key={idx} className="flex items-center gap-4 bg-white/80 rounded-xl p-4 border border-warm-beige/60">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-8 bg-rich-earth/10 rounded-lg flex items-center justify-center">
                      <span className="text-rich-earth font-semibold text-xs">{scheduleItem.time_slot}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-forest font-medium">{scheduleItem.activity_description}</span>
                  </div>
                </div>
              );
            })}
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
            
            {/* What You'll Accomplish */}
            <div className="space-y-3">
              <h4 className="font-semibold text-forest text-base flex items-center gap-2">
                <div className="w-6 h-6 bg-sage-green/20 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-3 h-3 text-sage-green" />
                </div>
                What You'll Accomplish
              </h4>
              <div className="space-y-3">
                <div className="text-body text-forest/80">• Care for 15+ rescued animals daily</div>
                <div className="text-body text-forest/80">• Help prepare animals for release to wild</div>
                <div className="text-body text-forest/80">• Support critical medical treatments</div>
                <div className="text-body text-forest/80">• Educate visitors about conservation</div>
                <div className="text-body text-forest/80">• Maintain safe, clean habitats</div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="space-y-3">
              <h4 className="font-semibold text-forest text-base flex items-center gap-2">
                <div className="w-6 h-6 bg-rich-earth/20 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-3 h-3 text-rich-earth" />
                </div>
                What You'll Learn
              </h4>
              <div className="space-y-3">
                <div className="text-body text-forest/80">• Wildlife nutrition and feeding protocols</div>
                <div className="text-body text-forest/80">• Animal behavior and health assessment</div>
                <div className="text-body text-forest/80">• Conservation education techniques</div>
                <div className="text-body text-forest/80">• Habitat maintenance and construction</div>
                <div className="text-body text-forest/80">• Emergency wildlife response</div>
              </div>
            </div>
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