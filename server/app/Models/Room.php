<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'code_room',
        'floor',
        'name',
        'capacity',
        'type',
        'is_available',
    ];
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}

