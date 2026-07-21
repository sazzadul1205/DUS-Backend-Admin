 
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/UpcomingEventsEditor.jsx

// React
import React from 'react';

// Icons
import { FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';

/**
 * UpcomingEventsEditor - Editor for UpcomingEventsSection data
 * This section uses Shared Data from the Shared Data Manager
 * Features:
 * - Shows information about the section
 * - Provides link to Shared Data Manager for editing
 * - Displays preview of events data
 * - Not editable directly (read-only)
 */
const UpcomingEventsEditor = ({ section, hasData }) => {
  // ===== DATA EXTRACTION =====
  // This uses Shared Data - managed through the Shared Data Manager
  // No form fields needed - just informational display

  // Get the events data from section
  const data = section?.data || {};
  const events = data?.events || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Events Section</h3>

      {/* ===== INFO BOX: SHARED DATA ===== */}
      {/* Explains that this section uses Shared Data managed elsewhere */}
      <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <FaCalendarAlt size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-800">Shared Data Section</h4>
            <p className="text-sm text-green-700 mt-1">
              This section uses data from the <strong>Shared Data Manager</strong>.
              It displays upcoming events that are managed centrally.
            </p>
            <p className="text-xs text-green-600 mt-1">
              To add, edit, or remove events, please go to the Shared Data Manager.
              Changes made there will automatically reflect here.
            </p>
          </div>
        </div>
      </div>

      {/* ===== EVENT COUNT AND PREVIEW ===== */}
      {/* Shows how many events are available and previews the first few */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Events</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasData && events.length > 0 ? (
            <div className="space-y-2">
              {/* Event count */}
              <p className="text-xs text-gray-500">
                <span className="font-medium">{events.length}</span> event
                {events.length > 1 ? 's' : ''} available
              </p>
              {/* Event tags - show first 3 */}
              <div className="flex flex-wrap gap-1">
                {events.slice(0, 3).map((event, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {event.title || `Event ${idx + 1}`}
                  </span>
                ))}
                {/* Show "+N more" if more than 3 events */}
                {events.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{events.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Empty state - no events
            <p className="text-sm text-gray-400">No events available</p>
          )}
        </div>
      </div>

      {/* ===== SECTION SETTINGS ===== */}
      {/* Shows configuration details for this section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Settings</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Data Table */}
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">shared_data</p>
          </div>
          {/* Data Key */}
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'upcomingEventsData'}</p>
          </div>
          {/* Type */}
          <div>
            <span className="text-xs text-gray-500">Type</span>
            <p className="text-sm font-medium text-gray-700">upcoming-events</p>
          </div>
          {/* Status - has data or not */}
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className={`text-sm font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✅ Has Data' : 'No Data'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the Shared Data Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.shared.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Shared Data Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder that this section is read-only and where to make changes */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section uses Shared Data and does not have editable fields directly.
          All event data is managed through the Shared Data Manager.
          Changes made there will automatically reflect here.
        </p>
        <p className="mt-1">
          📍 To edit events, navigate to <strong>Shared Data Manager → Upcoming Events</strong>
        </p>
      </div>
    </div>
  );
};

export default UpcomingEventsEditor;