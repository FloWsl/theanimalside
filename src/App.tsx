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
            
            {/* Level 1 - Main category pages */}
            <Route path="volunteer-:country" element={
              <Suspense fallback={<PageLoader />}>
                <CountryLandingPage />
              </Suspense>
            } />
            <Route path=":animal-volunteer" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage />
              </Suspense>
            } />
            <Route path=":category-conservation" element={
              <Suspense fallback={<PageLoader />}>
                <AnimalLandingPage type="conservation" />
              </Suspense>
            } />
            
            {/* Level 2 - Combined category pages */}
            <Route path="volunteer-:country/:animal" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="country-animal" />
              </Suspense>
            } />
            <Route path=":animal-volunteer/:country" element={
              <Suspense fallback={<PageLoader />}>
                <CombinedPage type="animal-country" />
              </Suspense>
            } />
            
            {/* Level 3 - Flat organization pages */}
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