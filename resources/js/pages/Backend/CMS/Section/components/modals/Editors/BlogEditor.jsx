 
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/BlogEditor.jsx

// React
import React from 'react';

// Icons
import { FaExternalLinkAlt, FaBlog, FaInfoCircle } from 'react-icons/fa';

/**
 * BlogEditor - Editor for BlogSection data
 * This section is controlled by the Blogs Page (read-only here)
 * Features:
 * - Shows information about the section
 * - Provides link to Blogs Manager for editing
 * - Displays preview of blog data
 * - Not editable directly (informational only)
 */
const BlogEditor = ({ section, hasData }) => {
  // ===== DATA EXTRACTION =====
  // Get blogs data from section - this is read-only
  const data = section?.data || [];
  const blogs = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Blog Section</h3>

      {/* ===== INFO BOX: CONTROLLED BY BLOGS PAGE ===== */}
      {/* Explains that this section is managed elsewhere */}
      <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <FaBlog size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-orange-800">Controlled by Blogs Page</h4>
            <p className="text-sm text-orange-700 mt-1">
              This section displays blog posts from the <strong>Blogs Manager</strong>.
              It automatically shows all active blog posts.
            </p>
            <p className="text-xs text-orange-600 mt-1">
              To add, edit, or remove blog posts, please go to the Blogs Manager.
              Changes made there will automatically reflect here.
            </p>
          </div>
        </div>
      </div>

      {/* ===== BLOG COUNT AND PREVIEW ===== */}
      {/* Shows how many blogs are available and previews the first few */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Blog Posts</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasData && blogs.length > 0 ? (
            <div className="space-y-2">
              {/* Blog count */}
              <p className="text-xs text-gray-500">
                <span className="font-medium">{blogs.length}</span> blog
                {blogs.length > 1 ? 's' : ''} available
              </p>
              {/* Blog tags - show first 3 */}
              <div className="flex flex-wrap gap-1">
                {blogs.slice(0, 3).map((blog, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {blog.title || `Blog ${idx + 1}`}
                  </span>
                ))}
                {/* Show "+N more" if more than 3 blogs */}
                {blogs.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{blogs.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Empty state - no blogs
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">No blog posts available</p>
              <p className="text-xs text-gray-400 mt-1">
                Add blog posts in the Blogs Manager
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
            <p className="text-sm font-medium text-gray-700">blogs</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'blogsData'}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Component</span>
            <p className="text-sm font-medium text-gray-700">BlogSection</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className={`text-sm font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✅ Has Blogs' : 'No Blogs'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== BLOG STATS ===== */}
      {/* Shows statistics about blogs (total, active, featured) */}
      {hasData && blogs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Blog Stats</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Total blogs */}
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Total</span>
              <p className="text-lg font-bold text-orange-600">{blogs.length}</p>
            </div>
            {/* Active blogs */}
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Active</span>
              <p className="text-lg font-bold text-green-600">
                {blogs.filter(b => b.is_active !== false).length}
              </p>
            </div>
            {/* Featured blogs */}
            <div className="bg-yellow-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Featured</span>
              <p className="text-lg font-bold text-yellow-600">
                {blogs.filter(b => b.is_featured).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== RECENT BLOG PREVIEW ===== */}
      {/* Shows preview of the most recent 2 blogs */}
      {hasData && blogs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Blog Preview</h4>
          <div className="space-y-2">
            {blogs.slice(0, 2).map((blog, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                {/* Blog title */}
                <p className="text-xs font-medium text-gray-700">{blog.title || `Blog ${idx + 1}`}</p>
                {/* Blog excerpt (if available) */}
                {blog.excerpt && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                )}
                {/* Blog date (if available) */}
                {blog.date && (
                  <p className="text-xs text-gray-400 mt-1">{blog.date}</p>
                )}
              </div>
            ))}
            {/* Show if more blogs exist */}
            {blogs.length > 2 && (
              <p className="text-xs text-gray-400 text-center">
                + {blogs.length - 2} more blogs available
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== NO DATA STATE ===== */}
      {/* Shows when no blogs exist yet */}
      {!hasData && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-yellow-600" size={16} />
            <p className="text-sm text-yellow-700">
              No blog posts have been created yet.
            </p>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Go to the Blogs Manager to create your first blog post.
          </p>
        </div>
      )}

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the Blogs Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.blogs.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Blogs Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder that this section is read-only */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section is controlled by the Blogs Manager.
          You cannot edit blog content directly here.
        </p>
        <p className="mt-1">
          📍 To manage blogs, navigate to <strong>Blogs Manager</strong> in the CMS sidebar.
          All changes made there will automatically appear in this section.
        </p>
      </div>
    </div>
  );
};

export default BlogEditor;