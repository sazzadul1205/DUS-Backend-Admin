<?php
// app/Http/Controllers/Backend/LogController.php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\SimpleLogger;

class LogController extends Controller
{
  private $logTypes = [
    'security' => '🔒 Security Logs',
    'jobs' => '💼 Jobs Log',
    'applications' => '📄 Applications Log',
    'users' => '👤 Users Log',
    'cms' => '📝 CMS Log',
    'system' => '⚙️ System Log',
    'ats' => '🤖 ATS Log',
  ];

  /**
   * Display the log viewer
   */
  public function index(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    // Check permission
    if (!$user->hasPermission('logs.view')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to view logs.');
    }

    $type = $request->get('type', 'security');
    $limit = min((int) $request->get('limit', 200), 5000);

    return Inertia::render('Backend/Logs/Index', [
      'logTypes' => $this->logTypes,
      'currentType' => $type,
      'logs' => $this->readLogFile($type, $limit),
      'fileInfo' => $this->getFileInfo($type),
      'canExport' => $user->hasPermission('logs.export'),
      'canClear' => $user->hasPermission('logs.clear'),
    ]);
  }

  /**
   * Read log file and parse entries
   */
  private function readLogFile(string $type, int $limit = 200): array
  {
    $filePath = storage_path("logs/{$type}.log");

    if (!file_exists($filePath)) {
      return [];
    }

    // Read last N lines efficiently
    $file = new \SplFileObject($filePath);
    $file->seek(PHP_INT_MAX);
    $totalLines = $file->key();
    $start = max(0, $totalLines - $limit);
    $file->seek($start);

    $logs = [];
    while (!$file->eof()) {
      $line = trim($file->fgets());
      if (!empty($line)) {
        $parsed = $this->parseLogLine($line);
        if ($parsed) {
          $logs[] = $parsed;
        }
      }
    }

    return array_reverse($logs); // Newest first
  }

  /**
   * Parse a single log line
   */
  private function parseLogLine(string $line): ?array
  {
    // Parse: [2024-01-15 10:30:00] [User: 5] [admin@test.com] [IP: 127.0.0.1] Message {"context":"data"}
    preg_match(
      '/\[(.*?)\] \[User: (.*?)\] \[(.*?)\] \[IP: (.*?)\] (.*?)(?:\s+(.*))?$/',
      $line,
      $matches
    );

    if (empty($matches)) {
      return null;
    }

    return [
      'timestamp' => $matches[1] ?? '',
      'user_id' => $matches[2] ?? 'system',
      'email' => $matches[3] ?? 'system',
      'ip' => $matches[4] ?? '0.0.0.0',
      'message' => $matches[5] ?? '',
      'context' => !empty($matches[6]) ? json_decode($matches[6], true) : null,
      'is_highlighted' => $this->isHighlighted($matches[5] ?? ''),
    ];
  }

  /**
   * Check if log entry should be highlighted
   */
  private function isHighlighted(string $message): bool
  {
    $highlightPatterns = [
      '❌',
      '🔴',
      'Failed',
      'failed',
      'error',
      'Error',
      'deleted',
      'Deleted',
      'permanently',
      'Permanently'
    ];

    foreach ($highlightPatterns as $pattern) {
      if (str_contains($message, $pattern)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get file information
   */
  private function getFileInfo(string $type): array
  {
    $filePath = storage_path("logs/{$type}.log");

    if (!file_exists($filePath)) {
      return [
        'exists' => false,
        'size' => '0 B',
        'lines' => 0,
        'last_modified' => 'Never'
      ];
    }

    $lineCount = 0;
    $handle = fopen($filePath, 'r');
    while (fgets($handle) !== false) {
      $lineCount++;
    }
    fclose($handle);

    return [
      'exists' => true,
      'size' => $this->formatBytes(filesize($filePath)),
      'lines' => $lineCount,
      'last_modified' => date('Y-m-d H:i:s', filemtime($filePath)),
    ];
  }

  /**
   * Format bytes to human readable
   */
  private function formatBytes(int|float $bytes): string
  {
    if ($bytes >= 1073741824) {
      return number_format($bytes / 1073741824, 2) . ' GB';
    }
    if ($bytes >= 1048576) {
      return number_format($bytes / 1048576, 2) . ' MB';
    }
    if ($bytes >= 1024) {
      return number_format($bytes / 1024, 2) . ' KB';
    }
    return $bytes . ' B';
  }

  /**
   * Export log file
   */
  public function export(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    // Check permission
    if (!$user->hasPermission('logs.export')) {
      return redirect()->back()->with('error', 'You do not have permission to export logs.');
    }

    $type = $request->get('type', 'security');
    $filePath = storage_path("logs/{$type}.log");

    if (!file_exists($filePath)) {
      return back()->with('error', 'Log file not found.');
    }

    $filename = "{$type}_log_" . date('Y-m-d') . '.txt';

    // Log the export
    SimpleLogger::system(
      "📥 Log exported: {$type}",
      [
        'type' => $type,
        'filename' => $filename,
        'exported_by' => $user->email
      ]
    );

    return response()->download($filePath, $filename);
  }

  /**
   * Clear log file
   */
  public function clear(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    // Check permission
    if (!$user->hasPermission('logs.clear')) {
      return redirect()->back()->with('error', 'You do not have permission to clear logs.');
    }

    $type = $request->get('type', 'security');
    $filePath = storage_path("logs/{$type}.log");

    if (file_exists($filePath)) {
      file_put_contents($filePath, '');
    }

    // Log the clearing
    SimpleLogger::system(
      "🗑️ Log cleared: {$type}",
      [
        'type' => $type,
        'cleared_by' => $user->email
      ]
    );

    return back()->with('success', "{$type} log cleared successfully.");
  }

  /**
   * Get log statistics
   */
  public function stats(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    // Check permission
    if (!$user->hasPermission('logs.view')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    $stats = [];
    foreach (array_keys($this->logTypes) as $type) {
      $filePath = storage_path("logs/{$type}.log");
      if (file_exists($filePath)) {
        $lineCount = 0;
        $handle = fopen($filePath, 'r');
        while (fgets($handle) !== false) {
          $lineCount++;
        }
        fclose($handle);
        $stats[$type] = $lineCount;
      } else {
        $stats[$type] = 0;
      }
    }

    return response()->json([
      'stats' => $stats,
      'total' => array_sum($stats)
    ]);
  }
}
