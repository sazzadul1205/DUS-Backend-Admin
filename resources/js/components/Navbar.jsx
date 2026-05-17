// resources/js/components/Navbar.jsx

// React
import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

// Icons
import { Menu, X, Briefcase, ChevronDown } from 'lucide-react';

const Navbar = ({ navbarData }) => {

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className=" bg-white shadow-sm sticky top-0 z-20">
      <div className="mx-auto px-5 md:px-20 py-3">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href={navbarData.logo.href} className="flex items-center space-x-2 group">
            <img
              src={navbarData.logo.src}
              alt={navbarData.logo.alt}
              className={navbarData.logo.className}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='flex items-center space-x-8'>

            {/* Navigation Links */}
            <ul className="hidden lg:flex items-center space-x-8">
              {navbarData.navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-black hover:text-[#009BE2] capitalize font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#009BE2] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Contact Button */}
            <Link
              href={navbarData.button.href}
              className={`hidden lg:inline-block ${navbarData.button.className}`}
            >
              {navbarData.button.text}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={navbarData.mobileMenu?.className || "md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <ul className="flex flex-col space-y-4 pb-4">
            {navbarData.navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block text-black hover:text-[#009BE2] capitalize font-medium transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={navbarData.button.href}
                className="inline-block text-center w-full text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {navbarData.button.text}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;