<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected function isStaff($user): bool
    {
        return $user && in_array($user->role, ['admin', 'staff']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'delivery_address' => 'required|string',
            'city' => 'required|string',
            'payment_method' => 'required|in:card,cash',
            'total_amount' => 'required|numeric|min:0'
        ]);

        // TODO: total_amount kaybqa mn client -> khassek t7sbo mn prix dyal Product
        // (ssift lia chkel 'items' bach nzid hadchi)
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

    public function index(Request $request)
    {
        $user = $request->user();

        // FIX: kan public kay-rj3 kol l-orders (smiyat, telephones, adresses).
        // daba: admin/staff kay-chouf kolchi, customer ghir dyalo.
        if ($this->isStaff($user)) {
            $orders = Order::orderBy('created_at', 'desc')->get();
        } else {
            $orders = Order::where('user_id', $user->id)
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

        $user = $request->user();

        if ($this->isStaff($user)) {
            // FIX: admin/staff i9dro ybddlo status dyal ay order (dashboard)
            $order = Order::findOrFail($id);
        } else {
            // FIX: customer i9dr ghir yلغي order dyalo (kan i9dr ydir 'delivered' l rasso)
            if ($request->input('status') !== 'cancelled') {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            $order = Order::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        }

        $order->status = $request->input('status');
        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }
}
