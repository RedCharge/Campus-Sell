// client/src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, cartCount = 0 }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} />
      <main className="pt-24 md:pt-20"> {/* Responsive padding */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;