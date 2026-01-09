<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'delivery_address' => 'required|string',
            'city' => 'required|string',
            'payment_method' => 'required|in:card,cash',
            'total_amount' => 'required|numeric|min:0'
        ]);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'items' => $request->items,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'delivery_address' => $request->delivery_address,
            'city' => $request->city,
            'payment_method' => $request->payment_method,
            'total_amount' => $request->total_amount,
            'status' => 'confirmed'
        ]);

        return response()->json([
            'message' => 'Order placed successfully',
            'order' => $order
        ], 201);
    }

    public function index(Request $request = null)
    {
        // If no user (public access), return all orders for dashboard
        if (!$request || !$request->user()) {
            $orders = Order::orderBy('created_at', 'desc')->get();
        } else {
            // If authenticated user, return only their orders
            $orders = Order::where('user_id', $request->user()->id)
                          ->orderBy('created_at', 'desc')
                          ->get();
        }

        return response()->json($orders);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,preparing,delivered,cancelled,confirmed'
        ]);

        $order = Order::where('id', $id)
                      ->where('user_id', $request->user()->id)
                      ->firstOrFail();

        $order->status = $request->input('status');
        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }
}
