// resources/js/pages/Backend/JobListings/Edit.jsx

import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import { FaArrowLeft, FaBriefcase, FaEdit } from 'react-icons/fa';

// Step Components
import { ReviewStep } from '../../../components/JobListingSteps/ReviewStep';
import { LocationStep } from '../../../components/JobListingSteps/LocationStep';
import { StepIndicator } from '../../../components/JobListingSteps/StepIndicator';
import { BasicInfoStep } from '../../../components/JobListingSteps/BasicInfoStep';
import { PublishingStep } from '../../../components/JobListingSteps/PublishingStep';
import { StepNavigation } from '../../../components/JobListingSteps/StepNavigation';
import { RequirementsStep } from '../../../components/JobListingSteps/RequirementsStep';
import { CompensationStep } from '../../../components/JobListingSteps/CompensationStep';

// SweetAlert
import Swal from 'sweetalert2';

export default function Edit({ jobListing, categories, locations }) {
  // Make data available globally for child components
  if (typeof window !== 'undefined') {
    window.categories = categories;
    window.locations = locations;
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Basic Info', component: BasicInfoStep },
    { id: 2, title: 'Requirements', component: RequirementsStep },
    { id: 3, title: 'Location', component: LocationStep },
    { id: 4, title: 'Compensation', component: CompensationStep },
    { id: 5, title: 'Publishing', component: PublishingStep },
    { id: 6, title: 'Review', component: ReviewStep },
  ];

  // Initialize form data from existing job listing
  const [formData, setFormData] = useState({
    // Basic Info
    title: jobListing.title || '',
    category_id: jobListing.category_id || '',
    job_type: jobListing.job_type || '',
    experience_level: jobListing.experience_level || '',
    description: jobListing.description || '',

    // Requirements
    requirements: jobListing.requirements || '',
    skills: jobListing.skills || [],
    responsibilities: jobListing.responsibilities || [],
    benefits: jobListing.benefits || [],
    education_requirement: jobListing.education_requirement || '',
    education_details: jobListing.education_details || '',

    // Location
    location_ids: jobListing.location_ids || [],

    // Compensation
    salary_min: jobListing.salary_min || '',
    salary_max: jobListing.salary_max || '',
    is_salary_negotiable: jobListing.is_salary_negotiable || false,
    as_per_companies_policy: jobListing.as_per_companies_policy || false,
    keywords: jobListing.keywords || [],

    // Publishing
    application_deadline: jobListing.application_deadline || '',
    publish_at: jobListing.publish_at || '',
    is_active: jobListing.is_active ?? true,
    required_linkedin_link: jobListing.required_linkedin_link || false,
    required_facebook_link: jobListing.required_facebook_link || false,
  });

  // Check if any changes were made
  const hasChanges = () => {
    const original = jobListing;
    const current = formData;

    // Compare basic fields
    if (original.title !== current.title) return true;
    if (original.category_id !== current.category_id) return true;
    if (original.job_type !== current.job_type) return true;
    if (original.experience_level !== current.experience_level) return true;
    if (original.description !== current.description) return true;
    if (original.requirements !== current.requirements) return true;
    if (JSON.stringify(original.skills) !== JSON.stringify(current.skills)) return true;
    if (JSON.stringify(original.responsibilities) !== JSON.stringify(current.responsibilities)) return true;
    if (JSON.stringify(original.benefits) !== JSON.stringify(current.benefits)) return true;
    if (original.education_requirement !== current.education_requirement) return true;
    if (original.education_details !== current.education_details) return true;
    if (JSON.stringify(original.location_ids) !== JSON.stringify(current.location_ids)) return true;
    if (original.salary_min !== current.salary_min) return true;
    if (original.salary_max !== current.salary_max) return true;
    if (original.is_salary_negotiable !== current.is_salary_negotiable) return true;
    if (original.as_per_companies_policy !== current.as_per_companies_policy) return true;
    if (JSON.stringify(original.keywords) !== JSON.stringify(current.keywords)) return true;
    if (original.application_deadline !== current.application_deadline) return true;
    if (original.publish_at !== current.publish_at) return true;
    if (original.is_active !== current.is_active) return true;
    if (original.required_linkedin_link !== current.required_linkedin_link) return true;
    if (original.required_facebook_link !== current.required_facebook_link) return true;

    return false;
  };

  // Smart back button - goes to previous page or index
  const handleGoBack = () => {
    if (hasChanges()) {
      Swal.fire({
        title: 'Discard changes?',
        text: 'You have unsaved changes that will be lost if you leave. Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'Stay',
      }).then((result) => {
        if (result.isConfirmed) {
          // Go back to previous page or fallback to index
          if (window.history.length > 1) {
            window.history.back();
          } else {
            router.visit(route('backend.listing.index'));
          }
        }
      });
    } else {
      // Go back to previous page or fallback to index
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.visit(route('backend.listing.index'));
      }
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.title || formData.title.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        }
        if (!formData.category_id) {
          newErrors.category_id = 'Please select a category';
        }
        if (!formData.job_type) {
          newErrors.job_type = 'Please select a job type';
        }
        if (!formData.experience_level) {
          newErrors.experience_level = 'Please select an experience level';
        }
        if (!formData.description || formData.description.replace(/<[^>]*>/g, '').trim().length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        }
        break;

      case 2: // Requirements
        if (!formData.requirements || formData.requirements.replace(/<[^>]*>/g, '').trim().length < 50) {
          newErrors.requirements = 'Requirements must be at least 50 characters';
        }
        if (formData.skills.length === 0) {
          newErrors.skills = 'Please add at least one required skill';
        }
        if (formData.responsibilities.length === 0) {
          newErrors.responsibilities = 'Please add at least one responsibility';
        }
        break;

      case 3: // Location
        if (formData.location_ids.length === 0) {
          newErrors.location_ids = 'Please select at least one location';
        }
        break;

      case 4: // Compensation
        if (formData.salary_min && formData.salary_max && parseFloat(formData.salary_max) < parseFloat(formData.salary_min)) {
          newErrors.salary_max = 'Maximum salary must be greater than or equal to minimum salary';
        }
        break;

      case 5: // Publishing
        if (!formData.application_deadline) {
          newErrors.application_deadline = 'Please set an application deadline';
        }
        break;

      case 6: // Review - Always valid if we got here
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before proceeding.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to a specific step (for review page editing)
  const navigateToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final submission - Update the job listing
  const handleSubmit = () => {
    if (!hasChanges()) {
      Swal.fire({
        icon: 'info',
        title: 'No Changes',
        text: 'You haven\'t made any changes to the job listing.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
    };

    Swal.fire({
      title: 'Update Job Listing?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to update this job listing?</p>
          <ul class="list-disc list-inside text-sm text-gray-600">
            <li>Changes will be visible to applicants immediately</li>
            <li>Active applications will not be affected</li>
            <li>You can revert changes at any time</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update Job',
      cancelButtonText: 'Review Again',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        router.put(route('backend.listing.update', jobListing.id), submitData, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Job Updated!',
              html: `
                <p>Your job listing has been updated successfully.</p>
                <p class="text-sm text-gray-500 mt-2">Changes are now live.</p>
              `,
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.listing.index'));
            });
          },
          onError: (error) => {
            console.error('Update error:', error);

            // Handle validation errors from server
            if (error.response?.data?.errors) {
              setErrors(error.response.data.errors);
              // Navigate back to first step to show errors
              setCurrentStep(1);
              Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the form for errors.',
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update job listing. Please try again.',
                confirmButtonColor: '#2563eb',
              });
            }
            setIsSubmitting(false);
          },
          onFinish: () => {
            setIsSubmitting(false);
          },
        });
      }
    });
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  // Check if current step is the review step
  const isReviewStep = currentStep === steps.length;

  // Custom submit handler for review step
  const handleStepSubmit = () => {
    if (isReviewStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit: ${jobListing.title}`} />

      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          {/* Header */}
          <div className="relative mb-8">

            {/* Back Button - Extreme Left */}
            <button
              onClick={handleGoBack}
              className="group absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 shadow-xs hover:bg-gray-100 hover:text-gray-900 hover:shadow-md transition-all duration-200"
            >
              <FaArrowLeft
                className="transition-transform duration-200 group-hover:-translate-x-1"
                size={14}
              />

              <span className="text-sm font-medium">
                Back
              </span>
            </button>

            {/* Center Content */}
            <div className="flex gap-5 items-center justify-center text-center">

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
                <FaEdit className="w-8 h-8 text-white" />
              </div>

              <div className='text-left' >
                {/* Title */}
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Create Job Listing
                </h1>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Fill in the details below to post a new job opportunity and find the perfect candidate
                </p>
              </div>

              {/* Unsaved Changes */}
              {hasChanges() && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />

                  Unsaved changes
                </div>
              )}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Step Indicator */}
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 pt-6">
              <StepIndicator currentStep={currentStep} steps={steps} />
            </div>

            {/* Form Content */}
            <div className="px-8 py-8">
              <CurrentStepComponent
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
                setFormData={setFormData}
                locations={locations}
                categories={categories}
                onNavigateToStep={navigateToStep}
                isEdit={true}
                originalJob={jobListing}
              />
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
              <StepNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={handleStepSubmit}
                onPrevious={previousStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isValid={true}
                isReviewStep={isReviewStep}
                isEdit={true}
              />
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-ping opacity-75"></div>
                <div className="w-2 h-2 rounded-full bg-orange-600 absolute top-0"></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-xs text-gray-400">
                {Math.round((currentStep / steps.length) * 100)}% complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}