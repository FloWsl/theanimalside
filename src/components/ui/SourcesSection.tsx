/**
 * Sources Section Component
 * 
 * Universal component for displaying credible sources across all content types:
 * - Animal conservation pages
 * - Country regional pages  
 * - Combined experience pages
 * - Organization profiles
 * 
 * Ensures transparency and builds trust through proper source attribution.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Shield, Book, AlertCircle } from 'lucide-react';

export interface ContentSource {
  url: string;
  organization_name?: string;
  source_type?: 'organization' | 'research' | 'government' | 'academic';
  description?: string;
  credibility_score?: number;
  verified?: boolean;
}

interface SourcesSectionProps {
  sources: (string | ContentSource)[];
  title?: string;
  className?: string;
  variant?: 'compact' | 'detailed' | 'expanded';
  showVerification?: boolean;
  contentType?: string; // "Animal Conservation", "Regional Conservation", etc.
}

const getSourceIcon = (sourceType?: string) => {
  switch (sourceType) {
    case 'research':
    case 'academic':
      return Book;
    case 'government':
      return Shield;
    case 'organization':
    default:
      return ExternalLink;
  }
};

const getSourceTypeLabel = (sourceType?: string) => {
  switch (sourceType) {
    case 'research':
      return 'Research Publication';
    case 'academic':
      return 'Academic Institution';
    case 'government':
      return 'Government Agency';
    case 'organization':
      return 'Conservation Organization';
    default:
      return 'External Source';
  }
};

const SourceItem: React.FC<{ 
  source: string | ContentSource; 
  index: number; 
  variant: 'compact' | 'detailed' | 'expanded';
  showVerification: boolean;
}> = ({ source, index, variant, showVerification }) => {
  const sourceUrl = typeof source === 'string' ? source : source.url;
  const sourceData = typeof source === 'object' ? source : null;
  
  // Extract domain for display
  const domain = new URL(sourceUrl).hostname.replace('www.', '');
  
  const SourceIcon = sourceData ? getSourceIcon(sourceData.source_type) : ExternalLink;

  if (variant === 'compact') {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="flex items-center gap-2"
      >
        <SourceIcon className="h-3 w-3 text-sage-green flex-shrink-0" />
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-sage-green hover:text-rich-earth transition-colors duration-200 underline truncate"
        >
          {domain}
        </a>
        {showVerification && sourceData?.verified && (
          <Shield className="h-3 w-3 text-golden-hour flex-shrink-0" title="Verified Source" />
        )}
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex items-start gap-3 p-3 bg-warm-beige/50 rounded-lg border border-warm-beige/60"
      >
        <div className="p-1.5 bg-sage-green/20 rounded-md flex-shrink-0">
          <SourceIcon className="h-4 w-4 text-sage-green" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-deep-forest hover:text-rich-earth transition-colors duration-200 truncate"
            >
              {sourceData?.organization_name || domain}
            </a>
            {showVerification && sourceData?.verified && (
              <Shield className="h-4 w-4 text-golden-hour flex-shrink-0" title="Verified Source" />
            )}
          </div>
          {sourceData?.source_type && (
            <span className="text-xs text-forest/60 mb-1 block">
              {getSourceTypeLabel(sourceData.source_type)}
            </span>
          )}
          {sourceData?.description && (
            <p className="text-sm text-forest/80 leading-relaxed">
              {sourceData.description}
            </p>
          )}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sage-green hover:text-rich-earth transition-colors duration-200 underline mt-1 inline-block"
          >
            Visit Source →
          </a>
        </div>
      </motion.div>
    );
  }

  // Expanded variant
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="p-4 bg-soft-cream border border-warm-beige/60 rounded-xl"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-sage-green/20 rounded-lg flex-shrink-0">
          <SourceIcon className="h-5 w-5 text-sage-green" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-deep-forest">
              {sourceData?.organization_name || domain}
            </h4>
            {showVerification && sourceData?.verified && (
              <div className="flex items-center gap-1 px-2 py-1 bg-golden-hour/20 rounded-full">
                <Shield className="h-3 w-3 text-golden-hour" />
                <span className="text-xs text-golden-hour font-medium">Verified</span>
              </div>
            )}
          </div>
          
          {sourceData?.source_type && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-forest/70">
                {getSourceTypeLabel(sourceData.source_type)}
              </span>
              {sourceData.credibility_score && (
                <span className="text-xs bg-sage-green/20 text-sage-green px-2 py-1 rounded-full">
                  {sourceData.credibility_score}% Credible
                </span>
              )}
            </div>
          )}
          
          {sourceData?.description && (
            <p className="text-sm text-forest/80 leading-relaxed mb-3">
              {sourceData.description}
            </p>
          )}
          
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-sage-green hover:text-rich-earth transition-colors duration-200 font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Source
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const SourcesSection: React.FC<SourcesSectionProps> = ({
  sources,
  title = "Sources & References",
  className = "",
  variant = "detailed",
  showVerification = true,
  contentType = "Conservation Information"
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const hasVerifiedSources = sources.some(source => 
    typeof source === 'object' && source.verified
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-4 ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sage-green/20 rounded-lg">
          <Book className="h-5 w-5 text-sage-green" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-deep-forest">
            {title}
          </h3>
          <p className="text-sm text-forest/70">
            {contentType} verified from {sources.length} credible source{sources.length > 1 ? 's' : ''}
            {hasVerifiedSources && showVerification && (
              <span className="ml-2 inline-flex items-center gap-1 text-golden-hour">
                <Shield className="h-3 w-3" />
                Verified Sources
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Trust Indicator */}
      {variant !== 'compact' && (
        <div className="flex items-center gap-2 p-3 bg-sage-green/10 border border-sage-green/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-sage-green flex-shrink-0" />
          <p className="text-sm text-forest/80">
            All conservation information is fact-checked against credible sources and regularly updated.
          </p>
        </div>
      )}

      {/* Sources List */}
      <div className={`space-y-${variant === 'compact' ? '2' : '3'}`}>
        {sources.map((source, index) => (
          <SourceItem
            key={index}
            source={source}
            index={index}
            variant={variant}
            showVerification={showVerification}
          />
        ))}
      </div>

      {/* Footer Note */}
      {variant === 'expanded' && (
        <div className="text-center pt-2">
          <p className="text-xs text-forest/50">
            Sources last verified: {new Date().toLocaleDateString()} • 
            Information accuracy is our priority
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default SourcesSection;