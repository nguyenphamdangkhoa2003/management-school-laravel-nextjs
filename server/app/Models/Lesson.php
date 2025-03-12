<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    public $fillable = ["name", "day", "startTime", "endTime","subject_id", "teacher_id", "school_class_id"];

    public function subjects(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
    

    public function teachers(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
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
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

}
