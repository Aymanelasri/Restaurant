<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'items',
        'customer_name',
        'customer_phone',
        'delivery_address',
        'city',
        'payment_method',
        'total_amount',
        'status'
    ];

    protected $casts = [
        'items' => 'array',
        'total_amount' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
