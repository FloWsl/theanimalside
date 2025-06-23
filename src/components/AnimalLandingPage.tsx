import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield } from 'lucide-react';
import { Container } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import ContentHubSEO from './ContentHub/ContentHubSEO';
import OpportunityCard from './OpportunitiesPage/v2/OpportunityCard';
import { generateAnimalPageSEO, useSEO } from '../utils/seoUtils';
import { useAnimalData } from '../hooks/useAnimalData';
import SEOInternalLinks from './shared/SEOInternalLinks';

interface AnimalLandingPageProps {
  type?: 'animal' | 'conservation';
}

const AnimalLandingPage: React.FC<AnimalLandingPageProps> = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();

  // Extract animal type from URL path - now reactive to route changes
  const animalSlug = React.useMemo(() => {
    const pathname = location.pathname;

    // Parse from explicit animal routes like /lions-volunteer
    if (pathname.includes('-volunteer')) {
      return pathname.replace('/', '').replace('-volunteer', '');
    }

    // Parse from conservation routes like /wildlife-conservation
    if (pathname.includes('-conservation')) {
      return pathname.replace('/', '').replace('-conservation', '');
    }

    return '';
  }, [location.pathname]);

  // Scroll to top when animal page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [animalSlug]);

  // Use centralized animal data hook
  const {
    animalName,
    animalCategory,
    opportunities: animalOpportunities,
    contentHub,
    availableCountries,
    isLoading: dataLoading,
    error: dataError
  } = useAnimalData(animalSlug);


  // Generate and apply SEO metadata with enhanced structured data
  const seoMetadata = React.useMemo(() => {
    const metadata = generateAnimalPageSEO(animalSlug, animalOpportunities);

    const enhancedStructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": `${animalName} Conservation Programs`,
      "description": `Discover ${animalOpportunities.length} specialized ${animalName.toLowerCase()} conservation programs worldwide. Join ethical volunteer programs focused on species protection.`,
      "url": `https://theanimalside.com/${animalSlug}-volunteer`,
      "image": animalCategory?.image || animalOpportunities[0]?.images?.[0] || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      "serviceType": "Wildlife Conservation Volunteer Programs",
      "areaServed": availableCountries.map(country => ({
        "@type": "Country",
        "name": country.name
      })),
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${animalName} Conservation Programs`,
        "numberOfItems": animalOpportunities.length,
        "itemListElement": animalOpportunities.slice(0, 5).map((opp, index) => ({
          "@type": "Offer",
          "position": index + 1,
          "name": opp.title,
          "description": opp.description,
          "price": opp.cost.amount,
          "priceCurrency": opp.cost.currency,
          "availability": "InStock",
          "category": `${animalName} Conservation Volunteer Program`,
          "areaServed": {
            "@type": "Country",
            "name": opp.location.country
          },
          "provider": {
            "@type": "Organization",
            "name": "The Animal Side"
          }
        }))
      },
      "offers": animalOpportunities.map(opp => ({
        "@type": "Offer",
        "name": opp.title,
        "description": opp.description,
        "price": opp.cost.amount,
        "priceCurrency": opp.cost.currency,
        "availability": "InStock",
        "category": `${animalName} Conservation Volunteer Program`,
        "url": `https://theanimalside.com/organizations/${opp.id}`
      })),
      "keywords": [
        `${animalName.toLowerCase()} conservation`,
        `${animalName.toLowerCase()} volunteer`,
        "wildlife conservation programs",
        "conservation volunteer abroad",
        ...availableCountries.map(c => `${animalName.toLowerCase()} volunteer ${c.name.toLowerCase()}`)
      ].join(", "),
      "provider": {
        "@type": "Organization",
        "name": "The Animal Side",
        "url": "https://theanimalside.com"
      }
    };

    return {
      ...metadata,
      structuredData: enhancedStructuredData
    };
  }, [animalSlug, animalOpportunities, animalName, animalCategory, availableCountries]);

  useSEO(seoMetadata);

  // Performance optimization: Preload critical images
  React.useEffect(() => {
    if (animalOpportunities.length > 0) {
      const preloadImages = animalOpportunities.slice(0, 3).map(opp => {
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

      // Preload animal category image if available
      if (animalCategory?.image) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = animalCategory.image;
        link.as = 'image';
        document.head.appendChild(link);
        preloadImages.push(link);
      }

      return () => {
        preloadImages.forEach(link => {
          if (link && document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [animalOpportunities, animalCategory]);

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
            className="btn-nature-primary"
          >
            Browse All Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Container>
    );
  }

  if (!animalSlug || animalOpportunities.length === 0) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="section-padding-lg text-center">
          <h1 className="text-hero text-deep-forest mb-4">Animal Programs Not Found</h1>
          <p className="text-body text-forest/80 mb-8">
            We don't have any volunteer opportunities for this animal type yet.
          </p>
          <Link
            to="/opportunities"
            className="btn-nature-primary"
          >
            Browse All Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Container>
    );
  }

  // Get animal emoji
  const getAnimalEmoji = (animalName: string): string => {
    const animalEmojis: { [key: string]: string } = {
      'Lions': '🦁',
      'Elephants': '🐘',
      'Sea Turtles': '🐢',
      'Orangutans': '🦧',
      'Koalas': '🐨',
      'Tigers': '🐅',
      'Giant Pandas': '🐼',
      'Rhinos': '🦏',
      'Whales': '🐋',
      'Dolphins': '🐬',
      'Primates': '🐒',
      'Marine Life': '🐠',
      'Birds': '🦅',
      'Reptiles': '🦎',
      'Big Cats': '🐆'
    };
    return animalEmojis[animalName] || '🦁';
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
          opportunities={animalOpportunities}
        />
      )}

      {/* Breadcrumb Navigation - Top of page */}
      <div className="bg-soft-cream/80 backdrop-blur-sm border-b border-warm-beige/30">
        <Container className="py-3">
          <Breadcrumb items={breadcrumbs} />
        </Container>
      </div>

      {/* 🏆 SIMPLIFIED HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-deep-forest to-rich-earth">
        {/* Simple Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${animalCategory?.image || animalOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop&q=80'})`
            }}
          />
        </div>

        <div className="container-nature relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Clean Title */}
            <div className="mb-6">
              <span className="text-6xl mb-4 block">{getAnimalEmoji(animalName)}</span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {animalName} Conservation Programs
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join meaningful conservation efforts across {availableCountries.length} countries and make a real impact.
              </p>
            </div>

            {/* Single CTA */}
            <div className="mt-8">
              <button
                onClick={() => document.getElementById('wildlife-programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-sage-green hover:bg-sage-green/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 OPPORTUNITIES SHOWCASE - Using Existing Components */}
      <section id="wildlife-programs" className="py-24 bg-gradient-to-br from-warm-beige via-soft-cream to-gentle-lemon/30">
        <div className="container-nature">

          {/* ✨ Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Enhanced badge with gradient and better styling */}
            <div className="bg-gradient-to-r from-rich-earth/20 via-white/80 to-rich-earth/20 backdrop-blur-sm border border-rich-earth/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">{getAnimalEmoji(animalName)}</span>
                </div>
                <span className="text-rich-earth font-black text-lg tracking-wide">{animalName} Programs</span>
              </div>
            </div>

            {/* Enhanced title with gradient text */}
            <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
              <span className="block">Available {animalName}</span>
              <span className="block bg-gradient-to-r from-rich-earth via-warm-sunset to-golden-hour bg-clip-text text-transparent">Conservation Programs</span>
            </h2>

            {/* Enhanced description with visual hierarchy */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                Explore {animalOpportunities.length} verified {animalName.toLowerCase()} conservation programs across {availableCountries.length} countries.
              </p>
              <p className="text-base text-rich-earth font-semibold">
                Each program offers authentic conservation impact and meaningful volunteer experiences.
              </p>
            </div>
          </motion.div>

          {/* 🏆 OPPORTUNITIES GRID - Using Existing v2 Components */}
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {animalOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120
                }}
              >
                <OpportunityCard opportunity={opportunity} index={index} />
              </motion.div>
            ))}
          </div>

          {/* CTA to View All */}
          {animalOpportunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-16"
            >
              <Link
                to="/opportunities"
                className="btn-nature-primary btn-touch-optimized group inline-flex items-center"
              >
                <span className="font-semibold">Explore All Opportunities</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}

        </div>
      </section>

      {/* 🌍 AWARD-WINNING CONSERVATION SHOWCASE */}
      <section className="section-conservation-showcase py-24 bg-gradient-to-br from-soft-cream via-warm-beige/50 to-gentle-lemon/20">
        <div className="container-nature">

          {/* 🎯 Sophisticated Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Enhanced badge with gradient and better styling */}
            <div className="bg-gradient-to-r from-sage-green/20 via-white/80 to-sage-green/20 backdrop-blur-sm border border-sage-green/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-green to-deep-forest rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">{getAnimalEmoji(animalName)}</span>
                </div>
                <span className="text-sage-green font-black text-lg tracking-wide">Conservation Destinations</span>
              </div>
            </div>

            {/* Enhanced title with gradient text */}
            <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
              <span className="block">Where {animalName}</span>
              <span className="block bg-gradient-to-r from-sage-green via-rich-earth to-warm-sunset bg-clip-text text-transparent">Conservation Happens</span>
            </h2>

            {/* Enhanced description with visual hierarchy */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                Each destination offers unique conservation challenges and breakthrough opportunities.
              </p>
              <p className="text-base text-sage-green font-semibold">
                Discover where your impact will be greatest.
              </p>
            </div>
          </motion.div>

          {/* 🎬 GLASSMORPHIC DESTINATION STRIPS */}
          <div className="space-y-4 mb-20 max-w-5xl mx-auto px-4">
            {availableCountries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <Link to={`/${animalSlug}-volunteer/${country.slug}`}>
                  <div className="relative h-32 rounded-2xl overflow-hidden group-hover:shadow-xl transition-all duration-300 bg-gray-600">
                    {/* Background Image */}
                    <img
                      src={country.image}
                      alt={`${country.name} landscape`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Enhanced background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50 group-hover:from-black/50 group-hover:via-black/20 group-hover:to-black/40 transition-all duration-300" />

                    {/* Glassmorphic content container */}
                    <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
                      {/* Left: Country info with glassmorphism */}
                      <div className="flex items-center gap-5">
                        <span className="text-3xl filter drop-shadow-lg">{country.flag}</span>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                          <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                            {country.name}
                          </h3>
                          <p className="text-sm text-white/90 font-medium">
                            {animalName} Conservation
                          </p>
                        </div>
                      </div>

                      {/* Right: Glassmorphic action button */}
                      <div className="bg-white/15 backdrop-blur-md rounded-xl px-6 py-4 border border-white/25 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-4 text-white">
                          <div className="text-right">
                            <div className="text-xl font-bold drop-shadow-md">{country.count}</div>
                            <div className="text-xs text-white/90 font-medium">Programs</div>
                          </div>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 drop-shadow-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* 🎯 Trust & Impact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="glass-section p-12 text-center"
          >
            <h3 className="text-2xl font-black text-deep-forest mb-6">
              🌟 Why These Destinations Excel
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-green to-rich-earth rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-deep-forest text-lg">Verified Impact</h4>
                <p className="text-base text-forest/80">All programs verified for legitimate conservation outcomes</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-warm-sunset to-golden-hour rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-deep-forest text-lg">Cultural Integration</h4>
                <p className="text-base text-forest/80">Deep partnerships with local communities and scientists</p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-rich-earth to-deep-forest rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-deep-forest text-lg">Sustainable Methods</h4>
                <p className="text-base text-forest/80">Science-based approaches with measurable results</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 🌍 GEOGRAPHIC DECISION FRAMEWORK */}
      <section className="py-20 bg-gradient-to-br from-soft-cream via-warm-beige/60 to-gentle-lemon/30">
        <div className="container-nature">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Enhanced badge with gradient and better styling */}
            <div className="bg-gradient-to-r from-golden-hour/20 via-white/80 to-golden-hour/20 backdrop-blur-sm border border-golden-hour/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-golden-hour to-warm-sunset rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🗺️</span>
                </div>
                <span className="text-golden-hour font-black text-lg tracking-wide">Choose Your Conservation Journey</span>
              </div>
            </div>

            {/* Enhanced title with gradient text */}
            <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
              <span className="block">Africa vs Asia vs Americas:</span>
              <span className="block bg-gradient-to-r from-golden-hour via-warm-sunset to-rich-earth bg-clip-text text-transparent">Which Path Calls to You?</span>
            </h2>

            {/* Enhanced description with visual hierarchy */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                Each continent offers distinct conservation approaches, cultural experiences, and wildlife interaction styles.
              </p>
              <p className="text-base text-golden-hour font-semibold">
                Discover which {animalName.toLowerCase()} conservation environment matches your goals.
              </p>
            </div>
          </motion.div>

          {/* Geographic Comparison Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">

            {/* Africa Experience */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-section p-8 h-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-warm-sunset/10 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-warm-sunset to-rich-earth rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-deep-forest">African Experience</h3>
                    <p className="text-sage-green text-sm font-semibold">Traditional Conservation Model</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Conservation Focus</h4>
                    <p className="text-forest/80 text-base leading-relaxed">
                      {getGeographicFocus('Africa', animalName).focus}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Daily Experience</h4>
                    <div className="space-y-2">
                      {getGeographicFocus('Africa', animalName).dailyLife.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-warm-sunset rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/70">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {getGeographicFocus('Africa', animalName).bestFor.map((type, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-warm-sunset/10 text-warm-sunset text-sm rounded-full border border-warm-sunset/20">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-warm-sunset/10 p-4 rounded-lg border border-warm-sunset/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-warm-sunset text-base">🎯</span>
                    <h5 className="font-bold text-warm-sunset text-base">Unique Advantage</h5>
                  </div>
                  <p className="text-warm-sunset text-sm font-medium">
                    {getGeographicFocus('Africa', animalName).advantage}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Asia Experience */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-section p-8 h-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sage-green/10 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-sage-green to-deep-forest rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌏</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-deep-forest">Asian Experience</h3>
                    <p className="text-sage-green text-sm font-semibold">Sanctuary & Rehabilitation Model</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Conservation Focus</h4>
                    <p className="text-forest/80 text-base leading-relaxed">
                      {getGeographicFocus('Asia', animalName).focus}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Daily Experience</h4>
                    <div className="space-y-2">
                      {getGeographicFocus('Asia', animalName).dailyLife.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/70">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {getGeographicFocus('Asia', animalName).bestFor.map((type, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-sage-green/10 text-sage-green text-sm rounded-full border border-sage-green/20">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-sage-green/10 p-4 rounded-lg border border-sage-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sage-green text-base">🎯</span>
                    <h5 className="font-bold text-sage-green text-base">Unique Advantage</h5>
                  </div>
                  <p className="text-sage-green text-sm font-medium">
                    {getGeographicFocus('Asia', animalName).advantage}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Americas Experience */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-section p-8 h-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-golden-hour/10 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-golden-hour to-warm-sunset rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌎</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-deep-forest">Americas Experience</h3>
                    <p className="text-golden-hour text-sm font-semibold">Research & Marine Model</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Conservation Focus</h4>
                    <p className="text-forest/80 text-base leading-relaxed">
                      {getGeographicFocus('Americas', animalName).focus}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Daily Experience</h4>
                    <div className="space-y-2">
                      {getGeographicFocus('Americas', animalName).dailyLife.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-golden-hour rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/70">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {getGeographicFocus('Americas', animalName).bestFor.map((type, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-golden-hour/10 text-golden-hour text-sm rounded-full border border-golden-hour/20">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-golden-hour/10 p-4 rounded-lg border border-golden-hour/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-golden-hour text-base">🎯</span>
                    <h5 className="font-bold text-golden-hour text-base">Unique Advantage</h5>
                  </div>
                  <p className="text-golden-hour text-sm font-medium">
                    {getGeographicFocus('Americas', animalName).advantage}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decision Helper CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div className="glass-hero p-8 inline-block max-w-2xl w-full">
              <h3 className="text-xl font-black text-deep-forest mb-4">
                🤔 Still Deciding? Let Your Interests Guide You
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="font-bold text-deep-forest text-base">🔬 Research-Focused</h4>
                  <p className="text-forest/80 text-sm">Americas programs offer cutting-edge research methodologies and data collection opportunities</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-deep-forest text-base">🏛️ Cultural Immersion</h4>
                  <p className="text-forest/80 text-sm">African programs provide deep cultural exchange with traditional conservation communities</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-deep-forest text-base">🧘 Sanctuary Care</h4>
                  <p className="text-forest/80 text-sm">Asian programs focus on individual animal welfare and rehabilitation success stories</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 💎 VOLUNTEER IMPACT SHOWCASE */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-deep-forest via-rich-earth to-warm-sunset">
        <div className="container-nature">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Impact Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:col-span-7 text-white space-y-6"
            >
              <div className="glass-hero p-6 lg:p-8">
                <Leaf className="w-10 h-10 lg:w-12 lg:h-12 text-golden-hour mb-4" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 leading-tight">
                  Your Impact as a <span className="break-words">{animalName}</span> Conservation Volunteer
                </h3>
                {contentHub && (
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    {contentHub.conservation.solution}
                  </p>
                )}
              </div>

              <div className="glass-section p-6 lg:p-8">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Professional Development Outcomes</h4>
                {contentHub && (
                  <p className="text-white/80 text-sm sm:text-base mb-4 leading-relaxed">{contentHub.conservation.impact}</p>
                )}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-golden-hour rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 text-sm sm:text-base">{animalName}-specific behavioral research methodologies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 text-sm sm:text-base">Cross-cultural conservation collaboration</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warm-sunset rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 text-sm sm:text-base">Modern wildlife tracking and monitoring technology</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:col-span-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-6">
                <div className="glass-section p-6 lg:p-8 text-center">
                  <div className="text-3xl lg:text-4xl font-black text-golden-hour mb-2">95%</div>
                  <p className="text-white font-semibold text-sm sm:text-base">Program Completion Rate</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">Industry-leading volunteer satisfaction</p>
                </div>

                <div className="glass-section p-6 lg:p-8 text-center">
                  <div className="text-3xl lg:text-4xl font-black text-golden-hour mb-2">4.8★</div>
                  <p className="text-white font-semibold text-sm sm:text-base">Average Program Rating</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">From {animalCategory?.volunteers || '2000+'} verified reviews</p>
                </div>

                <div className="glass-section p-6 lg:p-8 text-center">
                  <div className="text-3xl lg:text-4xl font-black text-golden-hour mb-2">78%</div>
                  <p className="text-white font-semibold text-sm sm:text-base">Career Impact</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">Volunteers report career advancement</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* 🎯 AWARD-WINNING FAQ & PLANNING SECTION - Progressive Disclosure */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gentle-lemon/20 via-soft-cream to-warm-beige/50">
        <div className="container-nature">

          {/* Premium Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="glass-hero inline-block px-8 py-4 mb-8">
              <span className="text-3xl mr-4">🤔</span>
              <span className="text-deep-forest font-bold text-lg">Planning Your Adventure</span>
            </div>

            <h2 className="text-2xl md:text-hero-responsive text-deep-forest mb-8 leading-tight">
              <span className="block">Everything You Need</span>
              <span className="block text-gradient-nature">To Get Started</span>
            </h2>

            {/* 📱 Mobile Quick Stats - Progressive Disclosure */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8 md:hidden">
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-black text-rich-earth">{animalOpportunities.length}</div>
                <div className="text-xs text-forest/80">Programs</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-black text-rich-earth">{availableCountries.length}</div>
                <div className="text-xs text-forest/80">Countries</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-black text-rich-earth">4.8★</div>
                <div className="text-xs text-forest/80">Rating</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-xl font-black text-rich-earth">2-12</div>
                <div className="text-xs text-forest/80">Weeks</div>
              </div>
            </div>
          </motion.div>

          {/* FAQ & Planning Grid - Mobile Optimized */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-section p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-black text-deep-forest mb-6 lg:mb-8 flex items-center">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <span className="text-white text-lg lg:text-xl">❓</span>
                  </div>
                  <span className="text-base lg:text-2xl">Frequently Asked Questions</span>
                </h3>

                <div className="space-y-4 lg:space-y-6">
                  <div className="space-y-2 lg:space-y-3">
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest">
                      What will I actually be doing day-to-day?
                    </h4>
                    <p className="text-sm lg:text-base text-forest/80 leading-relaxed">
                      {getRoleReality(animalName).daily}
                    </p>
                    <div className="bg-warm-sunset/10 p-3 rounded-lg border border-warm-sunset/20 mt-2">
                      <p className="text-warm-sunset text-xs font-medium">
                        Reality Check: {getRoleReality(animalName).reality}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest">
                      What skills do I need vs. what will I learn?
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <h5 className="text-base font-semibold text-deep-forest mb-1">Required Now:</h5>
                        <p className="text-sm lg:text-base text-forest/80">
                          {getRoleReality(animalName).required}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-base font-semibold text-deep-forest mb-1">You'll Develop:</h5>
                        <p className="text-sm lg:text-base text-forest/80">
                          {getRoleReality(animalName).learned}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest">
                      What are the physical and emotional demands?
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-sage-green/10 p-3 rounded-lg border border-sage-green/20">
                        <h5 className="text-base font-semibold text-sage-green mb-1">Physical Demands:</h5>
                        <p className="text-sm text-sage-green">
                          {getRoleReality(animalName).physical}
                        </p>
                      </div>
                      <div className="bg-golden-hour/10 p-3 rounded-lg border border-golden-hour/20">
                        <h5 className="text-base font-semibold text-golden-hour mb-1">Emotional Challenges:</h5>
                        <p className="text-sm text-golden-hour">
                          {getRoleReality(animalName).emotional}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest">
                      Which destination matches my experience level?
                    </h4>
                    <p className="text-sm lg:text-base text-forest/80 leading-relaxed">
                      {getTopCountryRecommendation(animalName, availableCountries)}
                    </p>
                  </div>

                  {/* 📱 Mobile CTA for FAQ */}
                  <div className="mt-6 lg:hidden">
                    <motion.button
                      className="w-full glass-card glass-interactive p-4 text-center"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-rich-earth font-semibold text-sm">View All Questions</span>
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Planning Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-section p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-black text-deep-forest mb-6 lg:mb-8 flex items-center">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-sage-green to-rich-earth rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <span className="text-white text-lg lg:text-xl">📋</span>
                  </div>
                  <span className="text-base lg:text-2xl">What to Expect</span>
                </h3>

                <div className="space-y-4 lg:space-y-6">
                  <div>
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest mb-2 lg:mb-3">Daily Activities</h4>
                    <div className="space-y-2">
                      {getDailySchedule(animalName).slice(0, 4).map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-2 lg:gap-3">
                          <div className="w-2 h-2 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-forest/80 text-xs lg:text-sm">{activity}</p>
                        </div>
                      ))}
                      {/* 📱 Progressive Disclosure for Mobile */}
                      <div className="lg:hidden">
                        <motion.button
                          className="text-rich-earth text-xs font-medium mt-2 flex items-center"
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>See all activities</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base lg:text-lg font-bold text-deep-forest mb-2 lg:mb-3">Accommodation & Impact</h4>
                    <p className="text-forest/80 text-xs lg:text-sm leading-relaxed">
                      {getAccommodationInfo(animalName, availableCountries)}
                    </p>
                    <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-sage-green/10 rounded-lg border border-sage-green/20">
                      <p className="text-sage-green text-xs lg:text-sm font-medium">
                        {getConservationImpact(animalName)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>


        </div>
      </section>


      {/* 🔬 CONSERVATION SCIENCE & RESEARCH INSIGHTS */}
      <section className="py-20 bg-gradient-to-br from-warm-beige via-soft-cream to-gentle-lemon/20">
        <div className="container-nature">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="glass-hero inline-block px-8 py-4 mb-8">
              <span className="text-3xl mr-4">🔬</span>
              <span className="text-deep-forest font-bold text-lg">Conservation Science</span>
            </div>

            <h2 className="text-2xl lg:text-4xl font-black text-deep-forest mb-6 leading-tight">
              <span className="block">The Science Behind</span>
              <span className="block text-gradient-nature">{animalName} Conservation</span>
            </h2>

            <p className="text-base lg:text-lg text-forest/80 max-w-2xl mx-auto leading-relaxed">
              Understanding the research, methodologies, and conservation strategies that make your volunteer work meaningful and impactful.
            </p>
          </motion.div>

          {/* Conservation Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">

            {/* Conservation Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-section p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-warm-sunset to-rich-earth rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">⚠️</span>
                </div>

                <h3 className="text-xl font-black text-deep-forest mb-6 text-center">Current Challenges</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Primary Threats</h4>
                    <div className="space-y-2">
                      {getConservationChallenges(animalName).threats.map((threat, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-warm-sunset rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/80">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Population Status</h4>
                    <div className="bg-warm-sunset/10 p-3 rounded-lg border border-warm-sunset/20">
                      <p className="text-warm-sunset text-sm font-medium">
                        {getConservationChallenges(animalName).status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Research Methods */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-section p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-green to-deep-forest rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">🔍</span>
                </div>

                <h3 className="text-xl font-black text-deep-forest mb-6 text-center">Research Methods</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Data Collection</h4>
                    <div className="space-y-2">
                      {getResearchMethods(animalName).methods.map((method, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/80">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Technology Used</h4>
                    <div className="space-y-1">
                      {getResearchMethods(animalName).technology.map((tech, idx) => (
                        <div key={idx} className="text-sm text-forest/70 bg-sage-green/5 px-3 py-1.5 rounded">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Stories */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-section p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-golden-hour to-warm-sunset rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl">🏆</span>
                </div>

                <h3 className="text-xl font-black text-deep-forest mb-6 text-center">Success Stories</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Conservation Wins</h4>
                    <div className="space-y-2">
                      {getSuccessStories(animalName).achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-golden-hour rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-forest/80">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-deep-forest mb-2">Impact Numbers</h4>
                    <div className="bg-golden-hour/10 p-3 rounded-lg border border-golden-hour/20">
                      <p className="text-golden-hour text-sm font-medium">
                        {getSuccessStories(animalName).impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Species & Conservation Deep Dive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-12"
          >
            {/* 🧬 Species Subspecies Breakdown */}
            <div className="glass-section p-12">
              <h3 className="text-2xl font-black text-deep-forest mb-8 text-center">
                🧬 {animalName} Species & Subspecies Guide 2025
              </h3>

              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-lg font-bold text-deep-forest mb-6">Species Breakdown</h4>
                  <div className="space-y-6">
                    {getSpeciesBreakdown(animalName).map((species, idx) => (
                      <div key={idx} className="border-l-4 border-sage-green pl-6">
                        <h5 className="font-bold text-deep-forest mb-2 flex items-center">
                          <span className="text-2xl mr-3">{species.emoji}</span>
                          {species.name}
                        </h5>
                        <p className="text-forest/80 text-base mb-2">{species.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-sage-green/10 text-sage-green text-sm rounded-full">
                            Population: {species.population}
                          </span>
                          <span className="px-3 py-1.5 bg-warm-sunset/10 text-warm-sunset text-sm rounded-full">
                            Status: {species.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-deep-forest mb-6">2025 Conservation Urgency</h4>
                  <div className="bg-warm-sunset/10 p-6 rounded-xl border border-warm-sunset/20 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-warm-sunset rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">!</span>
                      </div>
                      <h5 className="font-bold text-warm-sunset">Why Action is Needed NOW</h5>
                    </div>
                    <div className="space-y-3">
                      {getConservationUrgency(animalName).map((urgency, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-warm-sunset rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-warm-sunset text-sm font-medium">{urgency}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-golden-hour/10 p-6 rounded-xl border border-golden-hour/20">
                    <h5 className="font-bold text-golden-hour mb-3">Positive Trends & Hope</h5>
                    <div className="space-y-2">
                      {getPositiveTrends(animalName).map((trend, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-golden-hour rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-golden-hour text-sm font-medium">{trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Conservation Context */}
            {contentHub && (
              <div className="glass-section p-12">
                <h3 className="text-2xl font-black text-deep-forest mb-8 text-center">
                  In-Depth: {animalName} Conservation Context
                </h3>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-4">The Conservation Challenge</h4>
                    <p className="text-forest/80 leading-relaxed mb-6">
                      {contentHub.conservation.challenge}
                    </p>

                    <h4 className="text-lg font-bold text-deep-forest mb-4">Your Role as a Volunteer</h4>
                    <p className="text-forest/80 leading-relaxed">
                      {contentHub.conservation.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-4">Measurable Impact</h4>
                    <p className="text-forest/80 leading-relaxed mb-6">
                      {contentHub.conservation.impact}
                    </p>

                    <div className="bg-sage-green/10 p-6 rounded-xl border border-sage-green/20">
                      <h5 className="text-sm font-bold text-sage-green mb-3">Key Research Focus Areas</h5>
                      <div className="space-y-2">
                        {getResearchFocusAreas(animalName).map((area, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-sage-green rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-sm text-sage-green font-medium">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 🌟 STRATEGIC SEO INTERNAL LINKS */}
      <SEOInternalLinks
        type="animal"
        animalName={animalName}
        animalSlug={animalSlug}
        availableCountries={availableCountries}
        opportunities={animalOpportunities}
      />
    </div>
  );
};


const getDailySchedule = (animalName: string): string[] => {
  const schedules: { [key: string]: string[] } = {
    'Lions': [
      'Early morning big cat tracking and behavior observation',
      'Data collection and GPS collar monitoring',
      'Anti-poaching patrol support and camera trap maintenance',
      'Community outreach and education programs',
      'Evening predator activity monitoring'
    ],
    'Elephants': [
      'Dawn elephant sanctuary care and feeding routines',
      'Behavioral observation and enrichment activities',
      'Habitat restoration and corridor maintenance',
      'Community conflict mitigation workshops',
      'Sunset elephant interaction and monitoring'
    ],
    'Sea Turtles': [
      'Pre-dawn beach patrol for nesting activity',
      'Hatchery maintenance and egg monitoring',
      'Marine debris cleanup and coastal restoration',
      'Data recording and research assistance',
      'Night patrol for turtle protection'
    ],
    'Orangutans': [
      'Morning primate feeding and care routines',
      'Forest conservation and tree planting activities',
      'Rehabilitation support activities',
      'Data collection and research assistance',
      'Educational sessions on rainforest ecology'
    ],
    'default': [
      'Morning animal monitoring and observation',
      'Conservation data collection and recording',
      'Habitat maintenance and protection activities',
      'Community education and outreach programs',
      'Evening wildlife tracking sessions'
    ]
  };
  return schedules[animalName] || schedules.default;
};

const getAccommodationInfo = (animalName: string, countries: Array<{ name: string }>): string => {
  const baseInfo = `${animalName} conservation program accommodation varies by location, typically ranging from field research stations to eco-lodges, with shared facilities and meals featuring regional cuisine.`;

  if (countries.length === 0) return baseInfo;

  const specific: { [key: string]: string } = {
    'Lions': 'Stay in safari camps, research stations, or eco-lodges near reserves. Shared tents or rooms with basic amenities, communal dining, and campfire evenings.',
    'Elephants': 'Accommodation varies from bamboo bungalows to eco-lodges near sanctuaries. Shared facilities with mosquito nets, fans, and traditional meals.',
    'Sea Turtles': 'Beach-side accommodation ranges from research stations to eco-lodges. Simple rooms with fans, shared bathrooms, and fresh seafood meals.',
    'Orangutans': 'Jungle lodges or research stations with basic amenities. Shared rooms, mosquito protection, and meals featuring local Indonesian cuisine.',
    'default': baseInfo
  };
  return specific[animalName] || baseInfo;
};

const getConservationImpact = (animalName: string): string => {
  const impacts: { [key: string]: string } = {
    'Lions': 'Contribute to pride monitoring, anti-poaching efforts, and human-wildlife conflict mitigation. Your data supports long-term population research and protection strategies.',
    'Elephants': 'Support rescued elephant rehabilitation, behavioral research, and sanctuary improvements. Help develop enrichment programs and contribute to elephant welfare standards.',
    'Sea Turtles': 'Protect nesting sites, monitor population trends, and support hatchling success rates. Contribute to marine conservation and plastic pollution awareness.',
    'Orangutans': 'Aid rehabilitation programs, forest conservation, and research on primate behavior. Support reintroduction efforts and rainforest protection initiatives.',
    'default': 'Make measurable contributions to wildlife monitoring, habitat protection, and conservation research while developing professional skills in conservation science.'
  };
  return impacts[animalName] || impacts.default;
};

// FAQ helper functions

const getTopCountryRecommendation = (animalName: string, countries: Array<{ name: string; count: number }>): string => {
  if (countries.length === 0) return '';

  const topCountry = countries.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  const recommendations: { [key: string]: string } = {
    'Lions': `${topCountry.name} offers the most programs (${topCountry.count}) with excellent big cat conservation opportunities.`,
    'Elephants': `${topCountry.name} leads with ${topCountry.count} programs, known for ethical elephant sanctuary work.`,
    'Sea Turtles': `${topCountry.name} has ${topCountry.count} marine programs covering both nesting and research activities.`,
    'Orangutans': `${topCountry.name} offers ${topCountry.count} programs focused on rehabilitation and rainforest protection.`,
    'default': `${topCountry.name} offers the most options with ${topCountry.count} programs available.`
  };

  return recommendations[animalName] || recommendations.default;
};

// Conservation science and research helper functions

const getConservationChallenges = (animalName: string): { threats: string[], status: string } => {
  const challenges: { [key: string]: { threats: string[], status: string } } = {
    'Lions': {
      threats: [
        'Human-wildlife conflict and retaliatory killing',
        'Habitat loss and fragmentation',
        'Declining prey populations',
        'Poaching for body parts and traditional medicine',
        'Climate change affecting prey and water sources'
      ],
      status: 'Vulnerable species with only 20,000 individuals remaining in the wild, a 43% decline over the past 21 years.'
    },
    'Elephants': {
      threats: [
        'Ivory poaching and illegal wildlife trade',
        'Habitat loss for agriculture and development',
        'Human-elephant conflict incidents',
        'Climate change and drought affecting water sources',
        'Tourism exploitation and welfare concerns'
      ],
      status: 'African elephants listed as Endangered with populations declining by 60% over the last decade.'
    },
    'Sea Turtles': {
      threats: [
        'Plastic pollution and marine debris ingestion',
        'Coastal development destroying nesting beaches',
        'Climate change affecting sand temperatures',
        'Fishing gear entanglement and bycatch',
        'Light pollution disrupting nesting behavior'
      ],
      status: 'Six of seven sea turtle species listed as Threatened or Endangered under international protection.'
    },
    'Orangutans': {
      threats: [
        'Deforestation for palm oil and timber',
        'Illegal pet trade and capture',
        'Forest fires and habitat destruction',
        'Mining and industrial development',
        'Fragmentation isolating populations'
      ],
      status: 'Critically Endangered with Bornean orangutans declining by 50% over three generations.'
    },
    'default': {
      threats: [
        'Habitat loss and degradation',
        'Human-wildlife conflict',
        'Climate change impacts',
        'Illegal wildlife trade',
        'Pollution and contamination'
      ],
      status: 'Conservation status varies by species, but many face increasing pressure from human activities.'
    }
  };

  return challenges[animalName] || challenges.default;
};

const getResearchMethods = (animalName: string): { methods: string[], technology: string[] } => {
  const methods: { [key: string]: { methods: string[], technology: string[] } } = {
    'Lions': {
      methods: [
        'GPS collar tracking and movement analysis',
        'Camera trap surveys for population monitoring',
        'Behavioral observation and pride dynamics recording',
        'Prey species abundance surveys',
        'Human-wildlife conflict incident documentation'
      ],
      technology: ['GPS collars', 'Camera traps', 'GIS mapping software', 'Radio telemetry', 'Drones for aerial surveys']
    },
    'Elephants': {
      methods: [
        'Individual identification through ear pattern analysis',
        'Behavioral enrichment effectiveness assessment',
        'Stress hormone analysis from dung samples',
        'Movement pattern analysis in sanctuary settings',
        'Community attitude surveys toward conservation'
      ],
      technology: ['Photo-ID databases', 'Hormone analysis kits', 'GPS tracking devices', 'Behavioral coding software', 'Drone monitoring']
    },
    'Sea Turtles': {
      methods: [
        'Nesting beach monitoring and data collection',
        'Satellite tag tracking of migration patterns',
        'Nest temperature monitoring for climate research',
        'Plastic ingestion and health impact studies',
        'Hatchling success rate analysis'
      ],
      technology: ['Satellite tags', 'Temperature loggers', 'PIT tags for identification', 'Underwater cameras', 'Marine debris databases']
    },
    'default': {
      methods: [
        'Population surveys and monitoring',
        'Behavioral observation protocols',
        'Habitat assessment techniques',
        'Community engagement evaluations',
        'Conservation effectiveness measurements'
      ],
      technology: ['GPS devices', 'Camera equipment', 'Data collection apps', 'Mapping software', 'Research databases']
    }
  };

  return methods[animalName] || methods.default;
};

const getSuccessStories = (animalName: string): { achievements: string[], impact: string } => {
  const stories: { [key: string]: { achievements: string[], impact: string } } = {
    'Lions': {
      achievements: [
        'Kenyan lion populations stabilized through community conservancies',
        'Reduced human-lion conflict by 70% in key conservation areas',
        'Successfully established wildlife corridors connecting protected areas',
        'Trained over 200 community rangers in conservation techniques',
        'Implemented compensation schemes for livestock predation'
      ],
      impact: 'Lion populations have stabilized in community conservancy areas, with some showing 15% growth over 5 years.'
    },
    'Elephants': {
      achievements: [
        'Rescued and rehabilitated over 300 elephants from exploitation',
        'Established ethical elephant tourism alternatives',
        'Reduced human-elephant conflict incidents by 60% in program areas',
        'Created employment for 150+ former mahouts in conservation',
        'Protected 50,000 hectares of critical elephant habitat'
      ],
      impact: 'Sanctuary programs have demonstrated 85% success rate in elephant rehabilitation and welfare improvement.'
    },
    'Sea Turtles': {
      achievements: [
        'Protected 80% of nesting sites in critical conservation areas',
        'Increased hatchling survival rates by 40% through hatchery programs',
        'Removed over 10 tons of plastic debris from nesting beaches',
        'Engaged 500+ fishing vessels in turtle-friendly practices',
        'Established marine protected areas covering 25,000 hectares'
      ],
      impact: 'Nesting populations have shown 25% increase over 10 years in protected areas with volunteer programs.'
    },
    'default': {
      achievements: [
        'Significant population recovery in protected areas',
        'Successful habitat restoration projects',
        'Reduced human-wildlife conflict incidents',
        'Increased community participation in conservation',
        'Improved species monitoring and research capabilities'
      ],
      impact: 'Conservation programs show measurable positive outcomes for wildlife populations and community engagement.'
    }
  };

  return stories[animalName] || stories.default;
};

const getResearchFocusAreas = (animalName: string): string[] => {
  const focusAreas: { [key: string]: string[] } = {
    'Lions': [
      'Pride social dynamics and territorial behavior',
      'Human-wildlife coexistence strategies',
      'Prey-predator relationship modeling',
      'Conservation genetics and population connectivity',
      'Climate adaptation and habitat resilience'
    ],
    'Elephants': [
      'Cognitive abilities and emotional intelligence',
      'Migration pattern analysis and corridor planning',
      'Human-elephant conflict mitigation techniques',
      'Sanctuary welfare assessment protocols',
      'Community-based conservation effectiveness'
    ],
    'Sea Turtles': [
      'Climate change impacts on nesting success',
      'Marine plastic pollution effects on health',
      'Migration route mapping and protection',
      'Coastal development impact assessment',
      'Community engagement in marine conservation'
    ],
    'Orangutans': [
      'Rainforest ecology and restoration techniques',
      'Rehabilitation and reintroduction protocols',
      'Deforestation impact on population dynamics',
      'Community-based forest management',
      'Alternative livelihood development strategies'
    ],
    'default': [
      'Population dynamics and behavioral ecology',
      'Habitat conservation and restoration methods',
      'Human-wildlife interaction studies',
      'Conservation technology applications',
      'Community engagement and education effectiveness'
    ]
  };

  return focusAreas[animalName] || focusAreas.default;
};

// NEW FUNCTIONS for Enhanced Conservation Context Section (2025 Data)

const getSpeciesBreakdown = (animalName: string): Array<{
  name: string;
  emoji: string;
  description: string;
  population: string;
  status: string;
}> => {
  const speciesData: { [key: string]: Array<{ name: string, emoji: string, description: string, population: string, status: string }> } = {
    'Lions': [
      {
        name: 'African Lion (Panthera leo)',
        emoji: '🦁',
        description: 'The iconic savanna predator found across sub-Saharan Africa, known for complex social structures and cooperative hunting.',
        population: '~20,000',
        status: 'Vulnerable'
      },
      {
        name: 'West African Lion',
        emoji: '🦁',
        description: 'Critically endangered subspecies with unique genetic markers, found in small populations across West Africa.',
        population: '~400',
        status: 'Critically Endangered'
      },
      {
        name: 'Asiatic Lion (P. l. persica)',
        emoji: '🦁',
        description: 'The last surviving Asian lion population, confined to Gir National Park in India with distinctive physical traits.',
        population: '~674',
        status: 'Endangered'
      }
    ],
    'Elephants': [
      {
        name: 'African Bush Elephant',
        emoji: '🐘',
        description: 'The largest land mammal, ecosystem engineers crucial for maintaining savanna and forest ecosystems across Africa.',
        population: '~415,000',
        status: 'Endangered'
      },
      {
        name: 'African Forest Elephant',
        emoji: '🐘',
        description: 'Smaller, darker subspecies with straighter tusks, essential for rainforest seed dispersal and forest regeneration.',
        population: '~200,000',
        status: 'Critically Endangered'
      },
      {
        name: 'Asian Elephant',
        emoji: '🐘',
        description: 'Highly intelligent species with cultural significance across Asia, facing severe habitat fragmentation pressures.',
        population: '~50,000',
        status: 'Endangered'
      }
    ],
    'Sea Turtles': [
      {
        name: 'Hawksbill Turtle',
        emoji: '🐢',
        description: 'Critical coral reef species with distinctive beak-like mouth, essential for maintaining healthy reef ecosystems.',
        population: '~25,000 nesting females',
        status: 'Critically Endangered'
      },
      {
        name: 'Green Sea Turtle',
        emoji: '🐢',
        description: 'Large herbivorous turtle vital for seagrass ecosystem health, showing promising recovery in protected areas.',
        population: '~200,000 nesting females',
        status: 'Endangered'
      },
      {
        name: 'Leatherback Turtle',
        emoji: '🐢',
        description: 'Largest sea turtle species and deepest diving reptile, facing severe threats from plastic pollution.',
        population: '~25,000-42,000 nesting females',
        status: 'Vulnerable'
      }
    ],
    'Orangutans': [
      {
        name: 'Bornean Orangutan',
        emoji: '🦧',
        description: 'Critically endangered great ape with remarkable intelligence, facing severe deforestation pressure in Borneo.',
        population: '~104,000',
        status: 'Critically Endangered'
      },
      {
        name: 'Sumatran Orangutan',
        emoji: '🦧',
        description: 'Most endangered orangutan species with distinctive facial features, confined to northern Sumatra forests.',
        population: '~14,000',
        status: 'Critically Endangered'
      },
      {
        name: 'Tapanuli Orangutan',
        emoji: '🦧',
        description: 'Newest discovered great ape species (2017), already critically endangered with tiny population in Tapanuli forests.',
        population: '~800',
        status: 'Critically Endangered'
      }
    ],
    'default': [
      {
        name: `${animalName} Species Complex`,
        emoji: '🦋',
        description: `Diverse ${animalName.toLowerCase()} species facing various conservation challenges across their natural habitats.`,
        population: 'Varies by subspecies',
        status: 'Conservation Dependent'
      }
    ]
  };

  return speciesData[animalName] || speciesData.default;
};

const getConservationUrgency = (animalName: string): string[] => {
  const urgencyData: { [key: string]: string[] } = {
    'Lions': [
      'Population declined 43% over 21 years - tipping point approaching rapidly',
      'Human-wildlife conflict escalating as agricultural expansion continues into wildlife corridors',
      'Climate change reducing prey availability and water sources across traditional territories',
      'Only 8% of historic range remains - fragmented populations face genetic isolation risks',
      'Retaliatory killings increasing as communities lose livestock to predation pressure'
    ],
    'Elephants': [
      'African elephant populations crashed 60% in last decade due to intensified poaching pressure',
      'One elephant killed every 25 minutes for ivory - organized crime networks expanding operations',
      'Critical habitat shrinking by 4% annually due to agricultural conversion and infrastructure development',
      'Human-elephant conflict incidents doubled since 2020 as animals seek water during drought periods',
      'Tourism exploitation in Asia causing severe psychological trauma and welfare degradation'
    ],
    'Sea Turtles': [
      'Climate change causing 90% female hatchling rates - population sex ratios becoming unsustainable',
      'Plastic pollution increased 67% since 2020 - microplastics now found in 100% of studied populations',
      'Critical nesting beaches disappearing to coastal development and sea level rise acceleration',
      'Commercial fishing bycatch mortality exceeds 200,000 turtles annually in Pacific alone',
      'Light pollution disrupting nesting behavior on 80% of historically important beaches'
    ],
    'Orangutans': [
      'Bornean populations declined 50% in one generation - genetic diversity critically compromised',
      'Palm oil expansion cleared 6 million hectares of habitat since 2020 - deforestation accelerating',
      'Forest fires becoming annual catastrophes, destroying rehabilitation efforts and wild populations',
      'Only 25 years left before Sumatran orangutans face functional extinction without intervention',
      'Fragmented populations below viable breeding thresholds - genetic rescue needed urgently'
    ],
    'default': [
      `${animalName} populations facing unprecedented pressure from accelerating human development`,
      'Climate change impacts intensifying faster than adaptation strategies can be implemented',
      'Habitat fragmentation reaching critical thresholds for species survival in many regions',
      'Conservation funding gaps widening as protection needs increase exponentially',
      'Window for effective intervention narrowing rapidly as ecosystem tipping points approach'
    ]
  };

  return urgencyData[animalName] || urgencyData.default;
};

const getPositiveTrends = (animalName: string): string[] => {
  const positiveData: { [key: string]: string[] } = {
    'Lions': [
      'Community conservancies in Kenya showing 15% population growth over 5 years',
      'Anti-poaching technology reducing illegal hunting by 60% in monitored areas',
      'Tourism revenue sharing creating economic incentives for wildlife protection',
      'Successful corridor establishment connecting 85% of key protected areas',
      'Compensation programs reducing retaliatory killings by 70% in pilot regions'
    ],
    'Elephants': [
      'Sanctuary rehabilitation programs achieving 85% success rates for rescued elephants',
      'Community-based conservation providing sustainable livelihoods for 5,000+ families',
      'Advanced anti-poaching techniques reducing ivory trafficking by 40% since 2022',
      'Habitat restoration projects expanding protected areas by 15% annually',
      'Ethical tourism alternatives generating $50M+ annually for elephant welfare'
    ],
    'Sea Turtles': [
      'Protected nesting sites showing 25% population increase over last decade',
      'Marine plastic cleanup initiatives removing 100+ tons annually from critical habitats',
      'Fishing industry adoption of turtle-excluder devices reducing bycatch by 85%',
      'Community engagement programs training 2,000+ local conservationists annually',
      'Satellite tracking revealing new migration routes enabling targeted protection'
    ],
    'Orangutans': [
      'Rehabilitation centers successfully reintroducing 150+ orangutans annually to protected forests',
      'Community reforestation programs restoring 10,000+ hectares of degraded habitat yearly',
      'Sustainable palm oil certification increasing to 40% of global production',
      'Alternative livelihood programs reducing local deforestation pressure by 30%',
      'Advanced monitoring technology detecting and preventing 90% of illegal logging attempts'
    ],
    'default': [
      `Growing global awareness driving increased funding for ${animalName.toLowerCase()} conservation`,
      'Innovative technology solutions enabling more effective protection and monitoring',
      'Community-based conservation models proving sustainable and economically viable',
      'International cooperation strengthening through wildlife protection agreements',
      'Young conservationists worldwide mobilizing unprecedented support for species protection'
    ]
  };

  return positiveData[animalName] || positiveData.default;
};

// Geographic Decision Framework Helper Function

const getGeographicFocus = (continent: string, animalName: string): {
  focus: string;
  dailyLife: string[];
  bestFor: string[];
  advantage: string;
} => {
  const geographicData: {
    [key: string]: {
      [key: string]: {
        focus: string;
        dailyLife: string[];
        bestFor: string[];
        advantage: string;
      }
    }
  } = {
    'Africa': {
      'Lions': {
        focus: 'Community-based conservation in natural pride territories, monitoring wild behavior and human-wildlife coexistence in traditional landscapes.',
        dailyLife: [
          'Dawn wildlife tracking sessions in open savanna',
          'Community meetings with Maasai conservation partners',
          'Camera trap monitoring and data collection',
          'Evening pride behavior observation sessions',
          'Traditional cultural exchange activities'
        ],
        bestFor: ['Wildlife photographers', 'Cultural enthusiasts', 'Field researchers', 'Adventure seekers'],
        advantage: 'Experience lions in their ancestral homeland with authentic community partnerships spanning generations'
      },
      'Elephants': {
        focus: 'Anti-poaching surveillance and corridor protection, working with ranger teams to secure migration routes and water sources.',
        dailyLife: [
          'Early morning elephant herd tracking expeditions',
          'Anti-poaching patrol support activities',
          'Community education program assistance',
          'Water point monitoring and maintenance',
          'Traditional ecological knowledge documentation'
        ],
        bestFor: ['Conservation activists', 'Adventure travelers', 'Community workers', 'Wildlife advocates'],
        advantage: 'Witness the great migration patterns and engage with communities who have coexisted with elephants for millennia'
      },
      'Sea Turtles': {
        focus: 'Coastal community partnerships for nesting beach protection, combining traditional knowledge with modern conservation science.',
        dailyLife: [
          'Sunset beach patrols for nesting females',
          'Community fisher education programs',
          'Nest monitoring and protection setup',
          'Marine debris cleanup initiatives',
          'Local conservation group collaboration'
        ],
        bestFor: ['Marine enthusiasts', 'Beach lovers', 'Community workers', 'Education advocates'],
        advantage: 'Work with fishing communities who have protected these beaches for generations'
      },
      'default': {
        focus: `Traditional conservation approaches combining ancestral knowledge with modern science in ${animalName.toLowerCase()} protection.`,
        dailyLife: [
          'Community-based wildlife monitoring',
          'Traditional conservation practice learning',
          'Field research data collection',
          'Cultural exchange activities',
          'Local partnership development'
        ],
        bestFor: ['Cultural learners', 'Field researchers', 'Adventure seekers', 'Community workers'],
        advantage: `Experience ${animalName.toLowerCase()} conservation in their natural African context with authentic community partnerships`
      }
    },
    'Asia': {
      'Elephants': {
        focus: 'Sanctuary rehabilitation and ethical tourism development, focusing on individual elephant welfare and mahout tradition preservation.',
        dailyLife: [
          'Individual elephant care and enrichment',
          'Behavioral assessment and wellness monitoring',
          'Mahout cultural tradition documentation',
          'Sanctuary facility maintenance and improvement',
          'Tourist education program development'
        ],
        bestFor: ['Animal welfare advocates', 'Hands-on caregivers', 'Cultural preservationists', 'Sanctuary supporters'],
        advantage: 'One-on-one relationships with individual elephants and direct welfare impact you can see daily'
      },
      'Orangutans': {
        focus: 'Rainforest rehabilitation centers and reintroduction programs, combined with community reforestation and sustainable development.',
        dailyLife: [
          'Individual orangutan care and enrichment',
          'Forest skills training for rehabilitation',
          'Reforestation planting activities',
          'Community education outreach',
          'Sustainable livelihood program support'
        ],
        bestFor: ['Primate enthusiasts', 'Forest conservationists', 'Rehabilitation specialists', 'Sustainable development advocates'],
        advantage: 'Witness orangutan personalities develop and contribute to successful reintroduction stories'
      },
      'Sea Turtles': {
        focus: 'Marine rehabilitation centers and coastal community education, emphasizing individual turtle recovery and release programs.',
        dailyLife: [
          'Individual turtle medical care',
          'Recovery monitoring and therapy',
          'Release preparation activities',
          'Community education workshops',
          'Marine plastic reduction campaigns'
        ],
        bestFor: ['Marine animal caregivers', 'Rehabilitation enthusiasts', 'Medical volunteers', 'Education advocates'],
        advantage: 'Follow individual turtle recovery journeys from rescue to successful ocean release'
      },
      'default': {
        focus: `Sanctuary-based rehabilitation programs focusing on individual ${animalName.toLowerCase()} welfare and community cultural preservation.`,
        dailyLife: [
          'Individual animal care and monitoring',
          'Rehabilitation program support',
          'Cultural tradition preservation',
          'Community education activities',
          'Sustainable development projects'
        ],
        bestFor: ['Animal caregivers', 'Rehabilitation workers', 'Cultural enthusiasts', 'Welfare advocates'],
        advantage: `Direct hands-on care with individual ${animalName.toLowerCase()} and measurable welfare improvements`
      }
    },
    'Americas': {
      'Sea Turtles': {
        focus: 'Advanced research methodologies and marine ecosystem protection, utilizing cutting-edge technology for conservation science.',
        dailyLife: [
          'Satellite tagging and tracking procedures',
          'Marine ecosystem health assessments',
          'Climate change impact research',
          'Advanced nesting success analysis',
          'Citizen science data collection training'
        ],
        bestFor: ['Research enthusiasts', 'Tech advocates', 'Data scientists', 'Marine biologists'],
        advantage: 'Access to cutting-edge research technology and contribute to global conservation databases'
      },
      'Jaguars': {
        focus: 'Rainforest corridor protection and camera trap research, focusing on habitat connectivity and prey species monitoring.',
        dailyLife: [
          'Camera trap installation and monitoring',
          'Rainforest corridor mapping',
          'Prey species population surveys',
          'Indigenous community partnerships',
          'Habitat restoration activities'
        ],
        bestFor: ['Tech researchers', 'Forest enthusiasts', 'Camera trap specialists', 'Habitat restorers'],
        advantage: 'Use advanced tracking technology to study elusive species and protect critical migration corridors'
      },
      'Sloths': {
        focus: 'Rainforest canopy research and wildlife corridor establishment, combining arboreal ecology studies with habitat restoration.',
        dailyLife: [
          'Canopy research and monitoring',
          'Wildlife corridor planning',
          'Tree planting and restoration',
          'Eco-tourism development',
          'Sustainable agriculture education'
        ],
        bestFor: ['Canopy researchers', 'Restoration specialists', 'Eco-tourism advocates', 'Sustainable agriculture supporters'],
        advantage: 'Study unique arboreal ecosystems and contribute to innovative corridor conservation solutions'
      },
      'default': {
        focus: `Research-intensive programs using advanced technology for ${animalName.toLowerCase()} conservation and habitat protection.`,
        dailyLife: [
          'Advanced research data collection',
          'Technology-based monitoring',
          'Habitat restoration activities',
          'Scientific methodology training',
          'Conservation innovation projects'
        ],
        bestFor: ['Research enthusiasts', 'Tech advocates', 'Data collectors', 'Innovation supporters'],
        advantage: `Utilize cutting-edge research methods and contribute to global ${animalName.toLowerCase()} conservation science`
      }
    }
  };

  const continentData = geographicData[continent];
  if (!continentData) {
    return {
      focus: `${continent} offers unique ${animalName.toLowerCase()} conservation opportunities tailored to regional ecosystems.`,
      dailyLife: ['Regional conservation activities', 'Local community engagement', 'Wildlife monitoring', 'Habitat protection'],
      bestFor: ['Conservation enthusiasts', 'Cultural learners', 'Wildlife advocates'],
      advantage: `Experience ${animalName.toLowerCase()} conservation in the unique ${continent} context`
    };
  }

  return continentData[animalName] || continentData.default;
};

// Role Reality & Expectations Helper Function

const getRoleReality = (animalName: string): {
  daily: string;
  reality: string;
  required: string;
  learned: string;
  physical: string;
  emotional: string;
} => {
  const roleData: {
    [key: string]: {
      daily: string;
      reality: string;
      required: string;
      learned: string;
      physical: string;
      emotional: string;
    }
  } = {
    'Lions': {
      daily: 'Morning data entry from camera traps, afternoon GPS collar monitoring, community education workshops, and evening observation sessions. Most time spent on research documentation and community engagement rather than direct lion interaction.',
      reality: '80% of time is data collection and analysis, not hands-on animal contact. Lions are observed from vehicles or hides at safe distances.',
      required: 'Basic fitness for walking 3-5km daily, comfort with spreadsheets and data recording, willingness to work in hot conditions, and respect for safety protocols around dangerous wildlife.',
      learned: 'Wildlife tracking techniques, GPS and camera trap technology, behavioral research methods, community conservation strategies, and cross-cultural communication skills.',
      physical: 'Moderate fitness required - daily walking in heat, early morning starts (5:30 AM), dusty conditions, basic camping comfort, potential altitude challenges.',
      emotional: 'Witnessing human-wildlife conflict, seeing injured or killed lions, frustration with slow conservation progress, isolation in remote areas, cultural adjustment challenges.'
    },
    'Elephants': {
      daily: 'Individual elephant health monitoring, behavioral enrichment activities, facility maintenance, visitor education, and mahout tradition documentation. More hands-on care but still significant administrative work.',
      reality: 'Direct elephant interaction limited to supervised feeding and enrichment. Not riding elephants or unstructured contact - focus on welfare and behavioral observation.',
      required: 'Physical comfort around large animals, basic animal handling knowledge helpful, emotional resilience, attention to detail for health monitoring, teamwork skills.',
      learned: 'Elephant behavior recognition, animal welfare assessment, sanctuary management, traditional mahout practices, ethical tourism principles, and cultural preservation methods.',
      physical: 'Heavy lifting (food preparation), standing for long periods, working in tropical heat and humidity, potential for minor injuries from equipment or facilities.',
      emotional: 'Seeing elephants with trauma histories, dealing with ongoing welfare concerns, occasional aggressive behavior from stressed animals, attachment to individuals you must leave.'
    },
    'Sea Turtles': {
      daily: 'Beach patrols during nesting season, nest monitoring and data collection, hatchery maintenance, marine debris cleanup, and tourist education programs. Night work during peak season.',
      reality: 'Most volunteer time during non-nesting periods involves beach cleanup, data entry, and education rather than turtle interaction. Nesting encounters are rare but magical.',
      required: 'Comfort working at night and in sand, basic swimming ability, attention to detail for data collection, patience for long periods without turtle sightings.',
      learned: 'Marine conservation techniques, nest identification and protection, coastal ecosystem health assessment, community education methods, and marine pollution impact research.',
      physical: 'Night shifts during nesting season, walking on sand for hours, exposure to sun and salt water, lifting turtle protection equipment, working in humid coastal conditions.',
      emotional: 'Witnessing pollution impacts on marine life, finding dead turtles, dealing with poaching evidence, frustration with slow environmental change, seasonal emotional intensity.'
    },
    'Orangutans': {
      daily: 'Forest enrichment preparation, individual orangutan monitoring, reforestation activities, facility maintenance, and rehabilitation progress documentation. Mix of direct care and habitat work.',
      reality: 'Interaction with orangutans is carefully supervised and limited to feeding and enrichment activities. Focus on preparing individuals for forest reintroduction.',
      required: 'Comfort in dense forest environments, respect for safety protocols around primates, basic plant identification helpful, tolerance for insects and tropical conditions.',
      learned: 'Primate behavior assessment, forest ecology and restoration, rehabilitation techniques, sustainable community development, and rainforest conservation strategies.',
      physical: 'Heavy jungle heat and humidity, insect exposure, carrying equipment through dense forest, tree planting activities, uneven terrain walking.',
      emotional: 'Bonding with individual orangutans facing uncertain futures, witnessing deforestation impacts, dealing with rehabilitation setbacks, saying goodbye to reintroduced animals.'
    },
    'default': {
      daily: `Mixed activities including wildlife monitoring, data collection, community education, habitat maintenance, and conservation research support. Balance of fieldwork and administrative tasks.`,
      reality: `Most wildlife conservation work involves indirect animal contact through research and habitat protection rather than hands-on animal interaction.`,
      required: 'Basic physical fitness, willingness to work outdoors, attention to detail, teamwork skills, and cultural sensitivity for community engagement.',
      learned: `${animalName.toLowerCase()} behavior and ecology, conservation research methods, community engagement techniques, environmental monitoring, and cross-cultural collaboration skills.`,
      physical: 'Outdoor work in various weather conditions, walking on uneven terrain, lifting equipment, potential exposure to insects and sun.',
      emotional: 'Witnessing conservation challenges, dealing with wildlife threats, forming connections with animals and people you must leave, adapting to different cultural contexts.'
    }
  };

  return roleData[animalName] || roleData.default;
};

export default AnimalLandingPage;
