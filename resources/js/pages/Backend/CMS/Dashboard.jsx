// resources/js/pages/Backend/CMS/Dashboard.jsx

// React
import React, { useState } from 'react';

// Inertia
import { Head, Link, router } from '@inertiajs/react';

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
  FaCheckCircle,
  FaHome,
  FaPlusCircle,
  FaLayerGroup,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronDown,
} from 'react-icons/fa';

export default function Dashboard({ stats }) {
  // Use centralized auth hook
  const { user, hasAnyPermission, hasRole } = useAuth();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    content: true,
    create: false,
  });

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle menu expansion
  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Check if user has permission to view CMS
  const canViewCMS = hasAnyPermission([
    'cms.dashboard',
    'pages.view',
    'pages.manage',
    'blogs.view',
    'blogs.manage',
    'programs.view',
    'programs.manage',
    'about.view',
    'about.manage',
    'custom-sections.view',
    'custom-sections.manage',
    'shared-data.view',
    'shared-data.manage',
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

  // Build navigation items based on permissions
  const navItems = {
    main: [
      {
        name: 'Dashboard',
        href: route('backend.cms.dashboard'),
        icon: FaHome,
        permission: 'cms.dashboard',
      },
    ],
    content: [
      {
        name: 'Pages',
        href: route('backend.cms.pages'),
        icon: FaFileAlt,
        permission: 'pages.view',
        create: route('backend.cms.pages.create'),
        hasCreate: hasAnyPermission(['pages.create', 'pages.manage']),
        count: stats.pages || 0,
        active: stats.active_pages || 0,
      },
      {
        name: 'Blogs',
        href: route('backend.cms.blogs'),
        icon: FaNewspaper,
        permission: 'blogs.view',
        create: route('backend.cms.blogs.create'),
        hasCreate: hasAnyPermission(['blogs.create', 'blogs.manage']),
        count: stats.blogs || 0,
        active: stats.active_blogs || 0,
      },
      {
        name: 'Programs',
        href: route('backend.cms.programs'),
        icon: FaBriefcase,
        permission: 'programs.view',
        create: route('backend.cms.programs.create'),
        hasCreate: hasAnyPermission(['programs.create', 'programs.manage']),
        count: stats.programs || 0,
        active: stats.active_programs || 0,
      },
      {
        name: 'About Content',
        href: route('backend.cms.about'),
        icon: FaUsers,
        permission: 'about.view',
        create: route('backend.cms.about.create'),
        hasCreate: hasAnyPermission(['about.create', 'about.manage']),
        count: stats.about_contents || 0,
        active: stats.active_about_contents || 0,
      },
    ],
    data: [
      {
        name: 'Shared Data',
        href: route('backend.cms.shared-data'),
        icon: FaDatabase,
        permission: 'shared-data.view',
        create: route('backend.cms.shared-data.create'),
        hasCreate: hasAnyPermission(['shared-data.create', 'shared-data.manage']),
        count: stats.shared_data || 0,
      },
      {
        name: 'Custom Sections',
        href: route('backend.cms.custom-sections'),
        icon: FaCog,
        permission: 'custom-sections.view',
        create: route('backend.cms.custom-sections.create'),
        hasCreate: hasAnyPermission(['custom-sections.create', 'custom-sections.manage']),
        count: stats.custom_sections || 0,
      },
    ],
  };

  // Filter items by permission
  const filteredMain = navItems.main.filter(item =>
    !item.permission || hasAnyPermission([item.permission])
  );

  const filteredContent = navItems.content.filter(item =>
    !item.permission || hasAnyPermission([item.permission])
  );

  const filteredData = navItems.data.filter(item =>
    !item.permission || hasAnyPermission([item.permission])
  );

  // Stats cards configuration
  const statCards = [
    {
      key: 'pages',
      title: 'Pages',
      count: stats.pages || 0,
      active: stats.active_pages || 0,
      icon: FaFileAlt,
      color: 'blue',
      route: route('backend.cms.pages'),
    },
    {
      key: 'blogs',
      title: 'Blogs',
      count: stats.blogs || 0,
      active: stats.active_blogs || 0,
      icon: FaNewspaper,
      color: 'green',
      route: route('backend.cms.blogs'),
    },
    {
      key: 'programs',
      title: 'Programs',
      count: stats.programs || 0,
      active: stats.active_programs || 0,
      icon: FaBriefcase,
      color: 'purple',
      route: route('backend.cms.programs'),
    },
    {
      key: 'about',
      title: 'About Content',
      count: stats.about_contents || 0,
      active: stats.active_about_contents || 0,
      icon: FaUsers,
      color: 'orange',
      route: route('backend.cms.about'),
    },
    {
      key: 'shared',
      title: 'Shared Data',
      count: stats.shared_data || 0,
      icon: FaDatabase,
      color: 'teal',
      route: route('backend.cms.shared-data'),
    },
    {
      key: 'custom',
      title: 'Custom Sections',
      count: stats.custom_sections || 0,
      icon: FaCog,
      color: 'indigo',
      route: route('backend.cms.custom-sections'),
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

  // Get hover color for sidebar items
  const getHoverColor = (color) => {
    const colors = {
      blue: 'hover:bg-blue-50 hover:text-blue-700',
      green: 'hover:bg-green-50 hover:text-green-700',
      purple: 'hover:bg-purple-50 hover:text-purple-700',
      orange: 'hover:bg-orange-50 hover:text-orange-700',
      teal: 'hover:bg-teal-50 hover:text-teal-700',
      indigo: 'hover:bg-indigo-50 hover:text-indigo-700',
    };
    return colors[color] || colors.blue;
  };

  // Render sidebar item
  const renderSidebarItem = (item, color = 'blue') => {
    const isActive = window.location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`
          flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
          ${isActive
            ? `bg-${color}-50 text-${color}-700 font-medium`
            : 'text-gray-600 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? `text-${color}-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span>{item.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.count !== undefined && (
            <span className="text-xs text-gray-400">{item.count}</span>
          )}
          {item.hasCreate && (
            <Link
              href={item.create}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title={`Create ${item.name}`}
            >
              <FaPlusCircle className="w-3 h-3 text-gray-400 hover:text-blue-600" />
            </Link>
          )}
        </div>
      </Link>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="CMS Dashboard" />

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg
              transition-all duration-300 z-40
              ${isSidebarOpen ? 'w-72' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <FaLayerGroup className="w-4 h-4 text-white" />
                  </div>
                  {isSidebarOpen && (
                    <span className="text-lg font-bold text-gray-900">CMS</span>
                  )}
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
                {isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                  >
                    <FaChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {/* Main Items */}
                {filteredMain.map(item => renderSidebarItem(item))}

                {/* Content Section */}
                {filteredContent.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleMenu('content')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                    >
                      <span>Content</span>
                      {isSidebarOpen && (
                        expandedMenus.content ? (
                          <FaChevronDown className="w-3 h-3" />
                        ) : (
                          <FaChevronRight className="w-3 h-3" />
                        )
                      )}
                    </button>
                    {(expandedMenus.content || !isSidebarOpen) && (
                      <div className="mt-1 space-y-0.5">
                        {filteredContent.map(item => renderSidebarItem(item))}
                      </div>
                    )}
                  </div>
                )}

                {/* Data Section */}
                {filteredData.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleMenu('create')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                    >
                      <span>Configuration</span>
                      {isSidebarOpen && (
                        expandedMenus.create ? (
                          <FaChevronDown className="w-3 h-3" />
                        ) : (
                          <FaChevronRight className="w-3 h-3" />
                        )
                      )}
                    </button>
                    {(expandedMenus.create || !isSidebarOpen) && (
                      <div className="mt-1 space-y-0.5">
                        {filteredData.map(item => renderSidebarItem(item))}
                      </div>
                    )}
                  </div>
                )}
              </nav>

              {/* Sidebar Footer */}
              {isSidebarOpen && (
                <div className="p-4 border-t border-gray-200">
                  <div className="text-xs text-gray-400">
                    <p>CMS v1.0.0</p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {/* Toggle button for mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
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
                  const colorClasses = getColorClasses(card.color);
                  return (
                    <Link
                      key={card.key}
                      href={card.route}
                      className={`block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border ${colorClasses}`}
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
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                          <Icon size={20} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaRocket size={18} className="text-blue-600" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredContent.map(item => (
                      item.hasCreate && (
                        <Link
                          key={item.name}
                          href={item.create}
                          className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium text-center"
                        >
                          Add {item.name.replace(' Content', '')}
                        </Link>
                      )
                    ))}
                    {filteredData.map(item => (
                      item.hasCreate && (
                        <Link
                          key={item.name}
                          href={item.create}
                          className="px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 text-sm font-medium text-center"
                        >
                          Add {item.name}
                        </Link>
                      )
                    ))}
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
                        {(stats.pages || 0) + (stats.blogs || 0) + (stats.programs || 0) +
                          (stats.about_contents || 0) + (stats.shared_data || 0) +
                          (stats.custom_sections || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Active Content</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(stats.active_pages || 0) + (stats.active_blogs || 0) +
                          (stats.active_programs || 0) + (stats.active_about_contents || 0)}
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
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </AuthenticatedLayout>
  );
}