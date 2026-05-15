// resources/js/pages/Frontend/Home/Sections/OurPrograms.jsx
import React, { useRef, useEffect, useState } from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const OurProgramsSection = ({ programsData }) => {
  // Visible Cards
  const [visibleCards, setVisibleCards] = useState([]);

  // Intersection Observer
  const cardsRef = useRef([]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = parseInt(entry.target.getAttribute('data-id'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(cardId)) return [...prev, cardId];
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Draggable Cards
  // Adjusted sticky top for mobile to account for smaller screens
  const STICKY_TOP = { base: 120, lg: 140 };

  return (
    <section id="our-programs" className="bg-white py-12 sm:py-16 lg:py-20 px-5 sm:px-10 md:px-20 lg:px-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 gap-5">
        <div className="max-w-250">
          <h1 className="bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-[#080C14] pb-3 sm:pb-4 lg:pb-5">
            {programsData.section.title}
          </h1>
          <p className="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151]">
            {programsData.section.description}
          </p>
        </div>
        <button className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap">
          {programsData.section.button.text}
          <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </button>
      </div>

      {/* Cards with perfect stack */}
      <div className="relative min-h-screen mt-16 sm:mt-24 lg:mt-32">
        {programsData.programs.map((program, index) => (
          <div
            key={program.id}
            ref={(el) => (cardsRef.current[index] = el)}
            data-id={program.id}
            className={`
              sticky transition-all duration-700 ease-out
              ${visibleCards.includes(program.id)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16 sm:translate-y-24 lg:translate-y-32'
              }
            `}
            style={{
              top: `clamp(60px, ${STICKY_TOP.base}px, ${STICKY_TOP.lg}px)`,
              zIndex: index,
              marginBottom: 0,
            }}
          >
            <div
              className={`flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-25 items-center ${program.bgColor} p-5 sm:p-6 md:p-8 lg:p-25 rounded-2xl sm:rounded-3xl lg:rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 lg:space-y-5">
                <h3 className="bricolage-grotesque font-600 text-[24px] sm:text-[28px] md:text-[36px] lg:text-[46px] text-[#080C14] leading-tight">
                  {program.title.split("<br />").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index !== program.title.split("<br />").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="bricolage-grotesque font-400 text-[14px] sm:text-[16px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-6 sm:line-clamp-8 lg:line-clamp-9">
                  {program.description}
                </p>
                <button className="bricolage-grotesque flex items-center gap-2 font-500 lg:font-600 text-[16px] sm:text-[17px] lg:text-[20px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300">
                  Read more
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-auto lg:h-125 object-cover rounded-2xl sm:rounded-3xl lg:rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-12 sm:h-16 lg:h-20"></div>
    </section>
  );
};

export default OurProgramsSection;