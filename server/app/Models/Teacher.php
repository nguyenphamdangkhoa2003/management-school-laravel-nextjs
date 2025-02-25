<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Model
{
    use HasApiTokens;

    public $fillable = ["username", "name", "surname", "email", "phone", "address", "img", "bloodType", "sex", "birthday", "password"];

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
        return $this->HasMany(SchoolClass::class, "supervisor_id");
    }

}
