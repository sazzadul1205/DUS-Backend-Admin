import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const Banner = () => {
  return (
    <div className="relative w-full h-250 overflow-hidden">

      {/* Background Image */}
      <img
        src="/storage/uploads/banners/Background.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Left Dark Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/10 to-transparent"></div>

      {/* Content */}
      <div className="absolute left-24 inset-0 flex items-center p-12.5">
        <div className="max-w-215.75 px-20 md:px-20 text-white space-y-5">

          <p className="bricolage-grotesque uppercase tracking-[4px] text-[30px] font-semibold text-white">
            Together, We Create Impact
          </p>

          <h1 className="bricolage-grotesque text-[100px] font-bold leading-tight w-215.75 ">
            Be the Light for Someone in Need
          </h1>

          <p className="bricolage-grotesque font-normal text-[30px] text-white leading-tight w-215.75 ">
            Your kindness has the power to change lives. Join us in <br /> bringing hope,
            support, and brighter futures to those in need. Every donation makes a difference big or small.
          </p>

          <div className='flex items-center gap-6 pt-7.5'>
            <button className='capitalize font-600 text-[18px] px-7.5 py-5 bricolage-grotesque rounded-md bg-[#009BE2] text-white inline-flex items-center gap-3 group hover:bg-[#009BE2]/90 transition-all duration-300'>
              <span>Become a Volunteer</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <g clipPath="url(#clip0_96_3528)">
                  <mask id="mask0_96_3528" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <path d="M20 0H0V20H20V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_96_3528)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4136 4.00538C12.7972 5.62172 9.79026 5.56102 8.10588 3.87664L7.41528 3.18604L6.08932 4.512L6.77993 5.2026C8.00505 6.42773 9.67002 7.06109 11.3234 7.09552L3.14294 15.276L4.52415 16.6572L12.7047 8.47673C12.7391 10.1301 13.3724 11.7951 14.5976 13.0202L15.2882 13.7108L16.6141 12.3849L15.9235 11.6943C14.2391 10.0099 14.1785 7.00292 15.7948 5.38658L16.4578 4.7236L15.0766 3.3424L14.4136 4.00538Z" fill="currentColor" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_96_3528">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
 
            <button className='capitalize font-600 text-[18px] px-7.5 py-5 bricolage-grotesque rounded-md bg-white text-black inline-flex items-center gap-3 group hover:bg-gray-50 transition-all duration-300'>
              <span>How can I help?</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <g clipPath="url(#clip0_96_3528)">
                  <mask id="mask0_96_3528" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <path d="M20 0H0V20H20V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_96_3528)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4136 4.00538C12.7972 5.62172 9.79026 5.56102 8.10588 3.87664L7.41528 3.18604L6.08932 4.512L6.77993 5.2026C8.00505 6.42773 9.67002 7.06109 11.3234 7.09552L3.14294 15.276L4.52415 16.6572L12.7047 8.47673C12.7391 10.1301 13.3724 11.7951 14.5976 13.0202L15.2882 13.7108L16.6141 12.3849L15.9235 11.6943C14.2391 10.0099 14.1785 7.00292 15.7948 5.38658L16.4578 4.7236L15.0766 3.3424L14.4136 4.00538Z" fill="currentColor" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_96_3528">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Banner;