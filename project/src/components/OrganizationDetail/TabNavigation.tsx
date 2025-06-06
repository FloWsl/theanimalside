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
  className = '' 
}) => {
  const [showScrollButtons, setShowScrollButtons] = React.useState(false);
  const [swipeState, setSwipeState] = React.useState<SwipeState>({
    isScrolling: false,
    canSwipeNext: true,
    canSwipePrev: true
  });
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  // Check if scroll buttons are needed and update swipe state
  React.useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        const needsScroll = scrollWidth > clientWidth;
        setShowScrollButtons(needsScroll);
        
        // Update swipe state for gesture navigation
        setSwipeState({
          isScrolling: needsScroll,
          canSwipeNext: activeTabIndex < tabs.length - 1,
          canSwipePrev: activeTabIndex > 0
        });
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [activeTabIndex]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Enhanced gesture navigation for mobile
  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset } = info;
    
    // Horizontal swipe detection
    if (Math.abs(offset.x) > swipeThreshold && Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > 0 && swipeState.canSwipePrev) {
        // Swipe right - go to previous tab
        const prevIndex = Math.max(0, activeTabIndex - 1);
        onTabChange(tabs[prevIndex].id);
      } else if (offset.x < 0 && swipeState.canSwipeNext) {
        // Swipe left - go to next tab
        const nextIndex = Math.min(tabs.length - 1, activeTabIndex + 1);
        onTabChange(tabs[nextIndex].id);
      }
    }
  };

  // Scroll active tab into view on mobile
  React.useEffect(() => {
    if (scrollContainerRef.current && activeTabIndex >= 0) {
      const container = scrollContainerRef.current;
      const activeButton = container.children[activeTabIndex] as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTabIndex]);

  return (
    <div className={`relative ${className}`}>
      {/* Desktop Tab Navigation */}
      <div className="hidden md:block">
        <div className="border-b border-beige/60 bg-white/80 backdrop-blur-sm rounded-t-2xl">
          <nav className="flex space-x-0" role="tablist">
            {tabs.map((tab) => {
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
                    group relative flex-1 px-4 py-4 lg:px-6 lg:py-5 text-center transition-all duration-300
                    ${isActive 
                      ? 'text-rich-earth bg-gradient-to-b from-white to-beige/30 border-b-2 border-rich-earth' 
                      : 'text-forest/70 hover:text-forest hover:bg-beige/20'
                    }
                    focus:outline-none focus:ring-2 focus:ring-rich-earth/50 focus:ring-inset
                    first:rounded-tl-2xl last:rounded-tr-2xl
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-200 ${
                      isActive ? 'scale-110 text-rich-earth' : 'group-hover:scale-105'
                    }`} />
                    <div>
                      <div className={`font-medium text-sm lg:text-base ${
                        isActive ? 'text-rich-earth' : ''
                      }`}>
                        {tab.label}
                      </div>

                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rich-earth to-sunset" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Enhanced Mobile Tab Navigation */}
      <div className="md:hidden">
        {/* Tab Progress Indicator */}
        <div className="mb-4">
          <div className="flex justify-center items-center gap-1">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeTabIndex 
                    ? 'w-6 bg-rich-earth' 
                    : index < activeTabIndex 
                    ? 'w-3 bg-sage-green' 
                    : 'w-3 bg-sage-green/20'
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-deep-forest/60 font-medium">
              Step {activeTabIndex + 1} of {tabs.length}
            </span>
          </div>
        </div>

        {/* Enhanced Tab Container with Gesture Support */}
        <motion.div
          className="relative bg-white/95 backdrop-blur-sm border-2 border-sage-green/10 rounded-2xl p-2 shadow-lg"
          onPan={handleSwipe}
          onPanEnd={handleSwipe}
        >
          {/* Enhanced Scroll Indicators */}
          <AnimatePresence>
            {showScrollButtons && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border-2 border-sage-green/20 text-deep-forest/70 hover:text-rich-earth transition-all duration-200 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border-2 border-sage-green/20 text-deep-forest/70 hover:text-rich-earth transition-all duration-200 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
          
          {/* Enhanced Scrollable Tab Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide px-12 sm:px-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab, index) => {
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
                    flex-shrink-0 flex flex-col items-center gap-2 px-4 py-4 min-w-[90px] min-h-[48px] rounded-2xl transition-all duration-300 touch-manipulation relative overflow-hidden
                    ${
                      isActive 
                        ? 'bg-gradient-to-br from-rich-earth/15 via-sage-green/10 to-warm-sunset/5 text-rich-earth shadow-md border-2 border-rich-earth/20' 
                        : 'text-deep-forest/70 hover:text-rich-earth hover:bg-sage-green/10 active:bg-sage-green/20'
                    }
                    focus:outline-none focus:ring-3 focus:ring-rich-earth/40 focus:ring-offset-2
                  `}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  {/* Active Tab Background Effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-rich-earth/5 to-warm-sunset/5 rounded-2xl"
                      layoutId="activeTabBackground"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon with Enhanced Animation */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? [0, -5, 5, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`w-6 h-6 relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-rich-earth' : ''
                    }`} />
                  </motion.div>
                  
                  {/* Label with Better Typography */}
                  <span className={`text-sm font-semibold text-center leading-tight relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-rich-earth' : ''
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Active Tab Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-1 left-1/2 w-8 h-1 bg-rich-earth rounded-full"
                      layoutId="activeTabIndicator"
                      initial={{ translateX: '-50%' }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Active Tab with Animation */}
        <AnimatePresence mode="wait">
          <motion.div  
            key={activeTab}
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >

          </motion.div>
        </AnimatePresence>

        {/* Swipe Hint for First-Time Users */}
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-deep-forest/40">
            <MoreHorizontal className="w-4 h-4" />
            <span>Swipe to navigate</span>
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
export { tabs };
export type { Tab };