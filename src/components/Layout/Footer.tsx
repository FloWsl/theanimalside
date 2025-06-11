import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint as Paw, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Paw className="w-8 h-8 text-primary-300 mr-2" />
              <span className="text-xl font-display font-semibold text-white">Wild Harmony</span>
            </Link>
            <p className="text-secondary-200 mb-6">
              Connecting passionate volunteers with wildlife conservation opportunities worldwide.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-300 hover:text-primary-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-300 hover:text-primary-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-300 hover:text-primary-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@wildharmony.org" 
                className="text-secondary-300 hover:text-primary-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg mb-4 text-primary-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/opportunities" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/organizations" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Browse Organizations
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Volunteer Stories
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h3 className="font-display text-lg mb-4 text-primary-300">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/for-organizations" className="text-secondary-200 hover:text-primary-300 transition-colors">
                  For Organizations
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg mb-4 text-primary-300">Stay Updated</h3>
            <p className="text-secondary-200 mb-4">
              Subscribe to our newsletter for the latest opportunities and wildlife conservation news.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-accent-400 text-forest bg-white"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-r-lg text-white transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
            <p className="text-secondary-300 text-sm">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-secondary-300 mb-4 md:mb-0">
            &copy; {currentYear} Wild Harmony. All rights reserved.
          </p>
          <div className="text-secondary-300 space-x-4">
            <Link to="/privacy" className="hover:text-primary-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary-300 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-primary-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;