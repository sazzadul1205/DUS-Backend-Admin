// pages/About/CardsSection/CardsSection.jsx

// React
import React from 'react';

// Components
import ArrowIcon from '../../../../components/Shared/ArrowIcon';

const CardsSection = ({ cardsData }) => {
  return (
    <section
      id="cards" 
      className='flex flex-col lg:flex-row justify-between bg-white gap-8 lg:gap-25 px-5 sm:px-10 md:px-20 lg:px-50 py-10 sm:py-15 md:py-25 lg:py-37.5'
    >
      {cardsData.cards.map((card) => (
        <div key={card.id} className='w-full lg:w-1/2 flex'>
          <div className={`${card.bgColor} w-full rounded-2xl px-17 py-12.5 flex flex-col`}>
            {/* Image Container with fixed height and centering */}
            <div className='flex items-center justify-center min-h-75 md:min-h-100 lg:min-h-110'>
              <img
                src={card.image.src}
                alt={card.image.alt}
                className={`${card.image.className} max-w-full max-h-full object-contain`}
              />
            </div>

            {/* Bottom Card - Always at bottom with consistent height */}
            <div className={`${card.cardBgColor} w-full rounded-2xl p-12.5 mt-7.5 flex flex-col justify-between min-h-62.5`}>
              <h1 className='font-700 text-[32px] sm:text-[36px] lg:text-[40px] leading-tight'>
                {card.title}
              </h1>

              <div className='pt-4'>
                <button
                  onClick={() => window.location.href = card.buttonLink}
                  className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
                >
                  <span>{card.buttonText}</span>
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CardsSection;