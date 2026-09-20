import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const formatIDR = (price) => {
  if (price === undefined || price === null) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Sanitasi URL Gambar untuk Mencegah XSS (e.g. javascript:alert(1))
const getThumbnailUrl = (path) => {
  const fallback = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop';
  if (!path) return fallback;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Tangani jika ada attempt skema javascript atau data URI yang mencurigakan
  if (/^(javascript|data|vbscript):/i.test(path)) {
    return fallback;
  }

  const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '').replace(/^public\//, '');
  const rawBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';
  return `${rawBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
};

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.363 1.118l1.287 3.957c.299.922-.756 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
    </svg>
  );
}

function CartIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.502-7.148a1.125 1.125 0 00-1.11-1.334H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-stone-200 rounded" />
        <div className="h-4 w-3/4 bg-stone-200 rounded" />
        <div className="h-3 w-full bg-stone-200 rounded" />
        <div className="h-3 w-2/3 bg-stone-200 rounded" />
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="h-4 w-20 bg-stone-200 rounded" />
          <div className="h-9 w-20 bg-stone-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <section className="animate-pulse">
        <div className="h-10 sm:h-12 w-full max-w-2xl bg-stone-200 rounded mb-3" />
        <div className="h-10 sm:h-12 w-2/3 max-w-lg bg-stone-200 rounded mb-6" />
        <div className="h-4 w-full max-w-xl bg-stone-200 rounded mb-2" />
        <div className="h-4 w-2/3 max-w-md bg-stone-200 rounded mb-6" />
        <div className="flex gap-3">
          <div className="h-11 w-36 bg-stone-200 rounded-full" />
          <div className="h-11 w-32 bg-stone-200 rounded-full" />
        </div>
      </section>

      <section className="flex flex-wrap gap-2 -mt-8 animate-pulse">
        {[16, 24, 28, 20, 24].map((w, i) => (
          <div key={i} className="h-9 bg-stone-200 rounded-full" style={{ width: `${w * 4}px` }} />
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between mb-6 animate-pulse">
          <div>
            <div className="h-6 w-40 bg-stone-200 rounded mb-2" />
            <div className="h-3 w-64 bg-stone-200 rounded" />
          </div>
          <div className="h-4 w-20 bg-stone-200 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductGridCard({ product, onAddToCart }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const digitalKeywords = ['e-book', 'ebook', 'digital', 'template', 'panduan', 'kursus', 'software'];
  const isDigital = digitalKeywords.some((keyword) =>
    (product.category?.name || product.name || '').toLowerCase().includes(keyword)
  );

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post('/cart', { product_id: product.id, qty: 1 });
      window.dispatchEvent(new Event('cartUpdated'));
      
      if (isMounted.current) {
        setJustAdded(true);
        setTimeout(() => {
          if (isMounted.current) setJustAdded(false);
        }, 1500);
      }

      if (onAddToCart) {
        onAddToCart(`"${product.name}" berhasil ditambahkan ke keranjang!`, 'success');
      }
    } catch (error) {
      console.error('Gagal menambah ke keranjang:', error);
      if (onAddToCart) {
        onAddToCart('Gagal menambahkan produk ke keranjang', 'error');
      }
    } finally {
      if (isMounted.current) {
        setAddingToCart(false);
      }
    }
  };

  return (
    <article className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden group hover:shadow-lg flex flex-col reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={getThumbnailUrl(product.thumbnail)}
          alt={`Thumbnail ${product.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase text-stone-800">
          {isDigital ? 'Digital' : (product.category?.name || 'Eksklusif')}
        </span>
      </div>

      <div className="p-4 flex flex-col grow">
        {product.average_rating != null && (
          <div className="flex items-center gap-1 text-xs text-stone-600 mb-1.5">
            <StarIcon />
            <span className="font-semibold text-stone-900">{Number(product.average_rating).toFixed(1)}</span>
            {product.reviews_count != null && <span>({product.reviews_count})</span>}
          </div>
        )}

        <h3 className="font-semibold text-stone-900 text-sm line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 mb-3 grow">
          {product.description || 'Produk berkualitas dari seller terpercaya.'}
        </p>

        <div className="flex items-end justify-between pt-3 border-t border-stone-100">
          <div>
            {product.original_price && product.original_price > product.price && (
              <span className="block text-[11px] text-stone-400 line-through">
                {formatIDR(product.original_price)}
              </span>
            )}
            <span className="text-sm font-bold text-stone-900">
              {formatIDR(product.price)}
            </span>
          </div>

          {isDigital ? (
            <Link
              to={`/checkout?product_id=${product.id}`}
              className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
            >
              Beli
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                title="Tambah ke Keranjang"
                aria-label={`Tambah ${product.name} ke Keranjang`}
                className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border transition-all active:scale-95 disabled:opacity-50 ${
                  justAdded
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white text-stone-700'
                }`}
              >
                {addingToCart ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                ) : justAdded ? (
                  <CheckIcon />
                ) : (
                  <CartIcon />
                )}
              </button>
              <Link
                to={`/checkout?product_id=${product.id}`}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
              >
                Beli
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Marketplace() {
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    async function loadMarketplaceData() {
      try {
        const [bestSellersRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: { per_page: 8 } }),
          api.get('/categories'),
        ]);
        setBestSellers(bestSellersRes.data.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Gagal memuat data marketplace:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMarketplaceData();
  }, []);

  // Intersection Observer untuk Animasi Scroll Halus
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
  }, [loading, activeCategory, bestSellers]);

  const filteredProducts =
    activeCategory === 'all'
      ? bestSellers
      : bestSellers.filter((p) => p.category_id === activeCategory);

  if (loading) {
    return <MarketplaceSkeleton />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hero */}
      <section className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900 mb-4 max-w-2xl leading-tight">
          Pilihan Produk Berkualitas & Aset Digital
        </h1>
        <p className="text-stone-500 max-w-xl mb-6 leading-relaxed font-light text-sm sm:text-base">
          Platform jual beli terkurasi untuk produk fisik artisan dan aset digital kreator. Transparan, aman, dan langsung dikirim.
        </p>
        <div className="flex gap-3">
          <Link
            to="/catalog"
            className="px-5 py-3 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-full transition shadow-sm"
          >
            Jelajahi Produk
          </Link>
          <Link
            to="/catalog"
            className="px-5 py-3 border border-stone-300 hover:border-stone-900 text-stone-700 text-sm font-semibold rounded-full transition"
          >
            Lihat Promo
          </Link>
        </div>
      </section>

      {/* Kategori Pills */}
      <section aria-label="Filter Kategori Produk" className="flex flex-wrap gap-2 -mt-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
            activeCategory === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* Produk Terlaris */}
      <section>
        <div className="flex items-end justify-between mb-6 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900">Produk Terlaris</h2>
            <p className="text-sm text-stone-500 mt-1 font-light">Pilihan item fisik dan digital dengan penilaian tertinggi</p>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition shrink-0">
            Lihat Semua →
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-stone-500 text-sm py-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60">
            Belum ada produk untuk kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductGridCard key={product.id} product={product} onAddToCart={showToast} />
            ))}
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-24 right-6 z-50" role="status" aria-live="polite">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border text-sm flex items-center gap-3 transition-all duration-300 ${
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
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </main>
  );
}