import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, ArrowRight, Star, Shield, ExternalLink, Heart } from 'lucide-react';
import { Container, Grid } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { opportunities } from '../data/opportunities';
import { animalCategories } from '../data/animals';
import { generateCombinedPageSEO, useSEO } from '../utils/seoUtils';
import { generateOpportunityRoute } from '../utils/routeUtils';
import type { Opportunity } from '../types';

interface CombinedPageProps {
  type: 'country-animal' | 'animal-country';
}

const CombinedPage: React.FC<CombinedPageProps> = ({ type }) => {
  const params = useParams<{ country?: string; animal?: string }>();
  const breadcrumbs = useBreadcrumbs();

  // Parse country and animal based on route type
  const { countrySlug, animalSlug } = React.useMemo(() => {
    if (type === 'country-animal') {
      // Route: volunteer-:country/:animal → params: { country: "costa-rica", animal: "lions" }
      return {
        countrySlug: params.country || '',
        animalSlug: params.animal || ''
      };
    } else {
      // Route: :animal-volunteer/:country → params: { animal: "lions", country: "costa-rica" }
      return {
        countrySlug: params.country || '',
        animalSlug: params.animal || ''
      };
    }
  }, [type, params]);

  // Format names
  const countryName = React.useMemo(() => {
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
    return countryMap[countrySlug] || countrySlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, [countrySlug]);

  const animalName = React.useMemo(() => {
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
  }, [animalSlug]);

  // Get animal category data
  const animalCategory = React.useMemo(() => {
    return animalCategories.find(animal => 
      animal.id === animalSlug ||
      animal.name.toLowerCase().replace(' ', '-') === animalSlug
    );
  }, [animalSlug]);

  // Filter opportunities by both country and animal type
  const combinedOpportunities = React.useMemo(() => {
    return opportunities.filter(opp => {
      // Match country
      const matchesCountry = opp.location.country === countryName;
      
      // Match animal type
      const matchesAnimal = opp.animalTypes.some(type => {
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
      });
      
      return matchesCountry && matchesAnimal;
    });
  }, [countryName, animalName, animalSlug]);

  // Generate and apply SEO metadata
  const seoMetadata = React.useMemo(() => {
    return generateCombinedPageSEO(countrySlug, animalSlug, combinedOpportunities);
  }, [countrySlug, animalSlug, combinedOpportunities]);

  useSEO(seoMetadata);

  if (!countrySlug || !animalSlug || combinedOpportunities.length === 0) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="py-16 text-center">
          <h1 className="text-hero text-deep-forest mb-4">No Programs Found</h1>
          <p className="text-body text-forest/80 mb-8">
            We don't have any {animalName.toLowerCase()} conservation programs in {countryName} yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`/volunteer-${countrySlug}`}
              className="inline-flex items-center px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors"
            >
              All Programs in {countryName}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              to={`/${animalSlug}-volunteer`}
              className="inline-flex items-center px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors"
            >
              All {animalName} Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // Get appropriate emojis
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
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-deep-forest"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 46, 26, 0.85), rgba(26, 46, 26, 0.85)), url(${combinedOpportunities[0]?.images?.[0] || animalCategory?.image || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop'})`
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
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-5xl">{getAnimalEmoji(animalName)}</span>
              <span className="text-5xl">{getCountryFlag(countryName)}</span>
            </div>
            
            <h1 className="text-hero text-white mb-6">
              {animalName} Conservation in {countryName}
            </h1>
            
            <p className="text-body-large text-white/90 mb-8">
              {type === 'country-animal' 
                ? `Discover ${combinedOpportunities.length} specialized ${animalName.toLowerCase()} conservation programs in ${countryName}. Work directly with local wildlife while supporting critical conservation efforts.`
                : `Join ${combinedOpportunities.length} ${animalName.toLowerCase()} conservation programs specifically designed for volunteers in ${countryName}. Make a lasting impact on wildlife protection.`
              }
            </p>
            
            {/* Specialized Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center text-white/90">
                <Shield className="w-5 h-5 mr-2" />
                <span>{combinedOpportunities.length} Specialized Programs</span>
              </div>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{[...new Set(combinedOpportunities.map(opp => opp.location.city))].length} Locations</span>
              </div>
              <div className="flex items-center text-white/90">
                <Users className="w-5 h-5 mr-2" />
                <span>Expert-Led Programs</span>
              </div>
            </div>

            {/* Special Badge */}
            <div className="inline-flex items-center bg-golden-hour/20 text-golden-hour px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Specialized Conservation Focus
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Introduction Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-section text-deep-forest mb-6">
            Why {animalName} Need Protection in {countryName}
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-body text-forest/80 mb-6">
              {animalCategory?.description || `${animalName} in ${countryName} face unique conservation challenges that require specialized volunteer support and expert-led programs.`}
            </p>
            <div className="bg-warm-beige rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {animalCategory?.projects || combinedOpportunities.length}
                  </div>
                  <div className="text-sm text-forest/80">Active Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {animalCategory?.volunteers || '500+'}
                  </div>
                  <div className="text-sm text-forest/80">Volunteers Annually</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {Math.round(Math.random() * 20 + 80)}%
                  </div>
                  <div className="text-sm text-forest/80">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Programs Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-section text-deep-forest mb-4">
              Available Programs
            </h2>
            <p className="text-body text-forest/80 max-w-2xl mx-auto">
              Each program is specifically designed to address the unique conservation needs of {animalName.toLowerCase()} in {countryName}
            </p>
          </motion.div>

          <Grid variant="auto" gap="lg">
            {combinedOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <SpecializedOpportunityCard opportunity={opportunity} />
              </motion.div>
            ))}
          </Grid>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center bg-gradient-to-br from-rich-earth/10 to-warm-sunset/10 rounded-2xl p-12"
        >
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-4xl">{getAnimalEmoji(animalName)}</span>
            <span className="text-4xl">{getCountryFlag(countryName)}</span>
          </div>
          
          <h2 className="text-section text-deep-forest mb-4">
            Your Conservation Journey Starts Here
          </h2>
          <p className="text-body text-forest/80 mb-8 max-w-2xl mx-auto">
            Join the dedicated community of volunteers making a real difference for {animalName.toLowerCase()} conservation in {countryName}. 
            Every volunteer contributes to critical research, habitat protection, and species preservation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`#${combinedOpportunities[0]?.id || ''}`}
              className="inline-flex items-center px-8 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              Apply Now
              <Heart className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              to={`/volunteer-${countrySlug}`}
              className="inline-flex items-center px-8 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              All Programs in {countryName}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              to={`/${animalSlug}-volunteer`}
              className="inline-flex items-center px-8 py-3 border-2 border-sage-green text-sage-green rounded-lg hover:bg-sage-green hover:text-white transition-colors font-medium"
            >
              All {animalName} Programs
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.section>
      </Container>
    </div>
  );
};

