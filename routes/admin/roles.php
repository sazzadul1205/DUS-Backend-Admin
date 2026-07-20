<?php

// ============================================
// ROLE MANAGEMENT ROUTES
// URL: /backend/roles/*
// ============================================

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\RoleController;

Route::prefix('roles')->name('roles.')->group(function () {
  Route::get('/', [RoleController::class, 'index'])->name('index');
  Route::get('/create', [RoleController::class, 'create'])->name('create');
  Route::post('/', [RoleController::class, 'store'])->name('store');
  Route::get('/trashed', [RoleController::class, 'trashed'])->name('trashed');
  Route::get('/export', [RoleController::class, 'export'])->name('export');
  Route::get('/{id}', [RoleController::class, 'show'])->name('show')->whereNumber('id');
  Route::get('/{id}/edit', [RoleController::class, 'edit'])->name('edit')->whereNumber('id');
  Route::put('/{id}', [RoleController::class, 'update'])->name('update')->whereNumber('id');
  Route::delete('/{id}', [RoleController::class, 'destroy'])->name('destroy')->whereNumber('id');
  Route::post('/{id}/restore', [RoleController::class, 'restore'])->name('restore')->whereNumber('id');
  Route::delete('/{id}/force', [RoleController::class, 'forceDelete'])->name('force-delete')->whereNumber('id');
  Route::post('/bulk/delete', [RoleController::class, 'bulkDelete'])->name('bulk-delete');
  Route::post('/bulk/restore', [RoleController::class, 'bulkRestore'])->name('bulk-restore');
  Route::post('/{id}/toggle-status', [RoleController::class, 'toggleStatus'])->name('toggle-status')->whereNumber('id');
  Route::post('/{id}/clone', [RoleController::class, 'clone'])->name('clone')->whereNumber('id');
});
