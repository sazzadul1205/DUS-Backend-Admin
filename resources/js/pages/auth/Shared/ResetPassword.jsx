// pages/auth/reset-password.jsx

// React
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icons
import { FaSpinner, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaKey, FaShieldAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />

            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Logo and Header */}
                    <div className="text-center animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <FaKey className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter your new password below
                        </p>
                    </div>

                    {/* Reset Password Form */}
                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="space-y-4">
                            {/* Email Field (Read Only) */}
                            <div className="animate-fade-in-up animation-delay-100">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={data.email}
                                        readOnly
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.email}</p>
                                )}
                            </div>

                            {/* New Password Field */}
                            <div className="animate-fade-in-up animation-delay-200">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New password
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoFocus
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.password}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="animate-fade-in-up animation-delay-300">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm new password
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'confirm' ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaShieldAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        onFocus={() => setFocusedField('confirm')}
                                        onBlur={() => setFocusedField(null)}
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up animation-delay-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {processing ? (
                                    <FaSpinner className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <FaCheckCircle className="h-5 w-5 mr-2" />
                                        Reset password
                                        <FaArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 rounded-lg p-4 animate-fade-in-up animation-delay-500">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">🔒 Password requirements:</h4>
                        <ul className="space-y-1 text-xs text-blue-700">
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                At least 8 characters long
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                Use a mix of letters, numbers, and symbols
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                Don't use common or easily guessed passwords
                            </li>
                        </ul>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center animate-fade-in-up animation-delay-600">
                        <a
                            href={route('login')}
                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            ← Back to log in
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }
                
                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
                
                .animation-delay-100 {
                    animation-delay: 0.1s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </>
    );
}