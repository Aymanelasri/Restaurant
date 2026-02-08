<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ChefController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;

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

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\PasswordResetController;

Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-verification-code', [AuthController::class, 'sendVerificationCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Public routes
Route::get('/tables', [ReservationController::class, 'getTables']);
Route::get('/available-tables', [ReservationController::class, 'getAvailableTables']);
Route::get('/reservations', [ReservationController::class, 'index']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/users', [AuthController::class, 'getAllUsers']);
Route::post('/users', [AuthController::class, 'createUser']);
Route::put('/users/{id}', [AuthController::class, 'updateUser']);
Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::post('/products/upload-image', [ProductController::class, 'uploadImage']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::get('/chefs', [ChefController::class, 'index']);
Route::post('/chefs', [ChefController::class, 'store']);
Route::post('/chefs/upload-image', [ChefController::class, 'uploadImage']);
Route::put('/chefs/{id}', [ChefController::class, 'update']);
Route::delete('/chefs/{id}', [ChefController::class, 'destroy']);
Route::get('/analytics', [AnalyticsController::class, 'getDashboardStats']);
Route::get('/dashboard/weekly-sales', [DashboardController::class, 'weeklySales']);
Route::get('/dashboard/popular-categories', [DashboardController::class, 'popularCategories']);
Route::get('/dashboard/popular-dishes', [DashboardController::class, 'popularDishes']);
Route::get('/dashboard/chefs-status', [DashboardController::class, 'chefsStatus']);
Route::get('/dashboard/analytics', [DashboardController::class, 'analytics']);
Route::get('/notifications', [NotificationController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});

Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews', [ReviewController::class, 'index']);
