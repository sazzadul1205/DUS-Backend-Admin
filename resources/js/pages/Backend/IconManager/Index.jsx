/* eslint-disable no-undef */
// resources/js/pages/Backend/IconManager/Index.jsx

import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import Swal from 'sweetalert2';

// Icons
import {
  FaUpload,
  FaSpinner,
  FaImage,
  FaCheckCircle,
  FaUndo,
  FaInfoCircle,
} from 'react-icons/fa';

export default function IconManagerIndex({ currentIcon, icons }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentIcon?.url || null);
  const fileInputRef = useRef(null);

  // Handle icon upload
  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file.',
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 2MB.',
      });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('icon', file);

    try {
      const response = await fetch(route('backend.icon.update'), {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.data.icon);
        Swal.fire({
          icon: 'success',
          title: 'Icon Updated!',
          text: 'Site icon has been updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        // Reload the page to see changes in the browser tab
        setTimeout(() => window.location.reload(), 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: data.message || 'Failed to update icon.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'An error occurred during upload.',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle reset icon
  const handleReset = async () => {
    const result = await Swal.fire({
      title: 'Reset Icon?',
      text: 'This will remove the custom icon and revert to default.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reset',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(route('backend.icon.reset'), {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setPreview(null);
          Swal.fire({
            icon: 'success',
            title: 'Icon Reset!',
            text: 'Icon has been reset to default.',
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Reset Failed',
            text: data.message || 'Failed to reset icon.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: error.message || 'An error occurred during reset.',
        });
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <AdminLayout>
      <Head title="Site Icon Manager" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Site Icon Manager
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Change the icon that appears in browser tabs, bookmarks, and PWA
              </p>
            </div>
          </div>

          {/* Current Icon Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Icon</h2>

            <div className="flex items-center gap-6">
              <div className="relative">
                {preview ? (
                  <div className="w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden">
                    <img
                      src={preview}
                      alt="Current icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <FaImage className="text-gray-400" size={32} />
                  </div>
                )}

                {preview && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <FaCheckCircle size={12} />
                  </span>
                )}
              </div>

              <div className="flex-1">
                {currentIcon ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">File:</span> {currentIcon.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {currentIcon.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Modified:</span> {currentIcon.last_modified}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">No custom icon set</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Using default icon from your application
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Icon</h2>

            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload className="text-gray-400 mx-auto mb-3" size={32} />
              <p className="text-gray-600">Click to select an icon file</p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PNG, JPG, JPEG, SVG, WebP, ICO
              </p>
              <p className="text-xs text-gray-400">
                Recommended size: 512x512px or 256x256px
              </p>
              <p className="text-xs text-gray-400">
                Max file size: 2MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <FaSpinner className="animate-spin text-blue-600" size={24} />
                <span className="text-gray-600">Uploading icon...</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-md disabled:opacity-50"
              >
                <FaUpload size={16} />
                Upload New Icon
              </button>

              {currentIcon && (
                <button
                  onClick={handleReset}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <FaUndo size={16} />
                  Reset to Default
                </button>
              )}
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <FaInfoCircle className="text-yellow-600 mt-0.5" size={16} />
              <div>
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Note:</span> After uploading a new icon,
                  you may need to clear your browser cache or restart your browser to see the changes.
                </p>
              </div>
            </div>
          </div>

          {/* Available Icons (History) */}
          {icons.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Icons</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {icons.map((icon) => (
                  <div
                    key={icon.name}
                    className={`p-3 border rounded-lg text-center ${currentIcon?.name === icon.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 border rounded-lg overflow-hidden">
                      <img src={icon.url} alt={icon.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-xs text-gray-600 truncate">{icon.name}</p>
                    <p className="text-xs text-gray-400">{icon.size}</p>
                    {currentIcon?.name === icon.name && (
                      <span className="text-xs text-blue-600 font-medium">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}