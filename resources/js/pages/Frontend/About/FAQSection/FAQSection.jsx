import React, { useState } from 'react';

const FAQSection = ({ faqData }) => {

  const [openId, setOpenId] = useState(1); // First FAQ open by default

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id='faq'
      className='bg-[#F5F5F5] px-4 sm:px-6 md:px-10 lg:px-20 xl:px-50 py-10 sm:py-15 md:py-20 lg:py-37.5'
    >
      <div className='max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center'>
        <h1 className='font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight mb-3 sm:mb-4 bricolage-grotesque'>
          {faqData.section.title}
        </h1>
        <p className='text-[#333333] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed bricolage-grotesque px-2 sm:px-4'>
          {faqData.section.subtitle}
        </p>
      </div>

      <div className='mt-8 sm:mt-10 md:mt-12 lg:mt-15 space-y-2 sm:space-y-2.5 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto'>
        {faqData.faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id} className='bg-white w-full rounded-lg overflow-hidden shadow-sm transition-all duration-300'>
              <div
                className='py-4 sm:py-5 md:py-6 lg:py-7.5 px-4 sm:px-5 md:px-6 lg:px-7.5 cursor-pointer'
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className='flex items-start sm:items-center justify-between gap-3 sm:gap-4'>
                  <h3 className={`font-600 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[20px] leading-tight flex-1 transition-colors duration-300 ${isOpen ? 'text-[#009BE2]' : 'text-[#080C14]'
                    }`}>
                    {faq.question}
                  </h3>
                  <span className={`font-600 text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] leading-tight shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-0 text-[#009BE2]' : 'rotate-0 text-[#080C14]'
                    }`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* Answer with smooth animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className='px-4 sm:px-5 md:px-6 lg:px-7.5 pb-4 sm:pb-5 md:pb-6 lg:pb-7.5'>
                  <p className='text-[#333333] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-relaxed bricolage-grotesque'>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;