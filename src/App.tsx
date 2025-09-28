import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load heavy components for better performance
const HomePage = React.lazy(() => import('./components/HomePage'));
const OpportunitiesPage = React.lazy(() => import('./components/OpportunitiesPage/v2'));
const OrganizationDetail = React.lazy(() => import('./components/OrganizationDetail'));
const ProgramListPage = React.lazy(() => import('./components/OrganizationDetail/ProgramListPage'));

// Smart route dispatcher for all dynamic routes (renamed for clarity)
const DynamicCountryLandingPage = React.lazy(() => import('./components/DynamicCountryLandingPage'));

// Guide pages
const GuidesPage = React.lazy(() => import('./components/GuidesPage'));

// Lightweight loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-soft-cream">
    <div className="text-center">
      <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-forest/70 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {

  return (
    <ErrorBoundary>
      <div data-testid="app">
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/opportunities" element={<OpportunitiesPage />} />

                        {/* Organization Pages */}
                        <Route path="/organization/:slug" element={<OrganizationDetail />} />
                        <Route path="/organization/:slug/programs" element={<ProgramListPage />} />
                        <Route path="/organization/:slug/programs/:programId" element={<OrganizationDetail />} />

                        {/* Guide Pages */}
                        <Route path="/guides" element={<GuidesPage />} />
                        <Route path="/guides/:slug" element={<GuidesPage />} />

                        {/* Catch-all for dynamic routes - let DynamicCountryLandingPage decide what to do */}
                        <Route path="*" element={<DynamicCountryLandingPage />} />
                      </Routes>
                    </ErrorBoundary>
                  </Suspense>
                </Layout>
              </ErrorBoundary>
            </BrowserRouter>
          </HelmetProvider>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;