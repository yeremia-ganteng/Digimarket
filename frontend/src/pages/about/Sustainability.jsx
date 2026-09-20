import { Link } from 'react-router-dom';

export default function Sustainability() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900 font-sans antialiased min-h-screen">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-24">
        
        {/* HERO SECTION */}
        <header className="space-y-8">
          <div className="flex justify-between items-center text-xs tracking-[0.25em] text-stone-500 uppercase font-medium border-b border-stone-200 pb-4">
            <span>05 // TENTANG KAMI & TANGGUNG JAWAB SOSIAL</span>
            <span className="hidden sm:inline">DIGIMARKET SUSTAINABILITY REPORT 2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            <h1 className="lg:col-span-8 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-stone-900 font-normal leading-[1.15] tracking-tight">
              Keanggunan yang Bertanggung Jawab: Dari Tangan Pengrajin Hingga Serat Terakhir
            </h1>
            <p className="lg:col-span-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-2">
              Di DigiMarket, keberlanjutan bukanlah tren sekilas, melainkan komitmen fundamental. Kami memadukan warisan budaya kriya Nusantara dengan etika produksi berstandar internasional demi menjaga bumi dan kehidupan pengrajin.
            </p>
          </div>

          <figure className="space-y-3 pt-4 m-0">
            <div className="relative aspect-video w-full overflow-hidden bg-stone-200 rounded-sm">
              <img
                src="/assets/keberlanjutan1.jpg"
                alt="Dua ibu pengrajin tenun alat tradisional (ATBM) di Desa Sade, Lombok Tengah"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center grayscale contrast-[1.05] brightness-[0.95] hover:grayscale-0 transition duration-700"
              />
            </div>
            <figcaption className="flex justify-between items-center text-[11px] text-stone-500 font-light tracking-wide">
              <span>Dua ibu pengrajin tenun alat tradisional (ATBM) di Desa Sade, Lombok Tengah</span>
              <span>DOKUMENTASI INTERNAL DIGIMARKET</span>
            </figcaption>
          </figure>
        </header>

        {/* KEY METRICS BAR */}
        <section aria-label="Metrik Keberlanjutan" className="border-y border-stone-200 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900">100%</p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-800">Bahan Organik & Daur Ulang</p>
            <p className="text-[11px] text-stone-500 font-light">Seluruh serat kain bersumber dari sertifikasi ramah lingkungan.</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900">40+</p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-800">Pengrajin Lokal Terberdaya</p>
            <p className="text-[11px] text-stone-500 font-light">Kemitraan langsung tanpa perantara di seluruh sentra kriya.</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900">0%</p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-800">Limbah Kimia Berbahaya</p>
            <p className="text-[11px] text-stone-500 font-light">Sistem pengolahan air limbah tertutup tanpa pencemaran sungai.</p>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-3xl sm:text-4xl text-stone-900">87.4%</p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-800">Jejak Karbon Terkurangi</p>
            <p className="text-[11px] text-stone-500 font-light">Logistik terefisiensi dan penggunaan material lokal sirkular.</p>
          </div>
        </section>

        {/* SECTION 01: UPAH LAYAK & HAK PENGRAJIN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase font-medium">HAK WORKFORCE & ETIKA</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-snug">
              01 / Protokol Upah Layak & Hak Pengrajin
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Meningkatkan Kesejahteraan Mitra di Pembuatan Kain Tradisional
            </p>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <p className="text-sm text-stone-700 font-light leading-relaxed">
              Kami menjamin standar upah adil di atas UMR regional bagi seluruh seniman kain. Melalui kerja sama langsung tanpa mata rantai perantara yang panjang, kami memberikan kepastian pendapatan, jaminan perlindungan sosial, serta lingkungan kerja yang aman dan menghormati harkat hidup seniman tradisi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 space-y-2">
                <span className="text-[10px] tracking-wider text-stone-500 uppercase font-semibold">01 / LINGKUNGAN</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Living Wage Direct Transfer</h3>
                <p className="text-xs text-stone-600 font-light leading-normal">
                  Pembayaran langsung ke rekening pengrajin tanpa potongan broker untuk transparansi total.
                </p>
                <span className="inline-block text-[10px] text-stone-400 font-mono pt-2">VALIDATED BY FAIRTRADE</span>
              </div>

              <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 space-y-2">
                <span className="text-[10px] tracking-wider text-stone-500 uppercase font-semibold">02 / SOSIAL</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Proteksi Kesehatan Perempuan</h3>
                <p className="text-xs text-stone-600 font-light leading-normal">
                  Fasilitas pemeriksaan kesehatan berkala & ruang kerja ergonomis bagi para ibu pengrajin tenun.
                </p>
                <span className="inline-block text-[10px] text-stone-400 font-mono pt-2">BPJS TK & KESEHATAN COVERED</span>
              </div>

              <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 space-y-2">
                <span className="text-[10px] tracking-wider text-stone-500 uppercase font-semibold">03 / EDUKASI</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Pelatihan Warisan Budaya</h3>
                <p className="text-xs text-stone-600 font-light leading-normal">
                  Program regenerasi penenun muda untuk memastikan keahlian leluhur tidak punah tergerus zaman.
                </p>
                <span className="inline-block text-[10px] text-stone-400 font-mono pt-2">CULTURAL HERITAGE PROGRAM</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: KEMASAN BEBAS PLASTIK */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-stone-200">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase font-medium">CIRCULAR PACKAGING</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-snug">
              02 / 100% Kemasan Bebas Plastik & Sirkular
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Pengurangan Sampah Konsumen Secara Total
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-5 aspect-square bg-stone-200 overflow-hidden rounded-sm">
              <img
                src="/assets/keberlanjutan2.jpg"
                alt="Kemasan ramah lingkungan produk DigiMarket dari bahan sirkular"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center grayscale contrast-105"
              />
            </div>

            <div className="sm:col-span-7 bg-[#F3EFEA] p-6 border border-stone-200/60 space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-base text-stone-900 font-medium">Dua Lapis Kain Katun Blacu</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Produk dibungkus dengan pouch katun blacu unbleached yang dapat digunakan kembali sebagai kantong serbaguna harian.
                </p>
              </div>
              <div className="space-y-1 border-t border-stone-200/80 pt-3">
                <h3 className="font-serif text-base text-stone-900 font-medium">Kardus Daur Ulang FSC® Certified</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Kotak luar dibuat dari 100% kertas daur ulang tanpa lapisan plastik laminasi sehingga mudah terurai tanah secara alami.
                </p>
              </div>
              <div className="space-y-1 border-t border-stone-200/80 pt-3">
                <h3 className="font-serif text-base text-stone-900 font-medium">Segel Lilin Alam & Tinta Kedelai</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Pencetakan label menggunakan tinta berdasar minyak kedelai (soy-ink) dan perekat berbasis pati singkong alami.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03: AKREDITASI & SERTIFIKASI */}
        <section className="space-y-8 pt-6 border-t border-stone-200">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase font-medium">STANDAR GLOBAL</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              03 / Akreditasi & Sertifikasi Independen
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Kepatuhan penuh pada audit ekologi dan sosial dari lembaga sertifikasi internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">GOTS</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Global Organic Textile Standard</h3>
                <p className="text-xs text-stone-600 font-light">
                  Sertifikasi serat organik tingkat dunia yang menjamin seluruh pemrosesan bahan bebas bahan kimia berbahaya.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">AUDITED ANNUALLY</span>
            </div>

            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">FAIR TRADE</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Fair Trade Certified™</h3>
                <p className="text-xs text-stone-600 font-light">
                  Menjamin kondisi kerja yang adil, perlindungan hak buruh, serta insentif pengembangan komunitas lokal.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">PRODUCER CODE #30491</span>
            </div>

            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">OEKO-TEX</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Standard 100 by OEKO-TEX®</h3>
                <p className="text-xs text-stone-600 font-light">
                  Pengujian ketat terhadap lebih dari 300 zat berbahaya, memastikan produk 100% aman bagi kulit sensitif.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">TESTED FOR HARMFUL SUBSTANCES</span>
            </div>

            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">FSC</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Forest Stewardship Council</h3>
                <p className="text-xs text-stone-600 font-light">
                  Penggunaan kertas packaging yang bersumber dari hutan yang dikelola secara bertanggung jawab dan lestari.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">FSC-C104829</span>
            </div>

            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">B CORP</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">B Corp Certified (Pending)</h3>
                <p className="text-xs text-stone-600 font-light">
                  Komitmen transparansi publik terhadap performa sosial dan lingkungan secara menyeluruh.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">IN ASSESSMENT STAGE</span>
            </div>

            <div className="bg-[#F3EFEA] p-5 border border-stone-200/60 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-mono">WARISAN</span>
                <h3 className="font-serif text-base text-stone-900 font-medium">Mitra Kriya Wastra Nusantara</h3>
                <p className="text-xs text-stone-600 font-light">
                  Diakui oleh Kementerian Pariwisata dan Ekonomi Kreatif sebagai pelestari warisan budaya takbenda.
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">KEMENPAREKRAF VERIFIED</span>
            </div>
          </div>
        </section>

        {/* SECTION 04: PETA KEMITRAAN SENTRA NUSANTARA */}
        <section className="space-y-8 pt-6 border-t border-stone-200">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase font-medium">GEOGRAFI PRODUKSI</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              04 / Peta Kemitraan Sentra Nusantara
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Jaringan sentra tenun & batik artisan yang kami berdayakan secara berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#F3EFEA] p-6 border border-stone-200/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-serif text-lg text-stone-900 font-medium">Tenun Ikat Sumba Timur</h3>
                <span className="text-[10px] text-stone-500 font-mono">NUSA TENGGARA TIMUR</span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Pewarnaan 100% alami menggunakan akar mengkudu (merah) dan daun nila/tarum (biru), membutuhkan waktu pembuatan 3–6 bulan per helai kain.
              </p>
              <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-200">
                12 KOMUNITAS PENGRAJIN • PEWARNAAN ALAMI TOTAL
              </div>
            </div>

            <div className="bg-[#F3EFEA] p-6 border border-stone-200/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-serif text-lg text-stone-900 font-medium">Batik Tulis Cirebon & Pekalongan</h3>
                <span className="text-[10px] text-stone-500 font-mono">JAWA TENGAH & JAWA BARAT</span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Penggunaan malam/malam lebah organik serta sistem pengolahan limbah air (IPAL) komunal agar air sisa malam tidak mencemari tanah.
              </p>
              <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-200">
                18 SANGGAR BATIK • ZERO-TOXIC EFFLUENT
              </div>
            </div>

            <div className="bg-[#F3EFEA] p-6 border border-stone-200/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-serif text-lg text-stone-900 font-medium">Songket Silungkang & Palembang</h3>
                <span className="text-[10px] text-stone-500 font-mono">SUMATERA BARAT & SELATAN</span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Menggunakan benang serat nanas & benang emas daur ulang untuk menciptakan motif geometris peninggalan kerajaan tanpa merusak lingkungan.
              </p>
              <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-200">
                8 KELOMPOK TENUN • RECYCLED METALLIC FIBER
              </div>
            </div>

            <div className="bg-[#F3EFEA] p-6 border border-stone-200/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-serif text-lg text-stone-900 font-medium">Tenun Lurik & Sutra Alam Yogyakarta</h3>
                <span className="text-[10px] text-stone-500 font-mono">DI YOGYAKARTA</span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Pengembangan serat sutra ulat liar dan benang katun lokal berkualitas tinggi, memberdayakan perempuan pedesaan di lereng Merapi.
              </p>
              <div className="text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-200">
                15 SANGGAR LURIK • WILD SILK DEVELOPMENT
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE CALLOUT & CTA */}
        <section className="text-center py-12 px-4 border-t border-stone-200 space-y-8">
          <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-800 italic max-w-3xl mx-auto leading-snug">
            "Keberlanjutan bukanlah tren sesaat dalam kalender mode, melainkan janji seumur hidup kami kepada tanah air dan peradaban."
          </blockquote>
          
          <p className="text-xs text-stone-500 tracking-wider uppercase font-medium">
            TIM MANAJEMEN & SENIMAN KRIYA DIGIMARKET
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/catalog"
              className="bg-stone-900 text-stone-50 text-xs tracking-wider uppercase px-8 py-3.5 hover:bg-stone-800 transition font-medium"
            >
              JELAJAHI KOLEKSI RAMAH LINGKUNGAN
            </Link>
            <Link
              to="/about"
              className="border border-stone-300 text-stone-800 text-xs tracking-wider uppercase px-8 py-3.5 hover:border-stone-900 transition font-medium"
            >
              BACA CERITA KAMI SELENGKAPNYA
            </Link>
          </div>
        </section>

      </article>
    </main>
  );
}