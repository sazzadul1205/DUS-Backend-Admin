<?php
// app/Http/Controllers/Cms/SectionController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\Page;
use App\Models\pages\SectionConfig;
use App\Models\pages\CustomSectionData;
use App\Models\pages\SharedData;
use App\Models\pages\Blog;
use App\Models\pages\Program;
use App\Models\pages\AboutContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SectionController extends Controller
{
  /**
   * Extract clean data from CustomSectionData model
   */
  protected function extractCustomSectionData($customData)
  {
    if (!$customData) {
      return null;
    }

    $rawData = $customData->data;

    if (is_string($rawData)) {
      $decodedData = json_decode($rawData, true);
      if ($decodedData !== null) {
        // Extract nested 'data' if exists, otherwise use the decoded data
        return $decodedData['data'] ?? $decodedData;
      }
      return $rawData;
    }

    return $rawData;
  }

  /**
   * Extract clean data from SharedData model
   */
  protected function extractSharedData($shared)
  {
    if (!$shared) {
      return null;
    }

    $rawData = $shared->data ?? $shared;

    if (is_string($rawData)) {
      $decodedData = json_decode($rawData, true);
      if ($decodedData !== null) {
        return $decodedData['data'] ?? $decodedData;
      }
      return $rawData;
    }

    return $rawData;
  }

  /**
   * Display a listing of sections for a specific page.
   */
  public function index(int $pageId)
  {
    $page = Page::withTrashed()->findOrFail($pageId);

    $sectionConfigs = SectionConfig::where('page_slug', $page->slug)
      ->orderBy('display_order')
      ->get();

    $customSectionData = CustomSectionData::where('page_slug', $page->slug)
      ->get()
      ->keyBy('section_key');

    $sharedData = SharedData::whereIn('type', $sectionConfigs->pluck('section_key'))
      ->get()
      ->keyBy('type');

    $sections = [];

    foreach ($sectionConfigs as $config) {
      $section = $config->toArray();

      switch ($config->data_table) {
        case 'custom_section_data':
          $section['data'] = $this->extractCustomSectionData(
            $customSectionData->get($config->section_key)
          );
          break;

        case 'shared_data':
          $section['data'] = $this->extractSharedData(
            $sharedData->get($config->section_key)
          );
          break;

        case 'blogs':
          $section['data'] = Blog::active()->latest()->get();
          break;

        case 'programs':
          $section['data'] = Program::active()->ordered()->get();
          break;

        case 'about_content':
          $aboutContent = AboutContent::where('slug', $config->section_key)
            ->active()
            ->first();
          $section['data'] = $aboutContent ? $aboutContent->data : null;
          break;

        default:
          $section['data'] = null;
          break;
      }

      $sections[] = $section;
    }

    // Remove the dd() and return the data
    return Inertia::render('Backend/CMS/Section/Index', [
      'page' => $page,
      'sections' => $sections,
    ]);
  }

  /**
   * Update display order for multiple sections (drag & drop)
   */
  public function updateOrder(Request $request, int $pageId)
  {
    $page = Page::findOrFail($pageId);

    $validator = Validator::make($request->all(), [
      'orders' => 'required|array',
      'orders.*.id' => 'required|integer|exists:section_configs,id',
      'orders.*.display_order' => 'required|integer|min:0',
    ]);

    if ($validator->fails()) {
      // Return back with errors for Inertia
      return back()->withErrors($validator)->withInput();
    }

    try {
      DB::beginTransaction();

      foreach ($request->orders as $orderData) {
        $section = SectionConfig::where('id', $orderData['id'])
          ->where('page_slug', $page->slug)
          ->first();

        // Only update if section exists and is not fixed
        if ($section && !$section->is_fixed_section) {
          $section->update([
            'display_order' => $orderData['display_order']
          ]);
        }
      }

      DB::commit();

      // Return back with success message for Inertia
      return back()->with('success', 'Section order updated successfully.');
    } catch (\Exception $e) {
      DB::rollBack();

      // Return back with error message for Inertia
      return back()->with('error', 'Failed to update section order: ' . $e->getMessage());
    }
  }

  /**
   * Show the form for creating a new section.
   */
  public function create()
  {
    // Not implemented
  }

  /**
   * Store a newly created section in storage.
   */
  public function store(Request $request)
  {
    // Not implemented
  }

  /**
   * Display the specified section.
   */
  public function show($id)
  {
    // Not implemented
  }

  /**
   * Show the form for editing the specified section.
   */
  public function edit($id)
  {
    // Not implemented
  }

  /**
   * Update the specified section in storage.
   */
  public function update(Request $request, $id)
  {
    // Not implemented
  }

  /**
   * Remove the specified section from storage.
   */
  public function destroy($id)
  {
    // Not implemented
  }
}
