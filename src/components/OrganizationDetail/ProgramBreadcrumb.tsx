import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Building2 } from 'lucide-react';
import { generateProgramsUrl } from '../../utils/programUtils';
import type { OrganizationDetail, Program } from '../../types';

interface ProgramBreadcrumbProps {
  organization: OrganizationDetail;
  currentProgram?: Program;
  isSpecificProgramPage?: boolean;
  className?: string;
}

const ProgramBreadcrumb: React.FC<ProgramBreadcrumbProps> = ({
  organization,
  currentProgram,
  isSpecificProgramPage = false,
  className = ''
}) => {
  const breadcrumbItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: Home
    },
    {
      label: 'Organisations',
      href: '/opportunities',
      icon: Building2
    },
    {
      label: organization.name,
      href: `/organization/${organization.slug}`,
      icon: null
    }
  ];

  // Add program-specific breadcrumbs
  if (organization.programs.length > 1) {
    breadcrumbItems.push({
      label: 'Programmes',
      href: generateProgramsUrl(organization.slug),
      icon: null
    });
  }

  if (isSpecificProgramPage && currentProgram) {
    breadcrumbItems.push({
      label: currentProgram.title,
      href: '',
      icon: null
    });
  }

  return (
    <nav 
      aria-label="Fil d'Ariane" 
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-forest/40" />
            )}
            
            {isLast ? (
              <span className="text-forest font-medium flex items-center gap-1">
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-forest/70 hover:text-rich-earth transition-colors flex items-center gap-1"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default ProgramBreadcrumb;