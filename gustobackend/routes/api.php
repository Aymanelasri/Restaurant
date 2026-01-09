<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/tables', [ReservationController::class, 'getTables']);
Route::get('/available-tables', [ReservationController::class, 'getAvailableTables']);
Route::get('/reservations', [ReservationController::class, 'index']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/users', [AuthController::class, 'getAllUsers']);
Route::put('/users/{id}', [AuthController::class, 'updateUser']);
Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});




Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews', [ReviewController::class, 'index']);
