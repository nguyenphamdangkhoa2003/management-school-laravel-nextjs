<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubjectTeacher extends Model
{
    protected $table = 'subject_teacher';
    
    protected $fillable = [
        'teacher_id',
        'subject_id',
    ];

    /**
     * Get the teacher that owns the subject teacher relationship.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the subject that owns the subject teacher relationship.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
