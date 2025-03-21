<?php

use App\Models\Room;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code_room', 20)->unique(); // Mã phòng
            $table->integer('floor'); // Tầng
            $table->string('name')->nullable(); // Tên phòng (nếu có)
            $table->integer('capacity')->nullable(); // Sức chứa
            $table->enum('type', ['lecture', 'lab', 'office', 'meeting'])->default('lecture'); // Loại phòng
            $table->boolean('is_available')->default(true); // Trạng thái sử dụng
            $table->timestamps();
        });
        Schema::table("lessons", function (Blueprint $table) {
            $table->foreignIdFor(Room::class)->constrained();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};

