// resources/js/pages/Backend/CMS/Section/components/modals/Editors/AboutUsEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

/**
 * AboutUsEditor - Editor for AboutUsSection data
 * Features:
 * - Drag & drop image upload (shows path preview)
 * - Tracks old image for deletion
 * - Section content editing
 * - Mission items management
 * - Impact stats management
 * - Calls onDataChange when data is modified
 */
const AboutUsEditor = ({ section, hasData, onDataChange }) => {
  // Parse the section data
  const initialData = section?.data?.data || section?.data || {};

  // Local state for form inputs
  const [formData, setFormData] = useState(initialData);

  // Track if image has been changed (for deletion)
  const [imageChanged, setImageChanged] = useState(false);
  const [oldImagePath, setOldImagePath] = useState(initialData?.image?.src || '');

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

    setUploadingIcon(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const iconUrl = event.target.result;
      updateArrayItem('mission.items', index, 'icon', iconUrl);
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
    updateArrayItem('mission.items', index, 'icon', '');
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit About Us Data</h3>

      {/* ============================================================
          SECTION DATA
          ============================================================ */}

      {/* Section Title & Description */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={formData.section?.title || ''}
              onChange={(e) => updateField('section.title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="About us"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={formData.section?.description || ''}
              onChange={(e) => updateField('section.description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Description about the organization"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.section?.button?.text || ''}
                onChange={(e) => updateField('section.button.text', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="More about us"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Link</label>
              <input
                type="text"
                value={formData.section?.button?.link || ''}
                onChange={(e) => updateField('section.button.link', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="/about"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MISSION SECTION
          ============================================================ */}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Mission Items</h4>
          <button
            type="button"
            onClick={() => addArrayItem('mission.items', { id: Date.now(), icon: '', title: '', description: '', alt: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Mission Item
          </button>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Mission Title</label>
          <input
            type="text"
            value={formData.mission?.title || ''}
            onChange={(e) => updateField('mission.title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="The mission of our organization"
          />
        </div>

        {(formData.mission?.items || []).map((item, index) => (
          <div key={item.id || index} className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Item #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeArrayItem('mission.items', index)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash size={12} /> Remove
              </button>
            </div>

            {/* Icon with Drag & Drop */}
            <div className="mb-2">
              <label className="block text-xs text-gray-400 mb-0.5">Icon</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${uploadingIcon[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleIconDrop(e, index)}
              >
                {item.icon ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={item.icon}
                      alt={item.alt || 'Icon'}
                      className="w-10 h-10 object-contain rounded"
                    />
                    <span className="text-xs text-gray-500 truncate flex-1">
                      {getDisplayPath(item.icon)}
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
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaUpload size={16} />
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
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateArrayItem('mission.items', index, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Education for All"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Description</label>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => updateArrayItem('mission.items', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Description of the mission item"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Alt Text</label>
                <input
                  type="text"
                  value={item.alt || ''}
                  onChange={(e) => updateArrayItem('mission.items', index, 'alt', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Education Icon"
                />
              </div>
            </div>
          </div>
        ))}

        {(!formData.mission?.items || formData.mission.items.length === 0) && (
          <div className="text-center py-4 text-gray-400 text-sm mt-2">
            No mission items added. Click "Add Mission Item" to create one.
          </div>
        )}
      </div>

      {/* ============================================================
          IMPACT SECTION
          ============================================================ */}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Impact Stats</h4>
          <button
            type="button"
            onClick={() => addArrayItem('impact.stats', { id: Date.now(), value: '', suffix: '', label: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Stat
          </button>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Impact Title</label>
          <input
            type="text"
            value={formData.impact?.title || ''}
            onChange={(e) => updateField('impact.title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Impact In Numbers"
          />
        </div>

        {(formData.impact?.stats || []).map((stat, index) => (
          <div key={stat.id || index} className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Stat #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeArrayItem('impact.stats', index)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash size={12} /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Value</label>
                <input
                  type="text"
                  value={stat.value || ''}
                  onChange={(e) => updateArrayItem('impact.stats', index, 'value', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Suffix</label>
                <input
                  type="text"
                  value={stat.suffix || ''}
                  onChange={(e) => updateArrayItem('impact.stats', index, 'suffix', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-0.5">Label</label>
                <input
                  type="text"
                  value={stat.label || ''}
                  onChange={(e) => updateArrayItem('impact.stats', index, 'label', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Years of Service"
                />
              </div>
            </div>
          </div>
        ))}

        {(!formData.impact?.stats || formData.impact.stats.length === 0) && (
          <div className="text-center py-4 text-gray-400 text-sm mt-2">
            No impact stats added. Click "Add Stat" to create one.
          </div>
        )}
      </div>

      {/* ============================================================
          IMAGE SECTION
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Image</h4>
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
                alt={formData.image?.alt || 'About Us Image'}
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
                Image will be saved to /storage/AboutUs/
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

        <div className="mt-2">
          <label className="block text-xs text-gray-500 mb-1">Image Alt Text</label>
          <input
            type="text"
            value={formData.image?.alt || ''}
            onChange={(e) => updateField('image.alt', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="About Us Image"
          />
        </div>
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

export default AboutUsEditor;