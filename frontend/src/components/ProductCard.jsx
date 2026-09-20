import { useState } from 'react';

const parseSizes = (sizes) => {
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === 'string') {
    try {
      const parsed = JSON.parse(sizes);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const formatRupiah = (price) => {
  if (price === undefined || price === null || isNaN(Number(price))) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getThumbnailUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^storage\//, '')
    .replace(/^public\//, '');

  const rawBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';
  const baseUrl = rawBaseUrl.replace(/\/$/, '');

  return `${baseUrl}/${cleanPath}`;
};

function CartIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.502-7.148a1.125 1.125 0 00-1.11-1.334H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuy,
  addingId,
  buyingId,
  isAdmin = false,
  onAdminEdit,
}) {
  
  const availableSizes = parseSizes(product?.sizes);
  const hasSizes = availableSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState(hasSizes ? availableSizes[0] : null);
  
  if (!product) return null;
  
  const getSelectedSizeLabel = () => {
    if (!selectedSize) return null;
    return typeof selectedSize === 'object' ? selectedSize.name : String(selectedSize);
  };

  const currentPrice =
    typeof selectedSize === 'object' && selectedSize?.price !== undefined
      ? selectedSize.price
      : product.price;

  const currentStock =
    typeof selectedSize === 'object' && selectedSize?.stock !== undefined
      ? Number(selectedSize.stock)
      : Number(product.stock ?? 0);

  const isOutOfStock = currentStock <= 0;
  const isAdding = addingId === product.id;
  const isBuying = buyingId === product.id;

  const productName = product.name || product.title || 'Produk E-Commerce';

  return (
    <article className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-lg transition duration-300 relative h-full">
      {isAdmin && (
        <div className="absolute top-3 left-3 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAdminEdit) onAdminEdit(product);
            }}
            className="bg-stone-900/90 hover:bg-amber-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md border border-stone-700 transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            🛠️ Edit (Admin)
          </button>
        </div>
      )}

      <div>
        <div className="relative aspect-4/5 w-full bg-stone-100 overflow-hidden">
          <img
            src={getThumbnailUrl(product.thumbnail)}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop';
            }}
          />
          
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-stone-800 uppercase">
            {product.category?.name || 'EKSKLUSIF'}
          </div>

          <div
            className={`absolute ${
              isAdmin ? 'bottom-3 left-3' : 'top-3 left-3'
            } px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-md shadow-xs ${
              isOutOfStock
                ? 'bg-rose-600 text-white'
                : 'bg-stone-900/80 text-white'
            }`}
          >
            {!isOutOfStock ? `Stok: ${currentStock}` : 'Stok Habis'}
          </div>
        </div>

        <div className="p-5">
          {/* SEO FIX: Menggunakan H3 agar tidak bentrok dengan H1/H2 halaman utama */}
          <h3 className="font-editorial text-2xl text-stone-900 leading-snug line-clamp-1 mb-1">
            {productName}
          </h3>
          <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
            {product.description || 'Dibuat dengan bahan baku serat kualitas pilihan.'}
          </p>

          {hasSizes && (
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Pilih Ukuran:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((s, idx) => {
                  const sizeName = typeof s === 'object' ? s.name : String(s);
                  const selectedName = getSelectedSizeLabel();
                  const isSelected = selectedName === sizeName;
                  const isSizeEmpty = typeof s === 'object' && s.stock !== undefined ? Number(s.stock) <= 0 : false;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSizeEmpty}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : isSizeEmpty
                          ? 'bg-stone-100 text-stone-300 border-stone-200 line-through cursor-not-allowed'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-900 cursor-pointer'
                      }`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 space-y-3">
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-base font-bold text-stone-900 block">
            {formatRupiah(currentPrice)}
          </span>
          <span className={`text-[11px] font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-stone-400'}`}>
            {isOutOfStock ? 'Habis' : `Tersisa ${currentStock}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart({ ...product, price: currentPrice, selectedSize: getSelectedSizeLabel() })}
              disabled={isAdding || isOutOfStock}
              title={isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
              aria-label="Tambah ke Keranjang"
              className={`flex items-center justify-center w-11 h-11 shrink-0 border rounded-xl transition-all active:scale-95 ${
                isOutOfStock
                  ? 'border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed'
                  : 'border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white text-stone-700 cursor-pointer disabled:opacity-50'
              }`}
            >
              {isAdding ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                </svg>
              ) : (
                <CartIcon />
              )}
            </button>
          )}

          {onBuy && (
            <button
              type="button"
              onClick={() => onBuy({ ...product, price: currentPrice, selectedSize: getSelectedSizeLabel() })}
              disabled={isBuying || isOutOfStock}
              className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-all active:scale-95 ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-black text-white cursor-pointer disabled:opacity-50'
              }`}
            >
              {isOutOfStock ? 'Stok Habis' : isBuying ? 'Memproses...' : 'Beli Sekarang'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}