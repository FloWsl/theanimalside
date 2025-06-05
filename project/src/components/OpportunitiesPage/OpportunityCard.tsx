import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ExternalLink } from 'lucide-react';
import { Opportunity } from '../../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, index }) => {
  return (
    <motion.article 
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={opportunity.images[0]} 
          alt={opportunity.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {opportunity.featured && (
          <div className="absolute top-4 left-4 bg-accent-500 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>Featured</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-secondary-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{opportunity.location.city}, {opportunity.location.country}</span>
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-3 text-forest group-hover:text-accent-600 transition-colors">
          {opportunity.title}
        </h3>
        
        <p className="text-secondary-600 mb-4 line-clamp-2">
          {opportunity.description}
        </p>
        
        <div className="flex justify-between items-center mb-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center text-secondary-600 text-sm">
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>
              {opportunity.duration.min} - {opportunity.duration.max || 'Ongoing'} weeks
            </span>
          </div>
          <div className="text-accent-600 font-medium">
            {opportunity.cost.amount ? `$${opportunity.cost.amount}/${opportunity.cost.period}` : 'Free'}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {opportunity.animalTypes.slice(0, 3).map((type, i) => (
            <span 
              key={i}
              className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full"
            >
              {type}
            </span>
          ))}
          {opportunity.animalTypes.length > 3 && (
            <span className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full">
              +{opportunity.animalTypes.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Link 
            to={`/opportunities/${opportunity.id}`}
            className="flex-1 flex items-center justify-center bg-forest hover:bg-forest/90 text-white py-3 rounded-xl font-medium transition-colors group"
          >
            View Details
            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          
          {/* Quick link to organization detail - for testing */}
          {opportunity.organization === 'Toucan Rescue Ranch' && (
            <Link 
              to="/organization/toucan-rescue-ranch-costa-rica"
              className="flex items-center justify-center bg-rich-earth hover:bg-rich-earth/90 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              title="View Organization Details"
            >
              🏢
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default OpportunityCard;