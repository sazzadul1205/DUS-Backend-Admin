// resources/js/Pages/Backend/Logs/Index.jsx

// React
import { useState, useEffect, useMemo, useCallback } from 'react';

// Inertia
import { Head, router } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Auth
import { useAuth } from '../../../hooks/useAuth';
import { Can } from '../../../components/Auth/Can';

// Icons
import {
  FaShieldAlt,
  FaBriefcase,
  FaFileAlt,
  FaUsers,
  FaEdit,
  FaCog,
  FaRobot,
  FaSpinner,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaDownload,
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock,
  FaUser,
  FaDatabase,
  FaSyncAlt,
} from 'react-icons/fa';

// SweetAlert2
import Swal from 'sweetalert2';

export default function LogsIndex({
  currentType: initialCurrentType,
  logs: initialLogs,
  fileInfo: initialFileInfo,
}) {

  // ============================================
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  // ============================================

  // Use centralized auth hook
  const {
    hasAnyPermission,
  } = useAuth();

  // Check permissions
  const canViewLogs = hasAnyPermission(['logs.view', 'logs.manage']);
  const canExportLogs = hasAnyPermission(['logs.export', 'logs.manage']);
  const canClearLogs = hasAnyPermission(['logs.clear', 'logs.manage']);

  // Log types with icons
  const logTypes = useMemo(() => ({
    security: {
      label: '🔒 Security Logs',
      icon: FaShieldAlt,
      color: 'text-red-600',
      bg: 'bg-red-50',
      description: 'Login attempts, password changes, security events'
    },
    jobs: {
      label: '💼 Jobs Log',
      icon: FaBriefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Job creation, updates, deletions, status changes'
    },
    applications: {
      label: '📄 Applications Log',
      icon: FaFileAlt,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Application submissions, status changes, emails'
    },
    users: {
      label: '👤 Users Log',
      icon: FaUsers,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'User management, profile updates, role changes'
    },
    cms: {
      label: '📝 CMS Log',
      icon: FaEdit,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Blog, pages, programs, about content changes'
    },
    system: {
      label: '⚙️ System Log',
      icon: FaCog,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      description: 'Cache clearing, backups, system operations'
    },
    ats: {
      label: '🤖 ATS Log',
      icon: FaRobot,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'ATS score calculations and failures'
    },
  }), []);

  // States
  const [currentType, setCurrentType] = useState(initialCurrentType || 'security');
  const [logs, setLogs] = useState(initialLogs || []);
  const [fileInfo, setFileInfo] = useState(initialFileInfo || {});
  const [loading, setLoading] = useState(false);
  const [expandedContext, setExpandedContext] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // ============================================
  // ALL useCallback HOOKS MUST BE CALLED HERE
  // ============================================

  // Fetch logs for current type
  const fetchLogs = useCallback(() => {
    setLoading(true);
    router.get(route('backend.logs.index', { type: currentType, limit: 200 }), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setLogs(page.props.logs || []);
        setFileInfo(page.props.fileInfo || {});
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  }, [currentType]);

  // Handle type change
  const handleTypeChange = useCallback((type) => {
    setCurrentType(type);
    setExpandedContext({});
    setSearchTerm('');
    router.get(route('backend.logs.index', { type, limit: 200 }), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setLogs(page.props.logs || []);
        setFileInfo(page.props.fileInfo || {});
      },
    });
  }, []);

  // Export logs
  const handleExport = useCallback(() => {
    if (!canExportLogs) {
      Swal.fire('Permission Denied', 'You do not have permission to export logs.', 'error');
      return;
    }
    window.open(route('backend.logs.export', { type: currentType }), '_blank');
  }, [canExportLogs, currentType]);

  // Clear logs
  const handleClear = useCallback(() => {
    if (!canClearLogs) {
      Swal.fire('Permission Denied', 'You do not have permission to clear logs.', 'error');
      return;
    }

    const logType = logTypes[currentType];
    Swal.fire({
      title: `Clear ${logType?.label || currentType}?`,
      text: `Are you sure you want to clear all entries from the ${logType?.label || currentType}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        router.post(route('backend.logs.clear', { type: currentType }), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cleared!',
              text: `${logType?.label || currentType} has been cleared.`,
              timer: 1500,
              showConfirmButton: false,
            });
            fetchLogs();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.message || 'Failed to clear logs.',
            });
            setLoading(false);
          },
        });
      }
    });
  }, [canClearLogs, currentType, logTypes, fetchLogs]);

  // Toggle expanded context
  const toggleExpanded = useCallback((index) => {
    setExpandedContext(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // Check if log entry should be highlighted
  const isHighlighted = useCallback((message) => {
    const highlightPatterns = [
      '❌', '🔴', 'Failed', 'failed', 'error', 'Error',
      'deleted', 'Deleted', 'permanently', 'Permanently'
    ];
    return highlightPatterns.some(pattern => message?.includes(pattern));
  }, []);

  // Get emoji for log entry
  const getLogEmoji = useCallback((message) => {
    if (!message) return '📝';
    if (message.includes('✅')) return '✅';
    if (message.includes('❌')) return '❌';
    if (message.includes('🔴')) return '🔴';
    if (message.includes('🟢')) return '🟢';
    if (message.includes('📦')) return '📦';
    if (message.includes('🔄')) return '🔄';
    if (message.includes('🗑️')) return '🗑️';
    if (message.includes('📥')) return '📥';
    if (message.includes('📊')) return '📊';
    if (message.includes('🔒')) return '🔒';
    if (message.includes('💼')) return '💼';
    if (message.includes('📄')) return '📄';
    if (message.includes('👤')) return '👤';
    if (message.includes('📝')) return '📝';
    if (message.includes('⚙️')) return '⚙️';
    if (message.includes('🤖')) return '🤖';
    if (message.includes('🚪')) return '🚪';
    if (message.includes('📸')) return '📸';
    if (message.includes('✏️')) return '✏️';
    return '📝';
  }, []);

  // Get context count
  const getContextCount = useCallback((log) => {
    if (!log.context) return 0;
    if (typeof log.context === 'object') {
      return Object.keys(log.context).length;
    }
    return 0;
  }, []);

  // Format context
  const formatContext = useCallback((context) => {
    if (!context) return '{}';
    if (typeof context === 'string') {
      try {
        return JSON.stringify(JSON.parse(context), null, 2);
      } catch {
        return context;
      }
    }
    return JSON.stringify(context, null, 2);
  }, []);

  // ============================================
  // ALL useEffect HOOKS MUST BE CALLED HERE
  // ============================================

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLogs();
      }, 30000);
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [autoRefresh, fetchLogs, refreshInterval]);

  // Initial fetch on mount
  useEffect(() => {
    if (initialLogs && initialLogs.length === 0) {
      fetchLogs();
    }
  }, [fetchLogs, initialLogs]);

  // ============================================
  // ALL useMemo HOOKS MUST BE CALLED HERE
  // ============================================

  // Filter logs by search term
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const term = searchTerm.toLowerCase();
    return logs.filter(log =>
      log.message?.toLowerCase().includes(term) ||
      log.email?.toLowerCase().includes(term) ||
      log.ip?.toLowerCase().includes(term) ||
      log.timestamp?.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  // No results check
  const noResults = useMemo(() => {
    return filteredLogs.length === 0 && !loading;
  }, [filteredLogs, loading]);

  // Get log type helpers
  const logTypeHelpers = useMemo(() => {
    const type = logTypes[currentType];
    return {
      icon: type?.icon || FaShieldAlt,
      color: type?.color || 'text-gray-600',
      bg: type?.bg || 'bg-gray-50',
      label: type?.label || currentType,
      description: type?.description || '',
    };
  }, [currentType, logTypes]);

  // ============================================
  // CONDITIONAL RETURN - NOW AFTER ALL HOOKS
  // ============================================

  // If user doesn't have permission to view logs, show access denied
  if (!canViewLogs) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don't have permission to view system logs.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  const LogTypeIcon = logTypeHelpers.icon;

  return (
    <AuthenticatedLayout>
      <Head title="System Logs" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6 animate-fade-in">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  System Logs
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${logTypeHelpers.bg} ${logTypeHelpers.color}`}>
                  <LogTypeIcon size={14} />
                  {logTypeHelpers.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {logTypeHelpers.description}
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs">
                  <FaDatabase className="text-gray-400" size={12} />
                  Size: {fileInfo?.size || '0 B'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <FaClock className="text-gray-400" size={12} />
                  Lines: {fileInfo?.lines || 0}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <FaSyncAlt className="text-gray-400" size={12} />
                  Last Modified: {fileInfo?.last_modified || 'Never'}
                </span>
                {autoRefresh && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Auto-refresh ON
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${autoRefresh
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <FaSyncAlt size={14} className={autoRefresh ? 'animate-spin' : ''} />
                Auto-Refresh
              </button>

              {/* Log Type Selector */}
              <div className="relative">
                <select
                  value={currentType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {Object.entries(logTypes).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" size={14} /> : <FaSyncAlt size={14} />}
                Refresh
              </button>

              {/* Export Button */}
              <Can permission="logs.export" fallback={null}>
                <button
                  onClick={handleExport}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                >
                  <FaDownload size={14} />
                  Export
                </button>
              </Can>

              {/* Clear Button */}
              <Can permission="logs.clear" fallback={null}>
                <button
                  onClick={handleClear}
                  disabled={loading || !fileInfo?.exists}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTrash size={14} />
                  Clear
                </button>
              </Can>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="text-lg font-bold text-gray-900">{fileInfo?.size || '0 B'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaDatabase className="text-blue-600" size={16} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Lines</p>
                  <p className="text-lg font-bold text-gray-900">{fileInfo?.lines || 0}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaClock className="text-purple-600" size={16} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Last Modified</p>
                  <p className="text-sm font-bold text-gray-900">{fileInfo?.last_modified || 'Never'}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaSyncAlt className="text-orange-600" size={16} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Max Lines</p>
                  <p className="text-lg font-bold text-gray-900">10,000</p>
                  <p className="text-xs text-gray-400">Auto-rotates at limit</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-50 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs by message, user, IP, or timestamp..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTimes size={12} />
                  Clear
                </button>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredLogs.length} of {logs.length} entries
              </div>
            </div>
          </div>

          {/* Log Entries Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing <strong>{filteredLogs.length}</strong> entries
              </span>
              <span className="text-sm text-gray-500">
                {logTypeHelpers.label}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {noResults ? (
                    <FaSearch className="h-10 w-10 text-gray-400" />
                  ) : (
                    <FaDatabase className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {noResults ? 'No matching logs found' : 'No log entries found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {noResults
                    ? 'Try adjusting your search term.'
                    : `${logTypeHelpers.label} is empty. System is quiet! 🤫`}
                </p>
                {noResults && searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-auto max-h-150 font-mono text-sm">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs uppercase tracking-wider w-10">#</th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs uppercase tracking-wider w-40">Time</th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs uppercase tracking-wider w-36">User</th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs uppercase tracking-wider w-28">IP</th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => {
                      const highlighted = isHighlighted(log.message);
                      const contextCount = getContextCount(log);
                      const isExpanded = expandedContext[index];
                      const emoji = getLogEmoji(log.message);

                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 transition-colors ${highlighted ? 'bg-red-50/70' : ''} ${index % 2 === 0 && !highlighted ? 'bg-white' : 'bg-gray-50/50'
                            }`}
                        >
                          {/* Index */}
                          <td className="px-4 py-2 text-gray-400 text-xs text-center">
                            {index + 1}
                          </td>

                          {/* Timestamp */}
                          <td className="px-4 py-2 text-gray-500 whitespace-nowrap text-xs">
                            {log.timestamp || 'N/A'}
                          </td>

                          {/* User */}
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1.5">
                              <FaUser className="text-gray-400 text-xs" size={10} />
                              <span className="text-blue-600 font-medium text-xs truncate max-w-30">
                                {log.email || 'System'}
                              </span>
                              {log.user_id && log.user_id !== 'system' && (
                                <span className="text-gray-400 text-xs">
                                  (#{log.user_id})
                                </span>
                              )}
                            </div>
                          </td>

                          {/* IP */}
                          <td className="px-4 py-2 text-gray-500 text-xs">
                            {log.ip || '0.0.0.0'}
                          </td>

                          {/* Message */}
                          <td className="px-4 py-2">
                            <div className="flex items-start gap-2">
                              <span className="text-base shrink-0 mt-0.5">{emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className={`break-all text-sm ${highlighted ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                                  {log.message}
                                </div>

                                {/* Context */}
                                {contextCount > 0 && (
                                  <div className="mt-1">
                                    <button
                                      onClick={() => toggleExpanded(index)}
                                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                      <FaInfoCircle size={10} />
                                      {isExpanded ? 'Hide' : 'Show'} details ({contextCount})
                                      <FaChevronDown
                                        size={10}
                                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                      />
                                    </button>

                                    {isExpanded && (
                                      <div className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                          {formatContext(log.context)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <div>
              <span>Showing {filteredLogs.length} of {logs.length} entries</span>
              {searchTerm && <span className="ml-2">(filtered by search)</span>}
            </div>
            <div>
              <span>Log file: {currentType}.log</span>
              <span className="ml-4">Max lines: 10,000 (auto-rotates)</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}