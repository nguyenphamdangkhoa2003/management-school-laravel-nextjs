<?php

use App\Models\Grade;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->string("level");
            $table->timestamps();
        });

        Schema::table("students", function (Blueprint $table) {
            $table->foreignIdFor(Grade::class)->constrained();
        });
        Schema::table("school_classes", function (Blueprint $table) {
            $table->foreignIdFor(Grade::class)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("school_classes", function (Blueprint $table) {
            $table->dropForeignIdFor(Grade::class)->constrained();
        });
        Schema::table("students", function (Blueprint $table) {
            $table->dropForeignIdFor(Grade::class)->constrained();
        });
        Schema::dropIfExists('grades');
    }
};
