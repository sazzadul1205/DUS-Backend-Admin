// js/pages/Frontend/Home/Sections/AboutUsSection.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const AboutUsSection = ({ aboutUsData }) => {
  return (
    <section
      id='about-us'
      className='flex flex-col lg:flex-row justify-between items-stretch bg-white gap-8 lg:gap-15 px-5 sm:px-10 md:px-20 lg:px-50 py-10 sm:py-15 md:py-25 lg:py-37.5'
    >

      {/* Left Section - Text Content */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between space-y-10 lg:space-y-15'>

        {/* About Section */}
        <div>
          <h1 className='bricolage-grotesque font-800 text-[32px] sm:text-[36px] lg:text-[40px] text-black pb-4 lg:pb-6'>
            {aboutUsData.section.title}
          </h1>
          <p className='bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151] leading-snug pb-6 lg:pb-7.5'>
            {aboutUsData.section.description}
          </p>

          <button className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'>
            <span>{aboutUsData.section.button.text}</span>
            <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </button>
        </div>

        {/* Mission Section */}
        <div>
          <h1 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] pb-4 lg:pb-6'>
            {aboutUsData.mission.title}
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-2.5'>
            {aboutUsData.mission.items.map((item) => (
              <div key={item.id} className='bg-[#F5F5F5] flex p-4 sm:p-5 lg:p-6 rounded-xl gap-4 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                <img
                  src={item.icon}
                  alt={item.alt}
                  className='w-6 h-6 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 group-hover:scale-110 transition-transform duration-300'
                />
                <div>
                  <h3 className='bricolage-grotesque font-600 text-lg sm:text-xl lg:text-xl text-[#080C14] mb-1 lg:mb-2'>{item.title}</h3>
                  <p className='bricolage-grotesque font-400 text-[14px] sm:text-[15px] lg:text-[16px] text-[#515151] leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div>
          <h1 className='bricolage-grotesque font-600 text-[20px] sm:text-[22px] lg:text-[24px] text-[#080C14] pb-4 lg:pb-6'>
            {aboutUsData.impact.title}
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 rounded-md'>
            {aboutUsData.impact.stats.map((stat) => (
              <div key={stat.id} className='bg-[#F5F5F5] py-5 sm:py-6 lg:py-7.5 rounded-xl group hover:bg-[#009BE2] transition-all duration-300 hover:-translate-y-1'>
                <h3 className='flex items-end font-600 text-[36px] sm:text-[44px] lg:text-[50px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                  {stat.value}
                  <span className='text-[14px] sm:text-[15px] lg:text-[16px] pb-2 lg:pb-3 group-hover:text-white transition-colors duration-300'>
                    {stat.suffix}
                  </span>
                </h3>
                <p className='font-600 text-[14px] sm:text-[15px] lg:text-[16px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Image (matches full height of text section) */}
      <div className='w-full lg:w-1/2 flex mt-8 lg:mt-0'>
        <img
          src={aboutUsData.image.src}
          alt={aboutUsData.image.alt}
          className='w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
        />
      </div>
    </section>
  );
};

export default AboutUsSection;