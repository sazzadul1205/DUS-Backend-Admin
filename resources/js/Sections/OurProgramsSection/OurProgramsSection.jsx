// js/Sections/OurProgramsSection/OurProgramsSection.jsx

// React
import React, { useRef, useEffect, useState } from "react";

// Arrow Icon
import ArrowIcon from "../../components/Shared/ArrowIcon";

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// Generate placeholder image URL
const getPlaceholderImage = (width = 800, height = 600, text = 'Program') => {
  return `https://via.placeholder.com/${width}x${height}/009BE2/FFFFFF?text=${encodeURIComponent(text)}`;
};

// ============================================
// DEFAULT SECTION DATA
// ============================================
const DEFAULT_SECTION = {
  title: 'Our Programs',
  description: 'Explore our impactful programs that are transforming lives in coastal communities',
  button: {
    text: 'View All Programs',
    link: '/projects-programs'
  }
};

/**
 * OurProgramsSection Component
 * 
 * @param {Object} props
 * @param {Array|Object} props.data - Our Programs data from API (from DynamicSectionRenderer)
 * @param {Object} props.programsData - Our Programs data from API (direct prop)
 * @param {number} props.limit - Number of programs to display (optional)
 * @param {boolean} props.showFeatured - Only show featured programs (optional)
 * @param {boolean} props.showHeader - Show/hide the header section (optional, defaults to true)
 * @param {string} props.bgColor - Background color (optional)
 * @param {string} props.paddingY - Vertical padding classes
 * @param {string} props.paddingX - Horizontal padding classes
 * @param {string} props.sectionClassName - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered our programs section
 */
