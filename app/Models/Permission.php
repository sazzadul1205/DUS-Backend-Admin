<?php
// app/Models/Permission.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'name',
        'slug',
        'module',
        'action',
        'description',
        'is_active',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

    /**
     * Roles that own this permission
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions')
            ->withPivot('granted')
            ->withTimestamps();
    }

    /* ==========================================
     | SCOPES
     |========================================== */

    /**
     * Only active permissions
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Filter by module
     */
    public function scopeByModule(Builder $query, string $module): Builder
    {
        return $query->where('module', $module);
    }

    /**
     * Filter by action
     */
    public function scopeByAction(Builder $query, string $action): Builder
    {
        return $query->where('action', $action);
    }

    /* ==========================================
     | HELPERS
     |========================================== */

    /**
     * Check if permission is granted to a role
     */
    public function isGrantedToRole(int $roleId): bool
    {
        return $this->roles()
            ->where('role_id', $roleId)
            ->wherePivot('granted', true)
            ->exists();
    }

    /**
     * Generate a human-readable description
     */
    public static function generateDescription(string $module, string $action): string
    {
        $descriptions = [
            'view' => 'View and list',
            'create' => 'Create new',
            'store' => 'Save new',
            'edit' => 'Edit existing',
            'update' => 'Update existing',
            'destroy' => 'Delete',
            'show' => 'View details',
            'restore' => 'Restore deleted',
            'force_delete' => 'Permanently delete',
            'toggle_active' => 'Activate/deactivate',
            'bulk_activate' => 'Bulk activate',
            'bulk_deactivate' => 'Bulk deactivate',
            'bulk_delete' => 'Bulk delete',
            'applications' => 'View applications',
            'statistics' => 'View statistics',
            'export' => 'Export data',
            'upload' => 'Upload files',
            'download' => 'Download files',
            'mark_read' => 'Mark as read',
            'mark_all_read' => 'Mark all as read',
            'clone' => 'Clone/copy',
            'verify' => 'Verify user',
            'assign' => 'Assign to users',
            'recalculate' => 'Recalculate score',
        ];

        $actionDesc = $descriptions[$action] ?? ucfirst(str_replace('_', ' ', $action));
        $moduleName = ucfirst(str_replace('_', ' ', $module));

        return "{$actionDesc} {$moduleName}";
    }
}
