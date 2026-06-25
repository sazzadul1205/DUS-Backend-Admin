// resources/js/pages/Backend/CMS/Programs/Form.jsx

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
  FaBriefcase,
  FaStar,
  FaPalette,
  FaLink,
  FaShieldAlt,
} from 'react-icons/fa';

export default function ProgramForm({ program = null }) {
  const { hasAnyPermission } = useAuth();
  const isEdit = !!program;

  // Permission checks
  const canCreate = hasAnyPermission(['programs.create', 'programs.manage']);
  const canEdit = hasAnyPermission(['programs.update', 'programs.manage']);

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
              You don't have permission to {isEdit ? 'edit' : 'create'} programs.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    slug: program?.slug || '',
    title: program?.title || '',
    breadcrumb: program?.breadcrumb || '',
    full_content_html: program?.full_content_html || '',
    image: program?.image || '',
    bg_color: program?.bg_color || '#ffffff',
    link: program?.link || '',
    is_featured: program?.is_featured ?? false,
    display_order: program?.display_order || 0,
    is_active: program?.is_active ?? true,
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.full_content_html.trim()) newErrors.full_content_html = 'Content is required';

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
      ? route('cms.programs.update', program.id)
      : route('cms.programs.store');

    const method = isEdit ? 'put' : 'post';

    router[method](url, formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Program ${isEdit ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.visit(route('cms.programs'));
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${isEdit ? 'update' : 'create'} program.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={isEdit ? 'Edit Program' : 'Create Program'} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('cms.programs')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                  <span className="text-sm">Back to Programs</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Program' : 'Create Program'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update program details' : 'Add a new program'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="micro-finance"
                  />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Micro-Finance Program"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
              </div>

              {/* Breadcrumb */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breadcrumb
                </label>
                <input
                  type="text"
                  name="breadcrumb"
                  value={formData.breadcrumb}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Micro-Finance Program"
                />
              </div>

              {/* Image and Background Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Path
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="/storage/programs/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="bg_color"
                        value={formData.bg_color}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="#E6F3E7"
                      />
                    </div>
                    <input
                      type="color"
                      name="bg_color"
                      value={formData.bg_color}
                      onChange={handleChange}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <div className="flex items-center gap-2">
                  <FaLink className="text-gray-400" size={16} />
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="/projects-programs/micro-finance"
                  />
                </div>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content (HTML) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="full_content_html"
                  value={formData.full_content_html}
                  onChange={handleChange}
                  rows="15"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none ${errors.full_content_html ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Full HTML content of the program"
                />
                {errors.full_content_html && <p className="text-red-500 text-xs mt-1">{errors.full_content_html}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  HTML content is rendered as-is. Use proper formatting.
                </p>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>

              {/* Flags */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.is_featured ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                      <FaStar className={formData.is_featured ? 'text-yellow-600' : 'text-gray-400'} size={14} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Featured</span>
                      <p className="text-xs text-gray-500">Highlight as featured program</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded transition-all duration-200"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <FaBriefcase className={formData.is_active ? 'text-green-600' : 'text-gray-400'} size={14} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Active</span>
                      <p className="text-xs text-gray-500">Program will be visible on the website</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded transition-all duration-200"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  href={route('cms.programs')}
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
                  {isEdit ? (isSubmitting ? 'Updating...' : 'Update Program') : (isSubmitting ? 'Creating...' : 'Create Program')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}