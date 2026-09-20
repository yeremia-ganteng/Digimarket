<?php

use App\Http\Controllers\AdminActivityLogController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminSellerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentWebhookController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SellerDashboardController;
use App\Http\Middleware\LogApiActivity;
use Illuminate\Support\Facades\Route;

// ================= PUBLIC ROUTES =================

// Menggunakan limiter 'auth' (Maksimal 5x/menit + custom JSON error response)
Route::middleware(['throttle:auth', LogApiActivity::class])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Webhook Midtrans Publik
Route::post('/checkout/webhook', [PaymentWebhookController::class, 'handle']);
Route::match(['get', 'post'], '/midtrans/callback', [PaymentWebhookController::class, 'handle']);

// ================= PROTECTED ROUTES =================

// Memasang limiter 'api' (60 request/menit) + pencatatan aktivitas untuk seluruh endpoint terproteksi
Route::middleware(['auth:sanctum', 'throttle:api', LogApiActivity::class])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::post('/products/{productId}/reviews', [ReviewController::class, 'store']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);

    // Menggunakan limiter 'checkout' khusus (Maksimal 5x/menit)
    Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:checkout');
    Route::post('/orders/{orderRef}/success', [CheckoutController::class, 'markSuccess']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    Route::get('/my-downloads', [DownloadController::class, 'myDownloads']);
    // Menggunakan limiter 'downloads' khusus (Maksimal 10x/menit)
    Route::get('/download/{token}', [DownloadController::class, 'download'])->middleware('throttle:downloads');

    Route::get('/seller/dashboard', [SellerDashboardController::class, 'index']);

    // Proteksi Admin via Gate 'can:admin'
    Route::middleware('can:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/admin/products/pending', [AdminProductController::class, 'pending']);
        Route::post('/admin/products/{id}/approve', [AdminProductController::class, 'approve']);
        Route::post('/admin/products/{id}/reject', [AdminProductController::class, 'reject']);

        // Dashboard Admin: Manajemen Order
        Route::get('/admin/orders', [AdminOrderController::class, 'index']);
        Route::put('/admin/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

        // Dashboard Admin: Log Aktivitas API
        Route::get('/admin/activity-logs', [AdminActivityLogController::class, 'index']);
        Route::get('/admin/dashboard/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/admin/dashboard/system-health', [AdminDashboardController::class, 'systemHealth']);

        // Dashboard Admin: Tambah Akun Seller
        Route::post('/admin/sellers', [AdminSellerController::class, 'store']);
    });
});