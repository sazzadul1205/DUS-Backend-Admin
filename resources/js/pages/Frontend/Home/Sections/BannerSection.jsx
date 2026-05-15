// js/pages/Frontend/Home/Sections/BannerSection.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const BannerSection = ({ bannerData }) => {
  return (
    <section
      id="banner"
      className="relative w-full h-125 md:h-250 overflow-hidden"
    >

      {/* Background Image */}
      <img
        src={bannerData.background.src}
        alt={bannerData.background.alt}
        className="w-full h-full object-cover object-center md:object-cover"
      />

      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${bannerData.overlay.darkOverlay}`}></div>

      {/* Left Dark Gradient - Responsive gradient strength */}
      <div className={`absolute inset-0 ${bannerData.overlay.gradient}`}></div>

      {/* Additional overlay for mobile to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* Content */}
      <div className="absolute left-0 md:left-5 inset-0 flex items-center p-5 md:p-12.5">
        <div className="w-full px-4 md:px-20 text-white space-y-3 md:space-y-5">

          {/* Tagline - Responsive text sizes */}
          <p className={`bricolage-grotesque ${bannerData.content.tagline.className} text-white text-center md:text-left text-sm md:text-[30px] tracking-[2px] md:tracking-[4px]`}>
            {bannerData.content.tagline.text}
          </p>

          {/* Title - Responsive text sizes */}
          <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75`}>
            {bannerData.content.title.text}
          </h1>

          {/* Description - Responsive text sizes and width */}
          <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none`}>
            {bannerData.content.description.text}
          </p>

          {/* Buttons - Responsive layout and sizing */}
          <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-6 pt-5 md:pt-7.5'>
            {bannerData.buttons.map((button) => (
              <button
                key={button.id}
                className={`capitalize font-600 text-[14px] md:text-[18px] px-5 md:px-7.5 py-3 md:py-5 bricolage-grotesque rounded-md inline-flex items-center justify-center gap-2 md:gap-3 group transition-all duration-300 w-full sm:w-auto ${button.className}`}
              >
                <span>{button.text}</span>
                {button.icon && (
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
};

export default BannerSection;