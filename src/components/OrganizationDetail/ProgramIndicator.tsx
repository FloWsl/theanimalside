import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { generateProgramsUrl, isPrimaryProgram } from '../../utils/programUtils';
import type { OrganizationDetail, Program } from '../../types';

interface ProgramIndicatorProps {
  organization: OrganizationDetail;
  currentProgram: Program;
  showBackLink?: boolean;
}

const ProgramIndicator: React.FC<ProgramIndicatorProps> = ({
  organization,
  currentProgram,
  showBackLink = true
}) => {
  if (organization.programs.length <= 1) {
    return null; // Don't show for single-program organizations
  }

  return (
    <div className="bg-gradient-to-r from-rich-earth/10 to-golden-hour/10 border border-rich-earth/20 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-deep-forest">
              {currentProgram.title}
            </h2>
            {isPrimaryProgram(currentProgram) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-golden-hour/20 text-golden-hour text-xs font-medium rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Programme Principal
              </div>
            )}
          </div>
          
          <p className="text-forest/70 text-sm mb-3 leading-relaxed">
            {currentProgram.description}
          </p>

          {/* Quick program info */}
          <div className="flex flex-wrap gap-4 text-xs text-forest/60">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{currentProgram.duration.min}-{currentProgram.duration.max || '∞'} semaines</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{currentProgram.schedule.hoursPerDay}h/jour</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{currentProgram.schedule.daysPerWeek} jours/semaine</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        {showBackLink && (
          <div className="flex-shrink-0">
            <Link
              to={generateProgramsUrl(organization.slug)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-rich-earth hover:text-deep-earth border border-rich-earth/30 hover:border-rich-earth/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Tous les programmes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramIndicator;