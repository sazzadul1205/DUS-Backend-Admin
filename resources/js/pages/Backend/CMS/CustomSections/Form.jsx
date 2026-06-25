// resources/js/pages/Backend/CMS/CustomSections/Form.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';
import { useAuth } from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';

// Icons
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaSpinner,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';

export default function CustomSectionForm({ custom_section = null, pages }) {
  const { hasAnyPermission } = useAuth();
  const isEdit = !!custom_section;

  // Permission checks
  const canCreate = hasAnyPermission(['custom-sections.create', 'custom-sections.manage']);
  const canEdit = hasAnyPermission(['custom-sections.update', 'custom-sections.manage']);

  // Check if user has permission
  if ((isEdit && !canEdit) || (!isEdit && !canCreate)) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">
              You don't have permission to {isEdit ? 'edit' : 'create'} custom sections.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    page_slug: custom_section?.page_slug || '',
    section_key: custom_section?.section_key || '',
    data: custom_section?.data || {},
    is_active: custom_section?.is_active ?? true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jsonError, setJsonError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If data field, validate JSON
    if (name === 'data') {
      try {
        if (value.trim()) {
          JSON.parse(value);
          setJsonError('');
        } else {
          setJsonError('');
        }
      } catch (e) {
        setJsonError('Invalid JSON format');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.page_slug) newErrors.page_slug = 'Page is required';
    if (!formData.section_key.trim()) newErrors.section_key = 'Section key is required';

    // Validate JSON
    try {
      if (typeof formData.data === 'string' && formData.data.trim()) {
        JSON.parse(formData.data);
      } else if (typeof formData.data === 'object') {
        // Already an object, fine
      }
    } catch (e) {
      newErrors.data = 'Invalid JSON format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    // Parse JSON if it's a string
    const submitData = {
      ...formData,
      data: typeof formData.data === 'string' ? JSON.parse(formData.data) : formData.data,
    };

    const url = isEdit
      ? route('cms.custom-sections.update', custom_section.id)
      : route('cms.custom-sections.store');

    const method = isEdit ? 'put' : 'post';

    router[method](url, submitData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Custom section ${isEdit ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.visit(route('cms.custom-sections'));
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${isEdit ? 'update' : 'create'} custom section.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  // Format JSON for display
  const formatJson = (data) => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <AuthenticatedLayout>
      <Head title={isEdit ? 'Edit Custom Section' : 'Create Custom Section'} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('cms.custom-sections')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                  <span className="text-sm">Back to Custom Sections</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Custom Section' : 'Create Custom Section'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update custom section data' : 'Add custom section data for a page'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Page Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page <span className="text-red-500">*</span>
                </label>
                <select
                  name="page_slug"
                  value={formData.page_slug}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.page_slug ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.slug}>
                      {page.name} ({page.slug})
                    </option>
                  ))}
                </select>
                {errors.page_slug && <p className="text-red-500 text-xs mt-1">{errors.page_slug}</p>}
              </div>

              {/* Section Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="section_key"
                  value={formData.section_key}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.section_key ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., banner, about-us, our-programs"
                />
                {errors.section_key && <p className="text-red-500 text-xs mt-1">{errors.section_key}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Unique identifier for this section. Use lowercase letters and hyphens.
                </p>
              </div>

              {/* Data (JSON) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data (JSON) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="data"
                  value={formatJson(formData.data)}
                  onChange={handleChange}
                  rows="15"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none ${errors.data || jsonError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder='{"section":{"title":"About Us","description":"..."}}'
                />
                {(errors.data || jsonError) && (
                  <p className="text-red-500 text-xs mt-1">{errors.data || jsonError}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Enter valid JSON data for this section. This will be passed to the component as props.
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <FaCode className={formData.is_active ? 'text-green-600' : 'text-gray-400'} size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Active</span>
                    <p className="text-xs text-gray-500">Inactive sections won't be displayed on the frontend</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">About Custom Sections</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Custom sections allow you to add dynamic content to pages</li>
                    <li>Data is stored as JSON and passed to React components</li>
                    <li>The section key must match the component that renders it</li>
                    <li>Make sure your JSON is valid before saving</li>
                  </ul>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  href={route('cms.custom-sections')}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !!jsonError}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 font-medium shadow-md"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  <FaSave size={16} />
                  {isEdit ? (isSubmitting ? 'Updating...' : 'Update Section') : (isSubmitting ? 'Creating...' : 'Create Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}