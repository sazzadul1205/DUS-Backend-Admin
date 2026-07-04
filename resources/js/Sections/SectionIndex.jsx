// resources/js/Sections/SectionIndex.jsx

import React from 'react';

// Import all section components
import HomeBanner from './BannerSection/HomeBanner';
import PageBannerSection from './BannerSection/PageBannerSection';
import PageTagBannerSection from './BannerSection/PageTagBannerSection'; // NEW
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

// Component mapping with both old and new component names
const sectionComponents = {
  // New names
  HomeBanner,
  PageBannerSection,
  PageTagBannerSection, // NEW
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

  // Old names for backward compatibility
  'BannerSection': HomeBanner,
  'PageBanner': PageBannerSection,
  'PageTagBanner': PageTagBannerSection,
  'AboutUs': AboutUsSection,
  'OurAction': OurActionSection,
  'WhereWeWork': WhereWeWorkSection,
  'OurPrograms': OurProgramsSection,
  'Stories': StoriesSection,
  'Blog': BlogSection,
  'Jobs': JobsSection,
  'ProgramImpact': ProgramImpactSection,
  'UpcomingEvents': UpcomingEventsSection,
  'HeroFigure': HeroFigureSection,
  'Cards': CardsSection,
  'FAQ': FAQSection,
  'ContactOffice': ContactOfficeSection,
  'Address': AddressSection,
  'ContactReach': ContactReachSection,
  'FollowUS': FollowUSSection,
  'Legal': LegalSection,
  'Publications': PublicationsSection,
  'ImageGallery': ImageGallerySection,
  'VideoGallery': VideoGallerySection,
};

/**
 * Recursively extract the actual data from nested structures
 * Handles cases where data is nested multiple levels deep
 */
