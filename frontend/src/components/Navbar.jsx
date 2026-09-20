import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Support', path: '/support' },
    { name: 'About', path: '/about' },
    { name: 'Pesanan Saya', path: '/orders' },
  ];

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCartCount = async () => {
      try {
        const res = await api.get('/cart');
        const rawData = res.data?.data || res.data || [];
        const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
        
        const totalQty = items.reduce((acc, item) => acc + Number(item.qty || 1), 0);
        setCartCount(totalQty);
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();

    window.addEventListener('cartUpdated', fetchCartCount);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, [isAuthenticated]);

  const requestLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  // Tentukan tujuan & label dashboard berdasarkan role akun yang login.
  // Pembeli/user biasa (role lain selain admin & seller) tidak mendapat tombol ini sama sekali.
  // Path disesuaikan dengan route yang terdaftar di App.jsx.
  const dashboardConfig =
    user?.role === 'admin'
      ? { path: '/admin/dashboard', label: 'Dashboard Admin' }
      : user?.role === 'seller'
      ? { path: '/seller/dashboard', label: 'Dashboard Seller' }
      : null;

  return (
    <>
      <nav className="bg-white border-b border-stone-200/80 sticky top-0 z-40" aria-label="Navigasi Utama">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between text-xs font-medium">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="font-editorial text-2xl font-bold tracking-tight text-stone-900" aria-label="DigiMarket Beranda">
              DIGIMARKET
            </Link>

            <div className="hidden md:flex items-center gap-6 text-stone-600">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative py-1.5 transition-colors duration-200 ${
                      isActive ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-stone-900 transition-all duration-300 ease-in-out ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-5 text-stone-600">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline">Halo, <strong className="text-stone-900 font-semibold">{user?.name || 'Pengguna'}</strong></span>
                <button
                  type="button"
                  onClick={requestLogout}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Keluar
                </button>
                {/* FIX SECURITY: Tampilkan tombol dashboard hanya untuk Seller / Admin, sesuai role akun yang login */}
                {dashboardConfig && (
                  <Link
                    to={dashboardConfig.path}
                    className="px-4 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-black transition shadow-xs"
                  >
                    {dashboardConfig.label}
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="hover:text-stone-900 transition">Masuk</Link>
            )}
          </div>

        </div>
      </nav>

      {isAuthenticated && cartCount > 0 && (
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="fixed bottom-6 right-6 z-50 bg-stone-900 hover:bg-black text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group cursor-pointer"
          title="Lihat Keranjang Belanja"
          aria-label="Lihat Keranjang Belanja"
        >
          <svg
            className="w-6 h-6 text-stone-100 group-hover:text-white transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>

          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </button>
      )}

      {/* MODAL KONFIRMASI KELUAR */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Keluar dari Akun?</h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Anda akan keluar dari sesi ini. Anda perlu masuk kembali untuk mengakses akun Anda.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition shadow-xs"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}