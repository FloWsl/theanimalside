import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Clock, Users, Calendar } from 'lucide-react';
import { OrganizationService } from '../../services/organizationService';
import type { Organization } from '../../types/database';

interface OtherProgramsSectionProps {
  organization: Organization;
  currentProgramId?: string;
}

const OtherProgramsSection: React.FC<OtherProgramsSectionProps> = ({
  organization,
  currentProgramId
}) => {
  // Query all programs for the organization
  const { data: experienceData } = useQuery({
    queryKey: ['organization-experience', organization.id],
    queryFn: () => OrganizationService.getExperience(organization.id),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Filter out the current program and check if there are other programs
  const otherPrograms = experienceData?.programs?.filter(
    program => program.id !== currentProgramId
  ) || [];

  // Don't render if there are no other programs
  if (otherPrograms.length === 0) {
    return null;
  }

  const generateProgramUrl = (program: any) => {
    // Generate a slug if the program doesn't have one
    const programSlug = program.slug || program.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/organization/${organization.slug}/program/${programSlug}`;
  };

  return (
    <div className="bg-soft-cream/80 border border-warm-beige/60 rounded-2xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-section text-deep-forest">
            Discover Other Programs
          </h3>
          <p className="text-body text-forest/70 max-w-2xl mx-auto">
            {organization.name} offers {otherPrograms.length + 1} different volunteer programs. 
            Explore their other opportunities to find the perfect match for your conservation goals.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherPrograms.slice(0, 3).map((program) => (
            <a
              key={program.id}
              href={generateProgramUrl(program)}
              className="group block p-4 bg-white rounded-xl border border-warm-beige/40 hover:border-rich-earth/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Program Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-forest group-hover:text-rich-earth transition-colors">
                      {program.title}
                    </h4>
                    <p className="text-sm text-forest/60 mt-1 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-forest/40 group-hover:text-rich-earth group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                {/* Program Quick Info */}
                <div className="flex flex-wrap gap-3 text-xs text-forest/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{program.duration_min_weeks}-{program.duration_max_weeks || '∞'} weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{program.hours_per_day}h/day</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{program.days_per_week} days/week</span>
                  </div>
                </div>

                {/* Cost Display */}
                <div className="pt-2 border-t border-warm-beige/50">
                  <div className="text-sm font-medium text-forest">
                    {program.cost_amount === 0 || program.cost_amount === null 
                      ? 'Free Program' 
                      : `${program.cost_amount} ${program.cost_currency}/${program.cost_period}`
                    }
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* See All Programs Link (if more than 3) */}
        {otherPrograms.length > 3 && (
          <div className="text-center pt-4 border-t border-warm-beige/30">
            <a
              href={`/organization/${organization.slug}/programs`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              View All {otherPrograms.length + 1} Programs
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherProgramsSection;