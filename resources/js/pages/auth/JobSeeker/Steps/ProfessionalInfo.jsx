// pages/auth/Steps/ProfessionalInfo.jsx

// Icons
import {
  FaBriefcase,
  FaLink,
  FaChartLine,
  FaUserTie,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaGlobe,
  FaYoutube,
  FaMedium,
  FaDev,
  FaStackOverflow,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import { BiHappy } from 'react-icons/bi';
import { useState } from 'react';

const ProfessionalInfo = ({ data, setData }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Available platforms
  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-600', placeholder: 'https://linkedin.com/in/username' },
    { id: 'github', name: 'GitHub', icon: FaGithub, color: 'text-gray-800', placeholder: 'https://github.com/username' },
    { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400', placeholder: 'https://twitter.com/username' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-700', placeholder: 'https://facebook.com/username' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600', placeholder: 'https://youtube.com/@username' },
    { id: 'medium', name: 'Medium', icon: FaMedium, color: 'text-gray-700', placeholder: 'https://medium.com/@username' },
    { id: 'devto', name: 'Dev.to', icon: FaDev, color: 'text-gray-800', placeholder: 'https://dev.to/username' },
    { id: 'stackoverflow', name: 'Stack Overflow', icon: FaStackOverflow, color: 'text-orange-600', placeholder: 'https://stackoverflow.com/users/123456/username' },
    { id: 'portfolio', name: 'Portfolio', icon: FaGlobe, color: 'text-green-600', placeholder: 'https://your-portfolio.com' }
  ];

  // Get current social links
  const socialLinks = data.social_links || {};

  // Add new social link
  const addSocialLink = () => {
    if (selectedPlatform && socialUrl && socialUrl.trim()) {
      const platformId = selectedPlatform;
      const updatedLinks = {
        ...socialLinks,
        [platformId]: socialUrl.trim()
      };
      setData('social_links', updatedLinks);

      // Reset form
      setSelectedPlatform('');
      setSocialUrl('');
      setShowAddForm(false);
    }
  };

  // Remove social link
  const removeSocialLink = (platformId) => {
    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platformId];
    setData('social_links', updatedLinks);
  };

  // Get platform details by id
  const getPlatformDetails = (platformId) => {
    return platforms.find(p => p.id === platformId) || {
      name: platformId,
      icon: FaLink,
      color: 'text-gray-600'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaBriefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
            <p className="text-sm text-gray-500 mt-1">Tell us about your career</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaChartLine className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={data.experience_years}
              onChange={(e) => setData('experience_years', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">Select experience</option>
              {[...Array(31).keys()].map(y => (
                <option key={y} value={y}>
                  {y === 0 ? 'Fresher' : `${y} year${y > 1 ? 's' : ''}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <FaUserTie className="h-4 w-4 text-gray-400" />
              Current Job Title
            </span>
          </label>
          <input
            type="text"
            value={data.current_job_title}
            onChange={(e) => setData('current_job_title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="e.g., Software Engineer"
          />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center gap-2">
            <FaLink className="h-4 w-4 text-gray-400" />
            Social Links
          </span>
        </label>

        {/* Display existing social links */}
        {Object.keys(socialLinks).length > 0 && (
          <div className="space-y-2 mb-4">
            {Object.entries(socialLinks).map(([platformId, url]) => {
              const platform = getPlatformDetails(platformId);
              const Icon = platform.icon;
              return (
                <div key={platformId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`h-5 w-5 ${platform.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{platform.name}</p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        {url}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSocialLink(platformId)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new social link button */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaPlus className="h-4 w-4" />
            Add Social Link
          </button>
        ) : (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="space-y-3">
              {/* Platform selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a platform</option>
                  {platforms.map(platform => {
                    const Icon = platform.icon;
                    return (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* URL input */}
              {selectedPlatform && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder={platforms.find(p => p.id === selectedPlatform)?.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={addSocialLink}
                  disabled={!selectedPlatform || !socialUrl}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Link
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedPlatform('');
                    setSocialUrl('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Tips */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Popular platforms you can add:</p>
          <div className="flex flex-wrap gap-3">
            {platforms.slice(0, 6).map(platform => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="flex items-center gap-1 text-xs text-gray-600">
                  <Icon className={platform.color} /> {platform.name}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Add your professional social media profiles to showcase your online presence.
          </p>
        </div>
      </div>

      {/* Optional Notice */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-center gap-2">
          <FaBriefcase className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-gray-600">
            All fields are optional. You can skip and update later from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;