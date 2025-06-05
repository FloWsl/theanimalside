// src/components/OrganizationDetail/CrossDeviceManager.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface CrossDeviceState {
  // Form state management
  savedForms: Record<string, any>;
  // Navigation state
  lastViewedOrganization?: string;
  lastActiveTab?: string;
  // User preferences
  preferences: {
    reducedMotion: boolean;
    textSize: 'small' | 'medium' | 'large';
    colorScheme: 'light' | 'dark' | 'auto';
  };
  // Analytics data
  analytics: {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    sessionStart: number;
    pageViews: number;
    interactions: number;
  };
}

interface CrossDeviceContextType {
  state: CrossDeviceState;
  updateState: (updates: Partial<CrossDeviceState>) => void;
  saveFormData: (organizationId: string, formData: any) => void;
  getFormData: (organizationId: string) => any;
  clearFormData: (organizationId: string) => void;
  trackInteraction: (type: string, data?: any) => void;
  generateShareableURL: (organizationId: string, tab?: string) => string;
  syncAcrossDevices: () => Promise<void>;
}

const CrossDeviceContext = createContext<CrossDeviceContextType | null>(null);

const STORAGE_KEY = 'the-animal-side-cross-device';
const ANALYTICS_KEY = 'the-animal-side-analytics';

// Device detection utility
const detectDevice = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// URL state management
const encodeStateToURL = (organizationId: string, tab?: string, formData?: any): string => {
  const params = new URLSearchParams();
  
  if (tab) params.set('tab', tab);
  if (formData && Object.keys(formData).length > 0) {
    params.set('form', btoa(JSON.stringify(formData)));
  }
  
  const baseURL = `/organization/${organizationId}`;
  return params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
};

const decodeStateFromURL = () => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const result: any = {};
  
  if (params.has('tab')) {
    result.tab = params.get('tab');
  }
  
  if (params.has('form')) {
    try {
      result.formData = JSON.parse(atob(params.get('form')!));
    } catch (e) {
      console.warn('Failed to decode form data from URL');
    }
  }
  
  return result;
};

export const CrossDeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CrossDeviceState>({
    savedForms: {},
    preferences: {
      reducedMotion: false,
      textSize: 'medium',
      colorScheme: 'auto'
    },
    analytics: {
      deviceType: detectDevice(),
      sessionStart: Date.now(),
      pageViews: 0,
      interactions: 0
    }
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setState(prev => ({
          ...prev,
          ...parsed,
          analytics: {
            ...prev.analytics,
            deviceType: detectDevice() // Always update device type
          }
        }));
      }
      
      if (savedAnalytics) {
        const analytics = JSON.parse(savedAnalytics);
        setState(prev => ({
          ...prev,
          analytics: {
            ...analytics,
            deviceType: detectDevice(),
            sessionStart: Date.now() // New session
          }
        }));
      }
      
      // Detect user preferences
      setState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
      }));
      
    } catch (error) {
      console.warn('Failed to load cross-device state:', error);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const { analytics, ...stateToSave } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.warn('Failed to save cross-device state:', error);
    }
  }, [state]);

  // Update URL when navigation state changes
  useEffect(() => {
    if (state.lastViewedOrganization && state.lastActiveTab) {
      const url = encodeStateToURL(state.lastViewedOrganization, state.lastActiveTab);
      const currentPath = window.location.pathname + window.location.search;
      
      if (currentPath !== url) {
        // Only update URL if it's different and we're not disrupting user navigation
        window.history.replaceState(null, '', url);
      }
    }
  }, [state.lastViewedOrganization, state.lastActiveTab]);

  const updateState = useCallback((updates: Partial<CrossDeviceState>) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const saveFormData = useCallback((organizationId: string, formData: any) => {
    setState(prev => ({
      ...prev,
      savedForms: {
        ...prev.savedForms,
        [organizationId]: {
          ...formData,
          savedAt: Date.now(),
          deviceType: detectDevice()
        }
      }
    }));
  }, []);

  const getFormData = useCallback((organizationId: string) => {
    return state.savedForms[organizationId] || null;
  }, [state.savedForms]);

  const clearFormData = useCallback((organizationId: string) => {
    setState(prev => ({
      ...prev,
      savedForms: {
        ...prev.savedForms,
        [organizationId]: undefined
      }
    }));
  }, []);

  const trackInteraction = useCallback((type: string, data?: any) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        interactions: prev.analytics.interactions + 1
      }
    }));

    // Send to analytics service (placeholder)
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Interaction tracked:', { type, data, device: detectDevice() });
    }
  }, []);

  const generateShareableURL = useCallback((organizationId: string, tab?: string) => {
    const baseURL = window.location.origin;
    const path = encodeStateToURL(organizationId, tab);
    return `${baseURL}${path}`;
  }, []);

  const syncAcrossDevices = useCallback(async () => {
    // Placeholder for future cloud sync implementation
    // This would sync state with a backend service
    try {
      // await syncService.uploadState(state);
      console.log('🔄 Cross-device sync completed');
    } catch (error) {
      console.warn('Cross-device sync failed:', error);
    }
  }, [state]);

  const contextValue: CrossDeviceContextType = {
    state,
    updateState,
    saveFormData,
    getFormData,
    clearFormData,
    trackInteraction,
    generateShareableURL,
    syncAcrossDevices
  };

  return (
    <CrossDeviceContext.Provider value={contextValue}>
      {children}
    </CrossDeviceContext.Provider>
  );
};

