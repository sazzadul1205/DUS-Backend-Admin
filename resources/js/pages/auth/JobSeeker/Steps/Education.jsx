// pages/auth/Steps/Education.jsx

// Icons
import {
  FaPlus,
  FaBook,
  FaAward,
  FaTrashAlt,
  FaBookOpen,
  FaUniversity,
  FaCalendarAlt,
  FaGraduationCap,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { GiBookshelf } from 'react-icons/gi';

// SweetAlert2
import Swal from 'sweetalert2';

const Education = ({ data, setData }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);
  const MAX_EDUCATION = 3;

  const addEducation = () => {
    // Check if already at max limit
    if (data.education_histories.length >= MAX_EDUCATION) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximum Limit Reached',
        text: `You can only add up to ${MAX_EDUCATION} education entries.`,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Got it'
      });
      return;
    }

    setData('education_histories', [
      ...data.education_histories,
      {
        id: Date.now(),
        institution_name: '',
        degree: '',
        passing_year: currentYear
      }
    ]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data.education_histories];
    updated[index][field] = value;
    setData('education_histories', updated);
  };

  const removeEducation = (index) => {
    // Direct removal without any confirmation
    const updated = data.education_histories.filter((_, i) => i !== index);
    setData('education_histories', updated);
  };

  const getDegreeIcon = (degree) => {
    if (degree?.toLowerCase().includes('bachelor')) return <FaBookOpen className="h-4 w-4 text-green-500" />;
    if (degree?.toLowerCase().includes('master')) return <FaAward className="h-4 w-4 text-purple-500" />;
    if (degree?.toLowerCase().includes('phd')) return <FaGraduationCap className="h-4 w-4 text-amber-500" />;
    return <FaBook className="h-4 w-4 text-blue-500" />;
  };

  // Calculate remaining slots
  const remainingSlots = MAX_EDUCATION - data.education_histories.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdSchool className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us about your academic background</p>
            </div>
          </div>

          {/* Limit Indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">
              {data.education_histories.length} / {MAX_EDUCATION} Education
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(data.education_histories.length / MAX_EDUCATION) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {data.education_histories.length === 0 && (
        <div className="text-center py-12 bg-linear-to-b from-gray-50 to-gray-100 rounded-xl">
          <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 shadow-md flex items-center justify-center">
            <GiBookshelf className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No education added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click the button below to add your education</p>
          <p className="text-xs text-gray-400 mt-2">Maximum {MAX_EDUCATION} education entries allowed</p>
        </div>
      )}

      {/* Education List */}
      {data.education_histories.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-5 relative hover:shadow-lg transition-all duration-200 bg-white">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Remove education"
          >
            <FaTrashAlt className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
            <FaUniversity className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-600">Education #{index + 1}</span>
            {edu.degree && (
              <span className="ml-2 flex items-center gap-1">
                {getDegreeIcon(edu.degree)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaUniversity className="h-4 w-4 text-gray-400" />
                  Institution Name
                </span>
              </label>
              <input
                type="text"
                value={edu.institution_name}
                onChange={(e) => updateEducation(index, 'institution_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., University of Dhaka, BUET, North South University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaGraduationCap className="h-4 w-4 text-gray-400" />
                  Degree
                </span>
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., BSc in Computer Science, MBA, HSC, SSC"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passing Year
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={edu.passing_year}
                onChange={(e) => updateEducation(index, 'passing_year', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview of entered data */}
          {(edu.institution_name || edu.degree) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <p className="text-sm font-medium text-gray-700">
                {edu.degree && <span>{edu.degree}</span>}
                {edu.degree && edu.institution_name && <span> from </span>}
                {edu.institution_name && <span>{edu.institution_name}</span>}
                {edu.passing_year && <span className="text-gray-500"> ({edu.passing_year})</span>}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Add Button - Disabled when max reached */}
      <button
        onClick={addEducation}
        disabled={data.education_histories.length >= MAX_EDUCATION}
        className={`w-full py-3.5 border-2 border-dashed rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${data.education_histories.length >= MAX_EDUCATION
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
      >
        <FaPlus className="h-5 w-5" />
        Add Education {data.education_histories.length >= MAX_EDUCATION && '(Maximum Reached)'}
      </button>

      {/* Warning when approaching limit */}
      {remainingSlots === 1 && data.education_histories.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-center gap-2 text-yellow-800">
            <FaExclamationTriangle className="h-5 w-5" />
            <p className="text-sm">
              You can add {remainingSlots} more education entry (Maximum {MAX_EDUCATION})
            </p>
          </div>
        </div>
      )}

      {/* Info Notice */}
      {data.education_histories.length > 0 && data.education_histories.length < MAX_EDUCATION && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-center gap-2">
            <FaGraduationCap className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-600">
              Add all your educational qualifications from highest to lowest level. You can add up to {MAX_EDUCATION} entries.
              {remainingSlots > 0 && ` You can add ${remainingSlots} more.`}
            </p>
          </div>
        </div>
      )}

      {/* Max limit reached notice */}
      {data.education_histories.length === MAX_EDUCATION && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-center gap-2 text-blue-800">
            <FaCheckCircle className="h-5 w-5" />
            <p className="text-sm">
              You've added the maximum of {MAX_EDUCATION} education entries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;