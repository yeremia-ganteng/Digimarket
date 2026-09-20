import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Minus, 
  ArrowRight, 
  MessageCircle, 
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua Topik');
  const [openItems, setOpenItems] = useState({ '01.1': true });

  const popularSearches = [
    'Retur 14 Hari', 
    'Sertifikasi GOTS', 
    'Biaya Ongkir', 
    'Bespoke Fitting', 
    'Pajak & Bea Cukai'
  ];

  const categories = [
    'Semua Topik',
    'Pemesanan & Pembayaran',
    'Pengiriman & Logistik',
    'Pengembalian & Garansi 14 Hari',
    'Autentikasi & Kualitas Serat',
    'Kemitraan Desainer',
    'Layanan Privé & Atelier'
  ];

  const faqData = [
    {
      id: '01',
      badge: 'BAGIAN 01',
      category: 'Pemesanan & Pembayaran',
      title: 'Pemesanan & Transaksi Keuangan',
      count: '3 PERTANYAAN',
      items: [
        {
          code: '01.1',
          q: 'Metode pembayaran apa saja yang mendukung konfirmasi otomatis tanpa perlu kirim bukti transfer manual?',
          a: 'Semua transaksi via Bank Transfer (Virtual Account BCA, Mandiri, BNI, BRI), Kartu Kredit/Debit (Visa, Mastercard, JCB), serta QRIS terintegrasi secara otomatis dengan sistem pemrosesan DigiMarket. Anda tidak perlu mengunggah bukti transfer secara manual.'
        },
        {
          code: '01.2',
          q: 'Bagaimana prosedur pembayaran dengan fasilitas cicilan 0% atau pembiayaan paylater?',
          a: 'Fasilitas cicilan 0% hingga 12 bulan tersedia untuk pemegang kartu kredit bank mitra. Opsi pembayaran berkala (PayLater) diproses melalui layanan penyedia resmi saat check-out transaksi.'
        },
        {
          code: '01.3',
          q: 'Apakah faktur pajak resmi dapat diterbitkan untuk pembelian atas nama korporasi?',
          a: 'Ya, faktur pajak resmi dapat diterbitkan. Silakan beri centang pada opsi "Pengajuan Faktur Pajak Korporasi" di halaman pembayaran dan cantumkan NPWP serta nama perusahaan Anda.'
        }
      ]
    },
    {
      id: '02',
      badge: 'BAGIAN 02',
      category: 'Pengiriman & Logistik',
      title: 'Pengiriman, Logistik & Kemasan Berkelanjutan',
      count: '3 PERTANYAAN',
      items: [
        {
          code: '02.1',
          q: 'Mengapa DigiMarket menggunakan kemasan kain bebas plastik dan segel lilin botani?',
          a: 'Komitmen kami terhadap kelestarian lingkungan diwujudkan melalui pengemasan bernilai museum (archival grade). Kain pelindung katun organik dan segel lilin nabati menjamin busana Anda terlindung dari kelembapan udara tanpa limbah mikroplastik.'
        },
        {
          code: '02.2',
          q: 'Bagaimana mekanisme proteksi asuransi pengiriman jika barang rusak saat transit?',
          a: 'Setiap pengiriman busana DigiMarket secara otomatis dilindungi Asuransi Kurator Penuh. Jika terjadi kerusakan fisik atau kehilangan selama transit, tim concierge akan memproses penggantian barang atau pengembalian dana 100% dalam 2x24 jam.'
        },
        {
          code: '02.3',
          q: 'Apakah saya bisa memesan pengiriman dengan jadwal jam tertentu (concierge same day)?',
          a: 'Layanan Pengiriman Concierge Same-Day tersedia untuk wilayah Jabodetabek. Anda dapat memilih slot waktu pengantaran khusus melalui koordinasi langsung dengan tim layanan pelanggan kami.'
        }
      ]
    },
    {
      id: '03',
      badge: 'BAGIAN 03',
      category: 'Pengembalian & Garansi 14 Hari',
      title: 'Pengembalian, Penukaran & Garansi 14 Hari',
      count: '3 PERTANYAAN',
      items: [
        {
          code: '03.1',
          q: 'Bagaimana prosedur pengembalian jika ukuran pakaian pesanan tidak sesuai proporsi tubuh?',
          a: 'Anda memiliki hak retur atau tukar ukuran selama 14 hari sejak barang diterima. Cukup ajukan permohonan melalui menu Pesanan Saya atau hubungi Concierge untuk penjemputan kurir khusus.'
        },
        {
          code: '03.2',
          q: 'Berapa lama proses verifikasi inspeksi busana hingga dana refund masuk ke rekening?',
          a: 'Setelah barang tiba di Sentra Atelier dan lolos uji autentisitas serta kelayakan kondisi, pengembalian dana diproses dalam kurun waktu 1 hingga 3 hari kerja.'
        },
        {
          code: '03.3',
          q: 'Apakah busana dengan pesanan kustom (bespoke tailoring) berhak atas garansi retur?',
          a: 'Pesanan bespoke disesuaikan khusus dengan ukuran tubuh Anda. Garansi retur tunai tidak berlaku untuk pesanan kustom, namun kami menyediakan layanan penyesuaian (alterasi gratis) hingga pas.'
        }
      ]
    },
    {
      id: '04',
      badge: 'BAGIAN 04',
      category: 'Autentikasi & Kualitas Serat',
      title: 'Autentikasi, Spektrometri & Kualitas Serat',
      count: '3 PERTANYAAN',
      items: [
        {
          code: '04.1',
          q: 'Bagaimana cara kurator DigiMarket membuktikan keaslian serat kain organik (GOTS, Sutra Ahimsa)?',
          a: 'Laboratorium tekstil internal kami menggunakan analisis spektrometri dan verifikasi dokumen pasokan benang langsung dari perajin certified GOTS (Global Organic Textile Standard) dan pemintal Sutra Ahimsa.'
        },
        {
          code: '04.2',
          q: 'Di mana saya dapat melihat dan memverifikasi sertifikat digital keaslian produk?',
          a: 'Sertifikat keaslian fisik dilampirkan pada kemasan. Versi digital berenkripsi dapat diakses melalui pemindaian kode QR pada sertifikat atau dari halaman rincian pesanan akun Anda.'
        },
        {
          code: '04.3',
          q: 'Apa tindakan tegas DigiMarket terhadap mitra yang terindikasi menjual busana tiruan atau serat sintetis oplosan?',
          a: 'DigiMarket menerapkan kebijakan toleransi nol (Zero Tolerance). Mitra yang terbukti memalsukan material akan di-blacklist secara permanen dan dikenakan sanksi legal sesuai perjanjian kerja sama.'
        }
      ]
    },
    {
      id: '05',
      badge: 'BAGIAN 05',
      category: 'Kemitraan Desainer',
      title: 'Kemitraan Desainer & Standar Etis',
      count: '2 PERTANYAAN',
      items: [
        {
          code: '05.1',
          q: 'Berapa lama proses evaluasi kurasi portofolio desainer baru hingga disetujui tampil di platform?',
          a: 'Proses evaluasi portofolio dan audit standar manufaktur etis berlangsung selama 7 hingga 14 hari kerja oleh Dewan Kurator DigiMarket.'
        },
        {
          code: '05.2',
          q: 'Apa saja standar etika upah perajin yang wajib dipenuhi oleh rumah mode mitra?',
          a: 'Seluruh rumah mode mitra diwajibkan menerapkan prinsip Fair Trade, jaminan lingkungan kerja aman, serta kompensasi di atas standar upah minimum kawasan penjahitan.'
        }
      ]
    },
    {
      id: '06',
      badge: 'BAGIAN 06',
      category: 'Layanan Privé & Atelier Sentra SCBD',
      title: 'Layanan Privé & Atelier Sentra SCBD',
      count: '2 PERTANYAAN',
      items: [
        {
          code: '06.1',
          q: 'Bagaimana cara melakukan reservasi sesi private fitting di Sentra Atelier DigiMarket SCBD?',
          a: 'Anda dapat membuat janji temu melalui menu Kontak Concierge atau menghubungi WhatsApp resmi kami minimal 24 jam sebelum jadwal kunjungan yang diinginkan.'
        },
        {
          code: '06.2',
          q: 'Apakah ada biaya tambahan untuk konsultasi padu padan gaya busana bersama personal stylist?',
          a: 'Layanan konsultasi gaya busana bersama personal stylist senior DigiMarket bersifat gratis tanpa biaya tambahan bagi seluruh anggota terdaftar.'
        }
      ]
    }
  ];

  const toggleAccordion = (code) => {
    setOpenItems(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const filteredData = faqData
    .map(section => {
      if (activeTab !== 'Semua Topik' && section.category !== activeTab) {
        return null;
      }

      const matchingItems = section.items.filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingItems.length === 0) return null;

      return {
        ...section,
        items: matchingItems
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-[#FAF8F5] text-stone-900 font-sans antialiased min-h-screen pb-20">
      
      {/* ================= BREADCRUMB ================= */}
      <nav aria-label="Breadcrumbs" className="border-b border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-mono tracking-wider text-stone-500 uppercase gap-2">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-stone-900 transition">BERANDA</Link>
            <span>/</span>
            <Link to="/support" className="hover:text-stone-900 transition">PUSAT BANTUAN</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">TANYA JAWAB (FAQ LENGKAP)</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>PEMBAHARUAN BERKALA: TERVERIFIKASI TIM KURATOR DIGIMARKET</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 space-y-12">

        {/* ================= HERO SECTION ================= */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-mono tracking-[0.25em] text-stone-500 uppercase block">
            BASIS PENGETAHUAN & PANDUAN PELANGGAN - DIGIMARKET
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
            Jawaban Terkurasi untuk Setiap Pertanyaan Busana Anda
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-serif italic leading-relaxed max-w-2xl mx-auto">
            "Eksplorasi penjelasan mendalam mengenai protokol kurasi serat kain, garansi keaslian 14 hari, alur logistik berinsulasi khusus, serta kemitraan rumah mode independen."
          </p>

          {/* SEARCH BOX */}
          <div className="pt-4 max-w-xl mx-auto space-y-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik kurasi, retur 14 hari, spektrometri serat, atelier..."
                aria-label="Cari pertanyaan FAQ"
                className="w-full bg-white border border-stone-300 pl-11 pr-4 py-3.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition shadow-sm"
              />
            </div>

            {/* PENCARIAN POPULER */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-stone-500">
              <span className="uppercase text-[10px] tracking-wider text-stone-400 mr-1">PENCARIAN POPULER:</span>
              {popularSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(term)}
                  className="hover:text-stone-900 underline underline-offset-2 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURED CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* FIX CSS: bg-gradient-to-t & aspect-[2/1] */}
          <div className="relative aspect-video md:aspect-2/1 overflow-hidden bg-stone-200 group border border-stone-300/80">
            <img
              src="/assets/faq1.jpg"
              alt="Laboratorium Serat Tekstil DigiMarket"
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-3 text-white text-xs font-serif tracking-wide font-medium">
              Laboratorium Serat Tekstil
            </span>
          </div>

          <div className="relative aspect-video md:aspect-2/1 overflow-hidden bg-stone-200 group border border-stone-300/80">
            <img
              src="/assets/faq2.jpg"
              alt="Sentra Fitting SCBD DigiMarket"
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-3 text-white text-xs font-serif tracking-wide font-medium">
              Sentra Fitting SCBD
            </span>
          </div>

          <div className="relative aspect-video md:aspect-2/1 overflow-hidden bg-stone-200 group border border-stone-300/80">
            <img
              src="/assets/faq3.jpg"
              alt="Kemasan Bebas Plastik DigiMarket"
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-3 text-white text-xs font-serif tracking-wide font-medium">
              Kemasan Bebas Plastik
            </span>
          </div>

        </div>

        {/* ================= CATEGORY TABS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200 text-xs font-mono">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-2 whitespace-nowrap transition uppercase tracking-wider text-[11px] ${
                activeTab === cat
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-200/60 text-stone-700 hover:bg-stone-300/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= ACCORDION SECTIONS ================= */}
        <div className="space-y-10">
          {filteredData.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-serif text-lg text-stone-800">Tidak ada pertanyaan yang sesuai</p>
              <p className="text-xs text-stone-500 font-light">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
            </div>
          ) : (
            filteredData.map((section) => (
              <div key={section.id} className="space-y-3">
                
                {/* SECTION HEADER BAR */}
                <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-stone-900 text-white px-2 py-0.5 text-[10px] font-mono tracking-widest font-bold uppercase">
                      {section.badge}
                    </span>
                    <h2 className="font-serif text-lg text-stone-900 font-medium">
                      {section.title}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                    {section.count}
                  </span>
                </div>

                {/* ACCORDION ITEMS */}
                <div className="divide-y divide-stone-200 border-b border-stone-200">
                  {section.items.map((item) => {
                    const isOpen = !!openItems[item.code];
                    return (
                      <div key={item.code} className="bg-white/40 hover:bg-white transition">
                        <button
                          onClick={() => toggleAccordion(item.code)}
                          aria-expanded={isOpen}
                          className="w-full py-4 px-2 flex items-start justify-between text-left gap-4 group"
                        >
                          <span className="text-xs sm:text-sm text-stone-800 font-serif leading-relaxed group-hover:text-stone-900 transition">
                            <span className="font-mono text-stone-400 text-xs mr-2">{item.code}</span>
                            {item.q}
                          </span>
                          <span className="text-stone-400 group-hover:text-stone-800 shrink-0 mt-0.5">
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </span>
                        </button>

                        {/* ACCORDION CONTENT */}
                        {isOpen && (
                          <div className="px-2 pb-5 pt-1 text-xs text-stone-600 font-light leading-relaxed pl-8 border-l-2 border-stone-900 my-2">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}
        </div>

        {/* ================= BOTTOM CALLOUT CARD ================= */}
        <section className="bg-[#EFECE6] border border-stone-300/80 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* LEFT SIDE: CONCIERGE HELP */}
            <div className="md:col-span-8 space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-stone-500 uppercase block font-semibold">
                BANTUAN PERSONAL
              </span>
              
              <h3 className="font-serif text-2xl text-stone-900 font-normal">
                Belum Menemukan Solusi yang Tepat?
              </h3>

              <p className="text-xs text-stone-600 font-light leading-relaxed max-w-xl">
                Tim kurator busana dan konsultan concierge DigiMarket beroperasi setiap hari (08.00 - 22.00 WIB) untuk memberikan panduan spesifik perihal ukuran, perawatan kain, hingga kustomisasi pesanan.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/support/contact"
                  className="bg-stone-900 text-white px-5 py-3 text-[11px] font-mono uppercase tracking-wider hover:bg-stone-800 transition flex items-center gap-2"
                >
                  <span>FORMULIR KONTAK CONCIERGE</span>
                </Link>

                <a
                  href="https://wa.me/6281288002026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-stone-300 text-stone-800 px-5 py-3 text-[11px] font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>CHAT WHATSAPP CONCIERGE</span>
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: POLICY LINKS BOX */}
            <div className="md:col-span-4 bg-white/80 border border-stone-300/70 p-5 space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block font-semibold">
                TAUTAN KEBIJAKAN
              </span>

              <ul className="space-y-2 text-xs text-stone-700 font-light">
                <li>
                  <Link to="/support" className="flex items-center justify-between hover:text-stone-900 transition">
                    <span>Pusat Bantuan Utama</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </Link>
                </li>
                <li className="border-t border-stone-100 pt-2">
                  <Link to="/support/shipping" className="flex items-center justify-between hover:text-stone-900 transition">
                    <span>Kebijakan Pengiriman Lengkap</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </Link>
                </li>
                <li className="border-t border-stone-100 pt-2">
                  <Link to="/about/materials" className="flex items-center justify-between hover:text-stone-900 transition">
                    <span>Standar Sertifikasi Serat</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </Link>
                </li>
                <li className="border-t border-stone-100 pt-2">
                  <Link to="/about" className="flex items-center justify-between hover:text-stone-900 transition">
                    <span>Daftar Desainer Mitra</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </Link>
                </li>
              </ul>

              <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500 font-mono">
                Komitmen Etis DigiMarket: 100% serat bersertifikat, bebas plastik, kompensasi adil perajin lokal.
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}