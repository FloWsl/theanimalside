import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Users, Calendar, Star } from 'lucide-react';
import { generateProgramUrl, generateProgramsUrl, isPrimaryProgram } from '../../utils/programUtils';
import type { OrganizationDetail, Program } from '../../types';

interface OtherProgramsSectionProps {
  organization: OrganizationDetail;
  currentProgram?: Program;
  maxPrograms?: number;
}

const OtherProgramsSection: React.FC<OtherProgramsSectionProps> = ({
  organization,
  currentProgram,
  maxPrograms = 3
}) => {
  // Filter out current program to show other programs
  const otherPrograms = organization.programs?.filter(
    program => program.id !== currentProgram?.id
  ) || [];

  // Don't render if there are no other programs
  if (otherPrograms.length === 0) {
    return null;
  }

  const displayPrograms = otherPrograms.slice(0, maxPrograms);
  const hasMorePrograms = otherPrograms.length > maxPrograms;

  return (
    <div className="bg-soft-cream/80 border border-warm-beige/60 rounded-2xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-section text-deep-forest">
            Autres Programmes Disponibles
          </h3>
          <p className="text-body text-forest/70 max-w-2xl mx-auto">
            {organization.name} propose {organization.programs.length} programmes de volontariat différents. 
            Découvrez leurs autres opportunités pour trouver l'expérience parfaite.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayPrograms.map((program) => (
            <Link
              key={program.id}
              to={generateProgramUrl(organization.slug, program.title)}
              className="group block p-4 bg-white rounded-xl border border-warm-beige/40 hover:border-rich-earth/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Program Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg text-forest group-hover:text-rich-earth transition-colors">
                        {program.title}
                      </h4>
                      {isPrimaryProgram(program) && (
                        <Star className="w-4 h-4 text-golden-hour fill-current" />
                      )}
                    </div>
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
                    <span>{program.duration.min}-{program.duration.max || '∞'} semaines</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{program.schedule.hoursPerDay}h/jour</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{program.schedule.daysPerWeek} jours/sem</span>
                  </div>
                </div>

                {/* Cost Display */}
                <div className="pt-2 border-t border-warm-beige/50">
                  <div className="text-sm font-medium text-forest">
                    {program.cost.amount === 0 
                      ? 'Programme Gratuit' 
                      : `${program.cost.amount} ${program.cost.currency}/${program.cost.period}`
                    }
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See All Programs Link */}
        <div className="text-center pt-4 border-t border-warm-beige/30">
          {hasMorePrograms ? (
            <Link
              to={generateProgramsUrl(organization.slug)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              Voir les {organization.programs.length} Programmes
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to={generateProgramsUrl(organization.slug)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              Comparer Tous les Programmes
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherProgramsSection;