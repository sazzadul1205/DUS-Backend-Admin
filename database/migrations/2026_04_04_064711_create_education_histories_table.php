<?php
// database/migrations/2026_04_04_064711_create_education_histories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('institution_name');
            $table->string('degree');
            $table->year('passing_year');
            $table->timestamps();
            $table->softDeletes();

            // Unique Index
            $table->index('applicant_profile_id');
            $table->index('passing_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education_histories');
    }
};
