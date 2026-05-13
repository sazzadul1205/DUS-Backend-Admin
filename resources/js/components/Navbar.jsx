import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, Briefcase, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Projects & Programs', href: '/projects-programs' },
    { name: 'Workplace Area', href: '/workplace-area' },
    { name: 'Posts', href: '/posts' },
    { name: 'Media', href: '/media' },
    { name: 'Get Involved', href: '/get-involved' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-20 py-3">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/images/Icon.svg"
              alt="Job Match Logo"
              className="h-17.5 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='flex items-center space-x-8' >

            {/* Navigation Links */}
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-black hover:text-blue-600 capitalize font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button className='capitalize text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200' >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;