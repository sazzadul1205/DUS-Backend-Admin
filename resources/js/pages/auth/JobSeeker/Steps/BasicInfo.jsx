// pages/auth/Steps/BasicInfo.jsx

// React
import { useState, useRef, useEffect } from 'react';

// Icons
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaIdCard,
  FaBirthdayCake,
  FaGlobe,
  FaVenusMars,
  FaTrash,
  FaCloudUploadAlt,
  FaImage,
  FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineBloodtype } from 'react-icons/md';

// SweetAlert
import Swal from 'sweetalert2';

const BasicInfo = ({ data, setData }) => {

  // 
  const genders = ['Male', 'Female', 'Other'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // 
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 
  const fileInputRef = useRef(null);

  // Phone prefix
  const PHONE_PREFIX = '+880';

  // Format phone number on mount / when data.phone changes externally
  useEffect(() => {
    if (data.phone && !data.phone.startsWith(PHONE_PREFIX)) {
      // If phone exists but doesn't have prefix, add it
      const cleaned = data.phone.replace(/\D/g, '');
      setData('phone', `${PHONE_PREFIX}${cleaned}`);
    } else if (!data.phone) {
      // If no phone, set default prefix
      setData('phone', PHONE_PREFIX);
    }
  }, [data.phone, setData]); // Run only once on mount

  // Handle phone input changes while keeping the prefix
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;

    // If empty, set to prefix only
    if (!rawValue) {
      setData('phone', PHONE_PREFIX);
      return;
    }

    // Ensure the prefix is always present at the beginning
    let afterPrefix = rawValue;
    if (!rawValue.startsWith(PHONE_PREFIX)) {
      // Remove any non-digit characters from the start
      const digits = rawValue.replace(/\D/g, '');
      if (digits.length > 0) {
        // If there are digits, add prefix
        afterPrefix = `${PHONE_PREFIX}${digits}`;
      } else {
        // If no digits, just prefix
        afterPrefix = PHONE_PREFIX;
      }
    } else {
      // Extract the part after the prefix
      const afterPrefixValue = rawValue.substring(PHONE_PREFIX.length);
      // Remove all non-digit characters
      const cleaned = afterPrefixValue.replace(/\D/g, '');
      // Limit to 10 digits
      const limited = cleaned.slice(0, 10);
      afterPrefix = `${PHONE_PREFIX}${limited}`;
    }

    setData('phone', afterPrefix);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetPhoto(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetPhoto(file);
    }
  };

  // Validate and set photo
  const validateAndSetPhoto = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a valid image file (JPG, PNG, or GIF)',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'File Too Large',
        text: 'File size must be less than 2MB',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    // Success - show confirmation
    Swal.fire({
      icon: 'success',
      title: 'Photo Uploaded!',
      text: 'Your profile photo has been uploaded successfully.',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      toast: true,
      position: 'top-end'
    });

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setData('photo', file);
  };

  // Delete photo with confirmation
  const handleDeletePhoto = () => {
    Swal.fire({
      title: 'Delete Photo?',
      text: 'Are you sure you want to remove your profile photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setData('photo', null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your profile photo has been removed.',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <FaUser className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            <p className="text-sm text-gray-500 mt-1">Please provide your personal details</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Photo */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Profile Photo
            </label>

            {!previewUrl ? (
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Upload profile photo"
                />
                <div className="text-center py-16 px-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                      <FaCloudUploadAlt className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    Drop your photo here
                  </p>
                  <p className="text-gray-400 text-sm mb-3">
                    or click to browse
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                    <FaImage className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">JPG, PNG, GIF up to 2MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 shadow-lg">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-64 object-cover"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                      <FaCheckCircle className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-lg transform hover:scale-105"
                    >
                      <FaImage className="h-4 w-4" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-lg transform hover:scale-105"
                    >
                      <FaTrash className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaIdCard className="h-4 w-4 text-blue-500" />
                  First Name
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Contact & Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaPhone className="h-4 w-4 text-blue-500" />
                  Phone Number
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="+880 1XX XXX XXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaBirthdayCake className="h-4 w-4 text-blue-500" />
                  Birth Date
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={data.birth_date}
                  onChange={(e) => setData('birth_date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Gender & Blood Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaVenusMars className="h-4 w-4 text-blue-500" />
                  Gender
                </span>
              </label>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">Select gender</option>
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <MdOutlineBloodtype className="h-4 w-4 text-red-500" />
                  Blood Group
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHeartbeat className="h-5 w-5 text-red-400" />
                </div>
                <select
                  value={data.blood_type}
                  onChange={(e) => setData('blood_type', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                Address
              </span>
            </label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-3 pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                rows="3"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Your full address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <FaGlobe className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> First name, last name, and phone are required fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;