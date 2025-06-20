import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Target } from 'lucide-react';
import type { Opportunity } from '../../types';

interface SEOInternalLinksProps {
  countryName: string;
  countrySlug: string;
  availableAnimals: Array<{ id: string; name: string }>;
  opportunities: Opportunity[];
}

/**
 * Strategic Internal Linking Component for SEO Authority Distribution
 * 
 * This component creates a comprehensive internal linking strategy that:
 * 1. Links to related animal pages for topical authority
 * 2. Links to other country pages for geographic authority
 * 3. Links to specific programs for deep page authority
 * 4. Uses keyword-rich anchor text for SEO value
 */
const SEOInternalLinks: React.FC<SEOInternalLinksProps> = ({
  countryName,
  countrySlug,
  availableAnimals,
  opportunities
}) => {
  // Utility function to scroll to top on navigation
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related countries for cross-linking
  const relatedCountries = [
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'South Africa', slug: 'south-africa', flag: '🇿🇦' },
    { name: 'Kenya', slug: 'kenya', flag: '🇰🇪' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺' },
    { name: 'Brazil', slug: 'brazil', flag: '🇧🇷' }
  ].filter(country => country.name !== countryName);

  // Featured animal types for cross-linking
  const featuredAnimals = [
    { id: 'lions', name: 'Lions', emoji: '🦁' },
    { id: 'elephants', name: 'Elephants', emoji: '🐘' },
    { id: 'sea-turtles', name: 'Sea Turtles', emoji: '🐢' },
    { id: 'orangutans', name: 'Orangutans', emoji: '🦧' }
  ];

  // High-authority opportunity for featured linking
  const featuredOpportunity = opportunities.find(opp => 
    opp.featured || opp.rating >= 4.5
  ) || opportunities[0];

  return (
    <div className="section-jungle section-padding-lg">
      <div className="container-nature-wide">
        <div className="text-center space-nature-sm">
          <h2 className="text-section text-deep-forest mb-6">
            Discover Related Conservation Programs
          </h2>
          <p className="text-body-large text-forest/70 max-w-3xl mx-auto">
            Explore wildlife conservation opportunities across different species and destinations worldwide
          </p>
        </div>

        <div className="grid-nature-3 gap-nature-lg">
          {/* Related Animal Conservation Programs */}
          <div className="card-nature section-padding-md">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-sage-green mr-3" />
              <h3 className="text-feature text-deep-forest">Wildlife Conservation by Species</h3>
            </div>
            
            <div className="space-nature-sm">
              {featuredAnimals.map((animal) => {
                const isAvailable = availableAnimals.some(a => a.id === animal.id);
                
                return (
                  <div key={animal.id} className="flex items-center justify-between section-padding-xs bg-sage-green/5 radius-nature-sm hover:bg-sage-green/10 transition-colors">
                    <Link 
                      to={`/${animal.id}-volunteer`}
                      onClick={handleNavigation}
                      className="flex items-center flex-1 text-deep-forest hover:text-sage-green transition-colors"
                    >
                      <span className="text-xl mr-3">{animal.emoji}</span>
                      <div>
                        <div className="text-subtitle">{animal.name} Conservation Programs</div>
                        <div className="text-caption-small text-forest/60">
                          {isAvailable ? `Available in ${countryName}` : 'Global programs available'}
                        </div>
                      </div>
                    </Link>
                    <ArrowRight className="w-4 h-4 text-forest/40" />
                  </div>
                );
              })}
              
              {/* Link to combined pages if animal is available in country */}
              {availableAnimals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-nature-light">
                  <Link 
                    to={`/volunteer-${countrySlug}/${availableAnimals[0].id}`}
                    onClick={handleNavigation}
                    className="inline-flex items-center text-body-small font-medium text-rich-earth hover:text-warm-sunset transition-colors"
                  >
                    {availableAnimals[0].name} Conservation in {countryName}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Country Programs */}
          <div className="card-nature section-padding-md">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-warm-sunset mr-3" />
              <h3 className="text-feature text-deep-forest">Conservation by Destination</h3>
            </div>
            
            <div className="space-nature-sm">
              {relatedCountries.slice(0, 4).map((country) => (
                <div key={country.slug} className="flex items-center justify-between section-padding-xs bg-warm-sunset/5 radius-nature-sm hover:bg-warm-sunset/10 transition-colors">
                  <Link 
                    to={`/volunteer-${country.slug}`}
                    onClick={handleNavigation}
                    className="flex items-center flex-1 text-deep-forest hover:text-warm-sunset transition-colors"
                  >
                    <span className="text-xl mr-3">{country.flag}</span>
                    <div>
                      <div className="text-subtitle">Wildlife Programs in {country.name}</div>
                      <div className="text-xs text-forest/60">
                        Conservation opportunities worldwide
                      </div>
                    </div>
                  </Link>
                  <ArrowRight className="w-4 h-4 text-forest/40" />
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-warm-beige/60">
                <Link 
                  to="/opportunities"
                  onClick={handleNavigation}
                  className="inline-flex items-center text-sm font-medium text-rich-earth hover:text-warm-sunset transition-colors"
                >
                  View All Conservation Destinations
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Program Deep Link */}
          {featuredOpportunity && (
            <div className="card-nature section-padding-md">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-rich-earth rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              <h3 className="text-feature text-deep-forest">Featured Conservation Program</h3>
              </div>
              
              <div className="space-nature-sm">
                <div className="relative">
                  {featuredOpportunity.images?.[0] && (
                    <div 
                      className="h-32 bg-cover bg-center radius-nature-sm"
                      style={{ backgroundImage: `url(${featuredOpportunity.images[0]})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent radius-nature-sm"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-body-small font-medium">{featuredOpportunity.title}</div>
                    <div className="text-caption-small opacity-90">{featuredOpportunity.location.city}, {countryName}</div>
                  </div>
                </div>
                
                <p className="text-body-small text-forest/80 line-clamp-2">
                  {featuredOpportunity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-caption-small text-forest/60">
                    {featuredOpportunity.duration.min}-{featuredOpportunity.duration.max} weeks
                  </div>
                  <div className="text-caption-small font-medium text-sage-green">
                    ⭐ {featuredOpportunity.rating || '4.8'}
                  </div>
                </div>
                
                <Link 
                  to={`/organizations/${featuredOpportunity.id}`}
                  onClick={handleNavigation}
                  className="btn-nature-primary w-full text-center"
                >
                  View Program Details
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Navigation Links */}
        <div className="mt-8 pt-8 border-t border-nature-light">
          <div className="grid-nature-4 gap-nature-sm text-center">
            <Link 
              to="/opportunities"
              onClick={handleNavigation}
              className="section-padding-sm card-nature-hover"
            >
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-body-small font-medium text-deep-forest">All Opportunities</div>
              <div className="text-caption-small text-forest/60">50+ countries</div>
            </Link>
            
            <Link 
              to="/about"
              onClick={handleNavigation}
              className="section-padding-sm card-nature-hover"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="text-body-small font-medium text-deep-forest">Conservation Guide</div>
              <div className="text-caption-small text-forest/60">Learn more</div>
            </Link>
            
            <Link 
              to="/blog"
              onClick={handleNavigation}
              className="section-padding-sm card-nature-hover"
            >
              <div className="text-2xl mb-2">✍️</div>
              <div className="text-body-small font-medium text-deep-forest">Volunteer Stories</div>
              <div className="text-caption-small text-forest/60">Real experiences</div>
            </Link>
            
            <Link 
              to="/contact"
              onClick={handleNavigation}
              className="section-padding-sm card-nature-hover"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="text-body-small font-medium text-deep-forest">Get Help</div>
              <div className="text-caption-small text-forest/60">Contact us</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOInternalLinks;