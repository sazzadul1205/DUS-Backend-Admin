<?php
// app/Http/Controllers/Cms/CmsController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\AboutContent;
use App\Models\pages\Blog;
use App\Models\pages\CustomSectionData;
use App\Models\pages\Page;
use App\Models\pages\Program;
use App\Models\pages\SectionConfig;
use App\Models\pages\SharedData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CMS Controller for Inertia.js Administration
 * 
 * This controller handles all CMS administrative functionality using Inertia.js
 * Provides CRUD operations for all content types based on the provided models
 * 
 * @package App\Http\Controllers\Cms
 */
class CmsController extends Controller
{
    /* ==========================================
     | CMS DASHBOARD
     |========================================== */

  /**
   * Display CMS Dashboard
   * 
   * Shows statistics for all content types
   * 
   * @return Response Inertia response
   */
  public function dashboard(): Response
  {
    // TODO: Connect to React page: CMS/Dashboard
    // Expected props: stats with counts for all content types

    return Inertia::render('CMS/Dashboard', [
      'stats' => [
        'pages' => Page::count(),
        'active_pages' => Page::active()->count(),
        'blogs' => Blog::count(),
        'active_blogs' => Blog::active()->count(),
        'programs' => Program::count(),
        'active_programs' => Program::active()->count(),
        'about_contents' => AboutContent::count(),
        'active_about_contents' => AboutContent::active()->count(),
        'shared_data' => SharedData::count(),
        'custom_sections' => CustomSectionData::count(),
        'section_configs' => SectionConfig::count(),
      ]
    ]);
  }

    /* ==========================================
     | PAGE MANAGEMENT (CRUD)
     |========================================== */

  /**
   * Display list of all pages
   * 
   * @return Response Inertia response
   */
  public function pages(): Response
  {
    // TODO: Connect to React page: CMS/Pages/Index
    // Expected props: pages array with sectionConfigs relationship

    $pages = Page::with('sectionConfigs')
      ->orderBy('name')
      ->get();

    return Inertia::render('CMS/Pages/Index', [
      'pages' => $pages
    ]);
  }

  /**
   * Show form for creating a new page
   * 
   * @return Response Inertia response
   */
  public function createPage(): Response
  {
    // TODO: Connect to React page: CMS/Pages/Create
    // Expected props: none needed for basic page creation

    return Inertia::render('CMS/Pages/Create');
  }

  /**
   * Store a newly created page
   * 
   * Validation Rules:
   * - slug: required, unique, max:255, auto-slugified
   * - name: required, max:255
   * - title: required, max:255
   * - description: nullable, string
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storePage(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:pages,slug|max:255',
      'name' => 'required|string|max:255',
      'title' => 'required|string|max:255',
      'description' => 'nullable|string',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    Page::create([
      'slug' => Str::slug($request->slug),
      'name' => $request->name,
      'title' => $request->title,
      'description' => $request->description,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.pages')->with('success', 'Page created successfully.');
  }

  /**
   * Show form for editing a page
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editPage(int $id): Response
  {
    // TODO: Connect to React page: CMS/Pages/Edit
    // Expected props: page data with sectionConfigs relationship

    $page = Page::with('sectionConfigs')->findOrFail($id);

    return Inertia::render('CMS/Pages/Edit', [
      'page' => $page
    ]);
  }

  /**
   * Update the specified page
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updatePage(Request $request, int $id)
  {
    $page = Page::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|max:255|unique:pages,slug,' . $id,
      'name' => 'required|string|max:255',
      'title' => 'required|string|max:255',
      'description' => 'nullable|string',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $page->update([
      'slug' => Str::slug($request->slug),
      'name' => $request->name,
      'title' => $request->title,
      'description' => $request->description,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.pages')->with('success', 'Page updated successfully.');
  }

  /**
   * Remove the specified page (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroyPage(int $id)
  {
    $page = Page::findOrFail($id);
    $page->delete();

    return redirect()->route('cms.pages')->with('success', 'Page deleted successfully.');
  }

    /* ==========================================
     | SECTION CONFIG MANAGEMENT
     |========================================== */

