import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

// Tutup menu mobile otomatis setiap kali pindah halaman. Ini sinkronisasi
// state UI lokal terhadap perubahan route, bukan efek samping async biasa.
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsMenuOpen(false);
}, [location.pathname]);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const requestLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
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

          {/* Sisi kanan: desktop full, mobile ringkas + tombol keranjang + hamburger */}
          <div className="flex items-center gap-3 sm:gap-5 text-stone-600">
            
            {/* Desktop-only auth area */}
            <div className="hidden md:flex items-center gap-5">
              {isAuthenticated ? (
                <>
                  <span className="hidden lg:inline">
                    Halo, <strong className="text-stone-900 font-semibold">{user?.name || 'Pengguna'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={requestLogout}
                    className="hover:text-stone-900 transition cursor-pointer"
                  >
                    Keluar
                  </button>
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

            {/* Ikon keranjang ringkas — muncul di mobile saja (versi FAB tetap ada di bawah untuk desktop) */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="md:hidden relative p-2 -mr-1 text-stone-700 hover:text-stone-900 transition"
                aria-label="Lihat Keranjang Belanja"
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.502-7.148a1.125 1.125 0 00-1.11-1.334H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Tombol Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center text-stone-900 -mr-2"
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMenuOpen}
            >
              <span className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? 'rotate-45 translate-y-7px' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? '-rotate-45 -translate-y-7px' : ''
                  }`}
                />
              </span>
            </button>
          </div>

        </div>
      </nav>

      {/* OVERLAY + DRAWER MENU MOBILE */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-visibility ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Overlay gelap */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel drawer dari kanan */}
        <div
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header drawer */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-stone-200/80 shrink-0">
            <span className="font-editorial text-xl font-bold text-stone-900">Menu</span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 transition"
              aria-label="Tutup menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profil pengguna (kalau login) */}
          {isAuthenticated && (
            <div className="px-6 py-5 border-b border-stone-200/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    {user?.name || 'Pengguna'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Daftar navigasi */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigasi Mobile">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {item.name}
                      <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {dashboardConfig && (
              <div className="mt-4 pt-4 border-t border-stone-200/80">
                <Link
                  to={dashboardConfig.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-semibold transition shadow-xs"
                >
                  {dashboardConfig.label}
                </Link>
              </div>
            )}
          </nav>

          {/* Footer drawer: auth action */}
          <div className="px-4 py-5 border-t border-stone-200/80 shrink-0 space-y-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={requestLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                </svg>
                Keluar dari Akun
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* FAB Keranjang — cuma tampil di desktop (mobile pakai ikon di navbar) */}
      {isAuthenticated && cartCount > 0 && (
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="hidden md:flex fixed bottom-6 right-6 z-50 bg-stone-900 hover:bg-black text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 items-center justify-center group cursor-pointer"
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
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-60">
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