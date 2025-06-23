/**
 * Related Content Section Component
 * 
 * Displays related content hubs for internal linking and discovery.
 * Improves SEO through strategic internal linking and enhances
 * user experience by suggesting relevant content.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { ContentHubData } from '../../data/contentHubs';
import { generateInternalLinks } from '../../utils/contentSEO';

interface RelatedContentSectionProps {
  currentHub: ContentHubData;
  allHubs: ContentHubData[];
  className?: string;
}

interface RelatedContentCardProps {
  title: string;
  url: string;
  description: string;
  type: 'animal' | 'country' | 'related';
  delay: number;
}

const RelatedContentCard: React.FC<RelatedContentCardProps> = ({
  title,
  url,
  description,
  type,
  delay
}) => {
  const getIcon = () => {
    switch (type) {
      case 'animal':
        return <Leaf className="h-5 w-5 text-sage-green" />;
      case 'country':
        return <MapPin className="h-5 w-5 text-warm-sunset" />;
      default:
        return <ArrowRight className="h-5 w-5 text-rich-earth" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'animal':
        return 'Animal Conservation';
      case 'country':
        return 'Regional Programs';
      default:
        return 'Related Content';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      <Link 
        to={url}
        className="block h-full group"
      >
        <Card className="h-full bg-warm-beige/80 backdrop-blur-sm border border-warm-beige/60 hover:bg-warm-beige/90 hover:shadow-lg hover:border-sage-green/30 transition-all duration-300">
          <CardHeader className="section-padding-xs">
            <div className="flex items-start justify-between mb-2">
              {getIcon()}
              <span className="text-xs text-forest/60 uppercase tracking-wide font-medium">
                {getTypeLabel()}
              </span>
            </div>
            <CardTitle className="text-subtitle font-semibold text-deep-forest group-hover:text-rich-earth transition-colors duration-200 line-clamp-2">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="section-padding-xs pt-0">
            <CardDescription className="text-sm text-forest/70 leading-relaxed line-clamp-3 mb-4">
              {description}
            </CardDescription>
            <div className="flex items-center text-sm text-sage-green group-hover:text-rich-earth transition-colors duration-200">
              <span className="font-medium">Explore programs</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const RelatedContentSection: React.FC<RelatedContentSectionProps> = ({
  currentHub,
  allHubs,
  className = ''
}) => {
  // Generate internal links
  const relatedLinks = React.useMemo(() => {
    return generateInternalLinks(currentHub, allHubs);
  }, [currentHub, allHubs]);

  // Don't render if no related content
  if (relatedLinks.length === 0) {
    return null;
  }

  // Separate links by type for better organization
  const animalLinks = relatedLinks.filter(link => link.type === 'animal');
  const countryLinks = relatedLinks.filter(link => link.type === 'country');
  const otherLinks = relatedLinks.filter(link => link.type === 'related');

  return (
    <section className={`section-padding-md space-nature-lg ${className}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-nature-sm"
      >
        <h2 className="text-section text-deep-forest">
          Explore More Conservation Opportunities
        </h2>
        <p className="text-body-large text-forest/70">
          Discover related {currentHub.type === 'animal' ? 'regional programs' : 'animal conservation'} and expand your conservation impact
        </p>
      </motion.div>

      {/* Related Content Grid */}
      <div className="max-w-6xl mx-auto">
        {/* Animal Conservation Links */}
        {animalLinks.length > 0 && (
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-subtitle font-semibold text-deep-forest mb-6 flex items-center"
            >
              <Leaf className="h-5 w-5 text-sage-green mr-3" />
              Animal Conservation Programs
            </motion.h3>
            <div className="grid gap-nature-md md:grid-cols-2 lg:grid-cols-3">
              {animalLinks.map((link, index) => (
                <RelatedContentCard
                  key={link.url}
                  title={link.title}
                  url={link.url}
                  description={link.description}
                  type={link.type}
                  delay={0.2 + index * 0.1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regional Programs Links */}
        {countryLinks.length > 0 && (
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-subtitle font-semibold text-deep-forest mb-6 flex items-center"
            >
              <MapPin className="h-5 w-5 text-warm-sunset mr-3" />
              Regional Conservation Programs
            </motion.h3>
            <div className="grid gap-nature-md md:grid-cols-2 lg:grid-cols-3">
              {countryLinks.map((link, index) => (
                <RelatedContentCard
                  key={link.url}
                  title={link.title}
                  url={link.url}
                  description={link.description}
                  type={link.type}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Related Links */}
        {otherLinks.length > 0 && (
          <div>
            <div className="grid gap-nature-md md:grid-cols-2">
              {otherLinks.map((link, index) => (
                <RelatedContentCard
                  key={link.url}
                  title={link.title}
                  url={link.url}
                  description={link.description}
                  type={link.type}
                  delay={0.6 + index * 0.1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedContentSection;