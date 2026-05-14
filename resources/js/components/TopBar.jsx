import { FaFacebook, FaInstagram, FaLinkedin, FaUser } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from 'react';

const TopBar = () => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'us',
    name: 'English',
    flag: '/images/Flags/united-states.png'
  });

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  const languages = [
    { code: 'us', name: 'English', flag: '/images/Flags/united-states.png' },
    { code: 'bd', name: 'Bengali', flag: '/images/Flags/bangladesh.png' },
    { code: 'fr', name: 'French', flag: '/images/Flags/france.png' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    console.log('Selected language:', language);
    setIsLangDropdownOpen(false);
    // You can add additional logic here for language change
    // For example: change app locale, RTL support, etc.
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  return (
    <div className='flex justify-between items-center px-10 py-3 bg-[#080C14] relative'>
      {/* Left - Contact Info */}
      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-2'>
          <img src="/images/TopBar/Email.svg" alt="Email" className="w-4 h-4" />
          <p className='text-white text-sm'>dus.eddus@gmail.com</p>
        </div>

        <div className='flex items-center space-x-2'>
          <img src="/images/TopBar/Phone.svg" alt="Phone" className="w-4 h-4" />
          <p className='text-white text-sm'>+880 1761-493412</p>
        </div>

        <div className='flex items-center space-x-2'>
          <img src="/images/TopBar/Clock.svg" alt="Clock" className="w-4 h-4" />
          <p className='text-white text-sm'>Sun - Thu 9:00AM - 5:00PM</p>
        </div>
      </div>

      {/* Right - Social Media Section */}
      <div className="flex items-center gap-3 space-x-4">
        {/* Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => {
              setIsLangDropdownOpen(!isLangDropdownOpen);
              setIsUserDropdownOpen(false);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={selectedLanguage.flag} alt={selectedLanguage.name} className="w-5 h-5" />
            {isLangDropdownOpen ? <FaAngleUp className="text-white transition-transform duration-200" /> : <FaAngleDown className="text-white transition-transform duration-200" />}
          </button>

          {/* Language Dropdown Menu with Animation */}
          <div
            className={`absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg py-2 w-40 z-50 transition-all duration-300 origin-top-right
              ${isLangDropdownOpen
                ? 'opacity-100 scale-100 visible'
                : 'opacity-0 scale-95 invisible'}`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang)}
                className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors duration-150 ${selectedLanguage.code === lang.code ? 'bg-blue-50' : ''
                  }`}
              >
                <img src={lang.flag} alt={lang.name} className="w-5 h-5" />
                <span className={`text-sm ${selectedLanguage.code === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {lang.name}
                </span>
                {selectedLanguage.code === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Line */}
        <div className="w-px h-5 bg-gray-600"></div>

        {/* Expandable Search with Animation */}
        <div className="relative" ref={searchRef}>
          <div className="overflow-hidden">
            <div
              className={`transition-all duration-300 ease-in-out
                ${isSearchExpanded ? 'w-64 opacity-100' : 'w-6 opacity-100'}`}
            >
              {isSearchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-slideIn">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-1 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 px-3 py-1 rounded-r-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FiSearch className="text-white text-sm" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center hover:opacity-80 transition-opacity duration-200"
                >
                  <FiSearch className="text-xl text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Line */}
        <div className="w-px h-5 bg-gray-600"></div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
              setIsLangDropdownOpen(false);
            }}
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
          >
            <FaUser className="text-xl text-white" />
          </button>

          {/* User Dropdown Menu with Animation */}
          <div
            className={`absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg py-2 w-48 z-50 transition-all duration-300 origin-top-right
              ${isUserDropdownOpen
                ? 'opacity-100 scale-100 visible'
                : 'opacity-0 scale-95 invisible'}`}
          >
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
              Login
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
              Register
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
              My Profile
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
              My Account
            </button>
          </div>
        </div>

        {/* Vertical Line */}
        <div className="w-px h-5 bg-gray-600"></div>

        {/* Social Icons with Hover Animation */}
        <a href="#" className="text-xl text-white hover:text-blue-400 transition-all duration-200 hover:scale-110">
          <FaFacebook />
        </a>

        <a href="#" className="text-xl text-white hover:text-pink-400 transition-all duration-200 hover:scale-110">
          <FaInstagram />
        </a>

        <a href="#" className="text-xl text-white hover:text-gray-400 transition-all duration-200 hover:scale-110">
          <FaXTwitter />
        </a>

        <a href="#" className="text-xl text-white hover:text-blue-500 transition-all duration-200 hover:scale-110">
          <FaLinkedin />
        </a>
      </div>

      {/* Add custom animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TopBar;