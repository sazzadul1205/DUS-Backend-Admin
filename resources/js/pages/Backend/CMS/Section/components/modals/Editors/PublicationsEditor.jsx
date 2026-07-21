 
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/PublicationsEditor.jsx

// React
import React from 'react';

// Icons
import { FaExternalLinkAlt, FaFileAlt, FaInfoCircle } from 'react-icons/fa';

/**
 * PublicationsEditor - Editor for PublicationsSection data
 * This section is controlled by the Publications Page (read-only here)
 * Features:
 * - Shows information about the section
 * - Provides link to Publications Manager for editing
 * - Displays preview of publication data
 * - Not editable directly (informational only)
 */
const PublicationsEditor = ({ section, hasData }) => {
  // ===== DATA EXTRACTION =====
  // Get publications data from section - this is read-only
  const data = section?.data || [];
  const publications = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Publications Section</h3>

      {/* ===== INFO BOX: CONTROLLED BY PUBLICATIONS PAGE ===== */}
      {/* Explains that this section is managed elsewhere */}
      <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <FaFileAlt size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-800">Controlled by Publications Manager</h4>
            <p className="text-sm text-indigo-700 mt-1">
              This section displays publications from the <strong>Publications Manager</strong>.
              It automatically shows all active publications.
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              To add, edit, or remove publications, please go to the Publications Manager.
              Changes made there will automatically reflect here.
            </p>
          </div>
        </div>
      </div>

      {/* ===== PUBLICATION COUNT AND PREVIEW ===== */}
      {/* Shows how many publications are available and previews the first few */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Publications</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasData && publications.length > 0 ? (
            <div className="space-y-2">
              {/* Publication count */}
              <p className="text-xs text-gray-500">
                <span className="font-medium">{publications.length}</span> publication
                {publications.length > 1 ? 's' : ''} available
              </p>
              {/* Publication tags - show first 3 */}
              <div className="flex flex-wrap gap-1">
                {publications.slice(0, 3).map((pub, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {pub.title || `Publication ${idx + 1}`}
                  </span>
                ))}
                {/* Show "+N more" if more than 3 publications */}
                {publications.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{publications.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Empty state - no publications
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">No publications available</p>
              <p className="text-xs text-gray-400 mt-1">
                Add publications in the Publications Manager
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== SECTION SETTINGS ===== */}
      {/* Shows configuration details for this section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Settings</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">publications</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'publicationsData'}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Component</span>
            <p className="text-sm font-medium text-gray-700">PublicationsSection</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className={`text-sm font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✅ Has Publications' : 'No Publications'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== PUBLICATION STATS ===== */}
      {/* Shows statistics about publications (total, active, featured) */}
      {hasData && publications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Publication Stats</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Total publications */}
            <div className="bg-indigo-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Total</span>
              <p className="text-lg font-bold text-indigo-600">{publications.length}</p>
            </div>
            {/* Active publications */}
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Active</span>
              <p className="text-lg font-bold text-green-600">
                {publications.filter(p => p.is_active !== false).length}
              </p>
            </div>
            {/* Featured publications */}
            <div className="bg-yellow-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Featured</span>
              <p className="text-lg font-bold text-yellow-600">
                {publications.filter(p => p.is_featured).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== RECENT PUBLICATION PREVIEW ===== */}
      {/* Shows preview of the most recent 2 publications */}
      {hasData && publications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Publication Preview</h4>
          <div className="space-y-2">
            {publications.slice(0, 2).map((pub, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                {/* Publication title */}
                <p className="text-xs font-medium text-gray-700">{pub.title || `Publication ${idx + 1}`}</p>
                {/* Publication excerpt (if available) */}
                {pub.excerpt && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pub.excerpt}</p>
                )}
                {/* Publication date (if available) */}
                {pub.date && (
                  <p className="text-xs text-gray-400 mt-1">{pub.date}</p>
                )}
                {/* Publication author (if available) */}
                {pub.author && (
                  <p className="text-xs text-gray-400 mt-0.5">By {pub.author}</p>
                )}
              </div>
            ))}
            {/* Show if more publications exist */}
            {publications.length > 2 && (
              <p className="text-xs text-gray-400 text-center">
                + {publications.length - 2} more publications available
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== NO DATA STATE ===== */}
      {/* Shows when no publications exist yet */}
      {!hasData && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-yellow-600" size={16} />
            <p className="text-sm text-yellow-700">
              No publications have been created yet.
            </p>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Go to the Publications Manager to create your first publication.
          </p>
        </div>
      )}

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the Publications Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.publications.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Publications Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder that this section is read-only */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section is controlled by the Publications Manager.
          You cannot edit publication content directly here.
        </p>
        <p className="mt-1">
          📍 To manage publications, navigate to <strong>Publications Manager</strong> in the CMS sidebar.
          All changes made there will automatically appear in this section.
        </p>
      </div>
    </div>
  );
};

export default PublicationsEditor;