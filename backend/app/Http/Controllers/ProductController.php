<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Buyer & Admin: browse katalog produk
    public function index(Request $request)
    {
        $query = Product::with(['seller:id,name', 'category']);

        // FIX SECURITY: Hanya Admin yang boleh menggunakan parameter ?all=true
        $user = auth('sanctum')->user();
        if ($request->boolean('all') && $user && $user->role === 'admin') {
            // Admin bisa melihat semua status produk
        } else {
            // Buyer & Publik (default): hanya produk approved
            $query->where('status', 'approved');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $query->latest();

        if ($request->boolean('no_paginate')) {
            return response()->json($query->get());
        }

        $perPage = (int) $request->input('per_page', 6);
        $perPage = max(1, min($perPage, 200));

        return response()->json($query->paginate($perPage));
    }

    // Buyer: lihat detail 1 produk
    public function show(Product $product)
    {
        $user = auth('sanctum')->user();
        $isSellerOwner = $user && $user->id === $product->seller_id;
        $isAdmin = $user && $user->role === 'admin';

        // Hanya tampilkan detail jika status sudah approved, milik seller itu sendiri, atau diakses Admin
        if ($product->status !== 'approved' && !$isSellerOwner && !$isAdmin) {
            abort(404, 'Produk tidak ditemukan atau belum disetujui.');
        }

        $product->load(['seller:id,name', 'category', 'reviews.user:id,name,avatar']);
        $product->average_rating = $product->averageRating();

        return response()->json($product);
    }

    private function decodeSizesInput(Request $request): void
    {
        if ($request->has('sizes') && is_string($request->sizes)) {
            $decoded = json_decode($request->sizes, true);
            $request->merge(['sizes' => is_array($decoded) ? $decoded : null]);
        }
    }

    // Seller & Admin: buat produk baru
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'seller' && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk menambah produk.'
            ], 403);
        }

        $this->decodeSizesInput($request);

        // FIX SECURITY: Restriksi mimes file & thumbnail
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'sizes'       => 'nullable|array',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file'        => 'nullable|file|mimes:zip,rar,pdf,epub,mp3,mp4|max:51200',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('products', 'local');
        }

        $product = Product::create([
            'seller_id'   => $user->id,
            'category_id' => $validated['category_id'],
            'name'        => $validated['name'],
            'slug'        => Str::slug($validated['name']) . '-' . uniqid(),
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'stock'       => $validated['stock'],
            'sizes'       => $validated['sizes'] ?? null,
            'thumbnail'   => $thumbnailPath,
            'file_path'   => $filePath,
            'status'      => ($user->role === 'admin') ? 'approved' : 'pending',
        ]);

        return response()->json($product, 201);
    }

    // Seller & Admin: edit produk
    public function update(Request $request, Product $product)
    {
        $this->authorizeOwner($request, $product);
        $user = $request->user();

        $this->decodeSizesInput($request);

        // FIX SECURITY: Restriksi mimes file & thumbnail
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'sizes'       => 'nullable|array',
            'status'      => 'nullable|in:approved,pending,rejected,active',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file'        => 'nullable|file|mimes:zip,rar,pdf,epub,mp3,mp4|max:51200',
        ]);

        // FIX SECURITY: Cegah Seller biasa mengubah status approval produk milik mereka
        if ($user->role !== 'admin') {
            unset($validated['status']);
        }

        // 1. Update Thumbnail jika ada file baru diunggah
        if ($request->hasFile('thumbnail')) {
            if ($product->thumbnail) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // 2. Update File Digital jika ada file baru diunggah
        if ($request->hasFile('file')) {
            if ($product->file_path) {
                Storage::disk('local')->delete($product->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('products', 'local');
        }

        // 3. Update Slug jika nama berubah
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'product' => $product
        ]);
    }

    // Admin: hapus produk beserta file fisiknya
    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat menghapus produk.');
        }

        if ($product->thumbnail) {
            Storage::disk('public')->delete($product->thumbnail);
        }
        if ($product->file_path) {
            Storage::disk('local')->delete($product->file_path);
        }
        $product->delete();

        return response()->json(['message' => 'Produk dan file terkait berhasil dihapus.']);
    }

    // Seller: lihat produk miliknya sendiri (semua status)
    public function myProducts(Request $request)
    {
        $this->authorizeSeller($request);

        return response()->json(
            $request->user()->products()->with('category')->latest()->get()
        );
    }

    private function authorizeSeller(Request $request): void
    {
        if ($request->user()->role !== 'seller') {
            abort(403, 'Hanya seller yang bisa melakukan aksi ini.');
        }
    }

    private function authorizeOwner(Request $request, Product $product): void
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        if ($product->seller_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke produk ini.');
        }
    }
}