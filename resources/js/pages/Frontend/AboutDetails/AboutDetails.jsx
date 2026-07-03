// resources/js/Pages/Frontend/AboutDetails/AboutDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Special ContentSection component (fixed)
const ContentSection = ({ subPageData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const data = subPageData || {};

  const title = data.title;
  const content = data.full_content || data.content;
  const image = data.image;
  const btnText = data.btn_text || data.btn?.text;
  const btnLink = data.btn_link || data.btn?.link;

  // If no title or content, don't render
  if (!title && !content) {
    console.warn('⚠️ ContentSection: No title or content to render');
    return null;
  }

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      {title && (
        <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {title}
        </h1>
      )}
      {image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={image}
            alt={title || 'About image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}
      {content && (
        <div
          className="bricolage-grotesque prose prose-lg max-w-none
            prose-headings:font-700 prose-headings:text-[#080C14] 
            prose-p:text-[#333333] prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-[#333333] prose-ul:leading-relaxed
            prose-li:text-[#333333] prose-li:leading-relaxed
            prose-strong:text-[#009BE2]
            prose-h2:font-700 prose-h2:text-[#080C14] prose-h2:mt-8 prose-h2:mb-4
            prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl"
          dangerouslySetInnerHTML={renderHTML(content)}
        />
      )}
      {btnText && btnLink && (
        <div className="mt-8">
          <a href={btnLink} className="inline-block bg-[#009BE2] text-white font-600 px-8 py-4 rounded-lg hover:bg-[#007BB5] transition-colors">
            {btnText}
          </a>
        </div>
      )}
    </section>
  );
};

const AboutDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  ...props
}) => {
  // The data might be nested under pageData or at the root level
  const pageData = props.pageData || props; // Fallback to props if pageData doesn't exist

  const allSections = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true);

  // Separate fixed sections vs dynamic sections
  const fixedSections = allSections.filter(section => section.isFixedSection === true);
  const dynamicSections = allSections.filter(section => section.isFixedSection !== true)
    .sort((a, b) => a.order - b.order);

  // Find specific sections for ordering
  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${pageData.contentSectionData?.title || 'About'} | DUS - Dwip Unnayan Society`} />

      {/* 1. Banner (first dynamic section) */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* 2. All Fixed Sections (ContentSection, etc.) */}
      {fixedSections.map((section) => {
        if (section.component === 'ContentSection') {
          return (
            <ContentSection
              key={section.id}
              subPageData={pageData.contentSectionData}
              {...section.customProps}
            />
          );
        }
        return null;
      })}

      {/* 3. Other Dynamic Sections (FAQ, Events, etc.) */}
      {otherDynamicSections.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default AboutDetails;