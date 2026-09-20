<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    private const ALLOWED_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'failed'];

    // List semua order (lintas user) untuk dashboard admin
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $query = Order::with(['user:id,name,email', 'items.product:id,name,price,thumbnail'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('payment_ref', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        return response()->json($query->paginate(10)->withQueryString());
    }

    // Update status order (mis. pending -> shipped -> completed)
    public function updateStatus(Request $request, Order $order)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(self::ALLOWED_STATUSES)],
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui.',
            'order' => $order->fresh(['user:id,name,email', 'items.product:id,name']),
        ]);
    }

    // Helper Validasi Role Admin - konsisten dengan AdminProductController
    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses Admin ditolak.');
        }
    }
}