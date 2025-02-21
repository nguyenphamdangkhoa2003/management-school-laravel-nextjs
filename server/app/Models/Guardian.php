<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guardian extends Model
{
    public $fillable = [
        "username",
        "name",
        "surname",
        "email",
        "phone",
        "address",
        "job",
        "sex"
    ];
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