  /**
   * Display section configurations for a page
   * 
   * @param int $pageId
   * @return Response Inertia response
   */
  public function pageSections(int $pageId): Response
  {
    // TODO: Connect to React page: CMS/Pages/Sections
    // Expected props: page data, sections list ordered by display_order

    $page = Page::with(['sectionConfigs' => function ($query) {
      $query->ordered();
    }])->findOrFail($pageId);

    return Inertia::render('CMS/Pages/Sections', [
      'page' => $page,
      'sections' => $page->sectionConfigs,
    ]);
  }

  /**
   * Create a new section configuration for a page
   * 
   * Validation Rules:
   * - section_key: required, unique per page, max:255
   * - component: required, max:255
   * - data_table: nullable, max:255 (must match existing table names)
   * - data_key: nullable, max:255
   * - prop_name: nullable, max:255
   * - display_order: integer, min:0
   * - is_enabled: boolean
   * - is_fixed_section: boolean
   * - is_special_component: boolean
   * - custom_props: nullable, array
   * 
   * @param Request $request
   * @param int $pageId
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeSectionConfig(Request $request, int $pageId)
  {
    $page = Page::findOrFail($pageId);

    $validator = Validator::make($request->all(), [
      'section_key' => 'required|string|max:255|unique:section_configs,section_key,NULL,id,page_slug,' . $page->slug,
      'component' => 'required|string|max:255',
      'data_table' => 'nullable|string|max:255',
      'data_key' => 'nullable|string|max:255',
      'prop_name' => 'nullable|string|max:255',
      'display_order' => 'integer|min:0',
      'is_enabled' => 'boolean',
      'is_fixed_section' => 'boolean',
      'is_special_component' => 'boolean',
      'custom_props' => 'nullable|array',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    SectionConfig::create([
      'page_slug' => $page->slug,
      'section_key' => $request->section_key,
      'component' => $request->component,
      'data_table' => $request->data_table,
      'data_key' => $request->data_key,
      'prop_name' => $request->prop_name,
      'display_order' => $request->display_order ?? 0,
      'is_enabled' => $request->is_enabled ?? true,
      'is_fixed_section' => $request->is_fixed_section ?? false,
      'is_special_component' => $request->is_special_component ?? false,
      'custom_props' => $request->custom_props ?? [],
    ]);

    return redirect()
      ->route('cms.pages.sections', $pageId)
      ->with('success', 'Section configuration created successfully.');
  }

  /**
   * Update a section configuration
   * 
   * @param Request $request
   * @param int $pageId
   * @param int $sectionId
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateSectionConfig(Request $request, int $pageId, int $sectionId)
  {
    $page = Page::findOrFail($pageId);
    $section = SectionConfig::where('page_slug', $page->slug)
      ->where('id', $sectionId)
      ->firstOrFail();

    $validator = Validator::make($request->all(), [
      'section_key' => 'required|string|max:255|unique:section_configs,section_key,' . $sectionId . ',id,page_slug,' . $page->slug,
      'component' => 'required|string|max:255',
      'data_table' => 'nullable|string|max:255',
      'data_key' => 'nullable|string|max:255',
      'prop_name' => 'nullable|string|max:255',
      'display_order' => 'integer|min:0',
      'is_enabled' => 'boolean',
      'is_fixed_section' => 'boolean',
      'is_special_component' => 'boolean',
      'custom_props' => 'nullable|array',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $section->update([
      'section_key' => $request->section_key,
      'component' => $request->component,
      'data_table' => $request->data_table,
      'data_key' => $request->data_key,
      'prop_name' => $request->prop_name,
      'display_order' => $request->display_order ?? 0,
      'is_enabled' => $request->is_enabled ?? true,
      'is_fixed_section' => $request->is_fixed_section ?? false,
      'is_special_component' => $request->is_special_component ?? false,
      'custom_props' => $request->custom_props ?? [],
    ]);

    return redirect()
      ->route('cms.pages.sections', $pageId)
      ->with('success', 'Section configuration updated successfully.');
  }

  /**
   * Remove a section configuration (soft delete)
   * 
   * @param int $pageId
   * @param int $sectionId
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroySectionConfig(int $pageId, int $sectionId)
  {
    $page = Page::findOrFail($pageId);
    $section = SectionConfig::where('page_slug', $page->slug)
      ->where('id', $sectionId)
      ->firstOrFail();

    $section->delete();

    return redirect()
      ->route('cms.pages.sections', $pageId)
      ->with('success', 'Section configuration deleted successfully.');
  }

    /* ==========================================
     | ABOUT CONTENT MANAGEMENT
     |========================================== */

