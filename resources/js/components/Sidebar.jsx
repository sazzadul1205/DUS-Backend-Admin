// resources/js/Components/Sidebar.jsx
// ==========================================
// COMPONENT: Main Navigation Sidebar
// Handles role-based navigation for Job Seekers, Employers, and Admins
// ==========================================

// ===== IMPORTS =====
import { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'react-icons/fi';
import { MdCategory, MdWorkOutline } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaFileAlt, FaNewspaper, FaBriefcase, FaUsers, FaDatabase, FaCog, FaShieldAlt, FaLayout } from 'react-icons/fa';

// ===== HELPER FUNCTIONS =====

/** Route helper - safely generates URLs from route names */
const getRoute = (name, params = {}) => {
  if (typeof window !== 'undefined' && window.route) {
    try { return window.route(name, params); }
    catch (e) { return '#'; }
  }
  return '#';
};

/** Normalize URL for comparison (removes domain, trailing slashes, query params) */
const normalizeUrl = (value) => {
  if (!value) return '';
  const pathOnly = value.toString().replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '');
  return pathOnly.replace(/\/$/, '');
};

/** Normalize URL preserving query parameters */
const normalizeUrlWithQuery = (value) => {
  if (!value) return '';
  const withoutDomain = value.toString().replace(/^https?:\/\/[^/]+/i, '');
  const [path, query] = withoutDomain.split('?');
  const normalizedPath = (path || '').replace(/\/$/, '');
  return `${normalizedPath}${query ? `?${query}` : ''}`;
};

// ===== MAIN COMPONENT =====

