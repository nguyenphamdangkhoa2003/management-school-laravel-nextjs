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
        "password"
    ];

    public function guardians(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    public function grades(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function attendances(): HasMany
    {
        return $this->HasMany(Attendance::class);
    }
}
