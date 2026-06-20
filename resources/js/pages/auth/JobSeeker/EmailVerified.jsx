// pages/auth/email-verified.jsx

import { Head, router } from '@inertiajs/react';
import { CheckCircle, ArrowRight, LoaderCircle, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EmailVerified({ status }) {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const handleContinue = () => {
    router.get(route('profile.complete'));
  };

  // Auto-redirect counter
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect when countdown reaches 0
      router.get(route('profile.complete'));
    }
  }, [countdown]);

  return (
    <>
      <Head title="Email Verified" />

      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)]">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-center text-[#1b1b18]">
            Verification Complete!
          </h2>

          <p className="mb-4 text-center text-[#706f6c]">
            Your email has been verified. Please click the button below to continue.
          </p>

          {/* Countdown Timer */}
          <div className="text-center mb-4">
            <p className="text-sm text-[#706f6c]">
              Redirecting in <span className="font-semibold text-[#1b1b18]">{countdown}</span> seconds
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium text-white hover:bg-black transition-all duration-200"
          >
            Continue to Profile Setup
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </>
  );
}