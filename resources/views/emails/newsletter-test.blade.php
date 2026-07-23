{{-- resources/views/emails/newsletter-test.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Test</title>
    <style>
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

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }

        .highlight {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #009BE2;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>📧 Newsletter Test</h1>
    </div>

    <div class="content">
        <div class="highlight">
            <p><strong>✅ This is a test email from your newsletter system.</strong></p>
            <p style="margin-top: 10px;">If you're receiving this, your newsletter email configuration is working
                correctly!</p>
        </div>

        <h3>📋 Email Details</h3>
        <ul>
            <li><strong>Sent at:</strong> {{ now()->format('F j, Y g:i A') }}</li>
            <li><strong>From:</strong> {{ config('mail.from.address') }}</li>
            <li><strong>Environment:</strong> {{ app()->environment() }}</li>
        </ul>

        <p style="margin-top: 20px;">
            You can now start sending your newsletter campaigns to your subscribers.
        </p>
    </div>

    <div class="footer">
        <p>&copy; {{ now()->year }} {{ config('app.name') }}. All rights reserved.</p>
        <p style="font-size: 11px;">
            This is a test email. No action is required.
        </p>
    </div>
</body>

</html>
