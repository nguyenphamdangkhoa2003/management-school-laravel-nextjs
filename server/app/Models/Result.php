<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Result extends Model
{
    public $fillable = ["score"];

    public function exams(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function assignments(): BelongsTo
    {
        return $this->BelongsTo(Assignment::class);
    }

    public function students(): BelongsTo
    {
        return $this->BelongsTo(Student::class);
    }
}
