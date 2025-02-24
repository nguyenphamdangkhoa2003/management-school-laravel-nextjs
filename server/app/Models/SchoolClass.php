<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    public $fillable = ["name", "capacity", "teacher_id", "grade_id"];

    public function lesssons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function teachers(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grades(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}
