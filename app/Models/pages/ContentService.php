<?php
// app/Services/ContentService.php

namespace App\Services;

use App\Models\pages\Page;
use App\Models\pages\Blog;
use App\Models\pages\Program;
use App\Models\pages\SharedData;
use App\Models\pages\AboutContent;
use App\Models\pages\SectionConfig;
use App\Models\pages\CustomSectionData;
use Illuminate\Database\Eloquent\Collection;

class ContentService
{
    /* ==========================================
     | PAGE METHODS
     |========================================== */

  /**
   * Get page by slug
   */
  public function getPage(string $slug): Page
  {
    return Page::where('slug', $slug)->active()->firstOrFail();
  }

  /**
   * Get all sections for a page
   */
  public function getPageSections(string $pageSlug): Collection
  {
    return SectionConfig::forPage($pageSlug)
      ->enabled()
      ->ordered()
      ->get();
  }

  /**
   * Get section data for a specific page and section
   */
  public function getSectionData(string $pageSlug, string $sectionKey)
  {
    $sectionConfig = SectionConfig::forPage($pageSlug)
      ->where('section_key', $sectionKey)
      ->first();

    if (!$sectionConfig) {
      return null;
    }

    return match ($sectionConfig->data_table) {
      'custom_section_data' => CustomSectionData::forPage($pageSlug)
        ->forSection($sectionKey)
        ->active()
        ->first(),

      'about_content' => AboutContent::where('slug', $sectionKey)
        ->active()
        ->first(),

      'blogs' => Blog::active()->latest()->get(),

      'programs' => Program::active()->ordered()->get(),

      'shared_data' => SharedData::ofType($sectionKey)->active()->first(),

      default => null,
    };
  }

    /* ==========================================
     | BLOG METHODS
     |========================================== */

  /**
   * Get all blogs with optional limit
   */
  public function getBlogs(?int $limit = null): Collection
  {
    return Blog::active()
      ->latest()
      ->when($limit, fn($q) => $q->limit($limit))
      ->get();
  }

  /**
   * Get featured blogs with optional limit
   */
  public function getFeaturedBlogs(?int $limit = null): Collection
  {
    return Blog::active()
      ->featured()
      ->latest()
      ->when($limit, fn($q) => $q->limit($limit))
      ->get();
  }

  /**
   * Get blog by slug
   */
  public function getBlog(string $slug): Blog
  {
    return Blog::where('slug', $slug)->active()->firstOrFail();
  }

  /**
   * Get related blogs
   */
  public function getRelatedBlogs(int $blogId, array $tags = [], int $limit = 3): Collection
  {
    return Blog::active()
      ->where('id', '!=', $blogId)
      ->latest()
      ->limit($limit)
      ->get();
  }

    /* ==========================================
     | PROGRAM METHODS
     |========================================== */

  /**
   * Get all programs with optional limit
   */
  public function getPrograms(?int $limit = null): Collection
  {
    return Program::active()
      ->ordered()
      ->when($limit, fn($q) => $q->limit($limit))
      ->get();
  }

  /**
   * Get featured programs with optional limit
   */
  public function getFeaturedPrograms(?int $limit = null): Collection
  {
    return Program::active()
      ->featured()
      ->ordered()
      ->when($limit, fn($q) => $q->limit($limit))
      ->get();
  }

  /**
   * Get program by slug
   */
  public function getProgram(string $slug): Program
  {
    return Program::where('slug', $slug)->active()->firstOrFail();
  }

    /* ==========================================
     | ABOUT METHODS
     |========================================== */

  /**
   * Get about content by slug
   */
  public function getAboutContent(string $slug): AboutContent
  {
    return AboutContent::where('slug', $slug)->active()->firstOrFail();
  }

  /**
   * Get main about content
   */
  public function getMainAboutContent(): ?AboutContent
  {
    return AboutContent::main()->active()->first();
  }

  /**
   * Get all about detail pages
   */
  public function getAboutDetails(): Collection
  {
    return AboutContent::detail()->active()->ordered()->get();
  }

    /* ==========================================
     | SHARED DATA METHODS
     |========================================== */

  /**
   * Get shared data by type
   */
  public function getSharedData(string $type): ?SharedData
  {
    return SharedData::ofType($type)->active()->first();
  }

  /**
   * Get topbar data
   */
  public function getTopbar(): ?SharedData
  {
    return $this->getSharedData('topbar');
  }

  /**
   * Get navbar data
   */
  public function getNavbar(): ?SharedData
  {
    return $this->getSharedData('navbar');
  }

  /**
   * Get footer data
   */
  public function getFooter(): ?SharedData
  {
    return $this->getSharedData('footer');
  }

  /**
   * Get FAQ data
   */
  public function getFaqs(): ?SharedData
  {
    return $this->getSharedData('faq');
  }

  /**
   * Get upcoming events data
   */
  public function getUpcomingEvents(): ?SharedData
  {
    return $this->getSharedData('upcoming-events');
  }
}
