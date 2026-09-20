<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    // List Produk Pending
    public function pending(Request $request)
    {
        $this->authorizeAdmin($request);

        $products = Product::where('status', 'pending')
            ->with(['seller:id,name,email', 'category'])
            ->latest()
            ->paginate(15);

        return response()->json($products);
    }

    // Approve Produk
    public function approve(Request $request, Product $product)
    {
        $this->authorizeAdmin($request);

        $product->update(['status' => 'approved']);

        return response()->json(['message' => 'Produk berhasil disetujui dan diterbitkan di katalog.']);
    }

    // Reject Produk
    public function reject(Request $request, Product $product)
    {
        $this->authorizeAdmin($request);

        $product->update(['status' => 'rejected']);

        return response()->json(['message' => 'Produk ditolak.']);
    }

    // Helper Validasi Role Admin - Pengecekan konsisten via properti role
    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses Admin ditolak.');
        }
    }
}