  /**
   * Display list of about content
   * 
   * @return Response Inertia response
   */
  public function aboutContent(): Response
  {
    // TODO: Connect to React page: CMS/About/Index
    // Expected props: about_contents list ordered by display_order

    $aboutContents = AboutContent::ordered()->get();

    return Inertia::render('CMS/About/Index', [
      'about_contents' => $aboutContents
    ]);
  }

  /**
   * Show form for creating about content
   * 
   * @return Response Inertia response
   */
  public function createAboutContent(): Response
  {
    // TODO: Connect to React page: CMS/About/Create
    // Expected props: available_types ['main', 'detail']

    return Inertia::render('CMS/About/Create', [
      'available_types' => ['main', 'detail']
    ]);
  }

  /**
   * Store about content
   * 
   * Validation Rules:
   * - slug: required, unique, max:255
   * - title: required, max:255
   * - type: required, in:main,detail
   * - content: nullable, string (short description)
   * - full_content: nullable, string (HTML content)
   * - image: nullable, string (path)
   * - icon: nullable, string
   * - bg_color: nullable, string (hex color)
   * - btn_text: nullable, string
   * - btn_link: nullable, string (URL)
   * - display_order: integer, min:0
   * - is_featured: boolean
   * - tags: nullable, array
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeAboutContent(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:about_content,slug|max:255',
      'title' => 'required|string|max:255',
      'type' => 'required|string|in:main,detail',
      'content' => 'nullable|string',
      'full_content' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'icon' => 'nullable|string|max:255',
      'bg_color' => 'nullable|string|max:50',
      'btn_text' => 'nullable|string|max:255',
      'btn_link' => 'nullable|string|max:255',
      'display_order' => 'integer|min:0',
      'is_featured' => 'boolean',
      'tags' => 'nullable|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    AboutContent::create([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'type' => $request->type,
      'content' => $request->content,
      'full_content' => $request->full_content,
      'image' => $request->image,
      'icon' => $request->icon,
      'bg_color' => $request->bg_color,
      'btn_text' => $request->btn_text,
      'btn_link' => $request->btn_link,
      'display_order' => $request->display_order ?? 0,
      'is_featured' => $request->is_featured ?? false,
      'tags' => $request->tags ?? [],
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.about')->with('success', 'About content created successfully.');
  }

  /**
   * Show form for editing about content
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editAboutContent(int $id): Response
  {
    // TODO: Connect to React page: CMS/About/Edit
    // Expected props: about_content data

    $aboutContent = AboutContent::findOrFail($id);

    return Inertia::render('CMS/About/Edit', [
      'about_content' => $aboutContent
    ]);
  }

  /**
   * Update about content
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateAboutContent(Request $request, int $id)
  {
    $aboutContent = AboutContent::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|max:255|unique:about_content,slug,' . $id,
      'title' => 'required|string|max:255',
      'type' => 'required|string|in:main,detail',
      'content' => 'nullable|string',
      'full_content' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'icon' => 'nullable|string|max:255',
      'bg_color' => 'nullable|string|max:50',
      'btn_text' => 'nullable|string|max:255',
      'btn_link' => 'nullable|string|max:255',
      'display_order' => 'integer|min:0',
      'is_featured' => 'boolean',
      'tags' => 'nullable|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $aboutContent->update([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'type' => $request->type,
      'content' => $request->content,
      'full_content' => $request->full_content,
      'image' => $request->image,
      'icon' => $request->icon,
      'bg_color' => $request->bg_color,
      'btn_text' => $request->btn_text,
      'btn_link' => $request->btn_link,
      'display_order' => $request->display_order ?? 0,
      'is_featured' => $request->is_featured ?? false,
      'tags' => $request->tags ?? [],
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.about')->with('success', 'About content updated successfully.');
  }

  /**
   * Remove about content (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroyAboutContent(int $id)
  {
    $aboutContent = AboutContent::findOrFail($id);
    $aboutContent->delete();

    return redirect()->route('cms.about')->with('success', 'About content deleted successfully.');
  }

    /* ==========================================
     | BLOG MANAGEMENT
     |========================================== */

