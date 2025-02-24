<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    public $fillable = ["title", "startTime", "endTime",'lesson_id'];

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function results(): HasMany
    {
        return $this->HasMany(Result::class);
    }
}
