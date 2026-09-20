<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    // Lihat isi cart
    public function index(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load('items.product');

        return response()->json($cart);
    }

    // Tambah produk ke cart
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty'        => 'nullable|integer|min:1|max:100',
            'size'       => 'nullable|string|max:50', // Dibatasi max 50 karakter untuk keamanan
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Cegah produk tanpa file digital masuk ke cart
        if (empty($product->file_path)) {
            return response()->json([
                'message' => 'Produk ini belum memiliki file digital dan belum bisa ditambahkan ke keranjang.',
            ], 422);
        }

        $qtyToAdd = $validated['qty'] ?? 1;
        $size = isset($validated['size']) ? trim(strip_tags($validated['size'])) : null;

        $cartItem = DB::transaction(function () use ($request, $product, $qtyToAdd, $size) {
            $cart = $this->getOrCreateCart($request);

            // Cari item berdasarkan product_id DAN size
            $item = $cart->items()
                ->where('product_id', $product->id)
                ->where('size', $size)
                ->lockForUpdate()
                ->first();

            if ($item) {
                $item->increment('qty', $qtyToAdd);
            } else {
                $item = $cart->items()->create([
                    'product_id' => $product->id,
                    'qty'        => $qtyToAdd,
                    'size'       => $size,
                ]);
            }

            return $item;
        });

        return response()->json($cartItem->load('product'), 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'qty'      => 'nullable|integer|min:1|max:100',
            'quantity' => 'nullable|integer|min:1|max:100',
        ]);

        $newQty = $validated['qty'] ?? $validated['quantity'] ?? null;

        if (!$newQty) {
            return response()->json(['message' => 'Jumlah (qty) wajib diisi.'], 422);
        }

        $userId = $request->user()->id;

        // Cari item berdasarkan ID dan milik user yang sedang login
        $cartItem = CartItem::whereHas('cart', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->findOrFail($id);

        // Update kolom 'qty' di tabel cart_items
        $cartItem->update([
            'qty' => $newQty,
        ]);

        return response()->json([
            'message' => 'Jumlah produk berhasil diperbarui',
            'data'    => $cartItem
        ]);
    }

    // Hapus item dari cart
    public function destroy(Request $request, $itemId)
    {
        $cart = $this->getOrCreateCart($request);

        $item = $cart->items()->where('id', $itemId)->firstOrFail();
        $item->delete();

        return response()->json(['message' => 'Item dihapus dari cart.']);
    }

    private function getOrCreateCart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }
}