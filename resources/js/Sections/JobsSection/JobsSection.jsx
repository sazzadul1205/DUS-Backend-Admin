// js/Sections/JobsSection/JobsSection.jsx

// React
import React, { useState } from 'react';

// React Icons
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuBriefcaseBusiness, LuClock4 } from "react-icons/lu";

// Arrow Icon
import ArrowIcon from '../../components/Shared/ArrowIcon';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const JobsSection = ({
  jobsData,
  bgColor = 'bg-[#F5F5F5]',
  paddingY = 'py-12 sm:py-16 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-75',
  sectionClassName = '',
  maxJobs = 5, // Maximum number of jobs to display
}) => {
  // ============================================
  // HOOKS - Must be called before any conditional returns
  // ============================================
  const [selectedFilter, setSelectedFilter] = useState("");

  // ============================================
  // DATA VALIDATION
  // ============================================
  // Early return if no data
  if (!hasValue(jobsData)) return null;

  // Safe destructuring with defaults
  const { section = {}, filter = {}, jobs = [] } = jobsData;

  // Check if there's any content to display
  const hasTitle = hasValue(section.title);
  const hasDescription = hasValue(section.description);
  const hasFilterOptions = hasValue(filter.options);
  const hasJobs = hasValue(jobs);

  const hasAnyContent = hasTitle || hasDescription || hasFilterOptions || hasJobs;

  if (!hasAnyContent) return null;

  // ============================================
  // FILTER HANDLING
  // ============================================
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Filtered Jobs
  const filteredJobs = selectedFilter === "" || selectedFilter === "all"
    ? jobs
    : jobs.filter(job => job.type?.toLowerCase().replace(" ", "-") === selectedFilter);

  // Limit to maxJobs (5 by default)
  const displayedJobs = filteredJobs.slice(0, maxJobs);
  const hasMoreJobs = filteredJobs.length > maxJobs;

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id='jobs'
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* Header Section */}
      {(hasTitle || hasDescription || hasFilterOptions) && (
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 flex-wrap gap-5'>

          {/* Left - Title and Description */}
          {(hasTitle || hasDescription) && (
            <div>
              {/* Title */}
              {hasTitle && (
                <h1 className='text-[#080C14] font-800 text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] mb-3 sm:mb-4 lg:mb-5'>
                  {section.title}
                </h1>
              )}

              {/* Description */}
              {hasDescription && (
                <p className='text-[#515151] font-400 text-[16px] sm:text-[18px] lg:text-[20px]'>
                  {section.description}
                </p>
              )}
            </div>
          )}

          {/* Filter Dropdown */}
          {hasFilterOptions && (
            <div className="relative w-full lg:min-w-80 lg:w-auto">
              <select
                name="browseBy"
                id="browseBy"
                value={selectedFilter}
                onChange={handleFilterChange}
                className="w-full appearance-none border border-[#A3A3A3] rounded-[14px] bg-[#F5F5F5] px-5 sm:px-6 py-3 sm:py-4 pr-10 sm:pr-12 text-[14px] sm:text-[16px] font-600 text-[#515151] outline-none focus:border-[#009BE2] focus:ring-1 focus:ring-[#009BE2] cursor-pointer transition-all duration-300"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-3 sm:right-5 top-1/2 -translate-y-1/2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#979797]"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Jobs List */}
      {hasJobs && (
        <div className='space-y-4 sm:space-y-5 lg:space-y-6'>
          {displayedJobs.map((job) => (
            <div key={job.id} className='bg-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl hover:shadow-lg transition-all duration-300'>
              <div className='flex flex-col md:flex-row items-start justify-between gap-5'>
                <div className='flex-1 w-full'>

                  {/* Job Meta Info (Type, Department, Location) */}
                  {(hasValue(job.type) || hasValue(job.department) || hasValue(job.location)) && (
                    <div className='flex items-center gap-2 sm:gap-3 text-[#524B48] text-[12px] sm:text-[14px] font-400 uppercase mb-3 flex-wrap'>

                      {/* Job Type */}
                      {hasValue(job.type) && (
                        <>
                          <p className='flex items-center gap-1 sm:gap-1.5'>
                            <LuClock4 className="text-[12px] sm:text-[14px]" />
                            {job.type}
                          </p>
                          {(hasValue(job.department) || hasValue(job.location)) && (
                            <span className='w-1 h-px bg-[#524B48] block' />
                          )}
                        </>
                      )}

                      {/* Department */}
                      {hasValue(job.department) && (
                        <>
                          <p className='flex items-center gap-1 sm:gap-1.5'>
                            <LuBriefcaseBusiness className="text-[12px] sm:text-[14px]" />
                            {job.department}
                          </p>
                          {hasValue(job.location) && (
                            <span className='w-1 h-px bg-[#524B48] block' />
                          )}
                        </>
                      )}

                      {/* Location */}
                      {hasValue(job.location) && (
                        <p className='flex items-center gap-1 sm:gap-1.5'>
                          <HiOutlineLocationMarker className="text-[12px] sm:text-[14px]" />
                          {job.location}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Job Title */}
                  {hasValue(job.title) && (
                    <h3 className='text-[#080C14] text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32px] font-600 mb-2 sm:mb-3 leading-tight'>
                      {job.title}
                    </h3>
                  )}

                  {/* Job Description */}
                  {hasValue(job.description) && (
                    <p className='text-[#524B48] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-400 leading-relaxed'>
                      {job.description}
                    </p>
                  )}
                </div>

                {/* Apply Button */}
                <div className='w-full md:w-auto mt-4 md:mt-0'>
                  <button
                    onClick={() => {
                      if (job.link) {
                        window.location.href = job.link;
                      }
                    }}
                    className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-3.5 lg:py-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center justify-center gap-2 sm:gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap w-full md:w-auto"
                  >
                    Apply Now
                    <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Show "View All" button if there are more jobs */}
          {hasMoreJobs && (
            <div className='text-center pt-4'>
              <button
                className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-6 sm:px-8 py-3 sm:py-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center justify-center gap-2 group hover:bg-[#009BE2] hover:text-white transition-all duration-300"
              >
                View All Jobs ({filteredJobs.length})
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          )}

          {/* No Jobs Message */}
          {filteredJobs.length === 0 && (
            <div className='bg-white p-8 sm:p-10 lg:p-12 rounded-2xl text-center'>
              <p className='text-[#515151] text-[16px] sm:text-[17px] lg:text-[18px] font-400'>
                No jobs found for the selected filter.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default JobsSection;