{{-- resources/views/emails/newsletter-bulk.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
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

        .unsubscribe {
            color: #009BE2;
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>📧 {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <p>Hello {{ $name }},</p>

        <div style="margin: 20px 0;">
            {!! nl2br(e($content)) !!}
        </div>

        <p style="margin-top: 20px; font-size: 14px; color: #666;">
            You received this email because you subscribed to our newsletter.
        </p>

        <p style="font-size: 12px; color: #999; margin-top: 20px;">
            <a href="{{ $unsubscribeUrl }}" class="unsubscribe">Unsubscribe</a> from future emails.
        </p>
    </div>

    <div class="footer">
        <p>&copy; {{ $year }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>

</html>
