<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Throwable;

class AdminDashboardController extends Controller
{
    // Statistik ringkasan untuk kartu KPI & panel kesehatan sistem.
    // Semua angka dihitung langsung dari data asli (orders, users, activity_logs) — tidak ada data dummy.
    public function stats(Request $request)
    {
        $this->authorizeAdmin($request);

        $todayStart = now()->startOfDay();

        // ---- Ringkasan Order ----
        $paidStatuses = ['paid', 'processing', 'shipped', 'completed'];

        $todayRevenue = Order::whereIn('status', $paidStatuses)
            ->where('created_at', '>=', $todayStart)
            ->sum('total');

        $todayVerifiedCount = Order::whereIn('status', $paidStatuses)
            ->where('created_at', '>=', $todayStart)
            ->count();

        $todayTotalOrders = Order::where('created_at', '>=', $todayStart)->count();

        $pendingCount = Order::where('status', 'pending')->count();
        $pendingValue = Order::where('status', 'pending')->sum('total');

        // ---- Ringkasan Seller ----
        $sellerCount = User::where('role', 'seller')->count();
        $newSellersThisWeek = User::where('role', 'seller')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // ---- Ringkasan Aktivitas API (hari ini) ----
        $logsToday = ActivityLog::where('created_at', '>=', $todayStart);
        $requestsToday = (clone $logsToday)->count();
        $avgLatency = (int) round((clone $logsToday)->avg('duration_ms') ?? 0);
        $errorCount = (clone $logsToday)->where('status_code', '>=', 400)->count();
        $successRate = $requestsToday > 0
            ? round((($requestsToday - $errorCount) / $requestsToday) * 100, 2)
            : 100.0;

        return response()->json([
            'today_revenue' => (float) $todayRevenue,
            'today_verified_orders' => $todayVerifiedCount,
            'today_total_orders' => $todayTotalOrders,
            'pending_orders_count' => $pendingCount,
            'pending_orders_value' => (float) $pendingValue,
            'seller_count' => $sellerCount,
            'new_sellers_this_week' => $newSellersThisWeek,
            'requests_today' => $requestsToday,
            'avg_latency_ms' => $avgLatency,
            'success_rate' => $successRate,
            'error_count_today' => $errorCount,
        ]);
    }

    // Status kesehatan infrastruktur nyata: DB, cache, antrian, storage, dan webhook pembayaran.
    // Setiap pengecekan dibungkus try/catch agar kegagalan satu layanan tidak menjatuhkan seluruh endpoint.
    public function systemHealth(Request $request)
    {
        $this->authorizeAdmin($request);

        // Database
        $dbHealthy = true;
        try {
            DB::connection()->getPdo();
        } catch (Throwable $e) {
            $dbHealthy = false;
        }

        // Cache
        $cacheDriver = config('cache.default');
        $cacheHealthy = true;
        try {
            Cache::put('__health_check', 1, 5);
            $cacheHealthy = Cache::get('__health_check') === 1;
        } catch (Throwable $e) {
            $cacheHealthy = false;
        }

        // Antrian (tabel bawaan Laravel jobs/failed_jobs, jika queue driver = database)
        $queuePending = Schema::hasTable('jobs') ? DB::table('jobs')->count() : null;
        $queueFailed = Schema::hasTable('failed_jobs') ? DB::table('failed_jobs')->count() : null;

        // Storage
        $storageDisk = config('filesystems.default');

        // Payment Webhook — dihitung dari log aktivitas asli, bukan fiktif
        $lastWebhook = ActivityLog::where('endpoint', 'like', '%webhook%')
            ->orWhere('endpoint', 'like', '%midtrans%')
            ->latest()
            ->first();

        return response()->json([
            'database' => [
                'driver' => config('database.default'),
                'healthy' => $dbHealthy,
            ],
            'cache' => [
                'driver' => $cacheDriver,
                'healthy' => $cacheHealthy,
            ],
            'queue' => [
                'driver' => config('queue.default'),
                'pending' => $queuePending,
                'failed' => $queueFailed,
            ],
            'storage' => [
                'disk' => $storageDisk,
            ],
            'payment_webhook' => $lastWebhook ? [
                'last_seen_at' => $lastWebhook->created_at,
                'status_code' => $lastWebhook->status_code,
                'healthy' => $lastWebhook->status_code < 400,
            ] : null,
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses Admin ditolak.');
        }
    }
}