const extractNestedData = (data) => {
  if (!data) return null;

  // If the data has a 'data' property and it's an object, recursively extract it
  if (data.data && typeof data.data === 'object') {
    return extractNestedData(data.data);
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
 * Supports both old and new data formats
 */
const extractSectionData = (section) => {
  if (!section) return null;

  // If section already has data directly
  if (section.data) {
    // For custom_section_data and shared_data, the actual data might be nested
    if (section.data_table === 'custom_section_data' || section.data_table === 'shared_data') {
      // Recursively extract the actual data from nested structure
      const extractedData = extractNestedData(section.data);

      // Special handling for AboutUs
      if (section.component === 'AboutUsSection' || section.component === 'AboutUs') {
        // If extracted data has the expected structure
        if (extractedData && (extractedData.section || extractedData.mission || extractedData.impact || extractedData.image)) {
          return extractedData;
        }
        // If extracted data is an object but doesn't have the expected structure
        if (extractedData && typeof extractedData === 'object' && !Array.isArray(extractedData)) {
          // Try to map the data to the expected structure
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
      if (section.component === 'StoriesSection' || section.component === 'Stories') {
        // If extracted data has the expected structure with section and stories
        if (extractedData && (extractedData.section || extractedData.stories)) {
          return extractedData;
        }
        // If extracted data is an array, wrap it in the expected structure
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
    if (section.component === 'StoriesSection' || section.component === 'Stories') {
      // Check if section.data has the expected structure
      if (section.data && (section.data.section || section.data.stories)) {
        return section.data;
      }
      // If section.data is an array, wrap it
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
 * Supports both old and new prop names
 */
const buildComponentProps = (component, sectionData, section) => {
  // Don't include 'key' in the props object - it will be added separately
  const props = {
    ...(section.custom_props || {}),
  };

  // Map based on component name (support both old and new)
  const componentName = section.component;

  switch (componentName) {
    case 'HomeBanner':
    case 'BannerSection':
      props.bannerData = sectionData;
      break;

    case 'PageBannerSection':
    case 'PageBanner':
      props.bannerData = sectionData;
      break;

    case 'PageTagBannerSection': // NEW
    case 'PageTagBanner': // NEW - old name alias
      props.bannerData = sectionData;
      // Check if section has tags in custom_props
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
    case 'AboutUs':
      props.aboutUsData = sectionData;
      break;

    case 'OurActionSection':
    case 'OurAction':
      props.actionData = sectionData;
      break;

    case 'WhereWeWorkSection':
    case 'WhereWeWork':
      props.workData = sectionData;
      break;

    case 'OurProgramsSection':
    case 'OurPrograms':
      props.programsData = sectionData;
      break;

    case 'StoriesSection':
    case 'Stories':
      props.storiesData = sectionData;
      break;

    case 'BlogSection':
    case 'Blog':
      // BlogSection expects mainBlog and blogPosts
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        props.mainBlog = sectionData[0] || null;
        props.blogPosts = sectionData.slice(1) || [];
      } else {
        props.mainBlog = null;
        props.blogPosts = [];
      }
      // Check if section has a title in custom_props
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      break;

    case 'PublicationsSection':
    case 'Publications':
      // PublicationsSection expects mainPublication and publicationItems
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        // Find featured publication
        const featuredPub = sectionData.find(pub => pub.is_featured === true || pub.is_featured === 1);
        if (featuredPub) {
          props.mainPublication = featuredPub;
          props.publicationItems = sectionData.filter(pub => pub.id !== featuredPub.id);
        } else {
          props.mainPublication = sectionData[0] || null;
          props.publicationItems = sectionData.slice(1) || [];
        }
      } else if (typeof sectionData === 'object' && sectionData !== null) {
        // If sectionData has mainPublication and publicationItems
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
      // Check if section has a title in custom_props
      if (section.custom_props?.sectionTitle) {
        props.sectionTitle = section.custom_props.sectionTitle;
      }
      break;

    case 'ImageGallerySection':
    case 'ImageGallery':
      // ImageGallerySection expects galleryData
      props.galleryData = sectionData;
      // Check if section has custom props
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
    case 'VideoGallery':
      // VideoGallerySection expects videoData
      props.videoData = sectionData;
      // Check if section has custom props
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
    case 'Jobs':
      props.jobsData = sectionData;
      break;

    case 'ProgramImpactSection':
    case 'ProgramImpact':
      props.impactData = sectionData;
      break;

    case 'UpcomingEventsSection':
    case 'UpcomingEvents':
      props.eventsData = sectionData;
      break;

    case 'FAQSection':
    case 'FAQ':
      props.faqData = sectionData;
      break;

    case 'ContactOfficeSection':
    case 'ContactOffice':
      props.offices = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'AddressSection':
    case 'Address':
      props.officesLocation = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'ContactReachSection':
    case 'ContactReach':
      props.image = sectionData?.image || '';
      props.title = sectionData?.title || 'Reach out to us today!';
      props.buttonText = sectionData?.buttonText || 'Submit Message';
      break;

    case 'FollowUSSection':
    case 'FollowUS':
      props.socialItems = Array.isArray(sectionData) ? sectionData : [];
      break;

    case 'LegalSection':
    case 'Legal':
      props.legalData = sectionData;
      break;

    case 'HeroFigureSection':
    case 'HeroFigure':
      props.data = sectionData;
      break;

    case 'CardsSection':
    case 'Cards':
      props.cardsData = sectionData;
      break;

    case 'ProgramContentSection':
    case 'ProgramContent':
      props.programData = sectionData;
      break;

    case 'BlogContentSection':
    case 'BlogContent':
      props.blogData = sectionData;
      break;

    case 'ContentSection':
    case 'Content':
      props.subPageData = sectionData;
      break;

    default:
      props.data = sectionData;
      break;
  }

  return props;
};

/**
 * SectionIndex Component - Main renderer
 * Supports both old and new section data formats
 */
const SectionIndex = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        // Find component by name (supports both old and new)
        const Component = sectionComponents[section.component];

        if (!Component) {
          console.warn(`No component found for: ${section.component}`);
          return null;
        }

        // Extract data (supports both old and new formats)
        const sectionData = extractSectionData(section);

        // Build props (supports both old and new prop names)
        const props = buildComponentProps(section.component, sectionData, section);

        // Pass key directly to component, not as part of props spread
        return <Component key={section.id} {...props} />;
      })}
    </>
  );
};

export default SectionIndex;