import React, { useState } from 'react';

const ProgramImpact = () => {
  // In-page JSON data
  const impactData = {
    section: {
      title: "Program Impact and SDGs",
      mainImage: {
        images: [
          "https://placehold.co/700x745/cccccc/webp?text=Community+Radio+1",
          "https://placehold.co/700x745/bbbbbb/webp?text=Community+Radio+2",
          "https://placehold.co/700x745/aaaaaa/webp?text=Community+Radio+3",
          "https://placehold.co/700x745/dddddd/webp?text=Community+Radio+4",
        ]
      }
    },
    sdgImages: [
      { id: 1, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+1", alt: "No Poverty" },
      { id: 2, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+2", alt: "Zero Hunger" },
      { id: 3, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+3", alt: "Good Health" },
      { id: 4, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+4", alt: "Quality Education" },
      { id: 5, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+5", alt: "Gender Equality" },
      { id: 6, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+6", alt: "Clean Water" },
      { id: 7, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+7", alt: "Clean Energy" },
      { id: 8, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+8", alt: "Decent Work" },
      { id: 9, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+9", alt: "Industry Innovation" },
      { id: 10, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+10", alt: "Reduced Inequalities" },
      { id: 11, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+11", alt: "Sustainable Cities" },
      { id: 12, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+12", alt: "Responsible Consumption" },
      { id: 13, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+13", alt: "Climate Action" },
      { id: 14, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+14", alt: "Life Below Water" },
      { id: 15, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+15", alt: "Life On Land" },
      { id: 16, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+16", alt: "Peace Justice" },
      { id: 17, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+17", alt: "Partnerships" },
      { id: 18, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+18", alt: "SDG 18" }
    ]
  };

  const [index, setIndex] = useState(0);

  const goToSlide = (i) => {
    setIndex(i);
  };

  return (
    <div className='bg-white py-37.5 px-75'>
      {/* Main Image Carousel */}
      <div className="w-full flex flex-col items-center pb-15">
        <div className="w-full">
          <div className="relative overflow-hidden rounded-2xl group">
            <img
              src={impactData.section.mainImage.images[index]}
              alt={`Program impact slide ${index + 1}`}
              className="w-full h-186.25 object-cover transition-all duration-500 group-hover:scale-105"
            />

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {impactData.section.mainImage.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${i === index
                      ? "w-8 h-2 bg-white"
                      : "w-2.5 h-2 bg-white/50 hover:bg-white/70"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className='text-[#080C14] text-[24px] font-600 mb-6'>
        {impactData.section.title}
      </h1>

      {/* SDG Images Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5'>
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

export default ProgramImpact;