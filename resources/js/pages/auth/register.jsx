// pages/auth/register.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  LoaderCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  UserPlus,
  Info,
  Briefcase,
  Star
} from 'lucide-react';

export default function Register({ googleAuthEnabled, status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Register" />
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 ">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-83.75 flex-col lg:max-w-4xl lg:flex-row">
            {/* Left side - Registration Form */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1b1b18] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-tight">Job Match</h1>
                  <p className="text-xs text-[#706f6c]">Find your perfect match</p>
                </div>
              </div>

              <h2 className="mb-1 text-2xl font-semibold">Create account</h2>
              <p className="mb-8 text-[#706f6c]">
                Join Job Match and find your perfect career opportunity
              </p>

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
                        disabled={processing}
                        placeholder="email@example.com"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c]"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#706f6c]" />
                      Password
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        tabIndex={2}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={processing}
                        placeholder="Create a strong password"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                        tabIndex={-1}
                        disabled={processing}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.password}
                      </p>
                    )}
                    <p className="text-xs text-[#706f6c] flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Password must be at least 8 characters
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="grid gap-2">
                    <label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#706f6c]" />
                      Confirm password
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'confirm' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                      <input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        tabIndex={3}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        disabled={processing}
                        placeholder="Confirm your password"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                        tabIndex={-1}
                        disabled={processing}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                    tabIndex={4}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* Google Sign Up */}
                {googleAuthEnabled && (
                  <div className="grid gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e3e3e0]"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-[#706f6c]">
                          or sign up with
                        </span>
                      </div>
                    </div>
                    <a
                      href={route('auth.google.redirect')}
                      className="flex items-center justify-center gap-3 rounded-sm border border-[#19140035] px-5 py-2.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] transition-all duration-200 group"
                    >
                      <svg className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </a>
                  </div>
                )}

                {errors.google && (
                  <p className="text-xs text-red-600 text-center flex items-center justify-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.google}
                  </p>
                )}

          

                {/* Login link */}
                <div className="text-center text-sm text-[#706f6c]">
                  Already have an account?{' '}
                  <a
                    href={route('login')}
                    className="font-medium text-[#1b1b18] hover:underline underline-offset-4"
                    tabIndex={5}
                  >
                    Log in
                  </a>
                </div>
              </form>

              {/* Status Message */}
              {status && (
                <div className="mt-6 rounded-sm border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 flex items-center gap-2">
                  <span className="shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  {status}
                </div>
              )}
            </div>

            {/* Right side - Benefits Card */}
            <div className="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-96 lg:rounded-t-none lg:rounded-r-lg">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-100" />

              <div className="relative p-6 lg:p-8 flex flex-col justify-center h-full">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-[#F53003]" />
                    <h3 className="text-lg font-semibold text-[#1b1b18]">Why Join Us?</h3>
                  </div>
                  <p className="text-sm text-[#706f6c]">
                    Start your journey with Job Match
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Access to Top Jobs</h4>
                      <p className="text-xs text-[#706f6c]">Browse thousands of opportunities from leading companies</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Job Alerts</h4>
                      <p className="text-xs text-[#706f6c]">Get personalized job recommendations sent to your inbox</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Track Applications</h4>
                      <p className="text-xs text-[#706f6c]">Monitor your application status all in one place</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Star className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Save Favorites</h4>
                      <p className="text-xs text-[#706f6c]">Bookmark jobs you're interested in for later</p>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="mt-6 p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-[#1b1b18]">500+</div>
                      <div className="text-xs text-[#706f6c]">Active Jobs</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#1b1b18]">50+</div>
                      <div className="text-xs text-[#706f6c]">Companies</div>
                    </div>
                  </div>
                </div>

                {/* User count info */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#706f6c]">
                    👥 Join 2,000+ job seekers already on Job Match
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg pointer-events-none" />
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}