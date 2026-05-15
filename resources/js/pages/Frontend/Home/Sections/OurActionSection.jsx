// js/pages/Frontend/Home/Sections/OurActionSection.jsx

// React
import React from 'react';

const OurActionSection = ({ actionData }) => {

  return (
    <section
      id='our-action'
      className='mx-auto bg-[#F5F5F5] px-5 sm:px-10 md:px-20 lg:px-50 py-10 sm:py-15 md:py-25 lg:py-37.5'
    >
      {/* Section Header */}
      <div className="text-center">
        <h1 className='bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-center text-[#080C14] pb-3 sm:pb-4'>
          {actionData.section.title}
        </h1>
        <p className='mx-auto font-400 text-center text-[16px] sm:text-[18px] lg:text-[20px] max-w-253 text-[#515151] leading-relaxed px-4 sm:px-0'>
          {actionData.section.description}
        </p>
      </div>

      {/* Actions Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7.5 pt-8 sm:pt-10 lg:pt-12.5'>
        {actionData.actions.map((action) => (
          <div
            key={action.id}
            className='bg-[#FAFAFA] hover:bg-white p-6 sm:p-8 md:p-10 lg:p-12.5 rounded-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:shadow-[0_6px_12px_rgba(0,0,0,0.10)]'
          >
            <img
              src={action.icon}
              alt={action.alt}
              className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12.5 lg:h-12.5 group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4 lg:mb-5'
            />
            <h3 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] mb-2 sm:mb-3'>
              {action.title}
            </h3>
            <p className='font-400 text-[14px] sm:text-[15px] lg:text-[16px] text-[#515151] leading-relaxed'>
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurActionSection;