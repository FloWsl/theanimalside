import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Leaf, Shield } from 'lucide-react';
import { Container } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import ConservationSection from './ContentHub/ConservationSection';
import CulturalContextSection from './ContentHub/CulturalContextSection';
import RegionalWildlifeSection from './ContentHub/RegionalWildlifeSection';
import ContentHubSEO from './ContentHub/ContentHubSEO';
import OpportunityCard from './OpportunitiesPage/v2/OpportunityCard';
import SEOInternalLinks from './shared/SEOInternalLinks';
import { generateCountryPageSEO, useSEO } from '../utils/seoUtils';
import { useCountryData } from '../hooks/useCountryData';

const CountryLandingPage: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();

  // Utility function to scroll to top on navigation
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract country from URL path - now reactive to route changes
  const countrySlug = React.useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/volunteer-')) {
      const extracted = pathname.replace('/volunteer-', '');
      return extracted;
    }
    return '';
  }, [location.pathname]);

  // Scroll to top when country page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [countrySlug]);

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

      {/* 🏆 SIMPLIFIED HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-deep-forest to-rich-earth">
        {/* Simple Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${countryOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1502780402662-acc01917cf4b?w=1200&h=800&fit=crop&q=80'})`
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Clean Title */}
            <div className="mb-6">
              <span className="text-6xl mb-4 block">{getCountryFlag(countryName)}</span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Wildlife Conservation in {countryName}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover wildlife conservation across {availableAnimals.length} species and {countryOpportunities.length} programs in {countryName}.
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
        </Container>
      </section>

      <Container className="py-24">
        {/* WILDLIFE PROGRAMS - Complete Program Catalog */}
        <section id="wildlife-programs" className="mb-20">
          <div className="text-center mb-16">
            {/* Enhanced badge with gradient and better styling */}
            <div className="bg-gradient-to-r from-rich-earth/20 via-white/80 to-rich-earth/20 backdrop-blur-sm border border-rich-earth/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📋</span>
                </div>
                <span className="text-rich-earth font-black text-lg tracking-wide">Wildlife Conservation Programs</span>
              </div>
            </div>

            {/* Enhanced title with gradient text */}
            <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
              <span className="block">{countryName} Conservation</span>
              <span className="block bg-gradient-to-r from-rich-earth via-warm-sunset to-golden-hour bg-clip-text text-transparent">
                Programs
              </span>
            </h2>

            {/* Enhanced description with visual hierarchy */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                Explore {countryOpportunities.length} verified wildlife conservation programs in {countryName}.
              </p>
              <p className="text-base text-rich-earth font-semibold">
                Each program offers authentic conservation impact and meaningful volunteer experiences.
              </p>
            </div>
          </div>

          {/* Program Grid - Real Opportunity Cards */}
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {countryOpportunities.map((opportunity, index) => (
              <div key={opportunity.id} className="card-nature-hover overflow-hidden transition-all duration-500 group">
                <OpportunityCard
                  opportunity={opportunity}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* CTA to View All */}
          {countryOpportunities.length > 0 && (
            <div className="text-center mt-16">
              <Link
                to="/opportunities"
                className="bg-sage-green hover:bg-sage-green/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
              >
                <span className="font-semibold">Compare Programs Worldwide</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </section>
      </Container>

      <section className="py-24 bg-gradient-to-br from-soft-cream via-warm-beige/50 to-gentle-lemon/20">
        <div className="container-nature">
          {/* CONSERVATION AREAS - Consolidated Animal Focus Areas */}
          <div id="conservation-areas" className="mb-20">
            <div className="text-center mb-16">
              {/* Enhanced badge with gradient and better styling */}
              <div className="bg-gradient-to-r from-sage-green/20 via-white/80 to-sage-green/20 backdrop-blur-sm border border-sage-green/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sage-green to-deep-forest rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🌿</span>
                  </div>
                  <span className="text-sage-green font-black text-lg tracking-wide">Conservation Focus Areas</span>
                </div>
              </div>

              {/* Enhanced title with gradient text */}
              <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
                <span className="block">{countryName}'s Wildlife</span>
                <span className="block bg-gradient-to-r from-sage-green via-rich-earth to-warm-sunset bg-clip-text text-transparent">
                  Conservation Ecosystem
                </span>
              </h2>

              {/* Enhanced description with visual hierarchy */}
              <div className="max-w-4xl mx-auto">
                <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                  From pristine coastlines to cloud forests, {countryName} hosts diverse conservation efforts across multiple ecosystems.
                </p>
                <p className="text-base text-rich-earth font-semibold">
                  Explore different focus areas where wildlife protection creates lasting impact.
                </p>
              </div>
            </div>

            {/* Conservation Focus Areas Grid - Award-Winning Design */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {availableAnimals.map((animal, index) => {
                const animalOpportunities = countryOpportunities.filter(opp =>
                  opp.animalTypes.some(type =>
                    type.toLowerCase().includes(animal.name.toLowerCase().split(' ')[0])
                  )
                );

                const colors = [
                  { gradient: 'from-sage-green to-deep-forest', accent: 'sage-green', bg: 'sage-green/10' },
                  { gradient: 'from-golden-hour to-warm-sunset', accent: 'golden-hour', bg: 'golden-hour/10' },
                  { gradient: 'from-rich-earth to-warm-sunset', accent: 'rich-earth', bg: 'rich-earth/10' }
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <Link
                    key={animal.id}
                    to={`/volunteer-${countrySlug}/${animal.id}`}
                    onClick={handleNavigation}
                    className="group block"
                  >
                    <div className="relative h-[360px] rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-all duration-500 shadow-lg">
                      {/* Background Cover Image */}
                      <div className="absolute inset-0">
                        <img
                          src={animal.image}
                          alt={`${animal.name} conservation`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-black/10 transition-all duration-300"></div>
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Top Section - Programs Badge */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-3 py-2">
                              <span className="text-white text-sm font-medium drop-shadow-md">
                                {animalOpportunities.length} Programs
                              </span>
                            </div>
                            <div className={`w-10 h-10 bg-gradient-to-br ${colorScheme.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                              <span className="text-white text-lg filter drop-shadow-lg">
                                {animal.name === 'Lions' ? '🦁' :
                                  animal.name === 'Elephants' ? '🐘' :
                                    animal.name === 'Sea Turtles' ? '🐢' :
                                      animal.name === 'Orangutans' ? '🦧' :
                                        animal.name === 'Koalas' ? '🐨' : '🐾'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Spacer to push content to bottom */}
                        <div className="flex-1"></div>

                        {/* Bottom Section - Main Content */}
                        <div className="p-4">
                          <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-xl p-4 group-hover:bg-white/25 transition-all duration-300">
                            {/* Title */}
                            <div className="mb-3">
                              <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">{animal.name} Conservation</h3>
                              <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                                {animal.name === 'Sea Turtles' ? 'Marine & Coastal Protection' :
                                  animal.name === 'Orangutans' ? 'Rainforest & Primate Research' :
                                    animal.name === 'Elephants' ? 'Wildlife Sanctuary & Habitat' :
                                      `${animal.name} Research & Protection`}
                              </p>
                            </div>

                            {/* Key Info - Compact */}
                            <div className="space-y-2 mb-3">
                              <p className="text-white/90 text-sm leading-relaxed">
                                Hands-on {animal.name.toLowerCase()} research & habitat protection across {countryName}'s ecosystems.
                              </p>

                              {animalOpportunities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {[...new Set(animalOpportunities.map(opp => opp.location.city))].slice(0, 2).map((city, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white/20 text-white text-sm rounded-full">
                                      {city}
                                    </span>
                                  ))}
                                  {animalOpportunities.length > 2 && (
                                    <span className="px-2 py-1 bg-white/20 text-white text-sm rounded-full">
                                      +{animalOpportunities.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Call to Action */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/20">
                              <span className="text-white font-medium text-sm">Explore Programs</span>
                              <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Why These Programs Excel - Inspired by animal page */}
            <div className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-black text-deep-forest mb-8 text-center">
                🌟 Why {countryName} Programs Excel
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-sage-green to-deep-forest rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-deep-forest text-lg">Verified Impact</h4>
                  <p className="text-base text-forest/80">All programs verified for legitimate conservation outcomes in {countryName}</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-warm-sunset to-golden-hour rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-deep-forest text-lg">Local Partnership</h4>
                  <p className="text-base text-forest/80">Deep partnerships with {countryName} communities and scientists</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-deep-forest text-lg">Biodiversity Focus</h4>
                  <p className="text-base text-forest/80">Science-based approaches across {countryName}'s unique ecosystems</p>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Programs */}
            <div className="text-center">
              <button
                onClick={() => document.getElementById('wildlife-programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-sage-green hover:bg-sage-green/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
              >
                View All {countryOpportunities.length} Programs
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONSERVATION EXPERTISE SECTION - Compact */}
      <section className="py-16 bg-gradient-to-br from-deep-forest via-rich-earth to-warm-sunset">
        <div className="container-nature">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              {/* Enhanced badge with gradient and better styling */}
              <div className="bg-gradient-to-r from-white/30 via-white/20 to-white/30 backdrop-blur-md border border-white/40 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-golden-hour to-warm-sunset rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🌿</span>
                  </div>
                  <span className="text-white font-black text-lg tracking-wide drop-shadow-md">Conservation Expertise & Impact</span>
                </div>
              </div>

              {/* Enhanced title with gradient text effect */}
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                <span className="block">{countryName} Conservation Context</span>
                <span className="block bg-gradient-to-r from-golden-hour via-warm-sunset to-sage-green bg-clip-text text-transparent drop-shadow-none">
                  & Volunteer Impact
                </span>
              </h2>

              {/* Enhanced description with visual hierarchy */}
              <div className="max-w-4xl mx-auto">
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed mb-4 drop-shadow-sm">
                  Understand the conservation landscape, cultural context, and your role in protecting {countryName}'s biodiversity.
                </p>
                <p className="text-base text-golden-hour font-semibold drop-shadow-sm">
                  Discover how your volunteer work creates lasting conservation impact.
                </p>
              </div>
            </div>

            {/* Content Sections - Compact Layout */}
            {contentHub && (
              <div className="space-y-6">
                {/* Conservation Overview */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <ConservationSection
                    content={contentHub.conservation}
                    className="text-white"
                  />
                </div>

                {/* Regional Wildlife */}
                {contentHub.keySpecies && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                    <RegionalWildlifeSection
                      keySpecies={contentHub.keySpecies}
                      countryName={countryName}
                      className="text-white"
                    />
                  </div>
                )}

                {/* Cultural Context */}
                {contentHub.culturalContext && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                    <CulturalContextSection
                      culturalContext={contentHub.culturalContext}
                      countryName={countryName}
                      className="text-white"
                    />
                  </div>
                )}

                {/* Volunteer Impact */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <Leaf className="w-6 h-6 text-golden-hour mr-3" />
                    <h3 className="text-xl font-bold text-white">Your Impact as a Wildlife Volunteer</h3>
                  </div>

                  <p className="text-white/90 mb-6 leading-relaxed">
                    {contentHub.conservation.solution}
                  </p>

                  <p className="text-white/90 mb-6 leading-relaxed">
                    <strong className="text-golden-hour">Unlike eco-tourism:</strong> You contribute meaningful work to conservation research and animal care, not just observation. Programs offer flexible {Math.min(...countryOpportunities.map(o => o.duration?.min || 4))}-{Math.max(...countryOpportunities.map(o => o.duration?.max || 24))} week commitments.
                  </p>

                  <div>
                    <h4 className="text-subtitle font-semibold text-white mb-3">Real Impact Outcomes:</h4>
                    <p className="text-white/80 mb-4">{contentHub.conservation.impact}</p>

                    <ul className="space-y-2 text-white/80">
                      <li>• Professional development in conservation methodologies</li>
                      <li>• Cultural immersion with conservation communities</li>
                      <li>• Hands-on field experience with modern technology</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Planning Your Conservation Volunteer Experience */}
      <section className="py-24 bg-gradient-to-br from-gentle-lemon/20 via-soft-cream to-warm-beige/50">
        <div className="container-nature">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              {/* Enhanced badge with gradient and better styling */}
              <div className="bg-gradient-to-r from-warm-sunset/20 via-white/80 to-warm-sunset/20 backdrop-blur-sm border border-warm-sunset/30 rounded-2xl inline-block px-8 py-4 mb-8 shadow-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-warm-sunset to-golden-hour rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🗺️</span>
                  </div>
                  <span className="text-warm-sunset font-black text-lg tracking-wide">Planning Your Adventure</span>
                </div>
              </div>

              {/* Enhanced title with gradient text */}
              <h2 className="text-3xl lg:text-5xl font-black text-deep-forest mb-6 leading-tight">
                <span className="block">Planning Your Wildlife Conservation</span>
                <span className="block bg-gradient-to-r from-warm-sunset via-golden-hour to-rich-earth bg-clip-text text-transparent">
                  Volunteer Trip to {countryName}
                </span>
              </h2>

              {/* Enhanced description with visual hierarchy */}
              <div className="max-w-4xl mx-auto">
                <p className="text-lg lg:text-xl text-forest/80 leading-relaxed mb-4">
                  Everything you need to know about volunteering with wildlife conservation programs in {countryName}.
                </p>
                <p className="text-base text-warm-sunset font-semibold">
                  From practical logistics to cultural preparation - your complete guide.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Practical Information */}
              <div className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8 hover:bg-white/80 transition-all duration-300">
                <h3 className="text-lg font-bold text-deep-forest mb-6">Essential Planning Information</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Best Time to Volunteer</h4>
                    <p className="text-sm text-forest/80">
                      {countrySlug === 'costa-rica' ?
                        'Costa Rica offers year-round volunteering opportunities. Dry season (December-April) is ideal for wildlife observation, while green season (May-November) offers lush landscapes and sea turtle nesting season.' :
                        `${countryName} conservation programs operate year-round, with optimal wildlife observation periods varying by species and region. Contact programs directly for seasonal recommendations.`}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Visa Requirements</h4>
                    <p className="text-sm text-forest/80">
                      Most volunteers can enter {countryName} on a tourist visa for short-term conservation programs. Longer commitments may require specific volunteer visas. Check current requirements with {countryName} consulates.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Health & Safety</h4>
                    <p className="text-sm text-forest/80">
                      Conservation work in {countryName} is generally safe with proper precautions. Recommended vaccinations and health insurance requirements vary by program and region.
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8 hover:bg-white/80 transition-all duration-300">
                <h3 className="text-lg font-bold text-deep-forest mb-6">What to Expect</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Daily Activities</h4>
                    <p className="text-sm text-forest/80 mb-3">
                      Wildlife conservation volunteers typically engage in field research, data collection, habitat maintenance, and educational activities. Work schedules vary by program and species.
                    </p>
                    <ul className="text-sm text-forest/70 space-y-1">
                      <li>• Early morning wildlife monitoring</li>
                      <li>• Data recording and analysis</li>
                      <li>• Habitat restoration activities</li>
                      <li>• Community outreach programs</li>
                      <li>• Evening educational sessions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Accommodation & Meals</h4>
                    <p className="text-sm text-forest/80">
                      Most programs provide shared accommodation in research stations, eco-lodges, or homestays. Meals typically feature local cuisine and dietary restrictions can usually be accommodated.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-deep-forest mb-3">Skills Development</h4>
                    <p className="text-sm text-forest/80">
                      Gain valuable experience in wildlife research methodologies, conservation technology, data analysis, and cross-cultural communication while contributing to meaningful conservation outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8 hover:bg-white/80 transition-all duration-300">
              <h3 className="text-2xl font-bold text-deep-forest mb-6">
                Ready to Start Your Conservation Journey in {countryName}?
              </h3>
              <p className="text-base text-forest/80 mb-8 max-w-2xl mx-auto">
                Browse our carefully selected {countryOpportunities.length} conservation programs in {countryName} and find the perfect opportunity to make a meaningful impact on wildlife protection.
              </p>

              <div className="text-center">
                <Link
                  to="/opportunities"
                  onClick={handleNavigation}
                  className="bg-sage-green hover:bg-sage-green/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
                >
                  Explore Other Conservation Destinations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Strategic SEO Internal Links - Cross-Navigation */}
      <SEOInternalLinks
        type="country"
        countryName={countryName}
        countrySlug={countrySlug}
        availableAnimals={availableAnimals}
        opportunities={countryOpportunities}
      />

    </div>
  );
};

export default CountryLandingPage;