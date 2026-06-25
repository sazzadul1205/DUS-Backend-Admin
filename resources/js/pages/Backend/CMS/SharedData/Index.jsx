// resources/js/pages/Backend/CMS/SharedData/Index.jsx

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
  FaSpinner,
  FaDatabase,
  FaCheckCircle,
  FaBan,
  FaToggleOn,
  FaToggleOff,
  FaShieldAlt,
  FaCode,
  FaInfoCircle,
} from 'react-icons/fa';

// Type labels and colors
const TYPE_CONFIG = {
  topbar: {
    label: 'Topbar',
    color: 'bg-blue-100 text-blue-800',
    icon: '📱',
  },
  navbar: {
    label: 'Navbar',
    color: 'bg-purple-100 text-purple-800',
    icon: '🧭',
  },
  footer: {
    label: 'Footer',
    color: 'bg-green-100 text-green-800',
    icon: '📋',
  },
  faq: {
    label: 'FAQ',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '❓',
  },
  'upcoming-events': {
    label: 'Upcoming Events',
    color: 'bg-orange-100 text-orange-800',
    icon: '📅',
  },
};

export default function SharedDataIndex({ shared_data }) {
  const { hasAnyPermission } = useAuth();

  // Permission checks
  const canCreate = hasAnyPermission(['shared-data.create', 'shared-data.manage']);
  const canEdit = hasAnyPermission(['shared-data.update', 'shared-data.manage']);
  const canDelete = hasAnyPermission(['shared-data.destroy', 'shared-data.manage']);
  const canViewCMS = hasAnyPermission(['shared-data.view', 'shared-data.manage']);

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
            <p className="text-gray-500 mt-2">You don't have permission to view shared data.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Handle toggle status
  const handleToggle = (item) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update shared data.', 'error');
      return;
    }

    setTogglingId(item.id);

    router.put(route('cms.shared-data.update', item.id), {
      ...item,
      is_active: !item.is_active,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Shared data ${item.is_active ? 'deactivated' : 'activated'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || 'Failed to update shared data status.',
        });
      },
      onFinish: () => setTogglingId(null),
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete shared data.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete Shared Data?',
      text: 'This will permanently delete this shared data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('cms.shared-data.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Shared data deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete shared data.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  // Get type config
  const getTypeConfig = (type) => {
    return TYPE_CONFIG[type] || {
      label: type,
      color: 'bg-gray-100 text-gray-800',
      icon: '📦',
    };
  };

  // Get data preview
  const getDataPreview = (data) => {
    if (!data) return 'No data';
    const jsonStr = JSON.stringify(data);
    return jsonStr.length > 80 ? jsonStr.substring(0, 80) + '...' : jsonStr;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Shared Data" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Shared Data
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage shared data used across the website (topbar, navbar, footer, etc.)
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active: {shared_data.filter(s => s.is_active).length}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Inactive: {shared_data.filter(s => !s.is_active).length}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Total: {shared_data.length}
                </span>
              </div>
            </div>
            {canCreate && (
              <Link
                href={route('cms.shared-data.create')}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Add Shared Data
              </Link>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Shared Data</p>
                <p className="text-xs">
                  Shared data is used across multiple pages. Types include topbar, navbar, footer, FAQ, and upcoming events.
                  Each type should have only one active record.
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
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
                  {shared_data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaDatabase className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No shared data found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating shared data.</p>
                        {canCreate && (
                          <Link
                            href={route('cms.shared-data.create')}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FaPlus size={14} />
                            Add Shared Data
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}

                  {shared_data.map((item) => {
                    const typeConfig = getTypeConfig(item.type);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                              <FaDatabase className={item.is_active ? 'text-green-600' : 'text-gray-400'} size={18} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 flex items-center gap-2">
                                <span>{typeConfig.icon}</span>
                                <span>{typeConfig.label}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">Type: {item.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded max-w-xs truncate">
                            {getDataPreview(item.data)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggle(item)}
                            disabled={togglingId === item.id || !canEdit}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${item.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              } ${(togglingId === item.id || !canEdit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {togglingId === item.id ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : item.is_active ? (
                              <FaToggleOn size={14} />
                            ) : (
                              <FaToggleOff size={14} />
                            )}
                            {item.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <Link
                                href={route('cms.shared-data.edit', item.id)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit"
                              >
                                <FaEdit size={18} />
                              </Link>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                              >
                                {deletingId === item.id ? (
                                  <FaSpinner className="animate-spin" size={18} />
                                ) : (
                                  <FaTrash size={18} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}