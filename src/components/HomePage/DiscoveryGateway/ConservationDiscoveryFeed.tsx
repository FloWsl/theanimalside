import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Compass, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import OpportunityPortalCard from '@/components/ui/OpportunityPortalCard';
import { OrganizationService } from '@/services/organizationService';
import type { Organization } from '@/types/database';

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

/**
 * Refined Journey Cards - Clean, Functional, Beautiful
 * 
 * Each card is a clear invitation to explore, without overwhelming effects.
 * Focus on content, usability, and genuine emotional connection.
 */

interface ConservationDiscoveryFeedProps {
  className?: string;
  onOrganizationSelect?: (organization: Organization) => void;
}

const ConservationDiscoveryFeed: React.FC<ConservationDiscoveryFeedProps> = ({
  className = '',
  onOrganizationSelect
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [exploredCards, setExploredCards] = useState<Set<string>>(new Set());
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  // Query featured organizations for the discovery feed
  const { data: organizationsResponse, isLoading } = useQuery({
    queryKey: ['homepage-organizations'],
    queryFn: () => OrganizationService.searchOrganizations({ featured_only: true }, { page: 1, limit: 6 }),
    staleTime: 10 * 60 * 1000, // 10 minutes for homepage
  });

  const organizations = organizationsResponse?.data || [];

  // Convert organization to opportunity-like format for the card component
  const organizationsAsOpportunities = organizations.map(org => ({
    id: org.id,
    title: org.name,
    organization: org.name,
    description: org.tagline || org.mission || 'Join us in wildlife conservation',
    location: {
      country: org.country,
      city: org.city || '',
      region: org.region || ''
    },
    images: [org.hero_image || '/images/default-wildlife.jpg'],
    animalTypes: ['Wildlife'],
    duration: { min: 2, max: 12 },
    cost: { amount: null, currency: 'USD', period: 'total' },
    featured: org.featured || false,
    datePosted: org.created_at || new Date().toISOString(),
    slug: org.slug,
    tags: []
  }));

  const handleCardExplore = (opportunity: any) => {
    // Find the original organization
    const organization = organizations.find(org => org.id === opportunity.id);
    if (organization) {
      setExploredCards(prev => new Set([...prev, organization.id]));
      onOrganizationSelect?.(organization);
    }
  };

  // Optimized container animation - respects reduced motion
  const containerVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  } : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.1 to 0.05
        delayChildren: 0.1 // Reduced from 0.2 to 0.1
      }
    }
  };

  // Simplified header animation - respects reduced motion
  const headerVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  } : {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // Reduced from 0.8
        delay: custom * 0.1, // Reduced multiplier
        ease: "easeOut" // Simplified easing
      }
    })
  };

  if (isLoading || !organizations || organizations.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-warm-beige to-gentle-lemon rounded-full flex items-center justify-center">
          <Compass className="w-10 h-10 text-rich-earth" />
        </div>
        <p className="text-forest/60">{isLoading ? 'Discovering conservation opportunities...' : 'New worlds are being discovered...'}</p>
      </div>
    );
  }

  return (
    <section 
      ref={ref} 
      className={`py-12 sm:py-20 relative overflow-hidden bg-gradient-to-br from-soft-cream via-warm-beige/10 to-gentle-lemon/5 transform-gpu ${className}`}
      aria-labelledby="conservation-feed-heading"
      aria-describedby="conservation-feed-description"
      role="region"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Clean, progressive header revelation */}
        <motion.div 
          className="text-center mb-16 sm:mb-20"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Simple decorative element */}
          <motion.div 
            variants={headerVariants}
            custom={0}
            className="flex items-center justify-center mb-8"
          >
            <div className="w-16 h-px bg-rich-earth/30" />
            <Star className="w-5 h-5 text-warm-sunset mx-6" />
            <div className="w-16 h-px bg-rich-earth/30" />
          </motion.div>

          {/* Main headline with staggered reveal */}
          <motion.h2 
            id="conservation-feed-heading"
            variants={headerVariants}
            custom={1}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-deep-forest mb-6 leading-tight"
          >
            Worlds beyond
            <span className="block font-medium bg-gradient-to-r from-rich-earth to-warm-sunset bg-clip-text text-transparent">
              imagination
            </span>
          </motion.h2>

          {/* Subtitle with delayed reveal */}
          <motion.p 
            id="conservation-feed-description"
            variants={headerVariants}
            custom={2}
            className="text-lg sm:text-xl text-forest/70 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Each portal pulses with life waiting to be touched. 
            <br className="hidden sm:block"/>
            <span className="text-rich-earth font-medium">
              Where will your heart's compass point?
            </span>
          </motion.p>

          {/* Feature indicators with final reveal */}
          <motion.div
            variants={headerVariants}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-forest/60"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage-green rounded-full" />
              <span>Living Experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rich-earth rounded-full" />
              <span>Breathing Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warm-sunset rounded-full" />
              <span>Infinite Possibilities</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Card grid with modular components */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
          role="grid"
          aria-label="Conservation volunteer opportunities"
        >
          {organizationsAsOpportunities.map((opportunity, index) => (
            <OpportunityPortalCard
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
              isActive={activeCard === opportunity.id}
              isExplored={exploredCards.has(opportunity.id)}
              onHover={setActiveCard}
              onExplore={handleCardExplore}
            />
          ))}
        </motion.div>

        {/* Clean call-to-action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          role="complementary"
          aria-labelledby="cta-heading"
        >
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-12 h-px bg-rich-earth/30" />
            <Compass className="w-6 h-6 text-warm-sunset mx-6" />
            <div className="w-12 h-px bg-rich-earth/30" />
          </div>

          <h3 
            id="cta-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-deep-forest mb-8 leading-tight"
          >
            Every journey begins with
            <span className="block font-medium bg-gradient-to-r from-sage-green via-rich-earth to-warm-sunset bg-clip-text text-transparent">
              a moment of wonder
            </span>
          </h3>

          <Button 
            size="lg"
            variant="default"
            className="px-10 py-5 rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-500 group mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-rich-earth focus:ring-offset-2"
            asChild
          >
            <Link 
              to="/opportunities"
              aria-describedby="cta-description"
            >
              <Compass className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
              Explore All Opportunities
              <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              <span className="sr-only">Explore all conservation volunteer opportunities</span>
            </Link>
          </Button>

          <p 
            id="cta-description"
            className="text-base sm:text-lg text-forest/70 max-w-lg mx-auto leading-relaxed"
          >
            Take your time. Browse thoughtfully. Listen to your heart. 
            <br className="hidden sm:block"/>
            <span className="text-rich-earth font-medium">
              The right opportunity will call to you.
            </span>
          </p>

          <div 
            className="mt-8 text-sm text-forest/50"
            aria-live="polite"
            aria-label={`${exploredCards.size} opportunities have been explored`}
          >
            🌟 <span aria-hidden="true">{exploredCards.size} kindred spirits have felt the same wonder</span> 🌟
            <span className="sr-only">{exploredCards.size} conservation opportunities have been viewed by other users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConservationDiscoveryFeed;