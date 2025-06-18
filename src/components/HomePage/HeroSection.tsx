// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* IMMERSIVE FULL-WIDTH BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* Majestic Lion Background - Full Width & Immersive */}
        <motion.div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
            alt="Majestic lion in golden savanna - Join wildlife conservation projects worldwide"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Cinematic gradient overlays for readability - MINIMALIST */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e1a]/30 via-transparent to-[#8B4513]/10"></div>
        </motion.div>
        
        {/* Subtle floating elements for depth */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-[#DAA520]/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/4 w-24 h-24 bg-[#D2691E]/15 rounded-full blur-2xl"
          animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* MINIMALIST CONTENT OVERLAY */}
      <div className="container mx-auto px-6 lg:px-12 py-12 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[90vh] py-20">
          
          {/* LEFT SIDE: Enhanced Minimal Content */}
          <motion.div 
            className="space-y-8 lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* IMPACTFUL Headline - Enhanced Typography */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-hero text-white leading-[0.9] drop-shadow-2xl">
                <span className="block">Discover Your</span>
                <span className="block text-gradient-nature drop-shadow-lg">
                  Animal Side
                </span>
              </h1>
              
              <p className="text-body-large text-[#FCF59E]/90 leading-relaxed max-w-lg drop-shadow-lg">
                Connect with authentic wildlife conservation projects worldwide. 
                <span className="text-[#DAA520] font-medium"> Make memories that matter</span> while giving animals a second chance.
              </p>
            </motion.div>

            {/* ENHANCED Emotional Connection - Pure Inspiration */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >   
              
              {/* Inspiring Call to Wonder */}

            </motion.div>

            {/* DISCOVERY CTAs - Inspiration Focused */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button 
                asChild
                className="bg-[#D2691E] hover:bg-[#8B4513] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                <Link to="/opportunities">
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm group"
              >
                <Link to="/opportunities">
                  <Heart className="w-5 h-5 mr-2 transition-colors group-hover:text-[#D2691E]" />
                  <span>Explore Opportunities</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Minimal Inspirational Quote */}
          <motion.div 
            className="relative lg:pl-8 h-[70vh] lg:h-[80vh] flex items-end justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Elegant Quote Card - MINIMALIST */}
            <motion.div 
              className="bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 max-w-md mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <blockquote className="text-white text-xl md:text-2xl font-light italic leading-relaxed text-center mb-6">
                "Every animal saved is a 
                <span className="text-[#DAA520] font-medium"> life changed</span> — 
                including yours"
              </blockquote>
              <div className="text-center">
                <p className="text-[#FCF59E]/80 text-sm font-medium mb-2">
                  — Wildlife Conservation Impact
                </p>
                <div className="flex items-center justify-center gap-2 text-[#DAA520]">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-semibold text-white/70">2,847 Lives Changed This Year</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F3E9] to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;