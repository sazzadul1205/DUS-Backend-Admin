// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Program Content Section Component
const ProgramContentSection = ({ programData, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const data = programData || window.programData;

  if (!data) return null;

  // Try multiple property names (supports both underscore and camelCase)
  const content = data.full_content_html || data.fullContentHtml || data.fullContent || data?.content;

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      {data?.title && (
        <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {data.title}
        </h1>
      )}

      {data?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={data.image}
            alt={data?.title || 'Program image'}
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
    </section>
  );
};

const ProjectsAndProgramsDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  slug,
  pageData: incomingPageData,
  ...rest
}) => {
  const pageData = incomingPageData || rest;

  const allSections = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true);

  const fixedSections = allSections.filter(section => section.isFixedSection === true);
  const dynamicSections = allSections.filter(section => section.isFixedSection !== true)
    .sort((a, b) => a.order - b.order);

  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${pageData.programContentData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

      {/* 1. Banner (first dynamic section) */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* 2. All Fixed Sections (ProgramContentSection, etc.) */}
      {fixedSections.map((section) => {
        if (section.component === 'ProgramContentSection') {
          return (
            <ProgramContentSection
              key={section.id}
              programData={pageData.programContentData}
              slug={slug}
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

export default ProjectsAndProgramsDetails;