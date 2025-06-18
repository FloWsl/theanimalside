import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Shield, ExternalLink, Heart } from 'lucide-react';
import { Opportunity } from '../../../types';
import { getOpportunityRoute, hasValidOpportunityRoute } from '../../../utils/organizationMapping';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

// Get country flag emoji
const getCountryFlag = (country: string): string => {
  const flags: { [key: string]: string } = {
    'Costa Rica': '🇨🇷',
    'Thailand': '🇹🇭',
    'South Africa': '🇿🇦',
    'Australia': '🇦🇺',
    'Kenya': '🇰🇪',
    'Indonesia': '🇮🇩',
    'Brazil': '🇧🇷',
    'Ecuador': '🇪🇨',
    'Peru': '🇵🇪',
    'Tanzania': '🇹🇿',
    'Namibia': '🇳🇦',
    'Madagascar': '🇲🇬'
  };
  return flags[country] || '🌍';
};

// Get animal emoji
const getAnimalEmoji = (animalType: string): string => {
  const animalEmojis: { [key: string]: string } = {
    'Sea Turtles': '🐢',
    'Marine Life': '🐠',
    'Elephants': '🐘',
    'Lions': '🦁',
    'Leopards': '🐆',
    'Cheetahs': '🐆',
    'Primates': '🐒',
    'Orangutans': '🦧',
    'Marsupials': '🦘',
    'Birds': '🦅',
    'Reptiles': '🦎',
    'Toucans': '🦜',
    'Sloths': '🦥',
    'Small Mammals': '🐿️',
    'Big Cats': '🐅'
  };
  
  // Try exact match first
  if (animalEmojis[animalType]) return animalEmojis[animalType];
  
  // Try partial matches
  for (const [key, emoji] of Object.entries(animalEmojis)) {
    if (animalType.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(animalType.toLowerCase())) {
      return emoji;
    }
  }
  
  return '🦋'; // Default wildlife emoji
};

// Format cost display
const formatCost = (cost: Opportunity['cost']): { display: string; color: string; bgColor: string } => {
  if (cost.amount === 0) {
    return { 
      display: 'FREE', 
      color: 'text-white', 
      bgColor: 'bg-sage-green'
    };
  }
  
  if (cost.amount === null) {
    return { 
      display: 'Contact', 
      color: 'text-forest', 
      bgColor: 'bg-warm-beige'
    };
  }
  
  const amount = cost.amount <= 999 ? `$${cost.amount}` : `$${(cost.amount/1000).toFixed(1)}k`;
  
  return { 
    display: `${amount}/${cost.period}`, 
    color: 'text-deep-forest',
    bgColor: 'bg-white'
  };
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, index }) => {
  const costInfo = formatCost(opportunity.cost);
  const opportunityRoute = getOpportunityRoute(opportunity.id);
  const hasValidRoute = hasValidOpportunityRoute(opportunity.id);
  
  // If no valid route, render as non-clickable card
  if (!hasValidRoute || !opportunityRoute) {
    return (
      <motion.article 
        className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-warm-beige/30 transition-all duration-500"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.08,
          type: "spring",
          stiffness: 100
        }}
      >
        <CardContent opportunity={opportunity} costInfo={costInfo} disabled={true} index={index} />
      </motion.article>
    );
  }
  
  return (
    <motion.article 
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-warm-beige/30 transition-all duration-500 hover:border-sage-green/30"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={opportunityRoute} className="block h-full">
        <CardContent opportunity={opportunity} costInfo={costInfo} disabled={false} index={index} />
      </Link>
    </motion.article>
  );
};

// Extracted card content component to avoid duplication
interface CardContentProps {
  opportunity: Opportunity;
  costInfo: { display: string; color: string; bgColor: string };
  disabled: boolean;
  index: number;
}

