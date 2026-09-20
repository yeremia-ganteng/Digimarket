<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;
use Illuminate\Support\Str;

class PaymentWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');

        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Invalid notification payload'], 400);
        }

        $statusCode = $notif->status_code;
        $grossAmount = $notif->gross_amount;
        $orderId = $notif->order_id;
        $serverKey = config('midtrans.server_key');
        $signatureKey = $notif->signature_key ?? $request->input('signature_key');

        // 1. HARDENING SECURITY: Verifikasi Signature Key SHA-512 Midtrans
        $localSignature = hash("sha512", $orderId . $statusCode . $grossAmount . $serverKey);
        if ($localSignature !== $signatureKey) {
            Log::warning("Midtrans Webhook Spoofing Attempt Detected on Order: {$orderId}");
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $transactionStatus = $notif->transaction_status;
        $fraudStatus = $notif->fraud_status;

        // 2. ATOMIC TRANSACTION: Gunakan lockForUpdate untuk mencegah Race Condition
        return DB::transaction(function () use ($orderId, $transactionStatus, $fraudStatus) {
            $order = Order::where('payment_ref', $orderId)
                ->lockForUpdate()
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Jika status sudah 'paid', hentikan proses (Idempotent)
            if (strtolower($order->status) === 'paid') {
                return response()->json(['status' => 'already_processed'], 200);
            }

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $this->markOrderAsPaid($order);
                }
            } else if ($transactionStatus == 'settlement') {
                $this->markOrderAsPaid($order);
            } else if (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
                $this->markOrderAsFailed($order);
            }

            return response()->json(['status' => 'success'], 200);
        });
    }

    private function markOrderAsPaid(Order $order)
    {
        $order->update(['status' => 'paid']);
        
        // Eager load items jika belum ter-load
        $order->loadMissing('items.download');

        foreach ($order->items as $item) {
            if (! $item->download) {
                $item->download()->create([
                    'user_id' => $order->user_id,
                    'download_token' => Str::random(40),
                ]);
            }
        }
    }

    private function markOrderAsFailed(Order $order)
    {
        // Pastikan hanya mengembalikan stok jika status sebelumnya BUKAN 'failed' dan BUKAN 'paid'
        if (!in_array(strtolower($order->status), ['failed', 'paid'])) {
            $order->loadMissing('items.product');

            // Pengembalian stok produk secara aman
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->qty ?? $item->quantity ?? 1);
                }
            }

            $order->update(['status' => 'failed']);
        }
    }
}