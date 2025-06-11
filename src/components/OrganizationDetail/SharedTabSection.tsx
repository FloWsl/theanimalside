// src/components/OrganizationDetail/SharedTabSection.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface SharedTabSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'hero' | 'section' | 'subsection';
  level?: 'essential' | 'important' | 'comprehensive';
  className?: string;
  hideBackground?: boolean;
}

const SharedTabSection: React.FC<SharedTabSectionProps> = ({
  title,
  icon: Icon,
  children,
  variant = 'section',
  level = 'essential',
  className,
  hideBackground = false
}) => {
  // Variant-specific styling with standardized design tokens
  const variantStyles = {
    hero: {
      containerClass: 'bg-gradient-to-br from-soft-cream via-gentle-lemon/10 to-warm-beige rounded-3xl shadow-nature-xl border border-sage-green/10',
      titleClass: 'text-hero',
      contentClass: 'text-center',
      padding: 'section-padding-lg'
    },
    section: {
      containerClass: 'card-nature shadow-nature',
      titleClass: 'text-section',
      contentClass: 'text-left',
      padding: 'section-padding-md'
    },
    subsection: {
      containerClass: 'bg-gradient-to-br from-warm-beige/20 to-soft-cream/30 rounded-xl border border-warm-beige/40',
      titleClass: 'text-feature',
      contentClass: 'text-left',
      padding: 'section-padding-sm'
    }
  };

  // Level-specific color styling with design tokens
  const levelStyles = {
    essential: 'border-rich-earth/20',
    important: 'border-sage-green/20', 
    comprehensive: 'border-warm-sunset/20'
  };

  const styles = variantStyles[variant];

  if (variant === 'hero') {
    return (
      <div className={cn(
        styles.containerClass, 
        levelStyles[level], 
        styles.padding, 
        'container-nature-narrow space-nature-lg', 
        className
      )}>
        <div className={cn('max-w-4xl mx-auto', styles.contentClass)}>
          {Icon && (
            <div className="flex items-center justify-center gap-nature-sm mb-6">
              <div className="p-4 bg-gradient-to-br from-sage-green/20 to-rich-earth/15 rounded-2xl">
                <Icon className="w-8 h-8 text-sage-green" />
              </div>
            </div>
          )}
          <h2 className={styles.titleClass}>{title}</h2>
          <div className="mt-6 space-nature-md">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (hideBackground) {
    return (
      <div className={cn('space-nature-lg', className)}>
        <div className="flex items-center gap-nature-sm mb-6">
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-sage-green/20 to-rich-earth/15 rounded-xl">
              <Icon className="w-6 h-6 text-sage-green" />
            </div>
          )}
          <h3 className={styles.titleClass}>{title}</h3>
        </div>
        <div className={cn(styles.contentClass, 'space-nature-sm')}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(styles.containerClass, levelStyles[level], 'space-nature-lg', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-nature-sm">
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-sage-green/20 to-rich-earth/15 rounded-xl">
              <Icon className="w-6 h-6 text-sage-green" />
            </div>
          )}
          <CardTitle className={styles.titleClass}>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={cn(styles.contentClass, 'space-nature-sm')}>
        {children}
      </CardContent>
    </Card>
  );
};

export default SharedTabSection;