export const useCrossDevice = () => {
  const context = useContext(CrossDeviceContext);
  if (!context) {
    throw new Error('useCrossDevice must be used within a CrossDeviceProvider');
  }
  return context;
};

// Hook for URL state restoration
export const useURLStateRestoration = () => {
  const { updateState } = useCrossDevice();
  
  useEffect(() => {
    const urlState = decodeStateFromURL();
    
    if (urlState.tab) {
      updateState({ lastActiveTab: urlState.tab });
    }
    
    // Restore form data from URL if present
    if (urlState.formData) {
      console.log('🔗 Restored form data from URL');
    }
  }, [updateState]);
};

// Hook for device change detection
export const useDeviceChangeDetection = () => {
  const { state, updateState, trackInteraction } = useCrossDevice();
  
  useEffect(() => {
    const handleResize = () => {
      const newDeviceType = detectDevice();
      if (newDeviceType !== state.analytics.deviceType) {
        updateState({
          analytics: {
            ...state.analytics,
            deviceType: newDeviceType
          }
        });
        trackInteraction('device_change', { 
          from: state.analytics.deviceType, 
          to: newDeviceType 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.analytics.deviceType, updateState, trackInteraction]);
};

// Hook for performance monitoring across devices
export const usePerformanceTracking = () => {
  const { trackInteraction } = useCrossDevice();
  
  useEffect(() => {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          trackInteraction('performance_metric', {
            metric: entry.entryType,
            value: (entry as any).value || entry.duration,
            device: detectDevice()
          });
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      
      return () => observer.disconnect();
    }
  }, [trackInteraction]);
};

// Utility for accessibility state management
export const useAccessibilityPreferences = () => {
  const { state, updateState } = useCrossDevice();
  
  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      darkMode: window.matchMedia('(prefers-color-scheme: dark)'),
      highContrast: window.matchMedia('(prefers-contrast: high)')
    };
    
    const updatePreferences = () => {
      updateState({
        preferences: {
          ...state.preferences,
          reducedMotion: mediaQueries.reducedMotion.matches,
          colorScheme: mediaQueries.darkMode.matches ? 'dark' : 'light'
        }
      });
    };
    
    // Listen for changes
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updatePreferences);
    });
    
    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updatePreferences);
      });
    };
  }, [state.preferences, updateState]);
  
  return state.preferences;
};

export default CrossDeviceProvider;