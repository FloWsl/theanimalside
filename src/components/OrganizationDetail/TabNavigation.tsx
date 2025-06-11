// src/components/OrganizationDetail/TabNavigation.tsx
import React from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Zap, 
  FileText, 
  MapPin, 
  MessageSquare, 
  Phone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useSmartNavigation } from '../../lib/useSmartNavigation';

export type TabId = 'overview' | 'experience' | 'practical' | 'location' | 'stories' | 'connect';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  className?: string;
  variant?: 'desktop' | 'mobile';
}

interface SwipeState {
  isScrolling: boolean;
  canSwipeNext: boolean;
  canSwipePrev: boolean;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: Zap
  },
  {
    id: 'practical',
    label: 'Practical',
    icon: FileText
  },
  {
    id: 'location',
    label: 'Location',
    icon: MapPin
  },
  {
    id: 'stories',
    label: 'Stories',
    icon: MessageSquare
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Phone
  }
];

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  className = '',
  variant = 'desktop'
}) => {
  // Smart navigation for mobile - scroll-based visibility with refined behavior
  const smartNav = useSmartNavigation({
    heroHeight: 500, // Adjust based on actual hero height
    footerOffset: 150,
    hideThreshold: 60, // More conservative - require more scroll to hide
    showThreshold: 20, // Show easier when scrolling up
    velocityThreshold: 2, // Detect "fast" scrolling (pixels/ms)
    fastScrollDistance: 120 // Distance for sustained scroll before hiding
  });
  
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  // Enhanced gesture navigation for mobile
  const handleSwipe = (event: any, info: PanInfo) => {
    if (variant !== 'mobile') return;
    
    const swipeThreshold = 50;
    const { offset } = info;
    
    // Horizontal swipe detection
    if (Math.abs(offset.x) > swipeThreshold && Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > 0 && activeTabIndex > 0) {
        // Swipe right - go to previous tab
        const prevIndex = Math.max(0, activeTabIndex - 1);
        onTabChange(tabs[prevIndex].id);
      } else if (offset.x < 0 && activeTabIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        const nextIndex = Math.min(tabs.length - 1, activeTabIndex + 1);
        onTabChange(tabs[nextIndex].id);
      }
    }
  };

  // Desktop Top Tab Bar
  if (variant === 'desktop') {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white/95 backdrop-blur-sm border border-beige/40 rounded-2xl shadow-nature overflow-hidden">
          <nav className="flex" role="tablist">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    group relative flex-1 px-4 py-4 text-center transition-all duration-300
                    ${isActive 
                      ? 'text-rich-earth bg-gradient-to-b from-white via-beige/20 to-beige/40 border-b-3 border-rich-earth' 
                      : 'text-forest/70 hover:text-rich-earth hover:bg-beige/30'
                    }
                    ${index === 0 ? 'rounded-l-2xl' : ''}
                    ${index === tabs.length - 1 ? 'rounded-r-2xl' : ''}
                    focus:outline-none focus:ring-2 focus:ring-rich-earth/40 focus:ring-inset
                    border-r border-beige/30 last:border-r-0
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-rich-earth scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className={`font-semibold text-sm transition-colors duration-300 ${
                      isActive ? 'text-rich-earth' : ''
                    }`}>
                      {tab.label}
                    </span>
                  </div>
                  
                  {/* Active indicator with enhanced styling */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rich-earth via-warm-sunset to-rich-earth rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  // Mobile Bottom Tab Bar - Native app style with smart visibility
  return (
    <AnimatePresence mode="wait">
      {smartNav.isVisible && (
        <motion.div 
          className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }
          }}
          exit={{ 
            y: 100, 
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: "easeInOut"
            }
          }}
        >
          {/* Shadow overlay for content underneath */}
          <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          
          <motion.div
            className="bg-white/98 backdrop-blur-lg border-t border-beige/30 shadow-nature-xl"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom), 16px)'
            }}
            onPan={handleSwipe}
            onPanEnd={handleSwipe}
          >
        <nav className="flex" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-1 px-1 py-2 min-h-[60px] touch-manipulation transition-all duration-300
                  ${isActive 
                    ? 'text-rich-earth' 
                    : 'text-forest/70 active:text-rich-earth active:bg-beige/20'
                  }
                  focus:outline-none focus:ring-2 focus:ring-rich-earth/40 focus:ring-inset rounded-lg mx-1
                `}
                whileTap={{ scale: 0.92 }}
                animate={{
                  scale: isActive ? 1.02 : 1,
                  y: isActive ? -2 : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30,
                  duration: 0.2 
                }}
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${
                      isActive ? 'text-rich-earth' : ''
                    }`} />
                  </motion.div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-rich-earth rounded-full"
                      layoutId="mobileActiveIndicator"
                      initial={{ scale: 0, x: '-50%' }}
                      animate={{ scale: 1, x: '-50%' }}
                      transition={{ 
                        type: "spring", 
                        bounce: 0.6, 
                        duration: 0.4 
                      }}
                    />
                  )}
                </div>
                
                <span className={`text-xs font-semibold leading-tight text-center transition-all duration-300 ${
                  isActive ? 'text-rich-earth scale-105' : 'scale-95'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TabNavigation;
export { tabs };
export type { Tab };