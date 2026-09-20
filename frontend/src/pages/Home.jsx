import { useState, useEffect,} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

// Skeleton Loader untuk Kategori (3 Item)
function CategorySkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200/60 animate-pulse">
      <div className="w-full aspect-4/5 bg-stone-200 rounded-t-2xl mb-4" />
      <div className="h-6 bg-stone-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-stone-200 rounded w-full mb-1" />
      <div className="h-3 bg-stone-200 rounded w-4/5 mb-4" />
      <div className="h-4 bg-stone-200 rounded w-1/3" />
    </div>
  );
}

// Skeleton Loader untuk Produk Unggulan (4 Item)
function ProductSkeleton() {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-4/5 w-full bg-stone-200 rounded-xl mb-4" />
        <div className="h-5 bg-stone-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-stone-200 rounded w-full mb-1" />
        <div className="h-3 bg-stone-200 rounded w-2/3 mb-4" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="h-5 bg-stone-200 rounded w-24" />
        <div className="h-8 bg-stone-200 rounded-lg w-16" />
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    {
      id: 'pria',
      name: 'Pakaian Pria',
      image: 'products/pakaian-pria.jpg',
      description: 'Koleksi busana pria elegan dengan bahan serat alami premium.'
    },
    {
      id: 'wanita',
      name: 'Pakaian Wanita',
      image: 'products/pakaian-wanita.jpg',
      description: 'Koleksi busana wanita modern dengan sentuhan estetika tinggi.'
    },
    {
      id: 'aksesoris',
      name: 'Aksesoris',
      image: 'products/aksesoris.jpg',
      description: 'Pelengkap gaya busana harian yang eksklusif.'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const formatRupiah = (price) => {
    if (!price) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop"
  ];

  const { user: storeUser } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data.data || prodRes.data || []);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userRes = await api.get('/user');
            setCurrentUser(userRes.data.data || userRes.data);
          } catch {
            console.log('Guest mode / Token expired');
          }
        }
      } catch (err) {
        console.error('Gagal mengambil data dari database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer untuk Animasi Scroll
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    const observerOptions = {
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, products]);

  const activeUser = currentUser || storeUser;
  const isAdmin = activeUser?.role === 'admin';

  const getThumbnailUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path.replace(/^http:\/\//i, 'https://');
    const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '');
    const baseUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';
    return `${baseUrl}/${cleanPath}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] font-['Plus_Jakarta_Sans',sans-serif] antialiased">

      {/* ADMIN ACTION BAR */}
      {isAdmin && (
        <aside aria-label="Admin Control Bar" className="bg-amber-950 text-amber-100 border-b border-amber-800/60 sticky top-0 z-50 px-4 py-3 shadow-md backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" aria-hidden="true"></span>
              <span className="bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded uppercase text-[10px] font-bold tracking-wider border border-amber-700/50">
                Mode Admin
              </span>
              <span className="font-medium text-stone-200 hidden sm:inline">
                Halo, <strong className="text-white">{activeUser?.name || 'Admin'}</strong>! Anda memiliki akses penuh sistem.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                to="/admin/products"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 text-[11px]"
              >
                <span>📦</span> Kelola Produk (CRUD)
              </Link>
              <Link
                to="/admin/products"
                className="bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 px-3 py-1.5 rounded-lg border border-amber-700/60 transition text-[11px]"
              >
                + Tambah Baru
              </Link>
            </div>
          </div>
        </aside>
      )}

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative bg-[#141210] text-white min-h-520px flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-35 mix-blend-luminosity overflow-hidden">
            <img 
              src="/assets/home.jpg"
              alt="Batik Aurum Flagship Banner" 
              className="w-full h-full object-cover object-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out"
              loading="eager"
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/80 block mb-4">
              Eksklusivitas & Warisan
            </span>

            <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.08] mb-6">
              Keanggunan Abadi untuk <br className="hidden sm:inline" /> Setiap Generasi
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mb-10 font-light tracking-wide leading-relaxed">
              Koleksi busana kurasi premium dari digimarket kami, dirancang khusus dengan bahan serat alami kualitas tertinggi.
            </p>

            <form onSubmit={handleSearch} aria-label="Pencarian Katalog" className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto mb-6">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari produk, bahan, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Kata kunci pencarian"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm text-white placeholder-stone-300 focus:outline-none focus:bg-white/20 focus:border-white/40 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-stone-100 hover:bg-white text-stone-900 font-semibold px-8 py-3.5 rounded-xl text-xs tracking-wider uppercase transition shrink-0 shadow-lg"
              >
                Cari
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-300 pt-2">
              <span className="text-[11px] text-stone-400 font-light mr-1">Populer:</span>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat.id)}`)}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1 rounded-full backdrop-blur-sm transition text-[11px] font-medium"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. BRAND SPOTLIGHT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400">
                FILOSOFI DESAIN
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 leading-tight">
                Keahlian Seni Bertemu Keanggunan Modern
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Kami percaya kemewahan sejati terletak pada daya tahan panjang dan kenyamanan autentik. Setiap helai pakaian dalam katalog diproduksi dengan standar presisi tinggi, menggabungkan nilai estetika tradisional dan potongan kontemporer.
              </p>
              <Link 
                to="/catalog" 
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-900 border-b border-stone-900 pb-1 hover:opacity-70 transition pt-2"
              >
                Jelajahi Semua Produk <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-4/5 bg-stone-200 shadow-sm">
                <img 
                  src={getThumbnailUrl('products/pakaian-pria.jpg')} 
                  alt="Detail Pakaian Pria" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-4/5 bg-stone-200 shadow-sm mt-8">
                <img 
                  src={getThumbnailUrl('products/pakaian-wanita.jpg')} 
                  alt="Material Organik" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. KOLEKSI KATEGORI */}
        <section className="bg-[#F3EFEA] py-24 border-y border-stone-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-2">
                KATALOG UTAMA
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900">
                Koleksi Pilihan
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <CategorySkeleton key={n} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.slice(0, 3).map((category, index) => (
                  <article 
                    key={category.id || index} 
                    onClick={() => navigate(`/catalog?category=${encodeURIComponent(category.id)}`)}
                    className="group cursor-pointer bg-white p-4 rounded-2xl border border-stone-200/60 shadow-xs hover:shadow-md reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out"
                  >
                    <div className="relative w-full aspect-4/5 bg-[#F5F5F3] overflow-hidden rounded-t-2xl">
                      <img
                        src={getThumbnailUrl(category.image) || defaultImages[index % defaultImages.length]}
                        alt={category.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="font-editorial text-2xl text-stone-900 mb-1 mt-3">{category.name}</h3>
                    <p className="text-xs text-stone-500 font-light mb-4 line-clamp-2">
                      {category.description || 'Koleksi pilihan dengan material eksklusif dan kualitas pengerjaan terbaik.'}
                    </p>
                    <span className="text-xs font-semibold text-stone-900 group-hover:translate-x-1 inline-block transition">
                      Lihat Koleksi →
                    </span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. PRODUK UNGGULAN DATABASE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
                EDISI TERBARU
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900">Produk Unggulan</h2>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin/products" className="text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition">
                  + Kelola Produk (Admin)
                </Link>
              )}
              <Link to="/catalog" className="text-xs font-semibold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-0.5 hover:opacity-70 transition">
                Lihat Semua Produk →
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <ProductSkeleton key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              Belum ada produk yang tersedia di database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => {
                const thumb = getThumbnailUrl(product.thumbnail);
                return (
                  <article 
                    key={product.id}
                    className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden group hover:shadow-lg flex flex-col justify-between relative reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out"
                  >
                    {isAdmin && (
                      <div className="absolute top-3 left-3 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/products');
                          }}
                          className="bg-stone-900/90 hover:bg-amber-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md border border-stone-700 transition shadow-xs flex items-center gap-1"
                        >
                          🛠️ Edit (Admin)
                        </button>
                      </div>
                    )}

                    <div onClick={() => navigate('/catalog')} className="cursor-pointer">
                      <div className="aspect-4/5 bg-stone-100 overflow-hidden relative">
                        {thumb ? (
                          <img 
                            src={thumb} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-light">
                            No Preview
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-stone-800 uppercase">
                          {product.category?.name || 'EKSLUSIF'}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-editorial text-2xl text-stone-900 leading-snug line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
                          {product.description || 'Dibuat dengan bahan baku serat kualitas pilihan.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-transparent">
                      <span className="text-lg font-bold text-stone-900">
                        {formatRupiah(product.price)}
                      </span>
                      <button 
                        onClick={() => navigate('/catalog')}
                        className="bg-stone-900 hover:bg-black text-white text-[11px] font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Beli
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. EDITORIAL MUSIMAN */}
        <section className="bg-[#141210] text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-200/80 block mb-1">
                  SOROTAN MUSIM INI
                </span>
                <h2 className="font-editorial text-4xl sm:text-5xl font-normal">
                  Editorial Musim Gugur & Dingin
                </h2>
              </div>
              <button 
                onClick={() => navigate('/catalog')}
                className="bg-white/10 hover:bg-white hover:text-stone-900 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-xl transition"
              >
                Lihat Koleksi Lengkap
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video sm:aspect-21/9 shadow-2xl border border-white/10">
              <img 
                src="/assets/hijab.jpg"
                alt="Banner Editorial Musim Gugur & Dingin"
                className="w-full h-full object-cover opacity-85"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-2">
              ULASAN PELANGGAN
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900">
              Suara Keanggunan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200/80 p-8 rounded-2xl shadow-xs flex flex-col justify-between reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <div>
                <div className="text-amber-600 text-xs mb-4" aria-label="Rating 5 dari 5 bintang">★★★★★</div>
                <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                  "Kualitas wol adem dan bahan sangat nyaman dipakai. Bahannya halus tidak gatal, potongan fleksibel membuat penampilan tampil sempurna."
                </p>
              </div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                — Eleanor R., New York
              </span>
            </div>

            <div className="bg-white border border-stone-200/80 p-8 rounded-2xl shadow-xs flex flex-col justify-between reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <div>
                <div className="text-amber-600 text-xs mb-4" aria-label="Rating 5 dari 5 bintang">★★★★★</div>
                <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                  "Saya akhirnya menemukan platform yang menghargai kualitas bahan dan detail pengerjaan. Sangat memuaskan!"
                </p>
              </div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                — Marcus T., London
              </span>
            </div>

            <div className="bg-white border border-stone-200/80 p-8 rounded-2xl shadow-xs flex flex-col justify-between reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <div>
                <div className="text-amber-600 text-xs mb-4" aria-label="Rating 5 dari 5 bintang">★★★★★</div>
                <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                  "Pengerjaan yang sangat rapi. Anda benar-benar dapat merasakan perhatian terhadap detail pada setiap jahitan pakaian mereka."
                </p>
              </div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                — Sophia L., Paris
              </span>
            </div>
          </div>
        </section>

        {/* 7. NEWSLETTER */}
        <section className="bg-[#EFECE6] py-20 px-4 border-t border-stone-200/80">
          <div className="max-w-2xl mx-auto text-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mb-3">
              Bergabung dengan Lingkaran DIGI
            </h2>
            <p className="text-xs text-stone-600 font-light mb-8 max-w-md mx-auto">
              Dapatkan informasi eksklusif seputar rilis produk baru dan pratinjau koleksi terbatas.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah berlangganan!'); setEmail(''); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Alamat Email Anda" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Alamat Email Langganan"
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
              />
              <button 
                type="submit" 
                className="bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-xl transition shrink-0"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}