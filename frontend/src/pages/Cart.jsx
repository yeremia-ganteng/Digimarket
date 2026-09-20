import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

// Fallback gambar lokal
const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12" font-family="sans-serif">No Image</text></svg>';

const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_PLACEHOLDER;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const cleanPath = imagePath.replace(/^\/?(storage\/)?/, '');
  return `${backendBaseUrl}/storage/${cleanPath}`;
};

// Helper untuk mengambil harga berdasarkan varian ukuran dari catalog/item keranjang
const getItemUnitPrice = (item) => {
  if (item.size_price !== undefined && item.size_price !== null) return Number(item.size_price);
  if (item.variant_price !== undefined && item.variant_price !== null) return Number(item.variant_price);

  const product = item.product || item;
  const selectedSize =
    item.size ||
    item.selected_size ||
    item.selectedSize ||
    item.variant ||
    item.variant_name ||
    item.options?.size ||
    item.product_variant?.size ||
    item.product_variant?.name ||
    product?.selected_size ||
    product?.size;

  const sizesList = product?.sizes || product?.variants;
  if (Array.isArray(sizesList) && selectedSize) {
    const foundVariant = sizesList.find((s) => {
      if (typeof s === 'object' && s !== null) {
        const sName = s.size || s.name || s.label;
        return String(sName).toLowerCase() === String(selectedSize).toLowerCase();
      }
      return false;
    });

    if (foundVariant && foundVariant.price !== undefined && foundVariant.price !== null) {
      return Number(foundVariant.price);
    }
  }

  if (item.price !== undefined && item.price !== null) return Number(item.price);
  if (product?.price !== undefined && product?.price !== null) return Number(product.price);
  return 0;
};

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-pulse">
      <div className="lg:col-span-8 space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 bg-stone-200 rounded" />
                <div className="h-5 w-44 bg-stone-200 rounded" />
                <div className="h-4 w-24 bg-stone-200 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0">
              <div className="h-8 w-24 bg-stone-200 rounded-xl" />
              <div className="h-4 w-20 bg-stone-200 rounded" />
              <div className="h-5 w-5 bg-stone-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <div className="h-6 w-40 bg-stone-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-stone-200 rounded" />
              <div className="h-4 w-20 bg-stone-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-stone-200 rounded" />
              <div className="h-4 w-24 bg-stone-200 rounded" />
            </div>
            <div className="border-t border-stone-100 pt-3 flex justify-between">
              <div className="h-5 w-16 bg-stone-200 rounded" />
              <div className="h-6 w-28 bg-stone-200 rounded" />
            </div>
          </div>
          <div className="h-11 w-full bg-stone-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    let isMounted = true;

    api
      .get('/cart')
      .then((res) => {
        if (!isMounted) return;
        const rawData = res.data?.data || res.data || [];
        const itemsList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.items)
          ? rawData.items
          : [];

        setCartItems(itemsList);
      })
      .catch(() => {
        if (!isMounted) return;
        showToast('Gagal memuat data keranjang.', 'error');
        setCartItems([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigate]);

  const handleUpdateQty = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    const itemToUpdate = cartItems.find((i) => i.id === itemId);
    const product = itemToUpdate?.product || itemToUpdate;
    if (delta > 0 && product?.stock !== undefined && product?.stock !== null && newQty > product.stock) {
      showToast(`Stok tidak mencukupi (Tersedia: ${product.stock})`, 'error');
      return;
    }

    setUpdatingId(itemId);
    try {
      await api.put(`/cart/${itemId}`, { qty: newQty });
      setCartItems((prev) =>
        (prev || []).map((item) => (item.id === itemId ? { ...item, qty: newQty } : item))
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui kuantitas.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setDeletingId(itemId);
    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems((prev) => (prev || []).filter((item) => item.id !== itemId));
      showToast('Produk dihapus dari keranjang.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus produk.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((acc, item) => {
      const price = getItemUnitPrice(item);
      const qty = Number(item.qty || 1);
      return acc + price * qty;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      const response = await api.post('/checkout');
      const { snap_token } = response.data;

      if (window.snap && snap_token) {
        window.snap.pay(snap_token, {
          onSuccess: function () {
            showToast('Pembayaran berhasil! Mengarahkan ke Pesanan Saya...');
            setTimeout(() => {
              navigate('/orders');
            }, 1200);
          },
          onPending: function () {
            showToast('Menunggu pembayaran Anda.', 'pending');
          },
          onError: function () {
            showToast('Pembayaran gagal, silakan coba lagi.', 'error');
          },
        });
      } else {
        showToast('Script Midtrans belum siap. Silakan muat ulang halaman.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memproses checkout.', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.min(Math.ceil(safeCartItems.length / itemsPerPage), 2));
  const activePage = Math.min(currentPage, totalPages);

  const displayedCartItems = safeCartItems.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const subtotal = calculateSubtotal();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <header className="border-b border-stone-200/80 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            PESANAN ANDA
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-stone-900 leading-tight">
            Keranjang Belanja
          </h1>
        </header>

        {loading ? (
          <CartSkeleton />
        ) : safeCartItems.length === 0 ? (
          <section className="text-center py-24 bg-white border border-dashed border-stone-300 rounded-2xl p-8 max-w-xl mx-auto">
            <svg
              className="w-16 h-16 text-stone-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="font-editorial text-2xl text-stone-900 font-medium mb-2">
              Keranjang Anda Masih Kosong
            </h2>
            <p className="text-xs text-stone-500 font-light mb-6">
              Jelajahi koleksi busana eksklusif kami dan temukan pilihan favorit Anda.
            </p>
            <Link
              to="/catalog"
              className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition shadow-xs"
            >
              Eksplorasi Katalog
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-8 space-y-4">
              {displayedCartItems.map((item) => {
                const product = item.product || item;
                const price = getItemUnitPrice(item);

                const selectedSize =
                  item.size ||
                  item.selected_size ||
                  item.selectedSize ||
                  item.variant ||
                  item.variant_name ||
                  item.options?.size ||
                  item.product_variant?.size ||
                  item.product_variant?.name ||
                  product?.selected_size ||
                  product?.size;

                const stock =
                  product.stock !== undefined && product.stock !== null ? Number(product.stock) : null;

                return (
                  <article
                    key={item.id}
                    className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={getImageUrl(
                          product.thumbnail || product.image_path || product.image_url || product.image
                        )}
                        alt={product.name || 'Produk Keranjang'}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PLACEHOLDER;
                        }}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-stone-100 shrink-0"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                          {product.category?.name || 'Produk'}
                        </span>
                        <h3 className="font-editorial text-xl font-semibold text-stone-900 leading-snug">
                          {product.name}
                        </h3>

                        {/* BADGE UKURAN TERPILIH */}
                        <div className="flex items-center gap-2 mt-1 mb-1">
                          {selectedSize ? (
                            <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-bold rounded-md border border-stone-200 uppercase tracking-wider">
                              Ukuran: {selectedSize}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 italic">Tanpa Ukuran</span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-stone-600">
                          {formatRupiah(price)}
                        </p>
                        {stock !== null && (
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            Stok: {stock}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50/50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, item.qty, -1)}
                          disabled={item.qty <= 1 || updatingId === item.id}
                          aria-label="Kurangi kuantitas"
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-stone-900">
                          {updatingId === item.id ? '...' : item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, item.qty, 1)}
                          disabled={updatingId === item.id || (stock !== null && item.qty >= stock)}
                          aria-label="Tambah kuantitas"
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 transition"
                          title={stock !== null && item.qty >= stock ? 'Stok maksimum tercapai' : ''}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-100px">
                        <p className="text-xs font-bold text-stone-900">
                          {formatRupiah(price * item.qty)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={deletingId === item.id}
                        aria-label="Hapus produk dari keranjang"
                        className="text-stone-400 hover:text-rose-600 transition p-1"
                        title="Hapus Produk"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}

              {totalPages > 1 && (
                <nav aria-label="Navigasi Halaman Keranjang" className="flex items-center justify-center gap-2 pt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition ${
                        activePage === page
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              )}
            </section>

            <aside className="lg:col-span-4">
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6 sticky top-20">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="font-editorial text-2xl font-normal text-stone-900 tracking-tight">
                    Ringkasan Pesanan
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-stone-900">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Estimasi Pengiriman</span>
                    <span className="text-stone-400 italic">Dihitung saat checkout</span>
                  </div>
                  <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-900">Total</span>
                    <span className="font-bold text-stone-900 text-lg">{formatRupiah(subtotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || safeCartItems.length === 0}
                  className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <span>Memproses...</span>
                  ) : (
                    <span>Lanjut ke Pembayaran</span>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/catalog"
                    className="text-xs text-stone-500 hover:text-stone-900 transition font-medium inline-flex items-center gap-1"
                  >
                    <span>← Tambah Produk Lain</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {toast.show && (
        <div className="fixed bottom-24 right-6 z-50">
          <div
            role="alert"
            className={`px-5 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'pending'
                ? 'bg-amber-800 text-white border-amber-700'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'error'
                  ? 'bg-rose-400'
                  : toast.type === 'pending'
                  ? 'bg-amber-300'
                  : 'bg-emerald-400'
              }`}
            ></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}