// resources/js/pages/Backend/CMS/SharedData/Form.jsx

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
  FaDatabase,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';

export default function SharedDataForm({ shared_data = null, available_types }) {
  const { hasAnyPermission } = useAuth();
  const isEdit = !!shared_data;

  // Permission checks
  const canCreate = hasAnyPermission(['shared-data.create', 'shared-data.manage']);
  const canEdit = hasAnyPermission(['shared-data.update', 'shared-data.manage']);

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
              You don't have permission to {isEdit ? 'edit' : 'create'} shared data.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    type: shared_data?.type || '',
    data: shared_data?.data || {},
    is_active: shared_data?.is_active ?? true,
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
    if (!formData.type) newErrors.type = 'Type is required';

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
      ? route('cms.shared-data.update', shared_data.id)
      : route('cms.shared-data.store');

    const method = isEdit ? 'put' : 'post';

    router[method](url, submitData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Shared data ${isEdit ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.visit(route('cms.shared-data'));
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${isEdit ? 'update' : 'create'} shared data.`,
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

  // Type labels
  const typeLabels = {
    topbar: 'Topbar',
    navbar: 'Navbar',
    footer: 'Footer',
    faq: 'FAQ',
    'upcoming-events': 'Upcoming Events',
  };

  // Type descriptions
  const typeDescriptions = {
    topbar: 'Top bar with contact info, languages, and social links',
    navbar: 'Main navigation bar with logo, links, and CTA button',
    footer: 'Footer with company info, social links, and newsletter signup',
    faq: 'Frequently Asked Questions section',
    'upcoming-events': 'Upcoming events and community actions',
  };

  return (
    <AuthenticatedLayout>
      <Head title={isEdit ? 'Edit Shared Data' : 'Create Shared Data'} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('cms.shared-data')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                  <span className="text-sm">Back to Shared Data</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Shared Data' : 'Create Shared Data'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update shared data' : 'Add shared data used across the website'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a type</option>
                  {available_types.map(type => (
                    <option key={type} value={type}>
                      {typeLabels[type] || type}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                {formData.type && typeDescriptions[formData.type] && (
                  <p className="text-xs text-gray-400 mt-1">{typeDescriptions[formData.type]}</p>
                )}
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
                  placeholder='{"section":{"title":"FAQ","subtitle":"..."},"faqs":[...]}'
                />
                {(errors.data || jsonError) && (
                  <p className="text-red-500 text-xs mt-1">{errors.data || jsonError}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Enter valid JSON data. Check the documentation for the expected structure.
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <FaDatabase className={formData.is_active ? 'text-green-600' : 'text-gray-400'} size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Active</span>
                    <p className="text-xs text-gray-500">Inactive data won't be used on the frontend</p>
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
                  <p className="font-medium mb-1">About Shared Data</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Shared data is used across multiple pages and layouts</li>
                    <li>Each type should have only one active record</li>
                    <li>Data is stored as JSON and passed to React components</li>
                    <li>Make sure your JSON matches the expected structure</li>
                  </ul>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  href={route('cms.shared-data')}
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
                  {isEdit ? (isSubmitting ? 'Updating...' : 'Update Shared Data') : (isSubmitting ? 'Creating...' : 'Create Shared Data')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}