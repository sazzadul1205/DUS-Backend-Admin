<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ImageManagerController extends Controller
{
  protected $disk;
  protected string $iconPath;
  protected string $imagePath;

  public function __construct()
  {
    // Use the public disk
    $this->disk = Storage::disk('public');

    // Paths in storage
    $this->iconPath = 'images';
    $this->imagePath = 'images/managed';

    // Ensure directories exist
    try {
      if (!$this->disk->exists($this->iconPath)) {
        $this->disk->makeDirectory($this->iconPath);
      }
      if (!$this->disk->exists($this->imagePath)) {
        $this->disk->makeDirectory($this->imagePath);
      }
    } catch (\Exception $e) {
      Log::error('Failed to create storage directories: ' . $e->getMessage());
    }
  }

  /**
   * Display the icon management page
   */
  public function index(): Response
  {
    $currentIcon = $this->getCurrentIcon();

    return Inertia::render('Backend/IconManager/Index', [
      'currentIcon' => $currentIcon,
      'icons' => $this->getAvailableIcons(),
    ]);
  }

  /**
   * Update the site icon
   */
  public function updateIcon(Request $request): JsonResponse
  {
    try {
      // Log the request for debugging
      Log::info('Icon update request received', [
        'has_file' => $request->hasFile('icon'),
        'all_files' => $request->allFiles(),
        'all_input' => $request->all()
      ]);

      // Validate the request
      $validator = validator($request->all(), [
        'icon' => 'required|file|image|max:2048',
      ]);

      if ($validator->fails()) {
        return response()->json([
          'success' => false,
          'message' => 'Validation failed',
          'errors' => $validator->errors()
        ], 422);
      }

      $file = $request->file('icon');
      if (!$file) {
        return response()->json([
          'success' => false,
          'message' => 'No file uploaded'
        ], 400);
      }

      // Log file details
      Log::info('File details', [
        'original_name' => $file->getClientOriginalName(),
        'extension' => $file->getClientOriginalExtension(),
        'mime_type' => $file->getMimeType(),
        'size' => $file->getSize()
      ]);

      $extension = strtolower($file->getClientOriginalExtension());

      // Allowed extensions
      $allowed = ['png', 'ico', 'jpg', 'jpeg', 'svg', 'webp'];
      if (!in_array($extension, $allowed)) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid file type. Allowed: ' . implode(', ', $allowed),
        ], 422);
      }

      // Delete old icon files
      $this->deleteOldIcons();

      // Generate new filename
      $filename = 'icon.' . $extension;

      // Store the file
      $path = $this->disk->putFileAs($this->iconPath, $file, $filename);

      if (!$path) {
        throw new \Exception('Failed to store file');
      }

      // If it's a raster image, try to create additional formats
      if (!in_array($extension, ['svg', 'ico'])) {
        try {
          // Create PNG version
          $pngPath = $this->iconPath . '/icon.png';
          $this->disk->put($pngPath, file_get_contents($file->getPathname()));

          // Try to create ICO version
          if (extension_loaded('gd')) {
            $this->createIcoFromFile($file->getPathname(), 'icon.ico');
          }
        } catch (\Exception $e) {
          Log::warning('Failed to create additional formats: ' . $e->getMessage());
        }
      }

      // Ensure storage link exists
      $this->ensureStorageLinkExists();

      return response()->json([
        'success' => true,
        'message' => 'Icon updated successfully!',
        'data' => [
          'icon' => $this->getIconUrl($filename),
        ],
      ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      Log::error('Icon update failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Failed to update icon: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Reset icon to default
   */
  public function resetIcon(): JsonResponse
  {
    try {
      $this->deleteOldIcons();

      return response()->json([
        'success' => true,
        'message' => 'Icon reset to default successfully!',
      ]);
    } catch (\Exception $e) {
      Log::error('Icon reset failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Failed to reset icon: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get current icon info
   */
  protected function getCurrentIcon(): ?array
  {
    try {
      $iconFiles = ['icon.png', 'icon.ico', 'icon.svg', 'icon.jpg', 'icon.jpeg', 'icon.webp'];

      foreach ($iconFiles as $file) {
        $path = $this->iconPath . '/' . $file;
        if ($this->disk->exists($path)) {
          return [
            'name' => $file,
            'url' => $this->getIconUrl($file),
            'size' => $this->formatBytes($this->disk->size($path)),
            'last_modified' => date('Y-m-d H:i:s', $this->disk->lastModified($path)),
          ];
        }
      }
    } catch (\Exception $e) {
      Log::error('Failed to get current icon: ' . $e->getMessage());
    }

    return null;
  }

  /**
   * Get available icons
   */
  protected function getAvailableIcons(): array
  {
    try {
      $files = $this->disk->files($this->iconPath);
      $icons = [];

      foreach ($files as $file) {
        $name = basename($file);
        if (str_starts_with($name, 'icon.')) {
          $icons[] = [
            'name' => $name,
            'url' => $this->getIconUrl($name),
            'size' => $this->formatBytes($this->disk->size($file)),
            'extension' => pathinfo($name, PATHINFO_EXTENSION),
          ];
        }
      }

      return $icons;
    } catch (\Exception $e) {
      Log::error('Failed to get available icons: ' . $e->getMessage());
      return [];
    }
  }

  /**
   * Delete all old icon files
   */
  protected function deleteOldIcons(): void
  {
    try {
      $iconFiles = ['icon.png', 'icon.ico', 'icon.svg', 'icon.jpg', 'icon.jpeg', 'icon.webp', 'icon.gif'];

      foreach ($iconFiles as $file) {
        $path = $this->iconPath . '/' . $file;
        if ($this->disk->exists($path)) {
          $this->disk->delete($path);
        }
      }
    } catch (\Exception $e) {
      Log::error('Failed to delete old icons: ' . $e->getMessage());
    }
  }

  /**
   * Create ICO from file
   */
  protected function createIcoFromFile(string $filePath, string $outputFilename): void
  {
    try {
      // Create image from file
      $image = imagecreatefromstring(file_get_contents($filePath));
      if (!$image) {
        throw new \Exception('Failed to create image from file');
      }

      // Get dimensions
      $width = imagesx($image);
      $height = imagesy($image);

      // Create ICO content (simplified)
      $icoContent = $this->createIcoContent($image);

      // Store in storage
      $this->disk->put($this->iconPath . '/' . $outputFilename, $icoContent);

      imagedestroy($image);
    } catch (\Exception $e) {
      Log::warning('ICO conversion failed: ' . $e->getMessage());
    }
  }

  /**
   * Create simple ICO content
   */
  protected function createIcoContent($image): string
  {
    // Simple ICO file creation
    $width = imagesx($image);
    $height = imagesy($image);

    // ICO header
    $header = pack('vvv', 0, 1, 1); // Reserved, Type, Count

    // Icon directory entry
    $dirEntry = pack(
      'CCCCvvVV',
      $width,
      $height,
      0, // Color count (0 for 32-bit) 
      0, // Reserved
      1, // Planes
      32, // Bits per pixel
      0, // Image size (calculated later)
      22 // Offset to image data (header size + directory entry)
    );

    // Get PNG data
    ob_start();
    imagepng($image);
    $pngData = ob_get_clean();

    // Return complete ICO
    return $header . $dirEntry . $pngData;
  }

  /**
   * Format bytes
   */
  protected function formatBytes(int $bytes): string
  {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
      $bytes /= 1024;
      $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
  }

  /**
   * Get URL for an icon
   */
  protected function getIconUrl(string $filename): string
  {
    // Check if storage link exists
    if (!file_exists(public_path('storage'))) {
      $this->ensureStorageLinkExists();
    }

    return asset('storage/' . $this->iconPath . '/' . $filename);
  }

  /**
   * Ensure the storage symbolic link exists
   */
  protected function ensureStorageLinkExists(): void
  {
    $linkPath = public_path('storage');
    $targetPath = storage_path('app/public');

    if (!file_exists($linkPath)) {
      try {
        if (function_exists('symlink')) {
          @symlink($targetPath, $linkPath);
          Log::info('Storage symbolic link created successfully');
        }
      } catch (\Exception $e) {
        Log::warning('Could not create storage link: ' . $e->getMessage());
      }
    }
  }
}
