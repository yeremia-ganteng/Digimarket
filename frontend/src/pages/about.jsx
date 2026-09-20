import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Wrapper Komponen (animasi scroll dihapus, konten tampil langsung)
function RevealOnScroll({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

// Skeleton Component yang Presisi
function ImageWithSkeleton({ src, alt, className, width, height, fetchPriority = 'auto', loading = 'lazy' }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden w-full h-full bg-stone-200">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// Skeleton Loader Halaman Penuh (mengikuti struktur & spasi halaman About)
function AboutSkeleton() {
  return (
    <main className="max-w-5xl mx-auto space-y-16 sm:space-y-20 animate-pulse" aria-hidden="true">
      {/* SECTION 1: HERO SKELETON */}
      <section className="text-center space-y-6 pt-4">
        <div className="h-3 bg-stone-200 rounded w-56 mx-auto" />
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="h-10 sm:h-14 bg-stone-200 rounded w-full" />
          <div className="h-10 sm:h-14 bg-stone-200 rounded w-3/4 mx-auto" />
        </div>
        <div className="space-y-2 max-w-2xl mx-auto pt-2">
          <div className="h-4 bg-stone-200 rounded w-full" />
          <div className="h-4 bg-stone-200 rounded w-5/6 mx-auto" />
        </div>
        <div className="pt-4">
          <div className="w-full h-80 sm:h-120 rounded-2xl border border-stone-200/80 bg-stone-200" />
        </div>
      </section>

      <hr className="border-t border-stone-200/80" />

      {/* SECTION 2: STORY SKELETON */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded w-48" />
          <div className="h-8 sm:h-10 bg-stone-200 rounded w-2/3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-3 bg-stone-200 rounded w-full" />
            <div className="h-3 bg-stone-200 rounded w-full" />
            <div className="h-3 bg-stone-200 rounded w-11/12" />
            <div className="h-3 bg-stone-200 rounded w-full" />
            <div className="h-3 bg-stone-200 rounded w-4/5" />
            <div className="h-3 bg-stone-200 rounded w-full" />
            <div className="h-3 bg-stone-200 rounded w-3/4" />
          </div>

          <div className="lg:col-span-4 space-y-3">
            <div className="w-full h-64 rounded-2xl border border-stone-200/80 bg-stone-200" />
            <div className="h-2.5 bg-stone-200 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </section>

      <hr className="border-t border-stone-200/80" />

      {/* SECTION 3: BLOCKQUOTE SKELETON */}
      <section className="py-4 space-y-4 max-w-3xl mx-auto text-center">
        <div className="space-y-3">
          <div className="h-8 sm:h-10 bg-stone-200 rounded w-full" />
          <div className="h-8 sm:h-10 bg-stone-200 rounded w-2/3 mx-auto" />
        </div>
        <div className="h-3 bg-stone-200 rounded w-52 mx-auto" />
      </section>

      <hr className="border-t border-stone-200/80" />

      {/* SECTION 4: VALUES GRID SKELETON */}
      <section className="space-y-10">
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded w-32" />
          <div className="h-8 sm:h-10 bg-stone-200 rounded w-2/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 h-full"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-stone-200" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-stone-200 rounded w-full" />
                  <div className="h-2.5 bg-stone-200 rounded w-5/6" />
                </div>
              </div>
              <div className="h-2 bg-stone-200 rounded w-1/2 pt-2 border-t border-stone-100" />
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-stone-200/80" />

      {/* SECTION 5: STATS SKELETON */}
      <section className="space-y-10">
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded w-56" />
          <div className="h-8 sm:h-10 bg-stone-200 rounded w-1/3" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="h-9 sm:h-11 bg-stone-200 rounded w-2/3" />
              <div className="h-2.5 bg-stone-200 rounded w-full" />
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t border-stone-200/80" />

      {/* SECTION 6: CTA SKELETON */}
      <section className="text-center py-8 space-y-6 bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-12 shadow-xs max-w-3xl mx-auto">
        <div className="space-y-3">
          <div className="h-8 sm:h-11 bg-stone-200 rounded w-full" />
          <div className="h-8 sm:h-11 bg-stone-200 rounded w-2/3 mx-auto" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="h-3 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-4/5 mx-auto" />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div className="w-full sm:w-40 h-12 rounded-xl bg-stone-200" />
          <div className="w-full sm:w-48 h-12 rounded-xl bg-stone-200" />
        </div>
        <div className="h-2 bg-stone-200 rounded w-64 mx-auto pt-4" />
      </section>
    </main>
  );
}

export default function About() {
  const [loading, setLoading] = useState(true);

  // Simulasi fase loading awal halaman (statis, tidak ada fetch API)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  // === SEO: Title, Meta Description, Canonical URL ===
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Tentang Kami | DigiMarket - Kurasi Busana Berintegritas';

    const descriptionContent =
      'DigiMarket adalah platform kurasi busana berintegritas sejak 2021, menghubungkan karya desainer independen dengan pencinta gaya yang menghargai kualitas, keaslian material, dan keberlanjutan.';

    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription ? metaDescription.getAttribute('content') : null;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', descriptionContent);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonicalLink ? canonicalLink.getAttribute('href') : null;
    const canonicalCreated = !canonicalLink;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${window.location.origin}/about`);

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription !== null) {
        metaDescription.setAttribute('content', previousDescription);
      }
      if (canonicalLink && canonicalCreated) {
        canonicalLink.remove();
      } else if (canonicalLink && previousCanonical !== null) {
        canonicalLink.setAttribute('href', previousCanonical);
      }
    };
  }, []);

  // Schema.org Structured Data untuk SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'DigiMarket',
      url: 'https://digimarket.com',
      logo: 'https://digimarket.com/assets/logo.png',
      foundingDate: '2021',
      description: 'Platform kurasi busana berintegritas dan karya desainer independen.',
    },
  };

  // Escape '<' agar tag <script> tidak bisa ditutup paksa oleh isi data (mencegah script-breakout XSS)
  const safeJsonLd = JSON.stringify(schemaData).replace(/</g, '\\u003c');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] font-['Plus_Jakarta_Sans',sans-serif] antialiased py-12 px-4 sm:px-6 lg:px-8">
      {/* Inject Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      {loading ? (
        <AboutSkeleton />
      ) : (
        <main className="max-w-5xl mx-auto space-y-16 sm:space-y-20">
          {/* SECTION 1: HERO */}
          <section className="text-center space-y-6 pt-4" aria-labelledby="hero-heading">
            <RevealOnScroll>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                TENTANG DIGIMARKET &bull; EST. 2021
              </span>
            </RevealOnScroll>

            <RevealOnScroll>
              <h1
                id="hero-heading"
                className="font-editorial text-4xl sm:text-6xl font-medium text-stone-900 max-w-3xl mx-auto leading-tight"
              >
                Di Balik Setiap Jahitan: Keanggunan Abadi untuk Setiap Generasi
              </h1>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="font-editorial italic text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                DigiMarket lahir dari apresiasi mendalam terhadap busana berintegritas—menghubungkan karya kurasi desainer independen dengan pencinta gaya yang merayakan keindahan tanpa kompromi.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="pt-4">
                <figure className="relative overflow-hidden rounded-2xl border border-stone-200/80 shadow-xs m-0">
                  <div className="w-full h-80 sm:h-120">
                    <ImageWithSkeleton
                      src="/assets/home.jpg"
                      alt="Foto Atelier Utama DigiMarket - Studio Busana Etikal"
                      width={1200}
                      height={800}
                      fetchPriority="high"
                      loading="eager"
                      className="w-full h-80 sm:h-120 object-cover"
                    />
                  </div>
                  <figcaption className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-widest text-stone-200 font-mono">
                    FOTO ATELIER UTAMA DIGIMARKET
                  </figcaption>
                </figure>
              </div>
            </RevealOnScroll>
          </section>

          <hr className="border-t border-stone-200/80" />

          {/* SECTION 2: ORIGIN STORY */}
          <section className="space-y-8" aria-labelledby="story-heading">
            <RevealOnScroll>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                  EKSKLUSIVITAS & WARISAN
                </span>
                <h2 id="story-heading" className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Sebuah Ruang Bagi Keindahan yang Bertahan
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <article className="lg:col-span-8 space-y-6 text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                <RevealOnScroll>
                  <p>
                    <span className="float-left text-5xl font-editorial font-bold leading-none pr-3 pt-1 text-stone-900">
                      K
                    </span>
                    ami percaya keindahan sejati tidak pernah tergesa. Di tengah arus cepat tren busana masa kini yang lekas pudar, DigiMarket berdiri sebagai oasis bagi mereka yang menghargai kualitas. Setiap busana dikurasi dengan prinsip ketahanan—karya yang siap mendampingi Anda bertahun-tahun, mewakili cerita, dan bertambah anggun seiring berjalannya waktu.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll>
                  <p>
                    Bermula dari perjumpaan intim di bengkel-bengkel jahit dan studio tenun independen, kami melihat jurang besar antara karya adiluhung pengrajin dengan pengagum busana modern. DigiMarket hadir untuk menjembatani kurasi busana pria, wanita, dan aksesori kulit berstandar etikal tinggi—memastikan setiap helai kain yang Anda kenakan memiliki rekam jejak material yang jujur.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll>
                  <p>
                    Bagi kami, setiap pelanggan bukan sekadar pembeli, melainkan seorang kolektor gaya hidup. Kami mengawal perjalanan Anda menemukan pakaian yang tidak hanya pas di raga, namun selaras dengan martabat dan selera pemakainya.
                  </p>
                </RevealOnScroll>
              </article>

              <div className="lg:col-span-4 space-y-3">
                <RevealOnScroll>
                  <figure className="overflow-hidden rounded-2xl border border-stone-200/80 m-0">
                    <div className="w-full h-64">
                      <ImageWithSkeleton
                        src="/assets/about.jpg"
                        alt="Proses Jahit Tangan Eksklusif Menggunakan Benang Sutera"
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </figure>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono text-center pt-2">
                    PROSES JAHIT TANGAN DENGAN BENANG SUTERA
                  </p>
                </RevealOnScroll>
              </div>
            </div>
          </section>

          <hr className="border-t border-stone-200/80" />

          {/* SECTION 3: BLOCKQUOTE */}
          <section className="py-4 text-center space-y-4 max-w-3xl mx-auto">
            <RevealOnScroll>
              <blockquote className="font-editorial italic text-2xl sm:text-4xl text-stone-900 leading-snug">
                “Pakaian adalah wujud hening dari cara kita menghargai kehidupan.”
              </blockquote>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 pt-2">
                PENDIRI & KURATOR UTAMA, DIGIMARKET
              </p>
            </RevealOnScroll>
          </section>

          <hr className="border-t border-stone-200/80" />

          {/* SECTION 4: VALUES GRID */}
          <section className="space-y-10" aria-labelledby="values-heading">
            <RevealOnScroll>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                  PRINSIP KAMI
                </span>
                <h2 id="values-heading" className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Empat Komitmen Fundamental
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 01 */}
              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 0 0 2.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-stone-900">
                      Kurasi & Kualitas
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Setiap helai diproses melalui evaluasi ketat terkait kelembutan bahan dan presisi jahitan sebelum dihadirkan kepada Anda.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block pt-2 border-t border-stone-100">
                    01 / DEDIKASI
                  </span>
                </div>
              </RevealOnScroll>

              {/* 02 */}
              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                      </svg>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-stone-900">
                      Keaslian Produk
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Menjamin keaslian material dan keaslian desain karya para seniman lokal yang bermitra secara sah dengan platform kami.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block pt-2 border-t border-stone-100">
                    02 / AUTENTISITAS
                  </span>
                </div>
              </RevealOnScroll>

              {/* 03 */}
              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 20a7 7 0 0 1-1.2-13.9C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-stone-900">
                      Etika & Keberlanjutan
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Mendukung ekosistem produksi yang adil dan meminimalkan limbah demi kelestarian lingkungan hidup bersama.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block pt-2 border-t border-stone-100">
                    03 / EKOSISTEM
                  </span>
                </div>
              </RevealOnScroll>

              {/* 04 */}
              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-stone-900">
                      Kepercayaan Pelanggan
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Layanan purnajual prima, garansi pengembalian cepat, dan kemudahan dalam setiap pengalaman berbelanja Anda.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block pt-2 border-t border-stone-100">
                    04 / TRANSPARANSI
                  </span>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          <hr className="border-t border-stone-200/80" />

          {/* SECTION 5: STATS */}
          <section className="space-y-10" aria-labelledby="stats-heading">
            <RevealOnScroll>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
                  TOLOK UKUR JEJAK LANGKAH
                </span>
                <h2 id="stats-heading" className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Pertumbuhan Dalam Integritas
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-2">
                  <p className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
                    1.200+
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    DESAINER & LABEL TERINSPEKSI
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-2">
                  <p className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
                    250.000+
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    KOMUNITAS KOLEKTOR AKTIF
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-2">
                  <p className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
                    34
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    PROVINSI TERSANGKAU DI NUSANTARA
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-2">
                  <p className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
                    100%
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    JAMINAN AUTENTISITAS MATERIAL
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          <hr className="border-t border-stone-200/80" />

          {/* SECTION 6: CTA PENUTUP */}
          <RevealOnScroll>
            <section className="text-center py-8 space-y-6 bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-12 shadow-xs max-w-3xl mx-auto">
              <h2 className="font-editorial text-3xl sm:text-5xl text-stone-900 font-medium leading-tight">
                Mari Merajut Cerita Bersama DigiMarket
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
                Temukan koleksi yang mengekspresikan karakter terbaik Anda atau konsultasikan preferensi busana Anda bersama kurator eksklusif kami.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition shadow-xs text-center focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
                >
                  JELAJAHI KATALOG
                </Link>
                <Link
                  to="/support"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white border border-stone-300 text-stone-900 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition text-center focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
                >
                  HUBUNGI LAYANAN KURASI
                </Link>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono pt-4">
                DOKUMEN MANIFESTO RESMI DIGIMARKET
              </p>
            </section>
          </RevealOnScroll>
        </main>
      )}
    </div>
  );
}