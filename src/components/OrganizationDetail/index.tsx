// src/components/OrganizationDetail/index.tsx - Enhanced Cross-Device Architecture
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { OrganizationService } from '../../services/organizationService';
import type { Organization, Program } from '../../types/database';

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
import SmartNavigation from '../SmartNavigation';
import ProgramSelector from './ProgramSelector';

// Import layout components for responsive architecture
import { Layout } from '../Layout/Container';
import EssentialInfoSidebar from './EssentialInfoSidebar';
import Breadcrumb, { useBreadcrumbs } from '../ui/Breadcrumb';

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
    
    // Scroll to top of content
    setTimeout(() => {
      const contentElement = document.querySelector('.tab-content-container, .desktop-tab-content');
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to window scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100); // Small delay to ensure tab content has rendered
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
  const breadcrumbs = useBreadcrumbs();
  
  // Query organization data by slug
  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => OrganizationService.getOrganizationBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query primary program for the organization
  const { data: primaryProgram } = useQuery({
    queryKey: ['organization-primary-program', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;
      const overview = await OrganizationService.getOverview(organization.id);
      return overview.primary_program;
    },
    enabled: !!organization?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Query all programs for the organization (for ProgramSelector)
  const { data: allPrograms = [] } = useQuery({
    queryKey: ['organization-all-programs', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      const experience = await OrganizationService.getExperience(organization.id);
      return experience.programs;
    },
    enabled: !!organization?.id,
    staleTime: 10 * 60 * 1000, // Programs change less frequently
  });
  
  // State for selected program (defaults to primary program)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  // Update selected program when programs load
  useEffect(() => {
    if (allPrograms.length > 0 && !selectedProgram) {
      // Find primary program in the list, or default to first program
      const primary = allPrograms.find(p => p.is_primary) || allPrograms[0];
      setSelectedProgram(primary);
    }
  }, [allPrograms, selectedProgram]);

  // Program change handler
  const handleProgramChange = (program: Program) => {
    setSelectedProgram(program);
  };
  
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

  // Update selected program when primary program changes
  
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
            organizationId={organization.id}
            hideDuplicateInfo={isDesktop}
            onTabChange={handleTabChange}
          />
        );
      case 'experience':
        return <ExperienceTab organizationId={organization.id} onTabChange={handleTabChange} />;
      case 'practical':
        return (
          <PracticalTab 
            organizationId={organization.id}
            hideDuplicateInfo={isDesktop}
            onTabChange={handleTabChange}
          />
        );
      case 'location':
        return (
          <LocationTab 
            organizationId={organization.id}
            hideDuplicateInfo={isDesktop}
            onTabChange={handleTabChange}
          />
        );
      case 'stories':
        return <StoriesTab organizationId={organization.id} />;
      case 'connect':
        return <ConnectTab organizationId={organization.id} />;
      default:
        return <OverviewTab organizationId={organization.id} hideDuplicateInfo={isDesktop} onTabChange={handleTabChange} />;
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
  
  // Desktop Layout (1024px+) - Tab navigation left of essential info, content below navigation
  const DesktopLayout = () => {
    const layoutClasses = `hidden lg:block desktop-only ${
      performanceConfig.enableDesktopOptimizations ? 'desktop-layout' : ''
    } ${
      performanceConfig.reducedAnimations ? '' : 'layout-transition responsive-container'
    } ${
      isTransitioning ? 'transitioning' : ''
    }`;
    
    return (
      <div className={layoutClasses}>
        {/* Main Grid: Left column (Tab Nav + Content) + Right column (Sidebar) */}
        <div className="grid lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* Left Column: Tab Navigation + Tab Content */}
          <div className="flex flex-col">
            {/* Tab Navigation */}
            <div className="mb-6">
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={handleTabChange}
                variant="desktop"
              />
            </div>
            
            {/* Tab Content */}
            <main className="desktop-main-content flex-1">
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
              
              {/* Continue Your Discovery Section - Below tab content, within left column */}
              {organization && (
                <div className="mt-12 pt-8 border-t border-warm-beige/30">
                  <SmartNavigation
                    organization={organization}
                    currentTab={activeTab}
                    variant="inline"
                  />
                </div>
              )}
            </main>
          </div>
          
          {/* Right Column: Essential Info Sidebar */}
          <aside 
            role="complementary" 
            aria-label="Essential program information"
            className={`lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto desktop-sidebar-content ${
              performanceConfig.enableDesktopOptimizations ? 'performance-optimized' : ''
            }`}
          >
            {/* Conditionally wrap sidebar in Suspense for performance */}
            {organization && selectedProgram && (
              performanceConfig.lazyLoad ? (
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
                    organizationId={organization.id}
                    selectedProgramId={selectedProgram?.id}
                    isDesktop={isDesktop}
                    className="lg:space-y-4"
                  />
                </React.Suspense>
              ) : (
                <EssentialInfoSidebar 
                  organizationId={organization.id}
                  selectedProgramId={selectedProgram?.id}
                  isDesktop={isDesktop}
                  className="lg:space-y-4"
                />
              )
            )}
          </aside>
        </div>
      </div>
    );
  };

  // Mobile Layout - Content only (navigation rendered separately)
  const MobileLayout = () => (
    <div className={`lg:hidden mobile-only mobile-tab-system layout-transition state-preservation ${
      isTransitioning ? 'transitioning' : ''
    }`}>
      {/* Mobile Tab Content with smart bottom padding */}
      <div 
        className="tab-content-container mobile-tab-content mobile-content-flow context-preserved pb-8"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderOptimizedTabContent()}
        
        {/* Continue Your Discovery Section - Below tab content on mobile */}
        {organization && (
          <div className="mt-12 pt-8 border-t border-warm-beige/30">
            <SmartNavigation
              organization={organization}
              currentTab={activeTab}
              variant="inline"
            />
          </div>
        )}
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
  
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-soft-cream">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-forest/70 text-sm">Loading organization...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error handling - show 404 if organization not found
  if (error || !organization) {
    return (
      <Layout>
        <div className="min-h-screen bg-soft-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-hero text-deep-forest mb-4">
              Organization Not Found
            </h1>
            <p className="text-body text-forest/80 mb-8">
              We couldn't find an organization with the slug "{slug}". 
              It may have been moved or the URL might be incorrect.
            </p>
            <div className="space-y-4">
              <a 
                href="/opportunities"
                className="inline-block w-full px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
              >
                Browse All Organizations
              </a>
              <a 
                href="/"
                className="inline-block w-full px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </Layout>
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
          content={organization.tagline ? `${organization.tagline} - ${organization.mission?.slice(0, 160) || 'Wildlife conservation volunteer opportunities'}...` : 'Wildlife conservation volunteer opportunities'} 
        />
        <meta property="og:title" content={`${organization.name} | Wildlife Volunteer Program`} />
        <meta property="og:description" content={organization.tagline || 'Wildlife conservation volunteer opportunities'} />
        <meta property="og:image" content={organization.hero_image || '/images/default-wildlife.jpg'} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://theanimalside.com/${organization.slug}`} />
      </Helmet>

      {/* Main Container */}
      <div className="min-h-screen bg-cream">
        {/* Organization Header */}
        {organization && <OrganizationHeader organization={organization} />}
        
        {/* Breadcrumb Navigation - Top of page */}
        <div className="bg-soft-cream/80 backdrop-blur-sm border-b border-warm-beige/30">
          <div className="container-nature-wide py-3">
            <div className="max-w-7xl mx-auto px-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="container-nature-wide section-padding-sm">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Program Selector (only shows if multiple programs) */}
            {allPrograms.length > 1 && selectedProgram && (
              <ProgramSelector
                programs={allPrograms}
                selectedProgram={selectedProgram}
                onProgramChange={handleProgramChange}
              />
            )}
            
            {/* Responsive Layout - Desktop two-column + Mobile tabs */}
            <DesktopLayout />
            <MobileLayout />
            
          </div>
        </div>
        
        
        {/* Mobile Bottom Tab Navigation - Global sticky positioning */}
        <div className="lg:hidden">
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            variant="mobile"
          />
        </div>
      </div>
    </>
  );
};



export default OrganizationDetail;