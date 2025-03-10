<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Result extends Model
{
    public $fillable = ["score", "exam_id", "assignment_id", "student_id"];

    public function exams(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function assignments(): BelongsTo
    {
        return $this->BelongsTo(Assignment::class, 'assignment_id');
    }

    public function students(): BelongsTo
    {
        return $this->BelongsTo(Student::class, 'student_id');
    }
}