  /**
   * Display list of blogs
   * 
   * @return Response Inertia response
   */
  public function blogs(): Response
  {
    // TODO: Connect to React page: CMS/Blogs/Index
    // Expected props: blogs list ordered by latest first

    $blogs = Blog::latest()->get();

    return Inertia::render('CMS/Blogs/Index', [
      'blogs' => $blogs
    ]);
  }

  /**
   * Show form for creating a blog
   * 
   * @return Response Inertia response
   */
  public function createBlog(): Response
  {
    // TODO: Connect to React page: CMS/Blogs/Create

    return Inertia::render('CMS/Blogs/Create');
  }

  /**
   * Store a blog post
   * 
   * Validation Rules:
   * - slug: required, unique, max:255
   * - title: required, max:255
   * - excerpt: nullable, string
   * - full_content: nullable, string (HTML content)
   * - image: nullable, string (path)
   * - date: nullable, date
   * - author: nullable, string, max:255
   * - read_time: nullable, string, max:50
   * - tags: nullable, array
   * - is_featured: boolean
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeBlog(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:blogs,slug|max:255',
      'title' => 'required|string|max:255',
      'excerpt' => 'nullable|string',
      'full_content' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'date' => 'nullable|date',
      'author' => 'nullable|string|max:255',
      'read_time' => 'nullable|string|max:50',
      'tags' => 'nullable|array',
      'is_featured' => 'boolean',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    Blog::create([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'excerpt' => $request->excerpt,
      'full_content' => $request->full_content,
      'image' => $request->image,
      'date' => $request->date,
      'author' => $request->author,
      'read_time' => $request->read_time,
      'tags' => $request->tags ?? [],
      'is_featured' => $request->is_featured ?? false,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.blogs')->with('success', 'Blog created successfully.');
  }

  /**
   * Show form for editing a blog
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editBlog(int $id): Response
  {
    // TODO: Connect to React page: CMS/Blogs/Edit
    // Expected props: blog data

    $blog = Blog::findOrFail($id);

    return Inertia::render('CMS/Blogs/Edit', [
      'blog' => $blog
    ]);
  }

  /**
   * Update a blog post
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateBlog(Request $request, int $id)
  {
    $blog = Blog::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|max:255|unique:blogs,slug,' . $id,
      'title' => 'required|string|max:255',
      'excerpt' => 'nullable|string',
      'full_content' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'date' => 'nullable|date',
      'author' => 'nullable|string|max:255',
      'read_time' => 'nullable|string|max:50',
      'tags' => 'nullable|array',
      'is_featured' => 'boolean',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $blog->update([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'excerpt' => $request->excerpt,
      'full_content' => $request->full_content,
      'image' => $request->image,
      'date' => $request->date,
      'author' => $request->author,
      'read_time' => $request->read_time,
      'tags' => $request->tags ?? [],
      'is_featured' => $request->is_featured ?? false,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.blogs')->with('success', 'Blog updated successfully.');
  }

  /**
   * Remove a blog post (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroyBlog(int $id)
  {
    $blog = Blog::findOrFail($id);
    $blog->delete();

    return redirect()->route('cms.blogs')->with('success', 'Blog deleted successfully.');
  }

    /* ==========================================
     | PROGRAM MANAGEMENT
     |========================================== */

  /**
   * Display list of programs
   * 
   * @return Response Inertia response
   */
  public function programs(): Response
  {
    // TODO: Connect to React page: CMS/Programs/Index
    // Expected props: programs list ordered by display_order

    $programs = Program::ordered()->get();

    return Inertia::render('CMS/Programs/Index', [
      'programs' => $programs
    ]);
  }

  /**
   * Show form for creating a program
   * 
   * @return Response Inertia response
   */
  public function createProgram(): Response
  {
    // TODO: Connect to React page: CMS/Programs/Create

    return Inertia::render('CMS/Programs/Create');
  }

