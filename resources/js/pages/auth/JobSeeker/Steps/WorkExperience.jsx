// pages/auth/Steps/WorkExperience.jsx

// Icons
import {
  FaPlus,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { GiSuitcase } from 'react-icons/gi';
import { MdWork, MdBusinessCenter } from 'react-icons/md';

// SweetAlert2
import Swal from 'sweetalert2';

const WorkExperience = ({ data, setData }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);
  const MAX_EXPERIENCES = 3;

  const addJobHistory = () => {
    // Check if already at max limit
    if (data.job_histories.length >= MAX_EXPERIENCES) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximum Limit Reached',
        text: `You can only add up to ${MAX_EXPERIENCES} work experiences.`,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Got it'
      });
      return;
    }

    setData('job_histories', [
      ...data.job_histories,
      {
        id: Date.now(),
        company_name: '',
        position: '',
        starting_year: currentYear,
        ending_year: null,
        is_current: false
      }
    ]);
  };

  const updateJobHistory = (index, field, value) => {
    const updated = [...data.job_histories];
    updated[index][field] = value;
    if (field === 'is_current' && value === true) {
      updated[index].ending_year = null;
    }
    setData('job_histories', updated);
  };

  const removeJobHistory = (index) => {
    // Direct removal without any confirmation
    const updated = data.job_histories.filter((_, i) => i !== index);
    setData('job_histories', updated);
  };

  // Calculate remaining slots
  const remainingSlots = MAX_EXPERIENCES - data.job_histories.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdWork className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us about your professional background</p>
            </div>
          </div>

          {/* Limit Indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">
              {data.job_histories.length} / {MAX_EXPERIENCES} Experiences
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(data.job_histories.length / MAX_EXPERIENCES) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {data.job_histories.length === 0 && (
        <div className="text-center py-12 bg-linear-to-b from-gray-50 to-gray-100 rounded-xl">
          <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 shadow-md flex items-center justify-center">
            <GiSuitcase className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No work experience added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click the button below to add your experience</p>
          <p className="text-xs text-gray-400 mt-2">Maximum {MAX_EXPERIENCES} experiences allowed</p>
        </div>
      )}

      {/* Work Experience List */}
      {data.job_histories.map((job, index) => (
        <div key={job.id} className="border border-gray-200 rounded-xl p-5 relative hover:shadow-lg transition-all duration-200 bg-white">
          <button
            onClick={() => removeJobHistory(index)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Remove experience"
          >
            <FaTrashAlt className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
            <MdBusinessCenter className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-600">Experience #{index + 1}</span>
            {job.is_current && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <FaCheckCircle className="h-3 w-3" />
                Current
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaBuilding className="h-4 w-4 text-gray-400" />
                  Company Name
                </span>
              </label>
              <input
                type="text"
                value={job.company_name}
                onChange={(e) => updateJobHistory(index, 'company_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Google, Microsoft, Local Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaBriefcase className="h-4 w-4 text-gray-400" />
                  Position
                </span>
              </label>
              <input
                type="text"
                value={job.position}
                onChange={(e) => updateJobHistory(index, 'position', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={job.starting_year}
                  onChange={(e) => updateJobHistory(index, 'starting_year', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {job.is_current ? 'Ending Year' : 'Ending Year (if applicable)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={job.ending_year || ''}
                  onChange={(e) => updateJobHistory(index, 'ending_year', e.target.value ? parseInt(e.target.value) : null)}
                  disabled={job.is_current}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                >
                  <option value="">Present</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={job.is_current}
                onChange={(e) => updateJobHistory(index, 'is_current', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <FaCheckCircle className="h-4 w-4 text-green-500" />
                I currently work here
              </span>
            </label>
          </div>
        </div>
      ))}

      {/* Add Button - Disabled when max reached */}
      <button
        onClick={addJobHistory}
        disabled={data.job_histories.length >= MAX_EXPERIENCES}
        className={`w-full py-3.5 border-2 border-dashed rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${data.job_histories.length >= MAX_EXPERIENCES
          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
      >
        <FaPlus className="h-5 w-5" />
        Add Work Experience {data.job_histories.length >= MAX_EXPERIENCES && '(Maximum Reached)'}
      </button>

      {/* Warning when approaching limit */}
      {remainingSlots === 1 && data.job_histories.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-center gap-2 text-yellow-800">
            <FaExclamationTriangle className="h-5 w-5" />
            <p className="text-sm">
              You can add {remainingSlots} more work experience (Maximum {MAX_EXPERIENCES})
            </p>
          </div>
        </div>
      )}

      {/* Info Notice */}
      {data.job_histories.length > 0 && data.job_histories.length < MAX_EXPERIENCES && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-center gap-2">
            <FaBriefcase className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-600">
              Add all your relevant work experiences. You can add up to {MAX_EXPERIENCES} experiences.
              {remainingSlots > 0 && ` You can add ${remainingSlots} more.`}
            </p>
          </div>
        </div>
      )}

      {/* Max limit reached notice */}
      {data.job_histories.length === MAX_EXPERIENCES && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-center gap-2 text-blue-800">
            <FaCheckCircle className="h-5 w-5" />
            <p className="text-sm">
              You've added the maximum of {MAX_EXPERIENCES} work experiences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperience;