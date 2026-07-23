{{-- resources/views/emails/newsletter-welcome.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Newsletter</title>
    <style>
        /* Inline styles for email clients */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #009BE2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 30px 20px;
            background: #f9f9f9;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background: #009BE2;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome, {{ $name }}! 🎉</h1>
    </div>

    <div class="content">
        <p>Thank you for subscribing to our newsletter!</p>

        <p>You'll now receive:</p>
        <ul>
            <li>📰 Latest updates and news</li>
            <li>🚀 Exclusive offers and announcements</li>
            <li>💡 Valuable insights and tips</li>
            <li>📅 Upcoming events and webinars</li>
        </ul>

        <p>We're excited to have you on board!</p>

        <p style="margin-top: 20px;">
            <a href="https://{{ config('app.domain') }}" class="button">Visit Our Website</a>
        </p>

        <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you no longer wish to receive these emails, you can
            <a href="{{ $unsubscribeUrl }}" style="color: #009BE2;">unsubscribe here</a>.
        </p>
    </div>

    <div class="footer">
        <p>&copy; {{ $year }} {{ config('app.name') }}. All rights reserved.</p>
        <p style="font-size: 11px;">
            You received this email because you subscribed to our newsletter.
        </p>
    </div>
</body>
</html>