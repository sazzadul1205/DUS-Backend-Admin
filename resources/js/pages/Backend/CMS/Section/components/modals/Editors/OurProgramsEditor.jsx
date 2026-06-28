/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/OurProgramsEditor.jsx

import React from 'react';
import { FaExternalLinkAlt, FaList } from 'react-icons/fa';

/**
 * OurProgramsEditor - Editor for OurProgramsSection data
 * This is a special section that displays programs from the Program Manager
 * Features:
 * - Shows information about the section
 * - Provides link to Program Manager for editing
 * - Displays preview of what will be shown
 */
const OurProgramsEditor = ({ section, hasData }) => {
  // This is a special section - data is managed through the Program Manager
  // No form fields needed - just informational display

  // Get custom props for display settings
  const customProps = section?.custom_props || {};
  const limit = customProps?.limit || 3;
  const showFeatured = customProps?.showFeatured !== false;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Our Programs Section</h3>

      {/* Special Section Notice */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FaList size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Special Section</h4>
            <p className="text-sm text-blue-700 mt-1">
              This section displays programs from the <strong>Program Manager</strong>.
              It automatically shows {limit} program{limit > 1 ? 's' : ''}
              {showFeatured ? ' (featured programs prioritized)' : ''}.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              To add, edit, or remove programs, please go to the Program Manager.
            </p>
          </div>
        </div>
      </div>

      {/* Current Settings */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Settings</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-xs text-gray-500">Display Limit</span>
            <p className="text-sm font-medium text-gray-700">{limit} programs</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Featured Priority</span>
            <p className="text-sm font-medium text-gray-700">
              {showFeatured ? '✅ Featured first' : '❌ Not prioritized'}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">{section.data_table || 'programs'}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'ourProgramsData'}</p>
          </div>
        </div>
      </div>

      {/* Available Programs Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Available Programs</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasData && section.data ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                {Array.isArray(section.data) ? (
                  <>
                    <span className="font-medium">{section.data.length}</span> program
                    {section.data.length > 1 ? 's' : ''} available
                    {limit && section.data.length > limit && (
                      <span className="text-blue-600"> (showing {limit} of {section.data.length})</span>
                    )}
                  </>
                ) : (
                  'Program data available'
                )}
              </p>
              {Array.isArray(section.data) && section.data.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {section.data.slice(0, limit || 3).map((program, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {program.title || `Program ${idx + 1}`}
                    </span>
                  ))}
                  {limit && section.data.length > limit && (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      +{section.data.length - limit} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No programs available</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.programs.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Program Manager
        </button>
      </div>

      {/* Note about editing */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section does not have editable fields directly.
          All program data is managed through the Program Manager.
          Changes made there will automatically reflect here.
        </p>
      </div>
    </div>
  );
};

export default OurProgramsEditor;