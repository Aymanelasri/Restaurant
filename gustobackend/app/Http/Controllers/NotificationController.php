<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = [];

        // New orders
        $newOrders = Order::where('status', 'pending')
            ->latest()
            ->take(3)
            ->get();
        
        foreach ($newOrders as $order) {
            $notifications[] = [
                'type' => 'New Order',
                'message' => "Order #{$order->id} - {$order->total_price} MAD",
                'time' => $order->created_at->diffForHumans()
            ];
        }

        // New reservations
        $newReservations = Reservation::where('status', 'pending')
            ->latest()
            ->take(2)
            ->get();
        
        foreach ($newReservations as $reservation) {
            $notifications[] = [
                'type' => 'New Reservation',
                'message' => "Table {$reservation->table_id} - {$reservation->guest_name}",
                'time' => $reservation->created_at->diffForHumans()
            ];
        }

        return response()->json($notifications);
    }
}
