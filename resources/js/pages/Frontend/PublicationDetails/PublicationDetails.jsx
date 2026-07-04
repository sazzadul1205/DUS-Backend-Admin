// resources/js/Pages/Frontend/PublicationDetails/PublicationDetails.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import { CiCalendar } from "react-icons/ci";
import { FaRegClock, FaFacebookF, FaLinkedinIn, FaInstagram, FaDownload, FaFilePdf } from "react-icons/fa";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';
import PublicationsSection from '../../../Sections/PublicationsSection/PublicationsSection'; 

// Banner Section Component
const BannerSection = ({ bannerData, publicationData }) => {
  const tagColors = [
    "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
    "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
  ];

  const normalizedPublicationData = {
    title: publicationData?.title || 'Publication',
    author: publicationData?.author || publicationData?.createdBy || 'ADMIN',
    date: publicationData?.date || publicationData?.created_at || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    readTime: publicationData?.read_time || publicationData?.timerRead || '5 MIN READ',
    tags: publicationData?.tags || [],
    category: publicationData?.category || 'General',
  };

  // Use publication image as banner if bannerData is not available
  const defaultBanner = {
    background: {
      src: publicationData?.image || '/storage/Publications/default-banner.png',
      alt: publicationData?.title || 'Publication Banner'
    },
    overlay: {
      darkOverlay: 'bg-black/60',
      gradient: 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
    }
  };

  const banner = bannerData || defaultBanner;

  return (
    <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14]">
      <div className="absolute inset-0 z-0">
        {banner?.background?.src && (
          <img
            src={banner.background.src}
            alt={banner.background.alt || 'Banner background'}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className={`absolute inset-0 ${banner?.overlay?.darkOverlay || 'bg-black/60'}`}>
          {banner?.overlay?.gradient && (
            <div className={`absolute inset-0 ${banner.overlay.gradient}`} />
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-5">
          {normalizedPublicationData.category && (
            <span className="text-white bg-[#009BE2] text-[12px] sm:text-[13px] font-semibold px-3 py-1 rounded-full">
              {normalizedPublicationData.category}
            </span>
          )}
          {normalizedPublicationData.tags?.length > 0 && (
            normalizedPublicationData.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-white text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md ${tagColors[index % tagColors.length]}`}
              >
                {tag}
              </span>
            ))
          )}
        </div>

        <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
          {normalizedPublicationData.title || 'Publication'}
        </h1>

        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <img src="https://placehold.co/20x20" alt="Author" className="w-5 h-5 object-cover" />
              <div className="absolute inset-0 bg-[#503AF2]/40" />
            </div>
            <p className="flex items-center">
              BY : <span className="pl-1">{normalizedPublicationData.author}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CiCalendar className="text-base" />
            <span>{normalizedPublicationData.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaRegClock className="text-base" />
            <span>{normalizedPublicationData.readTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Publication Content Section Component
const PublicationContentSection = ({
  publicationData,
  storageUrl,
  bgColor = 'bg-white',
  paddingY = 'py-12 lg:py-16',
  paddingX = 'px-4',
  sectionClassName = '',
  sectionId
}) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('https')) return imagePath;

    const cleanPath = imagePath.replace(/^\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;
    if (pdfPath.startsWith('http')) return pdfPath;
    if (pdfPath.startsWith('https')) return pdfPath;

    const cleanPath = pdfPath.replace(/^\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const normalizedPublicationData = {
    title: publicationData?.title || 'Publication',
    image: publicationData?.image,
    fullContent: publicationData?.fullContent || publicationData?.full_content || publicationData?.content || '',
    pdfUrl: publicationData?.pdf_url || publicationData?.pdfUrl || null,
    excerpt: publicationData?.excerpt || '',
  };

  const renderHTML = (htmlString) => {
    if (!htmlString) return { __html: '' };
    return { __html: htmlString };
  };

  if (!publicationData) {
    return null;
  }

  const imageUrl = getImageUrl(normalizedPublicationData.image);
  const pdfUrl = getPdfUrl(normalizedPublicationData.pdfUrl);

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      {/* Image Section */}
      <div className="relative z-10 max-w-275 mx-auto">
        <div className="-mt-16 sm:-mt-20 lg:-mt-24">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={normalizedPublicationData.title || "Publication main image"}
              className="w-full h-auto max-h-96 sm:max-h-125 object-cover object-center rounded-[28px] shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/1100x500/080C14/FFFFFF?text=Publication+Image";
              }}
            />
          ) : (
            <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-[28px] flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-275 mx-auto mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-25">
          {/* Social Share Sidebar */}
          <div className="hidden lg:flex flex-col items-center gap-4 pt-2 sticky top-25">
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaLinkedinIn className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaInstagram className="text-sm" />
            </a>
          </div>

          <div className="flex-1 min-w-0">
            {/* PDF Download Button - Now at the end (right side) */}
            {pdfUrl && (
              <div className="mb-8 flex justify-end">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#009BE2] text-white rounded-lg hover:bg-[#009BE2]/80 transition-colors shadow-lg hover:shadow-xl"
                >
                  <FaFilePdf className="text-xl" />
                  <span className="font-semibold">Download PDF</span>
                  <FaDownload className="text-sm" />
                </button>
              </div>
            )}

            {/* Full Content - Rendered HTML */}
            {normalizedPublicationData.fullContent ? (
              <div
                className="bricolage-grotesque prose prose-sm sm:prose-base lg:prose-lg max-w-none
                  prose-headings:font-700 prose-headings:text-[#080C14]
                  prose-p:text-[#333333] prose-p:leading-relaxed
                  prose-ul:text-[#333333] prose-ul:leading-relaxed
                  prose-li:text-[#333333] prose-li:leading-relaxed
                  prose-strong:text-[#009BE2]
                  prose-p:mt-4 prose-p:mb-4
                  prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:mt-6 prose-h3:mb-3"
                dangerouslySetInnerHTML={renderHTML(normalizedPublicationData.fullContent)}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No content available for this publication.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// REMOVED: RelatedPublicationsSection - Now using PublicationsSection with isRelated prop

const PublicationDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  pageData: pageDataProp,
  ...pageData
}) => {
  // Use the data from the correct nesting
  const actualPageData = pageDataProp || pageData || {};

  // Get publication data - try multiple possible locations
  const publicationData =
    actualPageData.publicationData ||
    actualPageData.detailData ||
    actualPageData.data ||
    actualPageData.publication ||
    actualPageData.detail;

  const bannerData = actualPageData.bannerData;
  const publicationsData = actualPageData.publicationsData ||
    actualPageData.relatedPublicationsData ||
    actualPageData.relatedMediaData ||
    [];

  const sectionsToRender = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  const renderSpecialComponent = (section) => {
    const { component, customProps = {} } = section;

    if (component === 'BannerSection' || component === 'PageBannerSection') {
      return (
        <BannerSection
          key={section.id}
          bannerData={bannerData}
          publicationData={publicationData}
          {...customProps}
        />
      );
    }

    if (component === 'PublicationContentSection') {
      return (
        <PublicationContentSection
          key={section.id}
          publicationData={publicationData}
          storageUrl={storageUrl}
          bgColor={customProps.bgColor || 'bg-white'}
          paddingY={customProps.paddingY || 'py-12 lg:py-16'}
          paddingX={customProps.paddingX || 'px-4'}
          sectionClassName={customProps.sectionClassName || ''}
          sectionId={customProps.sectionId || 'publication-content'}
        />
      );
    }

    if (component === 'RelatedPublicationsSection') {
      // Use the PublicationsSection component with isRelated={true}
      return (
        <PublicationsSection
          key={section.id}
          publicationsData={publicationsData}
          sectionTitle={customProps.title || 'Related Publications'}
          isRelated={true}
          bgColor={customProps.bgColor || 'bg-[#F5F5F5]'}
          sectionClassName={customProps.sectionClassName || ''}
          sectionId={customProps.sectionId || 'related-publications'}
        />
      );
    }

    return null;
  };

  const pageTitle = publicationData?.title
    ? `${publicationData.title} | DUS - Dwip Unnayan Society`
    : 'Publication Details | DUS - Dwip Unnayan Society';

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={pageTitle} />

      {sectionsToRender.map((section) => {
        if (section.isSpecialComponent ||
          section.component === 'BannerSection' ||
          section.component === 'PublicationContentSection' ||
          section.component === 'PageBannerSection' ||
          section.component === 'RelatedPublicationsSection') {
          return renderSpecialComponent(section);
        }
        return (
          <DynamicSectionRenderer
            key={section.id}
            section={section}
            pageData={actualPageData}
            globalProps={{ storageUrl }}
          />
        );
      })}
    </PublicLayout>
  );
};

export default PublicationDetails;