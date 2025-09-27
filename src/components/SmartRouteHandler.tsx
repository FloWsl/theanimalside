import React, { useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowRight, Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import { parseRoute } from '../utils/routeUtils';
import { useRouteAnalytics } from '../utils/routeAnalytics';

/**
 * Smart 404 handler with progressive fallback and "did you mean?" suggestions
 * Provides intelligent route suggestions and smooth UX fallback patterns
 */
const SmartRouteHandler: React.FC = () => {
  const location = useLocation();
  const { getRouteSuggestions } = useDynamicRoutes();

  // Parse the attempted route to understand what user was trying to access
  const routeAnalysis = useMemo(() => {
    const pathname = location.pathname;
    const parsed = parseRoute(pathname);

    let attemptedType: 'animal' | 'country' | 'combined' | 'unknown' = 'unknown';

    // Determine route type from patterns
    if (pathname.endsWith('-volunteer')) {
      attemptedType = 'animal';
    } else if (pathname.startsWith('/volunteer-')) {
      if (pathname.split('/').length > 2) {
        attemptedType = 'combined';
      } else {
        attemptedType = 'country';
      }
    } else if (pathname.includes('-volunteer/')) {
      attemptedType = 'combined';
    }

    return {
      pathname,
      type: attemptedType,
      parsed
    };
  }, [location.pathname]);

  // Get intelligent suggestions based on attempted route
  const suggestions = useMemo(() => {
    return getRouteSuggestions(routeAnalysis.pathname, routeAnalysis.type);
  }, [getRouteSuggestions, routeAnalysis]);

  // Determine progressive fallback route based on attempted route type
  const fallbackRoute = useMemo(() => {
    switch (routeAnalysis.type) {
      case 'animal':
        return {
          path: '/opportunities',
          text: 'Browse All Conservation Programs',
          description: 'Explore wildlife volunteer opportunities worldwide'
        };
      case 'country':
        return {
          path: '/opportunities',
          text: 'Browse All Destinations',
          description: 'Find volunteer programs in available countries'
        };
      case 'combined':
        return {
          path: '/opportunities',
          text: 'Browse All Programs',
          description: 'Discover conservation opportunities that match your interests'
        };
      default:
        return {
          path: '/',
          text: 'Go to Homepage',
          description: 'Start your conservation journey'
        };
    }
  }, [routeAnalysis.type]);

  // Track 404 for analytics
  const { track404 } = useRouteAnalytics();

  useEffect(() => {
    track404(
      routeAnalysis.pathname,
      routeAnalysis.type,
      suggestions.map(s => s.route),
      document.referrer
    );
  }, [routeAnalysis, suggestions, track404]);

  return (
    <div className="min-h-screen bg-soft-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-warm-sunset/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-warm-sunset" />
          </div>
        </motion.div>

        {/* Main Error Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-forest mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-forest/70 mb-8"
        >
          The page you're looking for doesn't exist or may have been moved.
        </motion.p>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-lg font-medium text-forest mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Did you mean one of these?
            </p>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.route}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    to={suggestion.route}
                    className="block p-4 bg-white rounded-lg hover:bg-warm-cream transition-colors shadow-sm border border-sage/10 group"
                    style={{ minHeight: '48px' }} // Ensure 48px touch target
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="font-medium text-forest group-hover:text-earth">{suggestion.title}</span>
                        <span className="text-sm text-forest/60 ml-2">({suggestion.matchReason})</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-sage group-hover:text-earth transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Progressive Fallback Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {/* Primary fallback action */}
          <Link
            to={fallbackRoute.path}
            className="inline-flex items-center justify-center px-8 py-3 bg-earth text-soft-cream font-medium rounded-lg hover:bg-earth/90 transition-colors gap-2 min-h-[48px]" // 48px touch target
          >
            <span>{fallbackRoute.text}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-sage text-sage font-medium rounded-lg hover:bg-sage hover:text-soft-cream transition-colors gap-2 min-h-[48px]" // 48px touch target
            >
              <Search className="w-4 h-4" />
              <span>Browse All Opportunities</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-sage text-sage font-medium rounded-lg hover:bg-sage hover:text-soft-cream transition-colors gap-2 min-h-[48px]" // 48px touch target
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>

          {/* Help text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-forest/60 mt-6"
          >
            {fallbackRoute.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SmartRouteHandler;