// src/components/OrganizationDetail/tabs/ExperienceTab.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  Camera, 
  Clock, 
  CheckSquare,
  Heart,
  Sunrise,
  Compass,
  Sparkles,
  TreePine,
  Users,
  Shield,
  Sun,
  Waves,
  Crown,
  Mountain
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import ExpandableSection from '../ExpandableSection';
import SharedTabSection from '../SharedTabSection';
import AnimalPhotoGallery from '../AnimalPhotoGallery';

interface ExperienceTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ organization, onTabChange }) => {
  const program = organization.programs[0]; // Get first program for experience details
  const [selectedAnimalStory, setSelectedAnimalStory] = useState(0);
  
  return (
    <div className="space-nature-md">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-nature-sm mt-8">
          <div className="bg-white rounded-2xl section-padding-sm text-center border border-sage-green/20">
            <div className="text-card-title font-bold text-sage-green mb-1">
              {program?.schedule.hoursPerDay || 8}h
            </div>
            <div className="text-caption text-deep-forest/70">Daily activities</div>
          </div>
          <div className="bg-white rounded-2xl section-padding-sm text-center border border-warm-sunset/20">
            <div className="text-card-title font-bold text-warm-sunset mb-1">
              {program?.animalTypes.length || 4}
            </div>
            <div className="text-caption text-deep-forest/70">Animal species</div>
          </div>
          <div className="bg-white rounded-2xl section-padding-sm text-center border border-rich-earth/20">
            <div className="text-card-title font-bold text-rich-earth mb-1">
              {program?.schedule.daysPerWeek || 5}
            </div>
            <div className="text-caption text-deep-forest/70">Days per week</div>
          </div>
        </div>
      </SharedTabSection>

      {/* Essential Wildlife Animals - CORE FEATURE */}
      
      <SharedTabSection
      className="space-y-0 bg-gradient-to-br from-sage-green/5 to-warm-sunset/5 rounded-3xl p-6 sm:p-8 shadow-nature-xl border border-sage-green/10"
        title="Meet the Wildlife"
        variant="section"
        level="important"
        icon={Camera}>          
        <AnimalPhotoGallery animalTypes={organization.animalTypes} />
      </SharedTabSection>
     

      {/* Level 2: Important Experience Details - Expandable */}
      <ExpandableSection
        title="Daily Activities & Schedule"
        level="important"
        icon={Clock}
        preview="Structured daily program with animal care, feeding, habitat maintenance, and educational activities"
        className="mt-8"
      >
        <div className="space-nature-xs">
          {/* Integrated Program Description - Experience Discovery */}
          <div className="space-nature-lg">
            
            {/* A Day That Changes Everything - Immersive Timeline */}
            <div className="bg-gradient-to-br from-soft-cream via-gentle-lemon/10 to-warm-beige rounded-3xl p-8 lg:p-12 shadow-nature-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-sunset/20 to-rich-earth/15 rounded-2xl">
                  <Sunrise className="w-8 h-8 text-rich-earth" />
                </div>
                <div>
                  <h3 className="text-feature text-deep-forest">Your Daily Schedule</h3>
                  <p className="text-body text-forest/70">A realistic look at your volunteer workday</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Daily Schedule from Data */}
                <div className="grid gap-6">
                  {program.typicalDay.slice(0, 3).map((timeSlot, idx) => {
                    const [time, ...activityParts] = timeSlot.split(' - ');
                    const activity = activityParts.join(' - ');
                    
                    return (
                      <div key={idx} className="flex items-start gap-6 bg-white/60 rounded-2xl p-6 border border-warm-beige/80">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-12 bg-gradient-to-r from-sunset/20 to-golden-hour/20 rounded-xl flex items-center justify-center">
                            <span className="text-rich-earth font-bold text-sm">{time}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-deep-forest mb-2">
                            {idx === 0 ? 'Morning Animal Care' : 
                             idx === 1 ? 'Enrichment & Rehabilitation' : 
                             'Medical Support & Documentation'}
                          </h4>
                          <p className="text-forest leading-relaxed">
                            {activity}. Professional conservation training with hands-on experience in wildlife rehabilitation.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          
          <div className="space-y-12 max-w-7xl mx-auto px-4">
            {/* Your Real Impact - What You'll Actually Do */}
            <div className="bg-gradient-to-br from-warm-beige via-soft-cream to-gentle-lemon/20 rounded-3xl p-8 lg:p-12 shadow-nature-xl">
              <div className="text-center space-y-6 mb-10">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-4 bg-gradient-to-br from-rich-earth/20 to-golden-hour/15 rounded-2xl">
                    <Shield className="w-8 h-8 text-rich-earth" />
                  </div>
                </div>
                <h3 className="text-feature text-deep-forest">{program.title}</h3>
                <p className="text-body-large text-forest/80 max-w-3xl mx-auto leading-relaxed">
                  <span className="text-sunset font-semibold">This is practical conservation work.</span> {program.description}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-card-title text-deep-forest flex items-center gap-3">
                    <Zap className="w-6 h-6 text-sage-green" />
                    Your Daily Responsibilities
                  </h4>
                  
                  <div className="space-y-4">
                    {program.activities.slice(0, 6).map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-warm-beige/60">
                        <div className="p-2 bg-sage-green/10 rounded-lg flex-shrink-0">
                          <Crown className="w-5 h-5 text-sage-green" />
                        </div>
                        <div>
                          <h5 className="text-rich-earth font-semibold mb-1">{activity}</h5>
                          <p className="text-forest/80 text-sm leading-relaxed">Hands-on conservation work with direct animal care</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-sunset/10 to-golden-hour/10 rounded-xl p-4 border border-sunset/20">
                    <p className="text-rich-earth font-medium text-sm">
                      <span className="text-sunset">Important:</span> This involves physical outdoor work in tropical conditions. You'll work with animals, maintain facilities, and collaborate with the conservation team.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-card-title text-deep-forest flex items-center gap-3">
                    <Mountain className="w-6 h-6 text-sunset" />
                    Skills You'll Master
                  </h4>
                  
                  <div className="space-y-4">
                    {program.learningOutcomes.slice(0, 6).map((skill, idx) => (
                      <div key={idx} className="p-4 bg-white/70 rounded-xl border border-warm-beige/60">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-sage-green/10 rounded-lg flex-shrink-0">
                            <TreePine className="w-5 h-5 text-sage-green" />
                          </div>
                          <div>
                            <h5 className="text-rich-earth font-semibold mb-1">{skill}</h5>
                            <p className="text-forest/80 text-sm leading-relaxed">Develop professional conservation skills through practical experience</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Adventure Awaits - Your Time Off */}
            <div className="bg-gradient-to-br from-deep-forest via-forest to-sage-green/20 rounded-3xl p-8 lg:p-12 text-white shadow-nature-xl">
              <div className="text-center space-y-6 mb-10">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-4 bg-gradient-to-br from-golden-hour/30 to-sunset/20 rounded-2xl">
                    <Compass className="w-8 h-8 text-gentle-lemon" />
                  </div>
                </div>
                <h3 className="text-feature text-white">Adventure Beyond Work</h3>
                <p className="text-body-large text-white/90 max-w-3xl mx-auto leading-relaxed">
                  <span className="text-golden-hour font-semibold">Balance work with exploration.</span> 
                  With 5 days off per week, explore Costa Rica's incredible biodiversity and culture.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Sun className="w-6 h-6 text-gentle-lemon" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">On-Site Relaxation</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gentle-lemon rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/90">Cool off in our swimming pool surrounded by tropical nature</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gentle-lemon rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/90">Relax in hammocks with new friends from around the world</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Waves className="w-6 h-6 text-sunset" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">Weekly Adventures</h4>
                  </div>
                  <div className="space-y-4">
                    {program.highlights.filter(highlight => 
                      highlight.includes('Beach') || 
                      highlight.includes('National Park') || 
                      highlight.includes('Cloud Forest') || 
                      highlight.includes('Volcano')
                    ).map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-sunset rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/90">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-6 h-6 text-golden-hour" />
                  <h4 className="text-xl font-semibold text-white">Complete Experience Package</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-gentle-lemon font-medium mb-2">What's Included:</h5>
                    <ul className="space-y-1 text-white/90 text-sm">
                      {program.cost.includes.slice(0, 4).map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sunset font-medium mb-2">Work Schedule:</h5>
                    <ul className="space-y-1 text-white/90 text-sm">
                      <li>• Work: {program.schedule.hoursPerDay} hours/day, {program.schedule.daysPerWeek} days/week</li>
                      <li>• Free time: {7 - program.schedule.daysPerWeek} full days for exploration</li>
                      <li>• Start dates: {program.schedule.startDates.join(', ')}</li>
                      <li>• Availability: {program.schedule.seasonality}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-10 space-y-4">
                <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
                  <span className="text-golden-hour font-semibold">Combine meaningful conservation work with cultural exploration.</span> 
                  Learn more about this comprehensive volunteer experience.
                </p>
              </div>
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
        className="mt-8"
      >
        <div className="space-nature-sm">
          {/* Learning Outcomes */}
          <div>
            <h4 className="text-subtitle font-display font-semibold text-deep-forest mb-4">What You'll Learn</h4>
            <div className="grid md:grid-cols-2 gap-nature-xs">
              {program?.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3 section-padding-sm bg-sage-green/5 rounded-xl">
                  <CheckSquare className="w-4 h-4 text-sage-green flex-shrink-0 mt-0.5" />
                  <span className="text-body-small text-deep-forest font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Activities */}
          <div>
            <h4 className="text-subtitle font-display font-semibold text-deep-forest mb-4">Key Activities</h4>
            <div className="grid md:grid-cols-2 gap-nature-xs">
              {program?.activities.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 section-padding-sm bg-warm-sunset/5 rounded-xl">
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
        className="mt-8"
      >
        <div className="space-nature-sm">
          {/* Photo Gallery */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organization.gallery.images.slice(0, 6).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-xl">
                <img 
                  src={image.url} 
                  alt={image.altText}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          {organization.gallery.images.length > 6 && (
            <div className="text-center">
              <p className="text-sm text-deep-forest/70">
                +{organization.gallery.images.length - 6} more photos in full gallery
              </p>
            </div>
          )}
          
          {/* Additional Experience Content */}
          <div className="bg-gradient-to-br from-rich-earth/5 to-warm-sunset/5 rounded-2xl section-padding-sm border border-rich-earth/20">
            <h4 className="text-subtitle font-display font-semibold text-deep-forest mb-3">Experience Highlights</h4>
            <div className="grid md:grid-cols-2 gap-nature-xs">
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
            <div className="bg-gradient-to-br from-sage-green/5 to-gentle-lemon/5 rounded-2xl section-padding-sm border border-sage-green/20">
              <h4 className="text-subtitle font-display font-semibold text-deep-forest mb-3">Volunteer Experience</h4>
              <div className="italic text-deep-forest mb-2">
                "{organization.testimonials[0].quote.slice(0, 200)}{organization.testimonials[0].quote.length > 200 ? '...' : ''}"
              </div>
              <div className="text-body-small text-deep-forest/70">
                — {organization.testimonials[0].volunteerName}, {organization.testimonials[0].volunteerCountry}
              </div>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('stories')}
                  className="mt-3 text-body-small text-sage-green hover:text-warm-sunset transition-colors"
                >
                  Read more volunteer stories →
                </button>
              )}
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* Simple Next Step CTA */}
      <div className="mt-12 text-center">
        <p className="text-body text-deep-forest/70 mb-4">
          Ready to learn about costs, requirements, and logistics?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('practical')}
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