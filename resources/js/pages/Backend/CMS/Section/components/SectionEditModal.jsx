/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/SectionEditModal.jsx

/**
 * SectionEditModal - Modal for editing section configuration
 * Features:
 * - Tabbed interface: Basic Data & Section Data
 * - Edit section key, status, and custom props
 * - Read-only display of component and data source
 * - Integrated SectionDataViewer for data preview
 * - Form validation and error handling
 * - Save button visible on both tabs
 * - Support for checkbox, number, text, select, color, and textarea fields
 */

// React
import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

// Icons
import { FaTimes, FaSave, FaSpinner, FaCog, FaDatabase } from 'react-icons/fa';

// Utils
import { showToast } from '../utils/toastHelper';
import { getComponentLabel } from '../utils/sectionHelpers';
import { DEFAULT_CONFIG, SECTION_CONFIGS } from '../utils/SectionConfigData';

// Components
import RenderDataTab from './modals/renderDataTab';

// Helper: Check if section has data
const hasSectionData = (section) => {
  return section?.data !== null && section?.data !== undefined;
};

// Constants for data table display labels
const DATA_TABLE_LABELS = {
  custom_section_data: 'Custom Data',
  shared_data: 'Shared Data',
  blogs: 'Blogs',
  programs: 'Programs',
  about_content: 'About Content',
  jobs: 'Jobs',
  our_programs: 'Our Programs',
};

