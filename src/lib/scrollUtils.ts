// Utility function for tab navigation scroll behavior
export const scrollToTabContent = () => {
  setTimeout(() => {
    // Check if we're on mobile or desktop
    const isMobile = window.innerWidth < 1024;
    
    let targetElement: Element | null = null;
    
    if (isMobile) {
      // On mobile, try to find the mobile-specific containers in order of preference
      targetElement = document.querySelector('.tab-content-container') ||
                     document.querySelector('.mobile-tab-content') ||
                     document.querySelector('.mobile-only') ||
                     document.querySelector('[role="tabpanel"]');
                     
      // Debug: Log what we found on mobile
      if (process.env.NODE_ENV === 'development') {
        console.log('Mobile scroll target:', targetElement?.className || 'not found');
      }
    } else {
      // On desktop, target the main content area
      targetElement = document.querySelector('.desktop-main-content') ||
                     document.querySelector('main') ||
                     document.querySelector('[role="tabpanel"]');
                     
      // Debug: Log what we found on desktop
      if (process.env.NODE_ENV === 'development') {
        console.log('Desktop scroll target:', targetElement?.className || 'not found');
      }
    }
    
    if (targetElement) {
      if (isMobile) {
        // Mobile: Use a more aggressive approach
        const rect = targetElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;
        
        // Scroll to top of the target element with small offset
        window.scrollTo({
          top: Math.max(0, offsetTop - 10),
          behavior: 'smooth'
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Mobile scroll to:', offsetTop - 10);
        }
      } else {
        // Desktop: Use scrollIntoView
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Desktop scrollIntoView triggered');
        }
      }
    } else {
      // Fallback: scroll to top of page
      if (process.env.NODE_ENV === 'development') {
        console.warn('No scroll target found, scrolling to page top');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 150); // Increased timeout for mobile rendering
};

// Higher-order function to wrap tab change with scroll behavior
export const withTabScroll = (onTabChange: (tabId: string) => void) => {
  return (tabId: string) => {
    onTabChange(tabId);
    scrollToTabContent();
  };
};