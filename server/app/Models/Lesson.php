<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    public $fillable = ["link", "day", "startTime", "endTime","class_time","ending_class_time","subject_teacher_id","room_id"];

    public function exams(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
    public function rooms(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
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
    public function subject_teacher(): BelongsTo
    {
        return $this->belongsTo(SubjectTeacher::class, 'subject_teacher_id');
    }
}
