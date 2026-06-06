// resources/js/Pages/Frontend/AboutDetails/AboutDetails.jsx

import React from 'react';
import { Head, Link } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import FAQSection from '../About/FAQSection/FAQSection';
import BannerSection from '../About/BannerSection/BannerSection';
import UpcomingEventsSection from '../Home/UpcomingEventsSection/UpcomingEventsSection';

const AboutDetails = ({
  // Shared data
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page specific data
  slug,
  faqData,
  bannerData,
  subPageData,
  upcomingEventsData,
}) => {

  // Function to render HTML content safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} storageUrl={storageUrl} >
      <Head title={`${subPageData.title} | DUS - Dwip Unnayan Society`} />

      {/* Banner */}
      <BannerSection bannerData={bannerData} sectionId={`about-${slug}-banner`} />

      {/* Main Content Section - No height limit, shows full content */}
      <section className="bg-white py-37.5 px-100">

        {/* Title */}
        <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
          {subPageData?.title}
        </h1>


        {/* Content */}
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
              prose-headings:font-700 prose-headings:text-[#080C14] 
              prose-p:text-[#333333] prose-p:leading-relaxed
              prose-ul:text-[#333333] prose-ul:leading-relaxed
              prose-li:text-[#333333] prose-li:leading-relaxed
              prose-strong:text-[#009BE2]"
          dangerouslySetInnerHTML={renderHTML(subPageData.content)}
        />
      </section>

      {/* FAQ */}
      <FAQSection faqData={faqData} />

      {/* Upcoming Events */}
      <UpcomingEventsSection eventsData={upcomingEventsData} />

    </PublicLayout>
  );
};

export default AboutDetails;