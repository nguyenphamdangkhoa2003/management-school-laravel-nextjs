<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    use HasApiTokens;

    public $fillable = [
        "code",
        "username",
        "name",
        "surname",
        "email",
        "phone",
        "address",
        "img",
        "sex",
        "bloodType",
        "birthday",
        "password",
    "guardian_id",
    "school_class_id",
    "grade_id",

    ];

    public function guardians(): BelongsTo
    {
        return $this->belongsTo(Guardian::class, 'guardian_id');
    }

    public function grades(): BelongsTo
    {
        return $this->belongsTo(Grade::class, 'grade_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function attendances(): HasMany
    {
        return $this->HasMany(Attendance::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

}
