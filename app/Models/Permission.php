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
}
