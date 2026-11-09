<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Chef;
use App\Models\Product;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function weeklySales()
    {
        $weekStart = Carbon::now()->startOfWeek();
        $weekEnd = $weekStart->copy()->endOfWeek();
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // FIX: query wa7da 3awed 14 query f loop
        $rows = Order::whereBetween('created_at', [$weekStart, $weekEnd])
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DATE(created_at) as day, COUNT(*) as orders, SUM(total_amount) as revenue, COUNT(DISTINCT user_id) as customers')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $result = [];

        for ($i = 0; $i < 7; $i++) {
            $row = $rows->get($weekStart->copy()->addDays($i)->toDateString());

            $result[] = [
                'day' => $days[$i],
                'orders' => (int) ($row->orders ?? 0),
                'revenue' => (float) ($row->revenue ?? 0),
                'customers' => (int) ($row->customers ?? 0)
            ];
        }

        return response()->json($result);
    }

    public function popularCategories()
    {
        $categories = Product::select('category', DB::raw('count(*) as product_count'))
            ->groupBy('category')
            ->get();

        $total = $categories->sum('product_count');

        $result = $categories->map(function ($cat) use ($total) {
            return [
                'category' => $cat->category,
                'percentage' => $total > 0 ? round(($cat->product_count / $total) * 100) : 0,
                // NB: hadi ghir 3adad dyal produits, machi commandes (7it Order.items JSON)
                'orders' => $cat->product_count
            ];
        });

        return response()->json($result);
    }

    public function popularDishes()
    {
        $products = Product::withCount(['orders' => function ($query) {
            $query->where('status', '!=', 'cancelled');
        }])
        ->orderBy('orders_count', 'desc')
        ->take(5)
        ->get();

        $result = $products->map(function ($product) {
            return [
                'name' => $product->name,
                'category' => $product->category,
                'rating' => 4.5, // NB: hardcoded
                'orders_count' => $product->orders_count ?? 0,
                'revenue' => $product->price * ($product->orders_count ?? 0)
            ];
        });

        return response()->json($result);
    }

    public function chefsStatus()
    {
        $chefs = Chef::where('status', 'active')->get();

        // FIX: n7sbou mra wa7da, machi f kol iteration (o division b 0 mmkna)
        $activeCount = $chefs->count();
        $ordersToday = Order::whereDate('created_at', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->count();

        $perChef = ($ordersToday > 0 && $activeCount > 0) ? (int) ($ordersToday / $activeCount) : 0;

        foreach ($chefs as $chef) {
            $chef->orders_today = $perChef;
        }

        return response()->json($chefs->values());
    }

    public function analytics()
    {
        $weekStart = Carbon::now()->startOfWeek();

        $totalUsers = User::where('role', 'customer')->count();
        $totalOrders = Order::where('status', '!=', 'cancelled')->count();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $pendingReservations = Reservation::where('status', 'pending')->count();

        $weeklyOrders = Order::where('created_at', '>=', $weekStart)
            ->where('status', '!=', 'cancelled')
            ->count();

        $weeklyRevenue = Order::where('created_at', '>=', $weekStart)
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'pending_reservations' => $pendingReservations,
                'weekly_orders' => $weeklyOrders,
                'weekly_revenue' => $weeklyRevenue
            ],
            'weekly_sales' => $this->weeklySales()->getData(),
            'popular_categories' => $this->popularCategories()->getData(),
            'popular_dishes' => $this->popularDishes()->getData(),
            'chefs_status' => $this->chefsStatus()->getData()
        ]);
    }
}
