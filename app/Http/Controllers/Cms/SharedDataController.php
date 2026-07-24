<?php
// app/Http/Controllers/Cms/SharedDataController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\SharedData;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SharedDataController extends Controller
{
  /**
   * Display shared data management page
   */
  public function index(): Response|RedirectResponse
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('shared_data.view')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to view shared data.');
    }

    $sharedData = SharedData::whereIn('type', [
      'topbar',
      'navbar',
      'footer',
      'faq',
      'upcoming-events',
      'stories'
    ])->get();

    return Inertia::render('Backend/CMS/Shared/Index', [
      'sharedData' => $sharedData,
    ]);
  }

  /**
   * Update shared data
   */
  public function update(Request $request, int $id)
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('shared_data.update')) {
      return redirect()->back()->with('error', 'You do not have permission to update shared data.');
    }

    $shared = SharedData::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    // Use database transaction for data integrity
    DB::beginTransaction();

    try {
      // Decode old data if it's a JSON string
      $oldData = $shared->data;
      if (is_string($oldData)) {
        $oldData = json_decode($oldData, true);
        if (!is_array($oldData)) {
          $oldData = [];
        }
      } elseif (!is_array($oldData)) {
        $oldData = [];
      }

      // Process data - handle image uploads
      $processedData = $this->processData($request->data, $oldData, $shared->type);

      // Always store as JSON string for consistency
      $dataToSave = json_encode($processedData);

      $shared->update([
        'data' => $dataToSave,
        'is_active' => $request->is_active ?? true,
      ]);

      // Clear cache for this type
      $this->clearCache($shared->type);

      DB::commit();

      return redirect()->back()->with('success', ucfirst($shared->type) . ' updated successfully.');
    } catch (\Exception $e) {
      DB::rollBack();

      Log::error('Failed to update shared data', [
        'type' => $shared->type,
        'id' => $id,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);

      return back()->with('error', 'Failed to update: ' . $e->getMessage())->withInput();
    }
  }

  /**
   * Clear cache for a specific type
   */
  protected function clearCache(string $type): void
  {
    Cache::forget('shared.' . $type);
    Cache::forget('shared_data_' . $type); // Alternative cache key
  }

  /**
   * Process data - main entry point
   */
  protected function processData(array $newData, array $oldData, string $type): array
  {
    // Create a copy to work with
    $processed = $newData;

    // Process based on type
    switch ($type) {
      case 'navbar':
        $processed = $this->processNavbarData($newData, $oldData);
        break;
      case 'footer':
        $processed = $this->processFooterData($newData, $oldData);
        break;
      case 'upcoming-events':
        $processed = $this->processUpcomingEventsData($newData, $oldData);
        break;
      default:
        $processed = $this->processArrayRecursive($newData, $oldData);
        break;
    }

    // Specifically handle link icons for footer type
    if ($type === 'footer') {
      $processed = $this->processLinkIcons($newData, $oldData, $processed);
    }

    return $processed;
  }

  /**
   * Process navbar data with special logo handling
   */
  protected function processNavbarData(array $newData, array $oldData): array
  {
    // Handle logo image
    if (isset($newData['logo']['src']) && $this->isBase64Image($newData['logo']['src'])) {
      // Delete old logo if it exists
      if (!empty($oldData['logo']['src'] ?? '')) {
        $this->deleteImage($oldData['logo']['src']);
      }

      $newData['logo']['src'] = $this->uploadLogo($newData['logo']['src'], 'navbar');
    } else if (isset($newData['logo']['src']) && empty($newData['logo']['src'])) {
      // Logo was removed
      if (!empty($oldData['logo']['src'] ?? '')) {
        $this->deleteImage($oldData['logo']['src']);
      }
    }

    // Process other nested arrays
    foreach ($newData as $key => $value) {
      if (is_array($value) && $key !== 'logo') {
        $oldValue = $oldData[$key] ?? [];
        $newData[$key] = $this->processArrayRecursive($value, $oldValue);
      }
    }

    return $newData;
  }

  /**
   * Process footer data with special logo handling
   */
  protected function processFooterData(array $newData, array $oldData): array
  {
    // Handle logo image
    if (isset($newData['logo']['src']) && $this->isBase64Image($newData['logo']['src'])) {
      if (!empty($oldData['logo']['src'] ?? '')) {
        $this->deleteImage($oldData['logo']['src']);
      }
      $newData['logo']['src'] = $this->uploadLogo($newData['logo']['src'], 'footer');
    } else if (isset($newData['logo']['src']) && empty($newData['logo']['src'])) {
      if (!empty($oldData['logo']['src'] ?? '')) {
        $this->deleteImage($oldData['logo']['src']);
      }
    }

    // Process other nested arrays
    foreach ($newData as $key => $value) {
      if (is_array($value) && $key !== 'logo') {
        $oldValue = $oldData[$key] ?? [];
        $newData[$key] = $this->processArrayRecursive($value, $oldValue);
      }
    }

    return $newData;
  }

  /**
   * Process link icons for footer
   */
  protected function processLinkIcons(array $newData, array $oldData, array $processed): array
  {
    $iconFields = [
      'quickLinkLinkIcon',
      'OurProgramLinkIcon'
    ];

    foreach ($iconFields as $field) {
      if (isset($newData[$field]) && $this->isBase64Image($newData[$field])) {
        // Delete old icon if exists
        if (!empty($oldData[$field] ?? '') && !$this->isBase64Image($oldData[$field])) {
          $this->deleteImage($oldData[$field]);
        }
        $processed[$field] = $this->uploadLinkIcon($newData[$field]);
      } else if (isset($newData[$field]) && empty($newData[$field])) {
        // Icon was removed
        if (!empty($oldData[$field] ?? '')) {
          $this->deleteImage($oldData[$field]);
        }
        $processed[$field] = '';
      } else if (isset($newData[$field])) {
        // Keep existing icon path
        $processed[$field] = $newData[$field];
      }
    }

    return $processed;
  }

  /**
   * Process upcoming events data
   */
  protected function processUpcomingEventsData(array $newData, array $oldData): array
  {
    // Process section data
    if (isset($newData['section']) && is_array($newData['section'])) {
      $oldSection = $oldData['section'] ?? [];
      $newData['section'] = $this->processArrayRecursive($newData['section'], $oldSection);
    }

    // Process main image
    if (isset($newData['image']) && is_array($newData['image'])) {
      if (isset($newData['image']['src']) && $this->isBase64Image($newData['image']['src'])) {
        if (!empty($oldData['image']['src'] ?? '')) {
          $this->deleteImage($oldData['image']['src']);
        }
        $newData['image']['src'] = $this->uploadEventImage($newData['image']['src'], 'event-cover');
      }
    }

    // Process events array
    if (isset($newData['events']) && is_array($newData['events'])) {
      $oldEvents = $oldData['events'] ?? [];

      foreach ($newData['events'] as $index => $event) {
        // Process event image
        if (isset($event['image']) && $this->isBase64Image($event['image'])) {
          // Delete old event image if it exists
          if (!empty($oldEvents[$index]['image'] ?? '')) {
            $this->deleteImage($oldEvents[$index]['image']);
          }
          $newData['events'][$index]['image'] = $this->uploadEventImage($event['image'], 'event-' . ($index + 1));
        }

        // Process other nested arrays in event
        if (is_array($event)) {
          $oldEvent = $oldEvents[$index] ?? [];
          foreach ($event as $key => $value) {
            if ($key !== 'image' && is_array($value)) {
              $newData['events'][$index][$key] = $this->processArrayRecursive($value, $oldEvent[$key] ?? []);
            }
          }
        }
      }
    }

    return $newData;
  }

  /**
   * Upload logo image
   */
  protected function uploadLogo(string $base64String, string $type): string
  {
    try {
      $imageContent = $this->decodeBase64Image($base64String);
      $extension = $this->getImageExtension($base64String) ?: 'png';

      // Simplified filename: YYYYMMDD_UUID.extension
      $datePrefix = date('Ymd');
      $uuid = Str::uuid();
      $filename = $datePrefix . '_' . $uuid . '.' . $extension;

      // Single directory structure: images/logos/filename
      $path = 'images/logos/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Failed to upload logo: ' . $e->getMessage());
      return $base64String;
    }
  }

  /**
   * Upload event image
   */
  protected function uploadEventImage(string $base64String, string $prefix = 'event'): string
  {
    try {
      $imageContent = $this->decodeBase64Image($base64String);
      $extension = $this->getImageExtension($base64String) ?: 'jpg';

      // Simplified filename: YYYYMMDD_UUID.extension
      $datePrefix = date('Ymd');
      $uuid = Str::uuid();
      $filename = $datePrefix . '_' . $uuid . '.' . $extension;

      // Single directory structure: UpcomingEvent/filename
      $path = 'UpcomingEvent/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Failed to upload event image: ' . $e->getMessage());
      return $base64String;
    }
  }

  /**
   * Upload link icon
   */
  protected function uploadLinkIcon(string $base64String): string
  {
    try {
      $imageContent = $this->decodeBase64Image($base64String);
      $extension = $this->getImageExtension($base64String) ?: 'png';

      $datePrefix = date('Ymd');
      $uuid = Str::uuid();
      $filename = $datePrefix . '_' . $uuid . '.' . $extension;

      $path = 'images/icons/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Failed to upload link icon: ' . $e->getMessage());
      return $base64String;
    }
  }

  /**
   * Process array recursively for image uploads
   */
  protected function processArrayRecursive(array $data, array $oldData): array
  {
    foreach ($data as $key => $value) {
      if (is_array($value)) {
        $oldValue = $oldData[$key] ?? [];
        $data[$key] = $this->processArrayRecursive($value, $oldValue);
      } elseif (is_string($value) && $this->isBase64Image($value)) {
        // Check if this is a new image or existing path
        if (!empty($oldData[$key] ?? '') && !$this->isBase64Image($oldData[$key])) {
          $this->deleteImage($oldData[$key]);
        }
        $data[$key] = $this->uploadGenericImage($value);
      }
    }

    return $data;
  }

  /**
   * Upload generic image
   */
  protected function uploadGenericImage(string $base64String): string
  {
    try {
      $imageContent = $this->decodeBase64Image($base64String);
      $extension = $this->getImageExtension($base64String) ?: 'png';

      // Simplified filename: YYYYMMDD_UUID.extension
      $datePrefix = date('Ymd');
      $uuid = Str::uuid();
      $filename = $datePrefix . '_' . $uuid . '.' . $extension;

      // Single directory structure: uploads/shared/filename
      $path = 'uploads/shared/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Failed to upload generic image: ' . $e->getMessage());
      return $base64String;
    }
  }

  /**
   * Decode base64 image
   */
  protected function decodeBase64Image(string $base64String): string
  {
    $imageData = explode(',', $base64String);
    $encodedData = $imageData[1] ?? $base64String;
    $decoded = base64_decode($encodedData);

    if ($decoded === false) {
      throw new \Exception('Failed to decode base64 image');
    }

    // Check if image is valid
    if (strlen($decoded) === 0) {
      throw new \Exception('Decoded image is empty');
    }

    return $decoded;
  }

  /**
   * Delete image from storage
   */
  protected function deleteImage(string $imagePath): bool
  {
    if (empty($imagePath)) {
      return false;
    }

    // Only delete if it's a stored path (not URL or base64)
    if (str_starts_with($imagePath, 'http') || $this->isBase64Image($imagePath)) {
      return false;
    }

    // Remove /storage/ prefix to get the storage path
    $path = str_replace('/storage/', '', $imagePath);

    // Remove leading slash if present
    $path = ltrim($path, '/');

    // Don't delete if path is empty or invalid
    if (empty($path) || $path === '/' || $path === 'storage') {
      return false;
    }

    try {
      if (Storage::disk('public')->exists($path)) {
        return Storage::disk('public')->delete($path);
      }
    } catch (\Exception $e) {
      Log::warning('Failed to delete image: ' . $e->getMessage(), ['path' => $path]);
    }

    return false;
  }

  /**
   * Check if string is a base64 image
   */
  protected function isBase64Image(string $string): bool
  {
    return str_starts_with($string, 'data:image/');
  }

  /**
   * Get image extension from base64 string
   */
  protected function getImageExtension(string $base64String): ?string
  {
    $mimeMap = [
      'image/jpeg' => 'jpg',
      'image/jpg' => 'jpg',
      'image/png' => 'png',
      'image/gif' => 'gif',
      'image/webp' => 'webp',
      'image/svg+xml' => 'svg',
      'image/svg' => 'svg',
      'image/bmp' => 'bmp',
      'image/tiff' => 'tiff',
      'image/x-icon' => 'ico',
      'image/vnd.microsoft.icon' => 'ico',
    ];

    if (preg_match('/^data:([^;]+);base64,/', $base64String, $matches)) {
      $mimeType = $matches[1];
      return $mimeMap[$mimeType] ?? 'png';
    }

    return 'png';
  }

  /**
   * Get image mime type from base64 string
   */
  protected function getImageMimeType(string $base64String): ?string
  {
    if (preg_match('/^data:([^;]+);base64,/', $base64String, $matches)) {
      return $matches[1];
    }
    return null;
  }

  /**
   * Get the size of base64 image in bytes
   */
  protected function getBase64ImageSize(string $base64String): int
  {
    $imageData = explode(',', $base64String);
    $encodedData = $imageData[1] ?? '';
    return (int) (strlen($encodedData) * 3 / 4);
  }

  /**
   * Validate base64 image size
   */
  protected function validateImageSize(string $base64String, int $maxSize = 5 * 1024 * 1024): bool
  {
    $size = $this->getBase64ImageSize($base64String);
    return $size <= $maxSize;
  }
}
