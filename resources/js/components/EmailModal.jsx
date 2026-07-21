 
// resources/js/components/EmailModal.jsx
// React
import { useState, useEffect } from 'react';

// Axios
import axios from 'axios';

// SweetAlert
import Swal from 'sweetalert2';

// Icons
import {
  FaEnvelope,
  FaMagic,
  FaSpinner,
  FaPaperPlane,
  FaCode,
  FaEye as FaPreview,
} from 'react-icons/fa';

// Email templates
const EMAIL_TEMPLATES = {
  shortlisted: {
    name: 'Shortlisted - Interview Invitation',
    subject: "Congratulations! You've been Shortlisted - Interview Invitation",
    content: `<p>Congratulations! We are pleased to inform you that your application has been shortlisted for the next stage of our recruitment process.</p>

<p>We were impressed with your qualifications and experience, and we would like to invite you for an interview to discuss your potential contribution to our team.</p>

<p><strong>Interview Details:</strong><br>
• Date: [Date to be confirmed]<br>
• Time: [Time to be confirmed]<br>
• Location/Venue: [Online or Office Address]<br>
• Duration: Approximately 45-60 minutes</p>

<p><strong>What to prepare:</strong><br>
• Updated resume/CV<br>
• Portfolio (if applicable)<br>
• Government-issued ID<br>
• Any certificates or credentials mentioned in your application</p>

<p>Please reply to this email within 3 business days to confirm your availability for the interview. You can suggest alternative time slots if the proposed schedule doesn't work for you.</p>

<p>We look forward to meeting you and learning more about your qualifications!</p>

<p>Best regards,<br>
<strong>Hiring Team</strong></p>`
  },
  rejected: {
    name: 'Application Status Update - Not Selected',
    subject: 'Update on Your Application',
    content: `<p>Thank you for your interest in joining our team and for taking the time to apply for the position.</p>

<p>After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely align with our current requirements for this role.</p>

<p>This was a difficult decision as we received many strong applications. We encourage you to keep an eye on our careers page for future opportunities that may be a better match for your skills and experience.</p>

<p>We appreciate your interest in our company and wish you the very best in your job search and future career endeavors.</p>

<p>Thank you again for your application.</p>

<p>Sincerely,<br>
<strong>Hiring Team</strong></p>`
  },
  hired: {
    name: 'Job Offer - Congratulations!',
    subject: 'Job Offer: Congratulations on Your Selection!',
    content: `<p><strong>🎉 Congratulations! 🎉</strong></p>

<p>We are absolutely delighted to inform you that you have been selected for the position! After a thorough review process, we were thoroughly impressed with your skills, experience, and enthusiasm.</p>

<p><strong>Offer Details:</strong><br>
• Position: [Job Title]<br>
• Start Date: [Proposed Start Date]<br>
• Working Hours: [Full-time/Part-time/Flexible]<br>
• Compensation Package: As discussed during the interview process</p>

<p><strong>Next Steps:</strong><br>
1. Please review the attached offer letter and employment agreement<br>
2. Complete the online onboarding form (link below)<br>
3. Submit required documents for background verification<br>
4. Schedule your first day orientation</p>

<p><strong>To accept this offer:</strong><br>
Please reply to this email confirming your acceptance by [Date]. Once we receive your acceptance, we will proceed with the onboarding process and provide you with more detailed information about your first day.</p>

<p>If you have any questions or need clarification on any aspect of the offer, please don't hesitate to reach out. We want to ensure you have all the information you need to make an informed decision.</p>

<p>We're excited about the possibility of you joining our team and can't wait to see the great things we'll accomplish together!</p>

<p>Warmest congratulations,<br>
<strong>Hiring Team</strong></p>`
  },
  pending: {
    name: 'Application Received - Under Review',
    subject: "Application Received - We're Reviewing Your Profile",
    content: `<p>Thank you for submitting your application for the position at our company.</p>

<p>We have received your application and our hiring team is currently reviewing it carefully. We appreciate your interest in joining our organization and we're excited about the possibility of working with you.</p>

<p><strong>What happens next?</strong><br>
• Our team will review your qualifications against the role requirements<br>
• If shortlisted, you will receive an interview invitation within 5-7 business days<br>
• We will keep you updated on your application status via email</p>

<p>In the meantime, feel free to:<br>
• Check out our company blog to learn more about our culture<br>
• Follow us on social media for company updates<br>
• Prepare any additional materials that might strengthen your application</p>

<p>We truly appreciate your patience during this process. We receive many applications for each position, but we personally review each one to find the best fit for our team.</p>

<p>Thank you again for considering us as your potential employer.</p>

<p>Best regards,<br>
<strong>Hiring Team</strong></p>`
  },
  interview_followup: {
    name: 'Post-Interview Follow-up',
    subject: 'Thank You for Your Interview',
    content: `<p>Thank you for taking the time to interview with us for the position. It was a pleasure meeting you and learning more about your background and aspirations.</p>

<p>We were impressed with your insights and the thoughtful questions you raised during our conversation. Your experience in [specific area] particularly stood out to us.</p>

<p><strong>Next Steps:</strong><br>
• Our team will be reviewing all interviewed candidates this week<br>
• We expect to make a decision by [Date]<br>
• We will contact you regarding the outcome, regardless of the final decision</p>

<p>If you have any additional information you'd like to share or questions that have come up since our conversation, please don't hesitate to reach out.</p>

<p>Thank you again for your interest in joining our team. We look forward to potentially working together!</p>

<p>Warm regards,<br>
<strong>Hiring Team</strong></p>`
  },
  document_request: {
    name: 'Additional Documents Request',
    subject: 'Additional Information Required for Your Application',
    content: `<p>Thank you for your interest in the position at our company. Your application has progressed to the next stage of our review process.</p>

<p>To proceed further, we kindly request the following additional documents/information:</p>

<p><strong>Required Documents:</strong><br>
• Copy of your educational certificates (Bachelor's/Master's degree)<br>
• Professional certification documents<br>
• Portfolio or work samples (if applicable)<br>
• References (at least 2 professional contacts)<br>
• Portfolio or work samples demonstrating relevant projects</p>

<p>Please submit these documents by [Date] through your application dashboard or by replying to this email with the attachments.</p>

<p>Once we receive these documents, we will continue with our evaluation process and contact you regarding the next steps.</p>

<p>Thank you for your cooperation and understanding.</p>

<p>Best regards,<br>
<strong>Hiring Team</strong></p>`
  },
  custom: {
    name: 'Custom Message',
    subject: '',
    content: ''
  }
};

