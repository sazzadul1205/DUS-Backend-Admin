<?php
// app/Http/Controllers/Backup/BackupController.php

namespace App\Http\Controllers\Backup;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use ZipArchive;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\JsonResponse;
use App\Services\SimpleLogger;
use Illuminate\Support\Facades\Auth;

/**
 * BackupController
 * 
 * Handles system backup operations including database backup, file backup,
 * restore functionality, and backup management. Supports both manual and
 * automatic backup creation with configurable retention limits.
 */
class BackupController extends Controller
{
  /** @var string Base path for all backup-related storage */
  protected string $basePath;

  /** @var string Path where backup ZIP files are stored */
  protected string $backupPath;

  /** @var string Path where backup operation logs are stored */
  protected string $logPath;

  /** @var int Maximum number of backups to retain before automatic cleanup */
  protected int $maxBackups;

  /**
   * Constructor - Initializes backup paths and ensures required directories exist.
   */
  public function __construct()
  {
    // Centralized base path for all backup operations
    $this->basePath = storage_path('app/backups');
    $this->backupPath = $this->basePath . '/files';
    $this->logPath = $this->basePath . '/logs';
    $this->maxBackups = 10;

    $this->ensureDirectories();
  }

  /**
   * Ensures all required backup directories exist.
   * Creates them with appropriate permissions if they don't exist.
   */
  protected function ensureDirectories(): void
  {
    try {
      $directories = [
        $this->basePath,
        $this->backupPath,
        $this->logPath,
      ];

      foreach ($directories as $dir) {
        if (!File::exists($dir)) {
          File::makeDirectory($dir, 0755, true);
        }
      }
    } catch (\Exception $e) {
      Log::error('Failed to create backup directories: ' . $e->getMessage());
    }
  }

  /**
   * Display the backup management dashboard.
   * Shows a list of available backups, operation logs, and storage information.
   * 
   * @return \Inertia\Response
   */
  public function index()
  {
    // Permission check - verify user is authenticated and has admin permissions
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return redirect()->route('unauthorized.access')
        ->with('error', 'You do not have permission to view backups.');
    }

    $backups = $this->getBackupList();
    $backupLogs = $this->getBackupLogs();
    $storageInfo = $this->getStorageInfo();

