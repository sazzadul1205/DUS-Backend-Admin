// resources/js/Pages/Backend/Profile/Admin/Edit.jsx

// React
import React, { useState } from 'react';

// Inertia
import { Head, useForm, router } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Sweetalert
import Swal from 'sweetalert2';

// Auth
import { useAuth } from '@/hooks/useAuth';
import { Can } from '../../../../components/Auth/Can';

// Icons
import {
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserShield,
  FaKey,
  FaTrash,
  FaShieldAlt,
} from 'react-icons/fa';

export default function Edit({ user: adminUser }) {
  // Use centralized auth hook
  const {
    user: currentUser,
    hasAnyPermission,
    hasRole,
    isAuthenticated,
  } = useAuth();

  // Check permissions for admin management - FIXED to match backend
  const isSuperAdmin = hasRole('super-admin');
  const canViewAdmins = hasAnyPermission([
    'admin.view',
    'admin.manage',
    'admin_profile.view',
    'admin_profile.edit'
  ]);
  const canEditAdmins = hasAnyPermission([
    'admin.update',
    'admin.manage',
    'admin_profile.edit',
    'admin_profile.update'
  ]);
  const canDeleteAdmins = hasAnyPermission([
    'admin.destroy',
    'admin.manage'
  ]);

  // Check if editing self
  const isEditingSelf = currentUser?.id === adminUser?.id;

  // Check if target is super admin (only super admins can edit other super admins)
  const isTargetSuperAdmin = adminUser?.roles?.some(role => role.slug === 'super-admin') || false;

  // FIXED: Can edit target admin
  const canEditTargetAdmin = canEditAdmins && (
    isEditingSelf ||
    isSuperAdmin ||
    (!isTargetSuperAdmin && !isEditingSelf)
  );

  // If user doesn't have permission to edit admins, show access denied
  if (!canEditAdmins) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to edit admin accounts.</p>
            {canViewAdmins && (
              <button
                onClick={() => router.visit(route('backend.admin-profile.index'))}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Admin List
              </button>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // If user cannot edit this specific admin (higher level protection)
  if (!canEditTargetAdmin) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Cannot Edit This Admin</h2>
            <p className="text-gray-500 mt-2">
              {isTargetSuperAdmin && !isSuperAdmin
                ? "Super admin accounts can only be edited by other super admins."
                : "You don't have permission to edit this admin account."}
            </p>
            <button
              onClick={() => router.visit(route('backend.admin-profile.index'))}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Admin List
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Profile form
  const { data: profileData, setData: setProfileData, patch, processing: profileProcessing, errors: profileErrors } = useForm({
    name: adminUser?.name || '',
    email: adminUser?.email || '',
  });

  // Password form
  const { data: passwordData, setData: setPasswordData, put, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // show Password form
  const [showPassword, setShowPassword] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('profile');

  // Handle form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // Additional security check
    if (!canEditAdmins || !canEditTargetAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to edit this admin account.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    patch(route('backend.admin-profile.update', adminUser.id), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: Object.values(errors).flat().join('\n'),
        });
      }
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Additional security check
    if (!canEditAdmins || !canEditTargetAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to change this admin\'s password.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    put(route('backend.admin-profile.password.update', adminUser.id), {
      onSuccess: () => {
        resetPassword();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password updated successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: Object.values(errors).flat().join('\n'),
        });
      }
    });
  };

  // Handle cancel
  const handleCancel = () => {
    router.visit(route('backend.admin-profile.show', adminUser.id));
  };

  // Handle delete
  const handleDelete = () => {
    if (!canDeleteAdmins) {
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to delete admin accounts.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (isEditingSelf) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete Yourself',
        text: 'You cannot delete your own admin account.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (isTargetSuperAdmin && !isSuperAdmin) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete Super Admin',
        text: 'Only super admins can delete other super admin accounts.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    Swal.fire({
      title: 'Delete Admin?',
      text: `Are you sure you want to delete "${adminUser.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('backend.admin-profile.destroy', adminUser.id), {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Admin account has been deleted.',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.admin-profile.index'));
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error?.message || 'Failed to delete admin account.',
            });
          }
        });
      }
    });
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Calculate password strength
  const passwordStrength = getPasswordStrength(passwordData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Admin: ${adminUser?.name}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors group"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Profile</span>
            </button>

            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Admin Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update account information for {adminUser?.name}
              </p>
            </div>
          </div>

          {/* Warning for editing other admin */}
          {!isEditingSelf && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="text-amber-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-amber-800">Editing Another Admin</p>
                  <p className="text-xs text-amber-700 mt-1">
                    You are currently editing {adminUser?.name}'s account. Changes will affect their access and permissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-1 px-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaUser size={16} />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaLock size={16} />
                  Change Password
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h2>
                    <p className="text-sm text-gray-500">Update account details for {isEditingSelf ? 'your account' : 'this admin'}</p>
                  </div>

                  <div className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData('name', e.target.value)}
                          required
                          autoComplete="name"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${profileErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Full name"
                        />
                      </div>
                      {profileErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData('email', e.target.value)}
                          required
                          autoComplete="email"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${profileErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="admin@example.com"
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>
                      )}
                    </div>

                    {/* Role Display */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={adminUser?.roles?.map(r => r.name).join(', ') || 'Admin'}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Role can only be changed by super admins from the roles management section
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <FaCheckCircle className="text-blue-500 mt-0.5" size={18} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Profile Information Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use real names for official communications</li>
                        <li>Keep email addresses up to date for important notifications</li>
                        <li>Changes will take effect immediately</li>
                      </ul>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <FaTimes size={14} />
                      Cancel
                    </button>

                    {/* Delete Button - Only show for non-self edits with permission */}
                    {!isEditingSelf && canDeleteAdmins && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                      >
                        <FaTrash size={14} />
                        Delete Admin
                      </button>
                    )}

                    <Can permission="admin.update" fallback={null}>
                      <button
                        type="submit"
                        disabled={profileProcessing}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {profileProcessing ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                        {profileProcessing ? 'Saving...' : 'Save Changes'}
                      </button>
                    </Can>
                  </div>
                </div>
              </form>
            )}

            {/* Change Password Tab - Only show for self or super admin editing others */}
            {(isEditingSelf || isSuperAdmin) && activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
                    <p className="text-sm text-gray-500">
                      {isEditingSelf
                        ? "Update your account password"
                        : `Update password for ${adminUser?.name}`}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Current Password - Only show when editing self */}
                    {isEditingSelf && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                            required={isEditingSelf}
                            autoComplete="current-password"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder="Enter current password"
                          />
                        </div>
                        {passwordErrors.current_password && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
                        )}
                      </div>
                    )}

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.password}
                          onChange={(e) => setPasswordData('password', e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter new password (min 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaLock size={16} /> : <FaKey size={16} />}
                        </button>
                      </div>
                      {passwordErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>
                      )}

                      {/* Password Strength Indicator */}
                      {passwordData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 h-1.5 mb-2">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <div
                                key={index}
                                className={`flex-1 rounded-full transition-all ${index < passwordStrength
                                  ? strengthColors[passwordStrength - 1]
                                  : 'bg-gray-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            Password Strength: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.password_confirmation}
                          onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {passwordErrors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation}</p>
                      )}

                      {/* Password Match Indicator */}
                      {passwordData.password && passwordData.password_confirmation && (
                        <div className="mt-1">
                          {passwordData.password === passwordData.password_confirmation ? (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <FaCheckCircle size={10} />
                              Passwords match
                            </p>
                          ) : (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <FaExclamationCircle size={10} />
                              Passwords do not match
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</p>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li className="flex items-center gap-2">
                          {passwordData.password.length >= 8 ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          Minimum 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          {/[A-Z]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          {/[a-z]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one lowercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          {/[0-9]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one number
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <FaTimes size={14} />
                      Cancel
                    </button>

                    <Can permission="admin.update" fallback={null}>
                      <button
                        type="submit"
                        disabled={passwordProcessing}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {passwordProcessing ? <FaSpinner className="animate-spin" size={14} /> : <FaLock size={14} />}
                        {passwordProcessing ? 'Updating...' : 'Update Password'}
                      </button>
                    </Can>
                  </div>
                </div>
              </form>
            )}

            {/* Message when password tab is not available */}
            {!isEditingSelf && !isSuperAdmin && activeTab === 'password' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaLock className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Password Change Restricted</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Only super admins can change passwords for other admin accounts.
                </p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Profile Information
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}