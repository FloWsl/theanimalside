import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Target } from 'lucide-react';
import type { Opportunity } from '../../types';

interface SEOInternalLinksProps {
  // Page context
  type: 'animal' | 'country';
  
  // Animal page props
  animalName?: string;
  animalSlug?: string;
  availableCountries?: Array<{ 
    name: string; 
    slug: string; 
    count: number; 
    flag: string; 
    image?: string; 
  }>;
  
  // Country page props
  countryName?: string;
  countrySlug?: string;
  availableAnimals?: Array<{ id: string; name: string }>;
  
  // Common props
  opportunities: Opportunity[];
}

/**
 * Unified Strategic Internal Linking Component for SEO
 * 
 * This component creates a comprehensive internal linking strategy that:
 * 1. Links to related pages based on context (animal/country)
 * 2. Uses keyword-rich anchor text for SEO value
 * 3. Provides consistent design across both page types
 */
const SEOInternalLinks: React.FC<SEOInternalLinksProps> = ({
  type,
  animalName,
  animalSlug,
  availableCountries,
  countryName,
  countrySlug,
  availableAnimals,
  opportunities
}) => {
  // Utility function to scroll to top on navigation
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related animals for cross-linking
  const relatedAnimals = [
    { id: 'lions', name: 'Lions', emoji: '🦁' },
    { id: 'elephants', name: 'Elephants', emoji: '🐘' },
    { id: 'sea-turtles', name: 'Sea Turtles', emoji: '🐢' },
    { id: 'orangutans', name: 'Orangutans', emoji: '🦧' },
    { id: 'koalas', name: 'Koalas', emoji: '🐨' }
  ].filter(animal => animal.name !== animalName);

  // Related countries for cross-linking
  const relatedCountries = [
    { name: 'Costa Rica', slug: 'costa-rica', flag: '🇨🇷' },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'South Africa', slug: 'south-africa', flag: '🇿🇦' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺' },
    { name: 'Kenya', slug: 'kenya', flag: '🇰🇪' },
    { name: 'Indonesia', slug: 'indonesia', flag: '🇮🇩' },
    { name: 'Brazil', slug: 'brazil', flag: '🇧🇷' },
    { name: 'Ecuador', slug: 'ecuador', flag: '🇪🇨' }
  ].filter(country => country.name !== countryName);

  const pageTitle = type === 'animal' 
    ? `Discover Related ${animalName} Conservation Programs`
    : 'Discover Related Conservation Programs';

  const pageDescription = type === 'animal'
    ? `Explore ${animalName?.toLowerCase()} conservation across destinations and related wildlife programs`
    : 'Explore wildlife conservation opportunities across different species and destinations worldwide';

  return (
    <section className="py-16 bg-gradient-to-br from-soft-cream via-warm-beige/30 to-gentle-lemon/20">
      <div className="container-nature">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-deep-forest mb-4">
            {pageTitle}
          </h2>
          <p className="text-base text-forest/80 max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* First Card - Context Dependent */}
          <div className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-sage-green/20 rounded-lg flex items-center justify-center mr-3">
                {type === 'animal' ? (
                  <Globe className="w-4 h-4 text-sage-green" />
                ) : (
                  <Target className="w-4 h-4 text-sage-green" />
                )}
              </div>
              <h3 className="text-lg font-bold text-deep-forest">
                {type === 'animal' ? `${animalName} Destinations` : 'Wildlife by Species'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {type === 'animal' ? (
                // Animal page: Show countries where this animal is found
                availableCountries?.slice(0, 3).map((country) => (
                  <Link 
                    key={country.slug}
                    to={`/volunteer-${country.slug}`}
                    onClick={handleNavigation}
                    className="flex items-center justify-between p-3 bg-sage-green/5 rounded-lg hover:bg-sage-green/10 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-base mr-3">{country.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">
                          {country.name}
                        </div>
                        <div className="text-xs text-forest/60">{country.count} programs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-sage-green transition-colors" />
                  </Link>
                ))
              ) : (
                // Country page: Show animals available in this country + others
                availableAnimals?.slice(0, 2).concat(
                  relatedAnimals.slice(0, 1)
                ).map((animal) => {
                  const isAvailable = availableAnimals?.some(a => a.id === animal.id);
                  return (
                    <Link 
                      key={animal.id}
                      to={`/${animal.id}-volunteer`}
                      onClick={handleNavigation}
                      className="flex items-center justify-between p-3 bg-sage-green/5 rounded-lg hover:bg-sage-green/10 transition-colors group"
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-3">
                          {'emoji' in animal ? animal.emoji : 
                           animal.name === 'Lions' ? '🦁' :
                           animal.name === 'Elephants' ? '🐘' :
                           animal.name === 'Sea Turtles' ? '🐢' :
                           animal.name === 'Orangutans' ? '🦧' :
                           animal.name === 'Koalas' ? '🐨' : '🐾'}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">
                            {animal.name}
                          </div>
                          <div className="text-xs text-forest/60">
                            {isAvailable ? `Available in ${countryName}` : 'Global programs'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-sage-green transition-colors" />
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Second Card - Context Dependent */}
          <div className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-warm-sunset/20 rounded-lg flex items-center justify-center mr-3">
                {type === 'animal' ? (
                  <Target className="w-4 h-4 text-warm-sunset" />
                ) : (
                  <Globe className="w-4 h-4 text-warm-sunset" />
                )}
              </div>
              <h3 className="text-lg font-bold text-deep-forest">
                {type === 'animal' ? 'Related Wildlife' : 'Other Destinations'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {type === 'animal' ? (
                // Animal page: Show other animals
                relatedAnimals.slice(0, 3).map((animal) => (
                  <Link 
                    key={animal.id}
                    to={`/${animal.id}-volunteer`}
                    onClick={handleNavigation}
                    className="flex items-center justify-between p-3 bg-warm-sunset/5 rounded-lg hover:bg-warm-sunset/10 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-base mr-3">{animal.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-deep-forest group-hover:text-warm-sunset transition-colors">
                          {animal.name}
                        </div>
                        <div className="text-xs text-forest/60">Global programs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-warm-sunset transition-colors" />
                  </Link>
                ))
              ) : (
                // Country page: Show other countries
                relatedCountries.slice(0, 3).map((country) => (
                  <Link 
                    key={country.slug}
                    to={`/volunteer-${country.slug}`}
                    onClick={handleNavigation}
                    className="flex items-center justify-between p-3 bg-warm-sunset/5 rounded-lg hover:bg-warm-sunset/10 transition-colors group"
                  >
                    <div className="flex items-center">
                      <span className="text-base mr-3">{country.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-deep-forest group-hover:text-warm-sunset transition-colors">
                          {country.name}
                        </div>
                        <div className="text-xs text-forest/60">Conservation programs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-warm-sunset transition-colors" />
                  </Link>
                ))
              )}
              
              <div className="mt-4 pt-4 border-t border-warm-beige/40">
                <Link 
                  to="/opportunities"
                  onClick={handleNavigation}
                  className="inline-flex items-center text-sm font-medium text-rich-earth hover:text-warm-sunset transition-colors"
                >
                  View All {type === 'animal' ? 'Wildlife Conservation' : 'Conservation Destinations'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
        
        {/* Quick Navigation */}
        <div className="mt-12 pt-8 border-t border-warm-beige/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
            <Link 
              to="/opportunities"
              onClick={handleNavigation}
              className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
            >
              <div className="text-xl mb-2">🌍</div>
              <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">All Programs</div>
            </Link>
            
            <Link 
              to="/about"
              onClick={handleNavigation}
              className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
            >
              <div className="text-xl mb-2">📚</div>
              <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">Learn More</div>
            </Link>
            
            <Link 
              to="/stories"
              onClick={handleNavigation}
              className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
            >
              <div className="text-xl mb-2">✍️</div>
              <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">Stories</div>
            </Link>
            
            <Link 
              to="/contact"
              onClick={handleNavigation}
              className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
            >
              <div className="text-xl mb-2">💬</div>
              <div className="text-sm font-medium text-deep-forest group-hover:text-sage-green transition-colors">Contact</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOInternalLinks;