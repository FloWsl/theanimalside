import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, Users, Calendar } from 'lucide-react';
import { OrganizationService } from '../../services/organizationService';

const ProgramListPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Query organization data
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => OrganizationService.getOrganizationBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // Query all programs
  const { data: experienceData, isLoading: programsLoading } = useQuery({
    queryKey: ['organization-experience', organization?.id],
    queryFn: () => OrganizationService.getExperience(organization!.id),
    enabled: !!organization?.id,
    staleTime: 10 * 60 * 1000,
  });

  const programs = experienceData?.programs || [];
  const isLoading = orgLoading || programsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest/70 text-sm">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-section text-forest">Organization Not Found</h1>
          <p className="text-body text-forest/70">The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const generateProgramUrl = (program: any) => {
    const programSlug = program.slug || program.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/organization/${organization.slug}/program/${programSlug}`;
  };

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <div className="bg-deep-forest text-white py-12">
        <div className="container-nature-wide">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-hero text-white mb-4">
              All Programs at {organization.name}
            </h1>
            <p className="text-body-large text-white/90 max-w-2xl mx-auto">
              Explore all {programs.length} volunteer programs offered by this organization. 
              Each program has its own unique focus and experience.
            </p>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container-nature-wide section-padding">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <Link
                key={program.id}
                to={generateProgramUrl(program)}
                className="group block bg-white rounded-2xl p-6 border border-warm-beige/40 hover:border-rich-earth/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Program Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-forest group-hover:text-rich-earth transition-colors">
                        {program.title}
                      </h3>
                      {program.is_primary && (
                        <span className="inline-block mt-2 px-3 py-1 bg-sage-green/20 text-sage-green text-sm font-medium rounded-full">
                          Primary Program
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-forest/40 group-hover:text-rich-earth group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  {/* Description */}
                  <p className="text-forest/70 text-sm leading-relaxed line-clamp-3">
                    {program.description}
                  </p>

                  {/* Program Details */}
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

                  {/* Cost */}
                  <div className="pt-3 border-t border-warm-beige/30">
                    <div className="text-lg font-semibold text-forest">
                      {program.cost_amount === 0 || program.cost_amount === null 
                        ? 'Free Program' 
                        : `${program.cost_amount} ${program.cost_currency}/${program.cost_period}`
                      }
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back to Organization */}
          <div className="mt-12 text-center">
            <Link
              to={`/organization/${organization.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              ← Back to {organization.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListPage;