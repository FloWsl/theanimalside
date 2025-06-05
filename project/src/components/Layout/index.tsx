// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\Layout\index.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-24'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;