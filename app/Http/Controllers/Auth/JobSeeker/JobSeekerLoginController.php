<?php

namespace App\Http\Controllers\Auth\JobSeeker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class JobSeekerLoginController extends Controller
{
  /**
   * Show the job seeker login page.
   */
  public function create(Request $request): Response
  {
    return Inertia::render('auth/JobSeeker/Login', [
      'canResetPassword' => Route::has('password.request'),
      'googleAuthEnabled' => $this->googleAuthEnabled(),
      'status' => $request->session()->get('status'),
    ]);
  }

  /**
   * Handle job seeker login request.
   */
  public function store(LoginRequest $request): RedirectResponse
  {
    $request->authenticate();
    $request->session()->regenerate();

    $user = $request->user();

    // Verify email
    if (!$user->hasVerifiedEmail()) {
      Auth::logout();
      $request->session()->invalidate();
      $request->session()->regenerateToken();

      return to_route('verification.notice')->withErrors([
        'email' => 'Please verify your email address before logging in.',
      ]);
    }

    // Check if user has job_seeker role
    if (!$user->hasRole('job-seeker')) {
      Auth::logout();
      $request->session()->invalidate();
      $request->session()->regenerateToken();

      return back()->withErrors([
        'email' => 'This account does not have job seeker access. Please use the admin login page.',
      ]);
    }

    // Check profile completion
    $profile = ApplicantProfile::where('user_id', $user->id)->first();
    if (!$profile || !$profile->isComplete()) {
      return redirect()->route('profile.complete');
    }

    return redirect()->intended(route('dashboard'));
  }

  /**
   * Check if Google auth is configured.
   */
  private function googleAuthEnabled(): bool
  {
    return filled(config('services.google.client_id'))
      && filled(config('services.google.client_secret'))
      && filled(config('services.google.redirect'));
  }
}
