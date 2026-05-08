<?php
// app/Models/EducationHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class EducationHistory extends Model
{
    use HasFactory, SoftDeletes;

    public const MAX_ENTRIES_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'institution_name',
        'degree',
        'passing_year',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'passing_year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

    /**
     * Applicant profile relation
     */
    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(
            ApplicantProfile::class
        );
    }

    /* ==========================================
     | MODEL EVENTS
     |========================================== */

    protected static function booted(): void
    {
        static::creating(
            function (
                EducationHistory $model
            ): void {

                if (
                    self::hasReachedMaxEntries(
                        $model->applicant_profile_id
                    )
                ) {
                    throw ValidationException::withMessages([
                        'education_history' => sprintf(
                            'Maximum %d education history entries allowed per profile.',
                            self::MAX_ENTRIES_PER_PROFILE
                        ),
                    ]);
                }
            }
        );
    }

    /* ==========================================
     | HELPERS
     |========================================== */

    /**
     * Check if max entries reached
     */
    public static function hasReachedMaxEntries(
        int $applicantProfileId
    ): bool {

        return self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count() >= self::MAX_ENTRIES_PER_PROFILE;
    }

    /**
     * Get remaining slots
     */
    public static function getRemainingSlots(
        int $applicantProfileId
    ): int {

        $currentCount = self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count();

        return max(
            0,
            self::MAX_ENTRIES_PER_PROFILE - $currentCount
        );
    }

    /**
     * Get current count
     */
    public static function getCurrentCount(
        int $applicantProfileId
    ): int {

        return self::where(
            'applicant_profile_id',
            $applicantProfileId
        )->count();
    }

    /* ==========================================
     | SCOPES
     |========================================== */

    /**
     * Scope latest education first
     */
    public function scopeLatestFirst(
        Builder $query
    ): Builder {

        return $query->orderByDesc(
            'passing_year'
        );
    }
}
