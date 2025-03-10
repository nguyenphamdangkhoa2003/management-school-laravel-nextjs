<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    //
    public $fillable = ["title", "description", "date", "school_class_id"];
    public function school_classes(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class  , "school_class_id");
    }
}
