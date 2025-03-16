<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    public $fillable = ["name", "tin_chi", "tin_chi_hoc_phan"];

  public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'subject_teacher');
    }
    

    public function lessons(): BelongsTo
    {
        return $this->BelongsTo(Lesson::class);
    }

    public function school_classes(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }
}