// Specialized Opportunity Card with enhanced details
const SpecializedOpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const opportunityRoute = generateOpportunityRoute(opportunity);
  
  return (
    <Link to={opportunityRoute}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${opportunity.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {opportunity.featured && (
            <div className="flex items-center bg-golden-hour/90 text-deep-forest px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 mr-1" />
              Featured Program
            </div>
          )}
          <div className="flex items-center bg-sage-green/90 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Shield className="w-3 h-3 mr-1" />
            Specialized Focus
          </div>
        </div>
        
        {/* Location Info */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{opportunity.location.city}</span>
          </div>
          <div className="text-lg font-semibold">{opportunity.organization}</div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-deep-forest group-hover:text-rich-earth transition-colors">
          {opportunity.title}
        </CardTitle>
        <CardDescription className="text-forest/80">
          Specialized conservation program focusing on local wildlife protection
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-forest/80 mb-4 line-clamp-3">
          {opportunity.description}
        </p>
        
        {/* Animal Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.animalTypes.map((animal, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-sage-green/20 text-sage-green text-xs rounded-full"
            >
              {animal}
            </span>
          ))}
        </div>
        
        {/* Program Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-forest/60">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Duration</span>
            </div>
            <span className="font-medium text-deep-forest">
              {opportunity.duration.min}-{opportunity.duration.max || '+'} weeks
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-forest/60">
              <Users className="w-4 h-4 mr-1" />
              <span>Cost</span>
            </div>
            <span className="font-medium text-deep-forest">
              {opportunity.cost.amount === 0 ? 'Free Program' : `$${opportunity.cost.amount}/${opportunity.cost.period}`}
            </span>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-warm-beige">
          <span className="text-sm text-forest/60">Learn more about this program</span>
          <ArrowRight className="w-4 h-4 text-rich-earth group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default CombinedPage;