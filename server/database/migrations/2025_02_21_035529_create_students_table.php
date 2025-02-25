<?php

use App\Models\Grade;
use App\Models\Guardian;
use App\Models\SchoolClass;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique();
            $table->string("username")->unique();
            $table->string("name");
            $table->string("surname");
            $table->string("email")->nullable()->unique();
            $table->string("phone")->nullable()->unique();
            $table->string("address");
            $table->string("img")->nullable();
            $table->enum("sex", ["MALE", "FEMALE"]);
            $table->string("bloodType");
            $table->dateTime(column: "birthday");
            $table->string("password");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
