<?php
// app/Http/Controllers/Admin/CacheController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Frontend\SharedDataTrait;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\SimpleLogger;
use Illuminate\Support\Facades\Auth;

class CacheController extends Controller
{
  use SharedDataTrait;

  /**
   * Clear all frontend cache
   */
  public function clearAll(Request $request)
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('cache.manage')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to manage cache.');
    }

    SimpleLogger::system(
      "🗑️ Frontend cache clearing initiated",
      [
        'action' => 'clear_all',
        'performed_by' => Auth::user()?->email ?? 'system',
        'ip' => $request->ip()
      ]
    );

    // … rest of method (commented out cache logic)
    return response()->json([
      'success' => true,
      'message' => 'Cache clearing is temporarily disabled during development.',
      'timestamp' => now()->toDateTimeString()
    ]);
  }

  /**
   * Clear cache for a specific page
   */
  public function clearPage(Request $request, string $pageSlug)
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('cache.manage')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to manage cache.');
    }

    // Log and return mock response
    SimpleLogger::system(
      "🗑️ Page cache clearing initiated: {$pageSlug}",
      [
        'action' => 'clear_page',
        'page_slug' => $pageSlug,
        'performed_by' => Auth::user()?->email ?? 'system',
        'ip' => $request->ip()
      ]
    );

    return response()->json([
      'success' => true,
      'message' => "Page cache clearing is temporarily disabled during development.",
      'timestamp' => now()->toDateTimeString()
    ]);
  }

  /**
   * Get cache status
   */
  public function status(Request $request)
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('cache.status')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to view cache status.');
    }

    // Return mock status
    $cacheStatus = [
      [
        'key' => 'status',
        'label' => 'Cache Status',
        'exists' => false,
        'message' => 'Cache is currently disabled during development'
      ]
    ];

    return response()->json([
      'success' => true,
      'cache_status' => $cacheStatus,
      'timestamp' => now()->toDateTimeString(),
      'development_mode' => true
    ]);
  }
}