const EmailModal = ({
  isOpen,
  onClose,
  recipients,
  onSuccess,
  title = "Send Email",
  jobTitle = null
}) => {
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  });

  // Reset form when modal opens with new recipients
  useEffect(() => {
    if (isOpen) {
      setEmailData({ subject: '', content: '' });
      setSelectedTemplate('');
      setShowPreview(false);
    }
  }, [isOpen, recipients]);

  if (!isOpen) return null;

  const getRecipientInfo = () => {
    if (!recipients || recipients.length === 0) return '';

    if (recipients.length === 1) {
      const recipient = recipients[0];
      return `To: ${recipient.name} (${recipient.email})`;
    }

    return `To: ${recipients.length} selected applicant(s)`;
  };

  const applyTemplate = (templateKey) => {
    if (templateKey === 'custom') {
      setEmailData({ subject: '', content: '' });
      setSelectedTemplate('custom');
      return;
    }

    const template = EMAIL_TEMPLATES[templateKey];
    if (template) {
      setEmailData({
        subject: template.subject,
        content: template.content
      });
      setSelectedTemplate(templateKey);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
    if (name === 'content') {
      setSelectedTemplate('');
    }
  };

  const insertPlaceholder = (placeholder) => {
    const textarea = document.getElementById('email-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = emailData.content;
    const before = text.substring(0, start);
    const after = text.substring(end);

    setEmailData({
      ...emailData,
      content: before + placeholder + after
    });

    // Set focus back to textarea after state update
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + placeholder.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSendEmail = async () => {
    if (!emailData.subject.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Subject',
        text: 'Please enter an email subject.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!emailData.content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Content',
        text: 'Please enter email content.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsSending(true);

    try {
      let response;

      if (recipients.length === 1) {
        // Send single email
        response = await axios.post(route('backend.applications.send-email', recipients[0].id), {
          subject: emailData.subject,
          content: emailData.content,
        });
      } else {
        // Send bulk email
        response = await axios.post(route('backend.applications.bulk-send-email'), {
          application_ids: recipients.map(r => r.id),
          subject: emailData.subject,
          content: emailData.content,
        });
      }

      if (response.data.success) {
        let message = response.data.message;
        if (response.data.failed_emails && response.data.failed_emails.length > 0) {
          message += `\n\nFailed emails: ${response.data.failed_emails.join(', ')}`;
        }

        Swal.fire({
          icon: response.data.failed_emails?.length > 0 ? 'warning' : 'success',
          title: 'Email Process Completed',
          text: message,
          confirmButtonColor: '#3b82f6',
        });

        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send Email',
        text: error.response?.data?.message || error.message || 'An error occurred while sending the email.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Quick insert placeholders
  const placeholders = [
    { label: 'Interview Date', value: '<p><strong>Interview Date:</strong> [Insert Date]</p>' },
    { label: 'Location/Link', value: '<p><strong>Location:</strong> [Insert Address/Zoom Link]</p>' },
    { label: 'Document List', value: '<p><strong>Required Documents:</strong><br>• Document 1<br>• Document 2</p>' },
    { label: 'Deadline', value: '<p><strong>Deadline:</strong> [Insert Date]</p>' },
    { label: 'Job Title', value: jobTitle ? `<p><strong>Position:</strong> ${jobTitle}</p>` : '<p><strong>Position:</strong> [Job Title]</p>' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSending && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FaEnvelope className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600">{getRecipientInfo()}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Templates */}
          <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaMagic className="text-purple-500" />
              Quick Templates
            </p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => applyTemplate(key)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all
                  ${selectedTemplate === key
                      ? 'bg-purple-600 text-white border-purple-600 shadow'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleInputChange}
              placeholder="Enter email subject..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              disabled={isSending}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                Email Content *
              </label>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                {showPreview ? <FaCode /> : <FaPreview />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {!showPreview ? (
              <>
                <textarea
                  id="email-content-textarea"
                  name="content"
                  rows={12}
                  value={emailData.content}
                  onChange={handleInputChange}
                  placeholder="Write your email content here... (HTML supported)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono shadow-sm"
                  disabled={isSending}
                />

                <p className="text-xs text-gray-500 mt-1">
                  Supports HTML tags like &lt;strong&gt;, &lt;br&gt;, &lt;ul&gt;
                </p>
              </>
            ) : (
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                  Preview
                </div>
                <div className="p-4 bg-white max-h-96 overflow-y-auto">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: `
                      <h2>${emailData.subject}</h2>
                      ${emailData.content}
                    `
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Insert */}
          {!showPreview && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-medium text-blue-800 mb-2">
                Quick Insert
              </p>

              <div className="flex flex-wrap gap-2">
                {placeholders.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => insertPlaceholder(p.value)}
                    className="text-xs px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSendEmail}
            disabled={
              isSending ||
              !emailData.subject.trim() ||
              !emailData.content.trim()
            }
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow"
          >
            {isSending ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Email{recipients?.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;