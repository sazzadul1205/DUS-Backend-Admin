// pages/About/LegalSection/LegalSection.jsx

// React
import React from 'react';

// Components
import ArrowIcon from '../../../../components/Shared/ArrowIcon';

const LegalSection = ({ legalData }) => {

  return (
    <section
      id="legal"
      className="relative w-full h-125 md:h-147.25 overflow-hidden"
    >
      {/* Background Image */}
      <img
        src={legalData.background.src}
        alt={legalData.background.alt}
        className="w-full h-full object-cover object-center md:object-cover"
      />

      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${legalData.overlay.darkOverlay}`}></div>

      {/* Additional overlay for mobile to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* White Box Text - Positioned at bottom right */}
      <div className="absolute bottom-5 right-5 md:bottom-10 lg:bottom-12.5 md:right-10 lg:right-50 bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-12.5 w-[calc(100%-2.5rem)] md:w-auto lg:w-182.5 h-auto lg:h-75 shadow-lg rounded-lg">
        <h3 className="text-black font-700 text-2xl md:text-3xl lg:text-[40px] bricolage-grotesque leading-tight">
          {legalData.textBox.title} <br /> {legalData.textBox.titleLine2}
        </h3>

        <div className='pt-6 md:pt-7 lg:pt-9'>
          <button
            onClick={() => window.location.href = legalData.textBox.buttonLink}
            className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
          >
            <span>{legalData.textBox.buttonText}</span>
            <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LegalSection;