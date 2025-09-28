// src/components/OrganizationDetail/index.tsx - Enhanced Cross-Device Architecture
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { OrganizationService } from '../../services/organizationService';
import type { OrganizationDetail as OrganizationDetailType, Program } from '../../types';
import { generateProgramSlug, findProgramBySlug, getPrimaryProgram } from '../../utils/programUtils';

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
import { TabErrorBoundary } from './OrganizationDetailErrorBoundary';

// Import header and navigation
import OrganizationHeader from './OrganizationHeader';
import SmartNavigation from '../SmartNavigation';
import OtherProgramsSection from './OtherProgramsSection';
import ProgramBreadcrumb from './ProgramBreadcrumb';
import ProgramIndicator from './ProgramIndicator';
import ProgramSwitcher from './ProgramSwitcher';

// Import layout components for responsive architecture
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
  const { slug, programSlug } = useParams<{ slug: string; programSlug?: string }>();
  
  // Check if we're viewing a specific program
  const isSpecificProgramPage = !!programSlug;
  
  // State for organization data from database
  const [organization, setOrganization] = useState<OrganizationDetailType | undefined>(undefined);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [orgError, setOrgError] = useState<string | null>(null);

  // Fetch organization data from database
  useEffect(() => {
    if (!slug) return;

    const fetchOrganization = async () => {
      try {
        setIsLoadingOrg(true);
        setOrgError(null);
        const orgData = await OrganizationService.getOrganizationBySlug(slug);
        setOrganization(orgData);
      } catch (error) {
        console.error('Error fetching organization:', error);
        setOrgError('Failed to load organization details');
      } finally {
        setIsLoadingOrg(false);
      }
    };

    fetchOrganization();
  }, [slug]);
  
  // Handle program selection logic
  const getSelectedProgram = (): Program | null => {
    if (!organization?.programs) return null;
    
    if (isSpecificProgramPage && programSlug) {
      // Find program by slug using utility
      return findProgramBySlug(organization.programs, programSlug);
    }
    
    // For base organization page, determine which program to show
    if (organization.programs.length === 1) {
      // Single program: show it directly
      return organization.programs[0];
    } else {
      // Multiple programs: get primary program for redirect logic
      return getPrimaryProgram(organization.programs);
    }
  };
  
  // State for selected program with loading states
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isProgramSwitching, setIsProgramSwitching] = useState(false);
  const [programSwitchError, setProgramSwitchError] = useState<string | null>(null);
  
  // Update selected program when organization or route changes
  React.useEffect(() => {
    const program = getSelectedProgram();
    setSelectedProgram(program);
    setProgramSwitchError(null);
  }, [organization, programSlug]);
  
  // Handle program switching with loading states
  const handleProgramSwitch = useCallback(async (newProgram: Program) => {
    if (!organization || selectedProgram?.id === newProgram.id) return;
    
    try {
      setIsProgramSwitching(true);
      setProgramSwitchError(null);
      
      // Small delay to show loading state for user feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update URL without redirect if we're on base organization page
      if (!isSpecificProgramPage) {
        const newUrl = `${window.location.pathname}?program=${generateProgramSlug(newProgram.title)}`;
        window.history.pushState({}, '', newUrl);
      }
      
      setSelectedProgram(newProgram);
    } catch (error) {
      console.error('Error switching programs:', error);
      setProgramSwitchError('Failed to switch programs. Please try again.');
    } finally {
      setIsProgramSwitching(false);
    }
  }, [organization, selectedProgram, isSpecificProgramPage]);
  
  // Check URL for program parameter on base organization pages
  React.useEffect(() => {
    if (!organization || isSpecificProgramPage) return;
    
    const params = new URLSearchParams(window.location.search);
    const programParam = params.get('program');
    
    if (programParam) {
      const matchingProgram = findProgramBySlug(organization.programs, programParam);
      if (matchingProgram && matchingProgram.id !== selectedProgram?.id) {
        setSelectedProgram(matchingProgram);
      }
    }
  }, [organization, isSpecificProgramPage, selectedProgram]);
  
  // Show primary program content directly on organization page - no redirects
  // Users can switch between programs with clear UX feedback
  
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
        } catch {
          // PerformanceObserver not supported, gracefully degrade
        }
        
        return () => {
          try {
            observer.disconnect();
          } catch {
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
          <TabErrorBoundary tabName="Overview">
            <OverviewTab
              {...commonProps}
              hideDuplicateInfo={isDesktop}
              onTabChange={handleTabChange}
            />
          </TabErrorBoundary>
        );
      case 'experience':
        return (
          <TabErrorBoundary tabName="Experience">
            <ExperienceTab {...commonProps} onTabChange={handleTabChange} />
          </TabErrorBoundary>
        );
      case 'practical':
        return (
          <TabErrorBoundary tabName="Practical">
            <PracticalTab
              {...commonProps}
              selectedProgram={selectedProgram}
              hideDuplicateInfo={isDesktop}
              onTabChange={handleTabChange}
            />
          </TabErrorBoundary>
        );
      case 'location':
        return (
          <TabErrorBoundary tabName="Location">
            <LocationTab
              {...commonProps}
              hideDuplicateInfo={isDesktop}
              onTabChange={handleTabChange}
            />
          </TabErrorBoundary>
        );
      case 'stories':
        return (
          <TabErrorBoundary tabName="Stories">
            <StoriesTab {...commonProps} />
          </TabErrorBoundary>
        );
      case 'connect':
        return (
          <TabErrorBoundary tabName="Connect">
            <ConnectTab {...commonProps} />
          </TabErrorBoundary>
        );
      default:
        return (
          <TabErrorBoundary tabName="Overview">
            <OverviewTab {...commonProps} hideDuplicateInfo={isDesktop} onTabChange={handleTabChange} />
          </TabErrorBoundary>
        );
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
              <div className="mt-12 pt-8 border-t border-warm-beige/30 space-y-8">
                <SmartNavigation
                  organization={organization}
                  currentTab={activeTab}
                  variant="inline"
                />
                {selectedProgram && (
                  <OtherProgramsSection
                    organization={organization}
                    currentProgram={selectedProgram}
                  />
                )}
              </div>
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
        <div className="mt-12 pt-8 border-t border-warm-beige/30 space-y-8">
          <SmartNavigation
            organization={organization}
            currentTab={activeTab}
            variant="inline"
          />
          {selectedProgram && (
            <OtherProgramsSection
              organization={organization}
              currentProgram={selectedProgram}
            />
          )}
        </div>
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

  // Show loading state while fetching organization
  if (isLoadingOrg) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-earth mx-auto"></div>
          <h1 className="text-section text-deep-forest">Loading...</h1>
          <p className="text-body text-forest/70">Fetching organization details...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error fetching
  if (orgError) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <h1 className="text-section text-deep-forest">Error Loading Organization</h1>
          <p className="text-body text-forest/70">{orgError}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors"
            >
              Try Again
            </button>
            <br />
            <a 
              href="/opportunities" 
              className="inline-flex items-center px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors"
            >
              Browse All Programs
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  if (!organization) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <h1 className="text-section text-deep-forest">Organization Not Found</h1>
          <p className="text-body text-forest/70">
            The organization you're looking for doesn't exist or may have been moved.
          </p>
          <div className="space-y-3">
            <a 
              href="/opportunities" 
              className="inline-flex items-center px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors"
            >
              Browse All Programs
            </a>
            <br />
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors"
            >
              Return Home
            </a>
          </div>
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
        <title>
          {isSpecificProgramPage && selectedProgram 
            ? `${selectedProgram.title} - ${organization.name} | Programme de Volontariat | The Animal Side`
            : `${organization.name} | Programme de Volontariat | The Animal Side`
          }
        </title>
        <meta 
          name="description" 
          content={
            isSpecificProgramPage && selectedProgram
              ? `${selectedProgram.description} - Programme de volontariat ${selectedProgram.title} avec ${organization.name}. ${organization.tagline}`
              : `${organization.tagline} - ${organization.mission.slice(0, 160)}...`
          } 
        />
        <meta 
          name="keywords" 
          content={
            isSpecificProgramPage && selectedProgram
              ? `${selectedProgram.animalTypes.join(', ')}, ${organization.tags.join(', ')}, volontariat, conservation`
              : organization.tags.join(', ')
          } 
        />
        <meta 
          property="og:title" 
          content={
            isSpecificProgramPage && selectedProgram
              ? `${selectedProgram.title} - ${organization.name} | Programme de Volontariat`
              : `${organization.name} | Programme de Volontariat`
          } 
        />
        <meta 
          property="og:description" 
          content={
            isSpecificProgramPage && selectedProgram
              ? selectedProgram.description
              : organization.tagline
          } 
        />
        <meta property="og:image" content={organization.heroImage} />
        <meta property="og:type" content="website" />
        <link 
          rel="canonical" 
          href={
            isSpecificProgramPage && selectedProgram
              ? `https://theanimalside.com/organization/${organization.slug}/program/${generateProgramSlug(selectedProgram.title)}`
              : `https://theanimalside.com/organization/${organization.slug}`
          } 
        />
      </Helmet>

      {/* Main Container */}
      <div className="min-h-screen bg-cream">
        {/* Organization Header */}
        <OrganizationHeader organization={organization} />
        
        {/* Breadcrumb Navigation - Top of page */}
        <div className="bg-soft-cream/80 backdrop-blur-sm border-b border-warm-beige/30">
          <div className="container-nature-wide py-3">
            <div className="max-w-7xl mx-auto px-4">
              <ProgramBreadcrumb
                organization={organization}
                currentProgram={selectedProgram}
                isSpecificProgramPage={isSpecificProgramPage}
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="container-nature-wide section-padding-sm">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Program Switcher - Shows when multiple programs are available */}
            {organization.programs && organization.programs.length > 1 && (
              <div className="mb-6">
                <ProgramSwitcher
                  programs={organization.programs}
                  selectedProgram={selectedProgram}
                  onProgramSwitch={handleProgramSwitch}
                  isLoading={isProgramSwitching}
                  error={programSwitchError}
                  disabled={false}
                />
              </div>
            )}
            
            {/* Program Indicator (only for specific program pages with multiple programs) */}
            {isSpecificProgramPage && selectedProgram && (
              <ProgramIndicator
                organization={organization}
                currentProgram={selectedProgram}
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