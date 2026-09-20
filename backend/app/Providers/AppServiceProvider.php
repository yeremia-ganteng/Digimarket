<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Otorisasi Gate Admin
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });

        // 2. Rate Limiting Umum API (Scraping Protection: 60 request/menit)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // 3. Rate Limiting Auth (Brute-Force Protection: 5 request/menit)
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Terlalu banyak percobaan akses auth. Silakan tunggu 1 menit.',
                ], 429);
            });
        });

        // 4. Rate Limiting Checkout (Anti-Spam Order: 5 request/menit)
        RateLimiter::for('checkout', function (Request $request) {
            return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'message' => 'Terlalu banyak transaksi bersamaan. Silakan tunggu 1 menit.',
                ], 429);
            });
        });

        // 5. Rate Limiting Digital Downloads (Aset Protection: 10 request/menit)
        RateLimiter::for('downloads', function (Request $request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'message' => 'Batas kuota unduhan tercapai, harap tunggu beberapa saat.',
                ], 429);
            });
        });
    }
}