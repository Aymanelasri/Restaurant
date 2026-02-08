<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Chef;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\Dish;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Users - Admin only
        User::create(['name' => 'Admin', 'email' => 'admin@restaurant.com', 'password' => Hash::make('password'), 'role' => 'admin']);

        // Chefs
        Chef::create(['name' => 'Marco Bianchi', 'specialty' => 'Italian Cuisine', 'experience_years' => 12, 'rating' => 4.9, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Marco-Bianchi.webp']);
        Chef::create(['name' => 'Elena Martínez', 'specialty' => 'Spanish Cuisine', 'experience_years' => 10, 'rating' => 4.8, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Elena-Martínez.webp']);
        Chef::create(['name' => 'Yassine Amrani', 'specialty' => 'Moroccan Cuisine', 'experience_years' => 8, 'rating' => 4.7, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Yassine-Amrani.webp']);
        Chef::create(['name' => 'Claire Dubois', 'specialty' => 'French Pastry', 'experience_years' => 7, 'rating' => 4.9, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Claire-Dubois.webp']);
        Chef::create(['name' => 'Thomas Schneider', 'specialty' => 'German Cuisine', 'experience_years' => 9, 'rating' => 4.6, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Thomas-Schneider.webp']);
        Chef::create(['name' => 'Sofia Romano', 'specialty' => 'Mediterranean', 'experience_years' => 6, 'rating' => 4.8, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Sofia-romano.webp']);
        Chef::create(['name' => 'Julien Lefèvre', 'specialty' => 'French Cuisine', 'experience_years' => 11, 'rating' => 4.9, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Julien-Lefèvre.webp']);
        Chef::create(['name' => 'Lucas Moreau', 'specialty' => 'Fusion Cuisine', 'experience_years' => 5, 'rating' => 4.7, 'status' => 'active', 'orders_today' => 0, 'image' => '/chefs/Lucas-Moreau.webp']);

        // Dishes
        Dish::create(['name' => 'Pizza Margherita', 'category' => 'Pizza', 'rating' => 4.8, 'revenue' => 2340, 'orders_count' => 156]);
        Dish::create(['name' => 'Burger Deluxe', 'category' => 'Burger', 'rating' => 4.6, 'revenue' => 1876, 'orders_count' => 134]);
        Dish::create(['name' => 'Caesar Salad', 'category' => 'Salad', 'rating' => 4.7, 'revenue' => 1176, 'orders_count' => 98]);
        Dish::create(['name' => 'Pasta Carbonara', 'category' => 'Pasta', 'rating' => 4.9, 'revenue' => 1305, 'orders_count' => 87]);
        Dish::create(['name' => 'Grilled Salmon', 'category' => 'Seafood', 'rating' => 4.5, 'revenue' => 1520, 'orders_count' => 76]);
        Dish::create(['name' => 'Pepperoni Pizza', 'category' => 'Pizza', 'rating' => 4.7, 'revenue' => 1890, 'orders_count' => 126]);
        Dish::create(['name' => 'Chicken Burger', 'category' => 'Burger', 'rating' => 4.5, 'revenue' => 1456, 'orders_count' => 104]);
        Dish::create(['name' => 'Spaghetti Bolognese', 'category' => 'Pasta', 'rating' => 4.6, 'revenue' => 980, 'orders_count' => 70]);
        Dish::create(['name' => 'Greek Salad', 'category' => 'Salad', 'rating' => 4.4, 'revenue' => 756, 'orders_count' => 63]);
        Dish::create(['name' => 'Chocolate Cake', 'category' => 'Desserts', 'rating' => 4.8, 'revenue' => 640, 'orders_count' => 80]);

        // Tables
        $this->call(TableSeeder::class);
        
        // Products (Menu)
        $this->call(ProductSeeder::class);
    }
}
