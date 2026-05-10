// resources/js/pages/Backend/Users/Index.jsx

import { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaUsers,
  FaTimes,
  FaUndo,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaBan,
  FaCheckDouble,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaEnvelope,
  FaUserTag,
  FaCopy,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaEnvelopeOpen,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function UsersIndex({ users: initialUsers, filters: initialFilters = {}, stats: initialStats = {}, roles }) {
  const { flash } = usePage().props;

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [forceDeletingId, setForceDeletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password copy confirmation
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Pagination state
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(initialUsers?.current_page || 1);

  // Filter states
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || 'all',
    email_verified: initialFilters.email_verified || 'all',
    role: initialFilters.role || '',
  });

  // Form data for modal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_slug: '',
  });

  // Get users array from paginated response
  const userItems = useMemo(() => {
    if (Array.isArray(users)) return users;
    if (users && Array.isArray(users.data)) return users.data;
    return [];
  }, [users]);

  // Pagination info
  const pagination = useMemo(() => {
    if (users && typeof users === 'object' && 'current_page' in users) {
      return {
        currentPage: users.current_page,
        lastPage: users.last_page,
        perPage: users.per_page,
        total: users.total,
        from: users.from,
        to: users.to,
        links: users.links || [],
      };
    }
    return null;
  }, [users]);

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setFormData(prev => ({
      ...prev,
      password: password,
      password_confirmation: password
    }));
    setPasswordCopied(false);
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    if (!formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'No Password',
        text: 'Please generate a password first.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formData.password);
      setPasswordCopied(true);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Password copied to clipboard.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Copy',
        text: 'Please copy the password manually.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  // Apply filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get(route('backend.users.index'), {
        ...filters,
        page: 1,
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onSuccess: (page) => {
          setUsers(page.props.users);
          setCurrentPage(1);
        },
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Keep local users in sync
  useEffect(() => {
    setUsers(initialUsers);
    setCurrentPage(initialUsers?.current_page || 1);
  }, [initialUsers]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page === pagination?.currentPage) return;
    if (page < 1 || page > pagination?.lastPage) return;

    router.get(route('backend.users.index'), {
      ...filters,
      page: page,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setUsers(page.props.users);
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = [...userItems];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(user => !user.deleted_at);
      } else if (filters.status === 'deleted') {
        filtered = filtered.filter(user => user.deleted_at);
      }
    }

    if (filters.email_verified !== 'all') {
      if (filters.email_verified === 'verified') {
        filtered = filtered.filter(user => user.is_verified === true);
      } else if (filters.email_verified === 'unverified') {
        filtered = filtered.filter(user => user.is_verified === false && !user.deleted_at);
      }
    }

    if (filters.role) {
      filtered = filtered.filter(user =>
        user.roles && user.roles.some(role => role.slug === filters.role)
      );
    }

    return filtered;
  }, [userItems, filters]);

  // Stats
  const activeCount = userItems.filter(user => !user.deleted_at).length;
  const deletedCount = userItems.filter(user => user.deleted_at).length;
  const verifiedCount = userItems.filter(user => user.is_verified === true).length;
  const unverifiedCount = userItems.filter(user => user.is_verified === false && !user.deleted_at).length;

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      email_verified: 'all',
      role: '',
    });
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return filters.search !== '' || filters.status !== 'all' || filters.email_verified !== 'all' || filters.role !== '';
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const nonDeletedUsers = filteredUsers.filter(user => !user.deleted_at);
    if (selectedUsers.length === nonDeletedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(nonDeletedUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      Swal.fire('No Selection', 'Please select at least one user.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Delete Users',
      text: `Are you sure you want to delete ${selectedUsers.length} user(s)? This will move them to trash.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsBulkProcessing(true);

        router.post(route('backend.users.bulk-delete'), {
          user_ids: selectedUsers
        }, {
          preserveScroll: true,
          onSuccess: (page) => {
            if (page.props.flash?.error) {
              Swal.fire({
                icon: 'error',
                title: 'Cannot Delete',
                text: page.props.flash.error,
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: `${selectedUsers.length} user(s) have been moved to trash.`,
                timer: 1500,
                showConfirmButton: false
              });
              setSelectedUsers([]);
              router.reload();
            }
            setIsBulkProcessing(false);
          },
          onError: (error) => {
            let errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete users.';
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: errorMessage,
              confirmButtonColor: '#2563eb',
            });
            setIsBulkProcessing(false);
          }
        });
      }
    });
  };

  // Bulk restore
  const handleBulkRestore = () => {
    if (selectedUsers.length === 0) {
      Swal.fire('No Selection', 'Please select at least one user.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Restore Users',
      text: `Are you sure you want to restore ${selectedUsers.length} user(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsBulkProcessing(true);

        router.post(route('backend.users.bulk-restore'), {
          user_ids: selectedUsers
        }, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: `${selectedUsers.length} user(s) have been restored.`,
              timer: 1500,
              showConfirmButton: false
            });
            setSelectedUsers([]);
            setIsBulkProcessing(false);
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.message || 'Failed to restore users.',
            });
            setIsBulkProcessing(false);
          }
        });
      }
    });
  };

  // Modal handlers
  const handleOpenCreate = () => {
    setEditingUser(null);
    const defaultRole = roles.find(r => r.slug === 'job_seeker') || roles[0];
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_slug: defaultRole?.slug || ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordCopied(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    const userRole = user.roles?.[0]?.slug || '';
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role_slug: userRole,
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordCopied(false); // Reset password copied state for edit mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', password_confirmation: '', role_slug: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordCopied(false);
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire('Validation Error', 'Please enter full name.', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire('Validation Error', 'Please enter email address.', 'error');
      return false;
    }
    if (!formData.role_slug) {
      Swal.fire('Validation Error', 'Please select a role.', 'error');
      return false;
    }

    // For new user, password is required
    if (!editingUser && !formData.password) {
      Swal.fire('Validation Error', 'Please enter a password or generate one.', 'error');
      return false;
    }

    // If password is provided (for edit mode) or for new user
    if (formData.password) {
      if (formData.password !== formData.password_confirmation) {
        Swal.fire('Validation Error', 'Password and confirm password do not match.', 'error');
        return false;
      }

      if (formData.password.length < 8) {
        Swal.fire('Validation Error', 'Password must be at least 8 characters.', 'error');
        return false;
      }

      // Check if password was copied (for new users always, for edit users only if password is changed)
      if (!editingUser && !passwordCopied) {
        Swal.fire({
          title: 'Password Not Copied',
          html: 'Please copy the generated password before creating the user.<br/><small>This ensures you have saved the password securely.</small>',
          icon: 'warning',
          confirmButtonColor: '#2563eb',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      name: formData.name,
      email: formData.email,
      role_slug: formData.role_slug,
    };

    // Only include password if it's provided
    if (formData.password) {
      submitData.password = formData.password;
    }

    if (editingUser) {
      router.put(route('backend.users.update', editingUser.id), submitData, {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'User updated successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
          setIsSubmitting(false);
          handleCloseModal();
          router.reload();
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error?.response?.data?.message || error?.message || 'Failed to update user.',
          });
          setIsSubmitting(false);
        },
      });
    } else {
      router.post(route('backend.users.store'), submitData, {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'User created and verified successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
          setIsSubmitting(false);
          handleCloseModal();
          router.reload();
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error?.response?.data?.message || error?.message || 'Failed to create user.',
          });
          setIsSubmitting(false);
        },
      });
    }
  };

  // Single user actions
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete "${name}"? This will move them to trash.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('backend.users.destroy', id), {
          preserveScroll: true,
          onSuccess: (page) => {
            if (page.props.flash?.error) {
              Swal.fire({
                icon: 'error',
                title: 'Cannot Delete',
                text: page.props.flash.error,
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'User has been moved to trash.',
                timer: 1500,
                showConfirmButton: false,
              });
              router.reload();
            }
          },
          onError: (errors) => {
            let errorMessage = errors?.response?.data?.message || errors?.message || 'Failed to delete user.';
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: errorMessage,
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  const handleForceDelete = (id, name) => {
    Swal.fire({
      title: 'Permanently Delete User?',
      html: `Are you sure you want to <strong>permanently delete</strong> "${name}"?<br/><br/>This action <strong>cannot be undone</strong> and will remove this user from the database completely.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, permanently delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setForceDeletingId(id);

        router.delete(route('backend.users.force-delete', id), {
          preserveScroll: true,
          onSuccess: (page) => {
            if (page.props.flash?.error) {
              Swal.fire({
                icon: 'error',
                title: 'Cannot Delete',
                text: page.props.flash.error,
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Permanently Deleted!',
                text: `"${name}" has been permanently deleted from the database.`,
                timer: 1500,
                showConfirmButton: false,
              });
              router.reload();
            }
          },
          onError: (errors) => {
            let errorMessage = errors?.response?.data?.message || errors?.message || 'Failed to permanently delete user.';
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: errorMessage,
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setForceDeletingId(null),
        });
      }
    });
  };

  const handleRestore = (id, name) => {
    Swal.fire({
      title: 'Restore User?',
      text: `Are you sure you want to restore "${name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setRestoringId(id);

        router.patch(route('backend.users.restore', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'User has been restored successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Restore Failed',
              text: errors?.message || 'Failed to restore user.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setRestoringId(null),
        });
      }
    });
  };

  const handleVerify = (id, name) => {
    Swal.fire({
      title: 'Verify User?',
      text: `Are you sure you want to verify "${name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setVerifyingId(id);

        router.post(route('backend.users.verify', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Verified!',
              text: 'User has been verified successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: errors?.message || 'Failed to verify user.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setVerifyingId(null),
        });
      }
    });
  };

  // Get role badge color based on role slug
  const getRoleBadgeColor = (roleSlug) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      employer: 'bg-blue-100 text-blue-800',
      job_seeker: 'bg-green-100 text-green-800',
      'super-admin': 'bg-purple-100 text-purple-800',
      'hr-manager': 'bg-indigo-100 text-indigo-800',
      recruiter: 'bg-cyan-100 text-cyan-800',
    };
    return colors[roleSlug] || 'bg-gray-100 text-gray-800';
  };

  // Get role display name from roles array
  const getRoleDisplayName = (roleSlug) => {
    const role = roles.find(r => r.slug === roleSlug);
    return role?.name || roleSlug || 'User';
  };

  // Pagination component
  const Pagination = () => {
    if (!pagination || pagination.lastPage <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
          <span className="font-medium">{pagination.to || 0}</span> of{' '}
          <span className="font-medium">{pagination.total}</span> results
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition ${pagination.currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            <FaChevronLeft size={12} />
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${page === pagination.currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {page}
            </button>
          ))}

          {endPage < pagination.lastPage && (
            <>
              {endPage < pagination.lastPage - 1 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => handlePageChange(pagination.lastPage)}
                className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                {pagination.lastPage}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition ${pagination.currentPage === pagination.lastPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            Next
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>
    );
  };

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: flash.success,
        timer: 2000,
        showConfirmButton: false,
      });
    }
    if (flash?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: flash.error,
        confirmButtonColor: '#2563eb',
      });
    }
  }, [flash]);

  return (
    <AuthenticatedLayout>
      <Head title="Users" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Users
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage system users and their roles
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active: {activeCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Deleted: {deletedCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Verified: {verifiedCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Unverified: {unverifiedCount}
                </span>
                {hasActiveFilters() && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Filtered
                  </span>
                )}
                {pagination && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Total: {pagination.total}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${showFilters || hasActiveFilters()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <FaFilter size={14} />
                Filters
                {hasActiveFilters() && (
                  <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                  </span>
                )}
                {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>

              <button
                onClick={handleOpenCreate}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Add User
              </button>
            </div>
          </div>

          {/* BULK ACTIONS BAR */}
          {selectedUsers.length > 0 && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 mb-6 animate-fade-in border border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FaCheckDouble className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">
                    {selectedUsers.length} user(s) selected
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleBulkRestore}
                    disabled={isBulkProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaUndo size={14} />
                    Restore All
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={isBulkProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                    Delete All
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Users</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTimes size={12} />
                  Reset all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>

                {/* Email Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                  <select
                    value={filters.email_verified}
                    onChange={(e) => handleFilterChange('email_verified', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.slug}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.filter(user => !user.deleted_at).length && filteredUsers.filter(user => !user.deleted_at).length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={filteredUsers.filter(user => !user.deleted_at).length === 0}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Verification
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
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaUsers className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {hasActiveFilters() ? 'Try adjusting your filters.' : 'Get started by adding a new user.'}
                        </p>
                        {hasActiveFilters() && (
                          <div className="mt-6">
                            <button
                              onClick={resetFilters}
                              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <FaTimes className="mr-2" size={16} />
                              Clear Filters
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((user, index) => {
                    const trashed = user.deleted_at !== null;
                    const userRole = user.roles?.[0]?.slug || '';
                    const isVerified = user.is_verified === true;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 transition-all duration-200 animate-fade-in ${trashed ? 'bg-gray-50 opacity-75' : ''} ${selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-4 py-4">
                          {!trashed && (
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                        </td>

                        {/* USER DETAILS */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${trashed ? 'bg-gray-300' : 'bg-blue-100'}`}>
                              <FaUsers className={trashed ? 'text-gray-500' : 'text-blue-600'} size={18} />
                            </div>
                            <div>
                              <div className={`font-semibold ${trashed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {user.name}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                <span className={`text-xs ${trashed ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {user.email}
                                </span>
                              </div>
                              {!trashed && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  ID: #{user.id}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-4">
                          {!trashed && userRole ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
                              <FaUserTag size={10} />
                              {getRoleDisplayName(userRole)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        {/* VERIFICATION */}
                        <td className="px-6 py-4">
                          {!trashed ? (
                            isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaCheckCircle size={10} />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <FaEnvelopeOpen size={10} />
                                Unverified
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          {!trashed ? (
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-2 w-fit">
                              <FaCheckCircle size={12} />
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-500 flex items-center gap-2 w-fit">
                              <FaTrash size={12} />
                              Deleted
                            </span>
                          )}
                          {trashed && user.deleted_at && (
                            <div className="text-xs text-gray-400 mt-1">
                              Deleted: {new Date(user.deleted_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            {!trashed && (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(user)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                  title="Edit User"
                                >
                                  <FaEdit size={18} />
                                </button>

                                {/* Verify button - only show for unverified users */}
                                {!isVerified && (
                                  <button
                                    onClick={() => handleVerify(user.id, user.name)}
                                    disabled={verifyingId === user.id}
                                    className={`p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 ${verifyingId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Verify User"
                                  >
                                    {verifyingId === user.id ? (
                                      <FaSpinner className="animate-spin" size={18} />
                                    ) : (
                                      <FaEnvelopeOpen size={18} />
                                    )}
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDelete(user.id, user.name)}
                                  disabled={deletingId === user.id}
                                  className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Delete User"
                                >
                                  {deletingId === user.id ? (
                                    <FaSpinner className="animate-spin" size={18} />
                                  ) : (
                                    <FaTrash size={18} />
                                  )}
                                </button>
                              </>
                            )}

                            {trashed && (
                              <>
                                <button
                                  onClick={() => handleRestore(user.id, user.name)}
                                  disabled={restoringId === user.id}
                                  className={`p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 ${restoringId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Restore User"
                                >
                                  {restoringId === user.id ? (
                                    <FaSpinner className="animate-spin" size={18} />
                                  ) : (
                                    <FaUndo size={18} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleForceDelete(user.id, user.name)}
                                  disabled={forceDeletingId === user.id}
                                  className={`p-2 text-red-700 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all duration-200 ${forceDeletingId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Permanently Delete (Cannot be undone)"
                                >
                                  {forceDeletingId === user.id ? (
                                    <FaSpinner className="animate-spin" size={18} />
                                  ) : (
                                    <FaExclamationTriangle size={18} />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <Pagination />
          </div>
        </div>
      </div>

      {/* MODAL - Create/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingUser ? 'Edit User' : 'Add User'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingUser ? 'Update user information' : 'Create a new system user'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                    required
                    autoFocus
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Password Field with Generate Button - Show for both Create and Edit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {!editingUser && <span className="text-red-500">*</span>}
                    {editingUser && <span className="text-gray-400 text-xs"> (Optional - leave empty to keep current)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setPasswordCopied(false);
                      }}
                      className="w-full px-4 py-2.5 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={editingUser ? 'Leave empty to keep current password' : 'Enter password'}
                      minLength={8}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      {/* Show generate button for both create and edit modes */}
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Generate strong password"
                      >
                        <FaSyncAlt size={14} />
                      </button>
                    </div>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-gray-700">{formData.password}</code>
                        <button
                          type="button"
                          onClick={copyPassword}
                          className={`p-1 rounded transition-colors ${passwordCopied ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                          title="Copy password"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                      {passwordCopied && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <FaCheckCircle size={12} />
                          Copied!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field - Only show when password is entered */}
                {formData.password && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm password"
                        required={!!formData.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                    {formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={10} />
                        Passwords do not match
                      </p>
                    )}
                    {formData.password && formData.password === formData.password_confirmation && formData.password_confirmation && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <FaCheckCircle size={10} />
                        Passwords match
                      </p>
                    )}
                  </div>
                )}

                {/* Password Copy Confirmation - Only for new users when password is generated */}
                {!editingUser && formData.password && !passwordCopied && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <input
                      type="checkbox"
                      id="passwordCopied"
                      checked={passwordCopied}
                      onChange={(e) => setPasswordCopied(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="passwordCopied" className="text-sm text-gray-700 cursor-pointer">
                      I have copied the password to a secure location
                    </label>
                  </div>
                )}

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role_slug"
                    value={formData.role_slug}
                    onChange={(e) => setFormData({ ...formData, role_slug: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.slug}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {formData.role_slug && (
                    <p className="text-xs text-gray-400 mt-1">
                      {roles.find(r => r.slug === formData.role_slug)?.description || ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!editingUser && !passwordCopied && !!formData.password)}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 font-medium shadow-md"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  {editingUser ? (isSubmitting ? 'Updating...' : 'Update User') : (isSubmitting ? 'Creating...' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}