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
    isVisible: false,
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
    
    // Determine visibility with refined logic
    let isVisible = scrollState.isVisible;
    
    if (!isPastHero) {
      // Hide navigation if not past hero
      isVisible = false;
    } else if (isNearFooter) {
      // Hide navigation when near footer
      isVisible = false;
    } else if (newIsInContentZone) {
      // In content zone - be more conservative about hiding
      if (scrollDirection === 'down') {
        // Only hide on sustained fast scrolling OR very long scroll
        const isFastScroll = scrollVelocity > velocityThreshold;
        const isLongScroll = newAccumulator > fastScrollDistance;
        
        if ((isFastScroll && newAccumulator > hideThreshold) || isLongScroll) {
          isVisible = false;
          newAccumulator = 0;
        }
      } else if (scrollDirection === 'up' && Math.abs(newAccumulator) > showThreshold) {
        // Always show when scrolling up in content zone
        isVisible = true;
        newAccumulator = 0;
      } else if (scrollDirection === 'none' && !isVisible) {
        // Show when stopped scrolling in content zone
        isVisible = true;
      }
    } else {
      // Outside content zone - use original logic
      if (scrollDirection === 'down' && newAccumulator > hideThreshold) {
        isVisible = false;
        newAccumulator = 0;
      } else if (scrollDirection === 'up' && Math.abs(newAccumulator) > showThreshold) {
        isVisible = true;
        newAccumulator = 0;
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