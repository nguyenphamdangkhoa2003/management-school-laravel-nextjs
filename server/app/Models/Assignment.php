<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    public $fillable = ["title", "startTime", "endTime"];

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function results(): HasMany
    {
        return $this->HasMany(Result::class);
    }
}
