// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Components
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

const PublicLayout = ({ children }) => {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className=" mx-auto">{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;