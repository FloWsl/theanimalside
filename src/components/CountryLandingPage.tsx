import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { Container, Grid } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { opportunities } from '../data/opportunities';
import { animalCategories } from '../data/animals';
import { generateCountryPageSEO, useSEO } from '../utils/seoUtils';
import { generateOpportunityRoute } from '../utils/routeUtils';
import type { Opportunity } from '../types';

const CountryLandingPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const breadcrumbs = useBreadcrumbs();

  // Parse country from URL parameter (e.g., "costa-rica" -> "Costa Rica")
  const countryName = React.useMemo(() => {
    if (!country) return '';
    const countryMap: Record<string, string> = {
      'costa-rica': 'Costa Rica',
      'south-africa': 'South Africa',
      'thailand': 'Thailand',
      'australia': 'Australia',
      'indonesia': 'Indonesia',
      'kenya': 'Kenya',
      'ecuador': 'Ecuador',
      'peru': 'Peru',
      'brazil': 'Brazil',
      'india': 'India'
    };
    return countryMap[country] || country.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, [country]);

  // Filter opportunities by country
  const countryOpportunities = React.useMemo(() => {
    return opportunities.filter(opp => opp.location.country === countryName);
  }, [countryName]);

  // Get unique animal types available in this country
  const availableAnimals = React.useMemo(() => {
    const animalTypes = [...new Set(countryOpportunities.flatMap(opp => opp.animalTypes))];
    return animalCategories.filter(animal => 
      animalTypes.some(type => 
        type.toLowerCase().includes(animal.id.replace('-', ' ')) ||
        animal.name.toLowerCase().includes(type.toLowerCase().split(' ')[0])
      )
    );
  }, [countryOpportunities]);

  // Generate and apply SEO metadata
  const seoMetadata = React.useMemo(() => {
    return generateCountryPageSEO(country || '', countryOpportunities);
  }, [country, countryOpportunities]);

  useSEO(seoMetadata);

  if (!country || countryOpportunities.length === 0) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="py-16 text-center">
          <h1 className="text-hero text-deep-forest mb-4">Country Not Found</h1>
          <p className="text-body text-forest/80 mb-8">
            We don't have any volunteer opportunities in this location yet.
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
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-deep-forest"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 46, 26, 0.85), rgba(26, 46, 26, 0.85)), url(${countryOpportunities[0]?.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop'})`
        }}
      >
        <Container className="py-16 lg:py-24">
          <Breadcrumb items={breadcrumbs} className="mb-8 text-white/80" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="text-6xl mb-4">{getCountryFlag(countryName)}</div>
            <h1 className="text-hero text-white mb-6">
              Wildlife Volunteer Opportunities in {countryName}
            </h1>
            <p className="text-body-large text-white/90 mb-8">
              Discover {countryOpportunities.length} conservation programs working to protect wildlife and their habitats. 
              Join hands-on efforts that make a real difference for endangered species.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center text-white/90">
                <Users className="w-5 h-5 mr-2" />
                <span>{countryOpportunities.length} Programs</span>
              </div>
              <div className="flex items-center text-white/90">
                <Star className="w-5 h-5 mr-2" />
                <span>{availableAnimals.length} Animal Types</span>
              </div>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{[...new Set(countryOpportunities.map(opp => opp.location.city))].length} Locations</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Animal Categories Section */}
        {availableAnimals.length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-section text-deep-forest mb-4">
                Conservation Focus Areas
              </h2>
              <p className="text-body text-forest/80 max-w-2xl mx-auto">
                Choose your conservation focus and explore specialized programs in {countryName}
              </p>
            </motion.div>

            <Grid variant="auto" gap="lg">
              {availableAnimals.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <Link to={`/volunteer-${country}/${animal.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${animal.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-2xl mb-1">{animal.name === 'Lions' ? '🦁' : animal.name === 'Elephants' ? '🐘' : animal.name === 'Sea Turtles' ? '🐢' : animal.name === 'Orangutans' ? '🦧' : '🐨'}</div>
                          <h3 className="text-xl font-semibold">{animal.name}</h3>
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        <p className="text-forest/80 mb-4 line-clamp-2">
                          {animal.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-forest/60">
                          <span>{animal.projects} programs worldwide</span>
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
              All Programs in {countryName}
            </h2>
            <p className="text-body text-forest/80 max-w-2xl mx-auto">
              Browse all available volunteer opportunities and find the perfect conservation mission for you
            </p>
          </motion.div>

          <Grid variant="auto" gap="lg">
            {countryOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <OpportunityCard opportunity={opportunity} />
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
          <h2 className="text-section text-deep-forest mb-4">
            Ready to Start Your Conservation Journey?
          </h2>
          <p className="text-body text-forest/80 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers who have made a meaningful impact on wildlife conservation in {countryName}. 
            Your adventure in protecting endangered species starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/opportunities" 
              className="inline-flex items-center px-8 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              Browse All Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              to="/" 
              className="inline-flex items-center px-8 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              Learn More About Conservation
            </Link>
          </div>
        </motion.section>
      </Container>
    </div>
  );
};

// Opportunity Card Component
const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const opportunityRoute = generateOpportunityRoute(opportunity);
  
  return (
    <Link to={opportunityRoute}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
      <div 
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${opportunity.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          {opportunity.featured && (
            <div className="flex items-center bg-golden-hour/90 text-deep-forest px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{opportunity.location.city}</span>
          </div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-deep-forest group-hover:text-rich-earth transition-colors">
          {opportunity.title}
        </CardTitle>
        <CardDescription>
          {opportunity.organization}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-forest/80 mb-4 line-clamp-3">
          {opportunity.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.animalTypes.slice(0, 3).map((animal, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-sage-green/20 text-sage-green text-xs rounded-full"
            >
              {animal}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-forest/60">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{opportunity.duration.min}-{opportunity.duration.max || '+'} weeks</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">
              {opportunity.cost.amount === 0 ? 'Free' : `$${opportunity.cost.amount}`}
            </span>
            {opportunity.cost.amount > 0 && <span>/{opportunity.cost.period}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default CountryLandingPage;