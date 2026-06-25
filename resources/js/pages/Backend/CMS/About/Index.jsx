// resources/js/pages/Backend/CMS/About/Index.jsx

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
  FaUsers,
  FaCheckCircle,
  FaBan,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';

export default function AboutIndex({ about_contents }) {
  const { hasAnyPermission } = useAuth();

  // Permission checks
  const canCreate = hasAnyPermission(['about.create', 'about.manage']);
  const canEdit = hasAnyPermission(['about.update', 'about.manage']);
  const canDelete = hasAnyPermission(['about.destroy', 'about.manage']);

  // States
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // If user doesn't have permission
  if (!canCreate && !canEdit && !canDelete) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to manage about content.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Handle toggle status
  const handleToggle = (content) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update about content.', 'error');
      return;
    }

    setTogglingId(content.id);

    router.put(route('cms.about.update', content.id), {
      ...content,
      is_active: !content.is_active,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Content ${content.is_active ? 'deactivated' : 'activated'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || 'Failed to update content status.',
        });
      },
      onFinish: () => setTogglingId(null),
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete about content.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete Content?',
      text: 'This will permanently delete this about content.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('cms.about.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'About content deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete about content.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const types = {
      main: 'bg-blue-100 text-blue-800',
      detail: 'bg-purple-100 text-purple-800',
    };
    return types[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AuthenticatedLayout>
      <Head title="About Content" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                About Content
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage about page content and sections
              </p>
            </div>
            {canCreate && (
              <Link
                href={route('cms.about.create')}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Add Content
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
                      Content
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Featured
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
                  {about_contents.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaInfoCircle className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No about content found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating about content.</p>
                        {canCreate && (
                          <Link
                            href={route('cms.about.create')}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FaPlus size={14} />
                            Add Content
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}

                  {about_contents.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${content.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FaUsers className={content.is_active ? 'text-green-600' : 'text-gray-400'} size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{content.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">Slug: {content.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(content.type)}`}>
                          {content.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{content.display_order}</span>
                      </td>
                      <td className="px-6 py-4">
                        {content.is_featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            <FaStar size={10} />
                            Featured
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(content)}
                          disabled={togglingId === content.id || !canEdit}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${content.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } ${(togglingId === content.id || !canEdit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {togglingId === content.id ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : content.is_active ? (
                            <FaToggleOn size={14} />
                          ) : (
                            <FaToggleOff size={14} />
                          )}
                          {content.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <Link
                              href={route('cms.about.edit', content.id)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(content.id)}
                              disabled={deletingId === content.id}
                              className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === content.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete"
                            >
                              {deletingId === content.id ? (
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