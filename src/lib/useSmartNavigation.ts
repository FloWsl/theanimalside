// src/lib/useSmartNavigation.ts
// Smart mobile navigation hook with scroll-based visibility
import { useState, useEffect, useCallback } from 'react';

interface ScrollState {
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isVisible: boolean;
  isPastHero: boolean;
  isNearFooter: boolean;
}

interface UseSmartNavigationOptions {
  heroHeight?: number;
  footerOffset?: number;
  hideThreshold?: number;
  showThreshold?: number;
  velocityThreshold?: number;
  fastScrollDistance?: number;
}

export const useSmartNavigation = (options: UseSmartNavigationOptions = {}) => {
  const {
    heroHeight = 400, // Default hero section height
    footerOffset = 200, // Hide navigation when this close to footer
    hideThreshold = 50, // Hide after scrolling down this much (increased)
    showThreshold = 15,   // Show after scrolling up this much (increased)
    velocityThreshold = 3, // Pixels per frame for "fast" scroll
    fastScrollDistance = 100 // Distance for sustained fast scroll
  } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: 'none',
    isVisible: false, // Start hidden until past hero
    isPastHero: false,
    isNearFooter: false
  });

  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [isInContentZone, setIsInContentZone] = useState(false);

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : 'none';
    
    // Calculate scroll velocity (pixels per ms)
    const timeDelta = currentTime - lastScrollTime;
    const scrollDelta = currentScrollY - lastScrollY;
    const scrollVelocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;
    
    // Calculate if we're past hero section
    const isPastHero = currentScrollY > heroHeight;
    
    // Calculate if we're near footer
    const distanceFromBottom = documentHeight - (currentScrollY + windowHeight);
    const isNearFooter = distanceFromBottom < footerOffset;
    
    // Determine if we're in the "content zone" where navigation should stay visible
    const newIsInContentZone = isPastHero && !isNearFooter;
    setIsInContentZone(newIsInContentZone);
    
    // Accumulate scroll for threshold-based hiding/showing
    let newAccumulator = scrollAccumulator + scrollDelta;
    
    // Reset accumulator when changing direction
    if ((scrollDirection === 'down' && scrollDelta < 0) || 
        (scrollDirection === 'up' && scrollDelta > 0)) {
      newAccumulator = scrollDelta;
    }
    
    // Determine visibility with proper hero-based logic
    let isVisible = scrollState.isVisible;
    
    if (!isPastHero) {
      // Hide navigation in hero section
      isVisible = false;
    } else if (isNearFooter) {
      // Hide navigation when near footer
      isVisible = false;
    } else {
      // Past hero but not near footer - main content area
      // Default to visible in main content, only hide during sustained fast scrolling
      if (scrollDirection === 'down') {
        // Only hide on very sustained fast scrolling
        const isFastScroll = scrollVelocity > velocityThreshold;
        const isLongScroll = newAccumulator > fastScrollDistance;
        
        if (isFastScroll && isLongScroll) {
          isVisible = false;
          newAccumulator = 0;
        } else {
          // Stay visible during normal scrolling in content area
          isVisible = true;
        }
      } else if (scrollDirection === 'up') {
        // Always show when scrolling up in content area
        isVisible = true;
        newAccumulator = 0;
      } else {
        // Default to visible when in content area
        isVisible = true;
      }
    }
    
    setScrollState({
      scrollY: currentScrollY,
      scrollDirection,
      isVisible,
      isPastHero,
      isNearFooter
    });
    
    setLastScrollY(currentScrollY);
    setLastScrollTime(currentTime);
    setScrollAccumulator(newAccumulator);
  }, [lastScrollY, lastScrollTime, scrollAccumulator, heroHeight, footerOffset, hideThreshold, showThreshold, velocityThreshold, fastScrollDistance, scrollState.isVisible, isInContentZone]);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    updateScrollState();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollState;
};