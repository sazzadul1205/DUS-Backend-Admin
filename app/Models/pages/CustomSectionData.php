<?php
// app/Models/pages/CustomSectionData.php

namespace App\Models\pages;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Schema\Builder;

class CustomSectionData extends Model
{
  use SoftDeletes;

  /**
   * Table name
   */
  protected $table = 'custom_section_data';

  /**
   * Fillable fields
   */
  protected $fillable = [
    'page_slug',
    'section_key',
    'data',
    'is_active',
  ];

  /**
   * Cast fields
   */
  protected $casts = [
    'data' => 'array',
    'is_active' => 'boolean',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
    'deleted_at' => 'datetime',
  ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

  /**
   * Get the page that owns the custom section data
   */
  public function page(): BelongsTo
  {
    return $this->belongsTo(Page::class, 'page_slug', 'slug');
  }

  /**
   * Get the section config for this custom section data
   */
  public function sectionConfig()
  {
    return $this->hasOne(SectionConfig::class, 'section_key', 'section_key')
      ->where('page_slug', $this->page_slug);
  }

    /* ==========================================
     | SCOPES
     |========================================== */

  /**
   * Scope active custom section data
   */
  public function scopeActive(Builder $query): Builder
  {
    return $query->where('is_active', true);
  }

  /**
   * Scope for a specific page
   */
  public function scopeForPage(Builder $query, string $pageSlug): Builder
  {
    return $query->where('page_slug', $pageSlug);
  }

  /**
   * Scope for a specific section key
   */
  public function scopeForSection(Builder $query, string $sectionKey): Builder
  {
    return $query->where('section_key', $sectionKey);
  }

    /* ==========================================
     | ACCESSORS
     |========================================== */

  /**
   * Get data as object
   */
  public function getDataObjectAttribute()
  {
    return json_decode(json_encode($this->data));
  }
}
