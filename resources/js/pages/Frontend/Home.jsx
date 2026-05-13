// resources/js/Pages/Frontend/Home.jsx

import { Head } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';

export default function Home() {
  return (
    <PublicLayout>
      <Head title="Job Match - Find Your Perfect Career" />
      <div className="min-h-screen bg-[#FDFDFC]">
        {/* Hero Section */}
        <div className="relative bg-linear-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Job Match
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Connect with top employers and discover opportunities that match your skills
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/jobs-frontend"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Browse Jobs
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-700 transition-all duration-200"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#1b1b18] mb-4">Welcome to Job Match</h2>
            <p className="text-[#706f6c] text-lg">
              Home page content coming soon...
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}