<?php
// routes/auth.php

use App\Http\Controllers\Auth\Shared\AuthenticatedSessionController;
use App\Http\Controllers\Auth\Shared\ConfirmablePasswordController;
use App\Http\Controllers\Auth\Shared\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\Shared\EmailVerificationPromptController;
use App\Http\Controllers\Auth\Shared\EmailVerifiedController;
use App\Http\Controllers\Auth\Shared\GoogleAuthController;
use App\Http\Controllers\Auth\Shared\NewPasswordController;
use App\Http\Controllers\Auth\Shared\PasswordResetLinkController;
use App\Http\Controllers\Auth\Shared\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    // ============================================
    // GOOGLE AUTH (Job Seekers only)
    // ============================================
    Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect'])
        ->name('auth.google.redirect');
    Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])
        ->name('auth.google.callback');

    // ============================================
    // PASSWORD RESET (Both Job Seekers & Admin)
    // ============================================
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    // ============================================
    // EMAIL VERIFICATION (Job Seekers only)
    // ============================================
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
    Route::get('email/verified', [EmailVerifiedController::class, 'index'])
        ->name('verification.verified');

    // ============================================
    // CONFIRM PASSWORD (Both Job Seekers & Admin)
    // ============================================
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // ============================================
    // LOGOUT (Both Job Seekers & Admin)
    // ============================================
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
