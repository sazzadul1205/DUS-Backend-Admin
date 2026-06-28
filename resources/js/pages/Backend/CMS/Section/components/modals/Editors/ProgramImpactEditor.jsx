// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ProgramImpactEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

/**
 * ProgramImpactEditor - Editor for ProgramImpactSection data
 * Features:
 * - Drag & drop image upload for main images (array of images)
 * - Drag & drop image upload for SDG images
 * - Tracks old images for deletion
 * - Section title editing
 * - SDG images management (add/remove) - Grid layout
 * - Calls onDataChange when data is modified
 */
const ProgramImpactEditor = ({ section, hasData, onDataChange }) => {
  // Parse the section data
  const initialData = section?.data?.data || section?.data || {};

  // Local state for form inputs
  const [formData, setFormData] = useState(initialData);

  // Track if images have been changed
  const [mainImageChanges, setMainImageChanges] = useState({});
  const [oldMainImagePaths, setOldMainImagePaths] = useState({});

  const [sdgImageChanges, setSdgImageChanges] = useState({});
  const [oldSdgImagePaths, setOldSdgImagePaths] = useState({});

  // Drag and drop states
  const [uploadingMainImage, setUploadingMainImage] = useState({});
  const [uploadingSdgImage, setUploadingSdgImage] = useState({});

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

    // Check which array we're removing from
    if (path === 'sdgImages') {
      const items = formData.sdgImages || [];
      if (items[index]?.src) {
        setOldSdgImagePaths(prev => ({
          ...prev,
          [index]: items[index].src
        }));
        setSdgImageChanges(prev => ({ ...prev, [index]: true }));
      }
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
  // MAIN IMAGE DRAG & DROP FUNCTIONS
  // ============================================================

  const handleMainImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processMainImageFile(file, index);
    }
  };

  const handleMainImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processMainImageFile(file, index);
    }
    e.target.value = '';
  };

  const processMainImageFile = (file, index) => {
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

    const items = formData.section?.mainImage?.images || [];
    if (items[index] && !mainImageChanges[index]) {
      setOldMainImagePaths(prev => ({
        ...prev,
        [index]: items[index]
      }));
    }

    setUploadingMainImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem('section.mainImage.images', index, '', imageUrl);
      setMainImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingMainImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingMainImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeMainImage = (index) => {
    const items = formData.section?.mainImage?.images || [];
    if (items[index]) {
      setOldMainImagePaths(prev => ({
        ...prev,
        [index]: items[index]
      }));
    }
    const newImages = items.filter((_, i) => i !== index);
    updateField('section.mainImage.images', newImages);
    setMainImageChanges(prev => ({ ...prev, [index]: true }));
  };

  // ============================================================
  // SDG IMAGE DRAG & DROP FUNCTIONS
  // ============================================================

  const handleSdgImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processSdgImageFile(file, index);
    }
  };

  const handleSdgImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processSdgImageFile(file, index);
    }
    e.target.value = '';
  };

  const processSdgImageFile = (file, index) => {
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

    const items = formData.sdgImages || [];
    if (items[index]?.src && !sdgImageChanges[index]) {
      setOldSdgImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }

    setUploadingSdgImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem('sdgImages', index, 'src', imageUrl);
      setSdgImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingSdgImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingSdgImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSdgImage = (index) => {
    const items = formData.sdgImages || [];
    if (items[index]?.src) {
      setOldSdgImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }
    removeArrayItem('sdgImages', index);
    setSdgImageChanges(prev => ({ ...prev, [index]: true }));
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

  const mainImages = formData.section?.mainImage?.images || [];
  const sdgImages = formData.sdgImages || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Program Impact Data</h3>

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
            placeholder="Program Impact and SDGs"
          />
        </div>
      </div>

      {/* ============================================================
          MAIN IMAGES SECTION
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          Main Images ({mainImages.length})
        </h4>

        {/* Grid of main images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mainImages.map((image, index) => (
            <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200 p-2">
              <div
                className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${uploadingMainImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleMainImageDrop(e, index)}
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt={`Main image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => removeMainImage(index)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 truncate block">
                        {getDisplayPath(image)}
                      </span>
                      {mainImageChanges[index] && oldMainImagePaths[index] && (
                        <span className="text-xs text-red-400">🗑️ Will delete old</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <FaUpload size={20} />
                    <span className="text-xs mt-1">Drop image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainImageSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingMainImage[index]}
                />
                {uploadingMainImage[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {mainImages.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No main images added.
          </div>
        )}
      </div>

      {/* ============================================================
          SDG IMAGES SECTION
          ============================================================ */}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">SDG Images ({sdgImages.length})</h4>
          <button
            type="button"
            onClick={() => addArrayItem('sdgImages', { id: Date.now(), src: '', alt: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add SDG Image
          </button>
        </div>

        {/* Grid of SDG images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sdgImages.map((sdg, index) => (
            <div key={sdg.id || index} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">SDG #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSdgImage(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* SDG Image */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${uploadingSdgImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleSdgImageDrop(e, index)}
              >
                {sdg.src ? (
                  <div className="relative">
                    <img
                      src={sdg.src}
                      alt={sdg.alt || 'SDG Image'}
                      className="w-full h-20 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (sdg.src) {
                            setOldSdgImagePaths(prev => ({
                              ...prev,
                              [index]: sdg.src
                            }));
                          }
                          updateArrayItem('sdgImages', index, 'src', '');
                          setSdgImageChanges(prev => ({ ...prev, [index]: true }));
                        }}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 truncate block">
                        {getDisplayPath(sdg.src)}
                      </span>
                      {sdgImageChanges[index] && oldSdgImagePaths[index] && (
                        <span className="text-xs text-red-400">🗑️ Will delete old</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <FaUpload size={20} />
                    <span className="text-xs mt-1">Drop image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSdgImageSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingSdgImage[index]}
                />
                {uploadingSdgImage[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>

              {/* SDG Alt Text */}
              <div className="mt-2">
                <label className="block text-xs text-gray-400 mb-0.5">Alt Text</label>
                <input
                  type="text"
                  value={sdg.alt || ''}
                  onChange={(e) => updateArrayItem('sdgImages', index, 'alt', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="No Poverty"
                />
              </div>
            </div>
          ))}
        </div>

        {sdgImages.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No SDG images added. Click "Add SDG Image" to create one.
          </div>
        )}
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

export default ProgramImpactEditor;