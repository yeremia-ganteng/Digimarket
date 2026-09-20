import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Form Kategori
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // State Accordion Kategori
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // State Pencarian Produk per Kategori { [catId]: 'keyword' }
  const [productSearch, setProductSearch] = useState({});

  // State Modal Produk (Tambah / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    thumbnail: null,
    file: null,
  });

  // State Notification Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State Confirm Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionText: 'Hapus',
    onConfirm: null,
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', actionText: 'Hapus', onConfirm: null });
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch (err) {
      console.error('Gagal memuat kategori:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data awal saat mount. fetchCategories bersifat async (setState
    // terjadi setelah await), ini pola data-fetching standar, bukan
    // pemanggilan setState sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [fetchCategories]);

  // Handler update keyword pencarian produk per kategori
  const handleProductSearchChange = (categoryId, query) => {
    setProductSearch((prev) => ({
      ...prev,
      [categoryId]: query,
    }));
  };

  // ================= KELOLA KATEGORI =================
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, { name: categoryNameInput.trim() });
        showToast('Kategori berhasil diperbarui!');
      } else {
        await api.post('/categories', { name: categoryNameInput.trim() });
        showToast('Kategori baru berhasil ditambahkan!');
      }
      setCategoryNameInput('');
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan kategori.', 'error');
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryNameInput(cat.name);
  };

  const handleDeleteCategory = (cat) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Kategori',
      message: `Apakah Anda yakin ingin menghapus kategori "${cat.name}"? Semua produk di dalamnya mungkin akan terpengaruh.`,
      actionText: 'Hapus Kategori',
      onConfirm: async () => {
        try {
          await api.delete(`/categories/${cat.id}`);
          showToast('Kategori berhasil dihapus!');
          fetchCategories();
        } catch (err) {
          showToast(err.response?.data?.message || 'Gagal menghapus kategori.', 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  // ================= KELOLA PRODUK DALAM KATEGORI =================
  const openAddProductModal = (categoryId) => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      description: '',
      category_id: categoryId,
      thumbnail: null,
      file: null,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category_id: product.category_id,
      thumbnail: null,
      file: null,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Validasi Ukuran File Sederhana (Maks 5MB)
    if (productForm.thumbnail && productForm.thumbnail.size > 5 * 1024 * 1024) {
      showToast('Ukuran thumbnail maksimal 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('description', productForm.description);
    formData.append('category_id', productForm.category_id);

    if (productForm.thumbnail) formData.append('thumbnail', productForm.thumbnail);
    if (productForm.file) formData.append('file', productForm.file);

    try {
      if (editingProduct) {
        formData.append('_method', 'PUT');
        await api.post(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Produk berhasil diperbarui!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Produk baru berhasil ditambahkan!');
      }
      setIsProductModalOpen(false);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan produk.', 'error');
    }
  };

  const handleDeleteProduct = (prod) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Produk',
      message: `Apakah Anda yakin ingin menghapus produk "${prod.name}" secara permanen?`,
      actionText: 'Hapus Produk',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${prod.id}`);
          showToast('Produk berhasil dihapus!');
          fetchCategories();
        } catch (err) {
          showToast(err.response?.data?.message || 'Gagal menghapus produk.', 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/100';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '');
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif] text-stone-900 relative">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Kelola Kategori & Produk (Admin)</h1>
      </header>

      {/* Form Tambah/Edit Kategori */}
      <section aria-label="Form Kategori" className="mb-8">
        <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-2xl border border-stone-200 flex gap-3 items-end shadow-xs">
          <div className="flex-1">
            <label htmlFor="category-name-input" className="block text-xs font-semibold text-stone-600 mb-2">
              {editingCategoryId ? 'Edit Nama Kategori' : 'Tambah Kategori Baru'}
            </label>
            <input
              id="category-name-input"
              type="text"
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="Contoh: Aksesoris, Pakaian Pria..."
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95 cursor-pointer"
          >
            {editingCategoryId ? 'Simpan' : 'Tambah'}
          </button>
          {editingCategoryId && (
            <button
              type="button"
              onClick={() => { setEditingCategoryId(null); setCategoryNameInput(''); }}
              className="border border-stone-300 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-stone-100 transition cursor-pointer"
            >
              Batal
            </button>
          )}
        </form>
      </section>

      {/* Tabel Kategori & Accordion Produk */}
      <section aria-label="Daftar Kategori" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {loading ? (
          <p className="p-6 text-sm text-stone-500">Memuat data kategori...</p>
        ) : (
          <div className="divide-y divide-stone-100">
            <div className="grid grid-cols-12 bg-stone-50 p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <span className="col-span-1">ID</span>
              <span className="col-span-4">Nama Kategori</span>
              <span className="col-span-3">Produk</span>
              <span className="col-span-4 text-right">Aksi Kategori</span>
            </div>

            {categories.map((cat) => {
              const isExpanded = expandedCategoryId === cat.id;
              const productList = cat.products || [];
              const searchKeyword = (productSearch[cat.id] || '').trim().toLowerCase();

              const filteredProducts = productList.filter((prod) =>
                prod.name.toLowerCase().includes(searchKeyword)
              );

              return (
                <div key={cat.id} className="transition">
                  {/* Baris Kategori */}
                  <div className="grid grid-cols-12 p-4 items-center hover:bg-stone-50/50">
                    <span className="col-span-1 font-medium">{cat.id}</span>
                    <span className="col-span-4 font-semibold text-stone-900">{cat.name}</span>
                    <span className="col-span-3 text-xs text-stone-500">
                      {productList.length} Produk
                    </span>
                    <div className="col-span-4 text-right space-x-2">
                      <button
                        onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                        aria-expanded={isExpanded}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition cursor-pointer"
                      >
                        {isExpanded ? 'Tutup Produk ▲' : 'Kelola Produk ▼'}
                      </button>
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* Panel Accordion Produk */}
                  {isExpanded && (
                    <div className="bg-stone-50/80 p-5 border-t border-b border-stone-100 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Daftar Produk ({cat.name})
                        </h3>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={productSearch[cat.id] || ''}
                            onChange={(e) => handleProductSearchChange(cat.id, e.target.value)}
                            placeholder="Cari nama produk..."
                            aria-label={`Cari produk di ${cat.name}`}
                            className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 w-full sm:w-56 transition shadow-2xs"
                          />
                          <button
                            onClick={() => openAddProductModal(cat.id)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            + Tambah Produk Ke Kategori Ini
                          </button>
                        </div>
                      </div>

                      {productList.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">Belum ada produk pada kategori ini.</p>
                      ) : filteredProducts.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">
                          Tidak ada produk yang cocok dengan kata kunci "{productSearch[cat.id]}".
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredProducts.map((prod) => (
                            <div key={prod.id} className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-2xs">
                              <img
                                src={getImageUrl(prod.thumbnail)}
                                alt={prod.name || 'Foto Produk'}
                                loading="lazy"
                                className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold truncate text-stone-900">{prod.name}</h4>
                                <p className="text-[11px] text-stone-500">IDR {Number(prod.price).toLocaleString('id-ID')}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded font-medium cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod)}
                                  className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded font-medium cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal Tambah / Edit Produk */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold text-stone-900">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>

            <form onSubmit={handleProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Nama Produk</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Contoh: Kemeja Linen Cutaway"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Harga (IDR)</label>
                <input
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="Contoh: 2100000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Deskripsi</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Tuliskan deskripsi lengkap produk, bahan, atau spesifikasinya..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 h-20 transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Gambar Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.files[0] })}
                  className="w-full text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">File Produk Digital (Opsional)</label>
                <input
                  type="file"
                  onChange={(e) => setProductForm({ ...productForm, file: e.target.files[0] })}
                  className="w-full text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl font-semibold hover:bg-stone-50 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl font-semibold hover:bg-black cursor-pointer transition"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODERN CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{confirmModal.title}</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition shadow-xs"
              >
                {confirmModal.actionText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODERN TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </main>
  );
}