<?php

// ============================================
// LOG MANAGEMENT ROUTES
// URL: /backend/logs/*
// ============================================

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\LogController;

Route::prefix('logs')->name('logs.')->group(function () {
  Route::get('/', [LogController::class, 'index'])->name('index');
  Route::get('/export', [LogController::class, 'export'])->name('export');
  Route::post('/clear', [LogController::class, 'clear'])->name('clear');
  Route::get('/stats', [LogController::class, 'stats'])->name('stats');
});
