<?php
// app/Models/Achievement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    public const MAX_ACHIEVEMENTS_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'achievement_name',
        'achievement_details',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

    public function applicantProfile()
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ==========================================
     | VALIDATION METHODS
     |========================================== */

    /**
     * Check if profile reached maximum achievements
     */
    public static function hasReachedMaxEntries(int $applicantProfileId): bool
    {
        return self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count() >= self::MAX_ACHIEVEMENTS_PER_PROFILE;
    }

    /**
     * Get remaining available slots
     */
    public static function getRemainingSlots(int $applicantProfileId): int
    {
        $currentCount = self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count();

        return max(
            0,
            self::MAX_ACHIEVEMENTS_PER_PROFILE - $currentCount
        );
    }

    /**
     * Get current achievement count
     */
    public static function getCurrentCount(int $applicantProfileId): int
    {
        return self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count();
    }

    /**
     * Get formatted achievements
     */
    public static function getFormattedAchievements(int $applicantProfileId): Collection
    {
        return self::where(
            'applicant_profile_id',
            $applicantProfileId
        )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Achievement $achievement): array {
                return [
                    'id' => $achievement->id,
                    'name' => $achievement->achievement_name,
                    'details' => $achievement->achievement_details,
                    'created_at' => $achievement->created_at?->format('Y-m-d'),
                ];
            });
    }

    /**
     * Get profile achievement statistics
     */
    public static function getStats(int $applicantProfileId): array
    {
        return [
            'current_count' => self::getCurrentCount($applicantProfileId),

            'max_allowed' => self::MAX_ACHIEVEMENTS_PER_PROFILE,

            'remaining_slots' => self::getRemainingSlots(
                $applicantProfileId
            ),

            'has_achievements' => self::where(
                'applicant_profile_id',
                $applicantProfileId
            )->exists(),
        ];
    }

    /* ==========================================
     | MODEL EVENTS
     |========================================== */

    /**
     * Booted model events
     */
    protected static function booted(): void
    {
        /**
         * Validate before create
         */
        static::creating(function (Achievement $model): void {

            if (
                self::hasReachedMaxEntries(
                    $model->applicant_profile_id
                )
            ) {
                throw ValidationException::withMessages([
                    'achievement' => sprintf(
                        'Maximum %d achievements allowed per profile.',
                        self::MAX_ACHIEVEMENTS_PER_PROFILE
                    ),
                ]);
            }
        });

        /**
         * Created log
         */
        static::created(function (Achievement $achievement): void {

            Log::info('Achievement created', [
                'profile_id' => $achievement->applicant_profile_id,
                'achievement_id' => $achievement->id,
                'total_count' => self::getCurrentCount(
                    $achievement->applicant_profile_id
                ),
            ]);
        });

        /**
         * Deleted log
         */
        static::deleted(function (Achievement $achievement): void {

            Log::info('Achievement deleted', [
                'profile_id' => $achievement->applicant_profile_id,
                'achievement_id' => $achievement->id,
                'remaining_count' => self::getCurrentCount(
                    $achievement->applicant_profile_id
                ),
            ]);
        });
    }

    /* ==========================================
     | SCOPES
     |========================================== */

    /**
     * Scope recent achievements
     */
    public function scopeRecent(Builder $query, int $limit = 5): Builder
    {
        return $query
            ->orderBy('created_at', 'desc')
            ->limit($limit);
    }

    /**
     * Scope search achievements
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->where(
            'achievement_name',
            'like',
            "%{$searchTerm}%"
        )->orWhere(
            'achievement_details',
            'like',
            "%{$searchTerm}%"
        );
    }
}
