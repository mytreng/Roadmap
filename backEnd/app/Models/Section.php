<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    public function roadmap(){
        return $this->belongsTo(roadmaps::class);
    }
    public function steps(){
        return $this->hasMany(Step::class);
    }
    protected $fillable = [
        'roadmap_id',
        'title',
        'order',
    ];
}
