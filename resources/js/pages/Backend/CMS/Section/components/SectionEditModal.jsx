/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/SectionEditModal.jsx

/**
 * SectionEditModal - Modal for editing section configuration
 * Features:
 * - Edit section key, status, and custom props
 * - Read-only display of component and data source
 * - Integrated SectionDataViewer for data preview
 * - Form validation and error handling
 */

import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import SectionDataViewer from './SectionDataViewer';
import { showToast } from '../utils/toastHelper';
import { getComponentLabel } from '../utils/sectionHelpers';
import { DEFAULT_CONFIG, SECTION_CONFIGS } from '../utils/SectionConfigData';

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
  pageId,
  onSuccess
}) => {
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
      setFormData({
        section_key: section.section_key || '',
        component: section.component || '',
        data_table: section.data_table || '',
        data_key: section.data_key || '',
        is_enabled: section.is_enabled ?? true,
        custom_props: section.custom_props || {},
      });
    }
  }, [section]);

  // Reset errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
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
    setFormData(prev => ({
      ...prev,
      custom_props: {
        ...prev.custom_props,
        [key]: value
      }
    }));
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

    // Prepare data for submission
    const submitData = {
      section_key: formData.section_key,
      component: formData.component,
      data_table: formData.data_table,
      data_key: formData.data_key,
      is_enabled: formData.is_enabled,
      custom_props: formData.custom_props || {},
    };

    // Send update request
    router.put(
      route('backend.cms.sections.update', { page: pageId, section: section.id }),
      submitData,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsSubmitting(false);
          showToast('success', '✅ Updated!', 'Section updated successfully.', 2000);
          if (onSuccess) onSuccess();
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      </label>

                      {/* Color Picker Field */}
                      {field.type === 'color' && (
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={currentValue.startsWith('#') ? currentValue : '#ffffff'}
                            onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                            aria-label={`Select color for ${field.label}`}
                          />
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder={field.default || 'Enter color class or hex'}
                          />
                          <span className="text-xs text-gray-400">(e.g., bg-white or #ffffff)</span>
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
                        <input
                          type="number"
                          value={currentValue}
                          onChange={(e) => handleCustomPropChange(field.key, parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder={field.default?.toString() || '0'}
                          aria-label={`Enter ${field.label}`}
                        />
                      )}

                      {/* Textarea Field */}
                      {field.type === 'textarea' && (
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleCustomPropChange(field.key, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                          placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                          aria-label={`Enter ${field.label}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section Data Viewer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Section Data</h3>
            <SectionDataViewer section={section} hasSectionData={hasData} />
          </div>

          {/* Actions - Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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