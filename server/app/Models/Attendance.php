<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attendance extends Model
{
    public $fillable = ["date", "present", "student_id", "lesson_id"];

    public function students(): BelongsTo
    {
        return $this->BelongsTo(Student::class);
    }

    public function lessons(): BelongsTo
    {
        return $this->BelongsTo(Lesson::class);
    }
}
