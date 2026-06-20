// pages/auth/forgot-password.jsx

// React
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icons
import { FaSpinner, FaEnvelope, FaArrowLeft, FaPaperPlane, FaKey, FaEnvelopeOpenText } from 'react-icons/fa';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    
    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot password" />
            
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-rose-400 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>
                
                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Logo and Header */}
                    <div className="text-center animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <div className="bg-linear-to-r from-purple-500 to-pink-600 rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <FaKey className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Forgot password?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center text-sm font-medium text-green-700 animate-slide-in">
                            <FaEnvelopeOpenText className="inline h-4 w-4 mr-2" />
                            {status}
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="animate-fade-in-up animation-delay-100">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="off"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-all duration-300"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.email}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up animation-delay-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {processing ? (
                                    <FaSpinner className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <FaPaperPlane className="h-5 w-5 mr-2" />
                                        Email password reset link
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Help Section */}
                    <div className="animate-fade-in-up animation-delay-300">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="text-center text-sm text-gray-600">
                                <p className="mb-2">Remember your password?</p>
                                <a 
                                    href={route('login')} 
                                    className="inline-flex items-center font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    <FaArrowLeft className="h-3 w-3 mr-1" />
                                    Back to log in
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-purple-50 rounded-lg p-4 animate-fade-in-up animation-delay-400">
                        <h4 className="text-sm font-medium text-purple-900 mb-2">💡 Tips:</h4>
                        <ul className="space-y-1 text-xs text-purple-700">
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full mr-2"></span>
                                Check your spam folder if you don't see the email
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full mr-2"></span>
                                The reset link expires in 60 minutes
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full mr-2"></span>
                                Make sure to use the email you registered with
                            </li>
                        </ul>
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
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </>
    );
}