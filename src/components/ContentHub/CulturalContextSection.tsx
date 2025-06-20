import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, BookOpen } from 'lucide-react';
import { Container } from '../Layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { CulturalContext } from '../../data/contentHubs';

interface CulturalContextSectionProps {
  culturalContext: CulturalContext;
  countryName: string;
  className?: string;
}

const CulturalContextSection: React.FC<CulturalContextSectionProps> = ({
  culturalContext,
  countryName,
  className = ''
}) => {
  const contextCards = [
    {
      title: 'Conservation Philosophy',
      content: culturalContext.conservation_philosophy,
      icon: Heart,
      color: 'from-sage-green to-rich-earth'
    },
    {
      title: 'Traditional Knowledge',
      content: culturalContext.traditional_knowledge,
      icon: BookOpen,
      color: 'from-warm-sunset to-golden-hour'
    },
    {
      title: 'Community Involvement',
      content: culturalContext.community_involvement,
      icon: Users,
      color: 'from-rich-earth to-deep-forest'
    },
    {
      title: 'Volunteer Integration',
      content: culturalContext.volunteer_integration,
      icon: Globe,
      color: 'from-golden-hour to-sage-green'
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
          <h2 className="text-section text-deep-forest mb-6">
            Conservation Culture in {countryName}
          </h2>
          <p className="text-body text-forest/80 max-w-3xl mx-auto">
            Understanding the local approach to conservation helps volunteers integrate meaningfully 
            with communities and contribute to sustainable wildlife protection efforts.
          </p>
        </motion.div>

        <div className="grid-nature-2 gap-nature-lg">
          {contextCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${card.color}`} />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-deep-forest">
                    <div className={`w-10 h-10 radius-nature-sm bg-gradient-to-br ${card.color} flex items-center justify-center mr-3`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-forest/80">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CulturalContextSection;