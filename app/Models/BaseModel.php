<?php
// app/Models/BaseModel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class BaseModel
 *
 * Base model with common functionality for all models
 *
 * @package App\Models
 */
abstract class BaseModel extends Model
{
    /**
     * The number of models to return for pagination.
     *
     * @var int
     */
    protected $perPage = 15;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        // Add global scopes or event listeners here if needed
    }

    /**
     * Get the table name with prefix if needed.
     *
     * @return string
     */
    public static function getTableName(): string
    {
        return (new static())->getTable();
    }
}
