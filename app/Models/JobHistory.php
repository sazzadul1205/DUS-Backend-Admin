<?php
// app/Models/JobHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class JobHistory extends Model
{
    use HasFactory, SoftDeletes;

    public const MAX_ENTRIES_PER_PROFILE = 3;

    /**
     * Fillable fields
     */
    protected $fillable = [
        'applicant_profile_id',
        'company_name',
        'position',
        'starting_year',
        'ending_year',
        'is_current',
    ];

    /**
     * Cast fields
     */
    protected $casts = [
        'starting_year' => 'integer',
        'ending_year' => 'integer',
        'is_current' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /* ==========================================
     | RELATIONSHIPS
     |========================================== */

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    /* ==========================================
     | MODEL EVENTS
     |========================================== */

    protected static function booted(): void
    {
        static::creating(function (JobHistory $model): void {

            if (
                self::hasReachedMaxEntries(
                    $model->applicant_profile_id
                )
            ) {
                throw ValidationException::withMessages([
                    'job_history' => sprintf(
                        'Maximum %d job history entries allowed per profile.',
                        self::MAX_ENTRIES_PER_PROFILE
                    ),
                ]);
            }
        });
    }

    /* ==========================================
     | ACCESSORS
     |========================================== */

    /**
     * Get formatted duration
     */
    public function getDurationAttribute(): string
    {
        $start = $this->starting_year;

        if ($this->is_current) {
            return $start . ' - Present';
        }

        $end = $this->ending_year ?? 'Present';

        return $start . ' - ' . $end;
    }

    /* ==========================================
     | HELPERS
     |========================================== */

    /**
     * Check max entries reached
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
}
