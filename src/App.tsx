import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import OpportunitiesPage from './components/OpportunitiesPage';
import OrganizationDetail from './components/OrganizationDetail';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="organization/:slug" element={<OrganizationDetail />} />
            {/* Add more routes as the application grows */}
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;