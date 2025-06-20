import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { Container } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import { Card, CardContent } from './ui/card';
import ConservationSection from './ContentHub/ConservationSection';
import CulturalContextSection from './ContentHub/CulturalContextSection';
import RegionalWildlifeSection from './ContentHub/RegionalWildlifeSection';
import ContentHubSEO from './ContentHub/ContentHubSEO';
import OpportunityCard from './OpportunitiesPage/v2/OpportunityCard';
import SEOInternalLinks from './CountryLandingPage/SEOInternalLinks';
import { generateCountryPageSEO, useSEO } from '../utils/seoUtils';
import { useCountryData } from '../hooks/useCountryData';

const CountryLandingPage: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();

  // Utility function to scroll to top on navigation
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract country from URL path
  const countrySlug = React.useMemo(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/volunteer-')) {
      const extracted = pathname.replace('/volunteer-', '');
      return extracted;
    }
    return '';
  }, []);

  // Use centralized country data hook
  const {
    countryName,
    opportunities: countryOpportunities,
    contentHub,
    availableAnimals,
    isLoading: dataLoading,
    error: dataError
  } = useCountryData(countrySlug);


  // SEO & Performance Optimization
  const seoMetadata = React.useMemo(() => {
    const metadata = generateCountryPageSEO(countrySlug || '', countryOpportunities);

    const enhancedStructuredData = {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      "name": `${countryName} Wildlife Volunteer Programs`,
      "description": `Discover ${countryOpportunities.length} conservation programs in ${countryName}. Join hands-on wildlife protection efforts.`,
      "url": `https://theanimalside.com/volunteer-${countrySlug}`,
      "image": countryOpportunities[0]?.images?.[0] || "https://images.unsplash.com/photo-1502780402662-acc01917cf4b",
      "geo": {
        "@type": "Country",
        "name": countryName
      },
      "touristType": "Wildlife Conservation Volunteers",
      "availableLanguage": "en",
      "offers": countryOpportunities.map(opp => ({
        "@type": "Offer",
        "name": opp.title,
        "description": opp.description,
        "price": opp.cost.amount,
        "priceCurrency": opp.cost.currency,
        "availability": "InStock",
        "category": "Wildlife Conservation Volunteer Program"
      })),
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${countryName} Wildlife Programs`,
        "numberOfItems": countryOpportunities.length
      }
    };

    return {
      ...metadata,
      structuredData: enhancedStructuredData
    };
  }, [countrySlug, countryOpportunities, countryName]);

  useSEO(seoMetadata);

  // Performance optimization: Preload critical images
  React.useEffect(() => {
    if (countryOpportunities.length > 0) {
      const preloadImages = countryOpportunities.slice(0, 3).map(opp => {
        if (opp.images?.[0]) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = opp.images[0];
          link.as = 'image';
          document.head.appendChild(link);
          return link;
        }
        return null;
      }).filter(Boolean);

      return () => {
        preloadImages.forEach(link => {
          if (link && document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [countryOpportunities]);

  // Handle data loading and errors
  if (dataLoading) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="section-padding-lg text-center">
          <div className="w-8 h-8 border-2 border-sage-green border-t-transparent radius-nature-full animate-spin mx-auto mb-4"></div>
          <p className="text-body-small text-forest/70">Loading conservation programs...</p>
        </div>
      </Container>
    );
  }

  if (dataError) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="section-padding-lg text-center">
          <h1 className="text-hero text-deep-forest mb-4">Unable to Load Data</h1>
          <p className="text-body text-forest/80 mb-8">
            We're having trouble loading conservation programs. Please try again later.
          </p>
          <Link
            to="/opportunities"
            onClick={handleNavigation}
            className="btn-nature-primary"
          >
            Browse All Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Container>
    );
  }

  if (!countrySlug || countryOpportunities.length === 0) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="section-padding-lg text-center">
          <h1 className="text-hero text-deep-forest mb-4">Country Not Found</h1>
          <p className="text-body text-forest/80 mb-8">
            We don't have any volunteer opportunities in this location yet.
          </p>
          <Link
            to="/opportunities"
            onClick={handleNavigation}
            className="btn-nature-primary"
          >
            Browse All Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Container>
    );
  }

  // Get country flag emoji
  const getCountryFlag = (countryName: string): string => {
    const flags: { [key: string]: string } = {
      'Costa Rica': '🇨🇷',
      'Thailand': '🇹🇭',
      'South Africa': '🇿🇦',
      'Australia': '🇦🇺',
      'Kenya': '🇰🇪',
      'Indonesia': '🇮🇩',
      'Brazil': '🇧🇷',
      'Ecuador': '🇪🇨',
      'Peru': '🇵🇪',
      'Tanzania': '🇹🇿',
      'India': '🇮🇳'
    };
    return flags[countryName] || '🌍';
  };

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Enhanced SEO & Structured Data */}
      {seoMetadata.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoMetadata.structuredData)
          }}
        />
      )}
      {contentHub && (
        <ContentHubSEO
          hubData={contentHub}
          opportunities={countryOpportunities}
        />
      )}

      {/* Breadcrumb Navigation - Top of page */}
      <div className="bg-soft-cream/80 backdrop-blur-sm border-b border-warm-beige/30">
        <Container className="py-3">
          <Breadcrumb items={breadcrumbs} />
        </Container>
      </div>

      {/* HERO SECTION - Photo-First Discovery */}
      <div className="relative min-h-[85vh] flex items-center">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url(${countryOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1502780402662-acc01917cf4b?w=1920&h=1080&fit=crop'})`
          }}
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-forest/90 via-deep-forest/80 to-rich-earth/70" />

        {/* Conservation Discovery Badge */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="glass-nature-hero text-sage-green radius-nature-full text-caption font-medium section-padding-xs shadow-lg hover:bg-white/20 transition-all duration-300"
          >
            🌿 Conservation Discovery Hub
          </motion.div>
        </div>

        <Container className="relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Emotional Connection Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                className="text-8xl mb-6"
              >
                {getCountryFlag(countryName)}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-hero text-white mb-6"
              >
                Explore Wildlife Conservation in {countryName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-body-large text-white/95 mb-8 max-w-4xl mx-auto"
              >
                Discover {countryName}'s remarkable conservation ecosystem, from marine turtle protection to rainforest preservation.
                <span className="text-golden-hour font-semibold">Perfect for gap year students, career-breakers, and conservation enthusiasts (18+) seeking hands-on wildlife experience—no prior experience required.</span>
              </motion.p>
            </div>

            {/* Real Data Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid-nature-3 gap-nature-sm mb-12"
            >
              <div className="glass-nature-hero text-center border-nature-dark hover:bg-white/20 transition-all duration-300 group">
                <div className="text-card-title text-golden-hour mb-1 group-hover:scale-105 transition-transform">{availableAnimals.length}</div>
                <div className="text-white/90 text-caption font-medium">Conservation Focus Areas</div>
                <div className="text-white/70 text-caption-small mt-1">Species & ecosystems</div>
              </div>

              <div className="glass-nature-hero text-center border-nature-dark hover:bg-white/20 transition-all duration-300 group">
                <div className="text-card-title text-golden-hour mb-1 group-hover:scale-105 transition-transform">{[...new Set(countryOpportunities.map(opp => opp.location.city))].length}</div>
                <div className="text-white/90 text-caption font-medium">Conservation Regions</div>
                <div className="text-white/70 text-caption-small mt-1">From coast to mountains</div>
              </div>

              <div className="glass-nature-hero text-center border-nature-dark hover:bg-white/20 transition-all duration-300 group">
                <div className="text-card-title text-golden-hour mb-1 group-hover:scale-105 transition-transform">{countryOpportunities.length}</div>
                <div className="text-white/90 text-caption font-medium">Active Programs</div>
                <div className="text-white/70 text-caption-small mt-1">Research & protection</div>
              </div>
            </motion.div>

            {/* Discovery Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('conservation-areas')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group glass-nature-hero text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔍 Explore Conservation Areas
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => document.getElementById('wildlife-programs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group glass-nature-hero text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  📋 View All Programs
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-white/80 text-caption mt-4">
                Discover the diverse world of conservation in {countryName}
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      <Container className="section-padding-lg">
        {/* CONSERVATION AREAS - Consolidated Animal Focus Areas */}
        <section id="conservation-areas" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block glass-nature-light text-sage-green rounded-full text-caption font-medium mb-4 border-nature-glass">
              🌿 Conservation Ecosystem
            </span>

            <h2 className="text-section text-deep-forest mb-6">
              {countryName}'s Conservation Focus Areas
            </h2>

            <p className="text-body-large text-forest/80 max-w-4xl mx-auto mb-12">
              From pristine coastlines to misty cloud forests, {countryName} hosts diverse conservation efforts across multiple ecosystems.
              Work in coastal turtle beaches, tropical rainforests, wildlife rehabilitation centers, and community conservation areas—explore the different focus areas where wildlife protection happens.
            </p>
          </motion.div>

          {/* Conservation Focus Areas Grid - Real Data */}
          <div className="grid-nature-3 gap-nature-lg mb-16">
            {availableAnimals.map((animal, index) => {
              const animalOpportunities = countryOpportunities.filter(opp =>
                opp.animalTypes.some(type =>
                  type.toLowerCase().includes(animal.name.toLowerCase().split(' ')[0])
                )
              );

              return (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.7, type: "spring" }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link
                    to={`/volunteer-${countrySlug}/${animal.id}`}
                    onClick={handleNavigation}
                  >
                    <Card className="h-full group cursor-pointer glass-nature-light hover:bg-soft-cream/95 border-nature-glass">
                      {/* Conservation Area Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${animal.image})` }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Real Program Count */}
                        <div className="absolute top-4 right-4">
                          <span className="glass-nature-dark text-white px-3 py-1 rounded-full text-caption-small font-medium shadow-lg">
                            {animalOpportunities.length} Programs
                          </span>
                        </div>

                        {/* Species Info with Glassmorphism */}
                        <div className="absolute bottom-0 left-0 right-0 glass-nature-dark section-padding-xs text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">
                              {animal.name === 'Lions' ? '🦁' :
                                animal.name === 'Elephants' ? '🐘' :
                                  animal.name === 'Sea Turtles' ? '🐢' :
                                    animal.name === 'Orangutans' ? '🦧' :
                                      animal.name === 'Koalas' ? '🐨' : '🐾'}
                            </span>
                            <h3 className="text-feature text-white font-bold">{animal.name} Conservation</h3>
                          </div>
                          <p className="text-white/90 text-caption">
                            {animal.name === 'Sea Turtles' ? 'Marine & coastal protection' :
                              animal.name === 'Orangutans' ? 'Rainforest & primate research' :
                                animal.name === 'Elephants' ? 'Wildlife sanctuary & habitat protection' :
                                  `${animal.name.toLowerCase()} monitoring & protection`}
                          </p>
                        </div>
                      </div>

                      {/* Exploration Content */}
                      <CardContent className="section-padding-sm">
                        <p className="text-body text-forest/80 mb-4">
                          {animal.name === 'Sea Turtles' && countrySlug === 'costa-rica' ?
                            'Explore beach patrol programs, nesting site monitoring, and marine research initiatives along both Pacific and Caribbean coastlines.' :
                            animal.name === 'Orangutans' ?
                              'Discover primate behavior studies, forest conservation projects, and rehabilitation programs in primary rainforest locations.' :
                              animal.name === 'Elephants' ?
                                'Join ethical elephant sanctuary programs focused on rescued elephant care, habitat restoration, and anti-poaching efforts.' :
                                `Learn about ${animal.name.toLowerCase()} research, habitat protection, and conservation strategies across ${countryName}'s diverse regions.`}
                        </p>

                        {/* Real Location Data */}
                        {animalOpportunities.length > 0 && (
                          <div className="space-nature-xs mb-4">
                            <div className="flex items-center justify-between text-caption">
                              <span className="text-caption text-forest/60">Available Locations:</span>
                              <span className="text-caption font-medium text-rich-earth">
                                {[...new Set(animalOpportunities.map(opp => opp.location.city))].slice(0, 2).join(', ')}
                                {animalOpportunities.length > 2 && ' +more'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Exploration CTA */}
                        <div className="flex items-center justify-between pt-3 border-t border-warm-beige/40">
                          <span className="text-caption font-medium text-forest">Explore {animal.name} Programs</span>
                          <ArrowRight className="w-5 h-5 text-rich-earth group-hover:translate-x-2 group-hover:text-warm-sunset transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Navigation to Programs */}
          <div className="text-center">
            <button
              onClick={() => document.getElementById('wildlife-programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-nature-primary text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All {countryOpportunities.length} Programs in Detail
              <ArrowRight className="w-5 h-5 ml-3" />
            </button>
          </div>
        </section>

        {/* WILDLIFE PROGRAMS - Complete Program Catalog */}
        <section id="wildlife-programs" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block glass-nature-light text-rich-earth rounded-full text-caption font-medium mb-6 border-nature-glass">
              📋 Complete Program Catalog
            </span>

            <h2 className="text-section text-deep-forest mb-6">
              {countryName} Wildlife Conservation Programs
            </h2>

            <p className="text-body-large text-forest/80 max-w-4xl mx-auto mb-4">
              Explore the complete collection of wildlife conservation opportunities in {countryName}.
              Each program offers unique perspectives on conservation science, biodiversity protection, and sustainable wildlife management.
            </p>

            <div className="glass-nature-light section-padding-xs max-w-3xl mx-auto mb-12 border-nature-glass">
              <p className="text-body-small text-forest/80">
                <strong>Why these programs?</strong> All programs are verified for legitimate conservation impact and transparent costs. We provide neutral exposure to quality opportunities—the choice is yours to make wisely.
              </p>
            </div>
          </motion.div>

          {/* Program Grid - Real Opportunity Cards */}
          <div className="grid-nature-2 gap-nature-lg mb-12">
            {countryOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.7 }}
                className="card-nature-hover overflow-hidden transition-all duration-500 group"
              >
                <OpportunityCard
                  opportunity={opportunity}
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          {/* Decision Support */}
          <div className="glass-nature-light section-padding-md mb-8 border-nature-glass hover:bg-soft-cream/95 transition-all duration-300">
            <h3 className="text-feature text-deep-forest mb-6 text-center">🤔 How to Choose Your Program</h3>
            <p className="text-body-small text-forest/80 text-center max-w-3xl mx-auto">
              Consider your interests: hands-on animal care vs. research vs. community work. Match duration to your availability (programs range {Math.min(...countryOpportunities.map(o => o.duration?.min || 4))}-{Math.max(...countryOpportunities.map(o => o.duration?.max || 24))} weeks). All programs welcome beginners—choose based on your conservation interests, not experience level.
            </p>
          </div>

          {/* Explore More */}
          <div className="text-center">
            <Link
              to="/opportunities"
              onClick={handleNavigation}
              className="btn-nature-secondary text-lg"
            >
              Compare Programs Worldwide
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </div>
        </section>
      </Container>

      {/* CONSERVATION EXPERTISE SECTION - Integrated & Database-Ready */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="section-savannah section-padding-lg"
      >
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block glass-nature-light text-sage-green rounded-full text-caption font-medium mb-6 border-nature-glass">
                🌿 Conservation Expertise & Impact
              </span>

              <h2 className="text-section text-deep-forest mb-6">
                {countryName} Conservation Context & Volunteer Impact
              </h2>

              <p className="text-body-large text-forest/80 max-w-4xl mx-auto mb-8">
                Understand the conservation landscape, cultural context, and your role in protecting {countryName}'s biodiversity.
              </p>
            </div>

            {/* Integrated Conservation Content */}
            {contentHub && (
              <div className="space-nature-lg">
                {/* Conservation Overview */}
                <ConservationSection
                  content={contentHub.conservation}
                  className="glass-nature-light"
                />

                {/* Regional Wildlife Section */}
                {contentHub.keySpecies && (
                  <RegionalWildlifeSection
                    keySpecies={contentHub.keySpecies}
                    countryName={countryName}
                    className="glass-nature-light"
                  />
                )}

                {/* Cultural Context Section */}
                {contentHub.culturalContext && (
                  <CulturalContextSection
                    culturalContext={contentHub.culturalContext}
                    countryName={countryName}
                    className="glass-nature-light"
                  />
                )}

                {/* Volunteer Impact Highlight */}
                <div className="glass-nature-light section-padding-md border-nature-glass hover:bg-soft-cream/95 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <Heart className="w-10 h-10 text-warm-sunset mr-4" />
                    <h3 className="text-feature text-deep-forest">Your Impact as a Wildlife Volunteer</h3>
                  </div>

                  <div className="grid-nature-2 gap-nature-lg">
                    <div>
                      <p className="text-body text-forest/80 mb-4">
                        {contentHub.conservation.solution}
                      </p>
                      <p className="text-body-small glass-nature-light rounded-lg section-padding-xs border-l-4 border-rich-earth">
                        <strong>Unlike eco-tourism:</strong> You contribute meaningful work to conservation research and animal care, not just observation. Programs offer flexible {Math.min(...countryOpportunities.map(o => o.duration?.min || 4))}-{Math.max(...countryOpportunities.map(o => o.duration?.max || 24))} week commitments.
                      </p>
                    </div>

                    <div>
                      <div className="glass-nature-light rounded-lg p-4 border-nature-glass">
                        <h4 className="text-card-title text-deep-forest mb-3">Real Impact Outcomes:</h4>
                        <p className="text-body-small text-forest/80 mb-3">{contentHub.conservation.impact}</p>
                        <div className="space-nature-xs">
                          <div className="flex items-start">
                            <div className="w-2 h-2 bg-sage-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-caption-small text-forest/70">Professional development in conservation methodologies</p>
                          </div>
                          <div className="flex items-start">
                            <div className="w-2 h-2 bg-warm-sunset rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-caption-small text-forest/70">Cultural immersion with conservation communities</p>
                          </div>
                          <div className="flex items-start">
                            <div className="w-2 h-2 bg-rich-earth rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-caption-small text-forest/70">Hands-on field experience with modern technology</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </motion.section>

      {/* Planning Your Conservation Volunteer Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="section-jungle section-padding-lg"
      >
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section text-deep-forest mb-6">
                Planning Your Wildlife Conservation Volunteer Trip to {countryName}
              </h2>
              <p className="text-body-large text-forest/80">
                Everything you need to know about volunteering with wildlife conservation programs in {countryName}
              </p>
            </div>

            <div className="grid-nature-2 gap-nature-lg">
              {/* Practical Information */}
              <div className="glass-nature-light section-padding-md border-nature-glass hover:bg-soft-cream/95 transition-all duration-300">
                <h3 className="text-feature text-deep-forest mb-6">Essential Planning Information</h3>

                <div className="space-nature-md">
                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Best Time to Volunteer</h4>
                    <p className="text-body-small text-forest/80">
                      {countrySlug === 'costa-rica' ?
                        'Costa Rica offers year-round volunteering opportunities. Dry season (December-April) is ideal for wildlife observation, while green season (May-November) offers lush landscapes and sea turtle nesting season.' :
                        `${countryName} conservation programs operate year-round, with optimal wildlife observation periods varying by species and region. Contact programs directly for seasonal recommendations.`}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Visa Requirements</h4>
                    <p className="text-body-small text-forest/80">
                      Most volunteers can enter {countryName} on a tourist visa for short-term conservation programs. Longer commitments may require specific volunteer visas. Check current requirements with {countryName} consulates.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Health & Safety</h4>
                    <p className="text-body-small text-forest/80">
                      Conservation work in {countryName} is generally safe with proper precautions. Recommended vaccinations and health insurance requirements vary by program and region.
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="glass-nature-light section-padding-md border-nature-glass hover:bg-soft-cream/95 transition-all duration-300">
                <h3 className="text-feature text-deep-forest mb-6">What to Expect</h3>

                <div className="space-nature-md">
                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Daily Activities</h4>
                    <p className="text-body-small text-forest/80 mb-2">
                      Wildlife conservation volunteers typically engage in field research, data collection, habitat maintenance, and educational activities. Work schedules vary by program and species.
                    </p>
                    <ul className="text-caption-small text-forest/70 space-y-1">
                      <li>• Early morning wildlife monitoring</li>
                      <li>• Data recording and analysis</li>
                      <li>• Habitat restoration activities</li>
                      <li>• Community outreach programs</li>
                      <li>• Evening educational sessions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Accommodation & Meals</h4>
                    <p className="text-body-small text-forest/80">
                      Most programs provide shared accommodation in research stations, eco-lodges, or homestays. Meals typically feature local cuisine and dietary restrictions can usually be accommodated.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-card-title text-deep-forest mb-2">Skills Development</h4>
                    <p className="text-body-small text-forest/80">
                      Gain valuable experience in wildlife research methodologies, conservation technology, data analysis, and cross-cultural communication while contributing to meaningful conservation outcomes.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center glass-nature-light section-padding-md border-nature-glass hover:bg-soft-cream/95 transition-all duration-300 group">
              <h3 className="text-feature text-deep-forest mb-6 group-hover:text-rich-earth transition-colors">
                Ready to Start Your Conservation Journey in {countryName}?
              </h3>
              <p className="text-body text-forest/80 mb-6 max-w-2xl mx-auto">
                Browse our carefully selected {countryOpportunities.length} conservation programs in {countryName} and find the perfect opportunity to make a meaningful impact on wildlife protection.
              </p>

              <div className="text-center">
                <Link
                  to="/opportunities"
                  onClick={handleNavigation}
                  className="btn-nature-primary"
                >
                  Explore Other Conservation Destinations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </motion.section>


      {/* Strategic SEO Internal Links - Cross-Navigation */}
      <SEOInternalLinks
        countryName={countryName}
        countrySlug={countrySlug}
        availableAnimals={availableAnimals}
        opportunities={countryOpportunities}
      />

    </div>
  );
};

export default CountryLandingPage;