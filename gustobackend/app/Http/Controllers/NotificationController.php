<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Reservation;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = [];

        $newOrders = Order::where('status', 'pending')
            ->latest()
            ->take(3)
            ->get();

        foreach ($newOrders as $order) {
            $notifications[] = [
                'type' => 'New Order',
                // FIX: l-colonne smitha total_amount (total_price makaynach -> kan khrj vide)
                'message' => "Order #{$order->id} - {$order->total_amount} MAD",
                'time' => $order->created_at->diffForHumans()
            ];
        }

        $newReservations = Reservation::where('status', 'pending')
            ->latest()
            ->take(2)
            ->get();

        foreach ($newReservations as $reservation) {
            $notifications[] = [
                'type' => 'New Reservation',
                // FIX: l-colonne smitha name (guest_name makaynach)
                'message' => "Table {$reservation->table_id} - {$reservation->name}",
                'time' => $reservation->created_at->diffForHumans()
            ];
        }

        return response()->json($notifications);
    }
}
