import React from 'react';
import { Heart, Shield, Star } from 'lucide-react';

const OpportunitiesPageHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-soft-cream via-warm-beige/30 to-soft-cream py-12 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-5xl mx-auto">
          {/* Emotional headline with award-winning typography */}
          <h1 className="font-display font-black text-5xl lg:text-7xl xl:text-8xl text-deep-forest mb-6 leading-[0.9] tracking-tight">
            Your Next
            <span className="block text-rich-earth">Wild Adventure</span>
            <span className="block text-lg lg:text-xl font-body font-normal text-forest/70 mt-4 tracking-normal">
              awaits in 45+ countries
            </span>
          </h1>
          
          {/* Trust indicators with social proof */}
          <div className="flex flex-wrap justify-center gap-3 lg:gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-sage-green px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Shield className="w-5 h-5" />
              <span>200+ Verified Programs</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-golden-hour px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Star className="w-5 h-5 fill-current" />
              <span>4.9★ Average Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-warm-sunset px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Heart className="w-5 h-5" />
              <span>Many FREE Options</span>
            </div>
          </div>
          
          {/* Emotional description with discovery language */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg lg:text-xl text-forest/80 mb-4 leading-relaxed">
              From protecting sea turtles on Costa Rican beaches to caring for orphaned elephants in Kenya —
              <strong className="text-deep-forest font-semibold"> discover authentic conservation experiences</strong> that transform both wildlife and volunteers.
            </p>
            <p className="text-base text-forest/60">
              Browse by passion, not just location. Every program tells a story of hope.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesPageHero;