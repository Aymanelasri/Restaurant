<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('reservations')) {
            Schema::dropIfExists('reservations');
        }

        Schema::dropIfExists('tables');

        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->integer('seats');
            $table->enum('status', ['available', 'occupied', 'reserved'])->default('available');
            $table->enum('type', ['regular', 'royal'])->default('regular');
            $table->decimal('price', 8, 2)->default(0);
            $table->json('position');
            $table->timestamps();
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->date('date');
            $table->time('time');
            $table->foreignId('table_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->decimal('total_price', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('tables');
    }
};
