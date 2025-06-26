import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { SuccessMetric } from '../../data/combinedExperiences';

interface UniqueApproachSectionProps {
  approach: {
    conservation_method: string;
    volunteer_integration: string;
    local_partnerships: string[];
    success_metrics: SuccessMetric[];
    what_makes_it_special: string;
  };
  animalName: string;
  countryName: string;
  className?: string;
}

const UniqueApproachSection: React.FC<UniqueApproachSectionProps> = ({
  approach,
  animalName,
  countryName,
  className = ''
}) => {
  return (
    <section className={`py-12 bg-gradient-to-br from-sage-green/10 to-rich-earth/10 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sage-green to-rich-earth rounded-full text-white mb-6 shadow-lg">
          <Award className="w-5 h-5 mr-2" />
          <span className="font-semibold">Proven Conservation Excellence</span>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-bold text-deep-forest mb-4">
          What Makes {animalName} Conservation Unique in {countryName}
        </h2>
        
        <p className="text-body text-forest/80 max-w-4xl mx-auto leading-relaxed">
          {approach.what_makes_it_special}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Conservation Method */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border border-warm-beige/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-deep-forest">
                <div className="w-8 h-8 bg-gradient-to-br from-sage-green to-rich-earth rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Conservation Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-forest/80 leading-relaxed">
                {approach.conservation_method}
              </p>
              
              <div className="border-t border-warm-beige/40 pt-4">
                <h4 className="text-sm font-semibold text-deep-forest mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sage-green" />
                  Volunteer Integration
                </h4>
                <p className="text-forest/80 text-sm leading-relaxed">
                  {approach.volunteer_integration}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border border-warm-beige/40 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-deep-forest">
                <div className="w-8 h-8 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Proven Conservation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approach.success_metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-sage-green/5 rounded-lg p-4 border border-sage-green/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-sage-green/20 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-sage-green">{metric.value}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-deep-forest mb-1">
                          {metric.metric}
                        </h4>
                        <p className="text-xs text-forest/70 leading-relaxed">
                          {metric.context}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Local Partnerships */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-deep-forest mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-sage-green" />
            Key Conservation Partners
          </h3>
          <p className="text-sm text-forest/70">
            Collaborative partnerships essential for {animalName.toLowerCase()} conservation success in {countryName}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {approach.local_partnerships.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
              className="bg-sage-green/10 border border-sage-green/20 rounded-lg p-3 text-center hover:bg-sage-green/15 transition-colors"
            >
              <span className="text-sm font-medium text-sage-green">
                {partner}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default UniqueApproachSection;