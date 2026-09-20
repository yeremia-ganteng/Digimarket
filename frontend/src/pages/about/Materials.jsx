import { useState } from 'react';

const PATINA_STAGES = [
  {
    stage: 'Hari 1',
    label: 'Bulan ke-0 (Awal)',
    desc: 'Lapisan awal berpori matte lembut dengan aroma tanin hangat dari kayu mimosa segar.',
  },
  {
    stage: 'Tahun 1',
    label: 'Tahun ke-1 (Oksidasi Awal)',
    desc: 'Warna berangsur menggelap menjadi cokelat muda keemasan akibat kontak halus dengan minyak alami.',
  },
  {
    stage: 'Tahun 2',
    label: 'Tahun ke-2 (Pengembangan Karakter)',
    desc: 'Kilau alami (patina) mulai terbentuk sempurna di area yang sering tersentuh, meningkatkan keluwesan struktur kulit.',
  },
  {
    stage: 'Tahun 3+',
    label: 'Tahun ke-3 (Maturitas Sempurna)',
    desc: 'Warna karamel pekat yang kaya, permukaan mengilap alami (amber glow), dan memiliki ketahanan gores yang lebih kuat.',
  },
];

const PROTOCOL_STEPS = [
  {
    num: '01',
    badge: 'Mekanis',
    title: 'Uji Densitas Tenun & Regang Tarik (GSM Check)',
    desc: 'Pengujian mikroskopis hitung helai pakan dan lusi per inci persegi. Toleransi variasi regangan tidak melebihi 2.3% di bawah beban gravitasi dinamis.',
  },
  {
    num: '02',
    badge: 'Biokimia',
    title: 'Verifikasi Pewarna Botani Tanpa Residu Toksik',
    desc: 'Ekstraksi daun tarum Indigo strobilanthes cusia, kulit kayu mahoni, dan sabut kelapa. Uji ketahanan luntur air garam dan sinar UV spektrum penuh.',
  },
  {
    num: '03',
    badge: 'Ergonomi',
    title: 'Sensori Taktil & Uji Jatuh Kain (Drape Ratio)',
    desc: 'Pemeriksaan keluwesan melipat serat saat membentuk lekuk tubuh dan furnitur. Memastikan tidak ada kekakuan atau sensasi lengket akibat pewarna.',
  },
  {
    num: '04',
    badge: 'Abrasi',
    title: 'Ketahanan Gesek Martindale (+35.000 Putaran)',
    desc: 'Simulasi siklus gesekan intensif selama 15 tahun pemakaian normal tanpa timbul serabut lepas (pilling) maupun pergeseran ikatan benang.',
  },
  {
    num: '05',
    badge: 'Etika',
    title: 'Sertifikasi Ketertelusuran Rantai Pasok Etis',
    desc: 'Pencatatan silsilah sumber mentah, nama kelompok kemitraan, pemanennya, hingga pabrik samak demi transparansi sirkular 100% bebas perbudakan tenaga kerja.',
  },
];

