// resources/js/pages/Backend/CMS/Section/components/modals/Editors/WhereWeWorkEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

/**
 * WhereWeWorkEditor - Editor for WhereWeWorkSection data
 * Features:
 * - Drag & drop image upload (shows path preview)
 * - Drag & drop icon upload for stats
 * - Tracks old images/icons for deletion
 * - Section title editing
 * - Stats management (add/remove) - List layout
 * - Calls onDataChange when data is modified
 */
const WhereWeWorkEditor = ({ section, hasData, onDataChange }) => {
  // Parse the section data
  const initialData = section?.data?.data || section?.data || {};

  // Local state for form inputs
  const [formData, setFormData] = useState(initialData);

  // Track if image has been changed (for deletion)
  const [imageChanged, setImageChanged] = useState(false);
  const [oldImagePath, setOldImagePath] = useState(initialData?.image?.src || '');

  // Track if icons have been changed
  const [iconChanges, setIconChanges] = useState({});
  const [oldIconPaths, setOldIconPaths] = useState({});

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState({});

  // Notify parent when formData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

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

  // Add new item to array
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

    const newId = Math.max(0, ...current[lastKey].map(item => item.id || 0)) + 1;
    current[lastKey].push({ ...template, id: newId });
    setFormData(newData);
  };

  // Remove array item
  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    // Store old icon path before removal
    const items = formData.stats || [];
    if (items[index]?.icon) {
      setOldIconPaths(prev => ({
        ...prev,
        [index]: items[index].icon
      }));
      setIconChanges(prev => ({ ...prev, [index]: true }));
    }

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
      if (!imageChanged && formData.image?.src) {
        setOldImagePath(formData.image.src);
      }

      updateField('image.src', imageUrl);
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
    if (!imageChanged && formData.image?.src) {
      setOldImagePath(formData.image.src);
    }
    updateField('image.src', '');
    setImageChanged(true);
  };

  // ============================================================
  // ICON DRAG & DROP FUNCTIONS
  // ============================================================

  const handleIconDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processIconFile(file, index);
    }
  };

  const handleIconSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processIconFile(file, index);
    }
    e.target.value = '';
  };

  const processIconFile = (file, index) => {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Icon size should be less than 2MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Store old icon path if it exists
    const items = formData.stats || [];
    if (items[index]?.icon && !iconChanges[index]) {
      setOldIconPaths(prev => ({
        ...prev,
        [index]: items[index].icon
      }));
    }

    setUploadingIcon(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const iconUrl = event.target.result;
      updateArrayItem('stats', index, 'icon', iconUrl);
      setIconChanges(prev => ({ ...prev, [index]: true }));
      setUploadingIcon(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingIcon(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the icon file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeIcon = (index) => {
    const items = formData.stats || [];
    if (items[index]?.icon) {
      setOldIconPaths(prev => ({
        ...prev,
        [index]: items[index].icon
      }));
    }
    updateArrayItem('stats', index, 'icon', '');
    setIconChanges(prev => ({ ...prev, [index]: true }));
  };

  // Helper to get display path
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  // Check if data exists
  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center py-8 text-gray-400">
        <p className="text-sm">No data available to edit</p>
        <p className="text-xs mt-1">Data will appear here once the section has content</p>
      </div>
    );
  }

  // Get the items
  const stats = formData.stats || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Where We Work Data</h3>

      {/* ============================================================
          SECTION DATA
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={formData.section?.title || ''}
            onChange={(e) => updateField('section.title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Where We Work"
          />
        </div>
      </div>

      {/* ============================================================
          STATS SECTION - LIST LAYOUT
          ============================================================ */}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Statistics ({stats.length})</h4>
          <button
            type="button"
            onClick={() => addArrayItem('stats', { id: Date.now(), icon: '', value: '', label: '', alt: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Stat
          </button>
        </div>

        {/* List of stats - Full width */}
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={stat.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Stat #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem('stats', index)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash size={12} /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left Column - Icon */}
                <div>
                  <label className="block text-xs text-gray-400 mb-0.5">Icon</label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-3 transition-all ${uploadingIcon[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleIconDrop(e, index)}
                  >
                    {stat.icon ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={stat.icon}
                          alt={stat.alt || 'Icon'}
                          className="w-12 h-12 object-contain rounded border border-gray-200"
                        />
                        <span className="text-xs text-gray-500 truncate flex-1">
                          {getDisplayPath(stat.icon)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeIcon(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <FaUpload size={18} />
                        <span className="text-sm">Drop icon or click to browse</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIconSelect(e, index)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingIcon[index]}
                    />
                    {uploadingIcon[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                      </div>
                    )}
                  </div>
                  {iconChanges[index] && oldIconPaths[index] && (
                    <div className="mt-1 text-xs text-gray-400">
                      <span className="text-red-500">🗑️</span> Old icon will be deleted: {oldIconPaths[index]}
                    </div>
                  )}
                </div>

                {/* Right Column - Value, Label, Alt */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">Value</label>
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="450K"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Total Member Reach"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">Alt Text</label>
                    <input
                      type="text"
                      value={stat.alt || ''}
                      onChange={(e) => updateArrayItem('stats', index, 'alt', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Member Reach Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stats.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            No statistics added. Click "Add Stat" to create one.
          </div>
        )}
      </div>

      {/* ============================================================
          IMAGE SECTION
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Map Image</h4>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {formData.image?.src ? (
            <div className="flex items-center gap-4">
              <img
                src={formData.image.src}
                alt={formData.image?.alt || 'Map Image'}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Image uploaded</p>
                <p className="text-xs text-gray-400 truncate">
                  {getDisplayPath(formData.image.src)}
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
                Image will be saved to /storage/WhereWeWork/
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

        {imageChanged && oldImagePath && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-red-500">🗑️</span> Old image will be deleted: {oldImagePath}
          </div>
        )}

        {/* Image Alt Text */}
        <div className="mt-2">
          <label className="block text-xs text-gray-500 mb-1">Image Alt Text</label>
          <input
            type="text"
            value={formData.image?.alt || ''}
            onChange={(e) => updateField('image.alt', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Map Place holder Text"
          />
        </div>

        {/* Image Class Name */}
        <div className="mt-2">
          <label className="block text-xs text-gray-500 mb-1">Image Class Name</label>
          <input
            type="text"
            value={formData.image?.className || ''}
            onChange={(e) => updateField('image.className', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="w-full h-232.5 object-cover rounded-4xl"
          />
          <p className="text-xs text-gray-400 mt-0.5">CSS classes for the image styling</p>
        </div>
      </div>

      {/* ============================================================
          ADDITIONAL DATA INFO
          ============================================================ */}

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

export default WhereWeWorkEditor;