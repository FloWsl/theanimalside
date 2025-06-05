// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\utils\analytics\discoveryAnalytics.ts

/**
 * Discovery Section Analytics Tracking
 * 
 * Comprehensive analytics system for tracking user interactions in the Discovery section
 * to validate the success of the search-free header implementation.
 */

// Event types for discovery section tracking
export interface DiscoveryEvent {
  type: 'animal_filter_click' | 'discovery_section_enter' | 'discovery_section_exit' | 
        'map_interaction' | 'feed_interaction' | 'header_type_view' | 'confusion_indicator';
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
  headerVersion: 'search-free' | 'enhanced' | 'original';
}

// Performance metrics for monitoring
export interface PerformanceMetrics {
  sectionLoadTime: number;
  animationFrameRate: number;
  interactionDelay: number;
  memoryUsage?: number;
}

// User engagement metrics
export interface EngagementMetrics {
  timeInDiscoverySection: number;
  animalFilterClicks: number;
  mapInteractions: number;
  feedInteractions: number;
  exitIntent: boolean;
  conversionToOpportunity: boolean;
}

class DiscoveryAnalytics {
  private events: DiscoveryEvent[] = [];
  private sessionId: string;
  private startTime: number = 0;
  private performanceObserver?: PerformanceObserver;
  private intersectionObserver?: IntersectionObserver;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceMonitoring();
    this.initializeSectionObserver();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track animal filter button clicks
   */
  trackAnimalFilterClick(animalId: string, headerVersion: 'search-free' | 'enhanced' | 'original') {
    this.trackEvent({
      type: 'animal_filter_click',
      timestamp: Date.now(),
      data: {
        animalId,
        clickPosition: this.getClickPosition(animalId),
        timeFromSectionEntry: this.getTimeFromSectionEntry()
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Track Discovery section entry
   */
  trackDiscoverySectionEnter(headerVersion: 'search-free' | 'enhanced' | 'original') {
    this.startTime = Date.now();
    this.trackEvent({
      type: 'discovery_section_enter',
      timestamp: this.startTime,
      data: {
        viewport: this.getViewportInfo(),
        device: this.getDeviceInfo(),
        referrer: document.referrer
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Track Discovery section exit
   */
  trackDiscoverySectionExit(headerVersion: 'search-free' | 'enhanced' | 'original') {
    const timeSpent = this.getTimeFromSectionEntry();
    this.trackEvent({
      type: 'discovery_section_exit',
      timestamp: Date.now(),
      data: {
        timeSpent,
        engagementScore: this.calculateEngagementScore(),
        exitType: this.determineExitType()
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Track map interactions
   */
  trackMapInteraction(interactionType: string, data: Record<string, any>, headerVersion: 'search-free' | 'enhanced' | 'original') {
    this.trackEvent({
      type: 'map_interaction',
      timestamp: Date.now(),
      data: {
        interactionType,
        ...data,
        timeFromSectionEntry: this.getTimeFromSectionEntry()
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Track feed interactions
   */
  trackFeedInteraction(interactionType: string, data: Record<string, any>, headerVersion: 'search-free' | 'enhanced' | 'original') {
    this.trackEvent({
      type: 'feed_interaction',
      timestamp: Date.now(),
      data: {
        interactionType,
        ...data,
        timeFromSectionEntry: this.getTimeFromSectionEntry()
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Track potential confusion indicators
   */
  trackConfusionIndicator(indicator: string, data: Record<string, any>, headerVersion: 'search-free' | 'enhanced' | 'original') {
    this.trackEvent({
      type: 'confusion_indicator',
      timestamp: Date.now(),
      data: {
        indicator,
        ...data,
        timeFromSectionEntry: this.getTimeFromSectionEntry()
      },
      sessionId: this.sessionId,
      headerVersion
    });
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor animation frame rate
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.trackPerformanceMetric(entry.name, entry.duration);
          }
        });
      });
      
      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Monitor frame rate
    this.monitorFrameRate();
  }

  /**
   * Monitor animation frame rate
   */
  private monitorFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsWindow = 60; // Calculate FPS over 60 frames

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (frameCount >= fpsWindow) {
        const fps = Math.round(1000 * fpsWindow / (currentTime - lastTime));
        this.trackPerformanceMetric('fps', fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  /**
   * Initialize section observer for automatic entry/exit tracking
   */
  private initializeSectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target.id === 'discovery-section') {
              const headerVersion = this.getHeaderVersion();
              if (entry.isIntersecting) {
                this.trackDiscoverySectionEnter(headerVersion);
              } else if (this.startTime > 0) {
                this.trackDiscoverySectionExit(headerVersion);
              }
            }
          });
        },
        { threshold: 0.1 }
      );
    }
  }

  /**
   * Get current header version from DOM or feature flags
   */
  private getHeaderVersion(): 'search-free' | 'enhanced' | 'original' {
    // Check for search-free header
    if (document.querySelector('[data-header-type="search-free"]')) {
      return 'search-free';
    }
    // Check for enhanced header  
    if (document.querySelector('[data-header-type="enhanced"]')) {
      return 'enhanced';
    }
    return 'original';
  }

  /**
   * Generic event tracking
   */
  private trackEvent(event: DiscoveryEvent) {
    this.events.push(event);
    
    // Send to analytics service (replace with your analytics provider)
    this.sendToAnalytics(event);
    
    // Store in localStorage for offline analysis
    this.storeEventLocally(event);
  }

  /**
   * Send event to analytics service
   */
  private sendToAnalytics(event: DiscoveryEvent) {
    // Example: Google Analytics 4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', event.type, {
        custom_parameter_1: event.data,
        session_id: event.sessionId,
        header_version: event.headerVersion
      });
    }

    // Example: Custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(console.error);
    }
  }

  /**
   * Store event locally for offline analysis
   */
  private storeEventLocally(event: DiscoveryEvent) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('discovery_events') || '[]');
      existingEvents.push(event);
      
      // Keep only last 100 events to prevent storage overflow
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      
      localStorage.setItem('discovery_events', JSON.stringify(existingEvents));
    } catch (error) {
      console.warn('Failed to store analytics event locally:', error);
    }
  }

  /**
   * Calculate engagement score based on user interactions
   */
  private calculateEngagementScore(): number {
    const animalClicks = this.events.filter(e => e.type === 'animal_filter_click').length;
    const mapInteractions = this.events.filter(e => e.type === 'map_interaction').length;
    const feedInteractions = this.events.filter(e => e.type === 'feed_interaction').length;
    const timeSpent = this.getTimeFromSectionEntry();
    
    // Score based on engagement (0-100)
    let score = 0;
    score += Math.min(animalClicks * 10, 30); // Max 30 points for animal clicks
    score += Math.min(mapInteractions * 5, 20); // Max 20 points for map interactions  
    score += Math.min(feedInteractions * 5, 20); // Max 20 points for feed interactions
    score += Math.min(timeSpent / 1000 / 30 * 30, 30); // Max 30 points for time (30s = full points)
    
    return Math.round(score);
  }

  /**
   * Helper methods
   */
  private getTimeFromSectionEntry(): number {
    return this.startTime > 0 ? Date.now() - this.startTime : 0;
  }

  private getClickPosition(animalId: string): number {
    const buttons = document.querySelectorAll('[data-animal-id]');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('data-animal-id') === animalId) {
        return i;
      }
    }
    return -1;
  }

  private getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }

