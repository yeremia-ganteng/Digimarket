import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  MessageCircle, 
  Building2
} from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeChapter, setActiveChapter] = useState('bab-01');

  const chapters = [
    { id: 'bab-01', number: '01', title: 'Pendahuluan' },
    { id: 'bab-02', number: '02', title: 'Data yang Kami Kumpulkan' },
    { id: 'bab-03', number: '03', title: 'Cara Data Digunakan' },
    { id: 'bab-04', number: '04', title: 'Pembagian Data ke Pihak Ketiga' },
    { id: 'bab-05', number: '05', title: 'Hak Pengguna (UU PDP)' },
    { id: 'bab-06', number: '06', title: 'Keamanan & Enkripsi Data' },
    { id: 'bab-07', number: '07', title: 'Retensi & Penghapusan' },
    { id: 'bab-08', number: '08', title: 'Perubahan Kebijakan' },
    { id: 'bab-09', number: '09', title: 'Kontak DPO & Layanan Legal' },
  ];

  const scrollToSection = (id) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // SEO Optimization & Schema JSON-LD Injection
  useEffect(() => {
    document.title = "Kebijakan Privasi & Perlindungan Data | DigiMarket";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Kebijakan Privasi DigiMarket memuat transparansi pengelolaan data pribadi pengguna dan kepatuhan terhadap UU PDP No. 27 Tahun 2022.";

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'privacy-schema';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Kebijakan Privasi & Perlindungan Data Pengguna",
      "description": "Landasan hukum komitmen DigiMarket dalam menjaga privasi, keamanan data personal, dan hak-hak digital setiap pengguna.",
      "publisher": {
        "@type": "Organization",
        "name": "DigiMarket"
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('privacy-schema');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // Optimized Scroll Spy dengan Throttling via requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 200;
          for (const chapter of chapters) {
            const element = document.getElementById(chapter.id);
            if (element) {
              const top = element.offsetTop;
              const height = element.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveChapter(chapter.id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  return (
    <main className="bg-[#FAF8F5] text-stone-900 font-sans antialiased min-h-screen pb-20">
      
      {/* ================= BREADCRUMB & SUB-HEADER ================= */}
      <nav aria-label="Breadcrumbs" className="border-b border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-mono tracking-wider text-stone-500 uppercase gap-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <Link to="/" className="hover:text-stone-900 transition">BERANDA</Link>
            <span>/</span>
            <span>LEGAL & KEBIJAKAN</span>
            <span>/</span>
            <span className="text-stone-900 font-medium">KEBIJAKAN PRIVASI</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="truncate">PROTOKOL PERLINDUNGAN DATA PELANGGAN</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-10">

        {/* ================= HERO TITLE SECTION ================= */}
        <header className="space-y-4 border-b border-stone-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/70 border border-stone-300/80 rounded-full text-[10px] font-mono tracking-widest text-stone-700 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-800 shrink-0" />
            <span>TRANSPARANSI KEPATUHAN UU PDP NO. 27 TAHUN 2022</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
            Kebijakan Privasi & Perlindungan Data Pengguna
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-3xl">
            Landasan hukum komitmen DigiMarket dalam menjaga privasi, keamanan data personal, dan hak-hak digital setiap pengguna serta pemangku kepentingan platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-mono text-stone-500 pt-2 uppercase tracking-wider">
            <span>• TERAKHIR DIPERBARUI: 18 SEPTEMBER 2026</span>
            <span>• VERSI DOKUMEN: 4.2</span>
          </div>
        </header>

        {/* ================= 4 PILAR KOMITMEN PRIVASI ================= */}
        <section aria-label="Komitmen Privasi Utama" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-200 pb-3 gap-2">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-stone-400 uppercase font-semibold block">
                4 PILAR • KOMITMEN PLATFORM
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-stone-900">
                Ringkasan Komitmen Privasi Utama
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200/90 p-4 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>01 / KREATIF & AMAN</span>
                <Lock className="w-4 h-4 text-stone-700 shrink-0" />
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-medium text-stone-900">Enkripsi End-to-End</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Data transaksi dienkripsi menggunakan standar militer AES-256 Bit saat transmisi maupun penyimpanan.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 p-4 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>02 / NON-COMMERCIAL</span>
                <UserCheck className="w-4 h-4 text-stone-700 shrink-0" />
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-medium text-stone-900">Tanpa Penjualan Data</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Kami menjamin 100% data pribadi Anda tidak akan pernah dijual atau disewakan kepada pihak ketiga.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 p-4 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>03 / REGULASI RI</span>
                <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-medium text-stone-900">Kepatuhan UU PDP</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Pengelolaan data berpatokan penuh pada Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 p-4 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>04 / KENDALI PENUH</span>
                <FileText className="w-4 h-4 text-stone-700 shrink-0" />
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-medium text-stone-900">Hak Kontrol Anda</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Anda memiliki hak penuh untuk mengakses, memperbarui, hingga menghapus permanen data pribadi Anda.
              </p>
            </div>
          </div>
        </section>

        {/* ================= MOBILE-ONLY COMPACT MENU ================= */}
        <nav aria-label="Navigasi Bab Seluler" className="block md:hidden bg-white border border-stone-200 p-3 shadow-sm sticky top-14 z-20">
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block mb-2 font-bold">
            PILIH BAB KEBIJAKAN:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => scrollToSection(ch.id)}
                aria-current={activeChapter === ch.id ? 'true' : undefined}
                className={`px-3 py-1.5 whitespace-nowrap border text-[11px] transition ${
                  activeChapter === ch.id
                    ? 'bg-stone-900 text-white border-stone-900 font-medium'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {ch.number}. {ch.title}
              </button>
            ))}
          </div>
        </nav>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">

          {/* LEFT COLUMN: STICKY TOC (MD+) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-4 md:sticky md:top-20 self-start space-y-6">
            <div className="bg-white border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-bold">
                  INDEKS BAB KEBIJAKAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">9 BAB</span>
              </div>

              <nav aria-label="Indeks Bab Kebijakan" className="space-y-1 text-xs">
                {chapters.map((ch) => {
                  const isActive = activeChapter === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => scrollToSection(ch.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`w-full flex items-center justify-between p-2 text-left transition border-l-2 ${
                        isActive
                          ? 'bg-[#F5F3EF] border-stone-900 font-medium text-stone-900'
                          : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-1">
                        <span className="font-mono text-[10px] text-stone-400 shrink-0">{ch.number}</span>
                        <span className="truncate">{ch.title}</span>
                      </span>
                      {isActive && <ArrowRight className="w-3 h-3 text-stone-800 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SIDEBAR CALLOUT */}
            <div className="bg-[#EFECE6] border border-stone-300/80 p-4 sm:p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold block">
                DOKUMEN LEGAL & HUKUM
              </span>
              <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                Memiliki pertanyaan khusus perihal penggunaan data pribadi Anda?
              </p>
              <button
                onClick={() => scrollToSection('bab-09')}
                className="w-full bg-stone-900 text-white py-2.5 text-[10px] font-mono uppercase tracking-wider hover:bg-stone-800 transition"
              >
                HUBUNGI TIM LEGAL PRIVASI
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: DETAILED CHAPTERS */}
          <div className="md:col-span-8 lg:col-span-8 space-y-8">

            {/* BAB 01 */}
            <section id="bab-01" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 01 • PENDAHULUAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 1</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                1. Pendahuluan
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
                <span className="float-left text-3xl font-serif leading-none pr-2 pt-1 text-stone-900">K</span>
                ebijakan Privasi ini mengatur tata cara DigiMarket (“Kami”) mengumpulkan, menyimpan, mengelola, menggunakan, dan melindungi data pribadi Anda saat menggunakan platform web, aplikasi mobile, serta seluruh layanan kurasi mode dan transaksi yang disediakan DigiMarket.
              </p>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Dengan mengakses dan menggunakan platform DigiMarket, Anda menyatakan setuju dan tunduk pada seluruh ketentuan yang tercantum dalam Kebijakan Privasi ini. Apabila Anda tidak menyetujui salah satu poin dalam kebijakan ini, kami menyarankan untuk tidak melanjutkan penggunaan platform atau menghubungi Data Protection Officer kami.
              </p>
            </section>

            {/* BAB 02 */}
            <section id="bab-02" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-5 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 02 • KATEGORI DATA
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 2</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                2. Data yang Kami Kumpulkan
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Untuk memberikan layanan kurasi, verifikasi pesanan, serta pengalaman belanja yang aman, kami mengumpulkan jenis data pribadi berikut:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="bg-[#FAF8F5] p-3.5 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-stone-900 uppercase block">
                    a. Data Identitas
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Nama lengkap, alamat email, nomor telepon, alamat pengiriman, tanggal lahir, dan foto profil.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-stone-900 uppercase block">
                    b. Data Transaksi
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Riwayat pembelian, invoice, metode pembayaran, detail nomor resi, dan riwayat retur.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-stone-900 uppercase block">
                    c. Data Teknis
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Alamat IP, tipe perangkat, sistem operasi, log aktivitas, serta identifikasi cookie.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-mono font-semibold text-stone-900 uppercase block">
                    d. Data Khusus Profiling
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Preferensi gaya busana, ukuran spesifik (fitting measurement), wishlist, serta riwayat interaksi.
                  </p>
                </div>
              </div>
            </section>

            {/* BAB 03 */}
            <section id="bab-03" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 03 • TUJUAN PEMROSESAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 3</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                3. Cara Data Digunakan
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Pemrosesan data pribadi Anda dilakukan terbatas pada tujuan operasional resmi dan peningkatan mutu layanan:
              </p>

              <ul className="space-y-2.5 text-xs text-stone-700 font-light pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <span><strong>Operasional Pesanan:</strong> Memproses transaksi, verifikasi pembayaran, serta pengiriman barang melalui kurir.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <span><strong>Autentikasi & Keamanan:</strong> Mencegah potensi penipuan transaksi, peretasan akun, serta pemalsuan identitas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <span><strong>Kustomisasi Rekomendasi:</strong> Menyajikan kurasi produk dan rekomendasi ukuran fitting yang relevan dengan selera Anda.</span>
                </li>
              </ul>
            </section>

            {/* BAB 04 */}
            <section id="bab-04" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-5 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 04 • PIHAK KETIGA
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 4</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                4. Pembagian Data ke Pihak Ketiga
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Kami hanya membagikan informasi pribadi Anda kepada entitas tepercaya yang terikat oleh perjanjian kerahasiaan ketat:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="border border-stone-200 p-3.5 space-y-1">
                  <Building2 className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="font-medium text-stone-900 block">Mitra Kurir & Logistik</span>
                  <p className="text-[11px] text-stone-500 font-light">Untuk penjemputan dan pengantaran fisik paket pesanan.</p>
                </div>

                <div className="border border-stone-200 p-3.5 space-y-1">
                  <Lock className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="font-medium text-stone-900 block">Payment Gateway</span>
                  <p className="text-[11px] text-stone-500 font-light">Untuk memproses transaksi perbankan secara aman dan terenkripsi.</p>
                </div>

                <div className="border border-stone-200 p-3.5 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="font-medium text-stone-900 block">Otoritas Berwenang</span>
                  <p className="text-[11px] text-stone-500 font-light">Hanya jika diwajibkan oleh perintah hukum Republik Indonesia.</p>
                </div>
              </div>

              <div className="bg-stone-900 text-white p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-bold block">
                  PENEGASAN NONSALE GUARANTEE
                </span>
                <p className="text-xs font-serif font-light leading-relaxed">
                  DigiMarket tidak pernah dan tidak akan pernah menjual data pribadi Anda kepada pihak ketiga untuk kepentingan komersial.
                </p>
              </div>
            </section>

            {/* BAB 05 */}
            <section id="bab-05" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 05 • HAK DIGITAL PENGGUNA
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 5</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                5. Hak Pengguna (UU PDP)
              </h2>

              <div className="bg-[#FAF8F5] border-l-2 border-stone-900 p-4 space-y-2">
                <blockquote className="text-xs sm:text-sm text-stone-800 font-serif italic leading-relaxed">
                  "Anda memiliki hak mutlak untuk mengakses, memperbarui, membatasi pemrosesan, serta menghapus data pribadi Anda (right to be forgotten) sesuai dengan Undang-Undang Perlindungan Data Pribadi No. 27 Tahun 2022."
                </blockquote>
              </div>
            </section>

            {/* BAB 06 */}
            <section id="bab-06" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 06 • PROTOKOL KEAMANAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 6</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                6. Keamanan & Enkripsi Data
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Sistem keamanan kami menggunakan enkripsi AES-256 Bit dan SSL TLS 1.3 saat transmisi data untuk menjamin kerahasiaan penuh.
              </p>
            </section>

            {/* BAB 07 */}
            <section id="bab-07" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 07 • MASA SIMPAN DATA
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 7</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                7. Retensi & Penghapusan
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Data pribadi disimpankan selama akun aktif atau sepanjang diperlukan untuk memenuhi kewajiban hukum. Setelahnya, data akan dihapus secara permanen.
              </p>
            </section>

            {/* BAB 08 */}
            <section id="bab-08" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-4 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 08 • AMANDEMEN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 8</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                8. Perubahan Kebijakan
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Setiap perubahan material akan diberitahukan melalui email atau pengumuman resmi di situs web minimal 14 hari sebelum efektif berlaku.
              </p>
            </section>

            {/* BAB 09 */}
            <section id="bab-09" className="bg-white border border-stone-200/90 p-5 sm:p-8 space-y-5 shadow-sm scroll-mt-24">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 09 • DPO & LAYANAN LEGAL
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 9</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                9. Kontak DPO & Layanan Legal
              </h2>

              <div className="bg-[#FAF8F5] p-4 sm:p-5 border border-stone-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">EMAIL DPO</span>
                    <a href="mailto:dpo@digimarket.id" className="font-serif text-sm sm:text-base text-stone-900 hover:underline block">
                      dpo@digimarket.id
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">HOTLINE WHATSAPP</span>
                    <a 
                      href="https://wa.me/6281288002026" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-serif text-sm sm:text-base text-stone-900 hover:underline block"
                    >
                      +62 812-8800-2026
                    </a>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">ALAMAT ATELIER</span>
                  <p className="text-stone-800 font-light">
                    DigiMarket Legal Dept., SCBD Lot 11, Jl. Jend. Sudirman, Jakarta Selatan 12190
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href="mailto:dpo@digimarket.id"
                    className="bg-stone-900 text-white px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider hover:bg-stone-800 transition flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>EMAIL DPO</span>
                  </a>
                  <a
                    href="https://wa.me/6281288002026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-stone-300 text-stone-800 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>PENGAJUAN DATA (DSAR)</span>
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
}