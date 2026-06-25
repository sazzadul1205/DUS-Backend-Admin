// resources/js/pages/Backend/CMS/Dashboard.jsx

// React
import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Auth
import { useAuth } from '../../../hooks/useAuth';

// Icons
import {
  FaFileAlt,
  FaNewspaper,
  FaBriefcase,
  FaUsers,
  FaDatabase,
  FaCog,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaEye,
  FaCheckCircle,
} from 'react-icons/fa';

export default function Dashboard({ stats }) {
  // Use centralized auth hook
  const { user, hasAnyPermission, hasRole } = useAuth();

  // Check if user has permission to view CMS
  const canViewCMS = hasAnyPermission([
    'cms.dashboard',
    'cms.pages',
    'cms.blogs',
    'cms.programs',
    'cms.about',
    'cms.shared-data',
    'cms.custom-sections'
  ]);

  // If user doesn't have permission, show access denied
  if (!canViewCMS) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to access the CMS.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Stats cards configuration
  const statCards = [
    {
      key: 'pages',
      title: 'Pages',
      count: stats.pages || 0,
      active: stats.active_pages || 0,
      icon: FaFileAlt,
      color: 'blue',
      route: route('cms.pages'),
    },
    {
      key: 'blogs',
      title: 'Blogs',
      count: stats.blogs || 0,
      active: stats.active_blogs || 0,
      icon: FaNewspaper,
      color: 'green',
      route: route('cms.blogs'),
    },
    {
      key: 'programs',
      title: 'Programs',
      count: stats.programs || 0,
      active: stats.active_programs || 0,
      icon: FaBriefcase,
      color: 'purple',
      route: route('cms.programs'),
    },
    {
      key: 'about',
      title: 'About Content',
      count: stats.about_contents || 0,
      active: stats.active_about_contents || 0,
      icon: FaUsers,
      color: 'orange',
      route: route('cms.about'),
    },
    {
      key: 'shared',
      title: 'Shared Data',
      count: stats.shared_data || 0,
      icon: FaDatabase,
      color: 'teal',
      route: route('cms.shared-data'),
    },
    {
      key: 'custom',
      title: 'Custom Sections',
      count: stats.custom_sections || 0,
      icon: FaCog,
      color: 'indigo',
      route: route('cms.custom-sections'),
    },
  ];

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      teal: 'bg-teal-50 text-teal-600 border-teal-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <AuthenticatedLayout>
      <Head title="CMS Dashboard" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                CMS Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your website content, pages, and settings
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  System running
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.key}
                  href={card.route}
                  className={`block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border ${getColorClasses(card.color)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{card.count}</p>
                      {card.active !== undefined && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FaCheckCircle size={10} className="text-green-500" />
                          {card.active} active
                        </p>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity / Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaRocket size={18} className="text-blue-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={route('cms.pages.create')}
                  className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium text-center"
                >
                  Create Page
                </a>
                <a
                  href={route('cms.blogs.create')}
                  className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm font-medium text-center"
                >
                  Add Blog
                </a>
                <a
                  href={route('cms.programs.create')}
                  className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 text-sm font-medium text-center"
                >
                  Create Program
                </a>
                <a
                  href={route('cms.about.create')}
                  className="px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 text-sm font-medium text-center"
                >
                  Add About Content
                </a>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartLine size={18} className="text-indigo-600" />
                System Overview
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Content Items</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.pages + stats.blogs + stats.programs + stats.about_contents + stats.shared_data + stats.custom_sections}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Active Content</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.active_pages + stats.active_blogs + stats.active_programs + stats.active_about_contents}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Section Configurations</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.section_configs || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}