import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Target, Microscope, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { RelatedExperience } from '../../data/combinedExperiences';

interface ComplementaryExperiencesSectionProps {
  experiences: {
    same_country_other_animals: RelatedExperience[];
    same_animal_other_countries: RelatedExperience[];
    related_conservation_work: RelatedExperience[];
    ecosystem_connections: string[];
  };
  currentAnimal: string;
  currentCountry: string;
  className?: string;
}

const ComplementaryExperiencesSection: React.FC<ComplementaryExperiencesSectionProps> = ({
  experiences,
  currentAnimal,
  currentCountry,
  className = ''
}) => {
  // Handle navigation scroll to top
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Experience category configurations
  const experienceCategories = [
    {
      title: `Other Wildlife in ${currentCountry}`,
      icon: Target,
      color: 'sage-green',
      bgColor: 'from-sage-green/20 to-rich-earth/20',
      experiences: experiences.same_country_other_animals,
      description: `Explore complementary conservation work in ${currentCountry}`
    },
    {
      title: `${currentAnimal} Conservation Worldwide`,
      icon: Globe,
      color: 'rich-earth',
      bgColor: 'from-rich-earth/20 to-warm-sunset/20',
      experiences: experiences.same_animal_other_countries,
      description: `Compare ${currentAnimal.toLowerCase()} conservation approaches globally`
    },
    {
      title: 'Related Conservation Focus',
      icon: Microscope,
      color: 'warm-sunset',
      bgColor: 'from-warm-sunset/20 to-golden-hour/20',
      experiences: experiences.related_conservation_work,
      description: 'Explore connected ecosystem and research programs'
    }
  ];

  return (
    <section className={`py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-golden-hour to-warm-sunset rounded-full text-white mb-6 shadow-lg">
          <LinkIcon className="w-5 h-5 mr-2" />
          <span className="font-semibold">Expand Your Conservation Impact</span>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-bold text-deep-forest mb-4">
          Explore Related Conservation Experiences
        </h2>
        
        <p className="text-body text-forest/80 max-w-4xl mx-auto leading-relaxed">
          Broaden your conservation expertise by exploring related programs that complement your {currentAnimal.toLowerCase()} work in {currentCountry}. Each experience builds on your skills while addressing interconnected conservation challenges.
        </p>
      </motion.div>

      {/* Experience Categories Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {experienceCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * categoryIndex, duration: 0.6 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.bgColor} p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 bg-${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-deep-forest">
                    {category.title}
                  </h3>
                </div>
                <p className="text-sm text-forest/70">
                  {category.description}
                </p>
              </div>

              {/* Experience Cards */}
              <CardContent className="p-0">
                <div className="space-y-0">
                  {category.experiences.map((experience, expIndex) => (
                    <Link
                      key={expIndex}
                      to={experience.url}
                      onClick={handleNavigation}
                      className="block p-4 hover:bg-warm-beige/30 transition-colors group border-b border-warm-beige/30 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-deep-forest group-hover:text-sage-green transition-colors mb-1">
                            {experience.title}
                          </h4>
                          <p className="text-xs text-forest/70 leading-relaxed mb-2">
                            {experience.description}
                          </p>
                          <div className="bg-sage-green/10 rounded-lg p-2">
                            <p className="text-xs text-sage-green font-medium">
                              <strong>Connection:</strong> {experience.connection_reason}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-forest/40 group-hover:text-sage-green group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ecosystem Connections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-deep-forest mb-2 flex items-center justify-center gap-2">
            <LinkIcon className="w-5 h-5 text-golden-hour" />
            Ecosystem Connections
          </h3>
          <p className="text-sm text-forest/70 max-w-2xl mx-auto">
            Understanding how different conservation efforts connect helps you see the bigger picture of ecosystem health and protection.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {experiences.ecosystem_connections.map((connection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
              className="flex items-start gap-3 p-4 bg-gentle-lemon/10 border border-gentle-lemon/30 rounded-lg hover:bg-gentle-lemon/15 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-golden-hour/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm">🔗</span>
              </div>
              <p className="text-sm text-forest/80 leading-relaxed">
                {connection}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center mt-8"
      >
        <Link
          to="/opportunities"
          onClick={handleNavigation}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sage-green to-rich-earth text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Explore All Conservation Programs
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </motion.div>
    </section>
  );
};

export default ComplementaryExperiencesSection;