// Construction page for packing guides
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, FileText } from 'lucide-react';

const GuidesPage: React.FC = () => {
  const { guideSlug } = useParams<{ guideSlug: string }>();
  const navigate = useNavigate();
  
  // Parse guide context from slug
  const getGuideInfo = (slug: string = '') => {
    if (slug.includes('marine')) {
      return {
        title: 'Marine Wildlife Packing Guide',
        emoji: '🌊',
        description: 'Essential gear for sea turtle, whale, and marine conservation programs.',
        climate: 'Coastal and marine environments',
        focus: 'Waterproof gear, UV protection, marine-safe products'
      };
    } else if (slug.includes('costa-rica')) {
      return {
        title: 'Costa Rica Packing Guide',
        emoji: '🦜',
        description: 'Complete packing guide for Costa Rica\'s rainforest and wildlife programs.',
        climate: 'Tropical rainforest and cloud forest',
        focus: 'Rainforest gear, wildlife photography equipment, eco-friendly products'
      };
    } else if (slug.includes('south-africa')) {
      return {
        title: 'South Africa Packing Guide',
        emoji: '🦏',
        description: 'Comprehensive packing for South African wildlife conservation.',
        climate: 'Varied: savanna, coastal, semi-arid',
        focus: 'Safari gear, big game safety equipment, multi-climate clothing'
      };
    } else if (slug.includes('thailand')) {
      return {
        title: 'Thailand Packing Guide',
        emoji: '🐘',
        description: 'Essential packing for Thailand\'s elephant and wildlife programs.',
        climate: 'Tropical monsoon',
        focus: 'Elephant interaction gear, temple-appropriate clothing, monsoon protection'
      };
    } else if (slug.includes('tropical')) {
      return {
        title: 'Tropical Climate Packing Guide',
        emoji: '🌴',
        description: 'Universal guide for hot, humid climate volunteer work.',
        climate: 'Tropical and subtropical',
        focus: 'Heat management, humidity protection, biodiversity-safe products'
      };
    } else if (slug.includes('safari')) {
      return {
        title: 'Safari Packing Guide',
        emoji: '🦁',
        description: 'Specialized packing for big cat and safari programs.',
        climate: 'Varies by location',
        focus: 'Safety gear, observation equipment, neutral-colored clothing'
      };
    } else if (slug.includes('jungle')) {
      return {
        title: 'Jungle Packing Guide',
        emoji: '🐵',
        description: 'Essential gear for rainforest and primate programs.',
        climate: 'Tropical rainforest',
        focus: 'Humidity protection, insect defense, durable gear'
      };
    } else if (slug.includes('desert')) {
      return {
        title: 'Desert Climate Packing Guide',
        emoji: '🌵',
        description: 'Essential gear for hot, dry climate conservation work.',
        climate: 'Desert and semi-arid',
        focus: 'Sun protection, temperature extremes, water conservation'
      };
    } else if (slug.includes('seasonal')) {
      return {
        title: 'Seasonal Climate Packing Guide',
        emoji: '🌲',
        description: 'Versatile packing for changing weather conditions.',
        climate: 'Temperate with seasonal changes',
        focus: 'Layering system, weather adaptability, multi-season gear'
      };
    } else {
      return {
        title: 'Complete Volunteer Packing Guide',
        emoji: '🎒',
        description: 'General packing essentials for wildlife conservation programs.',
        climate: 'Various',
        focus: 'Universal conservation gear, ethical travel products'
      };
    }
  };
  
  const guideInfo = getGuideInfo(guideSlug);
  
  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-deep-forest to-forest text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to program details
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-4">{guideInfo.emoji}</div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{guideInfo.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">{guideInfo.description}</p>
          </div>
        </div>
      </div>
      
      {/* Construction Notice */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-warm-beige/50 to-gentle-lemon/20 rounded-2xl p-8 lg:p-12 border border-warm-beige/60 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-warm-sunset/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-warm-sunset" />
            </div>
            <h2 className="text-2xl font-bold text-deep-forest mb-3">Guide Under Construction</h2>
            <p className="text-forest/80 text-lg max-w-2xl mx-auto">
              We're crafting a comprehensive, expert-reviewed packing guide specifically for your conservation destination and activities.
            </p>
          </div>
          
          {/* Guide Preview Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-sage-green/20">
              <h3 className="font-semibold text-forest mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-sage-green/20 rounded-full flex items-center justify-center">
                  🌡️
                </div>
                Climate Focus
              </h3>
              <p className="text-sm text-forest/70">{guideInfo.climate}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-warm-sunset/20">
              <h3 className="font-semibold text-forest mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-warm-sunset/20 rounded-full flex items-center justify-center">
                  🎒
                </div>
                Specialization
              </h3>
              <p className="text-sm text-forest/70">{guideInfo.focus}</p>
            </div>
          </div>
          
          {/* Coming Soon Features */}
          <div className="text-left bg-white p-6 rounded-xl border border-golden-hour/20 mb-8">
            <h3 className="font-semibold text-forest mb-4 text-center">What's Coming:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-forest/70">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Essential gear checklist
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Climate-specific clothing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Safety equipment guide
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Photography gear tips
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Eco-friendly product recommendations
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Budget-friendly alternatives
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Packing organization tips
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-golden-hour rounded-full"></div>
                  Local shopping guides
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification Signup */}
          <div className="bg-gradient-to-r from-rich-earth/10 to-sage-green/10 p-6 rounded-xl border border-rich-earth/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-rich-earth" />
              <h3 className="font-semibold text-forest">Get Notified When Ready</h3>
            </div>
            <p className="text-sm text-forest/70 mb-4">
              Be the first to access this comprehensive packing guide when it launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-sage-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50"
              />
              <button className="px-6 py-2 bg-rich-earth text-white rounded-lg hover:bg-rich-earth/90 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
          
          {/* Expected Launch */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-forest/60">
            <Calendar className="w-4 h-4" />
            Expected launch: Q2 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;