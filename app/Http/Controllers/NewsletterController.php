<?php
// app/Http/Controllers/NewsletterController.php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use App\Mail\NewsletterWelcomeEmail;
use App\Mail\NewsletterTestEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsletterController extends Controller
{
  /**
   * Subscribe to newsletter
   */
  public function subscribe(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email|max:255',
      'name' => 'nullable|string|max:255',
      'source' => 'nullable|string|max:50',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      $subscription = NewsletterSubscription::findOrCreateByEmail(
        $request->email,
        $request->name,
        $request->source ?? 'website'
      );

      // Send welcome email
      try {
        Mail::to($subscription->email)
          ->send(new NewsletterWelcomeEmail($subscription));
      } catch (\Exception $mailError) {
        Log::error('Failed to send welcome email: ' . $mailError->getMessage(), [
          'email' => $subscription->email,
        ]);
        // Don't fail the subscription, just log the error
      }

      return response()->json([
        'success' => true,
        'message' => 'Successfully subscribed to the newsletter!',
        'data' => [
          'email' => $subscription->email,
          'status' => $subscription->status,
        ],
      ]);
    } catch (\Exception $e) {
      Log::error('Newsletter subscription failed: ' . $e->getMessage(), [
        'email' => $request->email,
        'trace' => $e->getTraceAsString(),
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Failed to subscribe. Please try again later.',
      ], 500);
    }
  }

  /**
   * Unsubscribe from newsletter (via token)
   */
  public function unsubscribe(Request $request, string $token)
  {
    $subscription = NewsletterSubscription::findByToken($token);

    if (!$subscription) {
      return response()->json([
        'success' => false,
        'message' => 'Invalid unsubscribe token.',
      ], 404);
    }

    if (!$subscription->isSubscribed()) {
      return response()->json([
        'success' => false,
        'message' => 'You are already unsubscribed.',
      ], 400);
    }

    $subscription->unsubscribe();

    return response()->json([
      'success' => true,
      'message' => 'You have been successfully unsubscribed.',
    ]);
  }

  /**
   * Unsubscribe via email (alternative method)
   */
  public function unsubscribeByEmail(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email|exists:newsletter_subscriptions,email',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $subscription = NewsletterSubscription::byEmail($request->email)->first();

    if (!$subscription || !$subscription->isSubscribed()) {
      return response()->json([
        'success' => false,
        'message' => 'You are not subscribed to our newsletter.',
      ], 400);
    }

    $subscription->unsubscribe();

    return response()->json([
      'success' => true,
      'message' => 'You have been successfully unsubscribed.',
    ]);
  }

  /**
   * Resubscribe to newsletter
   */
  public function resubscribe(Request $request, string $token)
  {
    $subscription = NewsletterSubscription::findByToken($token);

    if (!$subscription) {
      return response()->json([
        'success' => false,
        'message' => 'Invalid token.',
      ], 404);
    }

    if ($subscription->isSubscribed()) {
      return response()->json([
        'success' => false,
        'message' => 'You are already subscribed.',
      ], 400);
    }

    $subscription->resubscribe();

    return response()->json([
      'success' => true,
      'message' => 'You have been successfully resubscribed.',
    ]);
  }

  /**
   * Get subscription status
   */
  public function status(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $subscription = NewsletterSubscription::byEmail($request->email)->first();

    return response()->json([
      'success' => true,
      'data' => [
        'email' => $request->email,
        'is_subscribed' => $subscription && $subscription->isSubscribed(),
        'status' => $subscription ? $subscription->status : 'not_found',
      ],
    ]);
  }

    /* ==========================================
     | ADMIN METHODS
     |========================================== */

  /**
   * Admin: List all subscribers
   */
  public function adminIndex(Request $request)
  {
    $query = NewsletterSubscription::query();

    // Filter by status
    if ($request->has('status') && $request->status !== 'all') {
      $query->where('status', $request->status);
    }

    // Search by email or name
    if ($request->has('search') && !empty($request->search)) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('email', 'like', "%{$search}%")
          ->orWhere('name', 'like', "%{$search}%");
      });
    }

    // Sort
    $sortField = $request->get('sort', 'subscribed_at');
    $sortDirection = $request->get('direction', 'desc');
    $query->orderBy($sortField, $sortDirection);

    $subscribers = $query->paginate(15);

    // Stats
    $stats = [
      'total' => NewsletterSubscription::count(),
      'subscribed' => NewsletterSubscription::subscribed()->count(),
      'unsubscribed' => NewsletterSubscription::unsubscribed()->count(),
      'bounced' => NewsletterSubscription::where('status', 'bounced')->count(),
      'today' => NewsletterSubscription::whereDate('subscribed_at', today())->count(),
    ];

    return Inertia::render('Backend/Newsletter/Index', [
      'subscribers' => $subscribers,
      'stats' => $stats,
      'filters' => [
        'status' => $request->get('status', 'all'),
        'search' => $request->get('search', ''),
      ],
    ]);
  }

  /**
   * Admin: Export subscribers
   */
  public function adminExport(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'status' => 'nullable|in:all,subscribed,unsubscribed,bounced',
      'format' => 'nullable|in:csv,excel',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $query = NewsletterSubscription::query();

    if ($request->status && $request->status !== 'all') {
      $query->where('status', $request->status);
    }

    $subscribers = $query->get();

    // Generate CSV
    $headers = [
      'Content-Type' => 'text/csv',
      'Content-Disposition' => 'attachment; filename="newsletter-subscribers-' . date('Y-m-d') . '.csv"',
    ];

    $callback = function () use ($subscribers) {
      $file = fopen('php://output', 'w');

      // Headers
      fputcsv($file, ['ID', 'Email', 'Name', 'Status', 'Subscribed At', 'Unsubscribed At', 'Source']);

      // Data
      foreach ($subscribers as $subscriber) {
        fputcsv($file, [
          $subscriber->id,
          $subscriber->email,
          $subscriber->name ?? '',
          $subscriber->status,
          $subscriber->subscribed_at,
          $subscriber->unsubscribed_at,
          $subscriber->source ?? '',
        ]);
      }

      fclose($file);
    };

    return response()->stream($callback, 200, $headers);
  }

  /**
   * Admin: Bulk delete subscribers
   */
  public function adminBulkDelete(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'ids' => 'required|array',
      'ids.*' => 'integer|exists:newsletter_subscriptions,id',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $count = NewsletterSubscription::whereIn('id', $request->ids)->delete();

    return response()->json([
      'success' => true,
      'message' => "{$count} subscriber(s) deleted successfully.",
      'count' => $count,
    ]);
  }

  /**
   * Admin: Bulk unsubscribe subscribers
   */
  public function adminBulkUnsubscribe(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'ids' => 'required|array',
      'ids.*' => 'integer|exists:newsletter_subscriptions,id',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $count = NewsletterSubscription::whereIn('id', $request->ids)
      ->where('status', NewsletterSubscription::STATUS_SUBSCRIBED)
      ->each(function ($subscriber) {
        $subscriber->unsubscribe();
      })
      ->count();

    return response()->json([
      'success' => true,
      'message' => "{$count} subscriber(s) unsubscribed successfully.",
      'count' => $count,
    ]);
  }

  /**
   * Admin: Delete single subscriber
   */
  public function adminDestroy(int $id)
  {
    $subscriber = NewsletterSubscription::findOrFail($id);
    $subscriber->delete();

    return response()->json([
      'success' => true,
      'message' => 'Subscriber deleted successfully.',
    ]);
  }

  /**
   * Admin: Unsubscribe single subscriber
   */
  public function adminUnsubscribe(int $id)
  {
    $subscriber = NewsletterSubscription::findOrFail($id);

    if (!$subscriber->isSubscribed()) {
      return response()->json([
        'success' => false,
        'message' => 'Subscriber is already unsubscribed.',
      ], 400);
    }

    $subscriber->unsubscribe();

    return response()->json([
      'success' => true,
      'message' => 'Subscriber unsubscribed successfully.',
    ]);
  }

  /**
   * Admin: Resubscribe single subscriber
   */
  public function adminResubscribe(int $id)
  {
    $subscriber = NewsletterSubscription::findOrFail($id);

    if ($subscriber->isSubscribed()) {
      return response()->json([
        'success' => false,
        'message' => 'Subscriber is already subscribed.',
      ], 400);
    }

    $subscriber->resubscribe();

    return response()->json([
      'success' => true,
      'message' => 'Subscriber resubscribed successfully.',
    ]);
  }

  /**
   * Admin: Send test email
   */
  public function adminSendTest(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'subject' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    try {
      Mail::to($request->email)->send(new NewsletterTestEmail(
        $request->subject ?? 'Newsletter Test Email'
      ));

      return response()->json([
        'success' => true,
        'message' => "Test email sent to {$request->email} successfully.",
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to send test email: ' . $e->getMessage());

      return response()->json([
        'success' => false,
        'message' => 'Failed to send test email: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Admin: Send bulk email to selected subscribers
   */
  public function sendBulkEmail(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'ids' => 'required|array',
      'ids.*' => 'integer|exists:newsletter_subscriptions,id',
      'subject' => 'required|string|max:255',
      'content' => 'required|string',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $subscribers = NewsletterSubscription::whereIn('id', $request->ids)
      ->where('status', NewsletterSubscription::STATUS_SUBSCRIBED)
      ->get();

    if ($subscribers->isEmpty()) {
      return response()->json([
        'success' => false,
        'message' => 'No active subscribers selected.',
      ], 400);
    }

    $sentCount = 0;
    $failedCount = 0;

    foreach ($subscribers as $subscriber) {
      try {
        Mail::to($subscriber->email)->send(new \App\Mail\NewsletterBulkEmail(
          $subscriber,
          $request->subject,
          $request->content
        ));
        $sentCount++;
      } catch (\Exception $e) {
        Log::error('Failed to send bulk email: ' . $e->getMessage(), [
          'email' => $subscriber->email,
          'subject' => $request->subject,
        ]);
        $failedCount++;
      }
    }

    return response()->json([
      'success' => true,
      'message' => "Emails sent: {$sentCount}, Failed: {$failedCount}",
      'sent' => $sentCount,
      'failed' => $failedCount,
    ]);
  }
}
