import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Target, TrendingUp, HandHeart } from 'lucide-react';
import { Container } from '../Layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { KeySpecies } from '../../data/contentHubs';

interface RegionalWildlifeSectionProps {
  keySpecies: KeySpecies;
  countryName: string;
  className?: string;
}

const RegionalWildlifeSection: React.FC<RegionalWildlifeSectionProps> = ({
  keySpecies,
  countryName,
  className = ''
}) => {
  // Get animal emojis for flagship species
  const getAnimalEmoji = (species: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Sea Turtles': '🐢',
      'Sloths': '🦥',
      'Toucans': '🦜',
      'Howler Monkeys': '🐒',
      'Jaguars': '🐆',
      'Asian Elephants': '🐘',
      'Gibbons': '🦧',
      'Macaques': '🐒',
      'Hornbills': '🦅',
      'Elephants': '🐘',
      'Orangutans': '🦧',
      'Tigers': '🐅',
      'Primates': '🐒'
    };
    return emojiMap[species] || '🦎';
  };

  const wildlifeCards = [
    {
      title: 'Flagship Species',
      content: keySpecies.flagship_species,
      description: keySpecies.ecosystem_role,
      icon: Leaf,
      color: 'from-sage-green to-rich-earth',
      type: 'species' as const
    },
    {
      title: 'Conservation Challenges',
      content: keySpecies.conservation_challenges,
      icon: Target,
      color: 'from-warm-sunset to-golden-hour',
      type: 'text' as const
    },
    {
      title: 'Volunteer Impact',
      content: keySpecies.volunteer_contribution,
      icon: HandHeart,
      color: 'from-rich-earth to-deep-forest',
      type: 'text' as const
    }
  ];

  return (
    <section className={`section-padding-lg ${className}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-section text-white mb-6">
            Wildlife Conservation Focus
          </h2>
          <p className="text-body text-white/80 max-w-3xl mx-auto">
            Learn about the key species that define {countryName}'s conservation priorities 
            and how volunteer efforts contribute to protecting these vital ecosystems.
          </p>
        </motion.div>

        <div className="grid-nature-2 gap-nature-lg">
          {wildlifeCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <Card className="h-full bg-warm-beige/80 backdrop-blur-sm border border-warm-beige/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${card.color}`} />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg font-bold text-deep-forest">
                    <div className={`w-8 h-8 radius-nature-sm bg-gradient-to-br ${card.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                      <card.icon className="w-4 h-4 text-white" />
                    </div>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {card.type === 'species' ? (
                    <div>
                      {/* Species grid */}
                      <div className="space-y-1 mb-3">
                        {card.content.map((species, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-2 py-1 bg-soft-cream rounded-lg"
                          >
                            <span className="text-lg mr-2">{getAnimalEmoji(species)}</span>
                            <span className="text-sm font-medium text-deep-forest">{species}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-body-small text-forest/80">
                        {card.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-body text-forest/80">
                      {card.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RegionalWildlifeSection;