// src/components/OrganizationDetail/RelatedOpportunities.tsx
import React from 'react';
import { MapPin, Clock, Heart } from 'lucide-react';
import { OrganizationDetail } from '../../types';
import { opportunities } from '../../data/opportunities';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface RelatedOpportunitiesProps {
  organization: OrganizationDetail;
}

const RelatedOpportunities: React.FC<RelatedOpportunitiesProps> = ({ organization }) => {
  // Find related opportunities (exclude current one)
  const relatedOpportunities = opportunities
    .filter(opp => opp.id !== organization.id)
    .filter(opp => {
      // Include if same country OR overlapping animal types
      const sameCountry = opp.location.country === organization.location.country;
      const currentAnimalTypes = organization.animalTypes.map(a => a.animalType);
      const hasOverlappingAnimals = opp.animalTypes.some(animal => 
        currentAnimalTypes.some(current => 
          current.toLowerCase().includes(animal.toLowerCase()) || 
          animal.toLowerCase().includes(current.toLowerCase())
        )
      );
      return sameCountry || hasOverlappingAnimals;
    })
    .slice(0, 3); // Show max 3 related opportunities

  if (relatedOpportunities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-section text-forest">Continue Your Discovery</h2>
        <p className="text-body text-forest/70 max-w-2xl mx-auto">
          Explore more wildlife conservation opportunities that share similar missions and values.
        </p>
      </div>

      {/* Related Opportunities Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {relatedOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-white border-beige/60 hover:shadow-nature transition-all duration-300">
            {/* Opportunity Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={opportunity.images[0]} 
                alt={opportunity.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm text-forest/60 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{opportunity.location.country}</span>
                <span>•</span>
                <span>{opportunity.animalTypes.slice(0, 2).join(', ')}</span>
              </div>
              <CardTitle className="text-lg text-forest hover:text-rich-earth transition-colors">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="text-forest/70 line-clamp-2">
                {opportunity.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-forest/60">
                  <Clock className="w-4 h-4" />
                  <span>{opportunity.duration.min}-{opportunity.duration.max || '∞'} weeks</span>
                </div>
                <button className="text-rich-earth hover:text-sunset transition-colors text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exploration Encouragement */}
      <div className="text-center bg-gradient-to-r from-beige/50 to-cream rounded-2xl p-6 border border-beige/40">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-rich-earth" />
          <span className="text-forest font-medium">Find Your Perfect Match</span>
        </div>
        <p className="text-forest/70 text-sm mb-4">
          Every conservation project offers a unique opportunity to make a difference. Take your time to explore and find the perfect adventure for you.
        </p>
        <button className="text-rich-earth hover:text-sunset transition-colors font-medium text-sm">
          Browse All Opportunities →
        </button>
      </div>
    </div>
  );
};

export default RelatedOpportunities;