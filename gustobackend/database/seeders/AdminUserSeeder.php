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
            ['email' => 'aymanelasri100@gmail.com'],
            [
                'name' => 'Aymane Elasri',
                'password' => Hash::make('Asad@1234'),
                'role' => 'admin'
            ]
        );
    }
}
