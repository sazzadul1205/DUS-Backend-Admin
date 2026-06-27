// resources/js/pages/Backend/CMS/Section/components/SectionDataViewer.jsx

/**
 * SectionDataViewer - Displays section data with expand/collapse functionality
 * Features:
 * - Collapsible data viewer with preview
 * - Copy to clipboard functionality
 * - Special handling for shared_data and content sections
 * - Auto-formatting of JSON data
 */

import React, { useState } from 'react';
import { FaDatabase, FaChevronDown, FaChevronRight, FaCopy, FaCheck } from 'react-icons/fa';
import { showToast } from '../utils/toastHelper';

// Constants for data table display labels
const DATA_TABLE_LABELS = {
  custom_section_data: 'Custom Data',
  shared_data: 'Shared Data',
  blogs: 'Blogs',
  programs: 'Programs',
  about_content: 'About Content',
  jobs: 'Jobs',
  our_programs: 'Our Programs',
};

// Color mapping for data table badges
const DATA_TABLE_COLORS = {
  custom_section_data: 'text-blue-600 bg-blue-50',
  shared_data: 'text-green-600 bg-green-50',
  blogs: 'text-purple-600 bg-purple-50',
  programs: 'text-orange-600 bg-orange-50',
  about_content: 'text-indigo-600 bg-indigo-50',
  jobs: 'text-pink-600 bg-pink-50',
  our_programs: 'text-teal-600 bg-teal-50',
};

