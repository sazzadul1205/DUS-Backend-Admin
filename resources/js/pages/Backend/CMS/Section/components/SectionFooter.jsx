// resources/js/pages/Backend/CMS/Section/components/SectionFooter.jsx

/**
 * SectionFooter - Footer with summary statistics and helpful tips
 * Features:
 * - Section statistics summary
 * - Drag & drop instructions
 * - Fixed section indicator
 */

import React from 'react';
import { FaGripVertical } from 'react-icons/fa';

const SectionFooter = ({ sections, hasData }) => {
  // Calculate statistics from sections
  const stats = {
    total: sections.length,
    banner: sections.filter(s => s.component === 'HomeBanner' || s.component === 'PageBannerSection').length,
    fixed: sections.filter(s => s.is_fixed_section).length,
    shared: sections.filter(s => s.data_table === 'shared_data').length,
    jobs: sections.filter(s => s.data_table === 'jobs').length,
    programs: sections.filter(s => s.data_table === 'programs' || s.component === 'OurProgramsSection').length,
    hasData: sections.filter(s => hasData(s)).length,
  };

  return (
    <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
      {/* Total Sections */}
      <span>📊 Total: {stats.total} sections</span>

      {/* Banner Sections */}
      <span>⭐ Banner: {stats.banner}</span>

      {/* Fixed Sections */}
      <span>🔒 Fixed: {stats.fixed}</span>

      {/* Shared Sections */}
      <span>🔄 Shared: {stats.shared}</span>

      {/* Jobs Sections */}
      <span>💼 Jobs: {stats.jobs}</span>

      {/* Programs Sections */}
      <span>📋 Programs: {stats.programs}</span>

      {/* Sections with Data */}
      <span>📦 Has Data: {stats.hasData}</span>

      {/* Drag & Drop Instructions */}
      <span>
        💡 Drag the <FaGripVertical className="inline text-gray-400" size={12} /> handle or use ↑ ↓ buttons to reorder
      </span>

      {/* Fixed Sections Notice */}
      <span>🔒 Fixed sections cannot be moved</span>
    </div>
  );
};

export default SectionFooter;