import React, { useState } from 'react';
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
        className="group card-nature overflow-hidden"
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
      className="group card-nature-hover hover:shadow-nature-xl hover:border-sage-green/30"
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
  const [isFavorited, setIsFavorited] = useState(() => {
    // Check localStorage for favorited opportunities
    const favorites = JSON.parse(localStorage.getItem('favoriteOpportunities') || '[]');
    return favorites.includes(opportunity.id);
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking favorite button
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteOpportunities') || '[]');
    let newFavorites;
    
    if (isFavorited) {
      // Remove from favorites
      newFavorites = favorites.filter((id: string) => id !== opportunity.id);
    } else {
      // Add to favorites
      newFavorites = [...favorites, opportunity.id];
    }
    
    localStorage.setItem('favoriteOpportunities', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };
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
          fetchpriority={index < 3 ? 'high' : 'low'}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZTJkMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODc4Nzg3IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
          }}
        />
        
        {/* Responsive overlays - proper badge design */}
        <div className="absolute top-3 left-3 right-3">
          <div className="flex items-start justify-between gap-2">
            {/* Location overlay - card overlay badge */}
            <div className="badge-nature-overlay-light flex-shrink-0">
              <span className="text-sm">{getCountryFlag(opportunity.location.country)}</span>
              <span className="font-semibold">
                {opportunity.location.city.length > 12 
                  ? opportunity.location.city.substring(0, 12) + '...' 
                  : opportunity.location.city}
              </span>
            </div>
            
            {/* Price overlay - context-aware styling */}
            <div className={`flex-shrink-0 ${
              costInfo.bgColor === 'bg-sage-green' 
                ? 'badge-nature-overlay-dark' 
                : 'badge-nature-overlay-light'
            }`}>
              <span className="font-bold">
                {costInfo.display}
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced gradient with storytelling overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Interactive favorite button */}
        <motion.button
          onClick={handleFavoriteClick}
          className={`absolute bottom-3 right-3 transition-all duration-300 transform ${
            isFavorited 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <div className={`glass-nature-hero transition-all duration-200 section-padding-xs ${
            isFavorited 
              ? 'text-red-500 bg-white/90' 
              : 'text-warm-sunset hover:text-red-500'
          }`}>
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorited ? 'fill-current' : ''
              }`} 
            />
          </div>
        </motion.button>
      </div>
      
      {/* Optimized content section with compact spacing */}
      <div className="section-padding-sm space-nature-sm">
        {/* Organization with trust indicator - Award-winning sizing */}
        <div className="flex items-center justify-between">
          <div className="text-sage-green text-xs font-semibold tracking-wide uppercase truncate">
            {opportunity.organization}
          </div>
          <div className="flex items-center gap-1 text-golden-hour flex-shrink-0">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        </div>
        
        {/* Optimized title - Award-winning sizing */}
        <h3 className="text-lg font-semibold text-deep-forest leading-tight line-clamp-2 group-hover:text-rich-earth transition-colors duration-300">
          {opportunity.title}
        </h3>
        
        {/* Flexible key stats - improved layout */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-warm-beige/40 px-2 py-1 radius-nature-sm flex-1 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-sage-green flex-shrink-0" />
            <span className="text-sm font-medium text-deep-forest truncate">
              {opportunity.duration.min}-{opportunity.duration.max || '∞'} wks
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-warm-beige/40 px-2 py-1 radius-nature-sm flex-1 min-w-0">
            <Users className="w-3.5 h-3.5 text-sage-green flex-shrink-0" />
            <span className="text-sm font-medium text-deep-forest truncate">
              {opportunity.animalTypes.length} {opportunity.animalTypes.length === 1 ? 'species' : 'species'}
            </span>
          </div>
        </div>
        
        {/* Animal types - improved chip design */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.animalTypes.slice(0, 2).map((type, i) => {
            // Smart truncation for different animal names
            const getDisplayName = (name: string) => {
              if (name.length <= 12) return name;
              const words = name.split(' ');
              if (words.length > 1) {
                return words[0].length <= 8 ? words[0] : words[0].substring(0, 8) + '...';
              }
              return name.substring(0, 10) + '...';
            };
            
            return (
              <span 
                key={i}
                className="inline-flex items-center gap-1 bg-sage-green/10 text-sage-green px-2 py-1 radius-nature-full text-xs font-medium border border-sage-green/20 max-w-fit"
              >
                <span>{getAnimalEmoji(type)}</span>
                <span className="whitespace-nowrap">{getDisplayName(type)}</span>
              </span>
            );
          })}
          {opportunity.animalTypes.length > 2 && (
            <span className="inline-flex items-center bg-warm-beige/50 text-forest/70 px-2 py-1 radius-nature-full text-xs font-medium border border-warm-beige/60">
              +{opportunity.animalTypes.length - 2}
            </span>
          )}
        </div>
        
        {/* Compact description - Award-winning sizing */}
        <p className="text-sm text-forest/75 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>
        
        {/* CTA button - improved text fit */}
        <div className="pt-1">
          <div className={`w-full flex items-center justify-center px-3 py-2 radius-nature-sm font-semibold transition-all duration-300 text-sm shadow-nature touch-target ${
            disabled 
              ? 'bg-warm-beige/60 text-forest/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-rich-earth to-warm-sunset group-hover:from-deep-earth group-hover:to-rich-earth text-white group-hover:shadow-nature-xl'
          }`}>
            <span className="whitespace-nowrap">{disabled ? 'Coming Soon' : 'Discover Adventure'}</span>
            {!disabled && <ExternalLink className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />}
          </div>
        </div>
        
        {/* Footer with social proof - improved spacing */}
        <div className="flex items-center justify-between pt-2 border-t border-nature-light gap-2">
          <span className="text-xs text-forest/60 flex-shrink-0">
            {new Date(opportunity.datePosted).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-1 text-golden-hour flex-shrink-0">
            <span className="text-xs font-medium whitespace-nowrap">4.9★</span>
            <span className="text-xs text-forest/60 hidden sm:inline whitespace-nowrap">156 reviews</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpportunityCard;