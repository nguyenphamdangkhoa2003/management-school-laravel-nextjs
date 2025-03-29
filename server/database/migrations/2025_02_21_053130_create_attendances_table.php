<?php

use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->dateTime("date")->default(Date::now());
            $table->boolean("present");
            $table->foreignIdFor(Student::class)->constrained();
            $table->foreignIdFor(Lesson::class)->constrained();
            $table->timestamps();

            // Thêm composite unique constraint
            $table->unique(['student_id', 'lesson_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
