<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grade extends Model
{
    public $fillable = ["level"];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function school_classes(): HasMany
    {
        return $this->hasMany(SchoolClass::class);
    }
}
