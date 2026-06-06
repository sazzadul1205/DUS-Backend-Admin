// pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head, Link } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import FAQSection from '../About/FAQSection/FAQSection';
import BannerSection from '../About/BannerSection/BannerSection';
import UpcomingEventsSection from '../Home/UpcomingEventsSection/UpcomingEventsSection';

const ProjectsAndProgramsDetails = ({
  // Shared data
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page specific data
  slug,
  faqData,
  bannerData,
  programData,
  upcomingEventsData,
}) => {

  // Function to render HTML content safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };


  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} storageUrl={storageUrl} >
      <Head title={`${programData.title} | DUS - Dwip Unnayan Society`} />

      {/* Banner */}
      <BannerSection bannerData={bannerData} sectionId={`about-${slug}-banner`} />

      {/* Main Content Section - No height limit, shows full content */}
      <section className="bg-white py-37.5 px-100">


        {/* Title */}
        <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
          {programData?.title}
        </h1>

        {/* Image - Responsive sizing */}
        {programData?.image && (
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
            <img
              src={programData.image}
              alt={programData?.title || 'Program image'}
              className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover"
            />
          </div>
        )}


        {/* Content */}
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
              prose-headings:font-700 prose-headings:text-[#080C14] 
              prose-p:text-[#333333] prose-p:leading-relaxed
              prose-ul:text-[#333333] prose-ul:leading-relaxed
              prose-li:text-[#333333] prose-li:leading-relaxed
              prose-strong:text-[#009BE2]"
          dangerouslySetInnerHTML={renderHTML(programData.content)}
        />
      </section>

      {/* FAQ */}
      <FAQSection faqData={faqData} />

      {/* Upcoming Events */}
      <UpcomingEventsSection eventsData={upcomingEventsData} />

    </PublicLayout>
  );
};

export default ProjectsAndProgramsDetails;