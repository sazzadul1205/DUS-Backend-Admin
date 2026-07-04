// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ImageGalleryEditor.jsx

// React
import React, { useState, useEffect } from 'react';

// Icons
import { FaTrash, FaPlus, FaTimes, FaImage } from 'react-icons/fa';

// Sweetalert
import Swal from 'sweetalert2';

// Shared Components
import { TextField } from './shared/Fields';

const ImageGalleryEditor = ({ section, hasData, onDataChange }) => {
  // ===== STATE MANAGEMENT =====
  const initialData = section?.data?.data || section?.data || {};
  const [formData, setFormData] = useState(initialData);

  // Track image changes for deletion tracking
  const [imageChanges, setImageChanges] = useState({});
  const [oldImagePaths, setOldImagePaths] = useState({});
  const [uploadingImage, setUploadingImage] = useState({});

  // Notify parent when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // ===== HELPER FUNCTIONS =====

  // Update top-level fields
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update a field in an array item
  const updateArrayItem = (index, field, value) => {
    const newData = { ...formData };
    if (!newData.images) newData.images = [];
    if (!newData.images[index]) newData.images[index] = {};
    newData.images[index][field] = value;
    setFormData(newData);
  };

  // ===== IMAGE MANAGEMENT FUNCTIONS =====

  // Add a new image with default values
  const addImage = () => {
    const newData = { ...formData };
    if (!newData.images) newData.images = [];
    const newId = Math.max(0, ...newData.images.map(img => img.id || 0)) + 1;
    newData.images.push({
      id: newId,
      src: '',
      alt: '',
      title: ''
    });
    setFormData(newData);
  };

  // Remove an image and track it for deletion
  const removeImage = (index) => {
    const items = formData.images || [];
    if (items[index]?.src) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
      setImageChanges(prev => ({ ...prev, [index]: true }));
    }
    const newData = { ...formData };
    newData.images.splice(index, 1);
    setFormData(newData);
  };

  // Handle image drop from drag & drop
  const handleImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processImageFile(file, index);
    }
  };

  // Handle image selection via file input
  const handleImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file, index);
    }
    e.target.value = '';
  };

  // Process and upload the image file
  const processImageFile = (file, index) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Store old image path if it exists
    const items = formData.images || [];
    if (items[index]?.src && !imageChanges[index]) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }

    // Read and convert image to base64
    setUploadingImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem(index, 'src', imageUrl);
      setImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove image from a specific slot
  const removeImageSrc = (index) => {
    const items = formData.images || [];
    if (items[index]?.src) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }
    updateArrayItem(index, 'src', '');
    setImageChanges(prev => ({ ...prev, [index]: true }));
  };

  // Display path for image
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  // ===== EMPTY STATE =====
  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Image Gallery Data</h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No images added</p>
          <p className="text-xs mt-1">Click "Add Image" to create one</p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <FaPlus size={14} />
            Add Image
          </button>
        </div>
      </div>
    );
  }

  const images = formData.images || [];

  // ===== MAIN RENDER =====
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Image Gallery Data</h3>

      {/* Section Title */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="Section Title"
            value={formData.sectionTitle || ''}
            onChange={(e) => updateField('sectionTitle', e.target.value)}
            placeholder="DUS in action"
          />
          <TextField
            label="Image Count Label"
            value={formData.imageCountLabel || 'Image Count'}
            onChange={(e) => updateField('imageCountLabel', e.target.value)}
            placeholder="Image Count"
          />
        </div>
      </div>

      {/* Images List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Images ({images.length})</h4>
          <button
            type="button"
            onClick={addImage}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={image.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Image #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash size={12} /> Remove
                </button>
              </div>

              {/* Image Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-3 transition-all ${uploadingImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                {image.src ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={image.src}
                      alt={image.alt || 'Gallery image'}
                      className="w-20 h-16 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 truncate">
                        {getDisplayPath(image.src)}
                      </p>
                      {imageChanges[index] && oldImagePaths[index] && (
                        <p className="text-xs text-red-400">🗑️ Will delete old</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageSrc(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaImage size={18} />
                    <span className="text-sm">Drop image or click to browse</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImage[index]}
                />
                {uploadingImage[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>

              {/* Image Details */}
              <div className="mt-2 space-y-2">
                <TextField
                  label="Title"
                  value={image.title || ''}
                  onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                  placeholder="Image title"
                />
                <TextField
                  label="Alt Text"
                  value={image.alt || ''}
                  onChange={(e) => updateArrayItem(index, 'alt', e.target.value)}
                  placeholder="Gallery image description"
                />
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            No images added. Click "Add Image" to create one.
          </div>
        )}
      </div>

      {/* Data Information */}
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
            <span className="text-gray-500">Total Images:</span>
            <span className="ml-2 text-gray-700 font-mono">{images.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryEditor;