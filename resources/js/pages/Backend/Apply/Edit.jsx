// resources/js/Pages/Backend/Apply/Edit.jsx

// React
import { useState, useEffect } from 'react';

// Inertia
import { Head, router, usePage } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Auth
import { useAuth } from '../../../hooks/useAuth';

// Icons
import {
  FaArrowLeft,
  FaFilePdf,
  FaInfoCircle,
  FaLinkedin,
  FaFacebook,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaTimesCircle,
  FaLightbulb,
  FaShieldAlt,
} from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

export default function ApplyEdit({ application, jobListing, cvs, currentCvId }) {
  const { flash } = usePage().props;

  // Use centralized auth hook
  const {
    user: currentUser,
    isAuthenticated,
    hasAnyPermission,
  } = useAuth();


  // Show flash messages
  useEffect(() => {
    if (flash?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: flash.error,
        confirmButtonColor: '#3b82f6',
      });
    }
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: flash.success,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [flash]);

  // Check if user is the owner of this application
  const isOwner = currentUser?.id === application?.user_id;
  const canEditApplications = hasAnyPermission(['apply.update', 'apply.edit', 'applications.update', 'applications.manage']);

  // Authorization check - only the applicant or admin can edit
  const canEdit = isOwner || canEditApplications;

  // Form state
  const [formData, setFormData] = useState({
    cv_id: currentCvId || cvs.find(cv => cv.is_primary)?.id || cvs[0]?.id || '',
    name: application.name || '',
    email: application.email || '',
    phone: application.phone || '',
    expected_salary: application.expected_salary || '',
    linkedin_link: application.linkedin_link || '',
    facebook_link: application.facebook_link || '',
  });

  // States
  const [errors, setErrors] = useState({});
  const [atsPreview, setAtsPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [showAtsPreview, setShowAtsPreview] = useState(false);

  // Cv state
  const originalCvId = currentCvId;

  // If user is not authenticated, show access denied
  if (!isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Login Required</h2>
            <p className="text-gray-500 mt-2">Please login to edit your application.</p>
            <button
              onClick={() => router.visit(route('login', { redirect: route('backend.apply.edit', application.id) }))}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login Now
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // If user doesn't have permission to edit this application, show access denied
  if (!canEdit) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">
              You don't have permission to edit this application.
            </p>
            <button
              onClick={() => router.visit(route('backend.apply.show', application.id))}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Application
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // If application is not pending, show warning
  if (application.status !== 'pending') {
    return (
      <AuthenticatedLayout>
        <Head title="Cannot Edit Application" />
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
              <div className="bg-linear-to-r from-orange-600 to-red-600 px-6 py-5">
                <h1 className="text-xl font-bold text-white">Application Cannot Be Edited</h1>
              </div>
              <div className="p-8 text-center">
                <FaExclamationTriangle className="text-orange-500 text-5xl mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  Your application has already been {application.status}.
                  You cannot edit it after it has been reviewed by the employer.
                </p>
                <button
                  onClick={() => router.visit(route('backend.apply.show', application.id))}
                  className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Back to Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }


  // Check if salary input should be shown
  const showSalaryInput = () => {
    if (jobListing.as_per_companies_policy) return false;
    if (jobListing.is_salary_negotiable) return false;
    return (jobListing.salary_min || jobListing.salary_max);
  };

  // Get salary placeholder text
  const getSalaryPlaceholder = () => {
    if (jobListing.salary_min && jobListing.salary_max) {
      return `Between ${jobListing.salary_min.toLocaleString()} - ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    if (jobListing.salary_min) {
      return `Minimum ${jobListing.salary_min.toLocaleString()} BDT`;
    }
    if (jobListing.salary_max) {
      return `Maximum ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    return 'Enter your expected salary';
  };

  // Validate salary against range
  const validateSalary = (salary) => {
    if (!salary) return true;
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary)) return false;

    if (jobListing.salary_min && numSalary < jobListing.salary_min) return false;
    if (jobListing.salary_max && numSalary > jobListing.salary_max) return false;
    return true;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get job type label
  const getJobTypeLabel = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'remote': 'Remote',
      'hybrid': 'Hybrid',
    };
    return types[type] || type;
  };

  // Get salary display
  const getSalaryDisplay = () => {
    if (jobListing.as_per_companies_policy) return 'As per company policy';
    if (jobListing.is_salary_negotiable) return 'Negotiable';
    if (jobListing.salary_min && jobListing.salary_max) {
      return `${jobListing.salary_min.toLocaleString()} - ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    if (jobListing.salary_min) return `From ${jobListing.salary_min.toLocaleString()} BDT`;
    if (jobListing.salary_max) return `Up to ${jobListing.salary_max.toLocaleString()} BDT`;
    return 'Not specified';
  };

  // Get ATS score color
  const getAtsScoreColor = (score) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get ATS score background
  const getAtsScoreBg = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle CV selection
  const handleCvSelect = (cvId) => {
    setFormData(prev => ({ ...prev, cv_id: cvId }));
    setAtsPreview(null);
    setShowAtsPreview(false);
  };

  // Preview ATS score before saving
  const handlePreviewAts = () => {
    if (!formData.cv_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Select CV First',
        text: 'Please select a CV to analyze.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsLoadingAts(true);
    setShowAtsPreview(true);

    // Simulate API call - replace with actual endpoint
    setTimeout(() => {
      setIsLoadingAts(false);
      setAtsPreview({
        percentage: Math.floor(Math.random() * 41) + 60,
        matched_count: Math.floor(Math.random() * 15) + 5,
        missing_count: Math.floor(Math.random() * 10) + 1,
        top_matched: ['JavaScript', 'React', 'PHP', 'Laravel', 'API Development'].slice(0, Math.floor(Math.random() * 5) + 2),
        top_missing: ['TypeScript', 'AWS', 'Docker', 'Redis', 'Vue.js'].slice(0, Math.floor(Math.random() * 5) + 1),
        analysis: {
          level: 'Good',
          message: 'Your CV matches many key requirements!',
          color: 'blue',
          suggestions: [
            'Add more specific technical skills',
            'Include quantifiable achievements',
            'Highlight relevant experience'
          ]
        }
      });
    }, 1500);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.cv_id) newErrors.cv_id = 'Please select a CV';
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && formData.phone.trim()) {
      // eslint-disable-next-line no-useless-escape
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (showSalaryInput() && formData.expected_salary) {
      if (!validateSalary(formData.expected_salary)) {
        if (jobListing.salary_min && jobListing.salary_max) {
          newErrors.expected_salary = `Expected salary must be between ${jobListing.salary_min.toLocaleString()} and ${jobListing.salary_max.toLocaleString()} BDT`;
        } else if (jobListing.salary_min) {
          newErrors.expected_salary = `Expected salary must be at least ${jobListing.salary_min.toLocaleString()} BDT`;
        } else if (jobListing.salary_max) {
          newErrors.expected_salary = `Expected salary must not exceed ${jobListing.salary_max.toLocaleString()} BDT`;
        }
      }
    }

    if (jobListing.required_linkedin_link && !formData.linkedin_link) {
      newErrors.linkedin_link = 'LinkedIn profile is required for this application';
    } else if (formData.linkedin_link && !formData.linkedin_link.includes('linkedin.com')) {
      newErrors.linkedin_link = 'Please enter a valid LinkedIn profile URL';
    }

    if (jobListing.required_facebook_link && !formData.facebook_link) {
      newErrors.facebook_link = 'Facebook profile is required for this application';
    } else if (formData.facebook_link && !formData.facebook_link.includes('facebook.com') && !formData.facebook_link.includes('fb.com')) {
      newErrors.facebook_link = 'Please enter a valid Facebook profile URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before saving.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const submissionData = { ...formData };
    if (!submissionData.expected_salary) delete submissionData.expected_salary;
    if (!submissionData.phone) delete submissionData.phone;
    if (!submissionData.linkedin_link) delete submissionData.linkedin_link;
    if (!submissionData.facebook_link) delete submissionData.facebook_link;

    const cvChanged = parseInt(formData.cv_id) !== parseInt(originalCvId);

    Swal.fire({
      title: 'Save Changes?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to update your application for:</p>
          <p class="font-semibold text-blue-600 mb-3">"${jobListing.title.replace(/'/g, "\\'")}"</p>
          <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
            ${cvChanged ? '<li class="text-orange-600">⚠️ Changing your CV will trigger an ATS score recalculation</li>' : ''}
            <li>You can only edit while application is pending</li>
            <li>Changes will be reflected immediately</li>
            <li>The employer will see the updated information</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save Changes',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        router.put(route('backend.apply.update', application.id), submissionData, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: cvChanged ? 'Application Updated! ATS Score Recalculated' : 'Application Updated!',
              html: cvChanged
                ? 'Your application has been updated and your ATS score has been recalculated.<br>Redirecting to application details...'
                : 'Your application has been updated successfully.<br>Redirecting to application details...',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.apply.show', application.id));
            });
          },
          onError: (error) => {
            console.error('Update error:', error);
            if (error.response?.data?.errors) {
              setErrors(error.response.data.errors);
              Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the form for errors.',
                confirmButtonColor: '#3b82f6',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update application. Please try again.',
                confirmButtonColor: '#3b82f6',
              });
            }
            setIsSubmitting(false);
          },
          onFinish: () => setIsSubmitting(false),
        });
      }
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return null;
    return `${new Intl.NumberFormat('en-US').format(amount)} BDT`;
  };

  // Check if job is expired
  const isExpired = new Date(jobListing.application_deadline) < new Date();

  // Show ATS preview
  const AtsPreviewCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 animate-fade-in">
      <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-white" size={18} />
            <h3 className="font-semibold text-white">ATS Score Preview (New CV)</h3>
          </div>
          <button
            onClick={() => setShowAtsPreview(false)}
            className="text-white/80 hover:text-white transition"
          >
            <FaTimesCircle size={16} />
          </button>
        </div>
      </div>
      <div className="p-6">
        {isLoadingAts ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
            <p className="text-gray-600">Analyzing your CV against job requirements...</p>
          </div>
        ) : atsPreview?.error ? (
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">
              <FaExclamationTriangle size={32} className="mx-auto" />
            </div>
            <p className="text-gray-700">{atsPreview.error}</p>
            <button
              onClick={handlePreviewAts}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition"
            >
              Try Again
            </button>
          </div>
        ) : atsPreview ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-3" style={{
                background: `conic-gradient(${atsPreview.percentage >= 80 ? '#10b981' : atsPreview.percentage >= 60 ? '#3b82f6' : atsPreview.percentage >= 40 ? '#f59e0b' : '#ef4444'} ${atsPreview.percentage * 3.6}deg, #e5e7eb ${atsPreview.percentage * 3.6}deg)`
              }}>
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getAtsScoreColor(atsPreview.percentage)}`}>
                    {atsPreview.percentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Compatibility Score</p>
              {atsPreview.analysis && (
                <p className={`text-xs mt-1 ${atsPreview.analysis.color === 'green' ? 'text-green-600' :
                  atsPreview.analysis.color === 'blue' ? 'text-blue-600' :
                    atsPreview.analysis.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {atsPreview.analysis.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-green-600 font-medium">Matched</p>
                <p className="text-2xl font-bold text-green-700">{atsPreview.matched_count || 0}</p>
                <p className="text-xs text-gray-500">keywords</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-red-600 font-medium">Missing</p>
                <p className="text-2xl font-bold text-red-700">{atsPreview.missing_count || 0}</p>
                <p className="text-xs text-gray-500">keywords</p>
              </div>
            </div>

            {atsPreview.top_matched?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">✓ Top Matched Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {atsPreview.top_matched.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {atsPreview.top_missing?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">⚠ Missing Keywords to Add</p>
                <div className="flex flex-wrap gap-1">
                  {atsPreview.top_missing.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {atsPreview.analysis?.suggestions?.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaLightbulb className="text-blue-600" size={14} />
                  <p className="text-xs font-medium text-blue-800">Suggestions to Improve</p>
                </div>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  {atsPreview.analysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-2">
              * Preview based on selected CV. Final score will be calculated after saving.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );

  // Check if job is expired
  if (isExpired) {
    return (
      <AuthenticatedLayout>
        <Head title="Application Deadline Passed" />
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
              <div className="bg-linear-to-r from-red-600 to-orange-600 px-6 py-5">
                <h1 className="text-xl font-bold text-white">Application Deadline Passed</h1>
              </div>
              <div className="p-8 text-center">
                <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  The deadline for this position has passed. You cannot edit this application anymore.
                </p>
                <button
                  onClick={() => router.visit(route('backend.apply.show', application.id))}
                  className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Back to Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Application for ${jobListing.title}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all duration-200"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={14} />
            <span className="text-sm font-medium">Go Back</span>
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fade-in">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-5">
              <h1 className="text-xl font-bold text-white">Edit Application</h1>
              <p className="text-blue-100 text-sm mt-1">Update your application for {jobListing.title}</p>
              {!isOwner && canEditApplications && (
                <p className="text-blue-200 text-xs mt-2">
                  ⚡ Admin mode: Editing application for {application.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Summary Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" />
                    Job Summary
                  </h2>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{jobListing.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt size={14} />
                      <span>Multiple Locations</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock size={14} />
                      <span>{getJobTypeLabel(jobListing.job_type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStar size={14} />
                      <span className="capitalize">{jobListing.experience_level}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign size={14} />
                      <span>Salary: <span className="font-medium">{getSalaryDisplay()}</span></span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <FaClock size={12} />
                    <span>Deadline: {formatDate(jobListing.application_deadline)}</span>
                  </div>
                </div>
              </div>

              {/* ATS Preview Card */}
              {showAtsPreview && <AtsPreviewCard />}

              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Edit Application Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your application details below</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* CV Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select CV / Resume <span className="text-red-500">*</span>
                    </label>
                    {cvs.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-yellow-800 text-sm mb-2">No CV found in your profile</p>
                        <a
                          href={route('profile.index')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Upload a CV first →
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cvs.map((cv) => {
                          const isCurrentCv = parseInt(originalCvId) === cv.id;
                          const isSelected = parseInt(formData.cv_id) === cv.id;
                          const willChangeCv = isSelected && !isCurrentCv;

                          return (
                            <label
                              key={cv.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                ? willChangeCv
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="cv_id"
                                  value={cv.id}
                                  checked={isSelected}
                                  onChange={() => handleCvSelect(cv.id)}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <FaFilePdf className="text-red-500" size={20} />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{cv.original_name}</p>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    {cv.is_primary && (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                                        <FaCheckCircle size={10} /> Primary
                                      </span>
                                    )}
                                    {isCurrentCv && (
                                      <span className="text-xs text-blue-600">(Currently used)</span>
                                    )}
                                    {willChangeCv && (
                                      <span className="text-xs text-orange-600 flex items-center gap-1">
                                        <FaExclamationTriangle size={10} /> Will recalculate ATS
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={cv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View
                              </a>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {errors.cv_id && <p className="text-red-500 text-xs mt-1">{errors.cv_id}</p>}

                    {cvs.length > 0 && formData.cv_id && parseInt(formData.cv_id) !== parseInt(originalCvId) && !showAtsPreview && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handlePreviewAts}
                          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          <FaChartLine size={14} />
                          Preview ATS Score for New CV
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="+880 1234 567890"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {showSalaryInput() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Salary (BDT)
                        </label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            type="number"
                            name="expected_salary"
                            value={formData.expected_salary}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.expected_salary ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder={getSalaryPlaceholder()}
                          />
                        </div>
                        {errors.expected_salary && (
                          <p className="text-red-500 text-xs mt-1">{errors.expected_salary}</p>
                        )}
                        {application.expected_salary && (
                          <p className="text-xs text-gray-400 mt-1">
                            Current: {formatCurrency(application.expected_salary)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(jobListing.required_linkedin_link || jobListing.required_facebook_link) && (
                    <div className="space-y-4">
                      {jobListing.required_linkedin_link && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn Profile <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700" size={16} />
                            <input
                              type="url"
                              name="linkedin_link"
                              value={formData.linkedin_link}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.linkedin_link ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                          {errors.linkedin_link && <p className="text-red-500 text-xs mt-1">{errors.linkedin_link}</p>}
                        </div>
                      )}

                      {jobListing.required_facebook_link && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook Profile <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" size={16} />
                            <input
                              type="url"
                              name="facebook_link"
                              value={formData.facebook_link}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.facebook_link ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="https://facebook.com/username"
                            />
                          </div>
                          {errors.facebook_link && <p className="text-red-500 text-xs mt-1">{errors.facebook_link}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current ATS Score Info */}
                  {application.ats_score && application.ats_calculation_status === 'completed' && (
                    <div className={`rounded-lg p-4 flex items-start gap-3 ${getAtsScoreBg(application.ats_score)}`}>
                      <FaStar className={`mt-0.5 shrink-0 ${getAtsScoreColor(application.ats_score)}`} size={16} />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Current ATS Score: <span className={`font-bold ${getAtsScoreColor(application.ats_score)}`}>{Math.round(application.ats_score)}%</span></p>
                        <p className="text-xs text-gray-600">
                          {application.ats_score >= 80 ? 'Excellent match! Your resume aligns very well with this job.' :
                            application.ats_score >= 70 ? 'Great match! Your resume aligns well with this job.' :
                              application.ats_score >= 60 ? 'Good match. Consider optimizing your resume for better results.' :
                                application.ats_score >= 50 ? 'Average match. We recommend updating your resume with relevant keywords.' :
                                  application.ats_score >= 40 ? 'Below average. Your resume needs more relevant keywords.' :
                                    'Low match. Consider tailoring your resume to this job description.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.ats_calculation_status === 'processing' && (
                    <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3">
                      <FaSpinner className="animate-spin text-yellow-600 mt-0.5 shrink-0" size={16} />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">ATS Score is being calculated</p>
                        <p className="text-xs">Please check back in a few moments.</p>
                      </div>
                    </div>
                  )}

                  {application.ats_calculation_status === 'failed' && (
                    <div className="bg-red-50 rounded-lg p-4 flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-600 mt-0.5 shrink-0" size={16} />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">ATS Score calculation failed</p>
                        <p className="text-xs">Saving changes will trigger a recalculation.</p>
                      </div>
                    </div>
                  )}

                  {/* Info Note */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-0.5 shrink-0" size={16} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Important Notes</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Changing your CV will trigger an ATS score recalculation</li>
                        <li>Your application status will remain as "Pending"</li>
                        <li>Employer will see the updated information</li>
                        <li>You cannot edit after the application is reviewed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.visit(route('backend.apply.show', application.id))}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || cvs.length === 0}
                    className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Tips */}
            <div className="space-y-6">
              {/* Current Application Info */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24 hover:shadow-lg transition-all duration-300">
                <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600">
                  <h3 className="font-semibold text-white">Current Application Info</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Application ID</span>
                    <span className="text-sm font-medium text-gray-900">#{application.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Submitted On</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(application.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FaClock size={10} />
                      Pending
                    </span>
                  </div>
                  {application.ats_score && application.ats_calculation_status === 'completed' && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Current ATS Score</span>
                      <span className={`text-sm font-bold ${getAtsScoreColor(application.ats_score)}`}>
                        {Math.round(application.ats_score)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Tips */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FaLightbulb size={14} />
                    Edit Tips
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Update your CV if needed</p>
                      <p className="text-xs text-gray-500">Choose a more relevant CV for better ATS score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Preview ATS score first</p>
                      <p className="text-xs text-gray-500">See how your new CV matches before saving</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Double-check information</p>
                      <p className="text-xs text-gray-500">Ensure all details are correct before saving</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">ATS score will recalculate</p>
                      <p className="text-xs text-gray-500">If you change your CV, ATS score will update automatically</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-600 mt-0.5 shrink-0" size={16} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important</p>
                    <p className="text-xs">
                      Once your application is reviewed by the employer, you will no longer be able to edit it.
                      Make sure all information is accurate before saving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}