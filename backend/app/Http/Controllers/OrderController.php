<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Menampilkan daftar transaksi milik Buyer (atau semua transaksi jika Admin) beserta link unduhannya.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with(['items.product:id,name,price,thumbnail', 'items.download'])
            ->orderBy('created_at', 'desc');

        // FIX SECURITY: Jika bukan admin, batasi hanya pesanan milik user yang bersangkutan
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $orders = $query->paginate(10);

        return response()->json($orders);
    }

    /**
     * Detail transaksi tertentu.
     */
    public function show(Request $request, Order $order)
    {
        $user = $request->user();

        // FIX SECURITY: Pengecekan otorisasi kepemilikan transaksi (Bypass jika Admin)
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke transaksi ini.');
        }

        $order->load(['items.product.seller:id,name', 'items.download']);

        return response()->json($order);
    }
}