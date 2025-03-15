<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class Teacher extends Model
{
    use HasApiTokens;

    public $fillable = ["username", "name", "surname", "email", "phone", "address", "img", "bloodType", "sex", "birthday", "password"];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'subject_teacher');
    }
    
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
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