const CardContent: React.FC<CardContentProps> = ({ opportunity, costInfo, disabled, index }) => {
  return (
    <>
      {/* Optimized image section with responsive overlays */}
      <div className="relative h-48 lg:h-52 overflow-hidden">
        <img 
          src={opportunity.images[0]} 
          alt={`${opportunity.title} in ${opportunity.location.country}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          fetchPriority={index < 3 ? 'high' : 'low'}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZTJkMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODc4Nzg3IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
          }}
        />
        
        {/* Responsive overlays - stack on small screens */}
        <div className="absolute top-3 left-3 right-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Location overlay */}
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-deep-forest shadow-md border border-white/20 max-w-fit">
              <span className="text-sm">{getCountryFlag(opportunity.location.country)}</span>
              <span className="truncate">
                {opportunity.location.city.length > 8 
                  ? opportunity.location.city.substring(0, 8) + '...' 
                  : opportunity.location.city}
              </span>
            </div>
            
            {/* Price overlay */}
            <div className={`${costInfo.bgColor} ${costInfo.color} px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-white/20 backdrop-blur-md max-w-fit ml-auto sm:ml-0`}>
              {costInfo.display}
            </div>
          </div>
        </div>
        
        {/* Enhanced gradient with storytelling overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Heart icon for emotional connection */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-warm-sunset">
            <Heart className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Optimized content section with compact spacing */}
      <div className="p-4 space-y-3">
        {/* Organization with trust indicator */}
        <div className="flex items-center justify-between">
          <div className="text-sage-green text-xs font-semibold tracking-wide uppercase truncate">
            {opportunity.organization}
          </div>
          <div className="flex items-center gap-1 text-golden-hour flex-shrink-0">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        </div>
        
        {/* Optimized title */}
        <h3 className="text-lg lg:text-xl font-display font-semibold text-deep-forest leading-tight line-clamp-2 group-hover:text-rich-earth transition-colors duration-300">
          {opportunity.title}
        </h3>
        
        {/* Compact key stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 bg-warm-beige/40 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-sage-green flex-shrink-0" />
            <span className="text-xs font-medium text-deep-forest truncate">
              {opportunity.duration.min}-{opportunity.duration.max || '∞'} wks
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-warm-beige/40 px-2.5 py-1.5 rounded-lg">
            <Users className="w-3.5 h-3.5 text-sage-green flex-shrink-0" />
            <span className="text-xs font-medium text-deep-forest truncate">
              {opportunity.animalTypes.length} species
            </span>
          </div>
        </div>
        
        {/* Compact animal types */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.animalTypes.slice(0, 2).map((type, i) => (
            <span 
              key={i}
              className="flex items-center gap-1 bg-gradient-to-r from-sage-green/10 to-sage-green/5 text-sage-green px-2 py-1 rounded-full text-xs font-medium border border-sage-green/20"
            >
              <span className="text-sm">{getAnimalEmoji(type)}</span>
              <span className="truncate max-w-20">{type}</span>
            </span>
          ))}
          {opportunity.animalTypes.length > 2 && (
            <span className="bg-warm-beige/50 text-forest/70 px-2 py-1 rounded-full text-xs font-medium border border-warm-beige">
              +{opportunity.animalTypes.length - 2}
            </span>
          )}
        </div>
        
        {/* Compact description */}
        <p className="text-forest/75 text-sm leading-relaxed line-clamp-2">
          {opportunity.description}
        </p>
        
        {/* Compact CTA - now part of whole card click */}
        <div className="pt-1">
          <div className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 text-sm shadow-md ${
            disabled 
              ? 'bg-warm-beige/60 text-forest/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-rich-earth to-warm-sunset group-hover:from-deep-earth group-hover:to-rich-earth text-white group-hover:shadow-lg'
          }`}>
            <span>{disabled ? 'Coming Soon' : 'Discover Adventure'}</span>
            {!disabled && <ExternalLink className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />}
          </div>
        </div>
        
        {/* Compact footer with social proof */}
        <div className="flex items-center justify-between pt-2 border-t border-warm-beige/30">
          <span className="text-xs text-forest/60">
            {new Date(opportunity.datePosted).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-1 text-golden-hour">
            <span className="text-xs font-medium">4.9★</span>
            <span className="text-xs text-forest/60 hidden sm:inline">156 reviews</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpportunityCard;