<?php

use App\Models\Subject;
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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string("username")->unique();
            $table->string("name");
            $table->string("surname");
            $table->string("email")->nullable()->unique();
            $table->string("phone")->nullable()->unique();
            $table->string("address");
            $table->string("img")->nullable();
            $table->string("bloodType");
            $table->dateTime("birthday");
            $table->foreignIdFor(Subject::class)->nullable();
            $table->enum("sex", ["MALE", "FEMALE"]);
            $table->timestamps();
        });

        Schema::table("subjects", function (Blueprint $table) {
            $table->foreignIdFor(Teacher::class)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("subjects", function (Blueprint $table) {
            $table->dropForeignIdFor(Teacher::class)->constrained();
        });
        Schema::dropIfExists('teachers');
    }
};
