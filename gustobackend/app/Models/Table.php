<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'seats',
        'status',
        'type',
        'price',
        'position'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'position' => 'array'
    ];

    protected $visible = [
        'id',
        'seats',
        'status',
        'type',
        'price',
        'position',
        'created_at',
        'updated_at'
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
