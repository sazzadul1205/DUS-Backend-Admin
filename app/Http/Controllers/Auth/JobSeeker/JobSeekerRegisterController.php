<?php

namespace App\Http\Controllers\Auth\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class JobSeekerRegisterController extends Controller
{
  /**
   * Show the job seeker registration page.
   */
  public function create(): Response
  {
    return Inertia::render('auth/JobSeeker/Register', [
      'googleAuthEnabled' => $this->googleAuthEnabled(),
      'status' => session('status'),
    ]);
  }

  /**
   * Handle an incoming registration request.
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request): RedirectResponse
  {
    $request->validate([
      'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $email = strtolower($request->email);
    $name = Str::of($email)->before('@')->replace(['.', '_', '-'], ' ')->title()->value() ?: 'New User';

    $user = User::create([
      'name' => $name,
      'email' => $email,
      'password' => Hash::make($request->password),
      'email_verified_at' => null,
    ]);

    // Assign job_seeker role via RBAC
    $jobSeekerRole = Role::where('slug', 'job-seeker')->first();
    if ($jobSeekerRole) {
      $user->roles()->attach($jobSeekerRole->id, [
        'assigned_by' => $user->id,
        'assigned_at' => now(),
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // Send email verification notification
    $user->sendEmailVerificationNotification();

    event(new Registered($user));

    // Log the user in
    Auth::login($user);

    // Redirect to email verification notice page
    return to_route('verification.notice');
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
