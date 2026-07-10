<?php
// app/Providers/CacheWarmupServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CacheWarmupServiceProvider extends ServiceProvider
{
  /**
   * Register services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap services.
   */
  public function boot(): void
  {
    // Only warm up cache if it's not already warmed up
    $cacheKey = 'app_cache_warmed_up';

    if (!Cache::has($cacheKey)) {
      // Mark as warmed up to prevent repeated warming
      Cache::put($cacheKey, true, 86400); // 24 hours

      // Warm up cache in background (if not in console)
      if (!$this->app->runningInConsole()) {
        // Use Laravel's schedule to warm up cache
        $this->warmupCache();
      }
    }
  }

  /**
   * Warm up the cache by visiting key pages.
   */
  private function warmupCache(): void
  {
    try {
      $pages = [
        '/',
        '/about',
        '/blogs',
        '/projects-programs',
        '/publications',
        '/jobs',
        '/contact',
      ];

      foreach ($pages as $page) {
        try {
          // Make a request to the page to trigger cache
          Http::timeout(5)->get(url($page));
        } catch (\Exception $e) {
          // Log but continue warming other pages
          \Illuminate\Support\Facades\Log::warning('Cache warmup failed for page: ' . $page, [
            'error' => $e->getMessage()
          ]);
        }
      }

      \Illuminate\Support\Facades\Log::info('Cache warmup completed on startup');
    } catch (\Exception $e) {
      \Illuminate\Support\Facades\Log::error('Cache warmup failed on startup', [
        'error' => $e->getMessage()
      ]);
    }
  }
}
