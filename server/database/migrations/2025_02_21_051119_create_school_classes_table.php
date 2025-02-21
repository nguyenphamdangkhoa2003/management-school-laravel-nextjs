<?php

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->integer("capacity");
            $table->foreignIdFor(Teacher::class, "supervisor_id")->constrained();
            $table->timestamps();
        });
        Schema::table("students", function (Blueprint $table) {
            $table->foreignIdFor(SchoolClass::class);
        });
        Schema::table("lessons", function (Blueprint $table) {
            $table->foreignIdFor(SchoolClass::class)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("lessons", function (Blueprint $table) {
            $table->dropForeignIdFor(SchoolClass::class)->constrained();
        });
        Schema::table("students", function (Blueprint $table) {
            $table->dropForeignIdFor(SchoolClass::class);
        });
        Schema::dropIfExists('school_classes');
    }
};
