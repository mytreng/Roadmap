<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    protected $fillable = [
        'section_id',
        'title',
        'is_completed',
    ];
}
