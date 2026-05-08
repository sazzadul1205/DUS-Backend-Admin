<?php
// app/Models/UserRole.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserRole extends Pivot
{
    use HasFactory;

    /**
     * Table name
     */
    protected $table = 'user_roles';

    /**
     * Fillable fields
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'assigned_by',
        'assigned_at',
        'is_active',
        'expires_at',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'assigned_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ========== RELATIONSHIPS ========== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /* ========== SCOPES ========== */

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q): Builder {
                return $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->where(function (Builder $q): Builder {
            return $q->where('is_active', false)
                ->orWhere('expires_at', '<=', now());
        });
    }

    /* ========== HELPER METHODS ========== */

    /**
     * Check if this assignment is expired
     */
    public function isExpired(): bool
    {
        return !$this->is_active ||
            ($this->expires_at && $this->expires_at <= now());
    }

    /**
     * Expire this role assignment
     */
    public function expire(): bool
    {
        return (bool) $this->update([
            'is_active' => false,
            'expires_at' => now(),
        ]);
    }
}
