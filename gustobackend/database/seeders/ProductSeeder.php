<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Pasta', 'price' => 35.00, 'category' => 'Popular', 'description' => 'Rich tomato sauce, parmesan and fresh basil', 'image' => '/restaurants/pasta.webp'],
            ['name' => 'French Fries', 'price' => 55.00, 'category' => 'Popular', 'description' => 'Crispy golden fries seasoned with sea salt', 'image' => '/restaurants/frites.webp'],
            ['name' => 'Chicken Shawarma', 'price' => 35.00, 'category' => 'Popular', 'description' => 'Spiced chicken wrapped with garlic sauce and veggies', 'image' => '/restaurants/shawarma.webp'],
            ['name' => 'Fish Curry', 'price' => 35.00, 'category' => 'Popular', 'description' => 'Creamy coconut curry with tender fish fillets', 'image' => '/restaurants/fish-curry.webp'],
            ['name' => 'Nuggets', 'price' => 35.00, 'category' => 'Popular', 'description' => 'Crispy chicken nuggets served with dip', 'image' => '/restaurants/nuggets.webp'],
            ['name' => 'Pizza', 'price' => 25.00, 'category' => 'Popular', 'description' => 'Stone-baked pizza with fresh toppings', 'image' => '/restaurants/pizza.webp'],
            ['name' => 'Spaghetti', 'price' => 25.00, 'category' => 'Italian', 'description' => 'Classic Italian pasta with rich sauce', 'image' => '/restaurants/Categories/spaghetti.webp'],
            ['name' => 'Lasagna', 'price' => 30.00, 'category' => 'Italian', 'description' => 'Layered pasta with meat and cheese', 'image' => '/restaurants/Categories/Lasagna.webp'],
            ['name' => 'Potatoes Mexico', 'price' => 10.00, 'category' => 'Mexican', 'description' => 'Spicy Mexican-style potatoes', 'image' => '/restaurants/Categories/potatoes-mexico.webp'],
            ['name' => 'Mexican Tacos', 'price' => 25.00, 'category' => 'Mexican', 'description' => 'Authentic Mexican tacos with fresh ingredients', 'image' => '/restaurants/Categories/Mexican-Dishes.webp'],
            ['name' => 'Recipe Mexican', 'price' => 15.00, 'category' => 'Mexican', 'description' => 'Traditional Mexican recipe with authentic flavors', 'image' => '/restaurants/Categories/Recipe-mexican.webp'],
            ['name' => 'Empanadas', 'price' => 15.00, 'category' => 'Mexican', 'description' => 'Crispy pastries filled with savory ingredients', 'image' => '/restaurants/Categories/Hispanic-mexico.webp'],
            ['name' => 'Sushi Platter', 'price' => 28.00, 'category' => 'Japanese', 'description' => 'Fresh sushi selection with wasabi and ginger', 'image' => '/restaurants/Categories/sushi.webp'],
            ['name' => 'Ramen Noodles', 'price' => 30.00, 'category' => 'Japanese', 'description' => 'Hot Japanese noodle soup with rich broth', 'image' => '/restaurants/Categories/Ramen-japon.webp'],
            ['name' => 'Japanese Soup', 'price' => 30.00, 'category' => 'Japanese', 'description' => 'Traditional Japanese soup with fresh ingredients', 'image' => '/restaurants/Categories/soup japanesse.webp'],
            ['name' => 'Orange Juice', 'price' => 5.00, 'category' => 'Drinks', 'description' => 'Fresh squeezed orange juice', 'image' => '/restaurants/Orange-jus.webp'],
            ['name' => 'Melon Juice', 'price' => 7.00, 'category' => 'Drinks', 'description' => 'Sweet and refreshing melon juice', 'image' => '/restaurants/Melon-jus.webp'],
            ['name' => 'Strawberry Juice', 'price' => 8.00, 'category' => 'Drinks', 'description' => 'Fresh strawberry juice with natural sweetness', 'image' => '/restaurants/Strawberry-jus.webp'],
            ['name' => 'Oreo Milkshake', 'price' => 8.00, 'category' => 'Drinks', 'description' => 'Creamy milkshake with Oreo cookies', 'image' => '/restaurants/oreo-milk.webp'],
            ['name' => 'Croissants', 'price' => 6.00, 'category' => 'Breakfast', 'description' => 'Buttery French pastries, perfect for breakfast', 'image' => '/restaurants/croissants.webp'],
            ['name' => 'Grilled Chicken', 'price' => 22.00, 'category' => 'Main Course', 'description' => 'Tender grilled chicken with herbs and spices', 'image' => '/restaurants/chicken.webp'],
            ['name' => 'Crepes', 'price' => 12.00, 'category' => 'Dessert', 'description' => 'Thin French pancakes with sweet or savory fillings', 'image' => '/restaurants/crepes.webp']
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}