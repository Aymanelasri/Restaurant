<?php

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
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\EmailVerificationController;

// ---------------------------------------------------------------
// Public: auth (m3a throttle bach ma-ytجرbch brute-force)
// ---------------------------------------------------------------
Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/send-verification-code', [AuthController::class, 'sendVerificationCode'])->middleware('throttle:5,1');
Route::post('/verify-code', [AuthController::class, 'verifyCode'])->middleware('throttle:10,1');
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->middleware('throttle:5,1');

// Route li kat-jbd mnha 'verification.verify' (kant naqsa -> URL::temporarySignedRoute kay-crashi)
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

// ---------------------------------------------------------------
// Public: ghir qraya dyal l-menu / tables
// ---------------------------------------------------------------
Route::get('/tables', [ReservationController::class, 'getTables']);
Route::get('/available-tables', [ReservationController::class, 'getAvailableTables']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/chefs', [ChefController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store'])->middleware('throttle:5,1');

// ---------------------------------------------------------------
// Authenticated (ay user mconnecti)
// ---------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])
        ->middleware('throttle:3,1');

    Route::post('/reservations', [ReservationController::class, 'store']);

    // Controller howa li kay-filtri: customer ghir dyalo, staff kolchi
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
});

// ---------------------------------------------------------------
// Admin + Staff (dashboard)
// ---------------------------------------------------------------
Route::middleware(['auth:sanctum', 'role:admin,staff'])->group(function () {
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/upload-image', [ProductController::class, 'uploadImage']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::post('/chefs', [ChefController::class, 'store']);
    Route::post('/chefs/upload-image', [ChefController::class, 'uploadImage']);
    Route::put('/chefs/{id}', [ChefController::class, 'update']);
    Route::delete('/chefs/{id}', [ChefController::class, 'destroy']);

    // Kant naqsa: ReviewController::update kayn walakin ma-3ndo route
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);

    Route::get('/analytics', [AnalyticsController::class, 'getDashboardStats']);
    Route::get('/dashboard/weekly-sales', [DashboardController::class, 'weeklySales']);
    Route::get('/dashboard/popular-categories', [DashboardController::class, 'popularCategories']);
    Route::get('/dashboard/popular-dishes', [DashboardController::class, 'popularDishes']);
    Route::get('/dashboard/chefs-status', [DashboardController::class, 'chefsStatus']);
    Route::get('/dashboard/analytics', [DashboardController::class, 'analytics']);
    Route::get('/notifications', [NotificationController::class, 'index']);
});

// ---------------------------------------------------------------
// Admin bark (gestion dyal les users)
// ---------------------------------------------------------------
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [AuthController::class, 'getAllUsers']);
    Route::post('/users', [AuthController::class, 'createUser']);
    Route::put('/users/{id}', [AuthController::class, 'updateUser']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
});
