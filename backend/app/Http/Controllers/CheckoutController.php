<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;

class CheckoutController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input Keduanya (Direct maupun Cart Checkout)
        $validated = $request->validate([
            'product_id' => 'nullable|integer|exists:products,id',
            'qty'        => 'nullable|integer|min:1|max:100',
            'quantity'   => 'nullable|integer|min:1|max:100',
            'size'       => 'nullable|string|max:50',
            'variant'    => 'nullable|string|max:50',
        ]);

        try {
            // -------------------------------------------------------------
            // 1. OPSI A: BELI LANGSUNG (Direct Checkout via tombol Beli)
            // -------------------------------------------------------------
            if (!empty($validated['product_id'])) {
                $qty = (int) ($validated['qty'] ?? $validated['quantity'] ?? 1);
                $size = $validated['size'] ?? $validated['variant'] ?? null;

                $order = DB::transaction(function () use ($request, $validated, $qty, $size) {
                    // Lock baris produk di DB untuk mencegah race condition
                    $product = Product::where('id', $validated['product_id'])
                        ->lockForUpdate()
                        ->firstOrFail();

                    // FIX SECURITY: Murni ambil harga dari DB (Cegah Price Manipulation oleh client)
                    $itemPrice = (float) $product->price;

                    // Cegah jika file digital kosong
                    if (empty($product->file_path)) {
                        throw new \Exception('Produk ini belum memiliki file digital dan tidak dapat dibeli saat ini.', 422);
                    }

                    // Validasi Stok Produk
                    if ($product->stock < $qty) {
                        throw new \Exception("Stok produk tidak mencukupi. Stok tersisa: {$product->stock}", 422);
                    }

                    $order = Order::create([
                        'user_id'     => $request->user()->id,
                        'total'       => $itemPrice * $qty,
                        'status'      => 'pending',
                        'payment_ref' => 'ORDER-' . Str::upper(Str::random(10)),
                    ]);

                    $order->items()->create([
                        'product_id' => $product->id,
                        'price'      => $itemPrice,
                        'quantity'   => $qty,
                        'qty'        => $qty,
                        'size'       => $size,
                    ]);

                    // Kurangi stok produk secara atomic
                    $product->decrement('stock', $qty);

                    return $order;
                });

            // -------------------------------------------------------------
            // 2. OPSI B: CHECKOUT DARI CART (Keranjang Belanja)
            // -------------------------------------------------------------
            } else {
                $order = DB::transaction(function () use ($request) {
                    $cart = Cart::where('user_id', $request->user()->id)->first();

                    if (!$cart) {
                        throw new \Exception('Cart kosong, tidak bisa checkout.', 400);
                    }

                    // Ambil cart items dan KUNCI baris produk terkait di DB
                    $cartItems = $cart->items()->with(['product' => function ($query) {
                        $query->lockForUpdate();
                    }])->get();

                    if ($cartItems->isEmpty()) {
                        throw new \Exception('Cart kosong, tidak bisa checkout.', 400);
                    }

                    // Validasi file digital & stok untuk setiap item di dalam lock
                    foreach ($cartItems as $item) {
                        $itemQty = $item->qty ?? $item->quantity ?? 1;

                        if (empty($item->product->file_path)) {
                            throw new \Exception("Produk \"{$item->product->name}\" belum memiliki file digital, mohon hapus dari keranjang sebelum checkout.", 422);
                        }

                        if ($item->product->stock < $itemQty) {
                            throw new \Exception("Stok produk \"{$item->product->name}\" tidak mencukupi (Tersisa: {$item->product->stock}).", 422);
                        }
                    }

                    // FIX SECURITY: Murni ambil harga asli dari DB
                    $total = $cartItems->sum(fn ($item) => $item->product->price * ($item->qty ?? $item->quantity ?? 1));

                    $order = Order::create([
                        'user_id'     => $request->user()->id,
                        'total'       => $total,
                        'status'      => 'pending',
                        'payment_ref' => 'ORDER-' . Str::upper(Str::random(10)),
                    ]);

                    foreach ($cartItems as $item) {
                        $itemQty = $item->qty ?? $item->quantity ?? 1;
                        $itemSize = $item->size ?? $item->variant ?? null;

                        $order->items()->create([
                            'product_id' => $item->product_id,
                            'price'      => $item->product->price,
                            'quantity'   => $itemQty,
                            'qty'        => $itemQty,
                            'size'       => $itemSize,
                        ]);

                        // Kurangi stok masing-masing produk
                        $item->product->decrement('stock', $itemQty);
                    }

                    // Hapus isi keranjang setelah transaksi selesai
                    $cart->items()->delete();

                    return $order;
                });
            }

            // -------------------------------------------------------------
            // 3. GENERATE MIDTRANS SNAP TOKEN
            // -------------------------------------------------------------
            $snapToken = Snap::getSnapToken([
                'transaction_details' => [
                    'order_id'     => $order->payment_ref,
                    'gross_amount' => (int) $order->total,
                ],
                'customer_details' => [
                    'first_name' => $request->user()->name,
                    'email'      => $request->user()->email,
                ],
            ]);

            return response()->json([
                'message'    => 'Pesanan berhasil dibuat',
                'order'      => $order->load('items.product'),
                'snap_token' => $snapToken,
            ], 201);

        } catch (\Exception $e) {
            $status = in_array($e->getCode(), [400, 422]) ? $e->getCode() : 422;
            $message = in_array($e->getCode(), [400, 422]) ? $e->getMessage() : 'Gagal memproses checkout.';
            return response()->json(['message' => $message], $status);
        }
    }

    public function myOrders(Request $request)
    {
        return response()->json(
            $request->user()->orders()
                ->where('status', 'paid')
                ->with('items.product', 'items.download')
                ->latest()
                ->get()
        );
    }
}