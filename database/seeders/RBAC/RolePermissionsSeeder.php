<?php
// database/seeders/RBAC/RolePermissionsSeeder.php

namespace Database\Seeders\RBAC;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionsSeeder extends Seeder
{
  public function run(): void
  {
    // Get role IDs
    $superAdminRoleId = DB::table('roles')->where('slug', 'super-admin')->value('id');
    $adminRoleId = DB::table('roles')->where('slug', 'admin')->value('id');
    $employerRoleId = DB::table('roles')->where('slug', 'employer')->value('id');

    // Get all permission IDs
    $allPermissionIds = DB::table('permissions')->pluck('id');

    // Clear existing role_permissions
    DB::table('role_permissions')->whereIn('role_id', [
      $superAdminRoleId,
      $adminRoleId,
      $employerRoleId,
    ])->delete();

    // SUPER ADMIN gets ALL permissions
    foreach ($allPermissionIds as $permissionId) {
      DB::table('role_permissions')->updateOrInsert(
        ['role_id' => $superAdminRoleId, 'permission_id' => $permissionId],
        ['granted' => true, 'created_at' => now(), 'updated_at' => now()]
      );
    }

    // ADMIN gets ALL permissions
    foreach ($allPermissionIds as $permissionId) {
      DB::table('role_permissions')->updateOrInsert(
        ['role_id' => $adminRoleId, 'permission_id' => $permissionId],
        ['granted' => true, 'created_at' => now(), 'updated_at' => now()]
      );
    }

    // EMPLOYER gets Employment related permissions (NO CMS permissions)
    $employerPermissionSlugs = [
      'dashboard.view',
      'dashboard.stats.view',
      'dashboard.employer',
      'job_listings.view',
      'job_listings.create',
      'job_listings.store',
      'job_listings.edit',
      'job_listings.update',
      'job_listings.show',
      'job_listings.destroy',
      'job_listings.toggle_active',
      'job_listings.applications',
      'job.view.any',
      'job.view.own',
      'job.edit.own',
      'jobs.manage',
      'applications.view',
      'applications.view.for_own_jobs',
      'applications.show',
      'applications.status.update',
      'applications.bulk_status.update',
      'applications.download_resume',
      'applications.bulk_download_resumes',
      'applications.email.send',
      'applications.bulk_email.send',
      'application.view.own',
      'application.view.any',
      'application.shortlist',
      'application.reject',
      'categories.view',
      'category.view',
      'categories.get_active',
      'locations.view',
      'location.view',
      'locations.get_active',
      'employer_profile.view',
      'employer_profile.edit',
      'employer_profile.update',
      'employer_profile.update_password',
      'notifications.view',
      'notifications.mark_read',
      'notifications.mark_all_read',
      'statistics.view',
      'statistics.ats',
      'statistics.jobs',
      'statistics.dashboard',
      'applicant-profiles.view',
      'applicant-profiles.view.any',
      'applicant-profiles.show',
    ];

    foreach ($employerPermissionSlugs as $slug) {
      $permId = DB::table('permissions')->where('slug', $slug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->updateOrInsert(
          ['role_id' => $employerRoleId, 'permission_id' => $permId],
          ['granted' => true, 'created_at' => now(), 'updated_at' => now()]
        );
      }
    }

    // JOB SEEKER - NO permissions (not added)
  }
}
