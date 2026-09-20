<?php

namespace App\Http\Controllers;

use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class DownloadController extends Controller
{
    public function download(Request $request, string $token)
    {
        // 1. Gunakan eager loading agar relasi langsung terbaca dalam 1 query (tambahkan relasi user & order)
        $download = Download::with(['orderItem.product', 'user', 'orderItem.order'])
            ->where('download_token', $token)
            ->first();

        if (! $download) {
            abort(404, 'Link download tidak ditemukan.');
        }

        if ($download->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke file ini.');
        }

        if ($download->isExpired()) {
            abort(410, 'Link download sudah kadaluarsa.');
        }

        $orderItem = $download->orderItem;
        $product   = $orderItem?->product;

        if (! $product) {
            abort(404, 'Data produk tidak ditemukan.');
        }

        // 2. Catat riwayat berapa kali file telah diunduh
        $download->increment('download_count');

        // 3. Persiapan data untuk Struk / Invoice PDF
        $data = [
            'order_ref'      => $download->order_ref ?? ($orderItem->order->order_ref ?? 'TRX-' . $download->id),
            'user_name'      => $download->user->name ?? $request->user()->name,
            'user_email'     => $download->user->email ?? $request->user()->email,
            'product_name'   => $product->name,
            'variant'        => $orderItem->size ?? null,
            'price'          => $orderItem->price ?? $product->price,
            'date'           => $download->created_at ? $download->created_at->format('d M Y, H:i') : date('d M Y, H:i'),
            'download_token' => $download->download_token,
        ];

        // 4. Generate PDF Struk secara dinamis
        $pdf = Pdf::loadView('pdf.receipt', $data);

        // Formatting nama file yang aman dari karakter aneh
        $filename = 'Struk_' . Str::slug($product->name) . '.pdf';

        return $pdf->download($filename);
    }

    // List semua download yang dimiliki user (untuk halaman "Riwayat Pembelian")
    public function myDownloads(Request $request)
    {
        $downloads = Download::where('user_id', $request->user()->id)
            ->with('orderItem.product')
            ->latest()
            ->get();

        return response()->json($downloads);
    }
}