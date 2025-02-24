<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    public $fillable = ["name", "day", "startTime", "endTime","subject_id", "teacher_id", "school_class_id"];

    public function subjects(): HasMany
    {
        return $this->HasMany(Subject::class);
    }

    public function teachers(): HasMany
    {
        return $this->HasMany(Teacher::class);
    }

    public function exams(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function assisgnments(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function attendances(): HasMany
    {
        return $this->HasMany(Attendance::class);
    }

    public function school_classes(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }
}