  private getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      isTablet: /tablet|ipad/i.test(navigator.userAgent)
    };
  }

  private determineExitType(): string {
    const lastEvent = this.events[this.events.length - 1];
    if (lastEvent?.type === 'animal_filter_click') return 'animal_selection';
    if (lastEvent?.type === 'map_interaction') return 'map_exploration';
    if (lastEvent?.type === 'feed_interaction') return 'opportunity_click';
    return 'passive_scroll';
  }

  private trackPerformanceMetric(name: string, value: number) {
    // Track performance metrics
    console.log(`Performance: ${name} = ${value}`);
  }

  /**
   * Get analytics summary for the current session
   */
  getSessionSummary(): EngagementMetrics {
    return {
      timeInDiscoverySection: this.getTimeFromSectionEntry(),
      animalFilterClicks: this.events.filter(e => e.type === 'animal_filter_click').length,
      mapInteractions: this.events.filter(e => e.type === 'map_interaction').length,
      feedInteractions: this.events.filter(e => e.type === 'feed_interaction').length,
      exitIntent: false, // Implement exit intent detection
      conversionToOpportunity: this.events.some(e => 
        e.type === 'feed_interaction' && e.data.interactionType === 'opportunity_click'
      )
    };
  }

  /**
   * Export all events for analysis
   */
  exportEvents(): DiscoveryEvent[] {
    return [...this.events];
  }

  /**
   * Start observing a discovery section element
   */
  observeDiscoverySection(element: HTMLElement) {
    if (this.intersectionObserver) {
      element.id = 'discovery-section';
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Cleanup observers
   */
  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// Create singleton instance
export const discoveryAnalytics = new DiscoveryAnalytics();

// Export types
export type { DiscoveryEvent, PerformanceMetrics, EngagementMetrics };
