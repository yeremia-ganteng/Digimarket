<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        // Validasi: Apakah user ini sudah pernah membeli produk dan berstatus PAID?
        $hasPurchased = Order::where('user_id', $userId)
            ->where('status', 'paid')
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'Anda harus membeli produk ini terlebih dahulu sebelum memberikan ulasan.'
            ], 403);
        }

        // Simpan / Update Review secara aman
        $review = Review::updateOrCreate(
            [
                'product_id' => $product->id, 
                'user_id'    => $userId
            ],
            [
                'rating'  => $validated['rating'], 
                'comment' => $validated['comment'] ?? null
            ]
        );

        return response()->json([
            'message' => 'Ulasan berhasil disimpan.',
            'review'  => $review
        ]);
    }
}