// js/pages/Frontend/Home/Sections/WhereWeWorkSection.jsx

import React from 'react';

const WhereWeWorkSection = ({ workData }) => {

  return (
    <section
      id='where-we-work'
      className='flex flex-col lg:flex-row justify-between bg-white gap-8 lg:gap-15 px-5 sm:px-10 md:px-20 lg:px-50 py-10 sm:py-15 md:py-25 lg:py-37.5'
    >
      {/* Left Section - Text Content */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between space-y-8 lg:space-y-12.5'>
        <h1 className='bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-[#080C14]'>
          {workData.section.title}
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6'>
          {workData.stats.map((stat) => (
            <div
              key={stat.id}
              className='bg-[#F5F5F5] text-center p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group cursor-pointer'
            >
              <img
                src={stat.icon}
                alt={stat.alt}
                className='w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-15 lg:h-15 mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-7.5 group-hover:scale-110 transition-transform duration-300'
              />
              <h3 className='bricolage-grotesque font-600 text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] text-[#080C14] leading-tight'>
                {stat.value}
              </h3>
              <p className='font-600 text-[14px] sm:text-[15px] lg:text-[16px] text-[#080C14] max-w-63.75 mx-auto leading-relaxed px-2'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className='w-full lg:w-1/2 flex mt-8 lg:mt-0'>
        <img
          src={workData.image.src}
          alt={workData.image.alt}
          className={`${workData.image.className} w-full h-auto lg:h-232.5 object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl`}
        />
      </div>
    </section>
  );
};

export default WhereWeWorkSection;