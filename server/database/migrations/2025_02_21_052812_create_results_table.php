<?php

use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->float("process_score")->nullable();
            $table->float("semi_score")->nullable();
            $table->float("final_scrore")->nullable();
            $table->foreignIdFor(Subject::class)->constrained();
            $table->foreignIdFor(Student::class)->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