export default function Materials() {
  const [activePatina, setActivePatina] = useState(0);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1816] font-['Plus_Jakarta_Sans',sans-serif] py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-12">
        
        {/* HEADER & MANIFESTO */}
        <header className="space-y-6">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-500 block">
            &bull; DOKUMENTASI MANIFESTO KARYA 04
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-900 font-normal leading-tight">
            Integritas Serat &<br className="hidden sm:inline" /> Ketelitian Material
          </h1>
          <p className="font-serif italic text-lg sm:text-2xl text-stone-700 leading-relaxed pt-2">
            &ldquo;Kami menolak kepalsuan komposit sintetis. Setiap milimeter materi dipilih atas kemampuannya untuk bernapas, menua secara bermartabat, dan membentuk patina yang merekam jejak waktu.&rdquo;
          </p>
          <div className="flex flex-wrap gap-8 text-xs text-stone-600 font-mono pt-4 border-t border-stone-200/80">
            <div>
              <span className="text-stone-400 block text-[10px]">LOKASI UJI TEKSTIL</span>
              <span className="font-medium text-stone-800">Yogyakarta</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">REVISI KURASI</span>
              <span className="font-medium text-stone-800">Q1/2025</span>
            </div>
          </div>
        </header>

        {/* STATS BAR */}
        <section aria-label="Statistik Utama Material" className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-y border-stone-200/80">
          <div className="bg-stone-100/70 p-4 rounded-xl border border-stone-200/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase tracking-wider">STANDAR KEASLIAN</span>
            <span className="font-semibold text-stone-900 text-xs sm:text-sm">100% Organik & Nabati</span>
          </div>
          <div className="bg-stone-100/70 p-4 rounded-xl border border-stone-200/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase tracking-wider">UJI KETAHANAN</span>
            <span className="font-semibold text-stone-900 text-xs sm:text-sm">&gt;35.000 Martindale</span>
          </div>
          <div className="bg-stone-100/70 p-4 rounded-xl border border-stone-200/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase tracking-wider">SIKLUS HIDUP</span>
            <span className="font-semibold text-stone-900 text-xs sm:text-sm">Seumur Hidup</span>
          </div>
        </section>

        {/* PILAR 01 - TEKSTIL */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
            <span>Pilar 01 &bull; Tekstil</span>
            <span>GSM 280 &bull; Pintal Tangan</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-medium leading-snug">
            Serat Alami Pilihan: Linen Belgia & Sutra Liar Nusantara
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Linen organik yang dipanen dari batang tanaman rami Belgia dipadukan dengan kepompong sutra liar pegunungan Kendeng. Struktur pintal tangan menghasilkan mikropori terbuka yang memastikan sirkulasi termal optimal di iklim tropis lembap, sekaligus memberikan kekuatan tarik mekanis yang tahan terhadap pencucian puluhan tahun.
          </p>

          <figure className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 m-0">
            <img
              src="/assets/material1.jpg"
              alt="Spesimen serat linen Belgia dan sutra liar Nusantara GSM 280"
              loading="lazy"
              decoding="async"
              className="w-full h-72 sm:h-96 object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-wider text-stone-900 border border-stone-200 shadow-xs">
              SPECIMEN REF. L-280
            </figcaption>
          </figure>
          <p className="text-[11px] text-stone-500 font-light italic">
            Gla 1.0 &ndash; Struktur tenun silang serat senilai dengan kapasitas 280 GSM tanpa lapisan kimiawi penutup.
          </p>

          {/* SPECIFICATION TABLE */}
          <div className="border-t border-b border-stone-200 divide-y divide-stone-200 text-xs py-1">
            <div className="py-2.5 flex justify-between items-center gap-4">
              <span className="text-stone-500 font-mono">Komposisi Benang</span>
              <span className="font-medium text-stone-900 text-right">75% Rami Belgia, 25% Sutra Liar</span>
            </div>
            <div className="py-2.5 flex justify-between items-center gap-4">
              <span className="text-stone-500 font-mono">Tekstur Permukaan</span>
              <span className="font-medium text-stone-900 text-right">Slab alami tidak seragam (Haptic Crisp)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center gap-4">
              <span className="text-stone-500 font-mono">Penyusutan Suhu Air Dingin</span>
              <span className="font-medium text-stone-900 text-right">&lt; 1.2% (Pre-washed enzymic)</span>
            </div>
          </div>
        </section>

        {/* QUOTE BANNER */}
        <blockquote className="bg-stone-100/80 border border-stone-200/80 rounded-2xl p-8 sm:p-12 text-center my-6 m-0">
          <p className="font-serif italic text-xl sm:text-3xl text-stone-800">
            &ldquo;Materi yang jujur tidak membutuhkan kilauan buatan.&rdquo;
          </p>
        </blockquote>

        {/* PILAR 02 - KULIT NABATI */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
            <span>Pilar 02 &bull; Kulit Nabati</span>
            <span>Tanin Alami &bull; Tebal 2.2 mm</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-medium leading-snug">
            Kulit Full-Grain Vegetable-Tanned Tanpa Logam Berat
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Penyamakan lambat selama 60 hari menggunakan rendaman tanin nabati kayu quebracho dan mimosa. Tanpa penutup plastik pigmen atau kromium cair berbahaya. Setiap goresan, pori alami, dan kepadatan kolagen dipertahankan untuk berevolusi menjadi warna karamel (patina) saat berinteraksi dengan minyak alami tangan pemakainya.
          </p>

          <figure className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 m-0">
            <img
              src="/assets/material2.jpg"
              alt="Detail jahitan kulit full-grain vegetable tanned"
              loading="lazy"
              decoding="async"
              className="w-full h-72 sm:h-96 object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-wider text-stone-900 border border-stone-200 shadow-xs">
              SPECIMEN REF. V-TAN22
            </figcaption>
          </figure>
          <p className="text-[11px] text-stone-500 font-light italic">
            Nlv 2.0 &ndash; Penjahitan saddle stitch dua jarum dengan benang linen berlilin lebah murni.
          </p>

          {/* SIMULASI PATINA CARD */}
          <div className="bg-stone-100/80 border border-stone-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">SIMULASI TRANSFORMASI PATINA</span>
              <span className="text-xs font-mono font-semibold text-stone-900 bg-stone-200/80 px-2.5 py-0.5 rounded-md">
                {PATINA_STAGES[activePatina].label}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed min-h-38px">
              {PATINA_STAGES[activePatina].desc}
            </p>

            {/* TIMELINE SLIDER CONTROLS */}
            <div className="pt-4 border-t border-stone-200/80">
              <div className="grid grid-cols-4 text-center text-xs font-mono" role="tablist" aria-label="Tahapan Patina">
                {PATINA_STAGES.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={activePatina === index}
                    onClick={() => setActivePatina(index)}
                    className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      activePatina === index
                        ? 'border-stone-900 bg-stone-900 scale-110'
                        : 'border-stone-400 bg-stone-200 group-hover:border-stone-600'
                    }`} />
                    <span className={`text-[11px] ${
                      activePatina === index ? 'font-bold text-stone-900' : 'text-stone-500'
                    }`}>
                      {item.stage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* METODOLOGI KURATORIAL */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-500 block">
              METODOLOGI KURATORIAL
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-medium">
              Protokol Pengujian 5 Langkah Lokakarya
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Setiap gulungan benang dan samakan kulit melewati pengujian laboratorium in-house internal sebelum disetujui untuk penjahitan akhir.
            </p>
          </div>

          <figure className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 m-0">
            <img
              src="/assets/material3.jpg"
              alt="Ruang kalibrasi dan uji serat tekstil di Yogyakarta"
              loading="lazy"
              decoding="async"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 bg-stone-900/90 text-white px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider">
              RUANG KALIBRASI & UJI SERAT Yogyakarta, 2025
            </figcaption>
          </figure>

          {/* 5 STEPS */}
          <div className="space-y-4 pt-2">
            {PROTOCOL_STEPS.map((step, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-2 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-2xl font-semibold text-stone-900">{step.num}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERTIFIKAT JAMINAN & LAYANAN PEMULIHAN */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-500 block">
              KETETAPAN KOMITMEN
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-medium">
              Sertifikat Jaminan & Layanan Pemulihan
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-stone-100/70 p-5 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    JAMINAN JAHITAN SEUMUR HIDUP
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">ID: V-SEC-ATLN</span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Kami mengambil tanggung jawab penuh atas konstruksi karya kami. Apabila jahitan saddle stitch lepas atau pengikat terurai pada pemakaian normal, kami akan memperbaikinya tanpa biaya di lokakarya kami.
              </p>
            </div>

            <div className="bg-stone-100/70 p-5 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Buku Panduan Perawatan Material
                </span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Setiap karya disertai panduan perawatan spesifik dan instruksi ventilasi berkala.
              </p>
            </div>

            <div className="bg-stone-100/70 p-5 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Archive Restoration Service
                </span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Layanan pembersihan mendalam dan pengisian nutrisi kulit berkala setiap 2 tahun.
              </p>
            </div>
          </div>

          {/* SIGNATURE CARD */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                KURATOR MATERIAL UTAMA
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">Bagus Wicaksono</h3>
              <p className="text-xs text-stone-500 font-light">Kepala Pengendali Mutu & Kriya</p>
            </div>
            <div className="text-right border-l border-stone-200 pl-4 font-serif text-xs font-bold text-stone-800 tracking-wider">
              ATELIER<br />W<br />SAHIH
            </div>
          </div>
        </section>

        {/* KOLABORASI & TRANSPARANSI CTA */}
        <section className="bg-stone-100/80 border border-stone-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-6 my-10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-500 block">
            KOLABORASI & TRANSPARANSI
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-medium max-w-xl mx-auto leading-snug">
            Eksplorasi Material Secara Langsung
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto leading-relaxed">
            Kunjungi area sampel kami di studio atau dapatkan dokumen spesifikasi pengujian teknis fisik lengkap untuk referensi proyek arsitektur dan interior Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button type="button" className="w-full sm:w-auto px-6 py-3.5 bg-[#1A1816] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition flex items-center justify-center gap-2 shadow-xs cursor-pointer">
              <span>KONSULTASI KEBUTUHAN MATERIAL KHUSUS</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
            <a
              href="/docs/spesifikasi-uji-teknis.pdf"
              download
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>UNDUH SPESIFIKASI UJI TEKNIS (PDF, 4.3 MB)</span>
            </a>
          </div>
        </section>

      </article>
    </main>
  );
}