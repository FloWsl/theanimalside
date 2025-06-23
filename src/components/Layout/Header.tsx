import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { animalCategories } from '../../data/animals';
import { generateAnimalRoute, generateCountryRoute } from '../../utils/routeUtils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'animals' | 'destinations' | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleDropdownToggle = (dropdown: 'animals' | 'destinations') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => setActiveDropdown(null);

  // Popular destinations data
  const popularDestinations = [
    { name: 'Costa Rica', slug: 'costa-rica', flag: '🇨🇷' },
    { name: 'Thailand', slug: 'thailand', flag: '🇹🇭' },
    { name: 'South Africa', slug: 'south-africa', flag: '🇿🇦' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺' },
    { name: 'Indonesia', slug: 'indonesia', flag: '🇮🇩' },
    { name: 'Kenya', slug: 'kenya', flag: '🇰🇪' },
    { name: 'Ecuador', slug: 'ecuador', flag: '🇪🇨' },
    { name: 'Brazil', slug: 'brazil', flag: '🇧🇷' }
  ];

  // Get animal emoji
  const getAnimalEmoji = (animalId: string): string => {
    const emojiMap: Record<string, string> = {
      'lions': '🦁',
      'elephants': '🐘',
      'sea-turtles': '🐢',
      'orangutans': '🦧',
      'koalas': '🐨'
    };
    return emojiMap[animalId] || '🐾';
  };

  const isHomePage = location.pathname === '/';
  
  const headerClasses = `fixed w-full top-0 z-50 transition-all duration-500 ${
    isScrolled 
      ? 'bg-[#FEFDFA]/95 backdrop-blur-md py-4 shadow-xl border-b border-[#FCF59E]/60' 
      : isHomePage 
        ? 'bg-transparent py-6' 
        : 'bg-[#FEFDFA]/95 backdrop-blur-md py-4 shadow-xl border-b border-[#FCF59E]/60'
  }`;
  
  const textColor = isScrolled || !isHomePage ? 'text-[#2D342D]' : 'text-white';
  const logoColor = isScrolled || !isHomePage ? 'text-[#2D342D]' : 'text-white';
  const buttonBg = isScrolled || !isHomePage 
    ? 'bg-[#8B4513] text-[#FEFDFA] hover:bg-[#A0522D]' 
    : 'bg-[#FEFDFA]/20 text-white hover:bg-[#FCF59E]/30 backdrop-blur-sm border-2 border-white/40';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                isScrolled || !isHomePage 
                  ? 'bg-[#8B4513] shadow-[#8B4513]/20' 
                  : 'bg-[#FEFDFA]/25 backdrop-blur-sm shadow-white/20'
              }`}>
                <Leaf className={`w-5 h-5 ${isScrolled || !isHomePage ? 'text-[#FEFDFA]' : 'text-white'}`} />
              </div>
              <span className={`text-xl md:text-2xl font-bold ${logoColor} transition-colors duration-500 tracking-tight drop-shadow-sm`}>
                The Animal Side
              </span>
            </motion.div>
          </Link>
          
          {/* Enhanced Desktop Navigation with Discovery Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-8" onMouseLeave={closeDropdown}>
            <Link 
              to="/" 
              className={`${textColor} hover:text-rich-earth transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-rich-earth transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            
            {/* Animals Discovery Dropdown */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('animals')}
                onMouseEnter={() => setActiveDropdown('animals')}
                className={`${textColor} hover:text-rich-earth transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm flex items-center gap-1`}
              >
                <Sparkles className="w-4 h-4" />
                Animals
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'animals' ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-rich-earth transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'animals' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-soft-cream/95 backdrop-blur-md border border-warm-beige/60 rounded-xl shadow-xl z-50"
                  >
                    <div className="p-2">
                      <div className="space-y-0">
                        {animalCategories.map((animal) => (
                          <Link
                            key={animal.id}
                            to={generateAnimalRoute(animal.name)}
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/80 transition-colors group"
                          >
                            <span className="text-base">{getAnimalEmoji(animal.id)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-deep-forest group-hover:text-rich-earth transition-colors truncate">
                                {animal.name}
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="border-t border-warm-beige/40 mt-1 pt-1">
                          <Link
                            to="/opportunities"
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/80 transition-colors group text-forest/80"
                          >
                            <span className="text-base">🐾</span>
                            <div className="text-sm font-medium group-hover:text-rich-earth transition-colors">
                              See All Animals
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Destinations Discovery Dropdown */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownToggle('destinations')}
                onMouseEnter={() => setActiveDropdown('destinations')}
                className={`${textColor} hover:text-rich-earth transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm flex items-center gap-1`}
              >
                <MapPin className="w-4 h-4" />
                Destinations
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'destinations' ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-rich-earth transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'destinations' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-soft-cream/95 backdrop-blur-md border border-warm-beige/60 rounded-xl shadow-xl z-50"
                  >
                    <div className="p-2">
                      <div className="space-y-0">
                        {popularDestinations.map((destination) => (
                          <Link
                            key={destination.slug}
                            to={generateCountryRoute(destination.name)}
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/80 transition-colors group"
                          >
                            <span className="text-base">{destination.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-deep-forest group-hover:text-rich-earth transition-colors truncate">
                                {destination.name}
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="border-t border-warm-beige/40 mt-1 pt-1">
                          <Link
                            to="/opportunities"
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/80 transition-colors group text-forest/80"
                          >
                            <span className="text-base">🌍</span>
                            <div className="text-sm font-medium group-hover:text-rich-earth transition-colors">
                              All Destinations
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link 
              to="/about" 
              className={`${textColor} hover:text-rich-earth transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-rich-earth transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/stories" 
              className={`${textColor} hover:text-rich-earth transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Stories
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-rich-earth transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          </nav>
          
          {/* Enhanced Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/login" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm drop-shadow-sm`}
            >
              Sign In
            </Link>
            <Button 
              size="sm" 
              className={`${buttonBg} rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg`}
              onClick={() => {
                const wildlifeProgramsSection = document.getElementById('wildlife-programs');
                if (wildlifeProgramsSection) {
                  wildlifeProgramsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback to opportunities page if section not found
                  window.location.href = '/opportunities';
                }
              }}
            >
              Get Started
            </Button>
          </div>
          
          {/* Enhanced Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 ${textColor} transition-colors hover:text-[#8B4513] drop-shadow-sm`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="lg:hidden bg-[#FEFDFA]/98 backdrop-blur-md border-b border-[#FCF59E]/60 shadow-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 py-6">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className="block py-4 px-4 text-deep-forest font-bold hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg border border-transparent hover:border-warm-beige/50 min-h-[48px] flex items-center"
              >
                Home
              </Link>
              
              {/* Mobile Animals Section */}
              <div className="py-2">
                <div className="text-sm font-medium text-forest/70 px-4 mb-2">Animals</div>
                {animalCategories.map((animal) => (
                  <Link
                    key={animal.id}
                    to={generateAnimalRoute(animal.name)}
                    className="flex items-center gap-3 py-3 px-4 text-deep-forest hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg min-h-[48px]"
                  >
                    <span className="text-lg">{getAnimalEmoji(animal.id)}</span>
                    <span className="font-medium">{animal.name}</span>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Destinations Section */}
              <div className="py-2">
                <div className="text-sm font-medium text-forest/70 px-4 mb-2">Destinations</div>
                {popularDestinations.slice(0, 5).map((destination) => (
                  <Link
                    key={destination.slug}
                    to={generateCountryRoute(destination.name)}
                    className="flex items-center gap-3 py-3 px-4 text-deep-forest hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg min-h-[48px]"
                  >
                    <span className="text-lg">{destination.flag}</span>
                    <span className="font-medium">{destination.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link 
                to="/opportunities" 
                className="block py-4 px-4 text-deep-forest font-bold hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg border border-transparent hover:border-warm-beige/50 min-h-[48px] flex items-center"
              >
                All Opportunities
              </Link>
              <Link 
                to="/about" 
                className="block py-4 px-4 text-deep-forest font-bold hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg border border-transparent hover:border-warm-beige/50 min-h-[48px] flex items-center"
              >
                About
              </Link>
              <Link 
                to="/stories" 
                className="block py-4 px-4 text-deep-forest font-bold hover:bg-gentle-lemon/30 hover:text-rich-earth transition-all duration-200 rounded-lg border border-transparent hover:border-warm-beige/50 min-h-[48px] flex items-center"
              >
                Stories
              </Link>
              
              <div className="pt-6 mt-6 border-t border-[#FCF59E]/70 space-y-3">
                <Link 
                  to="/login" 
                  className="block py-3 px-4 text-[#4B554B] font-bold hover:bg-[#FCF59E]/50 transition-all duration-200 rounded-lg text-center border border-[#FCF59E]/50 hover:border-[#BC8F56]/50"
                >
                  Sign In
                </Link>
                <Button 
                  className="w-full bg-rich-earth text-soft-cream hover:bg-deep-forest rounded-full py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px]"
                  onClick={() => {
                    setIsMenuOpen(false); // Close mobile menu first
                    const wildlifeProgramsSection = document.getElementById('wildlife-programs');
                    if (wildlifeProgramsSection) {
                      wildlifeProgramsSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // Fallback to opportunities page if section not found
                      window.location.href = '/opportunities';
                    }
                  }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;