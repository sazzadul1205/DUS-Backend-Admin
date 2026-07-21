<?php
// app/Http/Controllers/Cms/BlogController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\SimpleLogger;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
  /**
   * Display blogs
   */
  public function index(): Response
  {
    try {
      $items = Blog::withTrashed()->orderBy('created_at', 'desc')->get();

      return Inertia::render('Backend/CMS/Blogs/Index', [
        'items' => $items,
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to fetch blogs: ' . $e->getMessage());
      return Inertia::render('Backend/CMS/Blogs/Index', [
        'items' => [],
        'flash' => ['error' => 'Failed to load blogs. Please try again.']
      ]);
    }
  }

  /**
   * Store a new blog
   */
  public function store(Request $request)
  {
    try {
      $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'slug' => 'nullable|string|unique:blogs,slug',
        'excerpt' => 'nullable|string|max:500',
        'full_content' => 'nullable|string',
        'image' => 'nullable|string',
        'date' => 'nullable|string|max:255',
        'author' => 'nullable|string|max:255',
        'read_time' => 'nullable|integer|min:1|max:60',
        'tags' => 'nullable|array',
        'tags.*' => 'string|max:50',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
      ]);

      if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
      }

      $data = $request->all();

      // Process image if it's a base64 string
      if (!empty($data['image']) && $this->isBase64Image($data['image'])) {
        $uploadedPath = $this->uploadImage($data['image']);
        if ($uploadedPath) {
          $data['image'] = $uploadedPath;
        } else {
          unset($data['image']);
          Log::warning('Image upload failed for blog: ' . ($data['title'] ?? 'unknown'));
        }
      }

      $this->cleanSessionOldInput();

      if (empty($data['slug'])) {
        $data['slug'] = $this->generateUniqueSlug($data['title']);
      }

      $data['is_featured'] = filter_var($data['is_featured'] ?? false, FILTER_VALIDATE_BOOLEAN);
      $data['is_active'] = filter_var($data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN);
      $data['date'] = $data['date'] ?? now()->format('F j, Y');
      $data['author'] = $data['author'] ?? 'Admin';
      $data['read_time'] = (int)($data['read_time'] ?? 5);

      if (isset($data['tags']) && is_array($data['tags'])) {
        $data['tags'] = array_values(array_unique(array_filter($data['tags'])));
      }

      $blog = Blog::create($data);

      // Log blog creation
      SimpleLogger::cms(
        "Blog created: {$blog->title}",
        [
          'blog_id' => $blog->id,
          'title' => $blog->title,
          'slug' => $blog->slug,
          'author' => $blog->author,
          'is_active' => $blog->is_active,
          'is_featured' => $blog->is_featured,
          'created_by' => Auth::user()?->email ?? 'system'
        ]
      );

      session()->forget('_old_input');

      return redirect()->back()->with('success', '✅ Blog created successfully!');
    } catch (\Exception $e) {
      Log::error('Blog creation failed: ' . $e->getMessage(), [
        'trace' => $e->getTraceAsString(),
        'input' => $request->except(['image', 'full_content'])
      ]);

      return back()
        ->withErrors(['error' => 'Failed to create blog: ' . $e->getMessage()])
        ->withInput();
    }
  }

  /**
   * Update a blog
   */
  public function update(Request $request, int $id)
  {
    try {
      $blog = Blog::withTrashed()->findOrFail($id);

      $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'slug' => 'nullable|string|unique:blogs,slug,' . $id,
        'excerpt' => 'nullable|string|max:500',
        'full_content' => 'nullable|string',
        'image' => 'nullable|string',
        'date' => 'nullable|string|max:255',
        'author' => 'nullable|string|max:255',
        'read_time' => 'nullable|integer|min:1|max:60',
        'tags' => 'nullable|array',
        'tags.*' => 'string|max:50',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
      ]);

      if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
      }

      $data = $request->all();

      // Track changes for logging
      $oldTitle = $blog->title;
      $oldStatus = $blog->is_active;
      $oldFeatured = $blog->is_featured;

      if (!empty($data['image']) && $this->isBase64Image($data['image'])) {
        if ($blog->image && !filter_var($blog->image, FILTER_VALIDATE_URL)) {
          $this->deleteImageFile($blog->image);
        }

        $uploadedPath = $this->uploadImage($data['image']);
        if ($uploadedPath) {
          $data['image'] = $uploadedPath;
        } else {
          unset($data['image']);
          Log::warning('Image upload failed for blog update: ' . ($data['title'] ?? 'unknown'));
        }
      }

      $this->cleanSessionOldInput();

      if (empty($data['slug']) || ($data['title'] !== $blog->title && $data['slug'] === $blog->slug)) {
        $data['slug'] = $this->generateUniqueSlug($data['title'], $id);
      }

      $data['is_featured'] = filter_var($data['is_featured'] ?? false, FILTER_VALIDATE_BOOLEAN);
      $data['is_active'] = filter_var($data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN);
      $data['read_time'] = (int)($data['read_time'] ?? 5);

      if (isset($data['tags']) && is_array($data['tags'])) {
        $data['tags'] = array_values(array_unique(array_filter($data['tags'])));
      }

      $blog->update($data);

      // Log the changes
      $changes = [];
      if ($oldTitle !== $blog->title) {
        $changes['title'] = ['old' => $oldTitle, 'new' => $blog->title];
      }
      if ($oldStatus !== $blog->is_active) {
        $changes['status'] = ['old' => $oldStatus ? 'active' : 'inactive', 'new' => $blog->is_active ? 'active' : 'inactive'];
      }
      if ($oldFeatured !== $blog->is_featured) {
        $changes['featured'] = ['old' => $oldFeatured ? 'yes' : 'no', 'new' => $blog->is_featured ? 'yes' : 'no'];
      }

      if (!empty($changes)) {
        SimpleLogger::cms(
          "Blog updated: {$blog->title}",
          [
            'blog_id' => $blog->id,
            'changes' => $changes,
            'updated_by' => Auth::user()?->email ?? 'system'
          ]
        );
      }

      session()->forget('_old_input');

      return redirect()->back()->with('success', '✅ Blog updated successfully!');
    } catch (\Exception $e) {
      Log::error('Blog update failed: ' . $e->getMessage(), [
        'trace' => $e->getTraceAsString(),
        'blog_id' => $id,
        'input' => $request->except(['image', 'full_content'])
      ]);

      return back()
        ->withErrors(['error' => 'Failed to update blog: ' . $e->getMessage()])
        ->withInput();
    }
  }

  /**
   * Toggle blog status
   */
  public function toggleStatus(int $id)
  {
    try {
      $blog = Blog::findOrFail($id);
      $blog->is_active = !$blog->is_active;
      $blog->save();

      $status = $blog->is_active ? 'activated' : 'deactivated';
      return redirect()->back()->with('success', "✅ Blog {$status} successfully.");
    } catch (\Exception $e) {
      Log::error('Blog status toggle failed: ' . $e->getMessage(), ['blog_id' => $id]);
      return redirect()->back()->with('error', 'Failed to toggle blog status.');
    }
  }

  /**
   * Toggle featured status
   */
  public function toggleFeatured(int $id)
  {
    try {
      $blog = Blog::findOrFail($id);

      // If making this blog featured, remove featured status from others
      if (!$blog->is_featured) {
        Blog::where('is_featured', true)->where('id', '!=', $id)->update(['is_featured' => false]);
      }

      $blog->is_featured = !$blog->is_featured;
      $blog->save();

      $status = $blog->is_featured ? 'featured' : 'unfeatured';
      return redirect()->back()->with('success', "✅ Blog {$status} successfully.");
    } catch (\Exception $e) {
      Log::error('Blog featured toggle failed: ' . $e->getMessage(), ['blog_id' => $id]);
      return redirect()->back()->with('error', 'Failed to toggle featured status.');
    }
  }

  /**
   * Soft delete a blog
   */
  public function destroy(int $id)
  {
    try {
      $blog = Blog::findOrFail($id);

      SimpleLogger::cms(
        "Blog moved to trash: {$blog->title}",
        [
          'blog_id' => $blog->id,
          'title' => $blog->title,
          'deleted_by' => Auth::user()?->email ?? 'system'
        ]
      );

      $blog->delete();

      return redirect()->back()->with('success', '🗑️ Blog moved to trash successfully.');
    } catch (\Exception $e) {
      Log::error('Blog deletion failed: ' . $e->getMessage(), ['blog_id' => $id]);
      return redirect()->back()->with('error', 'Failed to delete blog.');
    }
  }

  /**
   * Restore a soft-deleted blog
   */
  public function restore(int $id)
  {
    try {
      $blog = Blog::withTrashed()->findOrFail($id);
      $blog->restore();

      SimpleLogger::cms(
        "Blog restored: {$blog->title}",
        [
          'blog_id' => $blog->id,
          'title' => $blog->title,
          'restored_by' => Auth::user()?->email ?? 'system'
        ]
      );

      return redirect()->back()->with('success', '🔄 Blog restored successfully.');
    } catch (\Exception $e) {
      Log::error('Blog restoration failed: ' . $e->getMessage(), ['blog_id' => $id]);
      return redirect()->back()->with('error', 'Failed to restore blog.');
    }
  }

  /**
   * Clean session old input to prevent max_allowed_packet errors
   */
  protected function cleanSessionOldInput(): void
  {
    if (session()->has('_old_input')) {
      $oldInput = session()->get('_old_input');
      if (isset($oldInput['image']) && $this->isBase64Image($oldInput['image'])) {
        unset($oldInput['image']);
        session()->put('_old_input', $oldInput);
      }
    }
  }

  /**
   * Generate a unique slug
   */
  protected function generateUniqueSlug(string $title, ?int $excludeId = null): string
  {
    $slug = Str::slug($title);
    $originalSlug = $slug;
    $counter = 1;

    while (Blog::withTrashed()
      ->where('slug', $slug)
      ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
      ->exists()
    ) {
      $slug = $originalSlug . '-' . $counter;
      $counter++;
    }

    return $slug;
  }

  /**
   * Check if string is a base64 image
   */
  protected function isBase64Image(string $string): bool
  {
    return str_starts_with($string, 'data:image/');
  }

  /**
   * Upload image and return the path
   */
  protected function uploadImage(string $base64String): ?string
  {
    try {
      // Validate base64 format
      if (!preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches)) {
        Log::warning('Invalid base64 image format');
        return null;
      }

      $imageData = explode(',', $base64String);
      if (count($imageData) < 2) {
        Log::warning('Invalid base64 image data');
        return null;
      }

      $imageContent = base64_decode($imageData[1]);
      if ($imageContent === false) {
        Log::warning('Failed to decode base64 image');
        return null;
      }

      // Check file size (max 5MB)
      if (strlen($imageContent) > 5 * 1024 * 1024) {
        Log::warning('Image too large: ' . strlen($imageContent) . ' bytes');
        return null;
      }

      $extension = $this->getImageExtension($base64String);

      // Simple timestamp-based filename
      $filename = date('Ymd_His') . '_' . uniqid() . '.' . $extension;
      $path = 'Blogs/' . $filename;

      // Store the image
      $stored = Storage::disk('public')->put($path, $imageContent);

      if (!$stored) {
        Log::error('Failed to store image: ' . $path);
        return null;
      }

      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Image upload failed: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Get image extension from base64 string
   */
  protected function getImageExtension(string $base64String): string
  {
    $mimeMap = [
      'jpeg' => 'jpg',
      'jpg' => 'jpg',
      'png' => 'png',
      'gif' => 'gif',
      'webp' => 'webp',
      'svg+xml' => 'svg',
      'bmp' => 'bmp',
      'tiff' => 'tiff',
      'x-icon' => 'ico',
      'vnd.microsoft.icon' => 'ico',
    ];

    if (preg_match('/^data:image\/([^;]+);base64,/', $base64String, $matches)) {
      $mimeType = $matches[1];
      return $mimeMap[$mimeType] ?? 'png';
    }

    return 'png';
  }

  /**
   * Delete image file from storage
   */
  protected function deleteImageFile(string $imagePath): void
  {
    try {
      // Remove storage prefix if present
      $relativePath = str_replace('/storage/', '', $imagePath);
      if (Storage::disk('public')->exists($relativePath)) {
        Storage::disk('public')->delete($relativePath);
        Log::info('Image deleted: ' . $relativePath);
      }
    } catch (\Exception $e) {
      Log::warning('Failed to delete image: ' . $e->getMessage());
    }
  }

  /**
   * Delete images embedded in HTML content (only from editor-images folder)
   */
  protected function deleteImagesFromContent(?string $content): void
  {
    if (empty($content)) return;

    preg_match_all('/<img[^>]+src="([^"]+)"/i', $content, $matches);
    if (empty($matches[1])) return;

    foreach ($matches[1] as $src) {
      // Only delete images from the editor-images folder
      if (str_starts_with($src, '/storage/editor-images/')) {
        $relativePath = str_replace('/storage/', '', $src);
        try {
          if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
            Log::info('Embedded image deleted: ' . $relativePath);
          }
        } catch (\Exception $e) {
          Log::warning('Failed to delete embedded image: ' . $e->getMessage());
        }
      }
    }
  }
}
