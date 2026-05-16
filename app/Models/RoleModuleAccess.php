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
     * This project uses a singular table name for module access.
     */
    protected $table = 'role_module_access';

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

    /**
     * Get human-readable access level label
     */
    public static function getAccessLevelLabel(string $level): string
    {
        $labels = [
            self::ACCESS_NO_ACCESS => 'No Access',
            self::ACCESS_READ => 'Read Only',
            self::ACCESS_WRITE => 'Read & Write',
            self::ACCESS_MANAGE => 'Full Management',
        ];

        return $labels[$level] ?? $level;
    }
}
