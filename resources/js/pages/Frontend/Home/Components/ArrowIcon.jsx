// js/pages/Frontend/Home/Components/ArrowIcon.jsx

import React from 'react';

const ArrowIcon = ({ className, width = 20, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_96_3528)">
      <mask id="mask0_96_3528" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <path d="M20 0H0V20H20V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_96_3528)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.4136 4.00538C12.7972 5.62172 9.79026 5.56102 8.10588 3.87664L7.41528 3.18604L6.08932 4.512L6.77993 5.2026C8.00505 6.42773 9.67002 7.06109 11.3234 7.09552L3.14294 15.276L4.52415 16.6572L12.7047 8.47673C12.7391 10.1301 13.3724 11.7951 14.5976 13.0202L15.2882 13.7108L16.6141 12.3849L15.9235 11.6943C14.2391 10.0099 14.1785 7.00292 15.7948 5.38658L16.4578 4.7236L15.0766 3.3424L14.4136 4.00538Z"
          fill="currentColor"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_96_3528">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default ArrowIcon;