const SectionDataViewer = ({ section, hasSectionData }) => {
  // State for expand/collapse and copy status
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Early return if no section data
  if (!section) return null;

  // Determine section type for special handling
  const isSharedData = section.data_table === 'shared_data';
  const isContentSection = section.section_key === 'content' || section.component === 'ContentSection';

  // Only show data for non-shared, non-content sections that have data
  const shouldShowData = hasSectionData && !isSharedData && !isContentSection;

  // Toggle expand state
  const toggleExpand = () => setIsExpanded(!isExpanded);

  /**
   * Copy data to clipboard with toast notification
   */
  const copyToClipboard = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        setCopied(true);
        showToast('success', '✅ Copied!', 'Data copied to clipboard.', 1500);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        showToast('error', '❌ Failed', 'Could not copy data.', 2000);
      });
  };

  /**
   * Format data for display - handles nested data structures
   * Extracts inner 'data' property if it exists
   */
  const formatData = (data) => {
    if (!data) return null;

    // If data is a JSON string, parse and extract inner data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return parsed?.data ?? parsed;
      } catch {
        return data;
      }
    }

    // If data is an object with a 'data' property, extract it
    if (typeof data === 'object' && data !== null && data.data !== undefined) {
      return data.data;
    }

    return data;
  };

  const formattedData = formatData(section.data);

  /**
   * Get human-readable data type label
   */
  const getDataTypeLabel = (data) => {
    if (!data) return 'No Data';
    if (Array.isArray(data)) return `Array (${data.length} items)`;
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return 'Empty Object';
      if (keys.includes('data') && Array.isArray(data.data)) {
        return `Object with Array (${data.data.length} items)`;
      }
      return `Object (${keys.length} fields)`;
    }
    return typeof data;
  };

  /**
   * Get preview text for the data summary
   */
  const getDataPreview = (data) => {
    if (!data) return 'No data available';
    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty array';
      if (data.length <= 3) {
        return data.map(item => {
          if (typeof item === 'object') {
            return Object.keys(item).join(', ');
          }
          return String(item);
        }).join(', ');
      }
      return `${data.length} items`;
    }
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return 'Empty object';
      if (keys.includes('data') && Array.isArray(data.data)) {
        return `Data array with ${data.data.length} items`;
      }
      return keys.join(', ');
    }
    return String(data).substring(0, 100);
  };

  /**
   * Get color classes based on data table type
   */
  const getDataTableColor = (table) => {
    return DATA_TABLE_COLORS[table] || 'text-gray-600 bg-gray-50';
  };

  /**
   * Get display label for data table
   */
  const getDataTableDisplayLabel = (table) => {
    return DATA_TABLE_LABELS[table] || table || 'None';
  };

  const dataTypeLabel = getDataTypeLabel(formattedData);
  const dataPreview = getDataPreview(formattedData);
  const dataTableColor = getDataTableColor(section.data_table);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - Click to expand/collapse */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label="Toggle section data viewer"
      >
        <div className="flex items-center gap-3">
          {/* Icon with color coding */}
          <span className={`p-2 rounded-lg ${dataTableColor}`}>
            <FaDatabase size={14} aria-hidden="true" />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Section Data</span>

              {/* Status Badges */}
              {isSharedData && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">📊 Shared</span>
              )}
              {isContentSection && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">📄 Content</span>
              )}
              {!isSharedData && !isContentSection && hasSectionData && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Available</span>
              )}
              {!isSharedData && !isContentSection && !hasSectionData && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Empty</span>
              )}
            </div>

            {/* Preview text */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isSharedData ? (
                <span>Data managed in Shared Data Manager</span>
              ) : isContentSection ? (
                <span>Content data managed separately</span>
              ) : (
                <>
                  <span>{dataTypeLabel}</span>
                  <span>•</span>
                  <span className="truncate max-w-64">{dataPreview}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {shouldShowData && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(formattedData);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Copy data to clipboard"
              aria-label="Copy data to clipboard"
            >
              {copied ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
            </button>
          )}
          <span className="text-gray-400" aria-hidden="true">
            {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        </div>
      </div>

      {/* Body - Expanded content */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Shared Data Message */}
          {isSharedData ? (
            <div className="text-center py-6 text-gray-500">
              <FaDatabase size={32} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
              <p className="text-sm font-medium">Shared Data Section</p>
              <p className="text-xs mt-1 text-gray-400">
                This section uses data from the Shared Data Manager.
                <br />
                Please go to <strong>Shared Data Manager</strong> to edit this content.
              </p>
            </div>
          ) : isContentSection ? (
            <div className="text-center py-6 text-gray-500">
              <FaDatabase size={32} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
              <p className="text-sm font-medium">Content Section</p>
              <p className="text-xs mt-1 text-gray-400">
                This is a content section. Data is managed through the content management system.
              </p>
            </div>
          ) : shouldShowData ? (
            <div className="space-y-3">
              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Data Table</span>
                  <p className="font-medium text-gray-700 truncate">{section.data_table || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Data Key</span>
                  <p className="font-medium text-gray-700 truncate">{section.data_key || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Type</span>
                  <p className="font-medium text-gray-700">{dataTypeLabel}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Status</span>
                  <p className="font-medium text-green-600">Has Data</p>
                </div>
              </div>

              {/* Data Content - JSON Viewer */}
              <div className="relative">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
                  {JSON.stringify(formattedData, (key, value) => {
                    // Handle large arrays - show summary to prevent performance issues
                    if (Array.isArray(value) && value.length > 100) {
                      return `[Array with ${value.length} items]`;
                    }
                    return value;
                  }, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(formattedData)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                  aria-label="Copy data"
                >
                  {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Data Structure Info - For arrays */}
              {Array.isArray(formattedData) && formattedData.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Structure:</span>{' '}
                  {Object.keys(formattedData[0] || {}).join(', ') || 'No keys'}
                </div>
              )}

              {/* Data Source Info */}
              {section.data_table && (
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded flex items-center gap-2">
                  <span>📊</span>
                  <span>Data Source: <strong>{getDataTableDisplayLabel(section.data_table)}</strong></span>
                  {section.data_table === 'shared_data' && (
                    <span className="text-green-600">(Shared Data)</span>
                  )}
                  {section.data_table === 'custom_section_data' && (
                    <span className="text-blue-600">(Custom Data)</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // No Data State
            <div className="text-center py-8 text-gray-400">
              <FaDatabase size={32} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
              <p className="text-sm">No data available for this section</p>
              <p className="text-xs mt-1">Data will appear here once the section has content</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionDataViewer;