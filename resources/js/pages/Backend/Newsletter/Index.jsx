// resources/js/pages/Backend/Newsletter/Index.jsx

import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';
import {
  FaEnvelope,
  FaSearch,
  FaTrash,
  FaDownload,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUserPlus,
  FaUsers,
  FaExclamationTriangle,
  FaFilter,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function NewsletterIndex({ subscribers, stats, filters }) {
  const { flash } = usePage().props;

  // States
  const [setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortField, setSortField] = useState('subscribed_at');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  // Stats cards
  const statCards = [
    {
      key: 'total',
      label: 'Total Subscribers',
      value: stats.total,
      icon: <FaUsers className="text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      key: 'subscribed',
      label: 'Active',
      value: stats.subscribed,
      icon: <FaCheckCircle className="text-green-500" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      key: 'unsubscribed',
      label: 'Unsubscribed',
      value: stats.unsubscribed,
      icon: <FaTimesCircle className="text-red-500" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      key: 'today',
      label: 'New Today',
      value: stats.today,
      icon: <FaUserPlus className="text-purple-500" />,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  ];

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedIds(subscribers.data.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, subscribers.data]);

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: flash.success,
        timer: 3000,
        showConfirmButton: false,
      });
    }
    if (flash?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: flash.error,
        confirmButtonColor: '#3b82f6',
      });
    }
  }, [flash]);

  // Handle individual select
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(
      route('backend.newsletter.index'),
      { search: searchTerm, status: statusFilter },
      { preserveState: true }
    );
  };

  // Handle filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    router.get(
      route('backend.newsletter.index'),
      { search: searchTerm, status },
      { preserveState: true }
    );
  };

  // Handle sort
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    router.get(
      route('backend.newsletter.index'),
      {
        search: searchTerm,
        status: statusFilter,
        sort: field,
        direction: newDirection
      },
      { preserveState: true }
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Subscribers Selected',
        text: 'Please select at least one subscriber to delete.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    Swal.fire({
      title: 'Delete Subscribers?',
      text: `Are you sure you want to delete ${selectedIds.length} subscriber(s)? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        router.post(
          route('backend.newsletter.bulk-delete'),
          { ids: selectedIds },
          {
            preserveScroll: true,
            onSuccess: () => {
              setLoading(false);
              setSelectedIds([]);
              setSelectAll(false);
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: `${selectedIds.length} subscriber(s) deleted successfully.`,
                timer: 2000,
                showConfirmButton: false,
              });
            },
            onError: (errors) => {
              setLoading(false);
              Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: errors.message || 'Something went wrong.',
                confirmButtonColor: '#3b82f6',
              });
            },
          }
        );
      }
    });
  };

  // Handle bulk unsubscribe
  const handleBulkUnsubscribe = () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Subscribers Selected',
        text: 'Please select at least one subscriber to unsubscribe.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    Swal.fire({
      title: 'Unsubscribe Subscribers?',
      text: `Are you sure you want to unsubscribe ${selectedIds.length} subscriber(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, unsubscribe them',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        router.post(
          route('backend.newsletter.bulk-unsubscribe'),
          { ids: selectedIds },
          {
            preserveScroll: true,
            onSuccess: () => {
              setLoading(false);
              setSelectedIds([]);
              setSelectAll(false);
              Swal.fire({
                icon: 'success',
                title: 'Unsubscribed!',
                text: `${selectedIds.length} subscriber(s) unsubscribed successfully.`,
                timer: 2000,
                showConfirmButton: false,
              });
            },
            onError: (errors) => {
              setLoading(false);
              Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: errors.message || 'Something went wrong.',
                confirmButtonColor: '#3b82f6',
              });
            },
          }
        );
      }
    });
  };

  // Handle export
  const handleExport = () => {
    router.post(
      route('backend.newsletter.export'),
      { status: statusFilter },
      {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Export Started',
            text: 'Your CSV file is being downloaded.',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: errors.message || 'Something went wrong.',
            confirmButtonColor: '#3b82f6',
          });
        },
      }
    );
  };

  // Handle send bulk email
  const handleSendBulkEmail = () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Subscribers Selected',
        text: 'Please select at least one subscriber to send email to.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    setShowSendEmailModal(true);
  };


  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in both subject and content.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setSendingEmail(true);
    router.post(
      route('backend.newsletter.send-bulk'),
      {
        ids: selectedIds,
        subject: emailSubject,
        content: emailContent,
      },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          setSendingEmail(false);
          setShowSendEmailModal(false);
          setEmailSubject('');
          setEmailContent('');
          setSelectedIds([]);
          setSelectAll(false);

          // Get message from flash
          const message = page.props.flash?.success || 'Emails sent successfully!';

          Swal.fire({
            icon: 'success',
            title: 'Emails Sent!',
            text: message,
            timer: 3000,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          setSendingEmail(false);
          const errorMessage = errors.message || 'Something went wrong.';
          Swal.fire({
            icon: 'error',
            title: 'Send Failed',
            text: errorMessage,
            confirmButtonColor: '#3b82f6',
          });
        },
      }
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      subscribed: 'bg-green-100 text-green-700',
      unsubscribed: 'bg-red-100 text-red-700',
      bounced: 'bg-yellow-100 text-yellow-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'subscribed') return <FaCheckCircle className="text-green-500" />;
    if (status === 'unsubscribed') return <FaTimesCircle className="text-red-500" />;
    return <FaExclamationTriangle className="text-yellow-500" />;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Newsletter Subscribers" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-sm text-gray-500">
              Manage your newsletter subscribers and send bulk emails.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaDownload size={14} />
              Export CSV
            </button>
            <button
              onClick={handleSendBulkEmail}
              disabled={selectedIds.length === 0}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${selectedIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <FaPaperPlane size={14} />
              Send Email ({selectedIds.length})
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <div
              key={stat.key}
              className={`${stat.bg} border ${stat.border} rounded-xl p-4 flex items-center justify-between`}
            >
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 min-w-56">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="all">All Status</option>
                <option value="subscribed">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={handleBulkUnsubscribe}
                  className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                >
                  Unsubscribe
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Email
                      {sortField === 'email' && (
                        sortDirection === 'desc' ? <FaSortDown /> : <FaSortUp />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'desc' ? <FaSortDown /> : <FaSortUp />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('subscribed_at')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Subscribed
                      {sortField === 'subscribed_at' && (
                        sortDirection === 'desc' ? <FaSortDown /> : <FaSortUp />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscribers.data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  subscribers.data.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(subscriber.id)}
                          onChange={() => toggleSelect(subscriber.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {subscriber.name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(subscriber.status)}`}>
                          {getStatusIcon(subscriber.status)}
                          {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {subscriber.source || 'website'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {subscriber.status === 'subscribed' && (
                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: 'Unsubscribe?',
                                  text: `Unsubscribe ${subscriber.email}?`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#ef4444',
                                  cancelButtonColor: '#6b7280',
                                  confirmButtonText: 'Yes, unsubscribe',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    router.post(
                                      route('backend.newsletter.unsubscribe', subscriber.id),
                                      {},
                                      {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Unsubscribed!',
                                            timer: 1500,
                                            showConfirmButton: false,
                                          });
                                        },
                                      }
                                    );
                                  }
                                });
                              }}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition"
                              title="Unsubscribe"
                            >
                              <FaTimesCircle size={14} />
                            </button>
                          )}
                          {subscriber.status === 'unsubscribed' && (
                            <button
                              onClick={() => {
                                router.post(
                                  route('backend.newsletter.resubscribe', subscriber.id),
                                  {},
                                  {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                      Swal.fire({
                                        icon: 'success',
                                        title: 'Resubscribed!',
                                        timer: 1500,
                                        showConfirmButton: false,
                                      });
                                    },
                                  }
                                );
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                              title="Resubscribe"
                            >
                              <FaCheckCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: 'Delete Subscriber?',
                                text: `Delete ${subscriber.email}? This cannot be undone.`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ef4444',
                                cancelButtonColor: '#6b7280',
                                confirmButtonText: 'Delete',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  router.delete(
                                    route('backend.newsletter.destroy', subscriber.id),
                                    {
                                      preserveScroll: true,
                                      onSuccess: () => {
                                        Swal.fire({
                                          icon: 'success',
                                          title: 'Deleted!',
                                          timer: 1500,
                                          showConfirmButton: false,
                                        });
                                      },
                                    }
                                  );
                                }
                              });
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {subscribers.links && subscribers.links.length > 3 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {subscribers.from || 0} to {subscribers.to || 0} of {subscribers.total || 0} results
              </p>
              <div className="flex items-center gap-1">
                {subscribers.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url && !link.active) {
                        router.get(link.url, {}, { preserveState: true });
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded text-sm ${link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Email Modal */}
      {showSendEmailModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSendEmailModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold">Send Bulk Email</h2>
                <p className="text-sm text-gray-500">
                  Sending to {selectedIds.length} subscriber(s)
                </p>
              </div>
              <button
                onClick={() => setShowSendEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Enter email content..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  HTML is supported. You can use basic HTML tags.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                <strong>Note:</strong> This will send a bulk email to all selected subscribers.
                Please ensure your content is appropriate.
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowSendEmailModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailSubject.trim() || !emailContent.trim()}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 ${sendingEmail || !emailSubject.trim() || !emailContent.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                {sendingEmail ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={14} />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}