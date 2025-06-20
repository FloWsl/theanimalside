/**
 * Conservation Section Component
 * 
 * Displays conservation challenge, solution, and impact information
 * for content hub pages. Designed for SEO optimization and gap year
 * student engagement.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Heart, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { ConservationContent } from '../../data/contentHubs';

interface ConservationSectionProps {
  content: ConservationContent;
  className?: string;
}

interface ConservationCardProps {
  title: string;
  content: string;
  icon: React.ElementType;
  iconColor: string;
  delay: number;
}

const ConservationCard: React.FC<ConservationCardProps> = ({
  title,
  content,
  icon: Icon,
  iconColor,
  delay
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="h-full"
  >
    <Card className="h-full bg-soft-cream">
      <CardHeader className="section-padding-xs">
        <div className="flex items-center gap-nature-sm">
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-feature text-deep-forest">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="section-padding-xs pt-0">
        <CardDescription className="text-body text-forest/80 leading-relaxed">
          {content}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

const ConservationSection: React.FC<ConservationSectionProps> = ({
  content,
  className = ''
}) => {
  return (
    <section className={`section-padding-md space-nature-md ${className}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-nature-sm"
      >
        <h2 className="text-section text-deep-forest mb-6">
          Conservation Impact
        </h2>
        <p className="text-body-large text-forest/70">
          Understand the conservation challenges and how your volunteer work creates real, measurable impact
        </p>
      </motion.div>

      {/* Conservation Cards Grid */}
      <div className="grid gap-nature-md lg:grid-cols-3 max-w-6xl mx-auto">
        <ConservationCard
          title="The Challenge"
          content={content.challenge}
          icon={AlertTriangle}
          iconColor="bg-gradient-to-br from-warm-sunset to-rich-earth"
          delay={0.1}
        />
        <ConservationCard
          title="How You Help"
          content={content.solution}
          icon={Heart}
          iconColor="bg-gradient-to-br from-rich-earth to-warm-sunset"
          delay={0.2}
        />
        <ConservationCard
          title="Real Impact"
          content={content.impact}
          icon={TrendingUp}
          iconColor="bg-gradient-to-br from-sage-green to-deep-forest/80"
          delay={0.3}
        />
      </div>

      {/* Source Attribution (for transparency and SEO) */}
      {content.sources && content.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <details className="group">
            <summary className="cursor-pointer text-sm text-forest/60 hover:text-forest/80 transition-colors duration-200 flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Conservation Sources
              <span className="group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="mt-4 space-y-2">
              {content.sources.map((source, index) => (
                <div key={index}>
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sage-green hover:text-rich-earth transition-colors duration-200 underline"
                  >
                    {source}
                  </a>
                </div>
              ))}
            </div>
          </details>
        </motion.div>
      )}

      {/* Last Updated Information */}
      <div className="mt-6 text-center">
        <p className="text-xs text-forest/50">
          Conservation information last updated: {new Date(content.lastReviewed).toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default ConservationSection;