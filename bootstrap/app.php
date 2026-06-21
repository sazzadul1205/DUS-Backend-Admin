<?php

use App\Http\Controllers\JobListing\JobListingController;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Console\Scheduling\Schedule;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful; 

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Add custom aliases
        $middleware->alias([
            'profile.complete' => \App\Http\Middleware\EnsureApplicantProfileComplete::class,
        ]);

        // Web middleware group
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // API middleware group - ADD THIS
        $middleware->group('api', [
            EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Update job statuses every hour
        $schedule->call(function () {
            $controller = app(JobListingController::class);
            $controller->updateJobStatuses();
        })->hourly()->name('update-job-statuses');

        // You can also use a command if you create one (recommended)
        // $schedule->command('jobs:update-status')->hourly();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
