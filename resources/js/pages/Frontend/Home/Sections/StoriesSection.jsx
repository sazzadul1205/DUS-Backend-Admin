// js/pages/Frontend/Home/Sections/StoriesSection.jsx

// React
import React, { useRef, useEffect, useState } from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const StoriesSection = ({ storiesData }) => {
  // State for drag scrolling
  const scrollContainerRef = useRef(null);

  // State for drag scrolling
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse/Touch drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Mouse/Touch drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse/Touch drag scrolling
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag scrolling
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Touch drag scrolling
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Drag scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseleave', handleMouseUp);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseleave', handleMouseUp);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <section
      id='stories'
      className='bg-[#F5F5F5] py-12 sm:py-16 md:py-25 lg:py-37.5'
    >
      {/* Section Header - Full width with responsive padding */}
      <div className="text-center max-w-7xl mx-auto px-5 sm:px-10 md:px-20 lg:px-50">
        <h3 className='bricolage-grotesque font-extrabold text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] text-center text-[#080C14] pb-3 sm:pb-4 lg:pb-5'>
          {storiesData.section.title}
        </h3>
        <p className='bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] mx-auto max-w-200 text-center text-[#515151] pb-8 sm:pb-10 lg:pb-15'>
          {storiesData.section.description}
        </p>
      </div>

      {/* Full Width Scrollable Container with Hidden Scrollbar */}
      <div
        ref={scrollContainerRef}
        className={`
          flex overflow-x-auto gap-5 sm:gap-8 lg:gap-10 px-5 sm:px-10 md:px-20 lg:px-50 scroll-smooth w-full
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          hide-scrollbar
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {storiesData.stories.map((story) => (
          <div
            key={story.id}
            className='bg-[#FFFFFF] p-4 sm:p-5 lg:p-7.5 w-70 sm:w-[320px] md:w-100 lg:w-137.5 rounded-xl shrink-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            <img
              src={story.image}
              alt={story.title}
              className='h-48 sm:h-56 md:h-72 lg:h-86.75 rounded-2xl mx-auto object-cover w-full'
            />
            <div className='p-3 sm:p-4 lg:p-5'>
              <label className='text-[#009BE2] font-400 text-[12px] sm:text-[14px] lg:text-[16px] pb-1 sm:pb-2 block'>
                {story.date}
              </label>
              <h3 className='text-[#080C14] font-600 text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] leading-snug mb-3 sm:mb-4 lg:mb-5 line-clamp-2'>
                {story.title}
              </h3>
              <p className="bricolage-grotesque font-400 text-[14px] sm:text-[16px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-4 sm:line-clamp-5 mb-3 sm:mb-4 lg:mb-5">
                {story.description}
              </p>
              <button className="bricolage-grotesque text-[#009BE2] font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-2 sm:gap-3 group hover:text-[#009BE2]/70 transition-all duration-300 whitespace-nowrap">
                Read More
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Scroll hint indicator (subtle gradient on edges) - Hidden on mobile for better UX */}
      <div className="relative mt-5 pointer-events-none hidden md:block">
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 lg:w-12 bg-linear-to-r from-[#F5F5F5] to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 lg:w-12 bg-linear-to-l from-[#F5F5F5] to-transparent"></div>
      </div>

      {/* Add this style tag to hide scrollbar globally for this component */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default StoriesSection;