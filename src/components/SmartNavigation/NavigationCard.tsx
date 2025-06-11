import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NavigationRecommendation } from '../../hooks/useSmartNavigation';

interface NavigationCardProps {
  recommendation: NavigationRecommendation;
  variant: 'sidebar' | 'inline' | 'footer';
  onClick: (recommendation: NavigationRecommendation) => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  recommendation,
  variant,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(recommendation);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(recommendation);
    }
  };

  const baseClasses = "no-underline bg-white border border-warm-beige/30 hover:border-sage-green/50 transition-all duration-300 cursor-pointer group shadow-sm";
  
  const variantClasses = {
    sidebar: "rounded-lg hover:shadow-md p-3 w-full",
    inline: "flex-shrink-0 rounded-xl hover:shadow-lg p-4 min-w-[130px] max-w-[150px] hover:shadow-sage-green/10",
    footer: "flex-shrink-0 rounded-xl hover:shadow-lg p-4 min-w-[130px] max-w-[150px] hover:shadow-sage-green/10"
  };

  return (
    <a
      href={recommendation.url}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${recommendation.title} opportunities`}
      rel={recommendation.isExternal ? "noopener noreferrer" : undefined}
      target={recommendation.isExternal ? "_blank" : undefined}
    >
      {variant === 'sidebar' ? (
        <div className="flex items-center space-x-3">
          <div className="text-xl filter drop-shadow-sm">
            {recommendation.metadata?.emoji || '🌍'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors leading-tight">
              {recommendation.title}
            </div>
          </div>
          <div className="w-5 h-5 rounded-full bg-sage-green/10 flex items-center justify-center group-hover:bg-sage-green/20 transition-colors">
            <ChevronRight className="w-3 h-3 text-sage-green" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-3xl filter drop-shadow-sm">
            {recommendation.metadata?.emoji || '🌍'}
          </div>
          <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors leading-tight">
            {recommendation.title}
          </div>
          <div className="w-6 h-6 rounded-full bg-sage-green/10 flex items-center justify-center group-hover:bg-sage-green/20 transition-colors">
            <ChevronRight className="w-3 h-3 text-sage-green" />
          </div>
        </div>
      )}
    </a>
  );
};

export default NavigationCard;