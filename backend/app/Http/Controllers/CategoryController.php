<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::with(['products' => function ($query) {
                $query->where('status', 'approved')->limit(4);
            }])->get()
        );
    }

    // Admin: Buat Kategori Baru
    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json($category, 201);
    }

    // Admin: Edit / Update Kategori
    public function update(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json([
            'message'  => 'Kategori berhasil diperbarui.',
            'category' => $category,
        ]);
    }

    // Admin: Hapus Kategori
    public function destroy(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        // FIX SECURITY: Cegah penghapusan jika kategori masih digunakan oleh produk
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Kategori tidak dapat dihapus karena masih digunakan oleh produk.'
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }

    // Helper Validasi Role Admin - Pengecekan konsisten via properti role
    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (! $user || $user->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat mengelola kategori.');
        }
    }
}