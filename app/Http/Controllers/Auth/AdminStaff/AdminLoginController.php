<?php

namespace App\Http\Controllers\Auth\AdminStaff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoginController extends Controller
{
  /**
   * Show the admin login page.
   */
  public function create(Request $request): Response
  {
    return Inertia::render('auth/AdminStaff/Login', [
      'canResetPassword' => Route::has('password.request'),
      'status' => $request->session()->get('status'),
    ]);
  }

  /**
   * Handle admin login request.
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

    // Check if user has admin/staff role (NOT job-seeker)
    $allowedRoles = ['super-admin', 'admin', 'employer', 'hr-manager'];
    $hasAllowedRole = false;

    foreach ($allowedRoles as $role) {
      if ($user->hasRole($role)) {
        $hasAllowedRole = true;
        break;
      }
    }

    if (!$hasAllowedRole) {
      Auth::logout();
      $request->session()->invalidate();
      $request->session()->regenerateToken();

      return back()->withErrors([
        'email' => 'This account does not have admin access. Please use the job seeker login page.',
      ]);
    }

    return redirect()->intended(route('admin.dashboard'));
  }
}
