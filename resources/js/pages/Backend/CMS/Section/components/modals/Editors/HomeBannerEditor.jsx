// resources/js/pages/Backend/CMS/Section/components/modals/Editors/HomeBannerEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

/**
 * HomeBannerEditor - Editor for HomeBanner section data
 * Features:
 * - Drag & drop image upload (shows path preview)
 * - Tracks old image for deletion
 * - Overlay settings with preview
 * - Content editing with fixed class names
 * - Button management (max 2)
 * - Calls onDataChange when data is modified
 */
const HomeBannerEditor = ({ section, hasData, onDataChange }) => {
  // Parse the section data
  const initialData = section?.data?.data || section?.data || {};

  // Local state for form inputs
  const [formData, setFormData] = useState(initialData);

  // Track if image has been changed (for deletion)
  const [imageChanged, setImageChanged] = useState(false);
  const [oldImagePath, setOldImagePath] = useState(initialData?.background?.src || '');

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Notify parent when formData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Overlay options with preview
  const overlayOptions = [
    {
      value: 'bg-black/40 lg:bg-black/50',
      label: 'Light Dark Overlay',
    },
    {
      value: 'bg-black/60 lg:bg-black/70',
      label: 'Medium Dark Overlay',
    },
    {
      value: 'bg-black/80 lg:bg-black/90',
      label: 'Heavy Dark Overlay',
    },
    {
      value: 'bg-gradient-to-r from-black/85 via-black/10 to-transparent',
      label: 'Gradient Left to Right',
    },
    {
      value: 'bg-gradient-to-l from-black/85 via-black/10 to-transparent',
      label: 'Gradient Right to Left',
    },
    {
      value: 'bg-gradient-to-t from-black/85 via-black/10 to-transparent',
      label: 'Gradient Bottom to Top',
    },
    {
      value: 'bg-gradient-to-b from-black/85 via-black/10 to-transparent',
      label: 'Gradient Top to Bottom',
    },
  ];

  const gradientOptions = [
    { value: 'bg-gradient-to-r from-black/85 via-black/10 to-transparent', label: 'Left to Right' },
    { value: 'bg-gradient-to-l from-black/85 via-black/10 to-transparent', label: 'Right to Left' },
    { value: 'bg-gradient-to-t from-black/85 via-black/10 to-transparent', label: 'Bottom to Top' },
    { value: 'bg-gradient-to-b from-black/85 via-black/10 to-transparent', label: 'Top to Bottom' },
    { value: '', label: 'None' },
  ];

  // Helper to update nested fields
  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  // Helper to update array items
  const updateArrayItem = (path, index, field, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        if (!current[keys[i]]) current[keys[i]] = [];
        if (!current[keys[i]][index]) current[keys[i]][index] = {};
        current[keys[i]][index] = { ...current[keys[i]][index], [field]: value };
      } else {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
    }
    setFormData(newData);
  };

  // Add new button to array (max 2)
  const addArrayItem = (path, template = {}) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) current[lastKey] = [];

    // Max 2 buttons
    if (current[lastKey].length >= 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximum 2 Buttons',
        text: 'You can only have up to 2 buttons in this section.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const newId = Math.max(0, ...current[lastKey].map(item => item.id || 0)) + 1;
    current[lastKey].push({ ...template, id: newId });
    setFormData(newData);
  };

  // Remove array item
  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey].splice(index, 1);
    }
    setFormData(newData);
  };

  // ============================================================
  // IMAGE DRAG & DROP FUNCTIONS
  // ============================================================

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processImageFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;

      // Store the old image path before changing
      if (!imageChanged && formData.background?.src) {
        setOldImagePath(formData.background.src);
      }

      // Update the image field with base64 (Laravel will handle upload)
      updateField('background.src', imageUrl);
      setImageChanged(true);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    // Store the old image path before removal
    if (!imageChanged && formData.background?.src) {
      setOldImagePath(formData.background.src);
    }

    // Mark as changed so the old image will be deleted
    updateField('background.src', '');
    setImageChanged(true);
  };

  // Helper to get display path
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded to /storage/Banner/)';
    }
    return src;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Data</h3>

      {/* Background Section with Drag & Drop */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Background Image</h4>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {formData.background?.src ? (
            <div className="flex items-center gap-4">
              <img
                src={formData.background.src}
                alt={formData.background?.alt || 'Background'}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Image uploaded</p>
                <p className="text-xs text-gray-400 truncate">
                  {getDisplayPath(formData.background.src)}
                </p>
                {imageChanged && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Old image will be deleted on save
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <FaTimes size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <FaUpload size={32} className="mb-2" />
              <p className="text-sm">Drag & drop an image here, or click to browse</p>
              <p className="text-xs mt-1">Supports JPEG, PNG, GIF, WebP, SVG (max 5MB)</p>
              <p className="text-xs text-blue-500 mt-2">
                Image will be saved to /storage/Banner/
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
        </div>

        {/* Show old image path if image was changed */}
        {imageChanged && oldImagePath && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-red-500">🗑️</span> Old image will be deleted: {oldImagePath}
          </div>
        )}
      </div>

      {/* Background Alt Text */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
        <input
          type="text"
          value={formData.background?.alt || ''}
          onChange={(e) => updateField('background.alt', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Alt text for image"
        />
      </div>

      {/* Overlay Section with Dropdowns */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Overlay Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dark Overlay</label>
            <select
              value={formData.overlay?.darkOverlay || ''}
              onChange={(e) => updateField('overlay.darkOverlay', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select Dark Overlay</option>
              {overlayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formData.overlay?.darkOverlay && (
              <div className="mt-2 relative">
                <div
                  className={`w-full h-8 rounded-lg ${formData.overlay.darkOverlay}`}
                  style={{
                    backgroundImage: formData.overlay.darkOverlay.includes('gradient')
                      ? formData.overlay.darkOverlay.replace(/^bg-/, '')
                      : undefined,
                    backgroundColor: formData.overlay.darkOverlay.includes('bg-') && !formData.overlay.darkOverlay.includes('gradient')
                      ? formData.overlay.darkOverlay.replace(/^bg-/, '').replace(/\s/g, '')
                      : undefined,
                    minHeight: '32px'
                  }}
                />
                <span className="text-xs text-gray-400 mt-1 block">Preview</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gradient</label>
            <select
              value={formData.overlay?.gradient || ''}
              onChange={(e) => updateField('overlay.gradient', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select Gradient</option>
              {gradientOptions.map((option) => (
                <option key={option.value || 'none'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formData.overlay?.gradient && (
              <div className="mt-2 relative">
                <div
                  className="w-full h-8 rounded-lg"
                  style={{
                    backgroundImage: formData.overlay.gradient.replace(/^bg-/, ''),
                    minHeight: '32px'
                  }}
                />
                <span className="text-xs text-gray-400 mt-1 block">Preview</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Fixed Class Names */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Content</h4>

        {/* Tagline - Fixed Class Name */}
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-500 mb-1">Tagline</h5>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Text</label>
              <input
                type="text"
                value={formData.content?.tagline?.text || ''}
                onChange={(e) => updateField('content.tagline.text', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tagline text"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Class Name (Fixed)</label>
              <input
                type="text"
                value={formData.content?.tagline?.className || 'uppercase tracking-[4px] font-semibold'}
                onChange={(e) => updateField('content.tagline.className', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                placeholder="CSS classes"
              />
              <p className="text-xs text-gray-400 mt-0.5">Fixed class name - edit if needed</p>
            </div>
          </div>
        </div>

        {/* Title - Fixed Class Name */}
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-500 mb-1">Title</h5>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Text</label>
              <input
                type="text"
                value={formData.content?.title?.text || ''}
                onChange={(e) => updateField('content.title.text', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Title text"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Class Name (Fixed)</label>
              <input
                type="text"
                value={formData.content?.title?.className || 'font-bold leading-tight'}
                onChange={(e) => updateField('content.title.className', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                placeholder="CSS classes"
              />
              <p className="text-xs text-gray-400 mt-0.5">Fixed class name - edit if needed</p>
            </div>
          </div>
        </div>

        {/* Description - Fixed Class Name */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 mb-1">Description</h5>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Text</label>
              <textarea
                value={formData.content?.description?.text || ''}
                onChange={(e) => updateField('content.description.text', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Description text"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Class Name (Fixed)</label>
              <input
                type="text"
                value={formData.content?.description?.className || 'font-normal leading-tight'}
                onChange={(e) => updateField('content.description.className', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                placeholder="CSS classes"
              />
              <p className="text-xs text-gray-400 mt-0.5">Fixed class name - edit if needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section - Max 2 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Buttons (Max 2)</h4>
          <button
            type="button"
            onClick={() => addArrayItem('buttons', { text: '', variant: 'primary', className: '', icon: true })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Button
          </button>
        </div>

        {(formData.buttons || []).map((button, index) => (
          <div key={button.id || index} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Button #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeArrayItem('buttons', index)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash size={12} /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Text</label>
                <input
                  type="text"
                  value={button.text || ''}
                  onChange={(e) => updateArrayItem('buttons', index, 'text', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Button text"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Variant</label>
                <input
                  type="text"
                  value={button.variant || ''}
                  onChange={(e) => updateArrayItem('buttons', index, 'variant', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="primary / secondary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-0.5">Class Name</label>
                <input
                  type="text"
                  value={button.className || ''}
                  onChange={(e) => updateArrayItem('buttons', index, 'className', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="CSS classes"
                />
              </div>
            </div>
          </div>
        ))}

        {(!formData.buttons || formData.buttons.length === 0) && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No buttons added. Click "Add Button" to create one (max 2).
          </div>
        )}

        {(formData.buttons || []).length >= 2 && (
          <div className="text-center text-xs text-yellow-600 mt-1">
            Maximum of 2 buttons reached.
          </div>
        )}
      </div>

      {/* Additional Data Info */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Section ID:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Table:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_table || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Key:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_key || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Has Data:</span>
            <span className={`ml-2 font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✓ Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBannerEditor;