<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Roadmap;

class Section extends Model
{
    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }
    public function steps()
    {
        return $this->hasMany(Step::class);
    }
    protected $fillable = [
        'roadmap_id',
        'title',
        'order',
    ];
}
