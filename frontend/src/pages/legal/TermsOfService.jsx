import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Lock, 
  ShoppingBag, 
  Award, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Sparkles
} from 'lucide-react';

export default function TermsOfService() {
  const [activeChapter, setActiveChapter] = useState('bab-01');

  const chapters = [
    { id: 'bab-01', number: '01', title: 'Penerimaan Ketentuan' },
    { id: 'bab-02', number: '02', title: 'Definisi Peran & Entitas' },
    { id: 'bab-03', number: '03', title: 'Ketentuan Akun Pengguna' },
    { id: 'bab-04', number: '04', title: 'Ketentuan Transaksi' },
    { id: 'bab-05', number: '05', title: 'Ketentuan untuk Penjual' },
    { id: 'bab-06', number: '06', title: 'Pengiriman & Pengembalian' },
    { id: 'bab-07', number: '07', title: 'Hak Kekayaan Intelektual' },
    { id: 'bab-08', number: '08', title: 'Batasan Tanggung Jawab' },
    { id: 'bab-09', number: '09', title: 'Penyelesaian Sengketa' },
    { id: 'bab-10', number: '10', title: 'Perubahan Ketentuan' },
    { id: 'bab-11', number: '11', title: 'Kontak & Penasihat Legal' },
  ];

  const scrollToSection = (id) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic SEO Metadata & JSON-LD
  useEffect(() => {
    document.title = "Syarat & Ketentuan Layanan | DigiMarket";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Syarat dan Ketentuan Layanan DigiMarket mencakup aturan transaksi, hak perancang, serta perlindungan konsumen dalam ekosistem mode digital.";

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'terms-schema';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Syarat & Ketentuan Layanan DigiMarket",
      "description": "Prinsip tata kelola kemitraan, hak kontraktual perancang, serta protokol transaksi busana kurasi DigiMarket.",
      "publisher": {
        "@type": "Organization",
        "name": "DigiMarket"
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existingScript = document.getElementById('terms-schema');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // Optimized Scroll Listener dengan Throttling via requestAnimationFrame
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
      
      {/* ================= BREADCRUMB & HEADER PROTOKOL ================= */}
      <nav aria-label="Breadcrumbs" className="border-b border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-mono tracking-wider text-stone-500 uppercase gap-2">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-stone-900 transition">BERANDA</Link>
            <span>/</span>
            <span>PUSAT BANTUAN & LEGAL</span>
            <span>/</span>
            <span className="text-stone-900 font-medium">SYARAT & KETENTUAN</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-800"></span>
            <span>KONTRAK ELEKTRONIK & TRANSPARANSI TATA KELOLA • HUKUM PERDATA ELITE INDONESIA</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 space-y-12">

        {/* ================= HERO TITLE SECTION ================= */}
        <header className="space-y-4 border-b border-stone-200 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
                Syarat & Ketentuan Layanan DigiMarket
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic leading-relaxed">
                "Prinsip tata kelola kemitraan, hak kontraktual perancang, serta protokol transaksi busana kurasi antara kolektor, rumah mode independen, dan platform DigiMarket."
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end space-y-3 text-[10px] sm:text-xs font-mono text-stone-500 uppercase tracking-wider shrink-0">
              <div className="space-y-1 text-left lg:text-right">
                <p>Terakhir Diperbarui: 18 September 2026</p>
                <p>VERSI DOKUMEN: VOL. 3.1.2 - BERLAKU MENGIKAT</p>
                <p className="text-stone-400">STATUS: DOKUMEN RESMI</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-stone-900 text-white px-4 py-2.5 text-[10px] font-mono tracking-widest uppercase hover:bg-stone-800 transition flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>UNDUH DOKUMEN RESMI (PDF)</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= 4 FUNDAMENTAL PILLARS ================= */}
        <section aria-label="Fundamental Pillars" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-200 pb-3 gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-stone-400 uppercase font-bold">
              FUNDAMENTAL PILLARS
            </span>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
              STANDAR PROTOKOL ARSIP DIGITAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PILLAR 1 */}
            <div className="bg-white border border-stone-200/90 p-5 space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-stone-400">PILAR 01</div>
              <h3 className="font-serif text-sm font-medium text-stone-900">Integritas Transaksi</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Perlindungan total transaksi menyeluruh, penyeimbangan ketersediaan aktiva dan transparansi struktur harga bersih tanpa biaya tersembunyi.
              </p>
              <div className="pt-2 text-[9px] font-mono text-stone-400 uppercase border-t border-stone-100 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-stone-700" />
                <span>ESCROW PROTECTED</span>
              </div>
            </div>

            {/* PILLAR 2 */}
            <div className="bg-white border border-stone-200/90 p-5 space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-stone-400">PILAR 02</div>
              <h3 className="font-serif text-sm font-medium text-stone-900">Hak Cipta & Orisinalitas</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Larangan duplikasi produk tiruan atau tiruan komersial, perlindungan komprehensif atas hak cipta karya dan hak kekayaan intelektual perancang.
              </p>
              <div className="pt-2 text-[9px] font-mono text-stone-400 uppercase border-t border-stone-100 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-stone-700" />
                <span>ANTI-PIRACY PLEDGE</span>
              </div>
            </div>

            {/* PILLAR 3 */}
            <div className="bg-white border border-stone-200/90 p-5 space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-stone-400">PILAR 03</div>
              <h3 className="font-serif text-sm font-medium text-stone-900">Garansi Kuratorial 14 Hari</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Jaminan pengembalian dan perlindungan kolektor atas kesesuaian karya arsip, detail dimensi, serta integritas mutu serat busana.
              </p>
              <div className="pt-2 text-[9px] font-mono text-stone-400 uppercase border-t border-stone-100 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-stone-700" />
                <span>14-DAY CURATORIAL PLEDGE</span>
              </div>
            </div>

            {/* PILLAR 4 */}
            <div className="bg-white border border-stone-200/90 p-5 space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-stone-400">PILAR 04</div>
              <h3 className="font-serif text-sm font-medium text-stone-900">Kedaulatan Desainer</h3>
              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                Hubungan kemitraan saling menguntungkan dengan transparansi komisi serta penghormatan penuh terhadap narasi setiap atelier.
              </p>
              <div className="pt-2 text-[9px] font-mono text-stone-400 uppercase border-t border-stone-100 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-stone-700" />
                <span>ATELIER SOVEREIGNTY</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">

          {/* LEFT COLUMN: STICKY TOC */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            <div className="bg-white border border-stone-200/90 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-bold">
                  INDEKS BAB KETENTUAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">11 BAB RESMI</span>
              </div>

              <nav aria-label="Indeks Syarat Layanan" className="space-y-1 text-xs">
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
                      <span className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-stone-400">{ch.number}</span>
                        <span className="truncate">{ch.title}</span>
                      </span>
                      {isActive && <ArrowRight className="w-3 h-3 text-stone-800 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* KONSULTASI CALLOUT */}
            <div className="bg-[#EFECE6] border border-stone-300/80 p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold block">
                • KONSULTASI HUKUM
              </span>
              <h3 className="font-serif text-sm font-medium text-stone-900">Klarifikasi Ketentuan</h3>
              <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                Bila keraguan dan hukum kontraktual memerlukan korespondensi kuratorial, penasihat hukum kami dapat memandu perancangan model.
              </p>
              <button
                onClick={() => scrollToSection('bab-11')}
                className="text-[10px] font-mono uppercase tracking-wider text-stone-900 underline hover:text-stone-600 transition flex items-center gap-1"
              >
                <span>Hubungi Tim Legal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* QUOTE BOX */}
            <div className="p-4 border-l-2 border-stone-300 bg-white/60 text-xs text-stone-600 font-serif italic space-y-1">
              <p>"Keterbukaan kontrak adalah fondasi dari apresiasi karya busana yang bernilai tinggi."</p>
              <p className="text-[9px] font-mono uppercase text-stone-400 not-italic">— DEWAN HUKUM DIGIMARKET</p>
            </div>
          </aside>

          {/* RIGHT COLUMN: CHAPTER DETAILS */}
          <div className="lg:col-span-8 space-y-10">

            {/* BAB 01 */}
            <section id="bab-01" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 01 • PENDAHULUAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 1</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                1. Penerimaan Ketentuan
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
                <span className="float-left text-3xl font-serif leading-none pr-2 pt-1 text-stone-900">D</span>
                engan mengakses atau menggunakan platform DigiMarket, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat pada Syarat & Ketentuan ini beserta Kebijakan Privasi kami. Kesepakatan ini berlaku mengikat secara hukum antara Anda sebagai pemangku kepentingan dan entitas pengelola DigiMarket sejak detik pertama aktivitas interaksi Anda tercatat pada peranti kami.
              </p>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Apabila Anda tidak menyetujui salah satu, sebagian, atau seluruh klausul yang tertuang dalam naskah ketentuan ini, Anda diimbau untuk tidak melanjutkan eksplorasi katalog, pembuatan akun kolektor, pendaftaran kurasi desainer, atau transaksi akuisisi busana di seluruh ekosistem DigiMarket.
              </p>
            </section>

            {/* BAB 02 */}
            <section id="bab-02" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 02 • ENTITAS & PERAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 2</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                2. Definisi Peran
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Untuk mentransparansikan yurisdiksi yang terang benderang dan melindungi kebebasan berkreasi, DigiMarket membedakan peran para pihak dalam ekosistem busana sebagai berikut:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* PEMBELI */}
                <div className="bg-[#FAF8F5] p-4 border border-stone-200/80 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-white border border-stone-200 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-stone-800" />
                    </div>
                    <span className="font-medium text-stone-900 text-xs block">Pembeli / Kolektor</span>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      Pengguna perorangan maupun korporasi yang melakukan penelusuran, reservasi, atau pemesanan karya busana pada platform.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase block pt-2 border-t border-stone-200/60">
                    HAK PERLINDUNGAN PEMBELI
                  </span>
                </div>

                {/* PENJUAL */}
                <div className="bg-[#FAF8F5] p-4 border border-stone-200/80 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-white border border-stone-200 flex items-center justify-center">
                      <Award className="w-4 h-4 text-stone-800" />
                    </div>
                    <span className="font-medium text-stone-900 text-xs block">Penjual / Mitra Desainer</span>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      Pihak rumah mode, perancang independen, atau pemegang lisensi arsip yang memasarkan karya busana orisinal melalui platform DigiMarket.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase block pt-2 border-t border-stone-200/60">
                    KEMITRAAN KESETARAAN ATELIER
                  </span>
                </div>

                {/* DIGIMARKET */}
                <div className="bg-[#FAF8F5] p-4 border border-stone-200/80 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-white border border-stone-200 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-stone-800" />
                    </div>
                    <span className="font-medium text-stone-900 text-xs block">DigiMarket</span>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      Penyedia platform teknologi dan kurasi yang memfasilitasi penemuan dan penjual, dan bukan merupakan pihak dalam transaksi jual-beli secara langsung.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase block pt-2 border-t border-stone-200/60">
                    FASILITATOR & KURATOR
                  </span>
                </div>
              </div>
            </section>

            {/* BAB 03 */}
            <section id="bab-03" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 03 • OTORITAS PENGGUNA
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 3</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                3. Ketentuan Akun
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Untuk menjaga eksklusivitas, akuntabilitas, dan tata kelola hak milik yang aman, pengguna yang mendaftarkan akun pada platform DigiMarket tunduk pada ketentuan sebagai berikut:
              </p>

              <div className="space-y-3 pt-2 text-xs text-stone-700 font-light">
                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <span className="font-mono text-stone-400 font-bold">A.</span>
                  <div>
                    <strong className="text-stone-900 block font-medium mb-0.5">Kecakapan Hukum & Hak Legal</strong>
                    <p className="text-stone-600">Pengguna wajib berusia minimal 18 tahun (atau telah menikah), atau berada di bawah pengawasan langsung dan izin sah dari orang tua/wali hukum.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <span className="font-mono text-stone-400 font-bold">B.</span>
                  <div>
                    <strong className="text-stone-900 block font-medium mb-0.5">Kebenaran Informasi Pendaftaran</strong>
                    <p className="text-stone-600">Seluruh data yang dicantumkan dalam profil otentikasi, alamat korespondensi, detail penagihan harus akurat, mutakhir, dan dapat dipertanggungjawabkan kebenarannya.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <span className="font-mono text-stone-400 font-bold">C.</span>
                  <div>
                    <strong className="text-stone-900 block font-medium mb-0.5">Kerahasiaan Kredensial & Otorisasi</strong>
                    <p className="text-stone-600">Pengguna bertanggung jawab penuh dalam menjaga kerahasiaan kata sandi, kode autentikasi dua-faktor (2FA), dan segala aktivitas yang terjadi di bawah akun terdaftar.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* BAB 04 */}
            <section id="bab-04" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 04 • TRANSAKSI & PEMBAYARAN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 4</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                4. Ketentuan Transaksi
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Setiap pemesanan karya busana pada DigiMarket diproses menggunakan payment gateway terenkripsi dengan mata uang Rupiah (IDR) untuk memastikan kepatuhan atas tata kelola transaksi elektronik.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-stone-200 p-4 space-y-2 bg-[#FAF8F5]">
                  <span className="font-medium text-stone-900 text-xs block">Transparansi Harga & Faktur</span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Seluruh harga karya yang tercantum pada katalog kurasi telah termasuk Pajak Pertambahan Nilai (PPN) yang berlaku sesuai ketentuan perundang-undangan Republik Indonesia, kecuali dinyatakan lain secara eksplisit pada rincian tagihan faktur.
                  </p>
                </div>

                <div className="border border-stone-200 p-4 space-y-2 bg-[#FAF8F5]">
                  <span className="font-medium text-stone-900 text-xs block">Protokol Pembatalan Pesanan</span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Pembatalan pesanan oleh kolektor hanya dapat disetujui apabila status pesanan belum memasuki tahap pengemasan arsip atau penyerahan ke kurir logistik, disesuaikan dengan syarat khusus perancang pada tiap karya atelier independen.
                  </p>
                </div>
              </div>
            </section>

            {/* BAB 05 */}
            <section id="bab-05" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 05 • MITRA KARYA DESAIN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 5</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                5. Ketentuan untuk Penjual
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Setiap perancang busana dan rumah mode yang lolos kurasi berkomitmen menegakkan kehormatan tata kelola karya melalui pedoman operasional berikut:
              </p>

              <ul className="space-y-3 text-xs text-stone-700 font-light pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <span><strong>Jaminan Keaslian & Mutu Serat:</strong> Penjual wajib menjamin keaslian, standar jahitan, komposisi serat kain, dan kualitas produk presisi sesuai narasi dan spesifikasi yang dicantumkan dalam lembar kurasi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <span><strong>Struktur Komisi & Pencairan Dana:</strong> Komisi platform, biaya administrasi kurasi, serta jadwal pencairan saldo penjualan mengikuti perjanjian kemitraan terpisah yang disepakati saat registrasi atelier.</span>
                </li>
              </ul>

              {/* BANNER LARANGAN TIRUAN */}
              <div className="bg-stone-900 text-white p-5 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>LARANGAN TIRUAN & SANKSI HUKUM</span>
                </div>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Dilarang keras memasarkan barang palsu, replika tanpa izin, busana tiruan tidak berlisensi, atau produk pelanggaran bentuk apa pun. Pelanggaran atas klausul ini berakibat penutupan seketika akun mitra, penahanan dana transaksi, serta pelaporan ke otoritas penegak hukum atas dugaan pelanggaran Hak Cipta.
                </p>
              </div>
            </section>

            {/* BAB 06 */}
            <section id="bab-06" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 06 • LOGISTIK & PROTEKSI
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 6</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                6. Pengiriman & Pengembalian
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Demi memelihara keseluruhan karya selama perpindahan tangan dari atelier ke kolektor, DigiMarket menerapkan standar penanganan logistik yang ketat.
              </p>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Kebijakan pengembalian barang, garansi retur 14 hari, dan ketentuan pengembalian dana (garansi kuratorial) sepenuhnya tunduk pada ketentuan operasional yang dijelaskan lebih rinci pada halaman Pusat Bantuan.
              </p>

              <div className="p-4 bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-medium text-stone-900 block">Protokol Retur & Asuransi Pengiriman</span>
                  <p className="text-[11px] text-stone-500 font-light">Pelapis luar verifikasi fisik serat dan pemeriksaan 14 hari.</p>
                </div>
                <Link
                  to="/support/faq"
                  className="bg-white border border-stone-300 px-4 py-2 text-[10px] font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center gap-1 shrink-0"
                >
                  <span>PUSAT BANTUAN RESMI</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </section>

            {/* BAB 07 */}
            <section id="bab-07" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 07 • HAK KEKAYAAN INTELEKTUAL
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 7</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                7. Hak Kekayaan Intelektual
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Seluruh rancangan busana, etiket busana, foto editorial, tipografi arsip, logo identitas, video kuratorial, serta teks narasi yang ditampilkan di platform DigiMarket dilindungi secara penuh oleh hukum hak cipta nasional (Undang-Undang No. 28 Tahun 2014) dan konvensi kekayaan intelektual internasional (WIPO).
              </p>

              <blockquote className="bg-[#FAF8F5] p-5 border-l-2 border-stone-900 text-xs sm:text-sm text-stone-800 font-serif italic leading-relaxed">
                "Tidak ada bagian dari platform maupun karya seni desainer yang boleh digandakan, didistribusikan ulang, dipublikasikan secara komersial, atau direkayasa ulang tanpa izin tertulis sebelumnya dari DigiMarket dan perancang yang bersangkutan."
              </blockquote>
            </section>

            {/* BAB 08 */}
            <section id="bab-08" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 08 • TANGGUNG JAWAB
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 8</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                8. Batasan Tanggung Jawab
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                DigiMarket beroperasi dalam koridor yuridis sebagai penyedia platform perantara elektronik (Intermediary Electronic Platform Provider). Oleh karenanya:
              </p>

              <ul className="space-y-2 text-xs text-stone-700 font-light list-disc list-inside">
                <li>DigiMarket tidak bertanggung jawab atas kerugian tidak langsung, kerugian insidental, kehilangan keuntungan prospektif, atau penurunan nilai emosional yang timbul akibat sengketa antara pembeli dan penjual di luar instruksi platform.</li>
                <li>Batasan ini berlaku sejauh yang diizinkan oleh hukum yang berlaku di yurisdiksi Republik Indonesia, tanpa mengabaikan komitmen penanganan sengketa musyawarah oleh Dewan Kurasi DigiMarket.</li>
              </ul>
            </section>

            {/* BAB 09 */}
            <section id="bab-09" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 09 • REGULASI & YURISDIKSI
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 9</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                9. Penyelesaian Sengketa
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Setiap perselisihan, perbedaan penafsiran, atau sengketa yang timbul dari pelaksanaan syarat ini akan diutamakan penyelesaiannya melalui <strong>musyawarah mufakat</strong> dalam jangka waktu 30 (tiga puluh) hari kalender sejak tanggal surat pemberitahuan resmi diterima.
              </p>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Apabila dalam jangka waktu tersebut tidak tercapai kesepakatan damai, maka para pihak sepakat tanpa syarat untuk menyelesaikan perselisihan tersebut melalui Badan Arbitrase Nasional Indonesia (BANI) atau Kepaniteraan Pengadilan Negeri Jakarta Selatan, sesuai dengan koridor hukum yang berlaku di Negara Kesatuan Republik Indonesia.
              </p>
            </section>

            {/* BAB 10 */}
            <section id="bab-10" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 10 • AMANDEMEN
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 10</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                10. Perubahan Ketentuan
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                DigiMarket memegang hak prerogatif penuh untuk memperbarui, menyempurnakan, atau memodifikasi Syarat & Ketentuan ini sewaktu-waktu guna merespons pembaruan regulasi hukum perdagangan digital dan penyempurnaan fitur kurasi platform.
              </p>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Setiap perubahan material akan diumumkan kepada seluruh pemangku kepentingan secara transparan melalui pengumuman resmi di situs web platform atau notifikasi tertulis ke alamat email terdaftar paling lambat 7 (tujuh) hari sebelum ketentuan baru berlaku efektif.
              </p>
            </section>

            {/* BAB 11 */}
            <section id="bab-11" className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm scroll-mt-6">
              <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                  BAB 11 • KORESPONDENSI LEGAL
                </span>
                <span className="text-[10px] font-mono text-stone-400">PASAL 11</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                11. Kontak & Penasihat Legal
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Untuk korespondensi resmi, pertanyaan mengenai hak cipta, klarifikasi ketentuan pemesanan kolektor, atau surat somasi resmi, silakan menghubungi kantor tata kelola kami:
              </p>

              <div className="bg-[#FAF8F5] p-5 border border-stone-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">SURAT RESMI DEWAN HUKUM</span>
                    <a href="mailto:legal@digimarket.id" className="font-serif text-base text-stone-900 hover:underline block">
                      legal@digimarket.id
                    </a>
                    <span className="text-[10px] font-mono text-stone-400 block">Waktu respons resmi: 1-2 hari kerja</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">HOTLINE WHATSAPP LEGAL</span>
                    <a 
                      href="https://wa.me/622155189000" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-serif text-base text-stone-900 hover:underline block"
                    >
                      +62 21 5518 9000
                    </a>
                    <span className="text-[10px] font-mono text-stone-400 block">Senin – Jumat, 09:00 – 18:00 WIB</span>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">KANTOR PUSAT & SENTRA HUKUM</span>
                  <p className="text-stone-800 font-light">
                    Gedung Sentra Kurasi DigiMarket, SCBD Lot 11, Kawasan Niaga Terpadu Sudirman, Jakarta Selatan, 12190, Indonesia.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="mailto:legal@digimarket.id"
                    className="bg-stone-900 text-white px-5 py-3 text-[10px] font-mono uppercase tracking-wider hover:bg-stone-800 transition flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>HUBUNGI TIM LEGAL</span>
                  </a>
                  <a
                    href="https://wa.me/622155189000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-stone-300 text-stone-800 px-5 py-3 text-[10px] font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-700" />
                    <span>KONSULTASI KEMITRAAN</span>
                  </a>
                </div>
              </div>

              {/* FOOTER VERIFICATION */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-100 uppercase tracking-wider gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>DIGIMARKET GOVERNANCE & LEGAL GUILD</span>
                </div>
                <span>DOKUMEN LEGAL 2026 - V3.1.2</span>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
}