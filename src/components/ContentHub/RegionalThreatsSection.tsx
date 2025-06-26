import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { RegionalThreat, SeasonalChallenge } from '../../data/combinedExperiences';

interface RegionalThreatsSectionProps {
  threats: RegionalThreat[];
  seasonal: SeasonalChallenge[];
  context: string;
  urgency: 'Critical' | 'High' | 'Moderate';
  animalName: string;
  countryName: string;
  className?: string;
}

const RegionalThreatsSection: React.FC<RegionalThreatsSectionProps> = ({
  threats,
  seasonal,
  context,
  urgency,
  animalName,
  countryName,
  className = ''
}) => {
  // Urgency color mapping following design system
  const urgencyColors = {
    Critical: 'from-red-500 to-warm-sunset',
    High: 'from-warm-sunset to-golden-hour',
    Moderate: 'from-golden-hour to-sage-green'
  };

  const urgencyIcons = {
    Critical: '🚨',
    High: '⚠️',
    Moderate: '📊'
  };

  // Impact level colors for individual threats
  const impactColors = {
    Critical: 'border-red-500 bg-red-50',
    High: 'border-warm-sunset bg-warm-sunset/5',
    Moderate: 'border-golden-hour bg-golden-hour/5'
  };

  return (
    <section className={`py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* Urgency Badge */}
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-white bg-gradient-to-r ${urgencyColors[urgency]} mb-6 shadow-lg`}>
          <span className="text-lg mr-2">{urgencyIcons[urgency]}</span>
          <span className="font-semibold">{urgency} Conservation Priority</span>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-bold text-deep-forest mb-4">
          {animalName} Conservation Challenges in {countryName}
        </h2>
        
        <p className="text-body text-forest/80 max-w-4xl mx-auto leading-relaxed">
          {context}
        </p>
      </motion.div>

      {/* Primary Threats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {threats.map((threat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
          >
            <Card className={`h-full hover:shadow-xl transition-all duration-300 border-l-4 ${impactColors[threat.impact_level]} overflow-hidden`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-deep-forest flex-1">
                    {threat.threat}
                  </CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    threat.impact_level === 'Critical' ? 'bg-red-100 text-red-700' :
                    threat.impact_level === 'High' ? 'bg-warm-sunset/20 text-warm-sunset' :
                    'bg-golden-hour/20 text-golden-hour'
                  }`}>
                    {threat.impact_level}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-forest/80 text-sm leading-relaxed">
                  {threat.description}
                </p>
                
                <div className="bg-soft-cream/60 rounded-lg p-3 border-l-2 border-sage-green/30">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-sage-green mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-deep-forest mb-1">Your Role as Volunteer</h4>
                      <p className="text-sm text-forest/70">{threat.volunteer_role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Seasonal Challenges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/60 backdrop-blur-sm border border-warm-beige/40 rounded-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-rich-earth to-warm-sunset rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-deep-forest">Seasonal Conservation Factors</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {seasonal.map((challenge, index) => (
            <div
              key={index}
              className="bg-warm-beige/40 rounded-lg p-4 border border-warm-beige/60"
            >
              <h4 className="text-base font-bold text-deep-forest mb-2 flex items-center gap-2">
                <span className="text-lg">📅</span>
                {challenge.season}
              </h4>
              
              <p className="text-sm text-forest/80 mb-3 leading-relaxed">
                {challenge.challenge}
              </p>
              
              <div className="bg-sage-green/10 rounded-lg p-3 border border-sage-green/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-sage-green mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-semibold text-sage-green mb-1">Volunteer Adaptation</h5>
                    <p className="text-sm text-forest/70">{challenge.volunteer_adaptation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RegionalThreatsSection;