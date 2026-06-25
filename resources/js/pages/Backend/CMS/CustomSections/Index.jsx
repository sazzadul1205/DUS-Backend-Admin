// resources/js/pages/Backend/CMS/CustomSections/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';
import { useAuth } from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaCog,
  FaCheckCircle,
  FaBan,
  FaToggleOn,
  FaToggleOff,
  FaFilter,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaDatabase,
  FaCode,
} from 'react-icons/fa';

export default function CustomSectionsIndex({ custom_sections }) {
  const { hasAnyPermission } = useAuth();

  // Permission checks
  const canCreate = hasAnyPermission(['custom-sections.create', 'custom-sections.manage']);
  const canEdit = hasAnyPermission(['custom-sections.update', 'custom-sections.manage']);
  const canDelete = hasAnyPermission(['custom-sections.destroy', 'custom-sections.manage']);
  const canViewCMS = hasAnyPermission(['custom-sections.view', 'custom-sections.manage']);

  // States
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPage, setFilterPage] = useState('');

  // If user doesn't have permission, show access denied
  if (!canViewCMS) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to view custom sections.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Handle toggle status
  const handleToggle = (section) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update custom sections.', 'error');
      return;
    }

    setTogglingId(section.id);

    router.put(route('cms.custom-sections.update', section.id), {
      ...section,
      is_active: !section.is_active,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Section ${section.is_active ? 'deactivated' : 'activated'} successfully.`,
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
      onFinish: () => setTogglingId(null),
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete custom sections.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete Custom Section?',
      text: 'This will permanently delete this custom section data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('cms.custom-sections.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Custom section deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete custom section.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  // Get unique pages for filter
  const uniquePages = [...new Set(custom_sections.map(s => s.page_slug))];

  // Filter sections by page
  const filteredSections = filterPage
    ? custom_sections.filter(s => s.page_slug === filterPage)
    : custom_sections;

  // Get JSON preview
  const getDataPreview = (data) => {
    if (!data) return 'No data';
    const jsonStr = JSON.stringify(data);
    return jsonStr.length > 100 ? jsonStr.substring(0, 100) + '...' : jsonStr;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Custom Sections" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Custom Sections
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage custom section data for pages
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active: {filteredSections.filter(s => s.is_active).length}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Inactive: {filteredSections.filter(s => !s.is_active).length}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Total: {custom_sections.length}
                </span>
                {filterPage && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Filtered: {filterPage}
                  </span>
                )}
              </div>
            </div>
            {canCreate && (
              <Link
                href={route('cms.custom-sections.create')}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Add Section
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${showFilters || filterPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <FaFilter size={14} />
              Filters
              {filterPage && (
                <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  1
                </span>
              )}
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filter Custom Sections</h3>
                  <button
                    onClick={() => {
                      setFilterPage('');
                      setShowFilters(false);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTimes size={12} />
                    Reset all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                    <select
                      value={filterPage}
                      onChange={(e) => setFilterPage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Pages</option>
                      {uniquePages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Data Preview
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSections.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaCog className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No custom sections found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a custom section.</p>
                        {canCreate && (
                          <Link
                            href={route('cms.custom-sections.create')}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FaPlus size={14} />
                            Add Section
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}

                  {filteredSections.map((section) => (
                    <tr key={section.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${section.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FaCode className={section.is_active ? 'text-green-600' : 'text-gray-400'} size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{section.section_key}</div>
                            <div className="text-xs text-gray-500 mt-0.5">ID: #{section.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{section.page_slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded max-w-xs truncate">
                          {getDataPreview(section.data)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(section)}
                          disabled={togglingId === section.id || !canEdit}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${section.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } ${(togglingId === section.id || !canEdit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {togglingId === section.id ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : section.is_active ? (
                            <FaToggleOn size={14} />
                          ) : (
                            <FaToggleOff size={14} />
                          )}
                          {section.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <Link
                              href={route('cms.custom-sections.edit', section.id)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(section.id)}
                              disabled={deletingId === section.id}
                              className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === section.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete"
                            >
                              {deletingId === section.id ? (
                                <FaSpinner className="animate-spin" size={18} />
                              ) : (
                                <FaTrash size={18} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </AuthenticatedLayout>
  );
}