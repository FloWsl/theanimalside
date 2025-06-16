import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';

// Lazy load heavy components for better performance
const HomePage = React.lazy(() => import('./components/HomePage'));
const OpportunitiesPage = React.lazy(() => import('./components/OpportunitiesPage/v2'));
const OrganizationDetail = React.lazy(() => import('./components/OrganizationDetail'));

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
            <Route path="organization/:slug" element={
              <Suspense fallback={<PageLoader />}>
                <OrganizationDetail />
              </Suspense>
            } />
            {/* Add more routes as the application grows */}
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;