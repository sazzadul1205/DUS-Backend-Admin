// js/Sections/ContactOfficeSection/ContactOfficeSection.jsx

// React
import React from 'react';

// Icons
import { FaGraduationCap, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

// Utility function to check if value exists (SAME as other sections)
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const ContactOfficeSection = ({
  offices,
  title = "Our Offices",
  orgName = "Dwip Unnayan Songstha (DUS)",
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-14 lg:py-37.5',
  paddingX = 'px-4 sm:px-6 lg:px-50',
  sectionClassName = '',
  sectionId = 'contact-offices',
}) => {
  // Early return if no data
  if (!hasValue(offices) || offices.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className={`${bgColor} ${sectionClassName}`}
    >
      <div className={`mx-auto ${paddingX} ${paddingY}`}>
        {/* Section Title */}
        {hasValue(title) && (
          <h2 className="text-[#1D2566] font-bold text-[28px] sm:text-[32px] lg:text-[36px] leading-tight pb-6 sm:pb-8 lg:pb-12.5 text-center sm:text-left">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {offices.map((office, index) => (
            <div
              key={office.title || index}
              className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 md:p-10 lg:p-12.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <FaGraduationCap className="text-4xl text-[#009BE2]" />

              {/* Office Title */}
              {hasValue(office.title) && (
                <h3 className="text-[22px] sm:text-[24px] font-bold text-[#080C14] pt-5">
                  {office.title}
                </h3>
              )}

              <div className="space-y-2 text-[14px] sm:text-[15px] leading-relaxed text-[#444] mt-3">
                {/* Organization Name */}
                {hasValue(orgName) && (
                  <p className="font-semibold text-[#333333]">{orgName}</p>
                )}

                {/* Address */}
                {hasValue(office.address) && (
                  <p className="flex gap-2">
                    <span className="font-semibold text-[#333333] shrink-0">Address:</span>
                    <span>{office.address}</span>
                  </p>
                )}

                {/* Phone Numbers */}
                {hasValue(office.phones) && (
                  <p className="flex gap-2 flex-wrap">
                    <span className="font-semibold text-[#333333] shrink-0">Phone:</span>
                    <span>{office.phones}</span>
                  </p>
                )}

                {/* Emails */}
                {hasValue(office.emails) && office.emails.length > 0 && (
                  <p className="flex gap-2 flex-wrap">
                    <span className="font-semibold text-[#333333] shrink-0">E-mail:</span>
                    <span>
                      {office.emails.map((email, idx) => (
                        <span key={idx}>
                          {idx > 0 && <span>, </span>}
                          <a
                            href={`mailto:${email}`}
                            className="text-[#444] hover:text-[#009BE2] transition-colors"
                          >
                            {email}
                          </a>
                        </span>
                      ))}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOfficeSection;