// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\CallToAction.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Globe, ArrowRight, Star, Shield, Users } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#2F382F] via-[#4D564D] to-[#2F382F]">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 z-0">
        {/* Large floating golden elements */}
        <div className="absolute top-20 left-20 w-96 h-96 animate-pulse-golden rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#E59866]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5F7161]/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Smaller accent elements */}
        <div className="absolute top-40 right-1/4 w-32 h-32 bg-[#F7DC6F]/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-[#E59866]/15 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#F4D03F]/20 backdrop-blur-sm p-3 rounded-full border border-[#F7DC6F]/30">
              <Heart className="w-6 h-6 text-[#F4D03F]" />
            </div>
            <span className="text-[#F7DC6F] font-semibold text-lg tracking-wide">Join the Movement</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Make a{' '}
            <span className="relative">
              <span className="gradient-text">Real Difference?</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4D03F]/60 rounded-full"></div>
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-[#F7DC6F]/90 mb-12 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of passionate volunteers who are helping to protect wildlife and preserve 
            natural habitats around the world. Your conservation journey starts with a single step.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-[#F4D03F] text-[#2F382F] hover:bg-[#F7DC6F] border-0 rounded-full px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl group"
              asChild
            >
              <Link to="/opportunities">
                Find Your Perfect Opportunity
                <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/15 backdrop-blur-sm text-white border-white/40 hover:bg-[#F7DC6F]/20 hover:border-[#F4D03F]/60 rounded-full px-12 py-6 text-xl font-medium transition-all duration-300" 
              asChild
            >
              <Link to="/organizations">
                For Conservation Centers
                <Globe className="ml-2 w-6 h-6" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Enhanced Stats with individual animations */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { number: '10K+', label: 'Volunteers Worldwide', icon: Users, color: '#F4D03F' },
              { number: '55+', label: 'Countries & Counting', icon: Globe, color: '#E59866' },
              { number: '50K+', label: 'Animals Protected', icon: Shield, color: '#5F7161' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[#F4D03F]/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-[#F7DC6F] group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl md:text-5xl font-light mb-2 group-hover:scale-105 transition-all duration-300" 
                       style={{ color: stat.color }}>
                    {stat.number}
                  </div>
                  <div className="text-[#F7DC6F]/80 text-lg font-light">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Star className="w-4 h-4 text-[#F4D03F] fill-current" />
              <span className="text-[#F7DC6F] text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="w-4 h-4 text-[#E59866]" />
              <span className="text-[#F7DC6F] text-sm font-medium">Safety Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Heart className="w-4 h-4 text-[#5F7161]" />
              <span className="text-[#F7DC6F] text-sm font-medium">Ethical Partners</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
          >
            <p className="text-[#F7DC6F]/80 text-lg font-light leading-relaxed">
              ✨ Join the community that's changing the world, one animal at a time ✨
            </p>
            <p className="text-[#F4D03F] text-sm font-medium mt-2">
              Ready to find impactful experiences and make memories of a lifetime?
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;