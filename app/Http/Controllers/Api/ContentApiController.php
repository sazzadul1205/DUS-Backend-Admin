<?php
// app/Http/Controllers/Api/ContentApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ContentApiController extends Controller
{
  public function pages(): JsonResponse
  {
    $data = DB::table('pages')
      ->where('is_active', 1)
      ->select('id', 'slug', 'name', 'title', 'description', 'is_active')
      ->get();

    return response()->json(['data' => $data]);
  }

  public function sectionConfigs(): JsonResponse
  {
    $data = DB::table('section_configs')
      ->where('is_enabled', 1)
      ->orderBy('display_order')
      ->get();

    return response()->json(['data' => $data]);
  }

  public function sharedData(): JsonResponse
  {
    $data = DB::table('shared_data')
      ->where('is_active', 1)
      ->get();

    return response()->json(['data' => $data]);
  }

  public function customSectionData(): JsonResponse
  {
    $data = DB::table('custom_section_data')
      ->where('is_active', 1)
      ->get();

    return response()->json(['data' => $data]);
  }

  public function programs(): JsonResponse
  {
    $data = DB::table('programs')
      ->where('is_active', 1)
      ->orderBy('display_order')
      ->get();

    return response()->json(['data' => $data]);
  }

  public function blogs(): JsonResponse
  {
    $data = DB::table('blogs')
      ->where('is_active', 1)
      ->orderBy('created_at', 'desc')
      ->get();

    return response()->json(['data' => $data]);
  }

  public function aboutContent(): JsonResponse
  {
    $data = DB::table('about_content')
      ->where('is_active', 1)
      ->orderBy('display_order')
      ->get();

    return response()->json(['data' => $data]);
  }

  public function jobs(): JsonResponse
  {
    try {
      // Get top 5 most viewed jobs (ordered by views_count DESC)
      $data = DB::table('job_listings')
        ->where('is_active', 1)
        ->orderBy('views_count', 'desc')
        ->limit(5)  // ← Only get top 5
        ->select(
          'id',
          'title',
          'slug',
          'job_type as type',
          'description',
          'views_count',
          'created_at'
        )
        ->get()
        ->map(function ($job) {
          return [
            'id' => $job->id,
            'type' => $this->formatJobType($job->type),
            'department' => $this->getDepartmentFromTitle($job->title),
            'location' => 'Bangladesh',
            'title' => $job->title,
            'description' => $job->description ?? 'No description available.',
            'link' => "/jobs/{$job->slug}",
            'views' => $job->views_count ?? 0,  // Optional: include view count
          ];
        });

      return response()->json(['data' => $data]);
    } catch (\Exception $e) {
      return response()->json(['data' => []]);
    }
  }

  /**
   * Format job type to match React's expected format
   */
  private function formatJobType(?string $type): string
  {
    if (!$type) return 'Full time';

    $mapping = [
      'full-time' => 'Full time',
      'part-time' => 'Part time',
      'contract' => 'Contract',
      'internship' => 'Internship',
      'remote' => 'Remote',
      'hybrid' => 'Hybrid',
    ];

    return $mapping[$type] ?? ucfirst($type);
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
}
