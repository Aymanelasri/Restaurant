<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chef;

class ChefSeeder extends Seeder
{
    public function run(): void
    {
        $chefs = [
            [
                'name' => 'Claire Dubois',
                'specialty' => 'French Cuisine',
                'experience_years' => 12,
                'rating' => 4.8,
                'status' => 'active',
                'orders_today' => 156,
                'image' => '/chefs/Claire-Dubois.webp'
            ],
            [
                'name' => 'Lucas Moreau',
                'specialty' => 'Modern European',
                'experience_years' => 10,
                'rating' => 4.7,
                'status' => 'active',
                'orders_today' => 134,
                'image' => '/chefs/Lucas-Moreau.webp'
            ],
            [
                'name' => 'Marco Bianchi',
                'specialty' => 'Italian Cuisine',
                'experience_years' => 15,
                'rating' => 4.9,
                'status' => 'active',
                'orders_today' => 189,
                'image' => '/chefs/Marco-Bianchi.webp'
            ],
            [
                'name' => 'Elena Martínez',
                'specialty' => 'Spanish Cuisine',
                'experience_years' => 11,
                'rating' => 4.6,
                'status' => 'active',
                'orders_today' => 145,
                'image' => '/chefs/Elena-Martínez.webp'
            ],
            [
                'name' => 'Julien Lefèvre',
                'specialty' => 'Pastry Chef',
                'experience_years' => 8,
                'rating' => 4.9,
                'status' => 'break',
                'orders_today' => 98,
                'image' => '/chefs/Julien-Lefèvre.webp'
            ],
            [
                'name' => 'Sofia Romano',
                'specialty' => 'Mediterranean',
                'experience_years' => 9,
                'rating' => 4.7,
                'status' => 'active',
                'orders_today' => 167,
                'image' => '/chefs/Sofia-romano.webp'
            ],
            [
                'name' => 'Thomas Schneider',
                'specialty' => 'German Cuisine',
                'experience_years' => 13,
                'rating' => 4.5,
                'status' => 'active',
                'orders_today' => 123,
                'image' => '/chefs/Thomas-Schneider.webp'
            ],
            [
                'name' => 'Yassine Amrani',
                'specialty' => 'Moroccan Cuisine',
                'experience_years' => 14,
                'rating' => 4.8,
                'status' => 'active',
                'orders_today' => 178,
                'image' => '/chefs/Yassine-Amrani.webp'
            ]
        ];

        foreach ($chefs as $chef) {
            Chef::create($chef);
        }
    }
}