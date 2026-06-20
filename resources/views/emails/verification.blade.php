{{-- resources/views/emails/verification.blade.php --}}

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
        }

        .wrapper {
            width: 100%;
            padding: 40px 20px;
        }

        .card {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        .logo {
            margin-bottom: 24px;
        }

        .logo img {
            width: 60px;
            height: 60px;
            border-radius: 12px;
        }

        h1 {
            font-size: 24px;
            margin: 0 0 8px;
            color: #111827;
        }

        .subtitle {
            color: #6b7280;
            font-size: 15px;
            margin: 0 0 24px;
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            padding: 14px 32px;
            border-radius: 8px;
            background: #111827;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            margin: 8px 0 24px;
        }

        .button:hover {
            background: #374151;
        }

        .link {
            color: #111827;
            word-break: break-all;
            font-size: 13px;
        }

        .divider {
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
        }

        .footer {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 24px;
            line-height: 1.6;
        }

        .footer strong {
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <!-- Logo with absolute URL using asset() helper -->
            <div class="logo">
                <img src="{{ asset('images/Icon.svg') }}" alt="{{ config('app.name') }}">
            </div>

            <h1>Verify Your Email</h1>

            <p class="subtitle">
                Hello {{ $userName ?? 'there' }},<br>
                Please verify your email address to complete your registration.
            </p>

            <a href="{{ $verificationUrl ?? '#' }}" class="button">
                Verify Email
            </a>

            <p style="font-size: 13px; color: #6b7280; margin: 0 0 16px;">
                Or copy this link into your browser:
            </p>

            <p style="font-size: 12px; word-break: break-all; margin: 0 0 24px;">
                <a href="{{ $verificationUrl ?? '#' }}" class="link">
                    {{ $verificationUrl ?? '#' }}
                </a>
            </p>

            <div class="divider"></div>

            <p style="font-size: 13px; color: #6b7280; margin: 0;">
                If you didn't create this account, you can safely ignore this email.
            </p>

            <div class="footer">
                <strong>{{ config('app.name') }}</strong><br>
                &copy; {{ date('Y') }} All rights reserved.
            </div>
        </div>
    </div>
</body>

</html>
