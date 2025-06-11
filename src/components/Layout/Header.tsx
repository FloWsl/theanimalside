// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\Layout\Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
                <Heart className={`w-5 h-5 ${isScrolled || !isHomePage ? 'text-[#FEFDFA]' : 'text-white'}`} />
              </div>
              <span className={`text-xl md:text-2xl font-bold ${logoColor} transition-colors duration-500 tracking-tight drop-shadow-sm`}>
                The Animal Side
              </span>
            </motion.div>
          </Link>
          
          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8B4513] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/opportunities" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Opportunities
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8B4513] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/organizations" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Organizations
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8B4513] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/about" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8B4513] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/stories" 
              className={`${textColor} hover:text-[#8B4513] transition-all duration-200 font-bold text-sm tracking-wide relative group drop-shadow-sm`}
            >
              Stories
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8B4513] transition-all duration-300 group-hover:w-full rounded-full"></span>
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
              asChild
            >
              <Link to="/register">Get Started</Link>
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
                className="block py-4 px-4 text-[#2D342D] font-bold hover:bg-[#FCF59E]/70 hover:text-[#8B4513] transition-all duration-200 rounded-lg border border-transparent hover:border-[#BC8F56]/30"
              >
                Home
              </Link>
              <Link 
                to="/opportunities" 
                className="block py-4 px-4 text-[#2D342D] font-bold hover:bg-[#FCF59E]/70 hover:text-[#8B4513] transition-all duration-200 rounded-lg border border-transparent hover:border-[#BC8F56]/30"
              >
                Opportunities
              </Link>
              <Link 
                to="/organizations" 
                className="block py-4 px-4 text-[#2D342D] font-bold hover:bg-[#FCF59E]/70 hover:text-[#8B4513] transition-all duration-200 rounded-lg border border-transparent hover:border-[#BC8F56]/30"
              >
                Organizations
              </Link>
              <Link 
                to="/about" 
                className="block py-4 px-4 text-[#2D342D] font-bold hover:bg-[#FCF59E]/70 hover:text-[#8B4513] transition-all duration-200 rounded-lg border border-transparent hover:border-[#BC8F56]/30"
              >
                About
              </Link>
              <Link 
                to="/stories" 
                className="block py-4 px-4 text-[#2D342D] font-bold hover:bg-[#FCF59E]/70 hover:text-[#8B4513] transition-all duration-200 rounded-lg border border-transparent hover:border-[#BC8F56]/30"
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
                  className="w-full bg-[#8B4513] text-[#FEFDFA] hover:bg-[#A0522D] rounded-full py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
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