// src/components/OrganizationDetail/SharedTabSection.examples.tsx
// Example usage patterns for SharedTabSection component

import React from 'react';
import { Heart, MapPin, DollarSign } from 'lucide-react';
import SharedTabSection, { 
  HeroSection, 
  SectionCard, 
  SubsectionCard,
  EssentialSection,
  ImportantSection,
  ComprehensiveSection 
} from './SharedTabSection';

// Example usage patterns for developers
export const SharedTabSectionExamples: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section Example */}
      <HeroSection
        title="Your Wildlife Experience"
        icon={Heart}
        level="essential"
        hideBackground={true}
      >
        <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
          Join our conservation mission working directly with rescued wildlife.
        </p>
      </HeroSection>

      {/* Standard Section Example */}
      <SectionCard
        title="Cost & What's Included"
        icon={DollarSign}
        level="important"
      >
        <div className="space-y-4">
          <p>Detailed cost breakdown and comprehensive list of included services.</p>
        </div>
      </SectionCard>

      {/* Subsection Example */}
      <SubsectionCard
        title="Location Details"
        icon={MapPin}
        level="comprehensive"
      >
        <p>Specific location information and logistics.</p>
      </SubsectionCard>

      {/* Direct variant usage */}
      <SharedTabSection
        title="Custom Section"
        variant="section"
        level="essential"
        className="custom-styling"
      >
        <p>Custom section with specific requirements.</p>
      </SharedTabSection>
    </div>
  );
};

// Usage Guidelines (for documentation)
export const UsageGuidelines = {
  variants: {
    hero: 'Use for main tab headers and primary content sections',
    section: 'Use for standard section headers throughout tabs',
    subsection: 'Use for smaller content divisions within sections'
  },
  levels: {
    essential: 'Critical information (rich-earth colors) - always visible',
    important: 'Secondary information (sage-green colors) - high priority',
    comprehensive: 'Detailed information (warm-sunset colors) - expandable content'
  },
  accessibility: {
    ids: 'Automatically generated from title, or pass custom id prop',
    headings: 'Proper semantic heading hierarchy (h1 for hero, h2 for section, h3 for subsection)',
    aria: 'Includes role="region" and aria-labelledby for screen readers'
  }
};

export default SharedTabSectionExamples;
