<?php
// database/seeders/RBAC/RBACSeeder.php

namespace Database\Seeders\RBAC;

use Illuminate\Database\Seeder;

class RBACSeeder extends Seeder
{
  public function run(): void
  {
    $this->call([
      PermissionsSeeder::class,
      RolesSeeder::class,
      RolePermissionsSeeder::class,
      ModuleAccessSeeder::class,
      UserRolesSeeder::class,
    ]);
  }
}
