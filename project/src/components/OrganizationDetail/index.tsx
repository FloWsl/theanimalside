// src/components/OrganizationDetail/index.tsx - Enhanced Cross-Device Architecture
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getOrganizationBySlug } from '../../data/organizationDetails';
import { OrganizationDetail as OrganizationDetailType, Program } from '../../types';

// Import tab system components
import TabNavigation, { TabId } from './TabNavigation';
import { 
  OverviewTab,
  ExperienceTab, 
  PracticalTab,
  LocationTab,
  StoriesTab,
  ConnectTab 
} from './tabs';

// Import header and program selector
import OrganizationHeader from './OrganizationHeader';
import ProgramSelector from './ProgramSelector';

// Import layout components for responsive architecture
import { Layout } from '../Layout/Container';
import EssentialInfoSidebar from './EssentialInfoSidebar';

// Enhanced cross-device state management hook
const useCrossDeviceState = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'desktop'>('auto');
  
  // URL state synchronization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab && ['overview', 'experience', 'practical', 'location', 'stories', 'connect'].includes(urlTab)) {
      setActiveTab(urlTab as TabId);
    }
    
    // Restore state from localStorage
    const savedTab = localStorage.getItem('animal-side-active-tab');
    const savedSidebarState = localStorage.getItem('animal-side-sidebar-expanded');
    const savedViewMode = localStorage.getItem('animal-side-view-mode');
    
    if (savedTab && !urlTab) {
      setActiveTab(savedTab as TabId);
    }
    if (savedSidebarState) {
      setSidebarExpanded(JSON.parse(savedSidebarState));
    }
    if (savedViewMode) {
      setViewMode(savedViewMode as 'auto' | 'mobile' | 'desktop');
    }
  }, []);
  
  // Update URL and localStorage when tab changes
  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    localStorage.setItem('animal-side-active-tab', tabId);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url);
  }, []);
  
  // Update localStorage when sidebar state changes
  useEffect(() => {
    localStorage.setItem('animal-side-sidebar-expanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);
  
  // Update localStorage when view mode changes
  useEffect(() => {
    localStorage.setItem('animal-side-view-mode', viewMode);
  }, [viewMode]);
  
  return {
    activeTab,
    handleTabChange,
    sidebarExpanded,
    setSidebarExpanded,
    viewMode,
    setViewMode
  };
};

const OrganizationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Get organization data by slug
  const organization: OrganizationDetailType | undefined = slug ? getOrganizationBySlug(slug) : undefined;
  
  // State for selected program (defaults to first program)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(
    organization?.programs[0] || null
  );
  
  // Enhanced cross-device state management
  const {
    activeTab,
    handleTabChange,
    sidebarExpanded,
    setSidebarExpanded,
    viewMode,
    setViewMode
  } = useCrossDeviceState();
  
  // Enhanced responsive state management with smooth transitions
  const useResponsiveLayout = () => {
    const [layoutMode, setLayoutMode] = useState<'mobile' | 'desktop'>('mobile');
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    useEffect(() => {
      const updateLayout = () => {
        const newMode = window.innerWidth >= 1024 ? 'desktop' : 'mobile';
        if (newMode !== layoutMode) {
          setIsTransitioning(true);
          setTimeout(() => {
            setLayoutMode(newMode);
            setIsTransitioning(false);
          }, 150);
        }
      };
      
      updateLayout();
      window.addEventListener('resize', updateLayout);
      return () => window.removeEventListener('resize', updateLayout);
    }, [layoutMode]);
    
    return { layoutMode, isTransitioning, isDesktop: layoutMode === 'desktop' };
  };
  
  const { layoutMode, isTransitioning, isDesktop } = useResponsiveLayout();

  // Performance optimization hook
  const usePerformanceOptimization = () => {
    // Monitor layout performance and potential issues
    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        // Monitor for layout shifts
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && entry.value > 0.1) {
              console.warn('Layout shift detected:', entry.value);
            }
          }
        });
        
        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // PerformanceObserver not supported, gracefully degrade
        }
        
        return () => {
          try {
            observer.disconnect();
          } catch (e) {
            // Silent fail if observer wasn't supported
          }
        };
      }
    }, [layoutMode]);
    
    // Optimize component rendering based on layout mode
    const optimizedComponents = React.useMemo(() => {
      if (isDesktop) {
        return {
          enableDesktopOptimizations: true,
          reducedAnimations: false,
          lazyLoad: false // Desktop has better performance, can load immediately
        };
      }
      return {
        enableDesktopOptimizations: false,
        reducedAnimations: true, // Preserve mobile performance
        lazyLoad: true // Mobile benefits from lazy loading
      };
    }, [isDesktop]);
    
    return optimizedComponents;
  };
  
  const performanceConfig = usePerformanceOptimization();

  // Update selected program when organization changes
  React.useEffect(() => {
    if (organization && !selectedProgram) {
      setSelectedProgram(organization.programs[0]);
    }
  }, [organization, selectedProgram]);
  
  // Enhanced content rendering with desktop optimization
  const renderOptimizedTabContent = () => {
    if (!organization || !selectedProgram) return null;
    
    const commonProps = {
      organization,
      isDesktop,
      sidebarVisible: isDesktop
    };
    
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            {...commonProps}
            hideDuplicateInfo={isDesktop}
            onTabChange={handleTabChange}
          />
        );
      case 'experience':
        return <ExperienceTab {...commonProps} />;
      case 'practical':
        return (
          <PracticalTab 
            {...commonProps}
            selectedProgram={selectedProgram}
            hideDuplicateInfo={isDesktop}
            onTabChange={handleTabChange}
          />
        );
      case 'location':
        return (
          <LocationTab 
            {...commonProps}
            hideDuplicateInfo={isDesktop}
          />
        );
      case 'stories':
        return <StoriesTab {...commonProps} />;
      case 'connect':
        return <ConnectTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} hideDuplicateInfo={isDesktop} onTabChange={handleTabChange} />;
    }
  };
  
  // Layout-aware state restoration
  const restoreLayoutState = useCallback((layoutMode: 'mobile' | 'desktop') => {
    if (layoutMode === 'desktop') {
      // Restore sidebar expansion state for desktop
      const savedSidebarState = localStorage.getItem('animal-side-sidebar-expanded');
      if (savedSidebarState) {
        setSidebarExpanded(JSON.parse(savedSidebarState));
      }
    }
    
    // Restore active tab state for both layouts
    const savedTab = localStorage.getItem('animal-side-active-tab');
    if (savedTab && ['overview', 'experience', 'practical', 'location', 'stories', 'connect'].includes(savedTab)) {
      handleTabChange(savedTab as TabId);
    }
  }, [setSidebarExpanded, handleTabChange]);
  
  // Call state restoration when layout mode changes
  useEffect(() => {
    restoreLayoutState(layoutMode);
  }, [layoutMode, restoreLayoutState]);
  
  // Desktop Layout (1024px+) - Enhanced two-column layout with performance optimizations
  const DesktopLayout = () => {
    const layoutClasses = `hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 desktop-only ${
      performanceConfig.enableDesktopOptimizations ? 'desktop-layout' : ''
    } ${
      performanceConfig.reducedAnimations ? '' : 'layout-transition responsive-container'
    } ${
      isTransitioning ? 'transitioning' : ''
    }`;
    
    return (
      <div className={layoutClasses}>
        <main className="lg:min-h-0 desktop-main-content">
          {/* Enhanced tab navigation with performance optimizations */}
          <div className="lg:mb-6">
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              className={`desktop-tab-nav ${
                performanceConfig.enableDesktopOptimizations ? 'desktop-optimized' : ''
              }`}
            />
          </div>
          <div 
            role="tabpanel" 
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="desktop-tab-content context-preserved"
            style={{
              contain: performanceConfig.enableDesktopOptimizations ? 'layout style' : 'auto'
            }}
          >
            {renderOptimizedTabContent()}
          </div>
        </main>
        <aside 
          role="complementary" 
          aria-label="Essential program information"
          className={`lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto sidebar-desktop desktop-sidebar-content sidebar-container ${
            performanceConfig.enableDesktopOptimizations ? 'performance-optimized' : ''
          }`}
        >
          {/* Conditionally wrap sidebar in Suspense for performance */}
          {performanceConfig.lazyLoad ? (
            <React.Suspense 
              fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-beige/40 rounded-xl" />
                  <div className="h-32 bg-beige/40 rounded-xl" />
                  <div className="h-24 bg-beige/40 rounded-xl" />
                </div>
              }
            >
              <EssentialInfoSidebar 
                organization={organization} 
                selectedProgram={selectedProgram}
                isDesktop={isDesktop}
                className="lg:space-y-4"
              />
            </React.Suspense>
          ) : (
            <EssentialInfoSidebar 
              organization={organization} 
              selectedProgram={selectedProgram}
              isDesktop={isDesktop}
              className="lg:space-y-4"
            />
          )}
        </aside>
      </div>
    );
  };

  // Mobile Layout (preserved) - Enhanced with cross-device state persistence
  const MobileLayout = () => (
    <div className={`lg:hidden mobile-only mobile-tab-system mobile-tab-container layout-transition state-preservation ${
      isTransitioning ? 'transitioning' : ''
    }`}>
      {/* Enhanced mobile TabNavigation with cross-device state */}
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-8 mobile-tab-nav mobile-touch-optimized"
      />
      
      {/* Preserve existing tab content structure with enhanced state management */}
      <div 
        className="tab-content-container mobile-tab-content mobile-content-flow context-preserved"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderOptimizedTabContent()}
      </div>
    </div>
  );
  
  // Handle loading and error states
  if (!slug) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-section text-forest">Organization Not Found</h1>
          <p className="text-body text-forest/70">The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  if (!organization) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-section text-forest">Loading...</h1>
          <p className="text-body text-forest/70">Fetching organization details...</p>
        </div>
      </div>
    );
  }

  if (!selectedProgram) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-section text-forest">No Programs Available</h1>
          <p className="text-body text-forest/70">This organization doesn't have any active programs.</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* SEO and Meta Tags */}
      <Helmet>
        <title>{organization.name} | Wildlife Volunteer Program | The Animal Side</title>
        <meta 
          name="description" 
          content={`${organization.tagline} - ${organization.mission.slice(0, 160)}...`} 
        />
        <meta name="keywords" content={organization.tags.join(', ')} />
        <meta property="og:title" content={`${organization.name} | Wildlife Volunteer Program`} />
        <meta property="og:description" content={organization.tagline} />
        <meta property="og:image" content={organization.heroImage} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://theanimalside.com/organization/${organization.slug}`} />
      </Helmet>

      {/* Main Container */}
      <div className="min-h-screen bg-cream">
        {/* Organization Header */}
        <OrganizationHeader organization={organization} />
        
        {/* Main Content Layout */}
        <div className="container-nature section-padding">
          <div className="max-w-6xl mx-auto">
            
            {/* Program Selector (only shows if multiple programs) */}
            {organization.programs.length > 1 && (
              <div className="mb-8">
                <ProgramSelector 
                  programs={organization.programs}
                  selectedProgram={selectedProgram}
                  onProgramChange={setSelectedProgram}
                />
              </div>
            )}
            
            {/* Responsive Layout - Desktop two-column + Mobile tabs */}
            <DesktopLayout />
            <MobileLayout />
            
          </div>
        </div>
      </div>
    </>
  );
};



export default OrganizationDetail;