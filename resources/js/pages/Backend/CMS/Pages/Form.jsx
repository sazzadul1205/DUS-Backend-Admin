// resources/js/pages/Backend/CMS/Pages/Form.jsx

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
  FaFileAlt,
  FaShieldAlt,
} from 'react-icons/fa';

export default function PageForm({ page = null }) {
  const { hasAnyPermission } = useAuth();
  const isEdit = !!page;

  // Permission checks
  const canCreate = hasAnyPermission(['pages.create', 'pages.manage']);
  const canEdit = hasAnyPermission(['pages.update', 'pages.manage']);

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
              You don't have permission to {isEdit ? 'edit' : 'create'} pages.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    name: page?.name || '',
    title: page?.title || '',
    description: page?.description || '',
    is_active: page?.is_active ?? true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';

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

    const url = isEdit
      ? route('cms.pages.update', page.id)
      : route('cms.pages.store');

    const method = isEdit ? 'put' : 'post';

    router[method](url, formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Page ${isEdit ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.visit(route('cms.pages'));
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${isEdit ? 'update' : 'create'} page.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={isEdit ? 'Edit Page' : 'Create Page'} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('cms.pages')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                  <span className="text-sm">Back to Pages</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Page' : 'Create Page'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update the page details' : 'Add a new page to your website'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., About Us, Contact, Services"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., about-us, contact, services"
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  URL-friendly identifier. Use lowercase letters, numbers, and hyphens.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., About Us - DUS"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="A brief description of the page for SEO purposes"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Optional. Used for SEO and meta description.
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {formData.is_active ? <FaFileAlt className="text-green-600" size={14} /> : <FaTimes className="text-gray-500" size={14} />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Active</span>
                    <p className="text-xs text-gray-500">Inactive pages won't be accessible on the frontend</p>
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

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  href={route('cms.pages')}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 font-medium shadow-md"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  <FaSave size={16} />
                  {isEdit ? (isSubmitting ? 'Updating...' : 'Update Page') : (isSubmitting ? 'Creating...' : 'Create Page')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}