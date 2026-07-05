// resources/js/Sections/SectionIndex.jsx

import React from 'react';

// Import all section components
import HomeBanner from './BannerSection/HomeBanner';
import PageBannerSection from './BannerSection/PageBannerSection';
import PageTagBannerSection from './BannerSection/PageTagBannerSection';
import AboutUsSection from './AboutUsSection/AboutUsSection';
import OurActionSection from './OurActionSection/OurActionSection';
import WhereWeWorkSection from './WhereWeWorkSection/WhereWeWorkSection';
import OurProgramsSection from './OurProgramsSection/OurProgramsSection';
import StoriesSection from './StoriesSection/StoriesSection';
import BlogSection from './BlogSection/BlogSection';
import JobsSection from './JobsSection/JobsSection';
import ProgramImpactSection from './ProgramImpactSection/ProgramImpactSection';
import UpcomingEventsSection from './UpcomingEventsSection/UpcomingEventsSection';
import HeroFigureSection from './HeroFigureSection/HeroFigureSection';
import CardsSection from './CardsSection/CardsSection';
import FAQSection from './FAQSection/FAQSection';
import ContactOfficeSection from './ContactOfficeSection/ContactOfficeSection';
import AddressSection from './AddressSection/AddressSection';
import ContactReachSection from './ContactReachSection/ContactReachSection';
import FollowUSSection from './FollowUSSection/FollowUSSection';
import LegalSection from './LegalSection/LegalSection';
import PublicationsSection from './PublicationsSection/PublicationsSection';
import ImageGallerySection from './ImageGallerySection/ImageGallerySection';
import VideoGallerySection from './VideoGallerySection/VideoGallerySection';

// Component mapping - only new names
const sectionComponents = {
  HomeBanner,
  PageBannerSection,
  PageTagBannerSection,
  AboutUsSection,
  OurActionSection,
  WhereWeWorkSection,
  OurProgramsSection,
  StoriesSection,
  BlogSection,
  JobsSection,
  ProgramImpactSection,
  UpcomingEventsSection,
  HeroFigureSection,
  CardsSection,
  FAQSection,
  ContactOfficeSection,
  AddressSection,
  ContactReachSection,
  FollowUSSection,
  LegalSection,
  PublicationsSection,
  ImageGallerySection,
  VideoGallerySection,
};

/**
 * Recursively extract the actual data from nested structures
 * Handles cases where data is nested multiple levels deep
 */
const extractNestedData = (data, depth = 0, maxDepth = 10) => {
  if (!data) return null;
  if (depth > maxDepth) {
    console.warn('extractNestedData: Max depth reached, returning data as-is');
    return data;
  }

  // If the data has a 'data' property and it's an object, recursively extract it
  if (data.data && typeof data.data === 'object') {
    return extractNestedData(data.data, depth + 1, maxDepth);
  }

  // If the data has the expected structure (section, mission, impact, image)
  if (data.section || data.mission || data.impact || data.image) {
    return data;
  }

  // If data is an array
  if (Array.isArray(data)) {
    return data;
  }

  // Return the data as is
  return data;
};

/**
 * Extract section data from different data structures
 */
const extractSectionData = (section) => {
  if (!section) return null;

  // If section already has data directly
  if (section.data) {
    // For custom_section_data and shared_data, the actual data might be nested
    if (section.data_table === 'custom_section_data' || section.data_table === 'shared_data') {
      const extractedData = extractNestedData(section.data);

      // Special handling for AboutUs
      if (section.component === 'AboutUsSection') {
        if (extractedData && (extractedData.section || extractedData.mission || extractedData.impact || extractedData.image)) {
          return extractedData;
        }
        if (extractedData && typeof extractedData === 'object' && !Array.isArray(extractedData)) {
          return {
            section: {
              title: extractedData.title || extractedData.section_title || 'About Us',
              description: extractedData.description || extractedData.section_description || '',
              button: {
                text: extractedData.button_text || extractedData.cta_text || 'Learn More',
                link: extractedData.button_link || extractedData.cta_link || '#'
              }
            },
            mission: {
              title: extractedData.mission_title || 'Our Mission',
              items: extractedData.mission_items || extractedData.missions || []
            },
            impact: {
              title: extractedData.impact_title || 'Our Impact',
              stats: extractedData.impact_stats || extractedData.stats || []
            },
            image: {
              src: extractedData.image || extractedData.image_url || '',
              alt: extractedData.image_alt || 'About us image'
            }
          };
        }
        return extractedData;
      }

      // Special handling for Stories
      if (section.component === 'StoriesSection') {
        if (extractedData && (extractedData.section || extractedData.stories)) {
          return extractedData;
        }
        if (Array.isArray(extractedData)) {
          return {
            section: {
              title: 'Stories',
              description: ''
            },
            stories: extractedData
          };
        }
        return extractedData;
      }

      return extractedData;
    }

    // For about_content, return the data as is
    if (section.data_table === 'about_content') {
      const extractedData = extractNestedData(section.data);
      if (extractedData && (extractedData.section || extractedData.mission || extractedData.impact)) {
        return extractedData;
      }
      return section.data;
    }

    // For blogs, programs, and stories data, the data is the array itself or has section + items
    if (section.data_table === 'blogs' || section.data_table === 'programs') {
      return section.data;
    }

    // For stories (without data_table), return the data as is
    if (section.component === 'StoriesSection') {
      if (section.data && (section.data.section || section.data.stories)) {
        return section.data;
      }
      if (Array.isArray(section.data)) {
        return {
          section: {
            title: 'Stories',
            description: ''
          },
          stories: section.data
        };
      }
      return section.data;
    }

    return section.data;
  }

  // Check for old format - data might be in section.section_data
  if (section.section_data) {
    return extractNestedData(section.section_data);
  }

  // Check for custom section data
  if (section.custom_section_data) {
    return extractNestedData(section.custom_section_data);
  }

  // Check for shared section data
  if (section.shared_section_data) {
    return extractNestedData(section.shared_section_data);
  }

  return null;
};

