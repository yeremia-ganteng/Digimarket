import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.replace(/^public\//, '').replace(/^\/?storage\//, '');
  return `${API_BASE_URL}/storage/${cleanPath}`;
};

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    thumbnail: null,
    file: null,
  });
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    document.title = 'Dashboard Seller | Kelola Produk';
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

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil kategori:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSellerProducts();
      await fetchCategories();
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedCategory === 'all' || !selectedCategory) {
        return matchSearch;
      }

      const prodCatId = Number(product.category_id ?? product.category?.id ?? NaN);
      const matchCategory = prodCatId === Number(selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category_id: product.category_id ?? product.category?.id ?? '',
      thumbnail: null,
      file: null,
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('name', editForm.name.trim());
    formData.append('price', editForm.price);
    formData.append('description', editForm.description.trim());
    formData.append('category_id', editForm.category_id);
    formData.append('_method', 'PUT');

    if (editForm.thumbnail) formData.append('thumbnail', editForm.thumbnail);
    if (editForm.file) formData.append('file', editForm.file);

    try {
      await api.post(`/products/${editingProduct.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Produk berhasil diperbarui!');
      closeEditModal();
      fetchSellerProducts();
    } catch (err) {
      console.error('Gagal memperbarui produk:', err);
      showToast(err.response?.data?.message || 'Gagal memperbarui produk.', 'error');
    } finally {
      setSaving(false);
    }
  };

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

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Cari produk"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer"
            aria-label="Filter berdasarkan kategori"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat data produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Tidak ada produk yang cocok dengan pencarian/filter.'
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
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-3">
                        <img
                          src={getImageUrl(product.thumbnail)}
                          alt={product.name || 'Gambar produk'}
                          loading="lazy"
                          className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-gray-400 font-normal line-clamp-1">
                            {product.description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-blue-600 bg-blue-50 rounded-md whitespace-nowrap inline-block text-center">
                          {product.category?.name || 'Digital'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap ${
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
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 border border-gray-100 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Edit Produk</h2>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Nama Produk</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Kategori</label>
                  <select
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Harga (IDR)</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Deskripsi</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-20"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Ganti Thumbnail (opsional)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files[0] || null })}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Ganti File Digital (opsional)</label>
                <input
                  type="file"
                  accept=".zip,.pdf,.rar"
                  onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] || null })}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-gray-900 text-white border-gray-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}