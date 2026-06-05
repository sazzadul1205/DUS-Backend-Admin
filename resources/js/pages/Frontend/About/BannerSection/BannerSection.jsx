// pages/About/BannerSection/BannerSection.jsx

// React
import React from 'react';

const BannerSection = ({ bannerData }) => {
  return (
    <section
      id="banner"
      className="relative w-full h-125 md:h-147.25 overflow-hidden"
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

          {/* Title - Responsive text sizes */}
          <h1 className={`bricolage-grotesque font-bold leading-tight text-[32px] md:text-[100px] text-center md:text-left w-full md:w-215.75`}>
            {bannerData.content.title.text}
          </h1>

          {/* Description - Responsive text sizes and width */}
          <p className={`bricolage-grotesque font-normal text-[14px] md:text-[30px] leading-tight text-center md:text-left text-white w-full md:w-215.75 line-clamp-3 md:line-clamp-none`}>
            {bannerData.content.description.text}
          </p>

        </div>
      </div>
    </section>
  );
};

export default BannerSection;