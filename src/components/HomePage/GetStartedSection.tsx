// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\GetStartedSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Shield, ChevronRight, Compass, Users, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GetStartedSection: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-[#F4D03F]" />,
      title: 'Discover Opportunities',
      description: 'Search our curated database of ethical wildlife conservation projects worldwide. Filter by location, duration, and animal type to find your perfect match.',
      features: ['50+ Countries Available', 'Verified Organizations', 'All Experience Levels Welcome'],
      link: '/opportunities',
      linkText: 'Browse Opportunities',
      bgGradient: 'from-[#F7DC6F]/20 to-[#F4D03F]/20',
      number: '01',
      iconBg: 'bg-[#F7DC6F]/30',
    },
    {
      icon: <Heart className="w-8 h-8 text-[#E59866]" />,
      title: 'Apply & Connect',
      description: 'Connect directly with conservation centers through our streamlined application process. Get matched with opportunities that align with your goals and values.',
      features: ['Direct Applications', 'Smart Profile Matching', 'Quick Response Guarantee'],
      link: '/how-it-works',
      linkText: 'Learn How It Works',
      bgGradient: 'from-[#E59866]/20 to-[#F4D03F]/10',
      number: '02',
      iconBg: 'bg-[#E59866]/30',
    },
    {
      icon: <Shield className="w-8 h-8 text-[#5F7161]" />,
      title: 'Prepare & Embark',
      description: 'Access comprehensive resources, preparation guides, and connect with alumni volunteers. We support you every step of your conservation journey.',
      features: ['Complete Prep Guides', 'Alumni Mentorship', '24/7 Support Network'],
      link: '/resources',
      linkText: 'Explore Resources',
      bgGradient: 'from-[#5F7161]/20 to-[#F7DC6F]/10',
      number: '03',
      iconBg: 'bg-[#5F7161]/30',
    },
  ];
  
  const quickStats = [
    { icon: <Clock className="w-5 h-5" />, label: 'Average response time', value: '24 hours', color: 'text-[#F4D03F]' },
    { icon: <Users className="w-5 h-5" />, label: 'Success rate', value: '98%', color: 'text-[#E59866]' },
    { icon: <Star className="w-5 h-5" />, label: 'Safety rating', value: '5 stars', color: 'text-[#5F7161]' },
  ];
  
  return (
    <section className="py-24 section-golden relative overflow-hidden">
      {/* Beautiful floating golden elements */}
      <div className="absolute top-20 right-20 w-80 h-80 animate-pulse-golden rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-60 h-60 bg-[#5F7161]/8 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-[#E59866]/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#F4D03F]/20 p-3 rounded-full">
              <Compass className="w-6 h-6 text-[#F4D03F]" />
            </div>
            <span className="text-[#5F7161] font-semibold text-lg tracking-wide">Get Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2F382F] mb-6">
            Your Journey to{' '}
            <span className="gradient-text">Wildlife Conservation</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4D564D] leading-relaxed mb-8 font-light">
            Begin your wildlife conservation adventure in three simple steps. We'll guide you every step 
            of the way to ensure a meaningful, safe, and transformative experience.
          </p>
          
          {/* Enhanced quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-3 text-sm bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-[#F7DC6F]/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`p-2 rounded-full bg-[#F7DC6F]/30`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <span className="text-[#4D564D]">{stat.label}: <strong className="text-[#2F382F]">{stat.value}</strong></span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#F7DC6F]/40 shadow-lg bg-white/85 backdrop-blur-sm relative overflow-hidden hover:border-[#F4D03F]/60">
                {/* Enhanced gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Step number */}
                <div className="absolute top-6 right-6 text-5xl font-light text-[#F7DC6F]/40 group-hover:text-[#F4D03F]/50 transition-colors duration-500">
                  {step.number}
                </div>
                
                <CardHeader className="pb-4 relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${step.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {step.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-medium text-[#2F382F] group-hover:text-[#F4D03F] transition-colors duration-300">
                    {step.title}
                  </CardTitle>
                  
                  <CardDescription className="text-base leading-relaxed text-[#4D564D] font-light">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-3 mb-8">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 text-sm text-[#5F7161]">
                        <div className="w-2 h-2 bg-[#F4D03F] rounded-full"></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/50 hover:bg-[#F7DC6F]/30 border-[#F7DC6F]/60 hover:border-[#F4D03F] text-[#2F382F] group-hover:scale-105 transition-all duration-300" 
                    asChild
                  >
                    <Link to={step.link}>
                      {step.linkText}
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced process flow visualization */}
        <motion.div 
          className="hidden lg:flex items-center justify-center gap-8 mb-20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-6">
            <div className="bg-[#F7DC6F]/30 p-4 rounded-full shadow-lg">
              <Search className="w-8 h-8 text-[#F4D03F]" />
            </div>
            <ChevronRight className="w-8 h-8 text-[#F4D03F]" />
            <div className="bg-[#E59866]/30 p-4 rounded-full shadow-lg">
              <Heart className="w-8 h-8 text-[#E59866]" />
            </div>
            <ChevronRight className="w-8 h-8 text-[#E59866]" />
            <div className="bg-[#5F7161]/30 p-4 rounded-full shadow-lg">
              <Shield className="w-8 h-8 text-[#5F7161]" />
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced call to action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-[#F4D03F]/20 via-white/80 to-[#E59866]/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-[#F7DC6F]/40 shadow-xl">
            <h3 className="text-3xl md:text-4xl font-light text-[#2F382F] mb-6">
              🌟 Start Your Conservation Journey <span className="gradient-text">Today</span>
            </h3>
            <p className="text-lg md:text-xl text-[#4D564D] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Join over 10,000 volunteers who've made a meaningful impact on wildlife conservation. 
              Your perfect opportunity is waiting to be discovered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-[#F4D03F] text-[#2F382F] hover:bg-[#F7DC6F] rounded-full px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/opportunities">
                  Find My Perfect Opportunity
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/60 hover:bg-[#F7DC6F]/30 border-[#F7DC6F] hover:border-[#F4D03F] text-[#2F382F] rounded-full px-10 py-6 text-lg font-medium transition-all duration-300"
                asChild
              >
                <Link to="/contact">
                  Talk to an Expert
                </Link>
              </Button>
            </div>
            
            {/* Enhanced trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-[#5F7161]/20 text-[#2F382F] px-4 py-2 rounded-full font-medium">🛡️ Safety Certified</span>
              <span className="bg-[#F4D03F]/30 text-[#2F382F] px-4 py-2 rounded-full font-medium">⭐ 4.9/5 Rating</span>
              <span className="bg-[#E59866]/20 text-[#2F382F] px-4 py-2 rounded-full font-medium">🌍 Global Network</span>
              <span className="bg-[#F7DC6F]/40 text-[#2F382F] px-4 py-2 rounded-full font-medium">📞 24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStartedSection;