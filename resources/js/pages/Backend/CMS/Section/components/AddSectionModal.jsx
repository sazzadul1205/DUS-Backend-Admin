/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/AddSectionModal.jsx

import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import { showToast } from '../utils/toastHelper';

const SECTION_OPTIONS = {
  // Special Sections (use external data tables)
  'BlogSection': {
    label: 'Blog Section',
    data_table: 'blogs',
    description: 'Displays blog posts from Blogs Manager',
    isSpecial: true
  },
  'OurProgramsSection': {
    label: 'Our Programs Section',
    data_table: 'programs',
    description: 'Displays programs from Program Manager',
    isSpecial: true
  },
  'JobsSection': {
    label: 'Jobs Section',
    data_table: 'jobs',
    description: 'Displays job listings from Job Manager',
    isSpecial: true
  },
  'FAQSection': {
    label: 'FAQ Section',
    data_table: 'shared_data',
    description: 'Displays FAQs from Shared Data Manager',
    isSpecial: true
  },
  'UpcomingEventsSection': {
    label: 'Upcoming Events Section',
    data_table: 'shared_data',
    description: 'Displays events from Shared Data Manager',
    isSpecial: true
  },
  'ContentSection': {
    label: 'Content Section',
    data_table: 'about_content',
    description: 'Dynamic content from About Content Manager',
    isSpecial: true
  },

  // Custom Data Sections (create custom_section_data entries)
  'HomeBanner': {
    label: 'Home Banner',
    data_table: 'custom_section_data',
    description: 'Full-width banner with text and buttons',
    isSpecial: false
  },
  'PageBannerSection': {
    label: 'Page Banner',
    data_table: 'custom_section_data',
    description: 'Page header banner with title and description',
    isSpecial: false
  },
  'PageTagBannerSection': {
    label: 'Page Tag Banner',
    data_table: 'custom_section_data',
    description: 'Page header banner with tags and title',
    isSpecial: false
  },
  'AboutUsSection': {
    label: 'About Us Section',
    data_table: 'custom_section_data',
    description: 'About us with mission and impact stats',
    isSpecial: false
  },
  'OurActionSection': {
    label: 'Our Actions Section',
    data_table: 'custom_section_data',
    description: 'Grid of action items with icons',
    isSpecial: false
  },
  'WhereWeWorkSection': {
    label: 'Where We Work Section',
    data_table: 'custom_section_data',
    description: 'Statistics with map image',
    isSpecial: false
  },
  'StoriesSection': {
    label: 'Stories Section',
    data_table: 'custom_section_data',
    description: 'Grid of stories with images and dates',
    isSpecial: false
  },
  'HeroFigureSection': {
    label: 'Hero with Figure',
    data_table: 'custom_section_data',
    description: 'Hero with image and rich text content',
    isSpecial: false
  },
  'CardsSection': {
    label: 'Cards Section',
    data_table: 'custom_section_data',
    description: 'Cards with images and buttons',
    isSpecial: false
  },
  'ContactOfficeSection': {
    label: 'Contact Office Section',
    data_table: 'custom_section_data',
    description: 'Office locations with contact details',
    isSpecial: false
  },
  'AddressSection': {
    label: 'Address Section',
    data_table: 'custom_section_data',
    description: 'Addresses with map and coordinates',
    isSpecial: false
  },
  'ContactReachSection': {
    label: 'Contact Reach Section',
    data_table: 'custom_section_data',
    description: 'Contact form with image',
    isSpecial: false
  },
  'FollowUSSection': {
    label: 'Follow Us Section',
    data_table: 'custom_section_data',
    description: 'Social media links',
    isSpecial: false
  },
  'LegalSection': {
    label: 'Legal Section',
    data_table: 'custom_section_data',
    description: 'Legal status with background image',
    isSpecial: false
  },
  'ProgramImpactSection': {
    label: 'Program Impact Section',
    data_table: 'custom_section_data',
    description: 'Program impact with SDG images',
    isSpecial: false
  },

  'PublicationsSection': {
    label: 'Publications Section',
    data_table: 'publications',
    description: 'Displays publications from Publications Manager',
    isSpecial: true
  },
  // ===== NEW: Gallery Sections =====
  'ImageGallerySection': {
    label: 'Image Gallery Section',
    data_table: 'custom_section_data',
    description: 'Program impact with SDG images',
    isSpecial: false
  },
  'VideoGallerySection': {
    label: 'Video Gallery Section',
    data_table: 'custom_section_data',
    description: 'Program impact with SDG Videos',
    isSpecial: false
  },

};

