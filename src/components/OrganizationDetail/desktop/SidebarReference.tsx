// src/components/OrganizationDetail/desktop/SidebarReference.tsx
import React from 'react';
import { ArrowRight, Info, DollarSign, Clock, Users, MapPin } from 'lucide-react';

interface SidebarReferenceProps {
  section: 'cost' | 'duration' | 'requirements' | 'location' | 'general';
  children: React.ReactNode;
  className?: string;
  variant?: 'info' | 'hint' | 'highlight';
}

const SidebarReference: React.FC<SidebarReferenceProps> = ({ 
  section, 
  children, 
  className = '',
  variant = 'info'
}) => {
  const getIcon = () => {
    switch (section) {
      case 'cost':
        return <DollarSign className="w-4 h-4" />;
      case 'duration':
        return <Clock className="w-4 h-4" />;
      case 'requirements':
        return <Users className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hint':
        return 'bg-sage-green/5 border-sage-green/20 text-sage-green';
      case 'highlight':
        return 'bg-warm-sunset/5 border-warm-sunset/20 text-warm-sunset';
      default:
        return 'bg-rich-earth/5 border-rich-earth/20 text-rich-earth';
    }
  };

  return (
    <div className={`hidden lg:block p-4 rounded-xl border ${getVariantStyles()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">
            {children}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
            <span>See sidebar for details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarReference;