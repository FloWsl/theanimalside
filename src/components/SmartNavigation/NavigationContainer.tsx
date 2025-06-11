import React from 'react';

interface NavigationContainerProps {
  variant: 'sidebar' | 'inline' | 'footer';
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({
  variant,
  className = '',
  children,
  title = "Continue your discovery",
  description = "Explore similar wildlife opportunities and destinations"
}) => {
  const containerClasses = {
    sidebar: 'space-y-3',
    inline: 'space-y-4',
    footer: 'flex overflow-x-auto gap-4 pb-4'
  };

  const contentClasses = {
    sidebar: 'space-y-2',
    inline: 'flex gap-4 overflow-x-auto pb-2 justify-center',
    footer: 'flex gap-3 overflow-x-auto pb-2'
  };

  if (variant === 'inline') {
    return (
      <div className={`${containerClasses[variant]} ${className}`}>
        <div className="bg-gradient-to-r from-soft-cream to-warm-beige/30 rounded-2xl p-8 mb-6 border border-warm-beige/40 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-deep-forest mb-3">
              {title}
            </h3>
            <p className="text-base text-forest/70 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>
          <div className={contentClasses[variant]}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      <div className={contentClasses[variant]}>
        {children}
      </div>
    </div>
  );
};

export default NavigationContainer;