// resources/js/pages/Backend/CMS/Blogs/Form.jsx

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
  FaNewspaper,
  FaStar,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaShieldAlt,
} from 'react-icons/fa';

export default function BlogForm({ blog = null }) {
  const { hasAnyPermission } = useAuth();
  const isEdit = !!blog;

  // Permission checks
  const canCreate = hasAnyPermission(['blogs.create', 'blogs.manage']);
  const canEdit = hasAnyPermission(['blogs.update', 'blogs.manage']);

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
              You don't have permission to {isEdit ? 'edit' : 'create'} blogs.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    slug: blog?.slug || '',
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    full_content: blog?.full_content || '',
    image: blog?.image || '',
    date: blog?.date || '',
    author: blog?.author || '',
    read_time: blog?.read_time || '',
    tags: blog?.tags || [],
    is_featured: blog?.is_featured ?? false,
    is_active: blog?.is_active ?? true,
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

  // Handle array input change (tags)
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.full_content.trim()) newErrors.full_content = 'Content is required';

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
      ? route('cms.blogs.update', blog.id)
      : route('cms.blogs.store');

    const method = isEdit ? 'put' : 'post';

    router[method](url, formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Blog ${isEdit ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.visit(route('cms.blogs'));
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${isEdit ? 'update' : 'create'} blog.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={isEdit ? 'Edit Blog' : 'Create Blog'} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('cms.blogs')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                  <span className="text-sm">Back to Blogs</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Blog' : 'Create Blog'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update blog post' : 'Write a new blog post'}
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
                    placeholder="how-technology-is-changing-education"
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
                    placeholder="How Technology is Changing Education"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
              </div>

              {/* Author and Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" size={16} />
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" size={16} />
                    <input
                      type="text"
                      name="read_time"
                      value={formData.read_time}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="5 min read"
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Date
                </label>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" size={16} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Image */}
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
                  placeholder="/storage/blogs/image.jpg"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="A brief summary of the blog post"
                />
                {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  A short description shown in blog listings.
                </p>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content (HTML) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="full_content"
                  value={formData.full_content}
                  onChange={handleChange}
                  rows="15"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none ${errors.full_content ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Full HTML content of the blog post"
                />
                {errors.full_content && <p className="text-red-500 text-xs mt-1">{errors.full_content}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  HTML content is rendered as-is. Use proper formatting.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Technology, Education, Innovation"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Comma-separated tags for categorization.
                </p>
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
                      <p className="text-xs text-gray-500">Highlight as featured blog post</p>
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
                      <FaNewspaper className={formData.is_active ? 'text-green-600' : 'text-gray-400'} size={14} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Active</span>
                      <p className="text-xs text-gray-500">Blog will be visible on the website</p>
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
                  href={route('cms.blogs')}
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
                  {isEdit ? (isSubmitting ? 'Updating...' : 'Update Blog') : (isSubmitting ? 'Creating...' : 'Create Blog')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}