    return Inertia::render('Backend/Backup/Index', [
      'backups' => $backups,
      'backupLogs' => $backupLogs,
      'storageInfo' => $storageInfo,
      'config' => [
        'maxBackups' => $this->maxBackups,
        'backupPath' => 'storage/app/backups/files',
      ]
    ]);
  }

  /**
   * Create a manual backup on demand.
   * Allows administrators to create full, database-only, or files-only backups.
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function createManual(Request $request): JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $type = $request->input('type', 'full');
      $description = $request->input('description', 'Manual backup');

      // Log backup initiation
      SimpleLogger::system(
        "📦 Manual backup initiated: {$type}",
        [
          'type' => $type,
          'description' => $description,
          'performed_by' => Auth::user()?->email ?? 'system',
          'ip' => $request->ip()
        ]
      );

      // Create the backup using the core backup method
      $backupId = $this->createBackup($type, $description, 'manual');

      // Log successful completion
      SimpleLogger::system(
        "✅ Manual backup completed: {$backupId}",
        [
          'backup_id' => $backupId,
          'type' => $type,
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      return response()->json([
        'success' => true,
        'message' => 'Backup created successfully!',
        'backup' => $backupId,
        'location' => $this->backupPath . '/' . $backupId . '.zip'
      ]);
    } catch (\Exception $e) {
      // Log failure
      SimpleLogger::system(
        "❌ Manual backup failed",
        [
          'type' => $request->input('type', 'full'),
          'error' => $e->getMessage(),
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      Log::error('Manual backup failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Failed to create backup: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Create an automatic/scheduled backup.
   * Typically triggered by a cron job or scheduler.
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function createAuto(Request $request): JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $type = $request->input('type', 'full');
      $description = 'Automatic backup - ' . Carbon::now()->format('Y-m-d H:i:s');

      // Log auto backup initiation
      SimpleLogger::system(
        "🔄 Automatic backup initiated: {$type}",
        [
          'type' => $type,
          'performed_by' => 'system'
        ]
      );

      // Create the backup
      $backupId = $this->createBackup($type, $description, 'auto');

      // Log completion
      SimpleLogger::system(
        "✅ Automatic backup completed: {$backupId}",
        [
          'backup_id' => $backupId,
          'type' => $type
        ]
      );

      return response()->json([
        'success' => true,
        'message' => 'Automatic backup created successfully!',
        'backup' => $backupId,
        'location' => $this->backupPath . '/' . $backupId . '.zip'
      ]);
    } catch (\Exception $e) {
      // Log failure
      SimpleLogger::system(
        "❌ Automatic backup failed",
        [
          'type' => $request->input('type', 'full'),
          'error' => $e->getMessage()
        ]
      );

      Log::error('Automatic backup failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Failed to create automatic backup: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Core backup creation method.
   * Handles the actual process of creating database and/or file backups,
   * compressing them into a ZIP archive, and storing metadata.
   * 
   * @param string $type Backup type: 'full', 'database', or 'files'
   * @param string $description Description of the backup
   * @param string $trigger What triggered the backup: 'manual' or 'auto'
   * @return string The generated backup ID
   * @throws \Exception
   */
  protected function createBackup(string $type, string $description, string $trigger): string
  {
    // Generate a unique backup ID using timestamp
    $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
    $backupId = $type . '_' . $timestamp;
    $tempDir = $this->basePath . '/temp_' . $timestamp;

    try {
      // Create temporary directory for assembling backup files
      if (!File::exists($tempDir)) {
        File::makeDirectory($tempDir, 0755, true);
      }

      $files = [];

      // Backup database if requested
      if ($type === 'full' || $type === 'database') {
        $files['database'] = $this->backupDatabase($tempDir);
      }

      // Backup files if requested
      if ($type === 'full' || $type === 'files') {
        $files['files'] = $this->backupFiles($tempDir);
      }

      // Create the final ZIP archive
      $zipPath = $this->backupPath . '/' . $backupId . '.zip';

      $zip = new ZipArchive();
      if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        throw new \Exception('Failed to create zip archive at: ' . $zipPath);
      }

      // Add all files from temporary directory to the ZIP
      $this->addFilesToZip($zip, $tempDir);

      // Add backup metadata as a JSON file inside the archive
      $info = [
        'id' => $backupId,
        'type' => $type,
        'trigger' => $trigger,
        'description' => $description,
        'created_at' => Carbon::now()->toISOString(),
        'size' => 0,
        'files' => $files,
        'database' => $type === 'full' || $type === 'database',
        'php_version' => phpversion(),
        'laravel_version' => app()->version(),
      ];

      $zip->addFromString('backup_info.json', json_encode($info, JSON_PRETTY_PRINT));

      // Close the ZIP archive
      if (!$zip->close()) {
        throw new \Exception('Failed to close zip file');
      }

      // Update metadata with actual file size
      $size = File::exists($zipPath) ? File::size($zipPath) : 0;
      $info['size'] = $size;

      // Save metadata as a separate JSON file for quick access
      $infoPath = $this->backupPath . '/' . $backupId . '_info.json';
      File::put($infoPath, json_encode($info, JSON_PRETTY_PRINT));

      // Clean up temporary directory
      if (File::exists($tempDir)) {
        File::deleteDirectory($tempDir);
      }

      // Log the backup and clean up old backups if needed
      $this->logBackup($backupId, $type, $trigger, $description, $size, 'success');
      $this->cleanupOldBackups();

      return $backupId;
    } catch (\Exception $e) {
      Log::error('Backup failed: ' . $e->getMessage());
      // Clean up temporary directory on failure
      if (File::exists($tempDir)) {
        File::deleteDirectory($tempDir);
      }
      $this->logBackup($backupId ?? 'unknown', $type, $trigger, $description, 0, 'failed', $e->getMessage());
      throw $e;
    }
  }

  /**
   * Export the database schema and data as a SQL file.
   * Uses chunking to handle large tables efficiently.
   * 
   * @param string $tempDir Temporary directory path
   * @return string The filename of the generated SQL file
   * @throws \Exception
   */
  protected function backupDatabase(string $tempDir): string
  {
    $filename = 'database.sql';
    $filepath = $tempDir . '/' . $filename;

    try {
      $connection = config('database.default');
      $database = config("database.connections.{$connection}.database");

      // Get list of all tables
      $tables = DB::select('SHOW TABLES');

      // Determine the table key from the first table result
      $firstTable = $tables[0] ?? null;
      if (!$firstTable) {
        // Fallback - continue with default behavior
      }

      $tableKeys = array_keys((array) $firstTable);
      $tableKey = $tableKeys[0] ?? 'Tables_in_' . str_replace('-', '_', $database);

      // Start building the SQL file
      $sql = "-- Database Backup\n";
      $sql .= "-- Generated: " . Carbon::now() . "\n";
      $sql .= "-- Database: {$database}\n\n";
      $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

      // Process each table
      foreach ($tables as $table) {
        $tableArray = (array) $table;
        $tableName = $tableArray[$tableKey] ?? null;

        if (!$tableName) {
          continue;
        }

        // Get CREATE TABLE statement
        $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
        $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
        $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

        // Get INSERT statements using chunking for large tables
        $sql .= "INSERT INTO `{$tableName}` VALUES\n";
        $insertChunks = [];

        DB::table($tableName)->orderBy('id')->chunk(1000, function ($chunk) use (&$insertChunks) {
          foreach ($chunk as $row) {
            $rowArray = (array) $row;
            $escapedValues = array_map(function ($value) {
              return $value === null ? 'NULL' : "'" . addslashes((string)$value) . "'";
            }, $rowArray);
            $insertChunks[] = "(" . implode(',', $escapedValues) . ")";
          }
        });

        if (!empty($insertChunks)) {
          $sql .= implode(",\n", $insertChunks) . ";\n\n";
        } else {
          // No rows, remove the "INSERT INTO" line
          $sql = substr($sql, 0, -strlen("INSERT INTO `{$tableName}` VALUES\n"));
        }
      }

      $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";
      File::put($filepath, $sql);
      return $filename;
    } catch (\Exception $e) {
      throw new \Exception('Database backup failed: ' . $e->getMessage());
    }
  }

  /**
   * Backup important application files.
   * Includes config, migrations, routes, views, and key configuration files.
   * 
   * @param string $tempDir Temporary directory path
   * @return string The filename of the generated files archive
   * @throws \Exception
   */
  protected function backupFiles(string $tempDir): string
  {
    $filename = 'files.zip';
    $filepath = $tempDir . '/' . $filename;

    try {
      $zip = new ZipArchive();
      if ($zip->open($filepath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        throw new \Exception('Failed to create files zip');
      }

      // Backup important directories
      $directories = [
        'config' => base_path('config'),
        'database/migrations' => base_path('database/migrations'),
        'routes' => base_path('routes'),
        'resources/views' => base_path('resources/views'),
      ];

      foreach ($directories as $name => $path) {
        if (File::exists($path)) {
          $this->addDirectoryToZip($zip, $path, $name);
        }
      }

      // Backup important individual files
      $files = [
        '.env' => base_path('.env'),
        '.env.example' => base_path('.env.example'),
        'composer.json' => base_path('composer.json'),
        'package.json' => base_path('package.json'),
      ];

      foreach ($files as $name => $path) {
        if (File::exists($path) && File::size($path) < 1000000) {
          $zip->addFile($path, $name);
        }
      }

      $zip->close();
      return $filename;
    } catch (\Exception $e) {
      throw new \Exception('Files backup failed: ' . $e->getMessage());
    }
  }

  /**
   * Recursively add a directory and its contents to a ZIP archive.
   * Skips cache, logs, temp files, and files larger than 5MB.
   * 
   * @param ZipArchive $zip The ZIP archive instance
   * @param string $directory Directory path to add
   * @param string $prefix Prefix path inside the archive
   */
  protected function addDirectoryToZip(ZipArchive $zip, string $directory, string $prefix = ''): void
  {
    try {
      $files = File::allFiles($directory);

      foreach ($files as $file) {
        // Skip cache, logs, and temp files
        if (
          strpos($file->getPathname(), '/cache/') !== false ||
          strpos($file->getPathname(), '/logs/') !== false ||
          strpos($file->getPathname(), '/temp_') !== false
        ) {
          continue;
        }

        // Skip large files (>5MB) to keep backup size reasonable
        if ($file->getSize() > 5000000) { // 5MB
          continue;
        }

        $relativePath = $prefix . '/' . $file->getRelativePathname();
        $zip->addFile($file->getPathname(), $relativePath);
      }
    } catch (\Exception $e) {
      Log::warning('Failed to add directory to zip: ' . $e->getMessage());
    }
  }

  /**
   * Add all files from a directory to a ZIP archive.
   * 
   * @param ZipArchive $zip The ZIP archive instance
   * @param string $directory Directory path containing files to add
   */
  protected function addFilesToZip(ZipArchive $zip, string $directory): void
  {
    try {
      $files = File::allFiles($directory);

      foreach ($files as $file) {
        $relativePath = $file->getRelativePathname();
        $zip->addFile($file->getPathname(), $relativePath);
      }
    } catch (\Exception $e) {
      Log::warning('Failed to add files to zip: ' . $e->getMessage());
    }
  }

  /**
   * Download a backup ZIP file.
   * 
   * @param Request $request
   * @return BinaryFileResponse|JsonResponse
   */
  public function download(Request $request): BinaryFileResponse|JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $backupId = $request->input('backup_id');

      if (!$backupId) {
        throw new \Exception('Backup ID is required');
      }

      $zipPath = $this->backupPath . '/' . $backupId . '.zip';

      if (!File::exists($zipPath)) {
        throw new \Exception('Backup file not found at: ' . $zipPath);
      }

      return response()->download($zipPath, $backupId . '.zip', [
        'Content-Type' => 'application/zip',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to download backup: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Delete a backup file and its metadata.
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function delete(Request $request): JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $backupId = $request->input('backup_id');

      if (!$backupId) {
        throw new \Exception('Backup ID is required');
      }

      // Log the deletion for audit purposes
      SimpleLogger::system(
        "🗑️ Backup deleted: {$backupId}",
        [
          'backup_id' => $backupId,
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      $zipPath = $this->backupPath . '/' . $backupId . '.zip';
      $infoPath = $this->backupPath . '/' . $backupId . '_info.json';

      // Delete both the ZIP file and its metadata
      if (File::exists($zipPath)) {
        File::delete($zipPath);
      }

      if (File::exists($infoPath)) {
        File::delete($infoPath);
      }

      return response()->json([
        'success' => true,
        'message' => 'Backup deleted successfully!'
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to delete backup: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Restore a backup from a ZIP file.
   * Can restore database, files, or both based on the type parameter.
   * 
   * @param Request $request
   * @return JsonResponse
   */
  public function restore(Request $request): JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $backupId = $request->input('backup_id');
      $type = $request->input('type', 'full');

      if (!$backupId) {
        throw new \Exception('Backup ID is required');
      }

      // Log restore initiation
      SimpleLogger::system(
        "🔄 Backup restore initiated: {$backupId} ({$type})",
        [
          'backup_id' => $backupId,
          'type' => $type,
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      $zipPath = $this->backupPath . '/' . $backupId . '.zip';

      if (!File::exists($zipPath)) {
        throw new \Exception('Backup file not found at: ' . $zipPath);
      }

      // Extract the backup to a temporary location
      $tempDir = $this->basePath . '/temp_restore_' . Carbon::now()->timestamp;
      if (!File::exists($tempDir)) {
        File::makeDirectory($tempDir, 0755, true);
      }

      $zip = new ZipArchive();
      if ($zip->open($zipPath) !== true) {
        throw new \Exception('Failed to open backup archive');
      }

      $zip->extractTo($tempDir);
      $zip->close();

      // Perform the actual restore based on the type
      if ($type === 'full' || $type === 'database') {
        $this->restoreDatabase($tempDir);
      }

      if ($type === 'full' || $type === 'files') {
        $this->restoreFiles($tempDir);
      }

      // Clean up temporary directory
      File::deleteDirectory($tempDir);
      $this->logRestore($backupId, $type, 'success');

      // Log restore completion
      SimpleLogger::system(
        "✅ Backup restore completed: {$backupId}",
        [
          'backup_id' => $backupId,
          'type' => $type,
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      return response()->json([
        'success' => true,
        'message' => 'Backup restored successfully!'
      ]);
    } catch (\Exception $e) {
      // Log restore failure
      SimpleLogger::system(
        "❌ Backup restore failed",
        [
          'backup_id' => $request->input('backup_id'),
          'type' => $request->input('type', 'full'),
          'error' => $e->getMessage(),
          'performed_by' => Auth::user()?->email ?? 'system'
        ]
      );

      Log::error('Restore failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Failed to restore backup: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Restore the database from a SQL file.
   * Executes SQL statements individually with error handling.
   * 
   * @param string $tempDir Temporary directory containing the SQL file
   * @throws \Exception
   */
  protected function restoreDatabase(string $tempDir): void
  {
    $sqlFile = $tempDir . '/database.sql';
    if (!File::exists($sqlFile)) {
      Log::warning('Database backup file not found, skipping database restore');
      return;
    }

    $sql = File::get($sqlFile);

    try {
      // Split SQL into individual statements
      $statements = $this->splitSqlStatements($sql);
      $total = count($statements);
      $executed = 0;

      foreach ($statements as $statement) {
        if (trim($statement)) {
          try {
            DB::unprepared($statement);
            $executed++;
          } catch (\Exception $e) {
            Log::warning('Failed to execute SQL statement: ' . $e->getMessage());
          }
        }
      }
    } catch (\Exception $e) {
      throw new \Exception('Database restore failed: ' . $e->getMessage());
    }
  }

  /**
   * Restore files from a backup.
   * Restores .env, config files, and routes.
   * 
   * @param string $tempDir Temporary directory containing the files
   * @throws \Exception
   */
  protected function restoreFiles(string $tempDir): void
  {
    $filesZip = $tempDir . '/files.zip';
    if (!File::exists($filesZip)) {
      Log::warning('Files backup not found, skipping files restore');
      return;
    }

    $zip = new ZipArchive();
    if ($zip->open($filesZip) !== true) {
      throw new \Exception('Failed to open files zip');
    }

    $extractDir = $this->basePath . '/temp_files_restore';
    if (!File::exists($extractDir)) {
      File::makeDirectory($extractDir, 0755, true);
    }

    $zip->extractTo($extractDir);
    $zip->close();

    // Restore .env file with backup of existing file
    $envFile = $extractDir . '/.env';
    if (File::exists($envFile)) {
      // Create a backup of the current .env before overwriting
      if (File::exists(base_path('.env'))) {
        File::copy(base_path('.env'), base_path('.env_backup_' . Carbon::now()->timestamp));
      }
      File::copy($envFile, base_path('.env'));
    }

    // Restore config files
    $configDir = $extractDir . '/config';
    if (File::exists($configDir)) {
      $configFiles = File::files($configDir);
      foreach ($configFiles as $file) {
        $targetPath = base_path('config/' . $file->getFilename());
        if (File::exists($targetPath)) {
          File::copy($targetPath, base_path('config/' . $file->getFilename() . '_backup_' . Carbon::now()->timestamp));
        }
        File::copy($file->getPathname(), $targetPath);
      }
    }

    // Restore routes files
    $routesDir = $extractDir . '/routes';
    if (File::exists($routesDir)) {
      $routeFiles = File::files($routesDir);
      foreach ($routeFiles as $file) {
        $targetPath = base_path('routes/' . $file->getFilename());
        File::copy($file->getPathname(), $targetPath);
      }
    }

    // Clean up the temporary extraction directory
    File::deleteDirectory($extractDir);
  }

  /**
   * Split a SQL file into individual executable statements.
   * Removes comments and handles semicolon-delimited statements.
   * 
   * @param string $sql The SQL content
   * @return array Array of individual SQL statements
   */
  protected function splitSqlStatements(string $sql): array
  {
    // Remove line comments
    $sql = preg_replace('/--.*$/m', '', $sql);
    // Remove block comments
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);

    // Split by semicolon
    $statements = explode(';', $sql);

    // Clean up each statement
    $statements = array_map('trim', $statements);
    $statements = array_filter($statements, function ($stmt) {
      return !empty($stmt);
    });

    return array_values($statements);
  }

  /**
   * Get a list of all available backups with their metadata.
   * 
   * @return array Array of backup information
   */
  protected function getBackupList(): array
  {
    try {
      if (!File::exists($this->backupPath)) {
        return [];
      }

      $files = File::files($this->backupPath);
      $backups = [];

      foreach ($files as $file) {
        $filename = $file->getFilename();

        // Only process metadata JSON files
        if (str_ends_with($filename, '_info.json')) {
          $backupId = str_replace('_info.json', '', $filename);
          $content = File::get($file->getPathname());
          $info = json_decode($content, true);

          if ($info && is_array($info)) {
            $backups[] = [
              'id' => $backupId,
              'type' => $info['type'] ?? 'full',
              'trigger' => $info['trigger'] ?? 'manual',
              'description' => $info['description'] ?? 'No description',
              'created_at' => $info['created_at'] ?? Carbon::now()->toISOString(),
              'size' => $info['size'] ?? 0,
              'size_formatted' => $this->formatBytes($info['size'] ?? 0),
              'database' => $info['database'] ?? false,
            ];
          }
        }
      }

      // Sort by creation date (newest first)
      usort($backups, function ($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
      });

      return $backups;
    } catch (\Exception $e) {
      Log::error('Failed to get backup list: ' . $e->getMessage());
      return [];
    }
  }

  /**
   * Get backup operation logs.
   * 
   * @param int $limit Maximum number of log entries to return
   * @return array Array of log entries
   */
  protected function getBackupLogs(int $limit = 50): array
  {
    try {
      $logFile = $this->logPath . '/backup.log';
      if (!File::exists($logFile)) {
        return [];
      }

      $content = File::get($logFile);
      $lines = explode("\n", $content);
      $logs = [];

      foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;

        $parts = explode(' | ', $line);
        if (count($parts) >= 5) {
          $logs[] = [
            'timestamp' => $parts[0] ?? '',
            'level' => $parts[1] ?? 'info',
            'backup_id' => $parts[2] ?? '',
            'type' => $parts[3] ?? '',
            'message' => $parts[4] ?? '',
          ];
        }
      }

      // Return newest logs first
      return array_slice(array_reverse($logs), 0, $limit);
    } catch (\Exception $e) {
      Log::error('Failed to get backup logs: ' . $e->getMessage());
      return [];
    }
  }

  /**
   * Log a backup operation to the backup log file.
   *
   * @param string $backupId The backup ID
   * @param string $type Backup type
   * @param string $trigger What triggered the backup
   * @param string $description Backup description
   * @param int $size Backup file size in bytes
   * @param string $status 'success' or 'failed'
   * @param string|null $error Error message if failed
   */
  protected function logBackup(
    string $backupId,
    string $type,
    string $trigger,
    string $description,
    int $size,
    string $status,
    ?string $error = null
  ): void {
    try {
      $logFile = $this->logPath . '/backup.log';
      $timestamp = Carbon::now()->format('Y-m-d H:i:s');

      $logEntry = sprintf(
        "%s | %s | %s | %s | %s | %s | %d bytes | %s\n",
        $timestamp,
        $status,
        $backupId,
        $type,
        $trigger,
        $description,
        $size,
        $error ?? ''
      );

      File::append($logFile, $logEntry);
    } catch (\Exception $e) {
      Log::error('Failed to log backup: ' . $e->getMessage());
    }
  }

  /**
   * Log a restore operation to the restore log file.
   * 
   * @param string $backupId The backup ID
   * @param string $type Restore type ('full', 'database', or 'files')
   * @param string $status 'success' or 'failed'
   */
  protected function logRestore(string $backupId, string $type, string $status): void
  {
    try {
      $logFile = $this->logPath . '/restore.log';
      $timestamp = Carbon::now()->format('Y-m-d H:i:s');

      $logEntry = sprintf(
        "%s | %s | %s | %s\n",
        $timestamp,
        $status,
        $backupId,
        $type
      );

      File::append($logFile, $logEntry);
    } catch (\Exception $e) {
      Log::error('Failed to log restore: ' . $e->getMessage());
    }
  }

  /**
   * Automatically clean up old backups exceeding the retention limit.
   * Removes the oldest backups when the total count exceeds maxBackups.
   */
  protected function cleanupOldBackups(): void
  {
    try {
      $backups = $this->getBackupList();

      if (count($backups) > $this->maxBackups) {
        $toDelete = array_slice($backups, $this->maxBackups);

        foreach ($toDelete as $backup) {
          $zipPath = $this->backupPath . '/' . $backup['id'] . '.zip';
          $infoPath = $this->backupPath . '/' . $backup['id'] . '_info.json';

          if (File::exists($zipPath)) {
            File::delete($zipPath);
          }
          if (File::exists($infoPath)) {
            File::delete($infoPath);
          }
        }
      }
    } catch (\Exception $e) {
      Log::error('Failed to clean up old backups: ' . $e->getMessage());
    }
  }

  /**
   * Get storage information including backup count, total size, and disk space.
   * 
   * @return array Storage information
   */
  protected function getStorageInfo(): array
  {
    try {
      $total = 0;
      $backups = $this->getBackupList();

      foreach ($backups as $backup) {
        $total += $backup['size'] ?? 0;
      }

      $diskFree = @disk_free_space(storage_path());
      $diskTotal = @disk_total_space(storage_path());

      return [
        'total_backups' => count($backups),
        'total_size' => $total,
        'total_size_formatted' => $this->formatBytes($total),
        'max_backups' => $this->maxBackups,
        'disk_free' => $diskFree ? $this->formatBytes($diskFree) : 'Unknown',
        'disk_total' => $diskTotal ? $this->formatBytes($diskTotal) : 'Unknown',
      ];
    } catch (\Exception $e) {
      return [
        'total_backups' => 0,
        'total_size' => 0,
        'total_size_formatted' => '0 B',
        'max_backups' => $this->maxBackups,
        'disk_free' => 'Unknown',
        'disk_total' => 'Unknown',
      ];
    }
  }

  /**
   * Format bytes to a human-readable string.
   * 
   * @param int $bytes The number of bytes
   * @return string Formatted string (e.g., "2.5 MB")
   */
  protected function formatBytes(int $bytes): string
  {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
      $bytes /= 1024;
      $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
  }

  /**
   * Get the current backup status.
   * 
   * @return JsonResponse
   */
  public function status(): JsonResponse
  {
    // Permission check
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401);
    }
    if (!$user->hasPermission('admin.manage')) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }

    try {
      $lastBackup = $this->getLastBackup();
      $storageInfo = $this->getStorageInfo();

      return response()->json([
        'success' => true,
        'data' => [
          'last_backup' => $lastBackup,
          'storage' => $storageInfo,
          'is_backup_running' => false,
        ]
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to get backup status: ' . $e->getMessage()
      ], 500);
    }
  }

  /**
   * Get the most recent backup.
   * 
   * @return array|null The most recent backup data or null if none exist
   */
  protected function getLastBackup(): ?array
  {
    $backups = $this->getBackupList();
    return count($backups) > 0 ? $backups[0] : null;
  }
}
