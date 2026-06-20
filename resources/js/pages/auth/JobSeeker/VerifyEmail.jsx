// pages/auth/verify-email.jsx

import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, Mail, Send, LogOut, CheckCircle, MailCheck, Clock } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [resendStatus, setResendStatus] = useState(null);
    const [checking, setChecking] = useState(true);

    // Check if email is already verified (in case user verified in another tab)
    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const response = await fetch('/api/user/verification-status', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.verified) {
                        // Redirect to profile completion or dashboard
                        window.location.href = route('profile.complete');
                    }
                }
            } catch (error) {
                console.error('Error checking verification status:', error);
            } finally {
                setChecking(false);
            }
        };

        // Check every 5 seconds for verification status
        const interval = setInterval(checkVerificationStatus, 5000);

        // Initial check
        checkVerificationStatus();

        return () => clearInterval(interval);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => setResendStatus('sent')
        });
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    if (checking) {
        return (
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <div className="flex items-center justify-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-[#1b1b18]" />
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Email verification" />

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-83.75 flex-col lg:max-w-md">
                        {/* Logo and Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-[#1b1b18] rounded-lg flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold text-[#1b1b18]">
                                Verify your email
                            </h2>
                            <p className="mt-2 text-sm text-[#706f6c]">
                                Please verify your email address by clicking on the link we just emailed to you.
                            </p>
                        </div>

                        {/* Status Messages */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-4 rounded-sm border border-green-200 bg-green-50 p-4 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-green-700">Verification email sent!</span>
                                </div>
                                <p className="text-xs text-green-600">
                                    A new verification link has been sent to your email address.
                                </p>
                            </div>
                        )}

                        {resendStatus === 'sent' && !status && (
                            <div className="mb-4 rounded-sm border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700">
                                <CheckCircle className="inline h-4 w-4 mr-1" />
                                Verification email resent successfully!
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="rounded-sm border border-[#e3e3e0] bg-white p-6 mb-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)]">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <MailCheck className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-[#1b1b18]">Check your inbox</h3>
                                    <p className="text-xs text-[#706f6c]">We've sent a verification link to your email</p>
                                </div>
                            </div>

                            <div className="border-t border-[#e3e3e0] pt-4">
                                <div className="flex items-center justify-center text-sm text-[#706f6c]">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>The link expires in 60 minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Auto-refresh notice */}
                        <div className="mb-4 text-center">
                            <p className="text-xs text-[#706f6c] flex items-center justify-center gap-1">
                                <LoaderCircle className="h-3 w-3 animate-spin" />
                                This page automatically detects when your email is verified
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <form onSubmit={submit}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Resend verification email
                                        </>
                                    )}
                                </button>
                            </form>

                            <button
                                onClick={handleLogout}
                                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#19140035] bg-white px-5 py-2.5 text-sm font-medium leading-normal text-[#1b1b18] hover:border-[#1915014a] transition-all duration-200"
                            >
                                <LogOut className="h-4 w-4" />
                                Log out
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="mt-6 rounded-sm border border-yellow-200 bg-yellow-50 p-4">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Didn't receive the email?</h4>
                            <ul className="space-y-1 text-xs text-yellow-700">
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Check your spam or junk folder
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Make sure you entered the correct email address
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Click "Resend verification email" above
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Add our email to your contacts to avoid spam filtering
                                </li>
                            </ul>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-[#706f6c]">
                                Once verified, you'll have full access to all features of your account.
                            </p>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}