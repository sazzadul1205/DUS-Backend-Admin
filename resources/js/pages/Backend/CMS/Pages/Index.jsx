// resources/js/pages/Backend/CMS/Pages/Index.jsx

import React, { useState, useMemo } from 'react';
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
  FaFileAlt,
  FaCheckCircle,
  FaBan,
  FaToggleOn,
  FaToggleOff,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
} from 'react-icons/fa';

export default function PagesIndex({ pages }) {
  const { hasAnyPermission, hasRole } = useAuth();

  // Permission checks
  const canCreate = hasAnyPermission(['pages.create', 'pages.manage']);
  const canEdit = hasAnyPermission(['pages.update', 'pages.manage']);
  const canDelete = hasAnyPermission(['pages.destroy', 'pages.manage']);
  const canViewCMS = hasAnyPermission(['pages.view', 'pages.manage']);

  // States
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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
            <p className="text-gray-500 mt-2">You don't have permission to view pages.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Handle toggle status
  const handleToggle = (page) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update pages.', 'error');
      return;
    }

    setTogglingId(page.id);

    router.put(route('cms.pages.update', page.id), {
      ...page,
      is_active: !page.is_active,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Page ${page.is_active ? 'deactivated' : 'activated'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || 'Failed to update page status.',
        });
      },
      onFinish: () => setTogglingId(null),
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete pages.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete Page?',
      text: 'This will move the page to trash. You can restore it later.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('cms.pages.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Page moved to trash.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete page.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Pages" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Pages
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your website pages
              </p>
            </div>
            {canCreate && (
              <Link
                href={route('cms.pages.create')}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Create Page
              </Link>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sections
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
                  {pages.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaFileAlt className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No pages found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first page.</p>
                        {canCreate && (
                          <Link
                            href={route('cms.pages.create')}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FaPlus size={14} />
                            Create Page
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}

                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${page.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FaFileAlt className={page.is_active ? 'text-green-600' : 'text-gray-400'} size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{page.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">ID: #{page.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{page.slug}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{page.section_configs_count || 0} sections</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(page)}
                          disabled={togglingId === page.id || !canEdit}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${page.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } ${(togglingId === page.id || !canEdit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {togglingId === page.id ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : page.is_active ? (
                            <FaToggleOn size={14} />
                          ) : (
                            <FaToggleOff size={14} />
                          )}
                          {page.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={route('cms.pages.sections', page.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            title="Manage Sections"
                          >
                            <FaEye size={18} />
                          </Link>
                          {canEdit && (
                            <Link
                              href={route('cms.pages.edit', page.id)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(page.id)}
                              disabled={deletingId === page.id}
                              className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === page.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete"
                            >
                              {deletingId === page.id ? (
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
    </AuthenticatedLayout>
  );
}