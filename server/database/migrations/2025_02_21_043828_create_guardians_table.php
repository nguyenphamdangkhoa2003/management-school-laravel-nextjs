<?php

use App\Models\Guardian;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->string("username")->unique();
            $table->string("name");
            $table->string("surname");
            $table->string("email")->nullable()->unique();
            $table->string("phone")->nullable()->unique();
            $table->string("address");
            $table->string("job")->nullable();
            $table->enum("sex", ["MALE", "FEMALE"]);
            $table->timestamps();
        });
        
        Schema::table("students", function (Blueprint $table) {
            $table->foreignIdFor(Guardian::class)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("students", function (Blueprint $table) {
            $table->dropForeignIdFor(Guardian::class);
        });
        Schema::dropIfExists('guardians');
    }
};
