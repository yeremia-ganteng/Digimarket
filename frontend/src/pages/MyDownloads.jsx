import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Helper sanitasi URL gambar backend untuk mencegah XSS
const getProductImage = (product) => {
  if (!product) return null;

  const img = product.image || product.image_url || product.image_path || product.photo || product.thumbnail || product.cover;
  if (!img) return null;

  const imgStr = String(img).trim();

  // Cegah protocol injection (javascript:, data:, dll)
  if (/^(javascript|data|vbscript):/i.test(imgStr)) {
    return null;
  }

  if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
    return imgStr;
  }

  const cleanPath = imgStr.replace(/^\//, '');
  const rawBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';
  const baseUrl = rawBaseUrl.replace(/\/$/, '');

  if (cleanPath.startsWith('storage/')) {
    return `${baseUrl.replace(/\/storage$/, '')}/${cleanPath}`;
  }

  if (cleanPath.startsWith('products/')) {
    return `${baseUrl}/${cleanPath}`;
  }

  return `${baseUrl}/products/${cleanPath}`;
};

export default function MyDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const isMounted = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;

    const fetchDownloads = async () => {
      try {
        const response = await api.get('/my-downloads');
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        
        if (isMounted.current) {
          setDownloads(data);
        }
      } catch (err) {
        console.error('Gagal mengambil daftar download:', err);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchDownloads();

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Intersection Observer untuk animasi masuk smooth saat scroll
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

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, downloads]);

  const handleCopyToken = (token, id) => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedId(id);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isMounted.current) {
        setCopiedId(null);
      }
    }, 2000);
  };

  const handleDownload = async (token, productName, itemId) => {
    if (!token) return alert('Token download tidak valid.');

    setDownloadingId(itemId);
    try {
      const response = await api.get(`/download/${token}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Sanitasi nama file aman untuk OS & mencegah path traversal
      const safeName = (productName || 'digital-product')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      link.setAttribute('download', `${safeName || 'digital-product'}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          const errorJson = JSON.parse(errorText);
          alert(`Gagal: ${errorJson.message || 'Tidak memiliki akses'}`);
        } catch {
          alert('Gagal mengunduh file atau Anda tidak memiliki akses.');
        }
      } else {
        alert('Gagal mengunduh file. Terjadi kesalahan server.');
      }
    } finally {
      if (isMounted.current) {
        setDownloadingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <header className="mb-8 border-b border-gray-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 text-white rounded-lg shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Riwayat Pembelian & File Digital</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 pl-11">
              Kelola dan unduh lisensi resmi serta aset digital yang telah terverifikasi.
            </p>
          </div>

          {!loading && downloads.length > 0 && (
            <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm" role="status">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{downloads.length} Lisensi Aktif</span>
            </div>
          )}
        </header>

        {/* Loading State */}
        {loading ? (
          <section className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full text-gray-400 mb-3 animate-spin">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Memuat riwayat transaksi...</p>
          </section>
        ) : downloads.length === 0 ? (
          
          /* Empty State */
          <section className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-sm max-w-lg mx-auto my-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Belum Ada File Digital</h2>
            <p className="text-sm text-gray-500 mt-1">Anda belum memiliki produk digital yang dibeli saat ini.</p>
          </section>
        ) : (
          
          /* Card List */
          <section className="space-y-4" aria-label="Daftar Unduhan Produk Digital">
            {downloads.map((item) => {
              const product = item.order_item?.product || item.orderItem?.product;
              const isCopied = copiedId === item.id;
              const isDownloading = downloadingId === item.id;
              const imageUrl = getProductImage(product);

              return (
                <article 
                  key={item.id} 
                  className="group bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 reveal-on-scroll opacity-0 translate-y-10 duration-1000 ease-out"
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Container Gambar Produk / Fallback SVG */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200/80 shrink-0 shadow-sm bg-gray-100 flex items-center justify-center relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Cover ${product?.name || 'Produk Digital'}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`w-full h-full bg-gray-50 flex items-center justify-center text-gray-700 ${
                          imageUrl ? 'hidden' : ''
                        }`}
                      >
                        <svg className="w-6 h-6 stroke-[1.75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {/* Status & Ref */}
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          LUNAS
                        </span>
                        {item.id && (
                          <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                        )}
                      </div>

                      {/* Product Title */}
                      <h2 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {product?.name || 'Produk Digital'}
                      </h2>

                      {/* Download Token with Copy Action */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-xs text-gray-400 font-medium">Token:</span>
                        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 font-mono text-xs text-gray-700">
                          <span>{item.download_token || '-'}</span>
                          {item.download_token && (
                            <button
                              type="button"
                              onClick={() => handleCopyToken(item.download_token, item.id)}
                              className="text-gray-400 hover:text-gray-700 transition-colors ml-1 focus:outline-none"
                              title="Salin Token"
                              aria-label={`Salin token untuk ${product?.name || 'produk'}`}
                            >
                              {isCopied ? (
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 justify-end">
                    <button
                      type="button"
                      onClick={() => handleDownload(item.download_token, product?.name, item.id)}
                      disabled={isDownloading}
                      aria-label={`Unduh file ${product?.name || 'digital'}`}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm hover:shadow transition-all duration-150"
                    >
                      {isDownloading ? (
                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      )}
                      <span>{isDownloading ? 'Mengunduh...' : 'Unduh File'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}