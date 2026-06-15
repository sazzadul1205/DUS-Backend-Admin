// resources/js/Pages/Frontend/ContactUs/ContactUs.jsx

// React
import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const FAQSection = lazy(() => import("../../../Sections/FAQSection/FAQSection"));
const StoriesSection = lazy(() => import("../../../Sections/StoriesSection/StoriesSection"));
const AddressSection = lazy(() => import("../../../Sections/AddressSection/AddressSection"));
const FollowUSSection = lazy(() => import("../../../Sections/FollowUSSection/FollowUSSection"));
const PageBannerSection = lazy(() => import("../../../Sections/BannerSection/PageBannerSection"));
const ContactReachSection = lazy(() => import("../../../Sections/ContactReachSection/ContactReachSection"));
const ContactOfficeSection = lazy(() => import("../../../Sections/ContactOfficeSection/ContactOfficeSection"));
const UpcomingEventsSection = lazy(() => import("../../../Sections/UpcomingEventsSection/UpcomingEventsSection"));

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: PageBannerSection,
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {
        sectionId: 'contact-us-banner',
        // bgColor: '',
        // height: 'h-125 md:h-147.25',
        // paddingY: '',
        // paddingX: '',
      }
    },
    {
      id: "contact-offices",
      component: ContactOfficeSection,
      enabled: true,
      propName: "offices",
      dataKey: "offices",
      order: 2,
      customProps: {
        // title: "Our Offices",
        // orgName: "Dwip Unnayan Songstha (DUS)",
        // bgColor: 'bg-white',
        // paddingY: 'py-10 sm:py-14 lg:py-37.5',
        // paddingX: 'px-4 sm:px-6 lg:px-50',
        // sectionId: 'contact-offices',
      }
    },
    {
      id: "contact-reach",
      component: ContactReachSection,
      enabled: true,
      propName: "image",
      dataKey: "reachUsImage",
      order: 3,
      customProps: {
        // title: "Reach out to us today!",
        // buttonText: "Submit Message",
        // bgColor: 'bg-[#F5F5F5]',
        // paddingY: 'py-10 sm:py-20 lg:py-37.5',
        // paddingX: 'px-6 sm:px-10 md:px-16 lg:px-20 xl:px-50',
        // sectionId: 'contact-reach',
      }
    },
    {
      id: "follow-us",
      component: FollowUSSection,
      enabled: true,
      propName: "socialItems",
      dataKey: "socialItems",
      order: 4,
      customProps: {
        // title: "Follow Us",
        // bgColor: 'bg-white',
        // paddingY: 'py-10 sm:py-14 lg:py-37.5',
        // paddingX: 'px-4 sm:px-6 lg:px-8 xl:px-50',
        // sectionId: 'follow-us',
      }
    },
    {
      id: "address",
      component: AddressSection,
      enabled: true,
      propName: "officesLocation",
      dataKey: "officesLocation",
      order: 5,
      customProps: {
        // bgColor: 'bg-[#F5F5F5]',
        // paddingY: 'py-10 sm:py-14 lg:py-37.5',
        // paddingX: 'px-4 sm:px-6 lg:px-50',
        // sectionId: 'address-section',
      }
    },
    {
      id: "faq",
      component: FAQSection,
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 6,
      customProps: {
        bgColor: 'bg-white',
        // paddingY: 'py-10 sm:py-15 md:py-20 lg:py-37.5',
        // paddingX: 'px-4 sm:px-6 md:px-10 lg:px-20 xl:px-50',
        // sectionId: 'faq',
        // defaultOpenId: 1,
      }
    },
    {
      id: "stories",
      component: StoriesSection,
      enabled: true,
      propName: "storiesData",
      dataKey: "storiesData",
      order: 7,
      customProps: {
        // bgColor: 'bg-[#F5F5F5]',
        // paddingY: 'py-12 sm:py-16 md:py-25 lg:py-37.5',
        // sectionClassName: '',
      }
    },
    {
      id: "upcoming-events",
      component: UpcomingEventsSection,
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 8,
      customProps: {
        // bgColor: 'bg-[#FFFFFF]',
        // paddingY: 'py-12 sm:py-16 md:py-25 lg:py-37.5',
        // paddingX: 'px-5 sm:px-10 md:px-20 lg:px-50',
      }
    },
  ],
};

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#515151] font-400">Loading section...</p>
    </div>
  </div>
);

const ContactUs = ({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific - Now coming from backend
  bannerData,
  offices,
  socialItems,
  reachUsImage,
  officesLocation,
  faqData,
  storiesData,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const sectionDataMap = {
    bannerData,
    offices,
    reachUsImage,
    socialItems,
    officesLocation,
    faqData,
    storiesData,
    upcomingEventsData,
  };

  // Get enabled sections sorted by order
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  // Get sections to render
  const sectionsToRender = getSectionsToRender();

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Contact Us | DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Wrap all lazy sections in Suspense */}
      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          const SectionComponent = section.component;
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent) {
            console.warn(`Missing component for: ${section.id}`);
            return null;
          }

          // For sections that don't require data (like those with defaults)
          if (!sectionData && section.id !== 'contact-reach') {
            console.warn(`Missing data for: ${section.id}`);
            return null;
          }

          // Merge the required prop with custom props from config
          const props = {
            [section.propName]: sectionData,
            ...(section.customProps || {})
          };

          return <SectionComponent key={section.id} {...props} />;
        })}
      </Suspense>
    </PublicLayout>
  );
};

export default ContactUs;