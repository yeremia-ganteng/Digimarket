import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Package, 
  UserCheck, 
  Building2, 
  HelpCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function Contact() {
  const [selectedTopic, setSelectedTopic] = useState('pesanan');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    agreePrivacy: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const topics = [
    { id: 'pesanan', label: 'Pesanan & Pelacakan', icon: Package },
    { id: 'fitting', label: 'Konsultasi Busana & Fitting', icon: UserCheck },
    { id: 'kemitraan', label: 'Kemitraan Desainer & Brand', icon: Building2 },
    { id: 'garansi', label: 'Garansi & Pengembalian', icon: ShieldCheck },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreePrivacy) return;
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900 font-sans antialiased min-h-screen pb-20">
      
      {/* ================= BREADCRUMB & SUB-HEADER ================= */}
      <nav aria-label="Breadcrumbs" className="border-b border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-mono tracking-wider text-stone-500 uppercase gap-2">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-stone-900 transition">BERANDA</Link>
            <span>&gt;</span>
            <span>PUSAT BANTUAN</span>
            <span>&gt;</span>
            <span className="text-stone-900 font-medium">CONCIERGE INQUIRY</span>
          </div>
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>KONSULTASI TERJADWAL | WAKTU RESPON &lt; 24 JAM</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 space-y-16">

        {/* ================= HERO SECTION ================= */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/60 border border-stone-300/70 rounded-full text-[10px] font-mono tracking-widest text-stone-700 uppercase">
            <span>PUSAT BANTUAN & CONCIERGE</span>
            <span>•</span>
            <span>KOORDINASI RESMI</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
            Hubungi Tim Concierge DigiMarket
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Ada pertanyaan seputar kurasi busana, verifikasi pesanan, kemitraan desainer, atau bantuan teknis? Sampaikan pesan Anda, kurator kami akan membalas secara personal dalam kurun waktu 1x24 jam kerja.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-light text-stone-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-700" /> Privasi Terjamin
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-stone-700" /> Kurator Manusia Nyata
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-700" /> Atelier Terbuka
            </span>
          </div>
        </section>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-7 bg-white border border-stone-200/90 p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-stone-200 pb-5">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold block">
                FORMULIR KOMUNIKASI KHUSUS
              </span>
              <h2 className="font-serif text-2xl text-stone-900 font-normal">
                Kirimkan Pengajuan Tertulis
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Setiap catatan ditinjau langsung oleh staf operasional senior dan pengadaan mode kami.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#F3EFEA] border border-stone-300/80 p-8 text-center space-y-4 my-6">
                <CheckCircle2 className="w-10 h-10 text-stone-800 mx-auto" />
                <h3 className="font-serif text-xl text-stone-900">Pesan Anda telah Terkirim</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                  Terima kasih telah menghubungi Tim Concierge DigiMarket. Salinan pengajuan telah dikirimkan ke email Anda. Kurator kami akan membalas secara personal.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-mono uppercase tracking-wider text-stone-900 underline pt-2 hover:text-stone-600"
                >
                  KIRIM PESAN BARU
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                {/* NAMA LENGKAP */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-medium">
                    NAMA LENGKAP PEMOHON <span className="text-stone-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F5F3EF] border border-stone-200 px-4 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label htmlFor="emailAddress" className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-medium">
                    ALAMAT SURAT ELEKTRONIK <span className="text-stone-400">*</span>
                  </label>
                  <input
                    id="emailAddress"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F5F3EF] border border-stone-200 px-4 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
                  />
                </div>

                {/* KLASIFIKASI KEBUTUHAN */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-medium">
                    KLASIFIKASI KEBUTUHAN / POKOK BAHASAN <span className="text-stone-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      const isSelected = selectedTopic === t.id;
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setSelectedTopic(t.id)}
                          className={`flex items-center gap-2.5 px-3.5 py-3 text-left border text-xs transition ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-[#F5F3EF] text-stone-700 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                          <span className="font-light truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RINCIAN PESAN */}
                <div className="space-y-1.5">
                  <label htmlFor="messageDetails" className="block text-[11px] font-mono uppercase tracking-wider text-stone-800 font-medium">
                    RINCIAN PESAN CONCIERGE <span className="text-stone-400">*</span>
                  </label>
                  <textarea
                    id="messageDetails"
                    rows={5}
                    required
                    placeholder="Tuliskan detail pertanyaan atau kendala pesanan Anda (misal: nomor order, ukuran, preferensi bahan, atau pertanyaan seputar pengiriman)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F5F3EF] border border-stone-200 p-4 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition leading-relaxed resize-none"
                  />
                </div>

                {/* PRIVACY CHECKBOX */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    checked={formData.agreePrivacy}
                    onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                    className="mt-0.5 rounded-none border-stone-300 text-stone-900 focus:ring-stone-800 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="text-[11px] text-stone-500 font-light leading-snug cursor-pointer">
                    Saya menyetujui pemrosesan data pribadi sesuai dengan <Link to="/privacy" className="underline text-stone-800">Kebijakan Privasi DigiMarket</Link>. Data pesan Anda akan disimpan secara terenkripsi.
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-stone-900 text-white px-8 py-3.5 text-xs font-mono uppercase tracking-widest hover:bg-stone-800 transition flex items-center justify-center gap-3"
                  >
                    <span>KIRIM PESAN CONCIERGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Estimasi balasan: &lt; 45 menit
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: CARDS & INFO */}
          <div className="lg:col-span-5 space-y-6">

            {/* CARD 1: SALURAN KOMUNIKASI LANGSUNG */}
            <div className="bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold">
                  SALURAN KOMUNIKASI LANGSUNG
                </span>
                <span className="w-2 h-2 rounded-full bg-stone-900"></span>
              </div>

              <div className="space-y-5 text-xs">
                {/* EMAIL */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block">
                    SURAT ELEKTRONIK KURATORIAL
                  </span>
                  <a href="mailto:concierge@digimarket.id" className="font-serif text-lg text-stone-900 hover:underline block">
                    concierge@digimarket.id
                  </a>
                  <p className="text-stone-500 font-light text-[11px]">
                    Tanggapan resmi dalam 1-2 jam operasional untuk kebutuhan mendesak.
                  </p>
                </div>

                {/* PHONE / WA */}
                <div className="space-y-1 border-t border-stone-100 pt-4">
                  <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block">
                    LAYANAN TELEPON & WHATSAPP
                  </span>
                  {/* FIX SECURITY: Added rel="noopener noreferrer" */}
                  <a href="https://wa.me/6281288002026" target="_blank" rel="noopener noreferrer" className="font-serif text-lg text-stone-900 hover:underline block">
                    +62 812-8800-2026
                  </a>
                  <p className="text-stone-500 font-light text-[11px] leading-relaxed">
                    Senin – Sabtu, 09.00 – 21.00 WIB. Didampingi kurator konsultan busana.
                  </p>
                </div>

                {/* ATELIER ADDRESS */}
                <div className="space-y-1 border-t border-stone-100 pt-4">
                  <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block">
                    ATELIER & SENTRA KURASI PUSAT
                  </span>
                  <address className="not-italic font-medium text-stone-900 leading-relaxed">
                    DigiMarket Atelier, SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan 12190
                  </address>
                  <p className="text-stone-500 font-light text-[11px] pt-0.5">
                    Kunjungan tatap muka memerlukan reservasi 24 jam sebelumnya.
                  </p>
                </div>
              </div>

              {/* NOTICE BOX */}
              <div className="bg-[#F5F3EF] p-4 border border-stone-200/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Komitmen Manusiawi Kami
                </span>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Kami menolak penggunaan kecerdasan buatan/bot otomatis yang kaku. Setiap pesan Anda diperiksa dan ditanggapi secara langsung oleh tim kurasi busana profesional.
                </p>
              </div>
            </div>

            {/* CARD 2: LOKASI & NAVIGASI */}
            <div className="bg-white border border-stone-200/90 p-6 space-y-5 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-3">
                <span>LOKASI SENTRA ATELIER</span>
                <span>JAKARTA SELATAN</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-1 bg-stone-100 text-[10px] font-mono uppercase tracking-wider text-stone-700 border border-stone-200">
                    ATELIER UTAMA & CONCIERGE
                  </span>
                  <h3 className="font-serif text-base text-stone-900 font-medium">DigiMarket SCBD</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan 12190
                  </p>
                </div>

                <div className="text-[11px] font-mono text-stone-500 space-y-1.5 pt-3 border-t border-stone-100">
                  <p>• Senin – Sabtu: 10.00 – 20.00 WIB</p>
                  <p>• Minggu & Libur: Dengan Janji Temu</p>
                  <p>• VIP Valet Parking: Lobby Utama Lot 11</p>
                </div>

                <a
                  href="https://maps.google.com/?q=SCBD+Lot+11+Jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-stone-800 transition w-full text-center mt-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>PETUNJUK GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            {/* CARD 3: ETIKA PELAYANAN */}
            <div className="bg-white border border-stone-200/90 p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400 block">
                ETIKA PELAYANAN
              </span>
              <div className="flex gap-4 items-start">
                <div className="w-20 h-16 bg-stone-200 shrink-0 overflow-hidden rounded-sm">
                  {/* FIX SEO: Added loading="lazy" */}
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300"
                    alt="Suasana Atelier Kurasi Busana DigiMarket"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-medium text-stone-900">
                    Pusat Autentikasi & Restorasi
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light leading-snug">
                    Pelajari tindakan kami berfasilitas transparansi, sertifikasi autentisitas, dan kepedulian rekrutmen lokal.
                  </p>
                  <Link to="/about" className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-stone-900 pt-1 hover:underline">
                    <span>Baca Komitmen Etik DigiMarket</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= METRICS BAR ================= */}
        <div className="border-y border-stone-200 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">98.4%</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">TINGKAT KEPUASAN KLIEN</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">&lt; 45m</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">RATA-RATA WAKTU RESPONSE</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">100%</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">PEMERIKSAAN KURATOR FISIK</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">SCBD</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">SENTRA ATELIER UTAMA</p>
          </div>
        </div>

        {/* ================= BOTTOM FAQ CALLOUT CARD ================= */}
        <section className="bg-[#EFECE6] border border-stone-300/70 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <div className="w-10 h-10 bg-white border border-stone-300 mx-auto flex items-center justify-center text-stone-800 shadow-sm">
            <HelpCircle className="w-5 h-5" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Mencari Solusi Mandiri Tanpa Menunggu?
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Jelajahi panduan komprehensif, daftar tanya jawab (FAQ), panduan penentuan ukuran, dan instruksi pengiriman di Pusat Bantuan DigiMarket.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/support"
              className="w-full sm:w-auto bg-stone-900 text-white px-6 py-3 text-xs font-mono uppercase tracking-wider hover:bg-stone-800 transition flex items-center justify-center gap-2"
            >
              <span>JELAJAHI PUSAT BANTUAN</span>
              <Search className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/orders"
              className="w-full sm:w-auto bg-white border border-stone-300 text-stone-800 px-6 py-3 text-xs font-mono uppercase tracking-wider hover:border-stone-900 transition flex items-center justify-center gap-2"
            >
              <span>LACAK STATUS PESANAN</span>
              <Package className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}