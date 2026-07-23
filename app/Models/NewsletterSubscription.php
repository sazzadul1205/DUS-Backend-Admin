<?php
// app/Models/NewsletterSubscription.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class NewsletterSubscription extends Model
{
  use HasFactory;

  /**
   * Fillable fields
   */
  protected $fillable = [
    'email',
    'name',
    'token',
    'status',
    'subscribed_at',
    'unsubscribed_at',
    'ip_address',
    'user_agent',
    'source',
  ];

  /**
   * Cast fields
   */
  protected $casts = [
    'subscribed_at' => 'datetime',
    'unsubscribed_at' => 'datetime',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
  ];

  /**
   * Status constants
   */
  public const STATUS_SUBSCRIBED = 'subscribed';
  public const STATUS_UNSUBSCRIBED = 'unsubscribed';
  public const STATUS_BOUNCED = 'bounced';

  /**
   * Boot the model
   */
  protected static function booted(): void
  {
    static::creating(function (NewsletterSubscription $subscription): void {
      // Generate unique token for unsubscribe
      if (empty($subscription->token)) {
        $subscription->token = Str::random(64);
      }

      // Set subscribed_at if not set
      if (empty($subscription->subscribed_at)) {
        $subscription->subscribed_at = now();
      }

      // Default status
      if (empty($subscription->status)) {
        $subscription->status = self::STATUS_SUBSCRIBED;
      }
    });
  }

    /* ==========================================
     | SCOPES
     |========================================== */

  /**
   * Scope active (subscribed) subscriptions
   */
  public function scopeSubscribed(Builder $query): Builder
  {
    return $query->where('status', self::STATUS_SUBSCRIBED);
  }

  /**
   * Scope unsubscribed
   */
  public function scopeUnsubscribed(Builder $query): Builder
  {
    return $query->where('status', self::STATUS_UNSUBSCRIBED);
  }

  /**
   * Scope by email
   */
  public function scopeByEmail(Builder $query, string $email): Builder
  {
    return $query->where('email', $email);
  }

  /**
   * Scope recent subscriptions
   */
  public function scopeRecent(Builder $query, int $limit = 10): Builder
  {
    return $query->orderBy('subscribed_at', 'desc')->limit($limit);
  }

    /* ==========================================
     | HELPERS
     |========================================== */

  /**
   * Check if subscription is active
   */
  public function isSubscribed(): bool
  {
    return $this->status === self::STATUS_SUBSCRIBED;
  }

  /**
   * Unsubscribe this email
   */
  public function unsubscribe(): bool
  {
    return (bool) $this->update([
      'status' => self::STATUS_UNSUBSCRIBED,
      'unsubscribed_at' => now(),
    ]);
  }

  /**
   * Resubscribe this email
   */
  public function resubscribe(): bool
  {
    return (bool) $this->update([
      'status' => self::STATUS_SUBSCRIBED,
      'unsubscribed_at' => null,
      'subscribed_at' => now(),
    ]);
  }

  /**
   * Mark as bounced
   */
  public function markAsBounced(): bool
  {
    return (bool) $this->update([
      'status' => self::STATUS_BOUNCED,
    ]);
  }

  /**
   * Generate unsubscribe URL
   */
  public function getUnsubscribeUrlAttribute(): string
  {
    return route('newsletter.unsubscribe', ['token' => $this->token]);
  }

  /**
   * Generate resubscribe URL
   */
  public function getResubscribeUrlAttribute(): string
  {
    return route('newsletter.resubscribe', ['token' => $this->token]);
  }

  /**
   * Find by token
   */
  public static function findByToken(string $token): ?self
  {
    return self::where('token', $token)->first();
  }

  /**
   * Find or create by email
   */
  public static function findOrCreateByEmail(
    string $email,
    ?string $name = null,
    ?string $source = 'website'
  ): self {
    $subscription = self::byEmail($email)->first();

    if ($subscription) {
      // If unsubscribed, resubscribe
      if ($subscription->status === self::STATUS_UNSUBSCRIBED) {
        $subscription->resubscribe();
      }
      return $subscription;
    }

    return self::create([
      'email' => $email,
      'name' => $name,
      'source' => $source,
    ]);
  }
}
