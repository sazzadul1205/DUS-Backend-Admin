// js/Sections/AboutUsSection/AboutUsSection.jsx

// React
import React, { useState } from 'react';

// Arrow Icon
import ArrowIcon from '../../components/Shared/ArrowIcon';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// Generate placeholder image URL
const getPlaceholderImage = (width = 800, height = 600, text = 'About Us') => {
  return `https://via.placeholder.com/${width}x${height}/009BE2/FFFFFF?text=${encodeURIComponent(text)}`;
};

/**
 * AboutUsSection Component
 * 
 * @param {Object} props
 * @param {Object} props.data - About Us data from API (from DynamicSectionRenderer)
 * @param {Object} props.aboutUsData - About Us data from API (direct prop)
 * @param {string} props.bgColor - Background color (optional)
 * @param {string} props.paddingY - Vertical padding classes
 * @param {string} props.paddingX - Horizontal padding classes
 * @param {string} props.sectionClassName - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered about us section
 */
const AboutUsSection = ({
  data,           // From DynamicSectionRenderer
  aboutUsData,    // Direct prop (legacy support)
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-15 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
}) => {
  // ============================================
  // HOOKS MUST BE CALLED AT THE TOP LEVEL
  // ============================================
  const [imageError, setImageError] = useState(false);

  // ============================================
  // PROCESS DATA
  // ============================================
  // Use data prop if available, fallback to aboutUsData
  let resolvedData = data || aboutUsData;

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(resolvedData)) {
    return null;
  }

  // ============================================
  // NORMALIZE DATA STRUCTURE
  // ============================================
  // Check if the data is wrapped in a 'data' property
  // This happens when the API returns { id, page_slug, section_key, data: { ... } }
  if (resolvedData.data && typeof resolvedData.data === 'object') {
    resolvedData = resolvedData.data;
  }

  // ============================================
  // SAFE DESTRUCTURING WITH DEFAULTS
  // ============================================
  const {
    section = {},
    mission = {},
    impact = {},
    image = {}
  } = resolvedData;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasAnyContent = hasValue(section.title) ||
    hasValue(section.description) ||
    hasValue(section.button?.text) ||
    hasValue(mission.title) ||
    hasValue(mission.items) ||
    hasValue(impact.title) ||
    hasValue(impact.stats) ||
    hasValue(image.src);

  if (!hasAnyContent) {
    return null;
  }

  // ============================================
  // IMAGE HANDLING
  // ============================================
  // Determine if we should use placeholder
  const usePlaceholder = !hasValue(image.src) || imageError;

  // Get image source
  const imageSrc = usePlaceholder
    ? getPlaceholderImage(800, 600, section.title || 'About Us')
    : image.src;

  // Get image alt text
  const imageAlt = image.alt || (section.title ? `${section.title} - About Us` : 'About us image');

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id='about-us'
      className={`flex flex-col lg:flex-row justify-between items-stretch ${bgColor} gap-8 lg:gap-15 ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* Left Section - Text Content */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between space-y-10 lg:space-y-15'>

        {/* About Section */}
        {(hasValue(section.title) || hasValue(section.description) || hasValue(section.button?.text)) && (
          <div>
            {/* About Title */}
            {hasValue(section.title) && (
              <h1 className='bricolage-grotesque font-800 text-[32px] sm:text-[36px] lg:text-[40px] text-black pb-4 lg:pb-6'>
                {section.title}
              </h1>
            )}

            {/* About Description */}
            {hasValue(section.description) && (
              <p className='bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151] leading-snug pb-6 lg:pb-7.5'>
                {section.description}
              </p>
            )}

            {/* About Button */}
            {hasValue(section.button?.text) && (
              <button
                onClick={() => {
                  if (section.button?.link) {
                    window.location.href = section.button.link;
                  }
                }}
                className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
              >
                <span>{section.button.text}</span>
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            )}
          </div>
        )}

        {/* Mission Section */}
        {(hasValue(mission.title) || hasValue(mission.items)) && (
          <div>
            {/* Mission Title */}
            {hasValue(mission.title) && (
              <h1 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] pb-4 lg:pb-6'>
                {mission.title}
              </h1>
            )}

            {/* Mission Items Grid */}
            {hasValue(mission.items) && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-2.5'>
                {mission.items.map((item) => (
                  <div key={item.id} className='bg-[#F5F5F5] flex p-4 sm:p-5 lg:p-6 rounded-xl gap-4 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt={item.alt || item.title || "Mission icon"}
                        className='w-6 h-6 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 group-hover:scale-110 transition-transform duration-300'
                      />
                    )}
                    <div>
                      {item.title && (
                        <h3 className='bricolage-grotesque font-600 text-lg sm:text-xl lg:text-xl text-[#080C14] mb-1 lg:mb-2'>
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className='bricolage-grotesque font-400 text-[14px] sm:text-[15px] lg:text-[16px] text-[#515151] leading-relaxed'>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Impact Section */}
        {(hasValue(impact.title) || hasValue(impact.stats)) && (
          <div>
            {/* Impact Title */}
            {hasValue(impact.title) && (
              <h1 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] pb-4 lg:pb-6'>
                {impact.title}
              </h1>
            )}

            {/* Impact Stats Grid */}
            {hasValue(impact.stats) && (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 rounded-md'>
                {impact.stats.map((stat) => (
                  <div key={stat.id} className='bg-[#F5F5F5] py-5 sm:py-6 lg:py-7.5 rounded-xl group hover:bg-[#009BE2] transition-all duration-300 hover:-translate-y-1 cursor-default '>
                    {(hasValue(stat.value) || hasValue(stat.suffix)) && (
                      <h3 className='flex items-end font-600 text-[36px] sm:text-[44px] lg:text-[50px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                        {stat.value}
                        {stat.suffix && (
                          <span className='text-[14px] sm:text-[15px] lg:text-[16px] pb-2 lg:pb-3 group-hover:text-white transition-colors duration-300 cursor-default'>
                            {stat.suffix}
                          </span>
                        )}
                      </h3>
                    )}
                    {hasValue(stat.label) && (
                      <p className='font-600 text-[14px] sm:text-[15px] lg:text-[16px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                        {stat.label}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section - Image */}
      <div className='w-full lg:w-1/2 flex mt-8 lg:mt-0'>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`${image.className || ''} w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl`}
          onError={handleImageError}
        />
      </div>
    </section>
  );
};

export default AboutUsSection;