// resources/js/pages/Backend/CMS/Section/components/SectionTable.jsx

/**
 * SectionTable - Table displaying all sections with their data
 * Features:
 * - Header with column labels
 * - Rows with drag & drop support
 * - Empty state message
 * - Props passed to SectionRow
 */

import React from 'react';
import SectionRow from './SectionRow';

const SectionTable = ({
  sections,
  expandedSections,
  previewSections,
  isReordering,
  isSaving,
  hasData,
  getDataSummary,
  canMove,
  toggleExpand,
  togglePreview,
  handleMoveUp,
  handleMoveDown,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  onEditClick,
}) => {
  // Empty state - no sections found
  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No sections found for this page
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Section
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Component
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {sections.map((section, index) => {
            // Get state for this section
            const isExpanded = expandedSections[section.id] || false;
            const isPreviewOpen = previewSections[section.id] || false;
            const hasSectionData = hasData(section);
            const dataSummary = getDataSummary(section);
            const isMovable = canMove(section);

            return (
              <SectionRow
                key={section.id}
                section={section}
                index={index}
                totalSections={sections.length}
                isExpanded={isExpanded}
                isPreviewOpen={isPreviewOpen}
                isReordering={isReordering}
                isSaving={isSaving}
                isMovable={isMovable}
                hasSectionData={hasSectionData}
                dataSummary={dataSummary}
                onToggleExpand={toggleExpand}
                onTogglePreview={togglePreview}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onEditClick={onEditClick}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SectionTable;