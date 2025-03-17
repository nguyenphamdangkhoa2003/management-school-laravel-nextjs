<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Result extends Model
{
    public $fillable = [  'process_score',
    'semi_score',
    'final_scrore',
    'subject_id',
     "student_id"];

     public function subjects(): BelongsTo
     {
         return $this->belongsTo(Subject::class, 'subject_id');
     }

    public function students(): BelongsTo
    {
        return $this->BelongsTo(Student::class, 'student_id');
    }
}
