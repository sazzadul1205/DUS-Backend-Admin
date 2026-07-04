import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import PageTagBanner from '../Sections/BannerSection/PageTagBannerSection';

const Playground = ({
  topbarData,
  navbarData,
  footerData,
  storageUrl,
  pageData,
}) => {
  // Sample tag data - this would come from your API
  const tags = pageData?.galleryData?.tags || [
    { label: 'DUS in action', color: '#009BE2' },
    { label: 'Community Impact', color: '#FF6B6B' },
    { label: 'Coastal Development', color: '#4ECDC4' },
    { label: 'Microfinance Success', color: '#FFE66D' },
    { label: 'Climate Action', color: '#6C5CE7' },
    { label: 'Women Empowerment', color: '#FD79A8' },
    { label: 'Education for All', color: '#00B894' },
    { label: 'Sustainable Agriculture', color: '#FDCB6E' },
  ];

  // Get active tag from data or use first tag
  const activeTag = pageData?.galleryData?.activeTag || tags[0]?.label || 'DUS in action';

  return (
    <PublicLayout
      topBarData={topbarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Playground" />

      <div className="bg-white min-h-screen">
        {/* Using PageTagBanner component */}
        <PageTagBanner
          data={{
            background: {
              src: pageData?.galleryData?.bannerImage || "https://placehold.co/1920x600",
              alt: "Banner background"
            },
            overlay: {
              darkOverlay: 'bg-black/40 lg:bg-black/50',
              gradient: 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
            },
            tagTitle: pageData?.galleryData?.title || 'Photo Gallery',
            tags: tags,
            activeTag: activeTag,
          }}
          height="h-125 md:h-147.25"
          bgColor="bg-white"
          sectionId="photo-gallery-banner"
        />

        {/* Rest of your page content can go here */}
        <div className="py-10 px-50">
          {/* Other content */}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Playground;