  /**
   * Store a program
   * 
   * Validation Rules:
   * - slug: required, unique, max:255
   * - title: required, max:255
   * - breadcrumb: nullable, max:255
   * - full_content_html: nullable, string (HTML content)
   * - image: nullable, string (path)
   * - bg_color: nullable, string (hex color)
   * - link: nullable, string (URL)
   * - is_featured: boolean
   * - display_order: integer, min:0
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeProgram(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|unique:programs,slug|max:255',
      'title' => 'required|string|max:255',
      'breadcrumb' => 'nullable|string|max:255',
      'full_content_html' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'bg_color' => 'nullable|string|max:50',
      'link' => 'nullable|string|max:255',
      'is_featured' => 'boolean',
      'display_order' => 'integer|min:0',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    Program::create([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'breadcrumb' => $request->breadcrumb,
      'full_content_html' => $request->full_content_html,
      'image' => $request->image,
      'bg_color' => $request->bg_color,
      'link' => $request->link,
      'is_featured' => $request->is_featured ?? false,
      'display_order' => $request->display_order ?? 0,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.programs')->with('success', 'Program created successfully.');
  }

  /**
   * Show form for editing a program
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editProgram(int $id): Response
  {
    // TODO: Connect to React page: CMS/Programs/Edit
    // Expected props: program data

    $program = Program::findOrFail($id);

    return Inertia::render('CMS/Programs/Edit', [
      'program' => $program
    ]);
  }

  /**
   * Update a program
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateProgram(Request $request, int $id)
  {
    $program = Program::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'slug' => 'required|string|max:255|unique:programs,slug,' . $id,
      'title' => 'required|string|max:255',
      'breadcrumb' => 'nullable|string|max:255',
      'full_content_html' => 'nullable|string',
      'image' => 'nullable|string|max:255',
      'bg_color' => 'nullable|string|max:50',
      'link' => 'nullable|string|max:255',
      'is_featured' => 'boolean',
      'display_order' => 'integer|min:0',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $program->update([
      'slug' => Str::slug($request->slug),
      'title' => $request->title,
      'breadcrumb' => $request->breadcrumb,
      'full_content_html' => $request->full_content_html,
      'image' => $request->image,
      'bg_color' => $request->bg_color,
      'link' => $request->link,
      'is_featured' => $request->is_featured ?? false,
      'display_order' => $request->display_order ?? 0,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.programs')->with('success', 'Program updated successfully.');
  }

  /**
   * Remove a program (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroyProgram(int $id)
  {
    $program = Program::findOrFail($id);
    $program->delete();

    return redirect()->route('cms.programs')->with('success', 'Program deleted successfully.');
  }

    /* ==========================================
     | CUSTOM SECTION DATA MANAGEMENT
     |========================================== */

  /**
   * Display list of custom section data
   * 
   * @param Request $request
   * @return Response Inertia response
   */
  public function customSectionData(Request $request): Response
  {
    // TODO: Connect to React page: CMS/CustomSections/Index
    // Expected props: custom_sections list with page relationship

    $query = CustomSectionData::with('page');

    // Optional filter by page slug
    if ($request->has('page_slug')) {
      $query->forPage($request->page_slug);
    }

    $customSections = $query->orderBy('page_slug')
      ->orderBy('section_key')
      ->get();

    return Inertia::render('CMS/CustomSections/Index', [
      'custom_sections' => $customSections
    ]);
  }

  /**
   * Show form for creating custom section data
   * 
   * @return Response Inertia response
   */
  public function createCustomSection(): Response
  {
    // TODO: Connect to React page: CMS/CustomSections/Create
    // Expected props: pages list for dropdown selection

    return Inertia::render('CMS/CustomSections/Create', [
      'pages' => Page::active()->get(['id', 'slug', 'name'])
    ]);
  }

