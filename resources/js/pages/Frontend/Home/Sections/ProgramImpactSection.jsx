// js/pages/Frontend/Home/Sections/ProgramImpactSection.jsx

// React
import React, { useState } from 'react';

const ProgramImpactSection = ({ impactData }) => {

  // State
  const [index, setIndex] = useState(0);

  // Functions
  const goToSlide = (i) => {
    setIndex(i);
  };

  return (
    <div className='bg-white py-12 sm:py-16 md:py-25 lg:py-37.5 px-5 sm:px-10 md:px-20 lg:px-75'>
      {/* Main Image Carousel */}
      <div className="w-full flex flex-col items-center pb-8 sm:pb-10 lg:pb-15">
        <div className="w-full">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
            <img
              src={impactData.section.mainImage.images[index]}
              alt={`Program impact slide ${index + 1}`}
              className="w-full h-48 sm:h-64 md:h-96 lg:h-186.25 object-cover transition-all duration-500 group-hover:scale-105"
            />

            {/* Dots Indicator */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
              {impactData.section.mainImage.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${i === index
                      ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white"
                      : "w-2 sm:w-2.5 h-1.5 sm:h-2 bg-white/50 hover:bg-white/70"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className='text-[#080C14] text-[20px] sm:text-[22px] lg:text-[24px] font-600 mb-4 sm:mb-5 lg:mb-6'>
        {impactData.section.title}
      </h1>

      {/* SDG Images Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5'>
        {impactData.sdgImages.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className='w-full h-auto object-cover rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer'
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramImpactSection;