<?php
// app/Mail/NewsletterWelcomeEmail.php

namespace App\Mail;

use App\Models\NewsletterSubscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeEmail extends Mailable
{
  use Queueable, SerializesModels;

  public NewsletterSubscription $subscription;

  /**
   * Create a new message instance.
   */
  public function __construct(NewsletterSubscription $subscription)
  {
    $this->subscription = $subscription;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'Welcome to Our Newsletter!',
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.newsletter-welcome',
      with: [
        'name' => $this->subscription->name ?? 'Subscriber',
        'email' => $this->subscription->email,
        'unsubscribeUrl' => $this->subscription->unsubscribe_url,
        'year' => now()->year,
      ],
    );
  }
}