/**
 * Build props for each component type
 */
const buildComponentProps = (component, sectionData, section) => {
  const props = {
    ...(section.custom_props || {}),
  };

  const componentName = section.component;

  switch (componentName) {
    case 'HomeBanner':
      props.bannerData = sectionData;
      break;

    case 'PageBannerSection':
      props.bannerData = sectionData;
      break;

    case 'PageTagBannerSection':
      props.bannerData = sectionData;
      if (section.custom_props?.tags) {
        props.tags = section.custom_props.tags;
      }
      if (section.custom_props?.activeTag) {
        props.activeTag = section.custom_props.activeTag;
      }
      if (section.custom_props?.tagTitle) {
        props.tagTitle = section.custom_props.tagTitle;
      }
      break;

    case 'AboutUsSection':
      props.aboutUsData = sectionData;
      break;

    case 'OurActionSection':
      props.actionData = sectionData;
      break;

    case 'WhereWeWorkSection':
      props.workData = sectionData;
      break;

    case 'OurProgramsSection':
      props.programsData = sectionData;
      break;

    case 'StoriesSection':
      props.storiesData = sectionData;
      break;

    case 'BlogSection':
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        props.mainBlog = sectionData[0] || null;
        props.blogPosts = sectionData.slice(1) || [];
      } else {
        props.mainBlog = null;
        props.blogPosts = [];
      }
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      break;

    case 'PublicationsSection':
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        const featuredPub = sectionData.find(pub => pub.is_featured === true || pub.is_featured === 1);
        if (featuredPub) {
          props.mainPublication = featuredPub;
          props.publicationItems = sectionData.filter(pub => pub.id !== featuredPub.id);
        } else {
          props.mainPublication = sectionData[0] || null;
          props.publicationItems = sectionData.slice(1) || [];
        }
      } else if (typeof sectionData === 'object' && sectionData !== null) {
        if (sectionData.mainPublication) {
          props.mainPublication = sectionData.mainPublication;
        }
        if (Array.isArray(sectionData.publicationItems)) {
          props.publicationItems = sectionData.publicationItems;
        } else if (Array.isArray(sectionData.items)) {
          props.publicationItems = sectionData.items;
        } else if (Array.isArray(sectionData.publications)) {
          props.publicationItems = sectionData.publications;
        }
      }
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      break;

    case 'ImageGallerySection':
      props.galleryData = sectionData;
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      if (section.custom_props?.imagesPerPage) {
        props.imagesPerPage = section.custom_props.imagesPerPage;
      }
      if (section.custom_props?.imagesPerLoad) {
        props.imagesPerLoad = section.custom_props.imagesPerLoad;
      }
      if (section.custom_props?.imageCountLabel) {
        props.imageCountLabel = section.custom_props.imageCountLabel;
      }
      break;

    case 'VideoGallerySection':
      props.videoData = sectionData;
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      if (section.custom_props?.videosPerPage) {
        props.videosPerPage = section.custom_props.videosPerPage;
      }
      if (section.custom_props?.videosPerLoad) {
        props.videosPerLoad = section.custom_props.videosPerLoad;
      }
      if (section.custom_props?.videoCountLabel) {
        props.videoCountLabel = section.custom_props.videoCountLabel;
      }
      break;

    case 'JobsSection':
      props.jobsData = sectionData;
      break;

    case 'ProgramImpactSection':
      props.impactData = sectionData;
      break;

    case 'UpcomingEventsSection':
      props.eventsData = sectionData;
      break;

    case 'FAQSection':
      props.faqData = sectionData;
      break;

    case 'ContactOfficeSection':
      props.offices = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'AddressSection':
      props.officesLocation = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'ContactReachSection':
      // Handle both object and array data
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        // If it's an array, use the first item
        const firstItem = sectionData[0] || {};
        props.image = firstItem.image || '';
        props.title = firstItem.title || 'Reach out to us today!';
        props.buttonText = firstItem.buttonText || 'Submit Message';
      } else if (typeof sectionData === 'object' && sectionData !== null) {
        props.image = sectionData.image || '';
        props.title = sectionData.title || 'Reach out to us today!';
        props.buttonText = sectionData.buttonText || 'Submit Message';
      } else {
        props.image = '';
        props.title = 'Reach out to us today!';
        props.buttonText = 'Submit Message';
      }
      break;

    case 'FollowUSSection':
      props.socialItems = Array.isArray(sectionData) ? sectionData : [];
      if (section.custom_props?.title) {
        props.title = section.custom_props.title;
      }
      break;

    case 'LegalSection':
      props.legalData = sectionData;
      break;

    case 'HeroFigureSection':
      props.data = sectionData;
      break;

    case 'CardsSection':
      props.cardsData = sectionData;
      break;

    default:
      props.data = sectionData;
      break;
  }

  return props;
};

/**
 * SectionIndex Component - Main renderer
 */
const SectionIndex = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        const Component = sectionComponents[section.component];

        if (!Component) {
          console.warn(`No component found for: ${section.component}`);
          return null;
        }

        const sectionData = extractSectionData(section);
        const props = buildComponentProps(section.component, sectionData, section);

        return <Component key={section.id} {...props} />;
      })}
    </>
  );
};

export default SectionIndex;