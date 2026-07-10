/* eslint-disable no-undef */
// pages/auth/admin-login.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  LoaderCircle, Eye, EyeOff, Shield, Star, Mail, Lock, ArrowRight,
  ChevronUp, ChevronDown, ShieldCheck, Building2
} from 'lucide-react';

export default function AdminLogin({ status, canResetPassword }) {
  // Form state management using Inertia's useForm hook
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  // UI state management
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [focusedField, setFocusedField] = useState(null); // Track which field is focused for styling
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0); // Track current demo account in carousel

  // Handle form submission
  const submit = (e) => {
    e.preventDefault();
    post(route('admin.login'), {
      onFinish: () => reset('password'), // Reset password field after submission
    });
  };

  // Fill form with demo account credentials
  const fillDemoAccount = (email, password) => {
    setData('email', email);
    setData('password', password);
    setData('remember', data.remember); // Preserve remember me state

    // Auto-focus password field after filling
    setTimeout(() => {
      const passwordInput = document.getElementById('password');
      if (passwordInput) passwordInput.focus();
    }, 100);
  };

  // Admin/Staff Demo Accounts - Pre-configured accounts for testing
  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'superadmin@jobportal.com',
      password: 'password',
      icon: ShieldCheck,
      description: 'Full system access with all permissions',
      badge: 'Highest Level',
      badgeColor: 'bg-purple-100 text-purple-700',
      borderColor: 'purple',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonBg: 'bg-purple-50 hover:bg-purple-100',
      buttonBorder: 'border-purple-200',
      buttonText: 'text-purple-700',
    },
    {
      role: 'Admin',
      email: 'admin@jobportal.com',
      password: 'password',
      icon: Shield,
      description: 'Administrative access to manage platform',
      badge: 'Admin Level',
      badgeColor: 'bg-blue-100 text-blue-700',
      borderColor: 'blue',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-50 hover:bg-blue-100',
      buttonBorder: 'border-blue-200',
      buttonText: 'text-blue-700',
    },
    {
      role: 'Employer / HR Manager',
      email: 'hrmanager@company.com',
      password: 'password',
      icon: Building2,
      description: 'Post jobs, manage applications, and find talent',
      badge: 'Employer',
      badgeColor: 'bg-green-100 text-green-700',
      borderColor: 'green',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-50 hover:bg-green-100',
      buttonBorder: 'border-green-200',
      buttonText: 'text-green-700',
    },
  ];

  // Get current demo account from array
  const currentAccount = demoAccounts[currentDemoIndex];

  // Carousel navigation functions
  const goToPrevious = () => {
    setCurrentDemoIndex((prev) => (prev === 0 ? demoAccounts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentDemoIndex((prev) => (prev === demoAccounts.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Page title for SEO */}
      <Head title="Admin Login" />

      {/* Main container - full height with flex centering */}
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">

        {/* Content wrapper with fade animation */}
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">

          {/* Two-column layout: Login form (left) and Demo accounts (right) */}
          <main className="flex w-full max-w-83.75 flex-col lg:max-w-4xl lg:flex-row">

            {/* LEFT COLUMN - Login Form */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">

              {/* Logo Section */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1b1b18] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-tight">Job Match</h1>
                  <p className="text-xs text-[#706f6c]">Admin Panel</p>
                </div>
              </div>

              {/* Page Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold">Admin / Staff Login</h2>
              </div>
              <p className="mb-8 text-[#706f6c]">
                Enter your credentials to access the admin dashboard
              </p>

              {/* Login Form */}
              <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-5">

                  {/* Email Field */}
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#706f6c]" />
                      Email address
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                      <input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="admin@example.com"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 text-sm focus:outline-none placeholder:text-[#706f6c]"
                      />
                    </div>
                    {/* Email validation error */}
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#706f6c]" />
                        Password
                      </label>
                      {/* Forgot password link (if enabled) */}
                      {canResetPassword && (
                        <a
                          href={route('password.request')}
                          className="text-xs text-[#706f6c] hover:text-[#1b1b18] underline-offset-4 hover:underline"
                          tabIndex={5}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none placeholder:text-[#706f6c]"
                      />
                      {/* Password visibility toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Password validation error */}
                    {errors.password && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      id="remember"
                      type="checkbox"
                      tabIndex={3}
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded-sm border-[#19140035] text-[#1b1b18] focus:ring-[#1b1b18]"
                    />
                    <label htmlFor="remember" className="text-sm text-[#706f6c] cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    tabIndex={4}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in as Admin
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider with label */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e3e3e0]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#706f6c]">
                      Admin access only
                    </span>
                  </div>
                </div>

                {/* Link to Job Seeker Login */}
                <div className="text-center text-sm text-[#706f6c] border-t border-[#e3e3e0] pt-4">
                  <span className="text-[#706f6c]">Are you a job seeker? </span>
                  <a
                    href={route('job-seeker.login')}
                    className="font-medium text-orange-600 hover:text-orange-700 hover:underline underline-offset-4"
                  >
                    Login as Job Seeker
                  </a>
                </div>
              </form>

              {/* Status Message (success/error notifications) */}
              {status && (
                <div className="mt-6 rounded-sm border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 flex items-center gap-2">
                  <span className="shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full" />
                  {status}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Demo Accounts Carousel */}
            <div className="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-96 lg:rounded-t-none lg:rounded-r-lg">

              {/* Gradient background */}
              <div className={`absolute inset-0 bg-linear-to-br ${currentAccount.bgGradient}`} />

              <div className="relative p-6 lg:p-8 flex flex-col justify-center h-full">

                {/* Carousel Header */}
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-[#F53003]" />
                    <h3 className="text-lg font-semibold text-[#1b1b18]">Admin Demo Accounts</h3>
                  </div>
                  <p className="text-sm text-[#706f6c]">
                    Try with pre-configured admin accounts
                  </p>
                </div>

                {/* Carousel Navigation - Up/Down Buttons */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={goToPrevious}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
                    title="Previous account"
                  >
                    <ChevronUp className="h-5 w-5 text-[#1b1b18]" />
                  </button>
                  <div className="mx-4 px-3 py-1 rounded-full bg-white/50 text-xs font-medium text-[#706f6c]">
                    {currentDemoIndex + 1} / {demoAccounts.length}
                  </div>
                  <button
                    onClick={goToNext}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
                    title="Next account"
                  >
                    <ChevronDown className="h-5 w-5 text-[#1b1b18]" />
                  </button>
                </div>

                {/* Current Demo Account Card - Shows selected account details */}
                <div className="transition-all duration-300 transform animate-fade-in">
                  <div className={`rounded-xl border shadow-lg overflow-hidden ${currentAccount.buttonBorder} bg-white`}>
                    <div className="p-5">

                      {/* Account Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentAccount.iconBg} transition-all duration-200`}>
                          <currentAccount.icon className={`h-6 w-6 ${currentAccount.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-lg text-[#1b1b18]">
                              {currentAccount.role}
                            </h4>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${currentAccount.badgeColor}`}>
                              {currentAccount.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#706f6c] mt-1">
                            {currentAccount.description}
                          </p>
                        </div>
                      </div>

                      {/* Account Credentials Display */}
                      <div className="space-y-2 mb-5 p-3 rounded-lg bg-[#FDFDFC] border border-[#e3e3e0]">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-[#706f6c] shrink-0" />
                          <span className="text-[#706f6c]">Email:</span>
                          <span className="font-mono font-medium text-[#1b1b18] truncate text-xs break-all">
                            {currentAccount.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Lock className="h-3 w-3 text-[#706f6c] shrink-0" />
                          <span className="text-[#706f6c]">Password:</span>
                          <span className="font-mono font-medium text-[#1b1b18] text-xs">
                            Hidden {/* Password hidden for security */}
                          </span>
                        </div>
                      </div>

                      {/* Use Account Button - Fills form with demo credentials */}
                      <button
                        type="button"
                        onClick={() => fillDemoAccount(currentAccount.email, currentAccount.password)}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${currentAccount.buttonBg} ${currentAccount.buttonBorder} ${currentAccount.buttonText} hover:shadow-md group`}
                      >
                        <span>Use This Account</span>
                        <ArrowRight className="h-3 w-3 transition-all duration-200 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Notice Footer */}
                <div className="mt-6 p-3 rounded-lg bg-yellow-50/80 backdrop-blur-sm border border-yellow-200">
                  <p className="text-xs text-yellow-800 text-center flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin access is restricted to authorized personnel only
                  </p>
                </div>
              </div>

              {/* Border shadow overlay */}
              <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg pointer-events-none" />
            </div>
          </main>
        </div>

        {/* Spacer */}
        <div className="hidden h-14.5 lg:block" />
      </div>

      {/* Animation Styles */}
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
    </>
  );
}