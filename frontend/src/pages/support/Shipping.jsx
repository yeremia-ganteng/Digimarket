import { useState } from 'react';
import { Link } from 'react-router-dom';
import {  
  Truck, 
  Box, 
  ChevronDown, 
  ChevronUp, 
  PackageCheck,
  Building2,
  Info
} from 'lucide-react';

export default function Shipping() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apakah seluruh pengiriman busana di DigiMarket otomatis diasuransikan?',
      a: 'Ya, 100% pengiriman seluruh koleksi busana dan produk di DigiMarket dilindungi oleh asuransi penuh tanpa biaya tambahan. Jika terjadi kehilangan atau kerusakan saat transit, kami menjamin garansi penggantian utuh atau refund sepenuhnya.'
    },
    {
      q: 'Bisakah saya menentukan jam pengantaran khusus sama konsultan concierge?',
      a: 'Tentu saja. Khusus untuk area Jabodetabek yang dilayani oleh DigiMarket Dedicated Fleet, Anda dapat menjadwalkan jam pengantaran spesifik sesuai waktu luang Anda melalui komunikasi dengan tim Concierge kami.'
    },
    {
      q: 'Bagaimana jika kemasan luar basah atau rusak saat diantar oleh kurir?',
      a: 'Seluruh lapisan dalam kemasan kami dibekali perlindungan kedap air berbasis lilin alami dan katun desikan. Namun apabila kotak luar mengalami kerusakan fisik yang parah, Anda berhak menolak penerimaan paket dan tim kuratorial kami akan segera mengirimkan gantinya.'
    },
    {
      q: 'Apakah DigiMarket melayani pengiriman khusus ke luar negeri (internasional)?',
      a: 'Ya, kami menyediakan pengiriman internasional terkurasi ke lebih dari 40 negara mitra melalui ekspedisi prioritas global (DHL Express / FedEx) lengkap dengan penanganan dokumen pabean dan kurasi bea cukai.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 font-sans antialiased min-h-screen pb-20">
      
      {/* ================= BREADCRUMB & TOP BAR ================= */}
      <nav aria-label="Breadcrumbs" className="border-b border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-mono tracking-wider text-stone-500 uppercase gap-2">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-stone-900 transition">BERANDA</Link>
            <span>&gt;</span>
            <Link to="/support" className="hover:text-stone-900 transition">PUSAT BANTUAN</Link>
            <span>&gt;</span>
            <span className="text-stone-900 font-medium">KEBIJAKAN PENGIRIMAN</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>STANDAR DISTRIBUSI KONTROL • JANGKAUAN 34 PROVINSI</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 space-y-20">

        {/* ================= HERO SECTION ================= */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/60 border border-stone-300/70 rounded-full text-[10px] font-mono tracking-widest text-stone-700 uppercase">
            <span>LOKAL & INTERNASIONAL BUSANA</span>
            <span>•</span>
            <span>LOGISTIK RESMI</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
            Setiap Jahitan Menempuh Perjalanan dengan Kehormatan
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Pengiriman setiap karya kebudayaan/busana dirancang agar tiba dalam kondisi sempurna, menjaga keaslian bentuk, dan dibungkus dengan ramah lingkungan tanpa plastik sekali pakai.
          </p>

          {/* METRICS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-stone-200 mt-8">
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">100%</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-800 font-semibold">ASURANSI FULLCOVER</p>
              <p className="text-[11px] text-stone-500 font-light">Setiap pengiriman diasuransikan penuh tanpa biaya tambahan.</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">0%</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-800 font-semibold">PLASTIK SEKALI PAKAI</p>
              <p className="text-[11px] text-stone-500 font-light">100% bahan kemasan terdaur ulang & terurai (biodegradable).</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">1–2 HARI</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-800 font-semibold">EXPRESS CITO JAKARTA</p>
              <p className="text-[11px] text-stone-500 font-light">Layanan antar cepat kurir khusus area SCBD/Jabodetabek.</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">34</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-800 font-semibold">PROVINSI TERJANGKAU</p>
              <p className="text-[11px] text-stone-500 font-light">Jangkauan pengiriman aman ke seluruh wilayah Indonesia.</p>
            </div>
          </div>
        </section>

        {/* ================= BAB 01: METODE KEMASAN KHUSUS ================= */}
        <section className="space-y-8">
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
              BAB 01 / METODE KEMASAN KHUSUS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Seni Mengemas Hasil Karya Tanah Air
            </h2>
            <p className="text-xs text-stone-600 font-light max-w-2xl">
              Setiap pesanan dikemas secara khusus oleh staf spesialis kami dengan cermat, tahan benturan, dan kedap air, menjaga wujud busana agar tidak kusut saat tiba di rumah Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT: PACKAGING IMAGE */}
            <div className="lg:col-span-5 relative group overflow-hidden bg-stone-200 border border-stone-300">
              <img
                src="/assets/kemasan.jpg"
                alt="Kemasan Biodegradable Kurasi DigiMarket"
                loading="lazy"
                className="w-full h-95 object-cover grayscale contrast-125 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-stone-900/10"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 border border-stone-300 text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-800 font-semibold">
                  KEMASAN BIODEGRADABLE / KOLEKSI TERKURASI
                </p>
                <p className="text-[10px] text-stone-500 font-light">
                  Bahan terurai alami yang dibubuhi minyak aromatik lavender segar & stempel lilin asli.
                </p>
              </div>
            </div>

            {/* RIGHT: PACKAGING FEATURES LIST */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-1.5 border-l-2 border-stone-800 pl-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">01</span>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Dust Bag Katun Mentah 100%
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Kantong kain katun murni tanpa pemutih kimia untuk perlindungan busana. Bahan bernapas alami untuk mencegah kelembapan dan bau selama pengantaran maupun penyimpanan.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-stone-300 pl-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">02</span>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Karton Gelombang FSC® Terdaur Ulang
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed uppercase tracking-tight">
                    KOTAK PELINDUNG BERSTRUKTUR TINGGI YANG TAHAN BENTURAN DAN KERUSAKAN CUACA. DILAPISI LILIN BEESWAX ALAMI AGAR TAHAN AIR TANPA LAMINASI SINTETIS.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-stone-300 pl-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">03</span>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Kantong Desikan Silika Berbasis Tanah Liat
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Penyerap kelembapan alami berbasis bentonit clay, bebas racun dan aman bagi kain sensitif seperti sutra, wol, tenun maupun kain tradisional.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-stone-300 pl-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">04</span>
                  <h3 className="font-serif text-base text-stone-900 font-medium">
                    Segel Lilin Biji Flax & Tali Rami Alami
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Sentuhan akhir berupa segel lilin tradisional buatan tangan dan ikatan rami alami. Memberikan jaminan penuh bahwa kemasan belum pernah dibuka sejak keluar dari atelier.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= BAB 02: TARIF & ESTIMASI PENGIRIMAN NASIONAL ================= */}
        <section className="space-y-6">
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
              BAB 02 / ESTIMASI & TARIF NASIONAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Layanan Terstruktur Seluruh Wilayah
            </h2>
            <p className="text-xs text-stone-600 font-light max-w-2xl">
              Berikut adalah acuan pengiriman standar ke berbagai wilayah Indonesia. Pengiriman khusus dapat dikoordinasikan langsung dengan tim concierge kami.
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-650">
              <thead>
                <tr className="bg-[#F5F3EF] border-b border-stone-200 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">WILAYAH & JANGKAUAN</th>
                  <th className="py-3.5 px-6 font-semibold">ESTIMASI WAKTU</th>
                  <th className="py-3.5 px-6 font-semibold">MITRA LOGISTIK UTAMA</th>
                  <th className="py-3.5 px-6 font-semibold text-right">TARIF STANDAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs text-stone-800">
                <tr className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <p className="font-medium text-stone-900">Jabodetabek</p>
                    <p className="text-[11px] text-stone-500 font-light">Jakarta, Bogor, Depok, Tangerang, Bekasi</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-stone-700">1 – 2 Hari Kerja</td>
                  <td className="py-4 px-6 text-stone-600 font-light">DigiMarket Dedicated Fleet / Express Cito</td>
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="block font-medium">Rp 25.000</span>
                    <span className="text-[10px] text-emerald-700 font-sans">Gratis &gt; Rp 1,5M</span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <p className="font-medium text-stone-900">Jawa, Bali & NTB</p>
                    <p className="text-[11px] text-stone-500 font-light">Bandung, Semarang, Surabaya, Denpasar, Mataram, dll</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-stone-700">2 – 3 Hari Kerja</td>
                  <td className="py-4 px-6 text-stone-600 font-light">Paxel Same Day / JNE YES / Pos Indonesia</td>
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="block font-medium">Rp 45.000 – Rp 65.000</span>
                    <span className="text-[10px] text-stone-400 font-sans">Sesuai Berat</span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <p className="font-medium text-stone-900">Sumatera & Kalimantan</p>
                    <p className="text-[11px] text-stone-500 font-light">Medan, Palembang, Balikpapan, Pontianak, Banjarmasin, dll</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-stone-700">3 – 4 Hari Kerja</td>
                  <td className="py-4 px-6 text-stone-600 font-light">Garuda Cargo Door-to-Door / JNE Trucking / Cargo</td>
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="block font-medium">Rp 55.000 – Rp 95.000</span>
                    <span className="text-[10px] text-stone-400 font-sans">Sesuai Berat</span>
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <p className="font-medium text-stone-900">Sulawesi, NTT, Maluku & Papua</p>
                    <p className="text-[11px] text-stone-500 font-light">Makassar, Manado, Kupang, Ambon, Jayapura, dll</p>
                  </td>
                  <td className="py-4 px-6 font-mono text-stone-700">3 – 5 Hari Kerja</td>
                  <td className="py-4 px-6 text-stone-600 font-light">POS Indonesia Air Express / JNE Cargo / Paxel Air</td>
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="block font-medium">Rp 85.000 – Rp 150.000</span>
                    <span className="text-[10px] text-stone-400 font-sans">Sesuai Berat</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* HIGHLIGHT NOTE BOX */}
          <div className="bg-[#F5EFEE] border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 font-light leading-relaxed">
              <strong className="font-medium text-stone-900">Pelindung Ekstra Khusus (Hanger Box):</strong> Untuk produk jas, gaun, dan busana berstruktur tinggi, kami menyediakan layanan pengiriman dengan Hanger Box khusus agar busana tiba dalam posisi tergantung tanpa lipatan.
            </p>
          </div>
        </section>

        {/* ================= BAB 03: MITRA LOGISTIK TERPERCAYA ================= */}
        <section className="space-y-6">
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
              BAB 03 / KEMITRAAN EKSPEDISI / PARTNERS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Mitra Logistik Terkurasi Khusus
            </h2>
            <p className="text-xs text-stone-600 font-light max-w-2xl">
              Kami bekerja sama dengan mitra pengiriman terpercaya di Indonesia untuk memastikan kelancaran dan keamanan pengiriman barang tinggi nilai ke tujuan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1 */}
            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-base text-stone-900 font-medium">DigiMarket Dedicated Fleet</h3>
                  <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Armada eksekutif internal khusus area Jabodetabek. Penanganan privat, seragam resmi, dan pengantaran langsung pada hari yang sama.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
                <span>LAYANAN EXECUTIVE DAY</span>
                <span className="font-bold text-stone-900">JABODETABEK</span>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-base text-stone-900 font-medium">Paxel Prioritas</h3>
                  <Box className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Solusi cold-chain & handling khusus busana premium/aksesoris untuk wilayah kota-kota besar di Jawa, Bali, dan Makassar.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
                <span>LAYANAN COLD & DRY TRANSIT</span>
                <span className="font-bold text-stone-900">JAWA & BALI</span>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-base text-stone-900 font-medium">JNE Premium & YES</h3>
                  <Truck className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Mitra ekspedisi udara utama dengan pengiriman Yakin Esok Sampai. Melayani jangkauan terluas hingga pelosok daerah Indonesia.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
                <span>LAYANAN AIR FREIGHT EXPRESS</span>
                <span className="font-bold text-stone-900">NASIONAL</span>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-base text-stone-900 font-medium">Garuda Indonesia Cargo</h3>
                  <PackageCheck className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Pengiriman kargo udara prioritas khusus pulau-pulau luar Jawa untuk barang koleksi khusus/volume besar dengan perlindungan ruang khusus pesawat.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
                <span>LAYANAN AIRPORT TO DOOR</span>
                <span className="font-bold text-stone-900">ANTAR PULAU</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BAB 04: PROSES PELACAKAN ================= */}
        <section className="space-y-6">
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
              BAB 04 / PROSES PELACAKAN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Prosedur Pelacakan & Transparansi
            </h2>
            <p className="text-xs text-stone-600 font-light max-w-2xl">
              Alur transparan yang memampukan Anda memantau seluruh perjalanan kiriman dari tangan kurator hingga tiba dengan aman di hadapan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 p-6 space-y-3 relative">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">TAHAP 01</span>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Notifikasi & Resi</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Begitu paket Anda dikemas, nomor resi unik beserta tautan lacak real-time akan dikirimkan via WhatsApp dan Email resmi kami.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 space-y-3 relative">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">TAHAP 02</span>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Pemantauan Presisi</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Melalui menu "Lacak Pesanan" di website atau aplikasi, Anda dapat memantau posisi aktual armada logistik kami.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 space-y-3 relative">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">TAHAP 03</span>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Garansi Serah & Unboxing</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Petugas kami akan meminta konfirmasi tanda tangan/foto unboxing resmi untuk memastikan kiriman diterima dengan utuh tanpa kerusakan.
              </p>
            </div>
          </div>
        </section>

        {/* ================= BAB 05: PERTANYAAN SEPUTAR PENGIRIMAN ================= */}
        <section className="space-y-6">
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
              BAB 05 / PERTANYAAN SEPUTAR PENGIRIMAN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Hal yang Sering Ditanyakan
            </h2>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4 px-2 sm:px-4">
                <button
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  className="w-full flex justify-between items-center text-left gap-4 group"
                >
                  <span className="font-serif text-sm sm:text-base text-stone-900 font-medium group-hover:text-stone-600 transition">
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="pt-3 pb-1 text-xs text-stone-600 font-light leading-relaxed max-w-3xl">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= BOTTOM CUSTOM LOGISTICS CALLOUT ================= */}
        <section className="bg-[#EFECE6] border border-stone-300/80 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold block">
            LAYANAN KHUSUS BANTUAN LOGISTIK / CUSTOM LOGISTICS
          </span>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Memiliki Permintaan Khusus Terkait Pengiriman Koleksi Anda?
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Apakah Anda memerlukan pengiriman khusus, armada lapis baja, alamat rahasia/anonim, atau instruksi khusus untuk penanganan busana bernilai tinggi? Tim concierge kami siap membantu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/support/contact"
              className="w-full sm:w-auto bg-stone-900 text-white px-8 py-3.5 text-xs font-mono uppercase tracking-wider hover:bg-stone-800 transition flex items-center justify-center gap-2"
            >
              <span>HUBUNGI TIM CONCIERGE</span>
            </Link>
            <Link
              to="/orders"
              className="w-full sm:w-auto bg-white border border-stone-300 text-stone-800 px-8 py-3.5 text-xs font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center justify-center gap-2"
            >
              <span>LACAK PESANAN</span>
            </Link>
          </div>

          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest pt-2">
            LAYANAN 24/7 | RESPON &lt; 15 MENIT • concierge@digimarket.id • WHATSAPP +62 812-8800-2026
          </p>
        </section>

      </main>
    </div>
  );
}