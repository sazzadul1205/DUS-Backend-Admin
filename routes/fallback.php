<?php

// ============================================
// FALLBACK ROUTE
// URL: /* (catch-all for any unmatched routes)
// ============================================

use App\Http\Controllers\Frontend\SharedDataTrait;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::fallback(function () {
  $sharedData = (new class {
    use SharedDataTrait;
    public function getData()
    {
      return $this->getSharedData();
    }
  })->getData();

  return Inertia::render('Frontend/NotFound', array_merge($sharedData, [
    'storageUrl' => config('app.storage_url', ''),
    'pageTitle' => 'Page Not Found | DUS',
    'notFound' => true,
  ]))->toResponse(request());
});
