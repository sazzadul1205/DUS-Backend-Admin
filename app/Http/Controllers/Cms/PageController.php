<?php
// app/Http/Controllers/Cms/PageController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
  /**
   * Protected pages that cannot be deleted or deactivated
   */
  protected function getProtectedPages(): array
  {
    return [
      'home',
      'about',
      'services',
      'contact',
      'blog',
      'programs',
    ];
  }

  /**
   * Check if a page is protected
   */
  protected function isProtected(Page $page): bool
  {
    // Pages with "-details" suffix are always protected
    if (str_ends_with($page->slug, '-details')) {
      return true;
    }

    return in_array($page->slug, $this->getProtectedPages());
  }

  /**
   * Display pages
   */
  public function index(): Response
  {
    $items = Page::withTrashed()->get();

    return Inertia::render('Backend/CMS/Index', [
      'items' => $items,
      'protectedPages' => $this->getProtectedPages(),
    ]);
  }

  /**
   * Store a new page
   */
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:pages,slug',
      'name' => 'required|string|max:255',
      'title' => 'nullable|string|max:255',
      'description' => 'nullable|string',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    Page::create($request->all());

    return redirect()->back()->with('success', 'Page created successfully.');
  }

  /**
   * Update a page
   */
  public function update(Request $request, int $id)
  {
    $page = Page::withTrashed()->findOrFail($id);

    // Check if page is protected
    if ($this->isProtected($page)) {
      // Prevent deactivating protected pages
      if (isset($request->is_active) && !$request->is_active) {
        return back()->with('error', 'Cannot deactivate a protected page.');
      }
    }

    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:pages,slug,' . $id,
      'name' => 'required|string|max:255',
      'title' => 'nullable|string|max:255',
      'description' => 'nullable|string',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $page->update($request->all());

    return redirect()->back()->with('success', 'Page updated successfully.');
  }

  /**
   * Toggle page status
   */
  public function toggleStatus(int $id)
  {
    $page = Page::findOrFail($id);

    if ($this->isProtected($page)) {
      return back()->with('error', 'Cannot deactivate a protected page.');
    }

    $page->is_active = !$page->is_active;
    $page->save();

    return redirect()->back()->with('success', 'Page status updated successfully.');
  }

  /**
   * Soft delete a page
   */
  public function destroy(int $id)
  {
    $page = Page::findOrFail($id);

    if ($this->isProtected($page)) {
      return back()->with('error', 'Cannot delete a protected page.');
    }

    $page->delete();

    return redirect()->back()->with('success', 'Page deleted successfully.');
  }

  /**
   * Restore a soft-deleted page
   */
  public function restore(int $id)
  {
    $page = Page::withTrashed()->findOrFail($id);
    $page->restore();

    return redirect()->back()->with('success', 'Page restored successfully.');
  }

  /**
   * Force delete a page
   */
  public function forceDelete(int $id)
  {
    $page = Page::withTrashed()->findOrFail($id);

    if ($this->isProtected($page)) {
      return back()->with('error', 'Cannot delete a protected page.');
    }

    $page->forceDelete();

    return redirect()->back()->with('success', 'Page permanently deleted.');
  }
}
