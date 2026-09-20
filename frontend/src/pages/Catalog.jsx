import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import ProductCard from '../components/ProductCard';
import { decryptParam } from '../utils/cryptoUrl';

function CatalogCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 animate-pulse">
      <div className="aspect-square w-full bg-stone-200 rounded-xl mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-3/4 bg-stone-200 rounded" />
        <div className="h-3 w-full bg-stone-200 rounded" />
        <div className="h-3 w-1/2 bg-stone-200 rounded" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="h-4 w-20 bg-stone-200 rounded" />
        <div className="h-9 w-20 bg-stone-200 rounded-lg" />
      </div>
    </div>
  );
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const qParam = searchParams.get('q');
  const decryptedData = qParam ? decryptParam(qParam) : null;
  const categoryParam = searchParams.get('category') || (decryptedData?.category ? String(decryptedData.category) : '');

  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const sortBy = searchParams.get('sort') || 'Terbaru';
  const currentPage = Number(searchParams.get('page') || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const updateParams = (updates, resetPage = true) => {
    const params = new URLSearchParams(searchParams);
    if ('category' in updates) {
      params.delete('q');
    }
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (resetPage) params.delete('page');
    setSearchParams(params);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data || res.data || []))
      .catch((err) => console.error('Gagal mengambil kategori:', err));
  }, []);

  const matchedCategory = categoryParam
    ? categories.find(
        (c) =>
          String(c.id) === categoryParam ||
          c.name.toLowerCase() === categoryParam.toLowerCase() ||
          c.name.toLowerCase().includes(categoryParam.toLowerCase()) ||
          categoryParam.toLowerCase().includes(c.name.toLowerCase())
      )
    : null;

  const activeCategoryName = matchedCategory?.name || (categoryParam && isNaN(Number(categoryParam)) ? categoryParam : null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryParam) {
          params.category_id = matchedCategory ? matchedCategory.id : categoryParam;
        }
        if (search) params.search = search;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        params.page = currentPage;

        const res = await api.get('/products', { params });
        const payload = res.data;

        const list = payload.data || [];
        const sorted = [...list].sort((a, b) => {
          if (sortBy === 'Murah') return Number(a.price) - Number(b.price);
          if (sortBy === 'Mahal') return Number(b.price) - Number(a.price);
          return 0;
        });

        setProducts(sorted);
        setMeta({
          current_page: payload.current_page || 1,
          last_page: payload.last_page || 1,
          total: payload.total ?? list.length,
        });
      } catch (err) {
        console.error('Gagal mengambil data katalog:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, matchedCategory, search, minPrice, maxPrice, sortBy, currentPage]);

  const handleBuy = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBuyingId(product.id);
    try {
      // Keamanan: Jangan kirim harga dari frontend untuk mencegah manipulasi
      const response = await api.post('/checkout', { 
        product_id: product.id,
        qty: 1,
        size: product.selectedSize || product.size || null
      });
      
      const { snap_token } = response.data;

      if (window.snap && snap_token) {
        window.snap.pay(snap_token, {
          onSuccess: function () {
            showToast('Pembayaran berhasil! Mengarahkan ke halaman Pesanan Saya...');
            setTimeout(() => { navigate('/orders'); }, 1200);
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
      showToast(err.response?.data?.message || 'Gagal melakukan checkout.', 'error');
    } finally {
      setBuyingId(null);
    }
  };

  const handleAddToCart = async (product, size = null) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingId(product.id);
    try {
      await api.post('/cart', { 
        product_id: product.id, 
        qty: 1,
        size: size || product.selectedSize || product.size || null
      });
      showToast(`"${product.name}" ditambahkan ke keranjang.`);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan ke keranjang.', 'error');
    } finally {
      setAddingId(null);
    }
  };

  const handleCategoryChange = (cat) => {
    const isSelected = matchedCategory?.id === cat.id;
    updateParams({ category: isSelected ? '' : cat.name });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handleApplyPriceFilter = () => {
    updateParams({ min_price: minPriceInput, max_price: maxPriceInput });
  };

  const handleResetFilter = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSelectedMaterial('');
    setSearchParams(new URLSearchParams());
  };

  const goToPage = (page) => {
    const target = Math.min(Math.max(1, page), meta.last_page || 1);
    updateParams({ page: target }, false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-8 gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
              KOLEKSI EKSKLUSIF
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-stone-900 leading-tight">
              {activeCategoryName || 'Koleksi Megah'}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium">
              Urutkan:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => updateParams({ sort: e.target.value }, false)}
                className="appearance-none bg-white border border-stone-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer shadow-xs transition-all min-w-140px"
              >
                <option value="Terbaru">Terbaru</option>
                <option value="Murah">Harga Terendah</option>
                <option value="Mahal">Harga Tertinggi</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                <svg className="fill-current h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-editorial text-2xl font-normal text-stone-900 tracking-tight">Filter Produk</h2>
              </div>

              <form onSubmit={handleSearchSubmit}>
                <label htmlFor="search-input" className="font-bold text-[11px] uppercase tracking-wider text-stone-400 mb-2.5 block">
                  Cari
                </label>
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Nama produk..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                  />
                </div>
              </form>

              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-stone-400 mb-2.5">Kategori</h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => {
                      const isChecked = matchedCategory?.id === cat.id;

                      return (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer text-xs text-stone-700 hover:text-stone-900 font-medium">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryChange(cat)}
                            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 accent-stone-900 cursor-pointer"
                          />
                          <span>{cat.name}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="space-y-2 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-stone-200/80 rounded w-3/4" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-stone-400 mb-2.5">Harga (IDR)</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    aria-label="Harga Minimum"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                  />
                  <span className="text-stone-300">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    aria-label="Harga Maksimum"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-stone-400 mb-2.5">Material</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Linen', 'Wol', 'Katun Organik', 'Sutra'].map((material) => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => setSelectedMaterial(material === selectedMaterial ? '' : material)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                        selectedMaterial === material
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleApplyPriceFilter}
                  className="w-full py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-xs"
                >
                  Terapkan Filter
                </button>

                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="w-full py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all bg-white"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CatalogCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-stone-300 rounded-2xl p-8">
                <p className="text-sm font-medium text-stone-700 mb-1">
                  Belum ada produk pada kategori{activeCategoryName ? ` "${activeCategoryName}"` : ' ini'}.
                </p>
                <p className="text-xs text-stone-400 font-light">Coba pilih kategori lain atau reset filter pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuy={handleBuy}
                    addingId={addingId}
                    buyingId={buyingId}
                  />
                ))}
              </div>
            )}

            {meta.last_page > 1 && (
              <nav aria-label="Navigasi Paginasi Katalog" className="flex items-center justify-center gap-2 mt-12 mb-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label="Halaman sebelumnya"
                  className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-xl text-stone-600 hover:border-stone-900 hover:text-stone-900 transition text-xs disabled:opacity-30 disabled:pointer-events-none bg-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-label={`Ke halaman ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition ${
                      currentPage === page
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= meta.last_page}
                  aria-label="Halaman selanjutnya"
                  className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-xl text-stone-600 hover:border-stone-900 hover:text-stone-900 transition text-xs disabled:opacity-30 disabled:pointer-events-none bg-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>

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