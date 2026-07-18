// resources/js/Pages/Frontend/NotFound.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = ({ topBarData, navbarData, footerData, storageUrl, pageTitle }) => {
  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={pageTitle || 'Page Not Found | DUS'} />

      {/* Main Content */}
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
            {/* Illustration */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="text-8xl sm:text-9xl mb-4 animate-bounce-slow text-black">404</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#009BE2]/20 rounded-full blur-sm" />
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <span className="inline-block w-3 h-3 rounded-full bg-[#009BE2] opacity-75" />
                <span className="inline-block w-3 h-3 rounded-full bg-[#FF6B6B] opacity-50" />
                <span className="inline-block w-3 h-3 rounded-full bg-[#FDCB6E] opacity-50" />
              </div>
            </div>

            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#009BE2]/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#009BE2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#080C14] mb-3">
              Oops! Page Not Found
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              The page you're looking for seems to have wandered off.
              Let's get you back on track.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">What now?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#009BE2] text-white font-600 px-8 py-3.5 rounded-xl hover:bg-[#007BB5] transition-all duration-300 shadow-lg shadow-[#009BE2]/25 hover:shadow-xl hover:shadow-[#009BE2]/30 hover:-translate-y-0.5"
              >
                <FiHome className="w-5 h-5" />
                Return to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-600 px-8 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">Try these popular pages:</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/" className="text-sm text-[#009BE2] hover:text-[#007BB5] transition-colors font-medium">
                  Home
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <Link href="/about" className="text-sm text-[#009BE2] hover:text-[#007BB5] transition-colors font-medium">
                  About Us
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <Link href="/projects-programs" className="text-sm text-[#009BE2] hover:text-[#007BB5] transition-colors font-medium">
                  Programs
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <Link href="/contact" className="text-sm text-[#009BE2] hover:text-[#007BB5] transition-colors font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Error 404 • Page not found
          </p>
        </div>
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </PublicLayout>
  );
};

export default NotFound;