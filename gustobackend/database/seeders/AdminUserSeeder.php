<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'Aymanelasri100@gmail.com'],
            [
                'name' => 'Ayman El Asri',
                'password' => Hash::make('Aymane1234'),
                'role' => 'admin'
            ]
        );
    }
}