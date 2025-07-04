import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Twitter, Mail, MapPin, Sparkles } from 'lucide-react';
import { useAnimalCategoriesFromStats } from '../../hooks/useStatistics';
import { generateAnimalRoute, generateCountryRoute } from '../../utils/routeUtils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Get dynamic animal data from database with React Query caching
  const animalCategories = useAnimalCategoriesFromStats();

  // Popular destinations for footer
  const popularDestinations = [
    { name: 'Costa Rica', slug: 'costa-rica' },
    { name: 'Thailand', slug: 'thailand' },
    { name: 'South Africa', slug: 'south-africa' },
    { name: 'Australia', slug: 'australia' }
  ];

  return (
    <footer className="bg-deep-forest text-soft-cream pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-rich-earth flex items-center justify-center mr-2">
                <Heart className="w-5 h-5 text-soft-cream" />
              </div>
              <span className="text-xl font-display font-semibold text-soft-cream">The Animal Side</span>
            </Link>
            <p className="text-soft-cream/80 mb-6">
              Connecting passionate volunteers with wildlife conservation opportunities worldwide.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-soft-cream/60 hover:text-warm-sunset transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-soft-cream/60 hover:text-warm-sunset transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-soft-cream/60 hover:text-warm-sunset transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@theanimalside.org" 
                className="text-soft-cream/60 hover:text-warm-sunset transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Conservation Animals */}
          <div>
            <h3 className="font-display text-lg mb-4 text-warm-sunset flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Animals
            </h3>
            <ul className="space-y-2">
              {animalCategories.slice(0, 4).map((animal) => (
                <li key={animal.id}>
                  <Link 
                    to={generateAnimalRoute(animal.name)} 
                    className="text-soft-cream/80 hover:text-warm-sunset transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm">
                      {animal.id === 'lions' ? '🦁' : 
                       animal.id === 'elephants' ? '🐘' : 
                       animal.id === 'sea-turtles' ? '🐢' : 
                       animal.id === 'orangutans' ? '🦧' : '🐨'}
                    </span>
                    {animal.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/opportunities" className="text-soft-cream/80 hover:text-warm-sunset transition-colors">
                  All Programs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Destinations */}
          <div>
            <h3 className="font-display text-lg mb-4 text-warm-sunset flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Destinations
            </h3>
            <ul className="space-y-2">
              {popularDestinations.map((destination) => (
                <li key={destination.slug}>
                  <Link 
                    to={generateCountryRoute(destination.name)} 
                    className="text-soft-cream/80 hover:text-warm-sunset transition-colors"
                  >
                    {destination.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/stories" className="text-soft-cream/80 hover:text-warm-sunset transition-colors">
                  Volunteer Stories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information & Newsletter */}
          <div>
            <h3 className="font-display text-lg mb-4 text-warm-sunset">Information</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/about" className="text-soft-cream/80 hover:text-warm-sunset transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-soft-cream/80 hover:text-warm-sunset transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/for-organizations" className="text-soft-cream/80 hover:text-warm-sunset transition-colors">
                  For Organizations
                </Link>
              </li>
            </ul>
            
            <div className="pt-4 border-t border-soft-cream/20">
              <h4 className="text-sm font-medium text-soft-cream mb-3">Stay Updated</h4>
              <p className="text-soft-cream/70 text-sm mb-4">
                Get conservation news and new opportunities.
              </p>
              <form className="mb-3">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="px-3 py-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-warm-sunset text-deep-forest bg-soft-cream text-sm"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-rich-earth hover:bg-warm-sunset px-4 py-2 rounded-r-lg text-soft-cream transition-colors text-sm font-medium"
                  >
                    Join
                  </button>
                </div>
              </form>
              <p className="text-soft-cream/60 text-xs">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-soft-cream/20 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-soft-cream/70 mb-4 md:mb-0">
            &copy; {currentYear} The Animal Side. All rights reserved.
          </p>
          <div className="text-soft-cream/70 space-x-4">
            <Link to="/privacy" className="hover:text-warm-sunset transition-colors text-sm">Privacy</Link>
            <Link to="/terms" className="hover:text-warm-sunset transition-colors text-sm">Terms</Link>
            <Link to="/cookies" className="hover:text-warm-sunset transition-colors text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;