<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chef extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialty',
        'experience_years',
        'rating',
        'status',
        'orders_today',
        'image'
    ];

    protected $casts = [
        'rating' => 'decimal:1',
        'experience_years' => 'integer',
        'orders_today' => 'integer'
    ];
}