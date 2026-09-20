import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const formatIDR = (price) => {
  const numericPrice = Number(price) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const normalizeStatus = (status) => {
  const s = (status || '').toLowerCase();
  if (['paid', 'settlement', 'success', 'berhasil', 'capture'].includes(s)) return 'PAID';
  if (['failed', 'expire', 'cancel', 'gagal', 'deny'].includes(s)) return 'FAILED';
  return 'PENDING';
};

// Skeleton Loading Presisi Menyerupai Kartu Pesanan Asli
function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 animate-pulse">
      {/* Header Order Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-stone-200 rounded" />
          <div className="h-6 w-28 bg-stone-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-stone-200 rounded-full" />
      </div>

      {/* Timeline Skeleton */}
      <div className="py-4 px-4 bg-stone-50/80 rounded-xl border border-stone-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center space-y-2">
              <div className="w-7 h-7 rounded-full bg-stone-200" />
              <div className="h-3 w-16 bg-stone-200 rounded" />
              <div className="h-2.5 w-12 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Items List Skeleton */}
      <div className="space-y-3 border-t border-stone-100 pt-4">
        {[1, 2].map((item) => (
          <div key={item} className="flex items-center justify-between text-sm py-1 border-b border-stone-50 last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="h-4 w-36 bg-stone-200 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-stone-200 rounded" />
                <div className="h-4 w-20 bg-stone-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        const data = res.data.data || res.data;
        if (isMounted.current) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Gagal mengambil riwayat pesanan:', err);
        if (isMounted.current) {
          setOrders([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // IntersectionObserver untuk Animasi Scroll Halus
  useEffect(() => {
    if (loading) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, currentPage, orders]);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const totalPages = Math.ceil(safeOrders.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, totalPages || 1);

  const displayedOrders = safeOrders.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] font-['Plus_Jakarta_Sans',sans-serif] antialiased py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
      `}</style>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-stone-200/80 pb-6 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
            <h1 className="font-editorial text-4xl sm:text-5xl text-stone-900 leading-tight">
              Riwayat Pembelian
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <OrderCardSkeleton key={n} />
            ))}
          </div>
        ) : safeOrders.length === 0 ? (
          <section className="bg-white border border-dashed border-stone-300 rounded-2xl p-12 text-center text-stone-500 max-w-md mx-auto reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <h2 className="font-editorial text-2xl text-stone-900 mb-2">Belum Ada Pesanan</h2>
            <p className="text-xs text-stone-500 font-light mb-6">
              Anda belum memiliki riwayat pesanan.
            </p>
            <Link
              to="/catalog"
              className="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl uppercase tracking-wider hover:bg-black transition"
            >
              Mulai Belanja
            </Link>
          </section>
        ) : (
          <section className="space-y-6" aria-label="Daftar Pesanan">
            {displayedOrders.map((order) => {
              const statusState = normalizeStatus(order.status);
              const checkoutTime = formatDateTime(order.created_at);
              const updateTime = formatDateTime(order.updated_at);

              return (
                <article
                  key={order.id}
                  className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 hover:border-stone-300 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out"
                >
                  {/* Header Order */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <p className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                        Ref: {order.payment_ref || `ORDER-${order.id}`}
                      </p>
                      <h2 className="font-bold text-xl text-stone-900">{formatIDR(order.total)}</h2>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        statusState === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : statusState === 'FAILED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {statusState === 'PAID'
                        ? 'BERHASIL'
                        : statusState === 'FAILED'
                        ? 'GAGAL'
                        : 'PENDING'}
                    </span>
                  </div>

                  {/* Timeline Realtime Tracking */}
                  <div className="py-3 px-4 bg-stone-50/80 rounded-xl border border-stone-100">
                    <div className="grid grid-cols-3 gap-2 text-center relative">
                      <div className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                            statusState === 'PENDING' || statusState === 'PAID'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          1
                        </div>
                        <span className="text-[11px] font-semibold text-stone-800">
                          Pesanan Dibuat
                        </span>
                        <span className="text-[10px] font-medium text-stone-500">
                          {checkoutTime || 'Waktu Checkout'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                            statusState === 'PAID'
                              ? 'bg-emerald-600 text-white'
                              : statusState === 'PENDING'
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          2
                        </div>
                        <span className="text-[11px] font-semibold text-stone-800">
                          Konfirmasi Pembayaran
                        </span>
                        <span className="text-[10px] font-medium text-stone-500">
                          {statusState === 'PAID'
                            ? (updateTime || 'Lunas / Verified')
                            : statusState === 'PENDING'
                            ? 'Proses Verifikasi'
                            : 'Gagal'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                            statusState === 'PAID'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          3
                        </div>
                        <span className="text-[11px] font-semibold text-stone-800">
                          Pesanan Selesai
                        </span>
                        <span className="text-[10px] font-medium text-stone-500">
                          {statusState === 'PAID' ? 'Akses Digital Aktif' : 'Menunggu Lunas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Items List */}
                  <div className="space-y-3 border-t border-stone-100 pt-4">
                    {order.items?.map((item) => {
                      const itemPrice = Number(item.price) || 0;
                      const itemQuantity = Number(item.quantity) || 1;

                      return (
                        <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b border-stone-50 last:border-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-medium text-stone-800">
                              {item.product?.name || item.product_name || 'Produk'}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {/* Ukuran Produk */}
                              {item.size && (
                                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded border border-stone-200">
                                  Ukuran: {item.size}
                                </span>
                              )}

                              {/* Jumlah Produk (Quantity) */}
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded border border-stone-200">
                                Quantity: {itemQuantity}x
                              </span>
                            </div>
                          </div>

                          <span className="font-semibold text-stone-700">
                            {formatIDR(itemPrice * itemQuantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Link for Paid Orders */}
                  {statusState === 'PAID' && (
                    <div className="mt-4 pt-3 border-t border-stone-100 text-right">
                      <Link
                        to="/my-downloads"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:underline"
                      >
                        Lihat File Unduhan →
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}

            {/* Navigasi Paginasi */}
            {totalPages > 1 && (
              <nav aria-label="Paginasi Pesanan" className="flex items-center justify-center gap-2 pt-8 mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={activePage === 1}
                  aria-label="Halaman Sebelumnya"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Ke halaman ${page}`}
                    aria-current={activePage === page ? 'page' : undefined}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition ${
                      activePage === page
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={activePage === totalPages}
                  aria-label="Halaman Selanjutnya"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Selanjutnya
                </button>
              </nav>
            )}
          </section>
        )}
      </main>
    </div>
  );
}