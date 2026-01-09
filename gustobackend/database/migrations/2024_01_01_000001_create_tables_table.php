<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->integer('seats');
            $table->enum('status', ['available', 'occupied', 'reserved'])->default('available');
            $table->enum('type', ['regular', 'royal'])->default('regular');
            $table->decimal('price', 8, 2)->default(0);
            $table->json('position');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tables');
    }
};