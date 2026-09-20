<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // FIX SECURITY: Otentikasi dan otorisasi role Seller
        if (!$user || $user->role !== 'seller') {
            return response()->json([
                'message' => 'Akses ditolak. Hanya seller yang dapat melihat dashboard.'
            ], 403);
        }

        $sellerId = $user->id;

        // Total Produk Seller
        $totalProducts = Product::where('seller_id', $sellerId)->count();

        // Total Penjualan & Revenue Produk Terjual
        $salesStats = OrderItem::whereHas('product', function ($q) use ($sellerId) {
                $q->where('seller_id', $sellerId);
            })
            ->whereHas('order', function ($q) {
                $q->where('status', 'paid');
            })
            ->selectRaw('COUNT(id) as total_sales, COALESCE(SUM(price), 0) as total_revenue')
            ->first();

        // Grafik Penjualan Bulanan (6 Bulan Terakhir)
        $monthlyRevenue = OrderItem::whereHas('product', function ($q) use ($sellerId) {
                $q->where('seller_id', $sellerId);
            })
            ->whereHas('order', function ($q) {
                $q->where('status', 'paid');
            })
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(price) as revenue'),
                DB::raw('COUNT(id) as sales_count')
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'total_products' => $totalProducts,
            'total_sales'    => (int) ($salesStats->total_sales ?? 0),
            'total_revenue'  => (float) ($salesStats->total_revenue ?? 0),
            'monthly_chart'  => $monthlyRevenue
        ]);
    }
}