// js/Sections/ImageGallerySection/ImageGallerySection.jsx

import React, { useState } from 'react';

// Generate placeholder image URL
const getPlaceholderImage = (width = 485, height = 400, text = 'Gallery Image') => {
  return `https://via.placeholder.com/${width}x${height}/EAEAEA/999999?text=${encodeURIComponent(text)}`;
};

const ImageGallerySection = ({
  data,
  galleryData,
  sectionTitle = 'Gallery',
  imageCountLabel = 'Image Count',
  imagesPerPage = 9,
  imagesPerLoad = 6,
  bgColor = 'bg-white',
  paddingY = 'py-37.5',
  paddingX = 'px-50',
  sectionClassName = '',
  sectionId = 'image-gallery-section',
}) => {
  const [visibleCount, setVisibleCount] = useState(imagesPerPage);
  const [imageErrors, setImageErrors] = useState({});

  // ============================================
  // RESOLVE DATA - FIXED
  // ============================================
  let resolvedData = galleryData || data || {};

  // If resolvedData is an array, use it directly
  if (Array.isArray(resolvedData)) {
    // It's already an array of images
    resolvedData = { images: resolvedData };
  }
  // If resolvedData has a 'data' property (from nested structure)
  else if (resolvedData.data && typeof resolvedData.data === 'object') {
    resolvedData = resolvedData.data;
  }

  // ============================================
  // NORMALIZE DATA STRUCTURE - FIXED
  // ============================================
  let resolvedImages = [];
  let resolvedSectionTitle = sectionTitle;
  let resolvedImageCountLabel = imageCountLabel;

  // Try to extract images from various possible locations
  if (resolvedData) {
    // Direct images array
    if (Array.isArray(resolvedData.images)) {
      resolvedImages = resolvedData.images;
    }
    // Data is the images array itself
    else if (Array.isArray(resolvedData)) {
      resolvedImages = resolvedData;
    }
    // Items array
    else if (Array.isArray(resolvedData.items)) {
      resolvedImages = resolvedData.items;
    }
    // Gallery array
    else if (Array.isArray(resolvedData.gallery)) {
      resolvedImages = resolvedData.gallery;
    }
    // Photos array
    else if (Array.isArray(resolvedData.photos)) {
      resolvedImages = resolvedData.photos;
    }

    // Extract section title
    if (resolvedData.sectionTitle) {
      resolvedSectionTitle = resolvedData.sectionTitle;
    } else if (resolvedData.title) {
      resolvedSectionTitle = resolvedData.title;
    }

    // Extract image count label
    if (resolvedData.imageCountLabel) {
      resolvedImageCountLabel = resolvedData.imageCountLabel;
    }
  }

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasImages = resolvedImages.length > 0;

  if (!hasImages) {
    return null;
  }

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + imagesPerLoad, resolvedImages.length));
  };

  const isAllVisible = visibleCount >= resolvedImages.length;
  const visibleImages = resolvedImages.slice(0, visibleCount);

  // ============================================
  // IMAGE HANDLING
  // ============================================
  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const getImageSrc = (image, index) => {
    const imageId = image.id || index;
    if (imageErrors[imageId]) {
      const title = image.title || image.caption || `Gallery image ${index + 1}`;
      return getPlaceholderImage(485, 400, title);
    }
    const src = image.src || image.url || image.image || image;
    if (typeof src === 'string' && src.trim().length > 0) {
      return src;
    }
    return getPlaceholderImage(485, 400, image.title || image.caption || `Gallery image ${index + 1}`);
  };

  const getImageAlt = (image, index) => {
    return image.alt || image.title || image.caption || `Gallery image ${index + 1}`;
  };

  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}
    >
      <div className="mx-auto space-y-7.5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-[#171D38] text-[28px] sm:text-[34px] md:text-[36px] font-semibold">
            {resolvedSectionTitle}
          </h3>
          <div className="bg-[#EAF6FF] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg">
            <p className="text-[14px] sm:text-[16px] font-normal text-[#2781BD]">
              {resolvedImageCountLabel}: {resolvedImages.length}
            </p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7.5">
          {visibleImages.map((image, index) => {
            const imageId = image.id || index;
            const imageSrc = getImageSrc(image, index);
            const imageAlt = getImageAlt(image, index);

            return (
              <div
                key={imageId}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-100 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={() => handleImageError(imageId)}
                />
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        {!isAllVisible && (
          <div className="flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3.75 border border-[#2781BD] rounded-lg text-[14px] sm:text-[16px] font-semibold text-[#2781BD] hover:bg-[#2781BD] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGallerySection;