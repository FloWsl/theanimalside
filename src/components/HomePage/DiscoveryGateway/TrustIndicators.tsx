// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\TrustIndicators.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * Integrated Trust Indicators Component
 * 
 * Streamlined trust metrics bar that replaces the large ImpactStats section.
 * Displays essential trust metrics inline with discovery CTA.
 * 
 * Design: 120px height, compact horizontal layout, honest metrics
 */

interface TrustMetric {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  color: string;
  verified: boolean;
}

const TrustIndicators: React.FC = () => {
  // Essential trust metrics - honest and verifiable
  const trustMetrics: TrustMetric[] = [
    {
      id: 'verified-centers',
      icon: Shield,
      value: '200+',
      label: 'Verified Centers',
      description: 'Ethical conservation organizations vetted by experts',
      color: 'text-[#87A96B]',
      verified: true
    },
    {
      id: 'global-reach', 
      icon: Globe,
      value: '45',
      label: 'Countries',
      description: 'Conservation opportunities across six continents',
      color: 'text-[#8B4513]',
      verified: true
    },
    {
      id: 'active-opportunities',
      icon: CheckCircle,
      value: '500+',
      label: 'Opportunities', 
      description: 'Live conservation projects ready for volunteers',
      color: 'text-[#D2691E]',
      verified: true
    },
    {
      id: 'community-members',
      icon: Users,
      value: '5K+',
      label: 'Community Members',
      description: 'Active volunteers and conservation supporters',
      color: 'text-[#DAA520]',
      verified: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const metricVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white/70 backdrop-blur-sm rounded-xl border border-[#F0E5D0]/60 shadow-md p-6 max-w-6xl mx-auto"
      style={{ height: '120px' }} // Exact height specification
    >
      <div className="h-full flex flex-col justify-between">
        {/* Trust Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {trustMetrics.map((metric) => {
            const IconComponent = metric.icon;
            
            return (
              <motion.div
                key={metric.id}
                variants={metricVariants}
                className="group relative flex items-center gap-3 text-center md:text-left hover:scale-105 transition-transform duration-300 cursor-pointer"
                title={metric.description}
              >
                {/* Icon with verification badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-[#F5E8D4]/80 rounded-lg flex items-center justify-center group-hover:bg-[#F5E8D4] transition-colors duration-300">
                    <IconComponent className={`w-5 h-5 ${metric.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  {/* Verification checkmark */}
                  {metric.verified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#87A96B] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                {/* Metric content */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xl text-[#1a2e1a] group-hover:text-[#8B4513] transition-colors duration-300 leading-none">
                    {metric.value}
                  </div>
                  <div className={`text-sm font-medium ${metric.color} leading-tight`}>
                    {metric.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Single Discovery CTA - Centered and Prominent */}
        <div className="text-center">
          <Button 
            size="lg"
            variant="default"
            className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link to="/opportunities">
              <span className="flex items-center gap-2">
                Start Your Discovery
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </Button>
          
          {/* Subtle supporting text */}
          <p className="text-[#2C392C]/60 text-sm mt-2 max-w-md mx-auto">
            Explore verified conservation opportunities with confidence
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TrustIndicators;