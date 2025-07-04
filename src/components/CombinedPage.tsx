import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight, Star, Shield, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid } from './Layout/Container';
import Breadcrumb, { useBreadcrumbs } from './ui/Breadcrumb';
import RegionalThreatsSection from './ContentHub/RegionalThreatsSection';
import UniqueApproachSection from './ContentHub/UniqueApproachSection';
import ComplementaryExperiencesSection from './ContentHub/ComplementaryExperiencesSection';
import SourcesSection from './ui/SourcesSection';
import OpportunityCard from './OpportunitiesPage/v2/OpportunityCard';
import { OrganizationService } from '../services/organizationService';
import { animalCategories } from '../data/animals';
import { getCombinedExperienceByParams } from '../data/combinedExperiences';
import { organizationDetails } from '../data/organizationDetails';
import { generateCombinedPageSEO, useSEO } from '../utils/seoUtils';
import { useAnimalCountryStatistic } from '../hooks/useStatistics';
import type { Organization } from '../types/database';

interface CombinedPageProps {
  type: 'country-animal' | 'animal-country';
}

const CombinedPage: React.FC<CombinedPageProps> = ({ type }) => {
  const params = useParams<{ country?: string; animal?: string; animalvolunteer?: string }>();
  const breadcrumbs = useBreadcrumbs();

  // Extract country and animal from dynamic route parameters
  const { countrySlug, animalSlug } = React.useMemo(() => {
    
    if (type === 'country-animal') {
      // Route pattern: /volunteer-:country/:animal
      return {
        countrySlug: params.country || '',
        animalSlug: params.animal || ''
      };
    } else {
      // Route pattern: /:animalvolunteer/:country  
      const animalvolunteer = params.animalvolunteer || '';
      
      // Route mismatch detection and correction
      // Handle cases where volunteer-thailand/elephants matches :animalvolunteer/:country pattern
      if (animalvolunteer.startsWith('volunteer-')) {
        const actualCountry = animalvolunteer.replace('volunteer-', '');
        const actualAnimal = params.country || '';
        
        return {
          countrySlug: actualCountry,
          animalSlug: actualAnimal
        };
      }
      
      // Normal animal-volunteer parsing: "lions-volunteer" -> "lions"
      const animalFromParam = animalvolunteer.replace('-volunteer', '');
      
      return {
        countrySlug: params.country || '',
        animalSlug: animalFromParam
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
    const result = countryMap[countrySlug] || countrySlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    return result;
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
    const result = animalMap[animalSlug] || animalSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    return result;
  }, [animalSlug]);

  // Get animal category data
  const animalCategory = React.useMemo(() => {
    return animalCategories.find(animal => 
      animal.id === animalSlug ||
      animal.name.toLowerCase().replace(' ', '-') === animalSlug
    );
  }, [animalSlug]);

  // Query organizations by country and animal type using database
  const { data: organizationsResponse, isLoading, error } = useQuery({
    queryKey: ['combined-organizations', countryName, animalName],
    queryFn: async () => {
      return OrganizationService.searchOrganizations({ 
        country: countryName, 
        animal_types: [animalName] 
      }, { page: 1, limit: 50 });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!countryName && !!animalName,
  });

  // Convert organizations to opportunity format for UI compatibility
  const combinedOpportunities = React.useMemo(() => {
    const organizations = organizationsResponse?.data || [];
    
    // If database has no results, fall back to mock data
    if (organizations.length === 0) {
      // Use imported mock data and filter by country and animal type
      const mockOrganizations = organizationDetails.filter((org: any) => {
        const matchesCountry = org.location.country.toLowerCase().replace(/\s+/g, '-') === countrySlug;
        
        // Check if organization works with this animal type
        const matchesAnimal = org.animalTypes?.some((type: any) => {
          // Ensure type is a string before calling toLowerCase
          const typeStr = typeof type === 'string' ? type : String(type || '');
          return typeStr.toLowerCase().includes(animalName.toLowerCase()) || 
                 animalName.toLowerCase().includes(typeStr.toLowerCase());
        });
        
        return matchesCountry && (matchesAnimal || !org.animalTypes);
      });
      
      return mockOrganizations.map((org: any) => ({
        id: org.id,
        title: org.name,
        organization: org.name,
        description: org.tagline || org.mission || `Wildlife conservation in ${countryName}`,
        location: { 
          country: org.location.country, 
          city: org.location.city || '', 
          region: org.location.region || '' 
        },
        images: [org.heroImage || '/images/default-wildlife.jpg'],
        animalTypes: [animalName], // Use the current animal filter
        duration: { min: 2, max: 12 },
        cost: { amount: null, currency: 'USD', period: 'total', includes: [] },
        featured: org.featured || false,
        datePosted: new Date().toISOString(),
        slug: org.slug,
        tags: [animalName, countryName]
      }));
    }
    
    return organizations.map(org => ({
      id: org.id,
      title: org.name,
      organization: org.name,
      description: org.tagline || org.mission || `Wildlife conservation in ${countryName}`,
      location: { 
        country: org.country, 
        city: org.city || '', 
        region: org.region || '' 
      },
      images: [org.hero_image || '/images/default-wildlife.jpg'],
      animalTypes: [animalName], // Use the current animal filter
      duration: { min: 2, max: 12 },
      cost: { amount: null, currency: 'USD', period: 'total', includes: [] },
      featured: org.featured || false,
      datePosted: org.created_at || new Date().toISOString(),
      slug: org.slug,
      tags: [animalName, countryName]
    }));
  }, [organizationsResponse, animalName, countryName, countrySlug]);

  // Get combined experience content (Story 5 requirement)
  const combinedExperience = React.useMemo(() => {
    return getCombinedExperienceByParams(countrySlug, animalSlug);
  }, [countrySlug, animalSlug]);

  // Get dynamic statistics for this animal-country combination
  const { data: combinedStats, isLoading: statsLoading } = useAnimalCountryStatistic(animalName, countryName);

  // Generate and apply SEO metadata
  const seoMetadata = React.useMemo(() => {
    return generateCombinedPageSEO(countrySlug, animalSlug, combinedOpportunities);
  }, [countrySlug, animalSlug, combinedOpportunities]);

  useSEO(seoMetadata);

  // Loading state
  if (isLoading) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest/70 text-sm">Finding {animalName.toLowerCase()} conservation programs in {countryName}...</p>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="min-h-screen bg-soft-cream">
        <div className="py-16 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-hero text-deep-forest mb-4">Unable to Load Programs</h1>
          <p className="text-body text-forest/80 mb-8">
            There was an error loading conservation programs. Please try again later.
          </p>
          <Link 
            to="/opportunities"
            className="inline-flex items-center px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors"
          >
            Browse All Programs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Container>
    );
  }

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
          backgroundImage: `linear-gradient(rgba(26, 46, 26, 0.85), rgba(26, 46, 26, 0.85)), url(${combinedOpportunities[0]?.images?.[0] || animalCategory?.image || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop'})`
        }}
      >
        <Container className="py-16 lg:py-24">
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
              {/* Dynamic stats from Supabase database */}
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {statsLoading ? '...' : (combinedStats?.total_projects || combinedOpportunities.length)}
                  </div>
                  <div className="text-sm text-forest/80">Global Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {statsLoading ? '...' : (combinedStats?.total_volunteers || '340')}
                  </div>
                  <div className="text-sm text-forest/80">Volunteers Hosted</div>
                  <div className="text-xs text-forest/60 mt-1">Since inception</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rich-earth mb-2">
                    {combinedStats?.organizations_count || combinedOpportunities.length}
                  </div>
                  <div className="text-sm text-forest/80">Programs in {countryName}</div>
                </div>
              </div>
              
              {/* Data transparency note - now real-time */}
              <div className="mt-4 text-xs text-forest/60 text-center">
                <span>Real-time data from verified organizations • Volunteer counts represent cumulative totals since organization founding • Updated automatically</span>
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
                <OpportunityCard opportunity={opportunity} index={index} />
              </motion.div>
            ))}
          </Grid>
        </section>

        {/* Story 5 Specialized Content Sections */}
        {combinedExperience && (
          <>
            {/* Regional Threats Section */}
            <RegionalThreatsSection
              threats={combinedExperience.regionalThreats.primary_threats}
              seasonal={combinedExperience.regionalThreats.seasonal_challenges}
              context={combinedExperience.regionalThreats.local_context}
              urgency={combinedExperience.regionalThreats.conservation_urgency}
              animalName={animalName}
              countryName={countryName}
            />

            {/* Unique Approach Section */}
            <UniqueApproachSection
              approach={combinedExperience.uniqueApproach}
              animalName={animalName}
              countryName={countryName}
            />

            {/* Complementary Experiences Section */}
            <ComplementaryExperiencesSection
              experiences={combinedExperience.complementaryExperiences}
              currentAnimal={animalName}
              currentCountry={countryName}
            />

            {/* Sources & References Section */}
            <Container className="section-padding-sm">
              <SourcesSection
                sources={combinedExperience.sources}
                title="Combined Experience Sources & References"
                contentType={`${animalName} Conservation in ${countryName}`}
                variant="detailed"
                showVerification={true}
              />
            </Container>
          </>
        )}

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


export default CombinedPage;