// resources/js/pages/Backend/CMS/Pages/Sections.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';
import { useAuth } from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';

// Icons
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaLayerGroup,
  FaToggleOn,
  FaToggleOff,
  FaShieldAlt,
} from 'react-icons/fa';

// Available components for sections
const AVAILABLE_COMPONENTS = {
  'PageBannerSection': 'Page Banner',
  'HeroFigureSection': 'Hero with Figure',
  'CardsSection': 'Cards Section',
  'FAQSection': 'FAQ Section',
  'StoriesSection': 'Stories Section',
  'BlogSection': 'Blog Section',
  'OurProgramsSection': 'Our Programs',
  'ContactOfficeSection': 'Contact Office',
  'AddressSection': 'Address Section',
  'ContentSection': 'Content Section',
};

export default function Sections({ page, sections }) {
  const { hasAnyPermission } = useAuth();

  // Permission checks
  const canEdit = hasAnyPermission(['sections.update', 'sections.manage']);
  const canCreate = hasAnyPermission(['sections.create', 'sections.manage']);
  const canDelete = hasAnyPermission(['sections.destroy', 'sections.manage']);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    section_key: '',
    component: '',
    data_table: '',
    data_key: '',
    prop_name: '',
    display_order: 0,
    is_enabled: true,
    is_fixed_section: false,
    is_special_component: false,
    custom_props: {},
  });

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingSection(null);
    setFormData({
      section_key: '',
      component: '',
      data_table: '',
      data_key: '',
      prop_name: '',
      display_order: sections.length,
      is_enabled: true,
      is_fixed_section: false,
      is_special_component: false,
      custom_props: {},
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_key: section.section_key,
      component: section.component,
      data_table: section.data_table || '',
      data_key: section.data_key || '',
      prop_name: section.prop_name || '',
      display_order: section.display_order,
      is_enabled: section.is_enabled,
      is_fixed_section: section.is_fixed_section,
      is_special_component: section.is_special_component,
      custom_props: section.custom_props || {},
    });
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editingSection
      ? route('cms.sections.update', { pageId: page.id, sectionId: editingSection.id })
      : route('cms.sections.store', page.id);

    const method = editingSection ? 'put' : 'post';

    router[method](url, formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Section ${editingSection ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
        router.reload();
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${editingSection ? 'update' : 'create'} section.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  // Handle delete
  const handleDelete = (sectionId) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete sections.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete Section?',
      text: 'This will permanently delete this section configuration.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(sectionId);

        router.delete(route('cms.sections.destroy', { pageId: page.id, sectionId }), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Section deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete section.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  // Handle toggle
  const handleToggle = (section) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update sections.', 'error');
      return;
    }

    router.put(
      route('cms.sections.update', { pageId: page.id, sectionId: section.id }),
      { ...section, is_enabled: !section.is_enabled },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload();
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `Section ${section.is_enabled ? 'disabled' : 'enabled'} successfully.`,
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error?.message || 'Failed to update section status.',
          });
        },
      }
    );
  };

  // If user doesn't have permission
  if (!canEdit && !canCreate && !canDelete) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to manage sections.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Sections - ${page.name}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
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
                Sections - {page.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage page sections and their configurations
              </p>
            </div>
            {canCreate && (
              <button
                onClick={handleOpenCreate}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Add Section
              </button>
            )}
          </div>

          {/* Sections List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {sections.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLayerGroup className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No sections found</h3>
                <p className="text-sm text-gray-500 mt-1">Add a section to start building your page.</p>
                {canCreate && (
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaPlus size={14} />
                    Add Section
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sections.map((section) => (
                  <div key={section.id} className="p-5 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.is_enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <FaLayerGroup className={section.is_enabled ? 'text-green-600' : 'text-gray-400'} size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{section.section_key}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                              {AVAILABLE_COMPONENTS[section.component] || section.component}
                            </span>
                            {section.is_fixed_section && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Fixed</span>
                            )}
                            {section.is_special_component && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Special</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Order: {section.display_order} • Data Table: {section.data_table || 'None'} • Prop: {section.prop_name || 'Default'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(section)}
                          disabled={!canEdit}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${section.is_enabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {section.is_enabled ? <FaToggleOn size={14} /> : <FaToggleOff size={14} />}
                          {section.is_enabled ? 'Enabled' : 'Disabled'}
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(section)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(section.id)}
                            disabled={deletingId === section.id}
                            className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === section.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Delete"
                          >
                            {deletingId === section.id ? (
                              <FaSpinner className="animate-spin" size={16} />
                            ) : (
                              <FaTrash size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Create/Edit Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSection ? 'Edit Section' : 'Add Section'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingSection ? 'Update section configuration' : 'Configure a new section for this page'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., banner, about-us, our-programs"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Unique identifier for this section. Use lowercase letters and hyphens.
                </p>
              </div>

              {/* Component */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component <span className="text-red-500">*</span>
                </label>
                <select
                  name="component"
                  value={formData.component}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a component</option>
                  {Object.entries(AVAILABLE_COMPONENTS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Data Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Table
                </label>
                <input
                  type="text"
                  name="data_table"
                  value={formData.data_table}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., custom_section_data, about_content, programs"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The database table that provides data for this section.
                </p>
              </div>

              {/* Data Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Key
                </label>
                <input
                  type="text"
                  name="data_key"
                  value={formData.data_key}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Optional data key"
                />
              </div>

              {/* Prop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prop Name
                </label>
                <input
                  type="text"
                  name="prop_name"
                  value={formData.prop_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Default: data"
                />
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
                  <div>
                    <span className="text-sm font-medium text-gray-900">Enabled</span>
                    <p className="text-xs text-gray-500">Section will be displayed on the page</p>
                  </div>
                  <input
                    type="checkbox"
                    name="is_enabled"
                    checked={formData.is_enabled}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded transition-all duration-200"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Fixed Section</span>
                    <p className="text-xs text-gray-500">Section cannot be moved or deleted</p>
                  </div>
                  <input
                    type="checkbox"
                    name="is_fixed_section"
                    checked={formData.is_fixed_section}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded transition-all duration-200"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Special Component</span>
                    <p className="text-xs text-gray-500">Component requires special handling</p>
                  </div>
                  <input
                    type="checkbox"
                    name="is_special_component"
                    checked={formData.is_special_component}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded transition-all duration-200"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 font-medium shadow-md"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  {editingSection ? (isSubmitting ? 'Updating...' : 'Update Section') : (isSubmitting ? 'Creating...' : 'Create Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </AuthenticatedLayout>
  );
}