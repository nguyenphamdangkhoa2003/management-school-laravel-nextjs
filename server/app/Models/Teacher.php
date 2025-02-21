<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    public $fillable = ["username", "name", "surname", "email", "phone", "address", "img", "bloodType", "sex", "birthday"];

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }

    public function lessons(): BelongsTo
    {
        return $this->BelongsTo(Lesson::class);
    }

    public function school_classes(): HasMany
    {
        return $this->HasMany(SchoolClass::class);
    }

}