const SectionEditModal = ({
  isOpen,
  onClose,
  section,
  onSuccess
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'data'

  // Form state
  const [formData, setFormData] = useState({
    section_key: '',
    component: '',
    data_table: '',
    data_key: '',
    is_enabled: true,
    custom_props: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Section Data state (for the data tab content)
  const [sectionData, setSectionData] = useState(null);

  /**
   * Get section configuration for custom props
   */
  const getSectionConfig = () => {
    if (!section) return DEFAULT_CONFIG;
    return SECTION_CONFIGS[section.component] || DEFAULT_CONFIG;
  };

  // Populate form when section changes
  useEffect(() => {
    if (section) {
      // console.log('📥 Section loaded:', section);
      // console.log('📥 Custom props:', section.custom_props);

      setFormData({
        section_key: section.section_key || '',
        component: section.component || '',
        data_table: section.data_table || '',
        data_key: section.data_key || '',
        is_enabled: section.is_enabled ?? true,
        custom_props: section.custom_props || {},
      });
      // Reset section data when section changes
      setSectionData(null);
    }
  }, [section]);

  // Reset errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setActiveTab('basic');
      setSectionData(null);
    }
  }, [isOpen]);

  // Early return if modal is closed or no section
  if (!isOpen || !section) return null;

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle custom property changes
   */
  const handleCustomPropChange = (key, value) => {
    // console.log('🔧 Custom prop changed:', { key, value });
    setFormData(prev => {
      const newFormData = {
        ...prev,
        custom_props: {
          ...prev.custom_props,
          [key]: value
        }
      };
      // console.log('📝 Updated formData:', newFormData);
      return newFormData;
    });
    if (errors.custom_props) {
      setErrors(prev => ({ ...prev, custom_props: '' }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!formData.section_key.trim()) {
      newErrors.section_key = 'Section key is required';
    }
    if (!formData.component.trim()) {
      newErrors.component = 'Component is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission - START WITH FORM DATA
    const submitData = {
      section_key: formData.section_key,
      component: formData.component,
      data_table: formData.data_table,
      data_key: formData.data_key,
      is_enabled: formData.is_enabled,
      custom_props: formData.custom_props || {},
    };

    // console.log('📤 Submitting data (before merge):', submitData);

    // CRITICAL FIX: Merge section data changes properly
    if (sectionData !== null && Object.keys(sectionData).length > 0) {
      // ✅ ONLY merge custom_props from sectionData if they DON'T exist in formData
      // OR if they are specifically for the data tab (not basic settings)
      if (sectionData.custom_props) {
        // ❌ REMOVE THIS - it's overwriting the formData custom_props
        // submitData.custom_props = {
        //   ...submitData.custom_props,
        //   ...sectionData.custom_props
        // };

        // ✅ Instead, ONLY merge sectionData.custom_props if they are different
        // and ONLY for keys that are NOT in formData.custom_props
        const formDataKeys = Object.keys(submitData.custom_props);
        const sectionDataKeys = Object.keys(sectionData.custom_props);

        sectionDataKeys.forEach(key => {
          // Only add if the key doesn't exist in formData
          if (!formDataKeys.includes(key)) {
            submitData.custom_props[key] = sectionData.custom_props[key];
          }
        });
      }

      // If sectionData contains other data (like the programs data), include it
      // But don't include custom_props as a nested property in data
      const dataToSend = { ...sectionData };
      delete dataToSend.custom_props; // Remove custom_props from data if present

      if (Object.keys(dataToSend).length > 0) {
        submitData.data = dataToSend;
      }
    }

    // console.log('📤 Submitting data (after merge):', submitData);

    router.put(
      route('backend.cms.sections.update', { section: section.id }),
      submitData,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsSubmitting(false);
          showToast('success', '✅ Updated!', 'Section updated successfully.', 2000);
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        },
        onError: (errors) => {
          setIsSubmitting(false);
          if (errors && typeof errors === 'object') {
            setErrors(errors);
            const errorMessage = errors.message || 'Please check the form for errors.';
            showToast('error', '❌ Update Failed', errorMessage, 4000);
          }
        },
      }
    );
  };

  const sectionConfig = getSectionConfig();

  /**
   * Get display label for data table
   */
  const getDataTableDisplayLabel = (table) => {
    return DATA_TABLE_LABELS[table] || table || 'None';
  };

  const hasData = hasSectionData(section);

  /**
   * Render Basic Data Tab
   */
  const renderBasicTab = () => (
    <div className="space-y-6">
      {/* Section Key - Editable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Key <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="section_key"
          value={formData.section_key}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.section_key ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., home_banner"
          aria-invalid={!!errors.section_key}
        />
        {errors.section_key && (
          <p className="mt-1 text-sm text-red-500">{errors.section_key}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">Unique identifier for this section</p>
      </div>

      {/* Component - Read Only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Component <span className="text-red-500">*</span>
        </label>
        <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
          {getComponentLabel(formData.component)} ({formData.component})
        </div>
        <p className="mt-1 text-xs text-blue-600">🔒 Component cannot be changed after creation</p>
      </div>

      {/* Data Source - Locked / Read Only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Table
        </label>
        <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 flex items-center justify-between">
          <span>{getDataTableDisplayLabel(formData.data_table)}</span>
          <span className="text-xs text-gray-400">🔒 Locked</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">Data source cannot be changed after creation</p>
      </div>

      {/* Data Key - Auto-generated, read only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Key
        </label>
        <input
          type="text"
          name="data_key"
          value={formData.data_key}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
          disabled
        />
        <p className="mt-1 text-xs text-gray-400">🔒 Auto-generated based on section configuration</p>
      </div>

      {/* Status - Toggle */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_enabled"
            checked={formData.is_enabled}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 font-medium">Enabled</span>
          <span className="text-xs text-gray-400 ml-2">(Visible on the frontend)</span>
        </label>
      </div>

      {/* Custom Props - Section specific configuration */}
      {sectionConfig.fields.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Section Configuration</h3>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {sectionConfig.fields.map((field) => {
              const currentValue = formData.custom_props?.[field.key] ?? field.default ?? '';

              return (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {/* Color Picker Field */}
                  {field.type === 'color' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(() => {
                          // Extract hex from various formats
                          if (!currentValue) return '#ffffff';
                          if (currentValue.startsWith('#')) return currentValue;
                          if (currentValue.startsWith('bg-[') && currentValue.endsWith(']')) {
                            const match = currentValue.match(/bg-\[(.*?)\]/);
                            return match ? match[1] : '#ffffff';
                          }
                          // Handle standard Tailwind colors
                          const colorMap = {
                            'bg-white': '#ffffff',
                            'bg-gray-50': '#f9fafb',
                            'bg-gray-100': '#f3f4f6',
                            'bg-blue-50': '#eff6ff',
                            'bg-green-50': '#f0fdf4',
                            'bg-purple-50': '#faf5ff',
                            'bg-yellow-50': '#fefce8',
                            'bg-red-50': '#fef2f2',
                            'bg-indigo-50': '#eef2ff',
                            'bg-pink-50': '#fdf2f8',
                            'bg-orange-50': '#fff7ed',
                            'bg-teal-50': '#f0fdfa',
                            'bg-[#F5F5F5]': '#F5F5F5',
                            'bg-[#F9F9FA]': '#F9F9FA',
                          };
                          return colorMap[currentValue] || '#ffffff';
                        })()}
                        onChange={(e) => {
                          const hexColor = e.target.value;
                          // console.log('🎨 Color changed to:', hexColor); // Debug log
                          // Store as Tailwind format: bg-[#hex]
                          handleCustomPropChange(field.key, `bg-[${hexColor}]`);
                        }}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer p-1"
                      />
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => {
                          let value = e.target.value.trim();
                          // console.log('📝 Text input changed to:', value); // Debug log
                          // If user enters just a hex color, auto-wrap it
                          if (value.match(/^#[0-9a-fA-F]{6}$/)) {
                            value = `bg-[${value}]`;
                          }
                          // If user enters just a color name like 'white', add bg- prefix
                          else if (value.match(/^[a-zA-Z-]+$/) && !value.startsWith('bg-')) {
                            value = `bg-${value}`;
                          }
                          handleCustomPropChange(field.key, value);
                        }}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                        placeholder="bg-white or #F9F9FA"
                      />
                      {/* Color preview swatch */}
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200 shrink-0"
                        style={{
                          backgroundColor: (() => {
                            if (!currentValue) return '#ffffff';
                            if (currentValue.startsWith('#')) return currentValue;
                            if (currentValue.startsWith('bg-[') && currentValue.endsWith(']')) {
                              const match = currentValue.match(/bg-\[(.*?)\]/);
                              return match ? match[1] : '#ffffff';
                            }
                            const colorMap = {
                              'bg-white': '#ffffff',
                              'bg-gray-50': '#f9fafb',
                              'bg-gray-100': '#f3f4f6',
                              'bg-blue-50': '#eff6ff',
                              'bg-green-50': '#f0fdf4',
                              'bg-purple-50': '#faf5ff',
                              'bg-yellow-50': '#fefce8',
                              'bg-red-50': '#fef2f2',
                              'bg-indigo-50': '#eef2ff',
                              'bg-pink-50': '#fdf2f8',
                              'bg-orange-50': '#fff7ed',
                              'bg-teal-50': '#f0fdfa',
                              'bg-[#F5F5F5]': '#F5F5F5',
                              'bg-[#F9F9FA]': '#F9F9FA',
                            };
                            return colorMap[currentValue] || '#ffffff';
                          })()
                        }}
                      />
                    </div>
                  )}

                  {/* Select Dropdown Field */}
                  {field.type === 'select' && field.options && (
                    <select
                      value={currentValue}
                      onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      aria-label={`Select ${field.label}`}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Text Input Field */}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                      aria-label={`Enter ${field.label}`}
                    />
                  )}

                  {/* Number Input Field */}
                  {field.type === 'number' && (
                    <div>
                      <input
                        type="number"
                        min={field.min || 0}
                        max={field.max || 100}
                        value={currentValue}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleCustomPropChange(field.key, value);
                          } else if (e.target.value === '') {
                            handleCustomPropChange(field.key, field.default || 0);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder={field.default?.toString() || '0'}
                        aria-label={`Enter ${field.label}`}
                      />
                      {field.description && (
                        <p className="text-xs text-gray-400 mt-1">{field.description}</p>
                      )}
                      {field.min !== undefined && field.max !== undefined && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Range: {field.min} - {field.max}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Checkbox Field */}
                  {field.type === 'checkbox' && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`prop-${field.key}`}
                        checked={currentValue === true || currentValue === 'true' || currentValue === 1 || currentValue === '1'}
                        onChange={(e) => handleCustomPropChange(field.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`prop-${field.key}`} className="text-sm text-gray-700">
                        {field.label}
                      </label>
                      {field.description && (
                        <span className="text-xs text-gray-400 ml-2">{field.description}</span>
                      )}
                    </div>
                  )}

                  {/* Textarea Field */}
                  {field.type === 'textarea' && (
                    <textarea
                      value={currentValue}
                      onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                      rows={field.rows || 4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                      placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                      aria-label={`Enter ${field.label}`}
                    />
                  )}

                  {/* Field Description */}
                  {field.type !== 'checkbox' && field.type !== 'number' && field.description && (
                    <p className="text-xs text-gray-400 mt-1">{field.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideUp"
        style={{ animationDuration: '200ms' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">Edit Section</h2>
            <p className="text-sm text-gray-500 mt-1">
              {section.section_key} • ID: {section.id}
            </p>
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <FaCog size={14} />
                Basic Data
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'data'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <FaDatabase size={14} />
                Section Data
                {hasData && (
                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Body - BOTH tabs are rendered but only one is visible */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="min-h-100 relative">
            {/* Basic Data Tab */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              {renderBasicTab()}
            </div>

            {/* Section Data Tab */}
            <div className={activeTab === 'data' ? 'block' : 'hidden'}>
              <RenderDataTab
                section={section}
                hasData={hasData}
                onDataChange={setSectionData}
              />
            </div>
          </div>

          {/* Actions - Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            {/* Save button - Visible on BOTH tabs */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionEditModal;