<?php
// app/Http/Controllers/Api/ContentApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Query\Builder;

class ContentApiController extends Controller
{
  /**
   * Maximum items per page
   */
  private const MAX_PER_PAGE = 100;

  /**
   * Default items per page
   */
  private const DEFAULT_PER_PAGE = 15;

  /**
   * Get pages with query parameters
   */
  public function pages(Request $request): JsonResponse
  {
    try {
      $query = DB::table('pages')
        ->where('is_active', 1)
        ->select('id', 'slug', 'name', 'title', 'description', 'is_active', 'created_at', 'updated_at');

      // Apply filters
      $this->applyFilters($query, $request, [
        'slug' => 'where',
        'search' => 'search',
      ]);

      // Handle multiple slugs
      if ($request->has('slugs')) {
        $slugs = array_filter(explode(',', $request->slugs));
        if (!empty($slugs)) {
          $query->whereIn('slug', $slugs);
        }
      }

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'slug', 'name', 'title', 'created_at', 'updated_at']);

      // Return results
      return $this->paginateOrGet($query, $request);
    } catch (\Exception $e) {
      Log::error('Pages API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch pages');
    }
  }

  /**
   * Get section configs with query parameters
   */
  public function sectionConfigs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('section_configs')
        ->where('is_enabled', 1)
        ->orderBy('display_order');

      // Apply filters
      $this->applyFilters($query, $request, [
        'page_slug' => 'where',
        'component' => 'where',
        'data_table' => 'where',
        'is_fixed_section' => 'whereInt',
        'search' => 'search',
      ]);

      // Handle multiple components
      if ($request->has('components')) {
        $components = array_filter(explode(',', $request->components));
        if (!empty($components)) {
          $query->whereIn('component', $components);
        }
      }

      // Handle range filters
      $this->applyRangeFilters($query, $request, [
        'display_order' => ['min' => 'display_order_min', 'max' => 'display_order_max']
      ]);

      // Apply search on specific fields
      if ($request->has('search')) {
        $search = '%' . $request->search . '%';
        $query->where(function ($q) use ($search) {
          $q->where('component', 'like', $search)
            ->orWhere('data_key', 'like', $search)
            ->orWhere('section_key', 'like', $search);
        });
      }

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'display_order', 'component', 'page_slug', 'created_at']);

      return $this->paginateOrGet($query, $request, self::DEFAULT_PER_PAGE * 3);
    } catch (\Exception $e) {
      Log::error('Section configs API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch section configs');
    }
  }

  /**
   * Get shared data with query parameters
   */
  public function sharedData(Request $request): JsonResponse
  {
    try {
      $query = DB::table('shared_data')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'type' => 'where',
        'search' => 'search',
      ]);

      // Handle multiple types
      if ($request->has('types')) {
        $types = array_filter(explode(',', $request->types));
        if (!empty($types)) {
          $query->whereIn('type', $types);
        }
      }

      // JSON search
      if ($request->has('json_search')) {
        $search = '%' . $request->json_search . '%';
        $query->where('data', 'like', $search);
      }

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'type', 'created_at', 'updated_at']);

      return $this->paginateOrGet($query, $request, self::DEFAULT_PER_PAGE * 3);
    } catch (\Exception $e) {
      Log::error('Shared data API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch shared data');
    }
  }

  /**
   * Get custom section data with query parameters
   */
  public function customSectionData(Request $request): JsonResponse
  {
    try {
      $query = DB::table('custom_section_data')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'page_slug' => 'where',
        'section_key' => 'where',
        'is_active' => 'whereInt',
        'search' => 'search',
      ]);

      // Handle multiple section keys
      if ($request->has('section_keys')) {
        $keys = array_filter(explode(',', $request->section_keys));
        if (!empty($keys)) {
          $query->whereIn('section_key', $keys);
        }
      }

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'page_slug', 'section_key', 'is_active', 'created_at']);

      return $this->paginateOrGet($query, $request, self::DEFAULT_PER_PAGE * 3);
    } catch (\Exception $e) {
      Log::error('Custom section data API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch custom section data');
    }
  }

  /**
   * Get programs with query parameters
   */
  public function programs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('programs')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'slug' => 'where',
        'is_featured' => 'whereInt',
        'category' => 'where',
        'search' => 'search',
      ]);

      // Handle multiple slugs
      if ($request->has('slugs')) {
        $slugs = array_filter(explode(',', $request->slugs));
        if (!empty($slugs)) {
          $query->whereIn('slug', $slugs);
        }
      }

      // Handle multiple categories
      if ($request->has('categories')) {
        $categories = array_filter(explode(',', $request->categories));
        if (!empty($categories)) {
          $query->whereIn('category', $categories);
        }
      }

      // Handle range filters
      $this->applyRangeFilters($query, $request, [
        'display_order' => ['min' => 'display_order_min', 'max' => 'display_order_max'],
        'created_at' => ['min' => 'created_from', 'max' => 'created_to']
      ]);

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'title', 'display_order', 'is_featured', 'created_at', 'updated_at']);

      // Apply limit
      if ($request->has('limit')) {
        $query->limit($this->sanitizeLimit($request->limit));
      }

      return $this->paginateOrGet($query, $request);
    } catch (\Exception $e) {
      Log::error('Programs API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch programs');
    }
  }

  /**
   * Get blogs with query parameters
   */
  public function blogs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('blogs')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'slug' => 'where',
        'is_featured' => 'whereInt',
        'author' => 'whereLike',
        'category' => 'where',
        'search' => 'search',
      ]);

      // Handle multiple slugs
      if ($request->has('slugs')) {
        $slugs = array_filter(explode(',', $request->slugs));
        if (!empty($slugs)) {
          $query->whereIn('slug', $slugs);
        }
      }

      // Handle multiple categories
      if ($request->has('categories')) {
        $categories = array_filter(explode(',', $request->categories));
        if (!empty($categories)) {
          $query->whereIn('category', $categories);
        }
      }

      // Handle tag filtering
      if ($request->has('tag')) {
        $tag = $request->tag;
        $query->where(function ($q) use ($tag) {
          $q->where('tags', 'like', '%"' . $tag . '"%')
            ->orWhere('tags', 'like', '%' . $tag . '%');
        });
      }

      // Handle multiple tags
      if ($request->has('tags')) {
        $tags = array_filter(explode(',', $request->tags));
        if (!empty($tags)) {
          $query->where(function ($q) use ($tags) {
            foreach ($tags as $tag) {
              $tag = trim($tag);
              $q->orWhere('tags', 'like', '%"' . $tag . '"%')
                ->orWhere('tags', 'like', '%' . $tag . '%');
            }
          });
        }
      }

      // Handle date range filters
      $this->applyRangeFilters($query, $request, [
        'created_at' => ['min' => 'created_from', 'max' => 'created_to'],
        'published_at' => ['min' => 'published_from', 'max' => 'published_to']
      ]);

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'title', 'author', 'is_featured', 'created_at', 'updated_at', 'published_at']);

      // Apply limit
      if ($request->has('limit')) {
        $query->limit($this->sanitizeLimit($request->limit));
      }

      return $this->paginateOrGet($query, $request);
    } catch (\Exception $e) {
      Log::error('Blogs API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch blogs');
    }
  }

  /**
   * Get about content with query parameters
   */
  public function aboutContent(Request $request): JsonResponse
  {
    try {
      $query = DB::table('about_content')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'slug' => 'where',
        'search' => 'search',
      ]);

      // Handle multiple slugs
      if ($request->has('slugs')) {
        $slugs = array_filter(explode(',', $request->slugs));
        if (!empty($slugs)) {
          $query->whereIn('slug', $slugs);
        }
      }

      // Handle range filters
      $this->applyRangeFilters($query, $request, [
        'display_order' => ['min' => 'display_order_min', 'max' => 'display_order_max']
      ]);

      // Apply sorting
      $this->applySorting($query, $request, ['id', 'title', 'slug', 'display_order', 'created_at', 'updated_at']);

      // Apply limit
      if ($request->has('limit')) {
        $query->limit($this->sanitizeLimit($request->limit));
      }

      return $this->paginateOrGet($query, $request);
    } catch (\Exception $e) {
      Log::error('About content API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch about content');
    }
  }

  /**
   * Get jobs with query parameters
   * Returns 5 most viewed jobs by default
   */
  public function jobs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('job_listings')->where('is_active', 1);

      // Apply filters
      $this->applyFilters($query, $request, [
        'slug' => 'where',
        'type' => 'where', // mapped to job_type
        'department' => 'whereLike',
        'location' => 'whereLike',
        'is_active' => 'whereInt',
        'category_id' => 'whereInt',
        'experience_level' => 'where',
        'is_salary_negotiable' => 'whereInt',
        'search' => 'search',
      ]);

      // Handle multiple types
      if ($request->has('types')) {
        $types = array_filter(explode(',', $request->types));
        if (!empty($types)) {
          $query->whereIn('job_type', $types);
        }
      }

      // Handle range filters
      $this->applyRangeFilters($query, $request, [
        'views_count' => ['min' => 'min_views', 'max' => 'max_views'],
        'created_at' => ['min' => 'created_from', 'max' => 'created_to'],
        'application_deadline' => ['min' => 'deadline_after', 'max' => 'deadline_before'],
        'salary_min' => ['min' => 'salary_min', 'max' => null],
        'salary_max' => ['min' => null, 'max' => 'salary_max'],
      ]);

      // Keyword search
      if ($request->has('keyword_search')) {
        $search = '%' . $request->keyword_search . '%';
        $query->where(function ($q) use ($search) {
          $q->where('keywords', 'like', $search)
            ->orWhereJsonContains('keywords', $request->keyword_search);
        });
      }

      // Skill search
      if ($request->has('skill_search')) {
        $query->whereJsonContains('skills', $request->skill_search);
      }

      // Apply sorting
      $this->applySorting($query, $request, [
        'id',
        'title',
        'job_type',
        'views_count',
        'created_at',
        'updated_at',
        'application_deadline',
        'salary_min',
        'salary_max',
        'is_active',
        'category_id',
        'experience_level'
      ]);

      // Handle special sort cases
      if ($request->has('most_viewed')) {
        $limit = $this->sanitizeLimit($request->most_viewed, 20);
        $query->orderBy('views_count', 'desc')->limit($limit);
      } elseif ($request->has('latest')) {
        $limit = $this->sanitizeLimit($request->latest, 20);
        $query->orderBy('created_at', 'desc')->limit($limit);
      } elseif (!$request->has('sort_by') && !$request->has('page')) {
        // Default: most viewed when no sorting specified and not paginated
        $query->orderBy('views_count', 'desc')->limit(5);
      }

      // Apply limit for non-paginated results
      if (!$request->has('page') && !$request->has('most_viewed') && !$request->has('latest')) {
        $limit = $request->has('limit') ? $this->sanitizeLimit($request->limit) : 5;
        $query->limit($limit);
      }

      // Get data
      $data = $query->get();

      // Format for React if requested
      if ($request->has('format') && $request->format === 'react') {
        $data = $data->map(fn($job) => $this->formatJobForReact($job));
      }

      // Handle pagination
      if ($request->has('page')) {
        $perPage = $this->sanitizePerPage($request->per_page ?? 15);
        $paginated = $query->paginate($perPage);

        if ($request->has('format') && $request->format === 'react') {
          $paginated->getCollection()->transform(fn($job) => $this->formatJobForReact($job));
        }

        return response()->json(['data' => $paginated]);
      }

      return response()->json(['data' => $data]);
    } catch (\Exception $e) {
      Log::error('Jobs API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch jobs');
    }
  }

  /**
   * Format job for React frontend
   */
  private function formatJobForReact($job): array
  {
    return [
      'id' => $job->id,
      'type' => $this->formatJobType($job->job_type ?? 'full-time'),
      'department' => $this->getDepartmentFromTitle($job->title ?? ''),
      'location' => $job->location ?? 'Bangladesh',
      'title' => $job->title,
      'description' => $job->description ?? 'No description available.',
      'link' => "/jobs/{$job->slug}",
      'views' => $job->views_count ?? 0,
      'slug' => $job->slug,
      'is_active' => $job->is_active ?? true,
    ];
  }

  /**
   * Format job type to match React's expected format
   */
  private function formatJobType(?string $type): string
  {
    if (!$type) {
      return 'Full time';
    }

    $mapping = [
      'full-time' => 'Full time',
      'part-time' => 'Part time',
      'contract' => 'Contract',
      'internship' => 'Internship',
      'remote' => 'Remote',
      'hybrid' => 'Hybrid',
    ];

    return $mapping[$type] ?? ucfirst(str_replace('-', ' ', $type));
  }

  /**
   * Extract department from job title
   */
  private function getDepartmentFromTitle(string $title): string
  {
    $keywords = [
      'Manager' => 'Management',
      'Developer' => 'IT & Development',
      'Engineer' => 'IT & Development',
      'Designer' => 'Creative',
      'Marketing' => 'Marketing',
      'Sales' => 'Sales',
      'HR' => 'Human Resources',
      'Finance' => 'Finance',
      'Accountant' => 'Finance',
      'Support' => 'Customer Support',
      'Analyst' => 'Data & Analytics',
      'Specialist' => 'Operations',
      'Coordinator' => 'Operations',
      'Executive' => 'Management',
      'Officer' => 'Operations',
      'Assistant' => 'Operations',
      'Intern' => 'Entry Level',
    ];

    foreach ($keywords as $keyword => $department) {
      if (stripos($title, $keyword) !== false) {
        return $department;
      }
    }

    return 'General';
  }

  /**
   * Apply common filters to query builder
   */
  private function applyFilters(Builder $query, Request $request, array $filters): void
  {
    foreach ($filters as $param => $type) {
      if (!$request->has($param)) {
        continue;
      }

      $value = $request->$param;

      switch ($type) {
        case 'where':
          $query->where($param, $value);
          break;
        case 'whereInt':
          $query->where($param, (int) $value);
          break;
        case 'whereLike':
          $query->where($param, 'like', '%' . $value . '%');
          break;
        case 'search':
          $search = '%' . $value . '%';
          $query->where(function ($q) use ($search) {
            // This is a fallback - specific implementations should override
            $q->where('name', 'like', $search)
              ->orWhere('title', 'like', $search)
              ->orWhere('description', 'like', $search);
          });
          break;
      }
    }
  }

  /**
   * Apply range filters to query builder
   */
  private function applyRangeFilters(Builder $query, Request $request, array $ranges): void
  {
    foreach ($ranges as $column => $params) {
      if (isset($params['min']) && $request->has($params['min'])) {
        $query->where($column, '>=', (int) $request->{$params['min']});
      }
      if (isset($params['max']) && $request->has($params['max'])) {
        $query->where($column, '<=', (int) $request->{$params['max']});
      }
    }
  }

  /**
   * Apply sorting to query builder
   */
  private function applySorting(Builder $query, Request $request, array $allowedSorts): void
  {
    $sortBy = $request->sort_by ?? 'id';
    $sortOrder = $request->sort_order ?? 'asc';

    if (in_array($sortBy, $allowedSorts) && in_array(strtolower($sortOrder), ['asc', 'desc'])) {
      $query->orderBy($sortBy, $sortOrder);
    }
  }

  /**
   * Paginate or get all results
   */
  private function paginateOrGet(Builder $query, Request $request, ?int $defaultPerPage = null): JsonResponse
  {
    if ($request->has('page')) {
      $perPage = $this->sanitizePerPage($request->per_page ?? $defaultPerPage ?? self::DEFAULT_PER_PAGE);
      return response()->json(['data' => $query->paginate($perPage)]);
    }

    return response()->json(['data' => $query->get()]);
  }

  /**
   * Sanitize and validate per page value
   */
  private function sanitizePerPage($value): int
  {
    $perPage = (int) $value;
    return min(max($perPage, 1), self::MAX_PER_PAGE);
  }

  /**
   * Sanitize and validate limit value
   */
  private function sanitizeLimit($value, int $max = 100): int
  {
    $limit = (int) $value;
    return min(max($limit, 1), $max);
  }

  /**
   * Return error response
   */
  private function errorResponse(string $message, int $status = 500): JsonResponse
  {
    return response()->json([
      'data' => [],
      'error' => $message
    ], $status);
  }
}
