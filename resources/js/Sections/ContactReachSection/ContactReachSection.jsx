// js/Sections/ContactReachSection/ContactReachSection.jsx

// React
import React from 'react';

// Components
import ArrowIcon from '../../components/Shared/ArrowIcon';

// Utility function to check if value exists (SAME as other sections)
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const ContactReachSection = ({
  image,
  title = "Reach out to us today!",
  buttonText = "Submit Message",
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-10 sm:py-20 lg:py-37.5',
  paddingX = 'px-6 sm:px-10 md:px-16 lg:px-20 xl:px-50',
  sectionClassName = '',
  sectionId = 'contact-reach',
}) => {
  const inputClassName =
    'mt-2 w-full rounded-xl border border-[#D6DCEF] bg-white px-5 py-4 text-[16px] text-[#080C14] outline-none transition-colors placeholder:text-[#A6B0D1] focus:border-[#009BE2]';

  // Early return if no image (optional - you might want to render form even without image)
  if (!hasValue(image)) {
    // Still render the form, just without the image
    console.warn('ContactReachSection: No image provided');
  }

  return (
    <section
      id={sectionId}
      className={`flex flex-col lg:flex-row justify-center items-stretch ${bgColor} ${sectionClassName}`}
    >
      {/* Left Image Section - Full height on desktop */}
      <div className='w-full lg:w-1/2 relative'>
        {hasValue(image) && (
          <>
            <img
              src={image}
              alt='Contact Reach'
              className='w-full h-full object-cover lg:max-h-none max-h-100'
            />
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-linear-to-b from-[#1500FF] via-[#6F07E5] to-[#F10A0A] opacity-50' />
          </>
        )}
      </div>

      {/* Right Section */}
      <div className={`w-full lg:w-1/2 ${paddingX} ${paddingY}`}>
        {hasValue(title) && (
          <h3 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center lg:text-left'>
            {title}
          </h3>
        )}

        <form className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">First Name</span>
              <input type="text" name="first_name" placeholder="First Name" className={inputClassName} />
            </label>

            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Last Name</span>
              <input type="text" name="last_name" placeholder="Last Name" className={inputClassName} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Work Email</span>
              <input type="email" name="email" placeholder="name@company.com" className={inputClassName} />
            </label>

            <label className="block">
              <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Phone Number</span>
              <input type="tel" name="phone" placeholder="+ (country code) number" className={inputClassName} />
            </label>
          </div>

          <label className="block">
            <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Subject</span>
            <input type="text" name="subject" placeholder="Subject" className={inputClassName} />
          </label>

          <label className="block">
            <span className="block text-[16px] sm:text-[18px] font-semibold text-[#080C14]">Your Message</span>
            <textarea
              name="message"
              placeholder="Enter Your Message"
              rows={8}
              className={`${inputClassName} min-h-50 sm:min-h-52.5 resize-none`}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0999DC] px-6 py-4 sm:py-5 text-[16px] sm:text-[18px] font-semibold text-white transition-colors hover:bg-[#0789C6] flex items-center justify-center gap-2"
          >
            <span>{buttonText}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactReachSection;