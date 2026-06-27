/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/hooks/useSectionHelpers.js

/**
 * useSectionHelpers - Custom hook for section management
 * Features:
 * - Section state management
 * - Expand/collapse functionality
 * - Preview toggle
 * - Drag & drop reordering
 * - Move up/down functionality
 * - Edit modal state management
 */

import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { showToast } from '../utils/toastHelper';

export const useSectionHelpers = (initialSections, pageId) => {
  // State
  const [sections, setSections] = useState(initialSections);
  const [expandedSections, setExpandedSections] = useState({});
  const [previewSections, setPreviewSections] = useState({});
  const [isReordering, setIsReordering] = useState(false);
  const [dragError, setDragError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Update sections when prop changes
  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  /**
   * Toggle section expansion (data view)
   */
  const toggleExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  /**
   * Toggle section preview (visual preview)
   */
  const togglePreview = (sectionId) => {
    setPreviewSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  /**
   * Check if section can be moved (not fixed)
   */
  const canMove = (section) => {
    return !section.is_fixed_section;
  };

  /**
   * Check if section has data
   */
  const hasData = (section) => {
    return section.data !== null && section.data !== undefined;
  };

  /**
   * Get data summary for display
   */
  const getDataSummary = (section) => {
    // Special handling for shared_data
    if (section.data_table === 'shared_data') {
      return 'Shared Data';
    }

    // Special handling for content sections
    if (section.section_key === 'content' || section.component === 'ContentSection') {
      return 'Content Section';
    }

    if (!section.data) return 'No data';
    if (Array.isArray(section.data)) {
      return `${section.data.length} items`;
    }
    if (typeof section.data === 'object') {
      const keys = Object.keys(section.data);
      if (keys.includes('data') && section.data.data) {
        if (Array.isArray(section.data.data)) {
          return `${section.data.data.length} items`;
        }
        return 'Has data';
      }
      return `${keys.length} fields`;
    }
    return 'Has data';
  };

  // ============================================================
  // EDIT MODAL HANDLERS
  // ============================================================

  /**
   * Open edit modal for a section
   */
  const handleEditClick = (section) => {
    setEditingSection(section);
    setIsEditModalOpen(true);
  };

  /**
   * Close edit modal
   */
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingSection(null);
  };

  /**
   * Handle successful edit - refresh data
   */
  const handleEditSuccess = () => {
    router.reload({ only: ['sections'] });
  };

  // ============================================================
  // DRAG & DROP REORDERING
  // ============================================================

  /**
   * Handle drag start - store dragged index
   */
  const handleDragStart = (e, index) => {
    const section = sections[index];
    if (!canMove(section)) {
      e.preventDefault();
      showToast('warning', 'Cannot Move Section', 'This section is fixed and cannot be moved.', 2500);
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  /**
   * Handle drag end - reset visual state
   */
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  /**
   * Handle drag over - allow drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Handle drop - reorder sections
   */
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    const dragData = e.dataTransfer.getData('text/plain');
    if (!dragData) return;

    const dragIndex = parseInt(dragData, 10);
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    const draggedSection = sections[dragIndex];
    const dropSection = sections[dropIndex];

    // Check if either section is fixed
    if (!canMove(draggedSection) || !canMove(dropSection)) {
      setDragError('Fixed sections cannot be reordered.');
      showToast('warning', 'Cannot Reorder', 'Fixed sections are locked and cannot be moved.', 2500);
      return;
    }

    setDragError(null);

    // Create new order
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, removed);

    // Update display_order for all sections
    const updatedSections = newSections.map((section, idx) => ({
      ...section,
      display_order: idx,
    }));

    // Update local state immediately for visual feedback
    setSections(updatedSections);
    setIsReordering(true);
    setIsSaving(true);

    // Prepare batch update data
    const orders = updatedSections.map((section) => ({
      id: section.id,
      display_order: section.display_order,
    }));

    // Send to server
    router.post(
      route('backend.cms.sections.update-order', pageId),
      { orders },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsReordering(false);
          setIsSaving(false);
          showToast('success', '✅ Reordered!', 'Section order updated successfully.', 2000);
        },
        onError: (errors) => {
          setIsReordering(false);
          setIsSaving(false);
          // Revert to original order on error
          setSections(initialSections);
          setDragError('Failed to update order. Changes reverted.');
          const errorMessage = errors?.message || 'Failed to update section order. Changes have been reverted.';
          showToast('error', '❌ Reorder Failed', errorMessage, 4000);
        },
      }
    );
  };

  // ============================================================
  // MOVE UP/DOWN HANDLERS (Alternative to drag & drop)
  // ============================================================

  /**
   * Move section up (simulates drop)
   */
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const section = sections[index];
    if (!canMove(section)) {
      showToast('warning', 'Cannot Move', 'This section is fixed and cannot be moved.', 2500);
      return;
    }
    const fakeEvent = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => index.toString(),
      },
    };
    handleDrop(fakeEvent, index - 1);
  };

  /**
   * Move section down (simulates drop)
   */
  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return;
    const section = sections[index];
    if (!canMove(section)) {
      showToast('warning', 'Cannot Move', 'This section is fixed and cannot be moved.', 2500);
      return;
    }
    const fakeEvent = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => index.toString(),
      },
    };
    handleDrop(fakeEvent, index + 1);
  };

  // Return all hooks
  return {
    sections,
    expandedSections,
    previewSections,
    isReordering,
    dragError,
    isSaving,
    editingSection,
    isEditModalOpen,
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
    handleEditClick,
    handleEditClose,
    handleEditSuccess,
  };
};