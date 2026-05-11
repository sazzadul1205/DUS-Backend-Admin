<?php
// database/migrations/2026_04_04_064825_create_status_timelines_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('status_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->onDelete('cascade');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->timestamps();

            // ADD MISSING INDEX
            $table->index('application_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('status_timelines');
    }
};
