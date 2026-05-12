// resources/js/components/JobListingSteps/PublishingStep.jsx

import { useState, useEffect } from 'react';
import { StepWrapper } from './StepWrapper';

export const PublishingStep = ({ formData, errors, handleChange }) => {
  const [isScheduled, setIsScheduled] = useState(false);

  // Check if publish date is set and in the future
  useEffect(() => {
    const publishDate = formData.publish_at;
    const today = new Date().toISOString().split('T')[0];

    if (publishDate && publishDate > today) {
      setIsScheduled(true);
      // Auto-uncheck is_active when publish date is in the future
      if (formData.is_active) {
        handleChange({ target: { name: 'is_active', value: false } });
      }
    } else {
      setIsScheduled(false);
    }
  }, [formData.publish_at]);

  const handlePublishDateChange = (e) => {
    const newPublishDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    // Auto-uncheck is_active if publish date is in the future
    if (newPublishDate && newPublishDate > today) {
      if (formData.is_active) {
        handleChange({ target: { name: 'is_active', value: false } });
      }
      setIsScheduled(true);
    } else {
      setIsScheduled(false);
    }

    handleChange(e);
  };

  const handleActiveStatusChange = (e) => {
    const isChecked = e.target.checked;
    const publishDate = formData.publish_at;
    const today = new Date().toISOString().split('T')[0];

    // If trying to activate but there's a future publish date, show warning and prevent
    if (isChecked && publishDate && publishDate > today) {
      // Show a toast or alert - you can integrate with your toast notification system
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Scheduled Job',
          text: 'This job has a future publish date. The "Active immediately" option cannot be enabled for scheduled jobs. The job will become active on the scheduled publish date.',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        alert('This job has a future publish date. The "Active immediately" option cannot be enabled for scheduled jobs. The job will become active on the scheduled publish date.');
      }
      return;
    }

    handleChange({ target: { name: 'is_active', value: isChecked } });
  };

  return (
    <StepWrapper
      title="Publishing & Deadlines"
      description="Set when this job should be published and when applications close"
      isActive={true}
      stepNumber={5}
    >
      <div className="space-y-6">
        {/* Application Deadline */}
        <div className='flex w-full gap-5'>
          <div className='w-1/2'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.application_deadline ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.application_deadline && <p className="mt-1 text-sm text-red-500">{errors.application_deadline}</p>}
            <p className="mt-1 text-xs text-gray-500">Last date for candidates to submit applications</p>
          </div>

          {/* Publish Date */}
          <div className='w-1/2'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date (Optional)
            </label>
            <input
              type="date"
              name="publish_at"
              value={formData.publish_at}
              onChange={handlePublishDateChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isScheduled ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to publish immediately. Future date will schedule the job posting.
            </p>
          </div>
        </div>

        {/* Social Media Requirements */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Social Media Requirements</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="required_linkedin_link"
                checked={formData.required_linkedin_link}
                onChange={(e) => handleChange({ target: { name: 'required_linkedin_link', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Require LinkedIn profile for application</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="required_facebook_link"
                checked={formData.required_facebook_link}
                onChange={(e) => handleChange({ target: { name: 'required_facebook_link', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Require Facebook profile for application</span>
            </label>
          </div>
        </div>

        {/* Active Status */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Job Status</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleActiveStatusChange}
                disabled={isScheduled}
                className={`w-4 h-4 rounded ${isScheduled ? 'bg-gray-100 cursor-not-allowed' : 'text-blue-600'}`}
              />
              <span className={`text-sm ${isScheduled ? 'text-gray-400' : 'text-gray-700'}`}>
                Active immediately (subject to publish date and deadline)
              </span>
            </label>

            {isScheduled && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Cannot activate immediately:</strong> This job has a scheduled future publish date.
                  </span>
                </p>
                <p className="text-xs text-red-600 mt-1 ml-6">
                  The job will automatically become active on the scheduled publish date. You cannot manually activate it before that date.
                </p>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Note: Jobs will automatically become inactive after the application deadline
          </p>
        </div>
      </div>
    </StepWrapper>
  );
};