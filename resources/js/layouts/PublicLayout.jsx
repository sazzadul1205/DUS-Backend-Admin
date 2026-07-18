// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Components
import Navbar from '../Shared/Navbar';
import TopBar from '../Shared/TopBar';
import Footer from '../Shared/Footer';

const PublicLayout = ({ children, topBarData, navbarData, footerData, storageUrl }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* TopBar */}
      <TopBar topBarData={topBarData} storageUrl={storageUrl} />

      {/* Navbar */}
      <Navbar navbarData={navbarData} />

      {/* Main Content */}
      <main className="grow">
        {children}
      </main>

      {/* Footer */}
      <Footer footerData={footerData} storageUrl={storageUrl} />
    </div>
  );
};

export default PublicLayout;