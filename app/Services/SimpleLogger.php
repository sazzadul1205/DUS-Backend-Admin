<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class SimpleLogger
{
    private static $maxLines = 10000; 
    private static $logDir = 'logs';
    
    /**
     * Log an event
     */
    public static function log(string $type, string $message, array $context = [])
    {
        $logFile = storage_path(self::$logDir . '/' . $type . '.log');
        
        // Create directory if needed
        if (!is_dir(storage_path(self::$logDir))) {
            mkdir(storage_path(self::$logDir), 0755, true);
        }
        
        // Format log entry
        $timestamp = now()->format('Y-m-d H:i:s');
        $user = Auth::id() ?? 'system';
        $ip = request()->ip() ?? '0.0.0.0';
        $email = Auth::user()?->email ?? 'system';
        
        $logEntry = sprintf(
            "[%s] [User: %s] [%s] [IP: %s] %s %s\n",
            $timestamp,
            $user,
            $email,
            $ip,
            $message,
            !empty($context) ? json_encode($context) : ''
        );
        
        // Write to file
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        // Auto-rotate if too large
        self::rotateIfNeeded($logFile);
    }
    
    /**
     * Auto-delete oldest lines if file exceeds max lines
     */
    private static function rotateIfNeeded($logFile)
    {
        if (!file_exists($logFile)) {
            return;
        }
        
        // Count lines
        $lineCount = 0;
        $handle = fopen($logFile, 'r');
        while (fgets($handle) !== false) {
            $lineCount++;
        }
        fclose($handle);
        
        // If exceeded max lines, keep only last half
        if ($lineCount > self::$maxLines) {
            $keepLines = floor(self::$maxLines / 2);
            $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $newLines = array_slice($lines, -$keepLines);
            
            // Overwrite with latest lines only
            file_put_contents($logFile, implode("\n", $newLines) . "\n", LOCK_EX);
        }
    }
    
    // Convenience methods for your CMS+Job Portal
    
    public static function security(string $message, array $context = [])
    {
        self::log('security', '🔒 ' . $message, $context);
    }
    
    public static function jobs(string $message, array $context = [])
    {
        self::log('jobs', '💼 ' . $message, $context);
    }
    
    public static function applications(string $message, array $context = [])
    {
        self::log('applications', '📄 ' . $message, $context);
    }
    
    public static function users(string $message, array $context = [])
    {
        self::log('users', '👤 ' . $message, $context);
    }
    
    public static function cms(string $message, array $context = [])
    {
        self::log('cms', '📝 ' . $message, $context);
    }
    
    public static function system(string $message, array $context = [])
    {
        self::log('system', '⚙️ ' . $message, $context);
    }
    
    public static function ats(string $message, array $context = [])
    {
        self::log('ats', '🤖 ' . $message, $context);
    }
}