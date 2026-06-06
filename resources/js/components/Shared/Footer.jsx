// resources/js/components/Footer.jsx

// React
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

// Icons
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

// Map icon names to components
const iconMap = {
  FaFacebook: FaFacebook,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
  FaXTwitter: FaXTwitter
};

const Footer = ({ footerData, storageUrl }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState({
    quickLinks: false,
    programs: false
  });

  // Handle form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual API endpoint if provided
    const apiEndpoint = footerData.newsletter.apiEndpoint || '/api/subscribe-newsletter';

    try {
      // Simulate API call
      setTimeout(() => {
        setSubmitMessage('Successfully subscribed!');
        setEmail('');
        setIsSubmitting(false);
        setTimeout(() => setSubmitMessage(''), 3000);
      }, 1000);
    } catch (error) {
      setSubmitMessage('Subscription failed. Please try again.');
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  // Split programs into two columns
  const itemsPerColumn = Math.ceil(footerData.programs.length / 2);
  const firstProgramColumn = footerData.programs.slice(0, itemsPerColumn);
  const secondProgramColumn = footerData.programs.slice(itemsPerColumn);

  const toggleMobileSection = (section) => {
    setIsMobileMenuOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div>
      <footer className='bg-[#080C14] rounded-t-2xl lg:rounded-t-4xl pb-25' role="contentinfo">
        <div className='mx-auto flex flex-col lg:flex-row px-5 lg:px-50 pt-10 lg:pt-37.5 gap-8 lg:gap-50'>

          {/* Left Section */}
          <div className='w-full lg:w-1/3'>
            {/* Footer Logo */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={footerData.logo.src}
                alt={footerData.logo.alt}
                className={footerData.logo.className}
                loading="lazy"
              />
            </div>

            {/* Footer Description */}
            <p className='pt-5 text-center lg:text-left text-xs lg:text-sm leading-relaxed text-gray-300 px-4 lg:px-0'>
              {footerData.description}
            </p>

            {/* Social Media Icons */}
            <div className='pt-5 flex justify-center lg:justify-start gap-3 lg:gap-5' aria-label="Social media links">
              {footerData.socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.iconName];
                if (!IconComponent) return null;
                return (
                  <div
                    key={index}
                    className='border border-white rounded-full p-2 transition-transform duration-200 hover:scale-110 hover:border-[#009BE2]'
                  >
                    <a
                      href={social.url}
                      className={`text-xl lg:text-2xl text-white ${social.hoverColor} transition-colors duration-200`}
                      aria-label={social.ariaLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Address & Contact Info */}
            <div className='max-w-full lg:max-w-125 pt-5 space-y-4 text-center lg:text-left'>
              <div>
                <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                  {footerData.address.title}
                </h2>
                <address className="not-italic text-gray-300 text-xs lg:text-sm leading-relaxed">
                  {footerData.address.details}
                </address>
              </div>

              <div>
                <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                  {footerData.contact.title}
                </h2>
                {footerData.contact.numbers.map((number, index) => (
                  <a
                    key={index}
                    href={`tel:${number.replace(/\D/g, '')}`}
                    className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm mb-1"
                  >
                    {number}
                  </a>
                ))}
              </div>

              <div>
                <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                  {footerData.email.title}
                </h2>
                {footerData.email.addresses.map((emailAddr, index) => (
                  <a
                    key={index}
                    href={`mailto:${emailAddr}`}
                    className="block text-gray-300 hover:text-white transition-colors break-all text-xs lg:text-sm mb-1"
                  >
                    {emailAddr}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className='w-full lg:w-2/3'>
            {/* Desktop Grid - Hidden on mobile */}
            <div className='hidden md:grid md:grid-cols-3 gap-8'>
              {/* Quick Links */}
              <div>
                <h2 className='text-white text-xl lg:text-[22px] font-bold mb-5'>Quick Links</h2>
                <ul className='space-y-3'>
                  {footerData.quickLinks.map((link, index) => (
                    <li key={index} className='flex items-center group'>
                      <img
                        src={`${storageUrl}/images/link.svg`}
                        alt=""
                        className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                        aria-hidden="true"
                      />
                      <Link
                        href={link.url}
                        className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Programs - Column 1 */}
              <div>
                <h2 className='text-white text-xl lg:text-[22px] font-bold mb-5'>Our Programs</h2>
                <ul className='space-y-3'>
                  {firstProgramColumn.map((program, index) => (
                    <li key={index} className='flex items-center group'>
                      <img
                        src={`${storageUrl}/images/link.svg`}
                        alt=""
                        className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                        aria-hidden="true"
                      />
                      <Link
                        href={program.url}
                        className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                      >
                        {program.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Programs - Column 2 */}
              <div>
                <h2 className='text-xl lg:text-[22px] font-bold mb-5 opacity-0 pointer-events-none invisible'>
                  Our Programs
                </h2>
                <ul className='space-y-3'>
                  {secondProgramColumn.map((program, index) => (
                    <li key={index} className='flex items-center group'>
                      <img
                        src={`${storageUrl}/images/link.svg`}
                        alt=""
                        className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                        aria-hidden="true"
                      />
                      <Link
                        href={program.url}
                        className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                      >
                        {program.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Accordion Menu - Visible only on mobile */}
            <div className='md:hidden space-y-4'>
              {/* Quick Links Accordion */}
              <div className="border-b border-gray-700">
                <button
                  onClick={() => toggleMobileSection('quickLinks')}
                  className="flex justify-between items-center w-full py-4 text-white font-bold text-lg"
                >
                  Quick Links
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen.quickLinks ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen.quickLinks ? 'max-h-96 mb-4' : 'max-h-0'}`}>
                  <ul className='space-y-3'>
                    {footerData.quickLinks.map((link, index) => (
                      <li key={index} className='flex items-center group'>
                        <img
                          src={`${storageUrl}/images/link.svg`}
                          alt=""
                          className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                          aria-hidden="true"
                        />
                        <Link
                          href={link.url}
                          className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Programs Accordion */}
              <div className="border-b border-gray-700">
                <button
                  onClick={() => toggleMobileSection('programs')}
                  className="flex justify-between items-center w-full py-4 text-white font-bold text-lg"
                >
                  Our Programs
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen.programs ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen.programs ? 'max-h-96 mb-4' : 'max-h-0'}`}>
                  <ul className='space-y-3'>
                    {footerData.programs.map((program, index) => (
                      <li key={index} className='flex items-center group'>
                        <img
                          src={`${storageUrl}/images/link.svg`}
                          alt=""
                          className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                          aria-hidden="true"
                        />
                        <Link
                          href={program.url}
                          className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                        >
                          {program.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className='pt-10 mt-5 border-t border-gray-700'>
              <h2 className='text-xl lg:text-[28px] font-bold text-white text-center lg:text-left'>
                {footerData.newsletter.title}
              </h2>

              <form onSubmit={handleSubscribe} className='space-y-3 pt-5'>
                <label htmlFor="email" className="text-gray-300 text-sm block text-center lg:text-left">
                  Email Address
                </label>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2'>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={footerData.newsletter.placeholder}
                    className="flex-1 py-3 px-4 bg-[#080C14] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009BE2] focus:border-transparent transition-all text-white placeholder:text-gray-500 text-sm lg:text-base"
                    required
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className='bg-[#009BE2] hover:bg-[#009BE2]/80 disabled:bg-[#009BE2]/50 disabled:cursor-not-allowed px-6 py-3 rounded-md font-semibold text-white transition-all duration-200 text-sm lg:text-base'
                  >
                    {isSubmitting ? 'Subscribing...' : footerData.newsletter.buttonText}
                  </button>
                </div>
                {submitMessage && (
                  <p className={`text-sm mt-2 text-center lg:text-left ${submitMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
      <footer className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#080C14] border-t border-[#090C40] px-5 lg:px-50 py-6'>
        <p className='text-white text-[12px] lg:text-[14px] font-400 text-center sm:text-left'>
          {footerData.bottomFooter.copyright}
        </p>
        <ul className='flex flex-wrap justify-center gap-4 lg:gap-8 text-white text-[12px] lg:text-[14px] font-400'>
          {footerData.bottomFooter.links.map((link, index) => (
            <li
              key={index}
              className='hover:text-[#009BE2] cursor-pointer transition-colors duration-200'
            >
              <a href={link.url}>{link.text}</a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
};

export default Footer;