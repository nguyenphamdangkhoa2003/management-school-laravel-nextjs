<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Guardian extends Model
{
    use HasApiTokens;
    public $fillable = [
        "username",
        "name",
        "surname",
        "email",
        "phone",
        "address",
        "job",
        "sex",
        "password"
    ];
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
