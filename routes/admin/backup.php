<?php

// ============================================
// BACKUP ROUTES
// URL: /backend/backup/*
// ============================================

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backup\BackupController;

Route::prefix('backup')->name('backup.')->group(function () {
  Route::get('/', [BackupController::class, 'index'])->name('index');
  Route::post('/create-manual', [BackupController::class, 'createManual'])->name('create-manual');
  Route::post('/create-auto', [BackupController::class, 'createAuto'])->name('create-auto');
  Route::post('/restore', [BackupController::class, 'restore'])->name('restore');
  Route::delete('/delete', [BackupController::class, 'delete'])->name('delete');
  Route::get('/download', [BackupController::class, 'download'])->name('download');
  Route::get('/status', [BackupController::class, 'status'])->name('status');
});