const AddSectionModal = ({ isOpen, onClose, pageId, onSuccess }) => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [sectionKey, setSectionKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestedKey, setSuggestedKey] = useState('');

  useEffect(() => {
    if (selectedComponent) {
      const baseKey = selectedComponent
        .replace('Section', '')
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
        .replace(/-+/g, '-');
      setSuggestedKey(baseKey);
      setSectionKey(baseKey);
    }
  }, [selectedComponent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const option = SECTION_OPTIONS[selectedComponent];

    const data = {
      page_id: pageId,
      component: selectedComponent,
      section_key: sectionKey,
      data_table: option.data_table,
      is_enabled: true,
      custom_props: {}
    };

    router.post(
      route('backend.cms.sections.store'),
      data,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsSubmitting(false);
          showToast('success', '✅ Created!', 'Section created successfully.', 2000);
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (errors) => {
          setIsSubmitting(false);
          setErrors(errors);
          const errorMessage = errors.message || 'Failed to create section.';
          showToast('error', '❌ Creation Failed', errorMessage, 4000);
        },
      }
    );
  };

  if (!isOpen) return null;

  const selectedOption = selectedComponent ? SECTION_OPTIONS[selectedComponent] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">Add New Section</h2>
            <p className="text-sm text-gray-500 mt-1">Select a section type and configure it</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Section Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Type <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => {
                setSelectedComponent(e.target.value);
                setErrors({});
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.component ? 'border-red-500' : 'border-gray-300'
                }`}
              required
            >
              <option value="">-- Select Section Type --</option>
              <optgroup label="Special Sections (External Data)">
                {Object.entries(SECTION_OPTIONS)
                  .filter(([, opt]) => opt.isSpecial)
                  .map(([key, opt]) => (
                    <option key={key} value={key}>
                      {opt.label} ⭐
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Custom Data Sections">
                {Object.entries(SECTION_OPTIONS)
                  .filter(([, opt]) => !opt.isSpecial)
                  .map(([key, opt]) => (
                    <option key={key} value={key}>
                      {opt.label}
                    </option>
                  ))}
              </optgroup>
            </select>
            {errors.component && (
              <p className="mt-1 text-sm text-red-500">{errors.component}</p>
            )}
          </div>

          {/* Section Description */}
          {selectedOption && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Type:</strong> {selectedOption.isSpecial ? '⭐ Special (External Data)' : '📝 Custom Data'}
              </p>
              <p className="text-xs text-blue-600 mt-1">{selectedOption.description}</p>
              <p className="text-xs text-blue-500 mt-1">
                Data Table: <code className="px-1 py-0.5 bg-blue-100 rounded">{selectedOption.data_table}</code>
              </p>
            </div>
          )}

          {/* Section Key */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sectionKey}
              onChange={(e) => setSectionKey(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.section_key ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., about-us, our-programs, banner"
              required
            />
            {errors.section_key && (
              <p className="mt-1 text-sm text-red-500">{errors.section_key}</p>
            )}
            {selectedComponent && (
              <p className="mt-1 text-xs text-gray-400">
                💡 Suggested: <code className="px-1 py-0.5 bg-gray-100 rounded">{suggestedKey}</code>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">Unique identifier for this section (use lowercase with hyphens)</p>
          </div>

          {/* Section Info Box */}
          {selectedOption && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Section Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Component:</span>
                  <span className="ml-2 text-gray-700 font-mono">{selectedComponent}</span>
                </div>
                <div>
                  <span className="text-gray-500">Data Table:</span>
                  <span className="ml-2 text-gray-700 font-mono">{selectedOption.data_table}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 text-green-600">✅ Will be enabled by default</span>
                </div>
                {selectedOption.isSpecial && (
                  <div className="col-span-2">
                    <span className="text-orange-500">⭐</span>
                    <span className="ml-1 text-sm text-orange-600">
                      Special section - Data managed externally. No custom data entry will be created.
                    </span>
                  </div>
                )}
                {!selectedOption.isSpecial && (
                  <div className="col-span-2">
                    <span className="text-blue-500">📝</span>
                    <span className="ml-1 text-sm text-blue-600">
                      Custom section - A new custom data entry with pre-filled template will be created.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedComponent}
              className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${isSubmitting || !selectedComponent
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus size={14} />
                  Create Section
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSectionModal;