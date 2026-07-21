 
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ContentEditor.jsx

// React
import React from 'react';

// Icons
import { FaExternalLinkAlt, FaFileAlt, FaInfoCircle } from 'react-icons/fa';

/**
 * ContentEditor - Editor for ContentSection data
 * This is a dynamic sub-page section that displays content from About Content
 * Features:
 * - Shows information about the section
 * - Provides link to About Content Manager for editing
 * - Displays preview of the content
 * - Not editable directly (read-only)
 */
const ContentEditor = ({ section, hasData }) => {
  // ===== DATA EXTRACTION =====
  // This is a dynamic sub-page section - not editable directly
  // Data comes from About Content Manager

  // Get the data from section
  const data = section?.data || {};

  // Extract content info from the data
  const contentData = data?.data || data;
  const title = contentData?.title || section?.section_key || 'Content';
  const contentType = contentData?.type || 'detail';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Content Section</h3>

      {/* ===== INFO BOX: DYNAMIC SUB-PAGE ===== */}
      {/* Explains that this is a dynamic section managed elsewhere */}
      <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <FaFileAlt size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-800">Dynamic Sub-Page Section</h4>
            <p className="text-sm text-purple-700 mt-1">
              This is a <strong>dynamic sub-page</strong> section that displays content from the
              <strong> About Content Manager</strong>.
            </p>
            <p className="text-xs text-purple-600 mt-1">
              The content is automatically loaded based on the page slug and section key.
              To edit this content, please go to the About Content Manager.
            </p>
          </div>
        </div>
      </div>

      {/* ===== CONTENT INFORMATION ===== */}
      {/* Shows metadata about the content being displayed */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Content Information</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Section Key - used to match content */}
          <div>
            <span className="text-xs text-gray-500">Section Key</span>
            <p className="text-sm font-medium text-gray-700">{section.section_key || 'N/A'}</p>
          </div>
          {/* Content Title */}
          <div>
            <span className="text-xs text-gray-500">Content Title</span>
            <p className="text-sm font-medium text-gray-700">{title}</p>
          </div>
          {/* Content Type - main or detail */}
          <div>
            <span className="text-xs text-gray-500">Content Type</span>
            <p className="text-sm font-medium text-gray-700">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${contentType === 'main'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
                }`}>
                {contentType === 'main' ? 'Main Content' : 'Detail Page'}
              </span>
            </p>
          </div>
          {/* Data Table */}
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">about_content</p>
          </div>
          {/* Data Key */}
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'contentSectionData'}</p>
          </div>
          {/* Status - has content or not */}
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className={`text-sm font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✅ Has Content' : 'No Content'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== CONTENT PREVIEW ===== */}
      {/* Shows a preview of the actual content if it exists */}
      {hasData && data && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Content Preview</h4>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            {/* Title preview */}
            {title && (
              <div className="mb-2">
                <span className="text-xs text-gray-400">Title:</span>
                <p className="text-sm font-medium text-gray-800">{title}</p>
              </div>
            )}

            {/* Content/Description preview */}
            {contentData?.content && (
              <div className="mb-2">
                <span className="text-xs text-gray-400">Content:</span>
                <p className="text-sm text-gray-600 line-clamp-3">{contentData.content}</p>
              </div>
            )}

            {/* Full Content preview (HTML content) */}
            {contentData?.full_content && (
              <div>
                <span className="text-xs text-gray-400">Full Content:</span>
                <div
                  className="text-sm text-gray-600 line-clamp-3 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: contentData.full_content.substring(0, 200) +
                      (contentData.full_content.length > 200 ? '...' : '')
                  }}
                />
              </div>
            )}

            {/* No preview content */}
            {!contentData?.content && !contentData?.full_content && (
              <p className="text-sm text-gray-400">No content preview available</p>
            )}
          </div>
        </div>
      )}

      {/* ===== NO DATA STATE ===== */}
      {/* Shows when no content has been assigned to this section */}
      {!hasData && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-yellow-600" size={16} />
            <p className="text-sm text-yellow-700">
              No content has been assigned to this section yet.
            </p>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Go to the About Content Manager to create content for this section.
          </p>
        </div>
      )}

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the About Content Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.about.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to About Content Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder about how this section works and where to edit */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This is a dynamic sub-page section and is not editable directly.
          The content is loaded from the About Content Manager based on the page slug and section key.
        </p>
        <p className="mt-1">
          📍 To edit this content, navigate to <strong>About Content Manager</strong> and find the content
          with slug matching <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">'{section.section_key}'</code>
        </p>
        {/* Show which section key is currently being displayed */}
        {section.section_key && (
          <p className="mt-1 text-blue-600">
            🔗 This section is currently displaying content for: <strong>{section.section_key}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;