import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';

// Lazy load heavy components for better performance
const HomePage = React.lazy(() => import('./components/HomePage'));
const OpportunitiesPage = React.lazy(() => import('./components/OpportunitiesPage/v2'));
const OrganizationDetail = React.lazy(() => import('./components/OrganizationDetail'));

// New SEO-friendly pages
const CountryLandingPage = React.lazy(() => import('./components/CountryLandingPage'));
const AnimalLandingPage = React.lazy(() => import('./components/AnimalLandingPage'));
const CombinedPage = React.lazy(() => import('./components/CombinedPage'));
const FlatOrganizationPage = React.lazy(() => import('./components/FlatOrganizationPage'));

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
  // Debug current route
  React.useEffect(() => {
    console.log('🌐 DEBUG: App mounted, current pathname:', window.location.pathname);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            } />
            <Route path="opportunities" element={
              <Suspense fallback={<PageLoader />}>
                <OpportunitiesPage />
              </Suspense>
            } />
            {/* Legacy organization route - keep for backward compatibility */}
            <Route path="organization/:slug" element={
              <Suspense fallback={<PageLoader />}>
                <OrganizationDetail />
              </Suspense>
            } />
            
            {/* Level 1 - Main category pages (MUST come before catch-all routes) */}
            {/* Country routes - use explicit country list to avoid pattern conflicts */}
            <Route path="volunteer-costa-rica" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-thailand" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-south-africa" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-australia" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-indonesia" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-kenya" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-ecuador" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-peru" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-brazil" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path="volunteer-india" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            
            {/* Animal routes - explicit list to avoid pattern conflicts */}
            <Route path="lions-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="elephants-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="sea-turtles-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="orangutans-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="koalas-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="tigers-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="pandas-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="rhinos-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="whales-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path="dolphins-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            
            {/* Conservation routes */}
            <Route path="wildlife-conservation" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage type="conservation" />
              </Suspense>
            } />
            <Route path="marine-conservation" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage type="conservation" />
              </Suspense>
            } />
            <Route path="forest-conservation" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage type="conservation" />
              </Suspense>
            } />
            
            {/* Level 2 - Combined category pages (explicit routes for main combinations) */}
            {/* Costa Rica + Animals */}
            <Route path="volunteer-costa-rica/sea-turtles" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-costa-rica/orangutans" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-costa-rica/lions" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-costa-rica/elephants" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            
            {/* Thailand + Animals */}
            <Route path="volunteer-thailand/elephants" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-thailand/orangutans" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            
            {/* Indonesia + Animals */}
            <Route path="volunteer-indonesia/orangutans" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-indonesia/elephants" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            
            {/* Kenya + Animals */}
            <Route path="volunteer-kenya/elephants" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path="volunteer-kenya/lions" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            
            {/* Animal + Country combinations (for canonical URL testing) */}
            <Route path="sea-turtles-volunteer/costa-rica" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="animal-country" />
              </Suspense>
            } />
            <Route path="elephants-volunteer/thailand" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="animal-country" />
              </Suspense>
            } />
            <Route path="elephants-volunteer/kenya" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="animal-country" />
              </Suspense>
            } />
            <Route path="orangutans-volunteer/indonesia" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="animal-country" />
              </Suspense>
            } />
            
            {/* Level 3 - Flat organization pages (CATCH-ALL - must be last) */}
            <Route path=":orgSlug" element={
              <Suspense fallback={<PageLoader />}>
                <FlatOrganizationPage />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;