<?php

namespace App\Http\Controllers\Auth\Shared;

// Controllers
use App\Http\Controllers\Controller;

// Requests
use App\Http\Requests\Auth\LoginRequest;

// HTTP
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

// Support
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page - DEPRECATED / REDIRECT
     * This is kept for backward compatibility but redirects to job seeker login
     */
    public function create(): RedirectResponse
    {
        // This controller is now only used for logout and shared auth functions
        // Redirect to job seeker login as default
        return redirect()->route('job-seeker.login');
    }

    /**
     * Handle an incoming authentication request.
     * NOTE: This is now handled by JobSeekerLoginController and AdminLoginController
     * This method is kept for backward compatibility but should not be used directly
     */
    public function store(): RedirectResponse
    {
        // This should not be called directly anymore
        // Redirect to login page with error
        return redirect()->route('login')->withErrors([
            'email' => 'Please use the appropriate login page for your account type.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Determine whether Google auth is configured and ready to use.
     */
    private function googleAuthEnabled(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }
}
