/**
 * Container.tsx - Reusable Container Component with Nature-Inspired Grid System
 * 
 * Provides consistent layout containers with the award-winning grid architecture
 * that supports block-structured layouts from reference screenshots.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'wide' | 'narrow' | 'full';
  padding?: 'none' | 'sm' | 'default' | 'lg' | 'xl';
  as?: keyof JSX.IntrinsicElements;
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'auto' | '2' | '3' | '4' | '12' | 'featured' | 'organic-1' | 'organic-2' | 'organic-3' | 'organic-golden';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  as?: keyof JSX.IntrinsicElements;
}

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'hero-split' | 'content-sidebar' | 'three-column' | 'opportunities';
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Container Component - Responsive container with nature-inspired spacing
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'default',
  as: Component = 'div',
}) => {
  const containerVariants = {
    default: 'container-nature',
    wide: 'container-nature-wide',
    narrow: 'container-nature-narrow',
    full: 'container-nature-full',
  };

  const paddingVariants = {
    none: '',
    sm: 'section-padding-sm',
    default: 'section-padding',
    lg: 'section-padding-lg',
    xl: 'section-padding-xl',
  };

  return (
    <Component
      className={cn(
        containerVariants[variant],
        paddingVariants[padding],
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Grid Component - Flexible grid system with nature-inspired layouts
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  variant = 'auto',
  gap = 'md',
  as: Component = 'div',
}) => {
  const gridVariants = {
    auto: 'grid-nature-auto',
    '2': 'grid-nature-2',
    '3': 'grid-nature-3',
    '4': 'grid-nature-4',
    '12': 'grid-nature',
    featured: 'grid-featured',
    'organic-1': 'grid-organic-1',
    'organic-2': 'grid-organic-2',
    'organic-3': 'grid-organic-3',
    'organic-golden': 'grid-organic-golden',
  };

  const gapVariants = {
    xs: 'gap-nature-xs',
    sm: 'gap-nature-sm',
    md: 'gap-nature-md',
    lg: 'gap-nature-lg',
    xl: 'gap-nature-xl',
    '2xl': 'gap-nature-2xl',
  };

  return (
    <Component
      className={cn(
        gridVariants[variant],
        gapVariants[gap],
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Layout Component - Predefined layout patterns for common use cases
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  variant = 'hero-split',
  as: Component = 'div',
}) => {
  const layoutVariants = {
    'hero-split': 'layout-hero-split',
    'content-sidebar': 'layout-content-sidebar',
    'three-column': 'layout-three-column',
    'opportunities': 'layout-opportunities',
  };

  return (
    <Component
      className={cn(
        layoutVariants[variant],
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Spacing Component - Nature-inspired vertical spacing
 */
interface SpacingProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'vertical' | 'horizontal';
}

export const Spacing: React.FC<SpacingProps> = ({
  children,
  className,
  size = 'md',
  direction = 'vertical',
}) => {
  const spacingVariants = {
    vertical: {
      xs: 'space-nature-xs',
      sm: 'space-nature-sm',
      md: 'space-nature-md',
      lg: 'space-nature-lg',
      xl: 'space-nature-xl',
      '2xl': 'space-nature-2xl',
    },
    horizontal: {
      xs: 'space-x-nature-xs',
      sm: 'space-x-nature-sm',
      md: 'space-x-nature-md',
      lg: 'space-x-nature-lg',
      xl: 'space-x-nature-xl',
      '2xl': 'space-x-nature-2xl',
    },
  };

  return (
    <div
      className={cn(
        spacingVariants[direction][size],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * GridItem Component - For positioning items in 12-column grid
 */
interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  area?: 'featured' | 'card1' | 'card2' | 'card3' | 'card4';
  as?: keyof JSX.IntrinsicElements;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
  area,
  as: Component = 'div',
}) => {
  const spanClass = span ? `col-span-${span}` : '';
  const areaClass = area ? `opportunity-${area}` : '';

  return (
    <Component
      className={cn(
        spanClass,
        areaClass,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Export default Container for backwards compatibility
export default Container;
