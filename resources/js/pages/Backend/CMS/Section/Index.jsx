// resources/js/pages/Backend/CMS/Section/Index.jsx

/**
 * Index - Main Section Management Page
 * Features:
 * - Authenticated layout wrapper
 * - Section header with stats
 * - Section table with all sections
 * - Footer with summary
 * - Edit modal for section editing
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';

// Hooks
import { useSectionHelpers } from './hooks/useSectionHelpers';

// Components
import SectionHeader from './components/SectionHeader';
import SectionTable from './components/SectionTable';
import SectionFooter from './components/SectionFooter';
import SectionEditModal from './components/SectionEditModal';

// Utils
import { getSectionStats } from './utils/sectionHelpers';

const Index = ({ page, sections: initialSections }) => {
  // Use custom hook for section management
  const {
    sections,
    expandedSections,
    previewSections,
    isReordering,
    dragError,
    isSaving,
    toggleExpand,
    togglePreview,
    hasData,
    getDataSummary,
    canMove,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleMoveUp,
    handleMoveDown,
    editingSection,
    isEditModalOpen,
    handleEditClick,
    handleEditClose,
    handleEditSuccess,
  } = useSectionHelpers(initialSections, page.id);

  // Calculate statistics for header
  const stats = getSectionStats(sections);

  return (
    <AuthenticatedLayout>
      {/* Page Title */}
      <Head title={`Sections - ${page.name}`} />

      <div className="p-6">
        {/* Header with Stats */}
        <SectionHeader
          page={page}
          sections={sections}
          stats={stats}
          isSaving={isSaving}
          dragError={dragError}
        />

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <SectionTable
            sections={sections}
            expandedSections={expandedSections}
            previewSections={previewSections}
            isReordering={isReordering}
            isSaving={isSaving}
            hasData={hasData}
            getDataSummary={getDataSummary}
            canMove={canMove}
            toggleExpand={toggleExpand}
            togglePreview={togglePreview}
            handleMoveUp={handleMoveUp}
            handleMoveDown={handleMoveDown}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            onEditClick={handleEditClick}
          />
        </div>

        {/* Footer with Summary */}
        <SectionFooter sections={sections} hasData={hasData} />

        {/* Edit Modal */}
        <SectionEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          section={editingSection}
          pageId={page.id}
          onSuccess={handleEditSuccess}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;