  /**
   * Store custom section data
   * 
   * Validation Rules:
   * - page_slug: required, exists:pages,slug
   * - section_key: required, max:255, unique per page
   * - data: required, array (JSON data for section)
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeCustomSection(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'page_slug' => 'required|string|exists:pages,slug',
      'section_key' => 'required|string|max:255|unique:custom_section_data,section_key,NULL,id,page_slug,' . $request->page_slug,
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    CustomSectionData::create([
      'page_slug' => $request->page_slug,
      'section_key' => $request->section_key,
      'data' => $request->data,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.custom-sections')->with('success', 'Custom section data created successfully.');
  }

  /**
   * Show form for editing custom section data
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editCustomSection(int $id): Response
  {
    // TODO: Connect to React page: CMS/CustomSections/Edit
    // Expected props: custom_section data, pages list

    $customSection = CustomSectionData::findOrFail($id);

    return Inertia::render('CMS/CustomSections/Edit', [
      'custom_section' => $customSection,
      'pages' => Page::active()->get(['id', 'slug', 'name'])
    ]);
  }

  /**
   * Update custom section data
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateCustomSection(Request $request, int $id)
  {
    $customSection = CustomSectionData::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'page_slug' => 'required|string|exists:pages,slug',
      'section_key' => 'required|string|max:255|unique:custom_section_data,section_key,' . $id . ',id,page_slug,' . $request->page_slug,
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $customSection->update([
      'page_slug' => $request->page_slug,
      'section_key' => $request->section_key,
      'data' => $request->data,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.custom-sections')->with('success', 'Custom section data updated successfully.');
  }

  /**
   * Remove custom section data (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroyCustomSection(int $id)
  {
    $customSection = CustomSectionData::findOrFail($id);
    $customSection->delete();

    return redirect()->route('cms.custom-sections')->with('success', 'Custom section data deleted successfully.');
  }

    /* ==========================================
     | SHARED DATA MANAGEMENT
     |========================================== */

  /**
   * Display list of shared data
   * 
   * @return Response Inertia response
   */
  public function sharedData(): Response
  {
    // TODO: Connect to React page: CMS/SharedData/Index
    // Expected props: shared_data list ordered by type

    $sharedData = SharedData::orderBy('type')->get();

    return Inertia::render('CMS/SharedData/Index', [
      'shared_data' => $sharedData
    ]);
  }

  /**
   * Show form for creating shared data
   * 
   * @return Response Inertia response
   */
  public function createSharedData(): Response
  {
    // TODO: Connect to React page: CMS/SharedData/Create
    // Expected props: available_types list from the model

    return Inertia::render('CMS/SharedData/Create', [
      'available_types' => ['topbar', 'navbar', 'footer', 'faq', 'upcoming-events']
    ]);
  }

  /**
   * Store shared data
   * 
   * Validation Rules:
   * - type: required, unique, max:255
   * - data: required, array (JSON data)
   * - is_active: boolean
   * 
   * @param Request $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function storeSharedData(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'type' => 'required|string|unique:shared_data,type|max:255',
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    SharedData::create([
      'type' => $request->type,
      'data' => $request->data,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.shared-data')->with('success', 'Shared data created successfully.');
  }

  /**
   * Show form for editing shared data
   * 
   * @param int $id
   * @return Response Inertia response
   */
  public function editSharedData(int $id): Response
  {
    // TODO: Connect to React page: CMS/SharedData/Edit
    // Expected props: shared_data data

    $sharedData = SharedData::findOrFail($id);

    return Inertia::render('CMS/SharedData/Edit', [
      'shared_data' => $sharedData,
      'available_types' => ['topbar', 'navbar', 'footer', 'faq', 'upcoming-events']
    ]);
  }

  /**
   * Update shared data
   * 
   * @param Request $request
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function updateSharedData(Request $request, int $id)
  {
    $sharedData = SharedData::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'type' => 'required|string|max:255|unique:shared_data,type,' . $id,
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    $sharedData->update([
      'type' => $request->type,
      'data' => $request->data,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->route('cms.shared-data')->with('success', 'Shared data updated successfully.');
  }

  /**
   * Remove shared data (soft delete)
   * 
   * @param int $id
   * @return \Illuminate\Http\RedirectResponse
   */
  public function destroySharedData(int $id)
  {
    $sharedData = SharedData::findOrFail($id);
    $sharedData->delete();

    return redirect()->route('cms.shared-data')->with('success', 'Shared data deleted successfully.');
  }
}
