import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function SellerProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Daftar Produk Seller';
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const response = await api.get('/my-products');
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil daftar produk seller:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data awal saat mount. fetchSellerProducts bersifat async
    // (setState terjadi setelah await), ini pola data-fetching standar,
    // bukan pemanggilan setState sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSellerProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🛍️ Kelola Produk Seller</h1>
            <p className="text-sm text-gray-500">
              Lihat, cari, dan kelola semua file produk digital yang Anda jual.
            </p>
          </div>
          <Link
            to="/seller/products/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition text-center shadow-sm"
          >
            + Tambah Produk Baru
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Cari produk berdasarkan nama"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat data produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm
                ? 'Tidak ada produk yang cocok dengan pencarian.'
                : 'Anda belum memiliki produk digital. Klik + Tambah Produk Baru untuk mulai!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold text-xs">
                  <tr>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-3">
                        <img
                          src={
                            product.thumbnail
                              ? `${API_BASE_URL}/storage/${product.thumbnail.replace(/^public\//, '').replace(/^\/?storage\//, '')}`
                              : '/placeholder.png'
                          }
                          alt={product.name || 'Thumbnail produk'}
                          loading="lazy"
                          className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-gray-400 font-normal line-clamp-1">
                            {product.description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold uppercase">
                          {product.category?.name || 'Digital'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                            product.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : product.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {product.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}