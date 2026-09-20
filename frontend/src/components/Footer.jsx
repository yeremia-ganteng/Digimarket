import { Link } from 'react-router-dom';

const SHOP_CATEGORIES = [
  { id: 'pria', name: 'Pakaian Pria' },
  { id: 'wanita', name: 'Pakaian Wanita' },
  { id: 'aksesoris', name: 'Aksesoris' },
];

export default function Footer({ categories = SHOP_CATEGORIES }) {
  return (
    <footer className="bg-white border-t border-stone-200/80 pt-16 pb-12 text-xs text-stone-600" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="font-editorial text-2xl text-stone-900 font-normal mb-3">
              DigiMarket
            </h2>
            <p className="text-stone-500 font-light leading-relaxed max-w-sm">
              Dirancang untuk bertahan lama, dibuat dari bahan berkualitas tinggi, dan dirancang untuk memberikan kenyamanan sejati.
            </p>
          </div>

          {/* ================= BELANJA (SEO Friendly Links) ================= */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">Belanja</h3>
            <ul className="space-y-2 font-light text-stone-500">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?category=${encodeURIComponent(cat.id)}`}
                    className="text-stone-500 hover:text-black transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= TENTANG ================= */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">Tentang</h3>
            <ul className="space-y-2 font-light text-stone-500">
              <li><Link to="/about" className="text-stone-500 hover:text-black">Cerita Kami</Link></li>
              <li><Link to="/about/materials" className="text-stone-500 hover:text-black">Material & Kualitas</Link></li>
              <li><Link to="/about/sustainability" className="text-stone-500 hover:text-black">Keberlanjutan</Link></li>
            </ul>
          </div>

          {/* ================= DUKUNGAN ================= */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">Dukungan</h3>
            <ul className="space-y-2 font-light text-stone-500">
              <li><Link to="/support/contact" className="text-stone-500 hover:text-black">Hubungi Kami</Link></li>
              <li><Link to="/support/shipping" className="text-stone-500 hover:text-black">Pengiriman</Link></li>
              <li><Link to="/support/faq" className="text-stone-500 hover:text-black">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* ================= HAK CIPTA / BOTTOM BAR ================= */}
        <div className="border-t border-stone-200/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-light gap-4">
          <p>© 2026 DigiMarket. Hak cipta dilindungi.</p>
          <div className="flex space-x-6">
            <Link to="/legal/PrivacyPolicy" className="hover:text-black transition">Kebijakan Privasi</Link>
            <Link to="/legal/TermsOfService" className="hover:text-black transition">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}