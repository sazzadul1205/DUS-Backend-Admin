// js/pages/Frontend/Home/Sections/UpcomingEventsSection.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

// Icons
import { CiLocationOn } from "react-icons/ci";

const UpcomingEventsSection = ({ eventsData }) => {

  return (
    <section id='upcoming-events' className='bg-[#FFFFFF] px-5 sm:px-10 md:px-20 lg:px-50 py-12 sm:py-16 md:py-25 lg:py-37.5'>
      <div className='flex flex-col lg:flex-row justify-between gap-8 lg:gap-25'>
        {/* Left Section */}
        <div className='w-full lg:min-w-150 lg:w-auto'>
          <div className='gap-6'>
            <h1 className='bricolage-grotesque font-800 text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] text-[#080C14] leading-tight'>
              {eventsData.section.title}
            </h1>

            <p className='text-[#515151] font-400 text-[16px] sm:text-[18px] lg:text-[20px] mt-3 sm:mt-4 lg:mt-5 leading-relaxed'>
              {eventsData.section.description}
            </p>

            <button className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-2 sm:gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap mt-5 sm:mt-6 lg:mt-7.5">
              {eventsData.section.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </div>
          <img
            src={eventsData.image.src}
            alt={eventsData.image.alt}
            className={`${eventsData.image.className} mt-8 sm:mt-10 lg:mt-15 rounded-2xl w-full h-auto lg:h-139.25 object-cover`}
          />
        </div>

        {/* Right Section - Events List */}
        <div className='w-full space-y-5 sm:space-y-6 lg:space-y-7.5 mt-8 lg:mt-0'>
          {eventsData.events.map((event) => (
            <div
              key={event.id}
              className='bg-[#F5F5F5] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer'
            >
              {/* Date Box */}
              <div className='w-full sm:w-46 bg-[#FFFFFF] rounded-2xl py-5 sm:py-8 px-2 text-center sm:min-w-50 group-hover:bg-[#009BE2] transition-colors duration-300'>
                <h3 className='text-[#080C14] font-800 text-[36px] sm:text-[44px] lg:text-[50px] group-hover:text-white transition-colors duration-300'>
                  {event.date.day}
                </h3>

                <h4 className='text-[#080C14] font-800 text-[36px] sm:text-[44px] lg:text-[50px] leading-tight group-hover:text-white transition-colors duration-300'>
                  {event.date.month}
                </h4>

                <p className='text-[#524B48] font-400 text-[12px] sm:text-[14px] lg:text-[16px] group-hover:text-white/90 transition-colors duration-300'>
                  {event.date.weekday} . {event.date.dayNumber} <span>{event.date.time}</span>
                </p>
              </div>

              {/* Event Details */}
              <div className='w-full p-3 sm:p-5'>
                <label className='flex items-center gap-1.5 text-[#524B48] font-400 text-[12px] sm:text-[14px] lg:text-[16px] mb-1 sm:mb-2'>
                  <CiLocationOn className="text-[#009BE2] text-[14px] sm:text-[16px]" />
                  {event.location}
                </label>
                <h3 className='text-[#080C14] font-600 text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-tight sm:leading-10 line-clamp-2 mb-2 sm:mb-2.5'>
                  {event.title}
                </h3>
                <p className='text-[#524B48] font-400 text-[14px] sm:text-[16px] lg:text-[18px] mb-2 sm:mb-2.5 line-clamp-2'>
                  {event.description}
                </p>
                <button className="bricolage-grotesque text-[#009BE2] font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-2 sm:gap-3 group/btn hover:text-[#009BE2]/70 transition-all duration-300 whitespace-nowrap">
                  View Event
                  <ArrowIcon className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;