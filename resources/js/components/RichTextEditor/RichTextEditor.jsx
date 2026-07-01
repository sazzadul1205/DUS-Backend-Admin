/**
 * RichTextEditor Component
 * 
 * A WYSIWYG (What You See Is What You Get) text editor for blog content.
 * Generates clean HTML with Tailwind CSS classes matching the blog seeder format.
 * Supports text formatting, lists, headers, colors, and image insertion.
 * 
 * @param {string} value - HTML content to display/edit
 * @param {function} onChange - Callback function when content changes
 * @param {string} height - Height of the editor (default: '400px')
 * @param {string} className - Additional CSS classes
 * @param {string} placeholder - Placeholder text when empty
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaPalette,
  FaImage,
} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const RichTextEditor = ({
  value = '',
  onChange,
  height = '400px',
  className = '',
  placeholder = 'Write something...',
  onImageUploaded,
}) => {
  // ============================================================
  // REFS
  // ============================================================

  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);
  const savedRangeRef = useRef(null);
  const isInitialized = useRef(false);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);

  // ============================================================
  // STATE
  // ============================================================

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#333333');

  // Image insertion states
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    url: '',
    width: 400,
    alignment: 'center', // 'left' | 'center' | 'right'
    alt: '',
  });
  const [showImageSettingsModal, setShowImageSettingsModal] = useState(false);

  // ============================================================
  // STYLES
  // ============================================================

  const btnClass = "p-1.5 rounded transition flex items-center justify-center text-gray-700 min-w-[36px]";
  const activeBtnClass = "bg-blue-600 text-white";
  const inactiveBtnClass = "hover:bg-gray-200";

  // ============================================================
  // SELECTION MANAGEMENT
  // ============================================================

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      try {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      } catch (e) {
        console.error('Error saving selection:', e);
      }
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      try {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      } catch (e) {
        console.error('Error restoring selection:', e);
      }
    }
  }, []);

  // ============================================================
  // ACTIVE FORMATS
  // ============================================================

  const updateActiveFormats = useCallback(() => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch (e) {
      console.error('Error updating active formats:', e);
    }
  }, []);

  // ============================================================
  // CONTENT CHANGE HANDLERS
  // ============================================================

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      const html = el.innerHTML;
      isInternalUpdate.current = true;
      onChange(html);
    }, 100);
  }, [onChange]);

  // ============================================================
  // COMMAND EXECUTION
  // ============================================================

  const exec = useCallback((cmd, value = null) => {
    const el = editorRef.current;
    if (!el) return;

    el.focus();
    restoreSelection();
    document.execCommand(cmd, false, value);

    const html = el.innerHTML;
    isInternalUpdate.current = true;
    onChange(html);
    updateActiveFormats();
  }, [onChange, restoreSelection, updateActiveFormats]);

  // ============================================================
  // HEADER / LIST / COLOR HANDLERS (unchanged)
  // ============================================================

  const handleHeader = useCallback((level) => {
    const el = editorRef.current;
    if (!el) return;

    el.focus();
    restoreSelection();

    const selection = window.getSelection();
    const selectedText = selection.toString() || ' ';

    if (level === 'normal') {
      const pHtml = `<p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">${selectedText}</p>`;
      document.execCommand('insertHTML', false, pHtml);
    } else {
      const headerClasses = {
        1: 'font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4',
        2: 'font-700 text-xl sm:text-2xl lg:text-3xl text-[#080C14] mt-8 mb-4',
        3: 'font-700 text-lg sm:text-xl lg:text-2xl text-[#080C14] mt-6 mb-3',
        4: 'font-700 text-base sm:text-lg lg:text-xl text-[#080C14] mt-6 mb-3',
        5: 'font-700 text-sm sm:text-base lg:text-lg text-[#080C14] mt-4 mb-2',
        6: 'font-700 text-sm sm:text-base lg:text-base text-[#080C14] mt-4 mb-2',
        7: 'font-700 text-xs sm:text-sm lg:text-sm text-[#080C14] mt-4 mb-2',
      };
      const hHtml = `<h${level} class="${headerClasses[level] || headerClasses[1]}">${selectedText}</h${level}>`;
      document.execCommand('insertHTML', false, hHtml);
    }

    const html = el.innerHTML;
    isInternalUpdate.current = true;
    onChange(html);
    updateActiveFormats();
  }, [onChange, restoreSelection, updateActiveFormats]);

  const handleList = useCallback((type) => {
    const el = editorRef.current;
    if (!el) return;

    el.focus();
    restoreSelection();

    const cmd = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(cmd, false, null);

    let html = el.innerHTML;
    if (type === 'ul') {
      html = html.replace(/<ul>/g, '<ul class="list-disc pl-6 space-y-3 mb-6">');
      html = html.replace(/<li>/g, '<li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">');
    } else {
      html = html.replace(/<ol>/g, '<ol class="list-decimal pl-6 space-y-3 mb-6">');
      html = html.replace(/<li>/g, '<li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">');
    }

    el.innerHTML = html;
    isInternalUpdate.current = true;
    onChange(html);
    updateActiveFormats();
  }, [onChange, restoreSelection, updateActiveFormats]);

  const handleColor = useCallback((color) => {
    setSelectedColor(color);
    exec('foreColor', color);
    setShowColorPicker(false);
  }, [exec]);

  // ============================================================
  // IMAGE INSERTION (NEW)
  // ============================================================

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setUploadingImage(true);
    setShowImageOptions(false);

    try {
      // Read as base64
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to server
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        route('admin.upload-editor-image'),
        { image: base64 },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const url = response.data.url;

      if (onImageUploaded) {
        onImageUploaded(url);
      }

      // Open settings modal with the URL
      setImageSettings({
        url,
        width: 400,
        alignment: 'center',
        alt: file.name.split('.')[0] || 'Image',
      });
      setShowImageSettingsModal(true);
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload image. Please try again.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // reset input
    }
  };

  const insertImageWithSettings = () => {
    const { url, width, alignment, alt } = imageSettings;

    if (!url) {
      Swal.fire({
        icon: 'warning',
        title: 'No Image',
        text: 'Please upload an image first.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const el = editorRef.current;
    if (!el) return;

    el.focus();
    restoreSelection();

    // Build alignment classes
    let alignClass = '';
    let wrapperStyle = '';
    if (alignment === 'left') {
      alignClass = 'float-left mr-4';
    } else if (alignment === 'right') {
      alignClass = 'float-right ml-4';
    } else { // center
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      wrapperStyle = 'text-align: center;';
    }

    // Build image HTML
    const imgTag = `<img src="${url}" alt="${alt || 'Image'}" style="width: ${width}px; max-width: 100%; height: auto;" class="rounded-lg ${alignClass}" />`;

    // Wrap in a div if centered
    let finalHtml = imgTag;
    if (alignment === 'center') {
      finalHtml = `<div style="text-align: center; margin: 1rem 0;">${imgTag}</div>`;
    } else {
      // For left/right we add a small margin via class already, and we wrap in a div with clearfix? not needed.
      // Add a paragraph wrapper or just insert directly.
      // We'll insert as a block with some margin.
      finalHtml = `<div style="margin: 1rem 0;" class="clearfix">${imgTag}</div>`;
    }

    document.execCommand('insertHTML', false, finalHtml);

    // Update content
    const html = el.innerHTML;
    isInternalUpdate.current = true;
    onChange(html);

    // Close modal
    setShowImageSettingsModal(false);
    setImageSettings({ url: '', width: 400, alignment: 'center', alt: '' });
  };

  // ============================================================
  // LIFECYCLE EFFECTS (unchanged)
  // ============================================================

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const el = editorRef.current;
    if (!el || !isInitialized.current) return;

    const currentHtml = el.innerHTML;
    const newValue = value || '';

    const normalize = (str) => str.replace(/\s+/g, ' ').trim();

    if (normalize(currentHtml) !== normalize(newValue)) {
      el.innerHTML = newValue;
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const el = editorRef.current;
      if (el && document.activeElement === el) {
        updateActiveFormats();
        saveSelection();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveFormats, saveSelection]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  const getButtonClass = (key) =>
    `${btnClass} ${activeFormats[key] ? activeBtnClass : inactiveBtnClass}`;

  const colors = [
    '#333333', '#080C14', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
    '#FF1493', '#4B0082', '#556B2F', '#8B4513', '#2F4F4F', '#DC143C',
    '#00CED1', '#808080', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#009BE2'
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={`border border-gray-300 rounded-lg overflow-visible bg-white shadow-sm ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 px-3 py-2 overflow-visible">
        <div className="flex items-center gap-2 min-w-min flex-wrap overflow-visible">

          {/* Headers */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
            <select
              onChange={(e) => handleHeader(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="normal"
            >
              <option value="normal">Normal</option>
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
              <option value="4">H4</option>
              <option value="5">H5</option>
              <option value="6">H6</option>
              <option value="7">H7</option>
            </select>
          </div>

          {/* Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('bold')}
              className={getButtonClass('bold')}
              title="Bold (Ctrl+B)"
            >
              <FaBold size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('italic')}
              className={getButtonClass('italic')}
              title="Italic (Ctrl+I)"
            >
              <FaItalic size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('underline')}
              className={getButtonClass('underline')}
              title="Underline (Ctrl+U)"
            >
              <FaUnderline size={14} />
            </button>
          </div>

          {/* Color */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3 relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`${btnClass} hover:bg-gray-200`}
              title="Text Color"
            >
              <FaPalette size={14} />
            </button>
            {showColorPicker && (
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-xl shadow-2xl p-6"
                style={{ zIndex: 9999, minWidth: '300px' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Choose Color</h3>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColor(color)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform hover:border-blue-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Color</label>
                  <input
                    type="color"
                    onChange={(e) => handleColor(e.target.value)}
                    className="w-full h-12 cursor-pointer rounded-lg"
                    value={selectedColor}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image Insertion */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3 relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowImageOptions(!showImageOptions)}
              className={`${btnClass} hover:bg-gray-200 relative`}
              title="Insert Image"
            >
              <FaImage size={14} />
              {uploadingImage && (
                <span className="absolute -top-1 -right-1 w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
              )}
            </button>

            {showImageOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-20 min-w-45">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition flex items-center gap-2"
                  disabled={uploadingImage}
                >
                  <FaImage size={14} className="text-blue-500" />
                  Upload & Insert Image
                </button>
                <div className="text-xs text-gray-400 px-3 py-1 border-t border-gray-100 mt-1">
                  Max 5MB • JPG, PNG, GIF, WebP
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleList('ul')}
              className={getButtonClass('insertUnorderedList')}
              title="Bulleted List"
            >
              <FaListUl size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleList('ol')}
              className={getButtonClass('insertOrderedList')}
              title="Numbered List"
            >
              <FaListOl size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* Editor Content */}
      <div style={{ height, overflow: 'auto' }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="p-4 min-h-full focus:outline-none prose max-w-none overflow-auto editor-placeholder"
          style={{ minHeight: height }}
          data-placeholder={placeholder}
          aria-label={placeholder}
          role="textbox"
          aria-multiline="true"
        />
      </div>

      {/* Image Settings Modal */}
      {showImageSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Image Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  min="50"
                  max="1200"
                  value={imageSettings.width}
                  onChange={(e) => setImageSettings({ ...imageSettings, width: parseInt(e.target.value) || 400 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="left"
                      checked={imageSettings.alignment === 'left'}
                      onChange={() => setImageSettings({ ...imageSettings, alignment: 'left' })}
                    />
                    Left
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="center"
                      checked={imageSettings.alignment === 'center'}
                      onChange={() => setImageSettings({ ...imageSettings, alignment: 'center' })}
                    />
                    Center
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="right"
                      checked={imageSettings.alignment === 'right'}
                      onChange={() => setImageSettings({ ...imageSettings, alignment: 'right' })}
                    />
                    Right
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={imageSettings.alt}
                  onChange={(e) => setImageSettings({ ...imageSettings, alt: e.target.value })}
                  placeholder="Image description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImageSettingsModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={insertImageWithSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .editor-placeholder:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .editor-placeholder h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .editor-placeholder h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .editor-placeholder h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .editor-placeholder h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .editor-placeholder h5 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .editor-placeholder h6 {
          font-size: 1rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .editor-placeholder h7 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #080C14;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .editor-placeholder p {
          font-weight: 400;
          font-size: 1rem;
          color: #333333;
          line-height: 1.625;
          margin-bottom: 1rem;
        }
        .editor-placeholder strong {
          color: #009BE2;
          font-weight: 700;
        }
        .editor-placeholder ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .editor-placeholder ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .editor-placeholder li {
          font-weight: 400;
          font-size: 1rem;
          color: #333333;
          line-height: 1.625;
          margin-bottom: 0.75rem;
        }
        .editor-placeholder img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        .editor-placeholder .clearfix::after {
          content: "";
          display: table;
          clear: both;
        }
        @media (min-width: 640px) {
          .editor-placeholder p,
          .editor-placeholder li {
            font-size: 1.125rem;
          }
          .editor-placeholder h1 { font-size: 2.5rem; }
          .editor-placeholder h2 { font-size: 2rem; }
          .editor-placeholder h3 { font-size: 1.75rem; }
        }
        @media (min-width: 1024px) {
          .editor-placeholder p,
          .editor-placeholder li {
            font-size: 1.25rem;
          }
          .editor-placeholder h1 { font-size: 3rem; }
          .editor-placeholder h2 { font-size: 2.25rem; }
          .editor-placeholder h3 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;