<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Table;

class TableSeeder extends Seeder
{
    public function run()
    {
        // Ensure table is empty to avoid duplicate primary key errors
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('tables')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $tables = [
            ['seats' => 2, 'status' => 'available', 'position' => ['top' => '20%', 'left' => '15%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 4, 'status' => 'available', 'position' => ['top' => '25%', 'left' => '45%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 6, 'status' => 'available', 'position' => ['top' => '15%', 'left' => '75%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 2, 'status' => 'available', 'position' => ['top' => '45%', 'left' => '20%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 4, 'status' => 'available', 'position' => ['top' => '50%', 'left' => '60%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 8, 'status' => 'available', 'position' => ['top' => '40%', 'left' => '80%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 4, 'status' => 'available', 'position' => ['top' => '70%', 'left' => '25%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 2, 'status' => 'available', 'position' => ['top' => '75%', 'left' => '55%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 6, 'status' => 'available', 'position' => ['top' => '65%', 'left' => '80%'], 'type' => 'regular', 'price' => 0],
            ['seats' => 5, 'status' => 'available', 'position' => ['top' => '10%', 'left' => '50%'], 'type' => 'royal', 'price' => 50.00]
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}