const Sidebar = () => {
  // ===== STATE & HOOKS =====
  const { url, props } = usePage();
  const { auth } = props;
  const notificationMeta = props.notifications || { unread_count: 0, recent: [] };

  // User data
  const user = auth?.user;
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];
  const hasApplicantProfile = user?.has_applicant_profile || false;

  // UI State
  const [openMenus, setOpenMenus] = useState({
    jobs: false, applications: false, employerJobs: false,
    employerApps: false, adminJobs: false, adminApps: false,
    adminRoles: false, adminApplicants: false,
    cms: false, // CMS dropdown state
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ===== PERMISSION HELPERS =====
  const hasRole = (slug) => userRoles.some(r => r.slug === slug);
  const hasPermission = (slug) => userPermissions?.includes(slug) || false;
  const hasAnyPermission = (slugs) => slugs?.some(s => hasPermission(s)) || false;

  // ===== ROUTE ACTIVE STATE HELPERS =====

  /** Check if current route matches a named route */
  const isRouteActive = (routeName, params = {}, aliasPaths = [], options = {}) => {
    try {
      const routeUrl = getRoute(routeName, params);
      if (routeUrl === '#') return false;

      const normalizedUrl = normalizeUrl(url);
      const normalizedRoute = normalizeUrl(routeUrl);
      const normalizedAliases = (aliasPaths || []).filter(Boolean).map(normalizeUrl);
      const normalizedExcludes = (options?.excludePaths || []).filter(Boolean).map(normalizeUrl);

      // Check excludes
      if (normalizedExcludes.some(ex => normalizedUrl === ex || normalizedUrl.startsWith(ex))) {
        return false;
      }

      // Exact match
      if (options?.exact) return normalizedUrl === normalizedRoute;

      // Match route or aliases
      return normalizedUrl === normalizedRoute ||
        normalizedAliases.some(alias => normalizedUrl === alias || normalizedUrl.startsWith(alias)) ||
        (normalizedRoute !== '/' && normalizedUrl.startsWith(normalizedRoute));
    } catch (e) {
      return false;
    }
  };

  /** Check if current path matches a given path */
  const isPathActive = (path) => {
    if (!path || path === '#') return false;
    const normalized = normalizeUrl(url);
    const normalizedPath = normalizeUrl(path);
    return normalized === normalizedPath || (normalizedPath !== '/' && normalized.startsWith(normalizedPath));
  };

  /** Check if current path matches with query parameters */
  const isPathActiveWithQuery = (path) => {
    if (!path || path === '#') return false;
    return normalizeUrlWithQuery(url) === normalizeUrlWithQuery(path);
  };

  /** Check if any sub-items in a dropdown are active */
  const isDropdownActive = (subItems) => {
    return subItems?.some(item => {
      if (item.routeName) {
        return isRouteActive(item.routeName, item.routeParams || {}, item.activeAliases || [], {
          exact: item.exact,
          excludePaths: item.activeExclude
        });
      }
      if (item.href && item.href !== '#') {
        return item.matchQuery ? isPathActiveWithQuery(item.href) : isPathActive(item.href);
      }
      return false;
    });
  };

  // Auto-expand menus based on current URL
  useEffect(() => {
    const shouldOpenJobs = /\/listing|\/locations|\/categories|\/statistics/.test(url);
    const shouldOpenApplications = /\/applications|\/apply/.test(url);
    const shouldOpenRoles = url.includes('/roles');
    const shouldOpenApplicants = url.includes('/applicant-profiles');
    const shouldOpenCMS = /\/backend\/admin/.test(url);

    setOpenMenus(prev => ({
      ...prev,
      jobs: prev.jobs || shouldOpenJobs,
      employerJobs: prev.employerJobs || shouldOpenJobs,
      adminJobs: prev.adminJobs || shouldOpenJobs,
      applications: prev.applications || shouldOpenApplications,
      employerApps: prev.employerApps || shouldOpenApplications,
      adminApps: prev.adminApps || shouldOpenApplications,
      adminRoles: prev.adminRoles || shouldOpenRoles,
      adminApplicants: prev.adminApplicants || shouldOpenApplicants,
      cms: prev.cms || shouldOpenCMS,
    }));
  }, [url]);

  // ===== MENU DEFINITIONS =====

  /** Determine primary role for UI theming */
  const primaryRole = useMemo(() => {
    if (hasRole('super-admin') || hasRole('admin')) return 'admin';
    if (hasRole('employer-admin') || hasRole('hr-manager') || hasRole('recruiter')) return 'employer';
    return 'job_seeker';
  }, [userRoles]);

  /** Role-based color scheme */
  const colors = {
    admin: { light: 'from-red-600 to-red-700', dark: 'dark:from-red-500 dark:to-red-600', bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', hover: 'hover:bg-red-50', active: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    employer: { light: 'from-blue-600 to-blue-700', dark: 'dark:from-blue-500 dark:to-blue-600', bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', hover: 'hover:bg-blue-50', active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    job_seeker: { light: 'from-green-600 to-green-700', dark: 'dark:from-green-500 dark:to-green-600', bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', hover: 'hover:bg-green-50', active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  }[primaryRole] || { light: '', dark: '', bg: '', text: '', border: '', hover: '', active: '' };

  // ===== MENU ITEMS BY ROLE =====

  /** JOB SEEKER MENU - For users looking for jobs */
  const jobSeekerItems = useMemo(() => {
    const items = [];
    if (hasPermission('dashboard.job_seeker')) items.push({ name: 'Dashboard', routeName: 'backend.dashboard', icon: Icons.FiHome });
    if (hasPermission('job.view.any')) items.push({ name: 'Browse Jobs', routeName: 'public.jobs.index', icon: Icons.FiSearch });
    if (hasAnyPermission(['profiles.view.own', 'profiles.edit.own'])) items.push({ name: 'My Profile', routeName: 'backend.applicant.profile.show', icon: Icons.FiUser });
    if (hasPermission('application.view.own')) items.push({ name: 'My Applications', routeName: 'backend.apply.index', icon: Icons.FiFileText });
    if (hasPermission('notification.view')) items.push({ name: 'Notifications', routeName: 'backend.notifications.index', icon: Icons.FiBell, badgeCount: notificationMeta.unread_count });
    return items;
  }, [notificationMeta.unread_count]);

  /** EMPLOYER MENU - For companies posting jobs */
  const employerItems = useMemo(() => {
    const items = [];

    // Dashboard
    if (hasPermission('dashboard.employer')) {
      items.push({ name: 'Dashboard', routeName: 'backend.dashboard', icon: Icons.FiHome });
    }

    // Job Listings Dropdown
    if (hasAnyPermission(['job.create', 'job.view.own', 'job.edit.own'])) {
      const subItems = [];
      if (hasAnyPermission(['job.view.own', 'job.view.any'])) subItems.push({ name: 'All Jobs', routeName: 'backend.listing.index', activeExclude: ['/backend/listing/create'], icon: Icons.FiList });
      if (hasPermission('job.create')) subItems.push({ name: 'Create New Job', routeName: 'backend.listing.create', icon: Icons.FiPlusCircle, highlight: true });
      if (hasPermission('job.view.own')) {
        subItems.push({ name: 'Active Jobs', routeName: 'backend.listing.index', routeParams: { status: 'active' }, icon: Icons.FiCheckCircle });
        subItems.push({ name: 'Inactive Jobs', routeName: 'backend.listing.index', routeParams: { status: 'inactive' }, icon: Icons.FiClock });
      }
      if (subItems.length) items.push({ name: 'Job Listings', icon: Icons.FiBriefcase, isDropdown: true, dropdownKey: 'employerJobs', subItems });
    }

    // Applications Dropdown
    if (hasAnyPermission(['application.view.for_own_jobs', 'application.view.any'])) {
      const subItems = [];
      if (hasAnyPermission(['application.view.for_own_jobs', 'application.view.any'])) subItems.push({ name: 'All Applications', href: '/backend/applications', matchQuery: true, icon: Icons.FiUsers });
      if (hasPermission('application.view.for_own_jobs')) {
        subItems.push({ name: 'Pending', href: '/backend/applications?status=pending', matchQuery: true, icon: Icons.FiClock });
        subItems.push({ name: 'Shortlisted', href: '/backend/applications?status=shortlisted', matchQuery: true, icon: Icons.FiStar });
        subItems.push({ name: 'Rejected', href: '/backend/applications?status=rejected', matchQuery: true, icon: Icons.FiXCircle });
        subItems.push({ name: 'Hired', href: '/backend/applications?status=hired', matchQuery: true, icon: Icons.FiAward });
      }
      if (subItems.length) items.push({ name: 'Applications', icon: Icons.FiFileText, isDropdown: true, dropdownKey: 'employerApps', subItems });
    }

    // Company & Profile
    if (hasPermission('employer_profile.edit')) items.push({ name: 'Company Profile', routeName: 'backend.employer.profile.edit', icon: HiOutlineBuildingOffice2 });
    if (hasApplicantProfile && hasPermission('profiles.view.own')) items.push({ name: 'My Job Seeker Profile', routeName: 'backend.applicant.profile.show', icon: Icons.FiUser });
    if (hasPermission('notification.view')) items.push({ name: 'Notifications', routeName: 'backend.notifications.index', icon: Icons.FiBell, badgeCount: notificationMeta.unread_count });

    return items;
  }, [notificationMeta.unread_count, hasApplicantProfile]);

  /** ADMIN MENU - For system administrators */
  const adminItems = useMemo(() => {
    const items = [];

    // Dashboard
    if (hasPermission('dashboard.admin')) items.push({ name: 'Dashboard', routeName: 'backend.dashboard', icon: Icons.FiHome });

    // Jobs Management Dropdown
    if (hasAnyPermission(['job.view.any', 'job.create', 'category.view', 'location.view', 'statistics.view'])) {
      const subItems = [];
      if (hasPermission('job.view.any')) subItems.push({ name: 'All Jobs', routeName: 'backend.listing.index', activeExclude: ['/backend/listing/create'], icon: Icons.FiList });
      if (hasPermission('job.create')) subItems.push({ name: 'Create New Job', routeName: 'backend.listing.create', icon: Icons.FiPlusCircle, highlight: true });
      if (hasPermission('location.view')) subItems.push({ name: 'Locations', routeName: 'backend.locations.index', icon: FaSearchLocation });
      if (hasPermission('category.view')) subItems.push({ name: 'Categories', routeName: 'backend.categories.index', icon: MdCategory });
      if (hasPermission('statistics.view') || hasPermission('report.jobs')) subItems.push({ name: 'Job Statistics', routeName: 'backend.statistics.index', icon: Icons.FiBarChart2 });
      if (subItems.length) items.push({ name: 'Jobs Management', icon: Icons.FiBriefcase, isDropdown: true, dropdownKey: 'adminJobs', subItems });
    }

    // Applicant Profiles
    if (hasAnyPermission(['profiles.view.any', 'applicant-profiles.manage'])) {
      items.push({ name: 'Applicant Profiles', routeName: 'backend.applicant-profile.index', icon: Icons.FiUsers });
    }

    // Applications Dropdown
    if (hasAnyPermission(['application.view.any', 'application.shortlist', 'application.reject'])) {
      const subItems = [];
      if (hasPermission('application.view.any')) {
        subItems.push({ name: 'All Applications', href: '/backend/applications', matchQuery: true, icon: Icons.FiUsers });
        subItems.push({ name: 'Pending', href: '/backend/applications?status=pending', matchQuery: true, icon: Icons.FiClock });
        subItems.push({ name: 'Shortlisted', href: '/backend/applications?status=shortlisted', matchQuery: true, icon: Icons.FiStar });
        subItems.push({ name: 'Rejected', href: '/backend/applications?status=rejected', matchQuery: true, icon: Icons.FiXCircle });
        subItems.push({ name: 'Hired', href: '/backend/applications?status=hired', matchQuery: true, icon: Icons.FiAward });
      }
      if (subItems.length) items.push({ name: 'Applications', icon: Icons.FiFileText, isDropdown: true, dropdownKey: 'adminApps', subItems });
    }

    // Users Management
    if (hasAnyPermission(['user.view', 'user.create', 'user.edit'])) {
      items.push({ name: 'Users Management', routeName: 'backend.users.index', icon: Icons.FiUsers });
    }

    // Roles & Permissions Dropdown
    if (hasAnyPermission(['role.view', 'role.create', 'role.edit', 'role.delete'])) {
      const subItems = [];
      if (hasPermission('role.view')) subItems.push({ name: 'All Roles', routeName: 'backend.roles.index', icon: Icons.FiKey, exact: true });
      if (hasPermission('role.create')) subItems.push({ name: 'Create Role', routeName: 'backend.roles.create', icon: Icons.FiPlusCircle });
      if (hasPermission('role.view')) subItems.push({ name: 'Trashed Roles', routeName: 'backend.roles.trashed', icon: Icons.FiTrash2 });
      if (subItems.length) items.push({ name: 'Roles & Permissions', icon: Icons.FiShield, isDropdown: true, dropdownKey: 'adminRoles', subItems });
    }

    // CMS Management Dropdown
    if (hasAnyPermission([
      'cms.dashboard', 'cms.pages', 'cms.about', 'cms.blogs',
      'cms.programs', 'cms.custom-sections', 'cms.shared-data'
    ])) {
      const cmsSubItems = [];

      // Dashboard
      if (hasPermission('cms.dashboard')) {
        cmsSubItems.push({
          name: 'Dashboard',
          routeName: 'cms.dashboard',
          icon: Icons.FiHome
        });
      }

      // Pages
      if (hasAnyPermission(['pages.view', 'pages.manage'])) {
        cmsSubItems.push({
          name: 'Pages',
          routeName: 'cms.pages',
          icon: FaFileAlt
        });
      }

      // About Content
      if (hasAnyPermission(['about.view', 'about.manage'])) {
        cmsSubItems.push({
          name: 'About Content',
          routeName: 'cms.about',
          icon: FaUsers
        });
      }

      // Blogs
      if (hasAnyPermission(['blogs.view', 'blogs.manage'])) {
        cmsSubItems.push({
          name: 'Blogs',
          routeName: 'cms.blogs',
          icon: FaNewspaper
        });
      }

      // Programs
      if (hasAnyPermission(['programs.view', 'programs.manage'])) {
        cmsSubItems.push({
          name: 'Programs',
          routeName: 'cms.programs',
          icon: FaBriefcase
        });
      }

      // Custom Sections
      if (hasAnyPermission(['custom-sections.view', 'custom-sections.manage'])) {
        cmsSubItems.push({
          name: 'Custom Sections',
          routeName: 'cms.custom-sections',
          icon: FaCog
        });
      }

      // Shared Data
      if (hasAnyPermission(['shared-data.view', 'shared-data.manage'])) {
        cmsSubItems.push({
          name: 'Shared Data',
          routeName: 'cms.shared-data',
          icon: FaDatabase
        });
      }

      if (cmsSubItems.length) {
        items.push({
          name: 'CMS Management',
          icon: FaLayout,
          isDropdown: true,
          dropdownKey: 'cms',
          subItems: cmsSubItems
        });
      }
    }

    // Profile & Settings
    if (hasApplicantProfile && hasPermission('profiles.view.own')) items.push({ name: 'My Job Seeker Profile', routeName: 'backend.applicant.profile.show', icon: Icons.FiUser });
    if (hasAnyPermission(['admin_profile.edit', 'admin_profile.update'])) items.push({ name: 'Admin Settings', routeName: 'backend.admin-profile.edit', icon: Icons.FiSettings });
    if (hasPermission('notification.view')) items.push({ name: 'Notifications', routeName: 'backend.notifications.index', icon: Icons.FiBell, badgeCount: notificationMeta.unread_count });

    return items;
  }, [notificationMeta.unread_count, hasApplicantProfile]);

  /** Get appropriate menu items based on user's role */
  const menuItems = useMemo(() => {
    if (hasRole('super-admin') || hasRole('admin')) return adminItems;
    if (hasRole('employer-admin') || hasRole('hr-manager') || hasRole('recruiter')) return employerItems;
    if (hasRole('job-seeker')) return jobSeekerItems;
    // Fallback: determine by permissions
    if (userPermissions.some(p => p.includes('admin') || p === 'user.view')) return adminItems;
    if (userPermissions.some(p => p.includes('employer') || p === 'job.create')) return employerItems;
    return jobSeekerItems;
  }, [userRoles, userPermissions, adminItems, employerItems, jobSeekerItems]);

  // If no menu items, return null
  if (!menuItems.length) return null;

  // ===== RENDER HELPERS =====

  /** Render a sub-menu item (inside dropdown) */
  const renderSubMenuItem = (subItem) => {
    const isActive = subItem.routeName
      ? isRouteActive(subItem.routeName, subItem.routeParams || {}, subItem.activeAliases || [], {
        exact: subItem.exact,
        excludePaths: subItem.activeExclude
      })
      : (subItem.matchQuery ? isPathActiveWithQuery(subItem.href) : isPathActive(subItem.href));

    return (
      <Link
        key={subItem.name}
        href={subItem.routeName ? getRoute(subItem.routeName, subItem.routeParams || {}) : subItem.href}
        className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 group relative
          ${isActive ? `${colors.active} font-medium border-l-3 ${colors.border}` : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}
          ${subItem.highlight ? 'bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30' : ''}`}
      >
        {subItem.icon && <subItem.icon className={`w-4 h-4 ${isActive ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />}
        <span className="flex-1">{subItem.name}</span>
        {subItem.badgeColor && <span className={`w-2 h-2 rounded-full ${subItem.badgeColor}`} />}
        {isActive && <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />}
      </Link>
    );
  };

  /** Render a main menu item (link or dropdown) */
  const renderMenuItem = (item) => {
    // Dropdown Menu
    if (item.isDropdown) {
      const isOpen = openMenus[item.dropdownKey];
      const isActive = isDropdownActive(item.subItems);

      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => setOpenMenus(prev => ({ ...prev, [item.dropdownKey]: !prev[item.dropdownKey] }))}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group
              ${isActive ? colors.active + ' font-semibold' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${isActive ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </div>
            {!isCollapsed && (isOpen ? <Icons.FiChevronDown className="w-4 h-4" /> : <Icons.FiChevronRight className="w-4 h-4" />)}
          </button>
          {isOpen && !isCollapsed && (
            <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
              {item.subItems.map(renderSubMenuItem)}
            </div>
          )}
        </div>
      );
    }

    // Regular Link
    const isActive = item.routeName
      ? isRouteActive(item.routeName, item.routeParams || {}, item.activeAliases || [], { exact: item.exact, excludePaths: item.activeExclude })
      : isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.routeName ? getRoute(item.routeName, item.routeParams || {}) : item.href}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 mb-1 relative group
          ${isActive ? `${colors.active} font-semibold shadow-sm` : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />
        {!isCollapsed && <span className="flex-1">{item.name}</span>}
        {!isCollapsed && item.badgeCount > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
            {item.badgeCount > 99 ? '99+' : item.badgeCount}
          </span>
        )}
        {isActive && <span className={`absolute ${isCollapsed ? 'right-0 w-1.5 h-1.5 rounded-full' : 'left-0 w-1 h-8 rounded-r-full'} ${colors.bg}`} />}
      </Link>
    );
  };

  /** Get user's primary role display name */
  const getPrimaryRoleName = () => {
    if (hasRole('super-admin')) return 'Super Administrator';
    if (hasRole('admin')) return 'Administrator';
    if (hasRole('employer-admin')) return 'Employer Admin';
    if (hasRole('hr-manager')) return 'HR Manager';
    if (hasRole('recruiter')) return 'Recruiter';
    if (hasRole('job-seeker')) return 'Job Seeker';
    return 'User';
  };

  // ===== MAIN RENDER =====
  return (
    <aside className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl transition-all duration-300 z-50`}>

      {/* Header: Logo & Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <Link href={getRoute('home')} className="flex items-center gap-2 group">
            <div className={`w-8 h-8 bg-linear-to-br ${colors.light} ${colors.dark} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200`}>
              <Icons.FiBriefcase className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">JobMatch</span>}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icons.FiChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {!isCollapsed && (
          <div className="px-4 mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {primaryRole === 'admin' ? 'Administration' : primaryRole === 'employer' ? 'Employer Portal' : 'Job Seeker'}
            </p>
          </div>
        )}
        <div className="space-y-1">{menuItems.map(renderMenuItem)}</div>

        {/* Role indicator for collapsed mode */}
        {isCollapsed && userRoles.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="relative group">
              <div className={`w-2 h-2 rounded-full ${colors.bg} cursor-help`} />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                {userRoles.map(r => r.name).join(', ')}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-linear-to-br ${colors.light} ${colors.dark} flex items-center justify-center shadow-md`}>
                <span className="text-white font-semibold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} /> {getPrimaryRoleName()}
                </p>
                {userRoles.length > 1 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    +{userRoles.slice(1).map(r => r.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <Link
              href={getRoute('logout')}
              method="post"
              as="button"
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
            >
              <Icons.FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-linear-to-br ${colors.light} ${colors.dark} flex items-center justify-center shadow-md relative group`}>
              <span className="text-white font-semibold text-sm">{userName.charAt(0).toUpperCase()}</span>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                {userName}<br />{getPrimaryRoleName()}
              </div>
            </div>
            <Link
              href={getRoute('logout')}
              method="post"
              as="button"
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
              title="Logout"
            >
              <Icons.FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;