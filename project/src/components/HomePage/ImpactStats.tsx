// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\ImpactStats.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Globe, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateOpportunityURL } from '@/lib/search-utils';

const TrustMetrics: React.FC = () => {
  // Essential trust metrics for discovery confidence
  const trustMetrics = [
    {
      id: 'verified-partners',
      icon: Shield,
      value: '200+',
      label: 'Verified Centers',
      description: 'Ethical conservation organizations vetted by experts',
      color: 'text-[#87A96B]',
      bgColor: 'bg-[#87A96B]/10',
      verified: true
    },
    {
      id: 'global-reach', 
      icon: Globe,
      value: '45',
      label: 'Countries Covered',
      description: 'Conservation opportunities across six continents',
      color: 'text-[#8B4513]',
      bgColor: 'bg-[#8B4513]/10',
      verified: true
    },
    {
      id: 'active-opportunities',
      icon: CheckCircle,
      value: '500+',
      label: 'Active Opportunities', 
      description: 'Live conservation projects ready for volunteers',
      color: 'text-[#D2691E]',
      bgColor: 'bg-[#D2691E]/10',
      verified: true
    },
    {
      id: 'partner-organizations',
      icon: Users,
      value: '150+',
      label: 'Partner Organizations',
      description: 'Established conservation groups worldwide',
      color: 'text-[#DAA520]',
      bgColor: 'bg-[#DAA520]/10',
      verified: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="py-8 bg-gradient-to-br from-[#FDF8F0] via-[#FAF3D7]/20 to-[#F0E5D0]/30 relative">
      {/* Subtle immersive background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#DAA520]/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#87A96B]/6 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl relative z-10">
        {/* Streamlined header focused on trust for discovery */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl text-[#1a2e1a] mb-2 font-bold">
            Trusted Conservation Network
          </h2>
          <p className="text-[#2C392C]/70 max-w-lg mx-auto">
            Verified partners and transparent operations you can trust
          </p>
        </motion.div>
        
        {/* Compact Trust Metrics with Integrated Verification */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {trustMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div 
                key={metric.id}
                variants={cardVariants}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#F0E5D0]/60 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group text-center"
              >
                {/* Verification badge integrated into card */}
                {metric.verified && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-4 h-4 text-[#87A96B] fill-current" />
                  </div>
                )}
                
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto mb-3 ${metric.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${metric.color}`} />
                </div>
                
                {/* Value - Large and prominent for discovery confidence */}
                <h3 className="font-display text-2xl md:text-3xl text-[#1a2e1a] font-bold mb-1 transition-colors duration-300 group-hover:text-[#8B4513]">
                  {metric.value}
                </h3>
                
                {/* Label */}
                <p className={`${metric.color} text-sm font-semibold mb-2`}>
                  {metric.label}
                </p>
                
                {/* Description - Concise for space efficiency */}
                <p className="text-[#2C392C]/70 text-xs leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Single Discovery-Focused CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 max-w-md mx-auto border border-[#F0E5D0]/60 shadow-md">
            <p className="text-[#2C392C]/80 text-sm mb-3">
              Explore verified conservation opportunities with confidence
            </p>
            
            <Button 
              size="lg"
              className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to={generateOpportunityURL('location', 'all')}>
                View All Opportunities
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustMetrics;