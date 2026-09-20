import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Skeleton Loading Presisi Sesuai Komponen Asli
function SupportSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      {/* Hero Skeleton */}
      <div className="text-center space-y-6 pt-4 max-w-3xl mx-auto">
        <div className="h-3 w-32 bg-stone-200 rounded mx-auto" />
        <div className="h-10 w-3/4 bg-stone-200 rounded mx-auto" />
        <div className="h-5 w-5/6 bg-stone-200 rounded mx-auto" />
        <div className="h-12 w-full max-w-2xl bg-stone-200 rounded-lg mx-auto" />
      </div>

      <hr className="border-t border-stone-200/80" />

      {/* Catalog Grid Skeleton */}
      <div className="space-y-8">
        <div className="h-8 w-48 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-stone-200/80 rounded-2xl p-6 h-52 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-stone-200" />
              <div className="h-5 w-3/4 bg-stone-200 rounded" />
              <div className="h-3 w-full bg-stone-200 rounded" />
              <div className="h-3 w-2/3 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-64 bg-stone-200 rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-white border border-stone-200/80 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [openFaq, setOpenFaq] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulasi pemuatan awal / inisialisasi data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
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

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Sanitasi input pencarian sederhana
    const cleanQuery = searchQuery.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleanQuery) {
      console.log('Searching for:', cleanQuery);
    }
  };

  const categories = [
    {
      title: 'Pemesanan & Pembayaran',
      desc: 'Panduan checkout aman, verifikasi transfer, kartu kredit, dan cicilan mitra perbankan.',
      count: '08 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    },
    {
      title: 'Pengiriman & Pelacakan',
      desc: 'Estimasi pengemasan premium, kurir terpercaya, dan pemantauan resi pesanan realtime.',
      count: '12 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      title: 'Pengembalian & Refund',
      desc: 'Kebijakan garansi 14 hari, klaim ketidaksesuaian ukuran, serta alur pengembalian dana.',
      count: '06 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      title: 'Akun & Autentikasi',
      desc: 'Pengelolaan profil kolektor, keamanan sandi, verifikasi sertifikat fisik dan NFT.',
      count: '05 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Panduan Menjual (Seller)',
      desc: 'Kurasi karya desainer independen, manajemen etalase toko, dan pencairan komisi.',
      count: '10 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H3m18-10.5l-2.25-6.75A1.125 1.125 0 0017.683 3H6.317a1.125 1.125 0 00-1.066.75L3 10.5m18 0v8.25a1.125 1.125 0 01-1.125 1.125H4.125A1.125 1.125 0 013 18.75V10.5m18 0a2.25 2.25 0 00-2.25-2.25c-.808 0-1.53.433-1.928 1.09a2.25 2.25 0 01-3.644 0 2.25 2.25 0 00-1.928-1.09 2.25 2.25 0 00-1.928 1.09 2.25 2.25 0 01-3.644 0A2.25 2.25 0 004.25 8.25 2.25 2.25 0 002 10.5" />
        </svg>
      ),
    },
    {
      title: 'Layanan Privé & Concierge',
      desc: 'Konsultasi busana white-glove, kustomisasi bespoke, dan pesanan khusus untuk gala.',
      count: '04 PANDUAN',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      question: 'Bagaimana cara melacak pengiriman busana kuratorial saya?',
      answer:
        'Setiap karya yang telah selesai dikurasi dan dikemas secara aman akan diberikan nomor resi eksklusif. Anda dapat memantau status perjalanan paket secara real-time langsung melalui tab Pesanan Saya pada akun Anda, atau melalui tautan pelacakan yang dikirimkan secara otomatis via email konfirmasi.',
    },
    {
      question: 'Bagaimana kebijakan penukaran dan garansi 14 hari refund?',
      answer:
        'Kami menyediakan garansi pengembalian 14 hari untuk produk yang belum dipakai, lengkap dengan tag dan kemasan asli. Tim kami akan memverifikasi kondisi produk sebelum proses refund diproses ke metode pembayaran awal Anda.',
    },
    {
      question: 'Prosedur verifikasi keaslian produk dan sertifikasi bahan tekstil?',
      answer:
        'Setiap item dilengkapi dengan Sertifikat Autentisitas digital & fisik yang memuat rekam jejak pengrajin, nomor seri unik, serta komposisi serat material yang telah diverifikasi laboratorium independen.',
    },
    {
      question: 'Bagaimana tata cara bergabung menjadi desainer/brand mitra DigiMarket?',
      answer:
        'Anda dapat mengajukan portofolio karya melalui menu Panduan Menjual. Tim kurator kami akan melakukan peninjauan standar jahitan, etika produksi, dan keunikan desain dalam waktu 3-5 hari kerja.',
    },
    {
      question: 'Metode pembayaran apa saja yang diterima?',
      answer:
        'Kami menerima Transfer Bank (VA), Kartu Kredit/Debit (Visa/Mastercard), Cicilan 0% mitra perbankan, serta pembayaran instan QRIS.',
    },
    {
      question: 'Berapa lama estimasi pengiriman ke luar kota dan antar-pulau?',
      answer:
        'Estimasi pengiriman kota besar berkisar 1-3 hari kerja. Untuk wilayah luar Jawa atau antar-pulau membutuhkan waktu 3-5 hari kerja dengan kemasan perlindungan ekstra.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] font-['Plus_Jakarta_Sans',sans-serif] antialiased py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
      `}</style>

      <main className="max-w-5xl mx-auto space-y-16">
        {loading ? (
          <SupportSkeleton />
        ) : (
          <>
            {/* HERO SECTION */}
            <header className="text-center space-y-6 pt-4 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                PUSAT BANTUAN &bull; DIGIMARKET
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl font-medium text-stone-900 max-w-3xl mx-auto leading-tight">
                Kami Siap Membantu Perjalanan Gaya Anda
              </h1>
              <p className="font-editorial italic text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Temukan panduan kuratorial terperinci atau hubungi tim concierge kami untuk memastikan pengalaman busana yang tenang dan tanpa cela.
              </p>

              {/* SEARCH BAR */}
              <div className="max-w-2xl mx-auto pt-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-stone-300 rounded-lg overflow-hidden p-1 shadow-xs focus-within:border-stone-500 transition">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari topik bantuan, misalnya pengiriman atau refund..."
                    aria-label="Cari topik bantuan"
                    className="w-full px-4 py-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none bg-transparent"
                  />
                  <button type="submit" className="px-6 py-3 bg-[#1A1816] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition rounded-md shrink-0">
                    CARI
                  </button>
                </form>
                <p className="text-[11px] text-stone-400 font-medium tracking-wide mt-3">
                  PENCARIAN POPULER:{' '}
                  <button type="button" onClick={() => setSearchQuery('Pelacakan Pesanan')} className="text-stone-600 hover:underline focus:outline-none">Pelacakan Pesanan</button> &bull;{' '}
                  <button type="button" onClick={() => setSearchQuery('Garansi 14 Hari')} className="text-stone-600 hover:underline focus:outline-none">Garansi 14 Hari</button> &bull;{' '}
                  <button type="button" onClick={() => setSearchQuery('Standar Autentikasi')} className="text-stone-600 hover:underline focus:outline-none">Standar Autentikasi</button>
                </p>
              </div>
            </header>

            <hr className="border-t border-stone-200/80" />

            {/* KATALOG PANDUAN GRID */}
            <section className="space-y-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out" aria-label="Katalog Panduan">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Katalog Panduan
                </h2>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 block">
                  EKSPLORASI TOPIK BERDASARKAN KEBUTUHAN
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                  <article
                    key={idx}
                    className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 hover:border-stone-400 transition cursor-pointer group"
                  >
                    <div className="space-y-4">
                      {/* Modern Icon Container */}
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/60 group-hover:bg-stone-900 group-hover:text-white transition">
                        {cat.icon}
                      </div>
                      <h3 className="font-editorial text-xl font-semibold text-stone-900">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-light">
                        {cat.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-stone-400 pt-3 border-t border-stone-100">
                      <span>{cat.count}</span>
                      <span className="group-hover:translate-x-1 transition-transform text-stone-900 font-bold" aria-hidden="true">&rarr;</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FAQ SECTION (With SEO Schema.org Markup) */}
            <section className="space-y-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out" itemScope itemType="https://schema.org/FAQPage">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 block">
                  PERTANYAAN UMUM
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Jawaban yang Sering Dicari
                </h2>
              </div>

              <div className="border-t border-stone-200/80 divide-y divide-stone-200/80">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  const faqId = `faq-answer-${index}`;

                  return (
                    <div key={index} className="py-5 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={faqId}
                        className="w-full flex justify-between items-center text-left gap-4 focus:outline-none group"
                      >
                        <span className="font-editorial text-xl sm:text-2xl font-medium text-stone-900 group-hover:text-stone-600 transition" itemProp="name">
                          {faq.question}
                        </span>
                        <span className="text-xl text-stone-500 font-light shrink-0" aria-hidden="true">
                          {isOpen ? '–' : '+'}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          id={faqId}
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                          className="mt-4 p-5 bg-stone-100/70 border-l-2 border-stone-900 text-xs sm:text-sm text-stone-700 leading-relaxed font-light"
                        >
                          <div itemProp="text">{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PERSONAL ASSISTANCE CTA BOX */}
            <section className="bg-stone-100/60 border border-stone-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-xs reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                PERSONAL ASSISTANCE
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl text-stone-900 font-medium">
                Butuh Bantuan Lebih Lanjut?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
                Tim Concierge DigiMarket siap melayani pertanyaan seputar kurasi, ukuran, panduan gaya, hingga asistensi teknis pemesanan Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="mailto:concierge@digimarket.id"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#1A1816] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition shadow-xs text-center"
                >
                  HUBUNGI VIA EMAIL
                </a>
                <a
                  href="https://wa.me/6281288002026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white border border-stone-300 text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition text-center"
                >
                  CHAT DENGAN TIM KAMI
                </a>
              </div>

              <p className="text-[11px] text-stone-500 font-medium pt-4 border-t border-stone-200/80">
                Jam Operasional: Senin &ndash; Sabtu, 09.00 &ndash; 21.00 WIB &bull;{' '}
                <a href="mailto:concierge@digimarket.id" className="hover:underline">concierge@digimarket.id</a> &bull;{' '}
                <a href="tel:+6281288002026" className="hover:underline">+62 812-8800-2026</a> &bull; Jakarta, Indonesia
              </p>
            </section>

            {/* FOOTER */}
            <footer className="pt-12 pb-6 border-t border-stone-200/80 text-center space-y-4">
              <Link to="/" className="font-editorial text-2xl font-semibold tracking-tight text-stone-900 block">
                DigiMarket
              </Link>
              <nav aria-label="Navigasi Footer" className="flex items-center justify-center space-x-6 text-xs text-stone-600 font-medium">
                <Link to="/privacy" className="hover:text-stone-900 transition">Kebijakan Privasi</Link>
                <Link to="/terms" className="hover:text-stone-900 transition">Syarat Layanan</Link>
                <Link to="/support" className="hover:text-stone-900 transition">Hubungi Kami</Link>
              </nav>
              <p className="text-[11px] text-stone-400">
                &copy; 2026 DigiMarket. Seluruh hak cipta dilindungi.
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}