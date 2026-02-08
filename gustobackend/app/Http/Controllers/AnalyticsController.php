<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\Review;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function getDashboardStats()
    {
        $totalUsers = User::count();
        $totalOrders = Order::count();
        $totalReservations = Reservation::count();
        $totalReviews = Review::count();
        
        $totalRevenue = Order::sum('total_amount');
        $pendingOrders = Order::where('status', 'pending')->count();
        $confirmedReservations = Reservation::where('status', 'confirmed')->count();
        
        // Recent orders
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        // Monthly revenue data
        $monthlyRevenue = Order::selectRaw('MONTH(created_at) as month, SUM(total_amount) as revenue')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalOrders' => $totalOrders,
            'totalReservations' => $totalReservations,
            'totalReviews' => $totalReviews,
            'totalRevenue' => $totalRevenue,
            'pendingOrders' => $pendingOrders,
            'confirmedReservations' => $confirmedReservations,
            'recentOrders' => $recentOrders,
            'monthlyRevenue' => $monthlyRevenue,
        ]);
    }
}