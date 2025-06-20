import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Star, Shield, Heart, Leaf } from 'lucide-react';
import { Container, Grid } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import ConservationSection from './ContentHub/ConservationSection';
import ContentHubSEO from './ContentHub/ContentHubSEO';
import RelatedContentSection from './ContentHub/RelatedContentSection';
import OpportunityCard from './OpportunitiesPage/v2/OpportunityCard';
import { opportunities } from '../data/opportunities';
import { animalCategories } from '../data/animals';
import { getContentHub, getAllContentHubs } from '../data/contentHubs';
import { generateAnimalPageSEO, useSEO } from '../utils/seoUtils';
import { generateOpportunityRoute } from '../utils/routeUtils';
import type { Opportunity } from '../types';

interface AnimalLandingPageProps {
  type?: 'animal' | 'conservation';
}

const AnimalLandingPage: React.FC<AnimalLandingPageProps> = ({ type = 'animal' }) => {
  console.log('🦁 DEBUG: AnimalLandingPage component rendering for type:', type);
  const params = useParams();  // Remove type constraint to see all params
  const breadcrumbs = useBreadcrumbs();
  console.log('🦁 DEBUG: AnimalLandingPage params:', params);

  // Extract animal type from URL path (no longer using dynamic parameters)
  const animalSlug = React.useMemo(() => {
    console.log('🦁 DEBUG: Parsing URL for animal:', window.location.pathname);
    
    const pathname = window.location.pathname;
    
    // Parse from explicit animal routes like /lions-volunteer
    if (pathname.includes('-volunteer')) {
      const extracted = pathname.replace('/', '').replace('-volunteer', '');
      console.log('🦁 DEBUG: Extracted animal from URL:', extracted);
      return extracted;
    }
    
    // Parse from conservation routes like /wildlife-conservation
    if (pathname.includes('-conservation')) {
      const extracted = pathname.replace('/', '').replace('-conservation', '');
      console.log('🦁 DEBUG: Extracted conservation category from URL:', extracted);
      return extracted;
    }
    
    console.log('🦁 DEBUG: No animal found in URL');
    return '';
  }, []);

  // Find animal category data
  const animalCategory = React.useMemo(() => {
    return animalCategories.find(animal => 
      animal.id === animalSlug ||
      animal.name.toLowerCase().replace(' ', '-') === animalSlug
    );
  }, [animalSlug]);

  // Get formatted animal name
  const animalName = React.useMemo(() => {
    if (animalCategory) {
      return animalCategory.name;
    }
    
    const animalMap: Record<string, string> = {
      'lions': 'Lions',
      'elephants': 'Elephants', 
      'sea-turtles': 'Sea Turtles',
      'orangutans': 'Orangutans',
      'koalas': 'Koalas',
      'tigers': 'Tigers',
      'pandas': 'Giant Pandas',
      'rhinos': 'Rhinos',
      'whales': 'Whales',
      'dolphins': 'Dolphins',
      'primates': 'Primates',
      'marine': 'Marine Life',
      'birds': 'Birds',
      'reptiles': 'Reptiles',
      'big-cats': 'Big Cats'
    };
    
    return animalMap[animalSlug] || animalSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, [animalSlug, animalCategory]);

  // Filter opportunities by animal type
  const animalOpportunities = React.useMemo(() => {
    const filtered = opportunities.filter(opp => 
      opp.animalTypes.some(type => {
        const normalizedType = type.toLowerCase();
        const normalizedAnimal = animalName.toLowerCase();
        
        // Direct match
        if (normalizedType === normalizedAnimal) return true;
        
        // Partial matches for related terms
        if (animalSlug === 'lions' && (normalizedType.includes('lion') || normalizedType.includes('big cat'))) return true;
        if (animalSlug === 'elephants' && normalizedType.includes('elephant')) return true;
        if (animalSlug === 'sea-turtles' && (normalizedType.includes('turtle') || normalizedType.includes('marine'))) return true;
        if (animalSlug === 'orangutans' && (normalizedType.includes('orangutan') || normalizedType.includes('primate'))) return true;
        if (animalSlug === 'primates' && normalizedType.includes('primate')) return true;
        if (animalSlug === 'marine' && normalizedType.includes('marine')) return true;
        if (animalSlug === 'big-cats' && (normalizedType.includes('lion') || normalizedType.includes('leopard') || normalizedType.includes('cheetah') || normalizedType.includes('cat'))) return true;
        
        return false;
      })
    );
    
    return filtered;
  }, [animalSlug, animalName]);

  // Get content hub data for conservation information
  const contentHub = React.useMemo(() => {
    return getContentHub(animalSlug);
  }, [animalSlug]);

  // Get all content hubs for related content
  const allContentHubs = React.useMemo(() => {
    return getAllContentHubs();
  }, []);

  // Get unique countries where this animal type is found
  const availableCountries = React.useMemo(() => {
    const countries = [...new Set(animalOpportunities.map(opp => opp.location.country))];
    return countries.map(country => ({
      name: country,
      slug: country.toLowerCase().replace(' ', '-'),
      count: animalOpportunities.filter(opp => opp.location.country === country).length,
      flag: getCountryFlag(country),
      image: animalOpportunities.find(opp => opp.location.country === country)?.images?.[0]
    }));
  }, [animalOpportunities]);

  // Generate and apply SEO metadata
  const seoMetadata = React.useMemo(() => {
    return generateAnimalPageSEO(animalSlug, animalOpportunities);
  }, [animalSlug, animalOpportunities]);

  useSEO(seoMetadata);

  if (!animalSlug) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="py-16 text-center">
          <h1 className="text-hero text-deep-forest mb-4">No Programs Found</h1>
          <p className="text-body text-forest/80 mb-8">
            We don't have any volunteer opportunities for this animal type yet.
          </p>
          <Link 
            to="/opportunities" 
            className="inline-flex items-center px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors"
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
      {/* SEO Enhancement */}
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
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-deep-forest"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 46, 26, 0.85), rgba(26, 46, 26, 0.85)), url(${animalCategory?.image || animalOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop'})`
        }}
      >
        <Container className="py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="text-6xl mb-4">{getAnimalEmoji(animalName)}</div>
            <h1 className="text-hero text-white mb-6">
              {animalName} Conservation Volunteer Programs
            </h1>
            <p className="text-body-large text-white/90 mb-8">
              {animalCategory?.description || `Join ${animalOpportunities.length} conservation programs dedicated to protecting ${animalName.toLowerCase()} and their natural habitats. Make a lasting impact on endangered species conservation.`}
            </p>
            
            {/* Conservation Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center text-white/90">
                <Shield className="w-5 h-5 mr-2" />
                <span>{animalOpportunities.length} Programs</span>
              </div>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{availableCountries.length} Countries</span>
              </div>
              <div className="flex items-center text-white/90">
                <Heart className="w-5 h-5 mr-2" />
                <span>{animalCategory?.volunteers || '2000+'} Volunteers</span>
              </div>
            </div>

            {/* Conservation Status Badge */}
            {animalCategory && (
              <div className="inline-flex items-center bg-warm-sunset/20 text-warm-sunset px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4 mr-2" />
                Conservation Priority Species
              </div>
            )}
          </motion.div>
        </Container>
      </div>

      {/* Conservation Section */}
      {contentHub && (
        <ConservationSection 
          content={contentHub.conservation}
          className="bg-soft-cream"
        />
      )}

      <Container className="py-12">
        {/* Countries Section */}
        {availableCountries.length > 1 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-section text-deep-forest mb-4">
                Where to Find {animalName}
              </h2>
              <p className="text-body text-forest/80 max-w-2xl mx-auto">
                Explore {animalName.toLowerCase()} conservation programs across different countries and regions
              </p>
            </motion.div>

            <Grid variant="auto" gap="lg">
              {availableCountries.map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <Link to={`/${animalSlug}-volunteer/${country.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center relative"
                        style={{ 
                          backgroundImage: `url(${country.image || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'})` 
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-2xl mb-1">{country.flag}</div>
                          <h3 className="text-xl font-semibold">{country.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 text-deep-forest px-2 py-1 rounded-full text-sm font-medium">
                          {country.count} programs
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        <p className="text-forest/80 mb-4">
                          Discover {animalName.toLowerCase()} conservation opportunities in {country.name}
                        </p>
                        <div className="flex items-center justify-between text-sm text-forest/60">
                          <span>View Programs</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </Grid>
          </section>
        )}

        {/* All Opportunities Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-section text-deep-forest mb-4">
              All {animalName} Conservation Programs
            </h2>
            <p className="text-body text-forest/80 max-w-2xl mx-auto">
              Browse all available volunteer opportunities focused on {animalName.toLowerCase()} conservation and protection
            </p>
          </motion.div>

          <Grid variant="auto" gap="lg">
            {animalOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <OpportunityCard opportunity={opportunity} index={index} />
              </motion.div>
            ))}
          </Grid>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center bg-warm-beige rounded-2xl p-12"
        >
          <div className="text-4xl mb-4">{getAnimalEmoji(animalName)}</div>
          <h2 className="text-section text-deep-forest mb-4">
            Help Protect {animalName} Today
          </h2>
          <p className="text-body text-forest/80 mb-8 max-w-2xl mx-auto">
            Every volunteer makes a difference in the fight to save endangered species. 
            Join a community of conservation heroes working to protect {animalName.toLowerCase()} for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`#${animalOpportunities[0]?.id || ''}`}
              className="inline-flex items-center px-8 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              Start Application
              <Heart className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              to="/opportunities" 
              className="inline-flex items-center px-8 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              Explore Other Wildlife
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.section>
      </Container>

      {/* Related Content Section */}
      {contentHub && allContentHubs.length > 1 && (
        <RelatedContentSection 
          currentHub={contentHub}
          allHubs={allContentHubs}
          className="bg-warm-beige/20"
        />
      )}
    </div>
  );
};


// Helper function for country flags
const getCountryFlag = (country: string): string => {
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
  return flags[country] || '🌍';
};

export default AnimalLandingPage;