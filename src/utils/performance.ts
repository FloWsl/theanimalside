// Performance monitoring utilities
export const measurePageLoad = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metricName = entry.name;
        const metricValue = entry.value || entry.startTime;
        
        // Log performance metrics (replace with analytics in production)
        console.log(`${metricName}: ${Math.round(metricValue)}ms`);
      }
    });

    // Observe paint and navigation metrics
    observer.observe({ entryTypes: ['paint', 'navigation', 'largest-contentful-paint'] });

    // Measure bundle loading time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      const loadComplete = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`TTFB: ${Math.round(ttfb)}ms`);
      console.log(`Load Complete: ${Math.round(loadComplete)}ms`);
    }
  });
};

// Lazy loading utility for images
export const setupImageObserver = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};