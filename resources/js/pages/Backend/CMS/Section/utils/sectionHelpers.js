// resources/js/pages/Backend/CMS/Section/utils/sectionHelpers.js

/**
 * Section Helpers - Utility functions for sections
 * Features:
 * - Component label mapping
 * - Data table label mapping
 * - Section type detection
 * - Statistics calculation
 */

/**
 * Get human-readable component label from component name
 */
export const getComponentLabel = (component) => {
  const labels = {
    // Banner Sections
    'HomeBanner': 'Home Banner',
    'PageBannerSection': 'Page Banner',

    // Content Sections
    'AboutUsSection': 'About Us',
    'OurActionSection': 'Our Actions',
    'WhereWeWorkSection': 'Where We Work',
    'OurProgramsSection': 'Our Programs',
    'StoriesSection': 'Stories',
    'BlogSection': 'Blog',
    'JobsSection': 'Jobs',
    'ProgramImpactSection': 'Program Impact',
    'UpcomingEventsSection': 'Upcoming Events',
    'HeroFigureSection': 'Hero with Figure',
    'CardsSection': 'Cards',
    'FAQSection': 'FAQ',
    'ContactOfficeSection': 'Contact Office',
    'AddressSection': 'Address',
    'ContactReachSection': 'Contact Reach',
    'FollowUSSection': 'Follow Us',
    'LegalSection': 'Legal',

    // Content Sections for Details Pages
    'ProgramContentSection': 'Program Content',
    'BlogContentSection': 'Blog Content',
    'ContentSection': 'Content',
  };
  return labels[component] || component;
};

/**
 * Get human-readable data table label
 */
export const getDataTableLabel = (table) => {
  const labels = {
    'custom_section_data': 'Custom Data',
    'shared_data': 'Shared Data',
    'blogs': 'Blogs',
    'programs': 'Programs',
    'about_content': 'About Content',
    'jobs': 'Jobs',
    'our_programs': 'Our Programs',
  };
  return labels[table] || table || 'None';
};

/**
 * Get section type information (label, color, icon)
 * Used for the "Type" column and styling
 */
export const getSectionTypeInfo = (section) => {
  // Fixed sections - cannot be moved or deleted
  if (section.is_fixed_section) {
    return { label: 'Fixed', color: 'bg-blue-100 text-blue-700', icon: '🔒' };
  }

  // Banner sections
  if (section.component === 'HomeBanner' || section.component === 'PageBannerSection') {
    return { label: 'Banner', color: 'bg-yellow-100 text-yellow-700', icon: '⭐' };
  }

  // Shared data sections
  if (section.data_table === 'shared_data') {
    return { label: 'Shared', color: 'bg-green-100 text-green-700', icon: '🔄' };
  }

  // Jobs sections
  if (section.data_table === 'jobs') {
    return { label: 'Jobs', color: 'bg-purple-100 text-purple-700', icon: '💼' };
  }

  // Programs sections
  if (section.data_table === 'programs' || section.component === 'OurProgramsSection') {
    return { label: 'Programs', color: 'bg-orange-100 text-orange-700', icon: '📋' };
  }

  // Default - Normal section
  return { label: 'Normal', color: 'bg-gray-100 text-gray-600', icon: '📄' };
};

/**
 * Calculate statistics for sections
 * Used in header and footer
 */
export const getSectionStats = (sections) => {
  return {
    total: sections.length,
    fixed: sections.filter(s => s.is_fixed_section).length,
    banner: sections.filter(s => s.component === 'HomeBanner' || s.component === 'PageBannerSection').length,
    shared: sections.filter(s => s.data_table === 'shared_data').length,
    jobs: sections.filter(s => s.data_table === 'jobs').length,
    programs: sections.filter(s => s.data_table === 'programs' || s.component === 'OurProgramsSection').length,
    hasData: sections.filter(s => s.data !== null && s.data !== undefined).length,
  };
};