const OurProgramsSection = ({
  data,           // From DynamicSectionRenderer
  programsData,   // Direct prop (legacy support)
  limit,          // Custom prop: limit number of programs to show
  showFeatured,   // Custom prop: only show featured programs
  showHeader = true, // NEW: Show/hide header (defaults to true)
  bgColor = 'bg-white',
  paddingY = 'py-12 sm:py-16 lg:py-20',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  sectionClassName = '',
}) => {
  // ============================================
  // HOOKS - Must be called unconditionally at the top
  // ============================================
  const [visibleCards, setVisibleCards] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const cardsRef = useRef([]);

  // ============================================
  // EFFECT: Handle card visibility - Must be before any conditional returns
  // ============================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = parseInt(entry.target.getAttribute("data-id"));

          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(cardId)) {
                return [...prev, cardId];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []); // Empty dependency array - runs once on mount

  // ============================================
  // RESOLVE DATA - After hooks
  // ============================================
  let resolvedData = data || programsData;

  // ============================================
  // EARLY RETURN - No data (after hooks)
  // ============================================
  if (!hasValue(resolvedData)) {
    return null;
  }

  // ============================================
  // NORMALIZE DATA STRUCTURE
  // ============================================
  if (resolvedData.data && typeof resolvedData.data === 'object') {
    resolvedData = resolvedData.data;
  }

  // ============================================
  // HANDLE DIFFERENT DATA STRUCTURES
  // ============================================
  let programs = [];
  let section = {};

  if (Array.isArray(resolvedData)) {
    programs = resolvedData;
    section = { ...DEFAULT_SECTION };
  } else if (resolvedData.programs && Array.isArray(resolvedData.programs)) {
    programs = resolvedData.programs;
    section = { ...DEFAULT_SECTION, ...(resolvedData.section || {}) };
  } else {
    const arrayKeys = Object.keys(resolvedData).filter(key => Array.isArray(resolvedData[key]));
    if (arrayKeys.length > 0) {
      programs = resolvedData[arrayKeys[0]];
      section = { ...DEFAULT_SECTION, ...(resolvedData.section || {}) };
    } else {
      section = { ...DEFAULT_SECTION };
    }
  }

  // ============================================
  // APPLY FILTERS (limit, showFeatured)
  // ============================================
  let filteredPrograms = [...programs];

  if (showFeatured === true || showFeatured === 'true') {
    filteredPrograms = filteredPrograms.filter(program => program.is_featured === true || program.is_featured === 1);
  }

  if (limit && parseInt(limit) > 0) {
    const limitNum = parseInt(limit);
    filteredPrograms = filteredPrograms.slice(0, limitNum);
  }

  // ============================================
  // FUNCTION: Strip HTML tags and get plain text
  // ============================================
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // ============================================
  // FUNCTION: Truncate HTML content to ~9 lines
  // ============================================
  const truncateHtml = (html, maxLines = 9) => {
    if (!html) return '';

    const plainText = stripHtmlTags(html);
    const words = plainText.split(' ');
    const wordsPerLine = 20;
    const maxWords = maxLines * wordsPerLine;

    if (words.length <= maxWords) {
      return html;
    }

    let truncatedText = words.slice(0, maxWords).join(' ');
    truncatedText = `${truncatedText}...`;

    return `<p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">${truncatedText}</p>`;
  };

  // ============================================
  // IMAGE HANDLING
  // ============================================
  const handleImageError = (programId) => {
    setImageErrors(prev => ({ ...prev, [programId]: true }));
  };

  const getImageSrc = (program) => {
    if (imageErrors[program.id]) {
      return getPlaceholderImage(800, 600, program.title || 'Program');
    }
    if (hasValue(program.image)) {
      return program.image;
    }
    return getPlaceholderImage(800, 600, program.title || 'Program');
  };

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasTitle = hasValue(section.title);
  const hasDescription = hasValue(section.description);
  const hasButton = hasValue(section.button?.text);

  // Use showHeader prop to control header visibility
  // If showHeader is explicitly set to false, hide it
  // Otherwise, show it if there's content
  const shouldShowHeader = showHeader && (hasTitle || hasDescription || hasButton);
  const hasPrograms = hasValue(filteredPrograms);

  if (!shouldShowHeader && !hasPrograms) {
    return null;
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id="our-programs"
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      {/* Header - Controlled by showHeader prop */}
      {shouldShowHeader && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 sm:pb-10 lg:pb-15 gap-5">
          {(hasTitle || hasDescription) && (
            <div className="max-w-250">
              {hasTitle && (
                <h1 className="bricolage-grotesque font-700 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-[#080C14] pb-3 sm:pb-4 lg:pb-5">
                  {section.title}
                </h1>
              )}
              {hasDescription && (
                <p className="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#515151]">
                  {section.description}
                </p>
              )}
            </div>
          )}
          {hasButton && (
            <button
              onClick={() => {
                if (section.button?.link) {
                  window.location.href = section.button.link;
                }
              }}
              className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-5 sm:px-6 lg:px-7.5 py-3 sm:py-4 lg:py-5 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {section.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          )}
        </div>
      )}

      {/* Programs */}
      {hasPrograms && (
        <>
          <div
            className={`relative ${shouldShowHeader ? "mt-16 sm:mt-24 lg:mt-32" : ""}`}
            style={{
              height: `${filteredPrograms.length * 100}vh`,
            }}
          >
            {filteredPrograms.map((program, index) => {
              if (!hasValue(program) && !program.title && !program.description) {
                return null;
              }

              const descriptionHtml = program.full_content_html || program.description || '';
              const truncatedDescription = truncateHtml(descriptionHtml, 9);

              return (
                <div
                  key={program.id || index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  data-id={program.id || index}
                  className={`
                    sticky top-25 w-full
                    transition-all duration-700 ease-out
                    ${visibleCards.includes(program.id || index)
                      ? "translate-y-0"
                      : "translate-y-16"
                    }
                  `}
                  style={{
                    zIndex: index + 1,
                  }}
                >
                  <div
                    className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-25 p-5 sm:p-6 md:p-8 lg:p-25 rounded-3xl min-h-162.5 lg:h-187.5 shadow-lg"
                    style={{ backgroundColor: program.bg_color || '#ffffff' }}
                  >
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      {hasValue(program.title) && (
                        <h3 className="bricolage-grotesque font-600 text-[24px] sm:text-[28px] md:text-[36px] lg:text-[46px] text-[#080C14] leading-tight mb-5">
                          {program.title.split("<br />").map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              {idx !== program.title.split("<br />").length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </h3>
                      )}
                      {hasValue(descriptionHtml) && (
                        <div
                          className="bricolage-grotesque font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-9"
                          dangerouslySetInnerHTML={{ __html: truncatedDescription }}
                        />
                      )}
                      {hasValue(program.link) && (
                        <button
                          onClick={() => window.location.href = program.link}
                          className="mt-6 bricolage-grotesque flex items-center gap-2 font-500 lg:font-600 text-[16px] sm:text-[17px] lg:text-[20px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300 w-fit"
                        >
                          Read more
                          <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </button>
                      )}
                    </div>

                    {/* Right Image */}
                    <div className="w-full lg:w-1/2">
                      <img
                        src={getImageSrc(program)}
                        alt={program.title || "Program image"}
                        className="w-full h-75 sm:h-100 lg:h-150 object-cover rounded-3xl hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(program.id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-50" />
        </>
      )}
    </section>
  );
};

export default OurProgramsSection;