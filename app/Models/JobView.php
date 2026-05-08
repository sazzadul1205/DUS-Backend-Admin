<?php
// app/Models/JobView.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobView extends Model
{
    use HasFactory;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'job_listing_id',
        'user_id',
        'ip_address',
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
     * Job this view belongs to
     */
    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * User who viewed the job (nullable for guests)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /* ==========================================
     | HELPERS
     |========================================== */

    /**
     * Record a job view safely
     */
    public static function recordView(
        int $jobId,
        ?int $userId = null,
        ?string $ipAddress = null
    ): self {
        return static::create([
            'job_listing_id' => $jobId,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
        ]);
    }
}
