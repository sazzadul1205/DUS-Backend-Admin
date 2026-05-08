<?php
// app/Models/RoleModuleAccess.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoleModuleAccess extends Model
{
    use HasFactory;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'role_id',
        'module',
        'access_level',
    ];

    /**
     * Available access levels in hierarchy order
     */
    public const ACCESS_NO_ACCESS = 'no_access';
    public const ACCESS_READ = 'read';
    public const ACCESS_WRITE = 'write';
    public const ACCESS_MANAGE = 'manage';

    /**
     * Ordered access levels (used for comparison)
     */
    public static array $accessLevels = [
        self::ACCESS_NO_ACCESS,
        self::ACCESS_READ,
        self::ACCESS_WRITE,
        self::ACCESS_MANAGE,
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

    /**
     * Role this access belongs to
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /* ==========================================
     | HELPERS
     |========================================== */

    /**
     * Check if current access level is >= required level
     */
    public function isAtLeast(string $level): bool
    {
        $levels = array_flip(self::$accessLevels);

        $currentLevel = $levels[$this->access_level] ?? 0;
        $requiredLevel = $levels[$level] ?? 0;

        return $currentLevel >= $requiredLevel;
    }
}
