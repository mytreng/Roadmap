<?php

namespace App\Models;

use App\Models\Section;
use App\Models\Step;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class roadmaps extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'target_date',
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function sections()
    {
        return $this->hasMany(Section::class, 'roadmap_id');
    }
    public function steps()
{
    return $this->hasManyThrough(
        Step::class,
        Section::class,
        'roadmap_id',
        'section_id',
        'id',
        'id'
    );
}

    public function section()
    {
        return $this->sections();
    }
}
