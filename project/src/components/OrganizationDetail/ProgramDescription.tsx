// src/components/OrganizationDetail/ProgramDescription.tsx - Experience Discovery Transformation
import React, { useState } from 'react';
import { 
  Heart, 
  Sunrise, 
  Compass, 
  Sparkles, 
  TreePine,
  Users,
  Shield,
  Zap,
  Sun,
  Waves,
  Camera,
  Crown,
  Mountain
} from 'lucide-react';
import { OrganizationDetail } from '../../types';

interface ProgramDescriptionProps {
  organization: OrganizationDetail;
}

const ProgramDescription: React.FC<ProgramDescriptionProps> = ({ organization }) => {
  const [selectedAnimalStory, setSelectedAnimalStory] = useState(0);
  const program = organization.programs[0]; // Focus on main program for storytelling
  
  return (
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
  );
};

export default ProgramDescription;
