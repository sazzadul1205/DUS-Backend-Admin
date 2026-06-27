// resources/js/pages/Backend/CMS/Section/utils/toastHelper.js

/**
 * Toast Helper - Notification system using SweetAlert2
 * Features:
 * - Toast notifications with auto-dismiss
 * - Position top-right
 * - Progress bar
 * - Hover to pause timer
 */

import Swal from 'sweetalert2';

/**
 * Show a toast notification
 * @param {string} icon - 'success', 'error', 'warning', 'info'
 * @param {string} title - Notification title
 * @param {string} text - Notification description (optional)
 * @param {number} timer - Duration in milliseconds (default: 3000)
 */
export const showToast = (icon, title, text = '', timer = 3000) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      // Pause timer on hover
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: '!rounded-xl !shadow-2xl',
      title: '!text-sm !font-semibold',
      htmlContainer: '!text-xs !text-gray-600',
    }
  });

  Toast.fire({
    icon,
    title,
    text,
  });
};