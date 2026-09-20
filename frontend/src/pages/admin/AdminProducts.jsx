import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../services/api';

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State Modal Tambah/Edit Produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Custom Size Input state
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    status: 'approved',
    description: '',
    category_id: '',
    sizes: [],
    thumbnail: null,
    file: null,
  });

  // State Toast & Confirm Modal
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
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

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { all: true, no_paginate: true } }),
        api.get('/categories', { params: { all: true, no_paginate: true } }),
      ]);

      const normalize = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
      };

      setProducts(normalize(prodRes));
      setCategories(normalize(catRes));
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      showToast('Gagal memuat data produk atau kategori.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data awal saat mount (products + categories). fetchData bersifat
    // async (setState terjadi setelah Promise.all resolve), ini pola
    // data-fetching standar, bukan pemanggilan setState sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const getCategoryName = useCallback((catId) => {
    const cat = categories.find((c) => String(c.id) === String(catId));
    return cat ? cat.name : 'Uncategorized';
  }, [categories]);

  // Helper tampilan harga
  const getPriceDisplay = (prod) => {
    let sizes = prod.sizes;
    if (typeof sizes === 'string') {
      try { sizes = JSON.parse(sizes); } catch { sizes = []; }
    }

    const validPrices = Array.isArray(sizes)
      ? sizes
          .map((s) => (typeof s === 'object' && s?.price !== undefined && s.price !== '' ? Number(s.price) : null))
          .filter((p) => p !== null && !isNaN(p))
      : [];

    if (validPrices.length === 0) {
      return `Rp ${Number(prod.price).toLocaleString('id-ID')}`;
    }

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    if (min === max) {
      return `Rp ${min.toLocaleString('id-ID')}`;
    }

    return `Rp ${min.toLocaleString('id-ID')} – Rp ${max.toLocaleString('id-ID')}`;
  };

  // Helper Badge Status
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Aktif
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            {status || 'Draft'}
          </span>
        );
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (selectedCategory === 'all' || !selectedCategory) return matchSearch;

        const prodCatId = String(prod.category_id || prod.category?.id || '');
        const prodCatName = (prod.category?.name || getCategoryName(prod.category_id)).toLowerCase();

        const selectedCatObj = categories.find(
          (c) => String(c.id) === String(selectedCategory) || c.name === selectedCategory
        );

        const targetId = selectedCatObj ? String(selectedCatObj.id) : String(selectedCategory);
        const targetName = selectedCatObj
          ? selectedCatObj.name.toLowerCase()
          : String(selectedCategory).toLowerCase();

        return matchSearch && (prodCatId === targetId || prodCatName === targetName);
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return b.id - a.id;
      });
  }, [products, categories, searchQuery, selectedCategory, sortBy, getCategoryName]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleSize = (sizeName) => {
    setProductForm((prev) => {
      const exists = prev.sizes.some((s) => s.name === sizeName);
      if (exists) {
        return { ...prev, sizes: prev.sizes.filter((s) => s.name !== sizeName) };
      }
      return {
        ...prev,
        sizes: [...prev.sizes, { name: sizeName, price: prev.price || '', stock: prev.stock || '' }],
      };
    });
  };

  const addCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const sizeToAdd = customSizeInput.trim().toUpperCase();
    setProductForm((prev) => {
      if (prev.sizes.some((s) => s.name === sizeToAdd)) return prev;
      return {
        ...prev,
        sizes: [...prev.sizes, { name: sizeToAdd, price: prev.price || '', stock: prev.stock || '' }],
      };
    });
    setCustomSizeInput('');
  };

  const updateSizeField = (index, field, value) => {
    setProductForm((prev) => {
      const updated = [...prev.sizes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sizes: updated };
    });
  };

  const removeSize = (index) => {
    setProductForm((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setCustomSizeInput('');
    setProductForm({
      name: '',
      price: '',
      stock: 0,
      status: 'approved',
      description: '',
      category_id: categories[0]?.id || '',
      sizes: [],
      thumbnail: null,
      file: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setCustomSizeInput('');

    let rawSizes = prod.sizes;
    if (typeof rawSizes === 'string') {
      try { rawSizes = JSON.parse(rawSizes); } catch { rawSizes = []; }
    }

    const initialSizes = Array.isArray(rawSizes)
      ? rawSizes.map((s) =>
          typeof s === 'object' && s !== null
            ? { name: s.name ?? '', price: s.price ?? '', stock: s.stock ?? '' }
            : { name: String(s), price: '', stock: '' }
        )
      : [];

    setProductForm({
      name: prod.name,
      price: prod.price,
      stock: prod.stock ?? 0,
      status: prod.status || 'approved',
      description: prod.description || '',
      category_id: prod.category_id,
      sizes: initialSizes,
      thumbnail: null,
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productForm.thumbnail && productForm.thumbnail.size > 5 * 1024 * 1024) {
      showToast('Ukuran thumbnail maksimal 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('stock', productForm.stock);
    formData.append('status', productForm.status);
    formData.append('description', productForm.description);
    formData.append('category_id', productForm.category_id);

    if (productForm.sizes && productForm.sizes.length > 0) {
      const normalizedSizes = productForm.sizes.map((s) => ({
        name: s.name,
        price: s.price === '' || s.price === null || s.price === undefined
          ? Number(productForm.price)
          : Number(s.price),
        stock: s.stock === '' || s.stock === null || s.stock === undefined
          ? Number(productForm.stock)
          : Number(s.stock),
      }));
      formData.append('sizes', JSON.stringify(normalizedSizes));
    }

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
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan produk.', 'error');
    }
  };

  const handleDelete = (prod) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Produk',
      message: `Apakah Anda yakin ingin menghapus produk "${prod.name}" secara permanen?`,
      actionText: 'Hapus Produk',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${prod.id}`);
          showToast('Produk berhasil dihapus!');
          fetchData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Gagal menghapus produk.', 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/products/${id}/approve`);
      showToast('Produk berhasil disetujui!');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyetujui produk.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/products/${id}/reject`);
      showToast('Produk berhasil ditolak.');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menolak produk.', 'error');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/100';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '');
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 font-['Plus_Jakarta_Sans',sans-serif] text-stone-900 relative">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Manajemen Produk</h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola seluruh katalog produk, penetapan harga, dan status inventaris Anda secara terpusat.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
        >
          + Tambah Produk Baru
        </button>
      </header>

      {/* KPI Cards */}
      <section aria-label="Statistik Katalog" className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Katalog</span>
          <p className="text-xl md:text-2xl font-bold text-stone-900 mt-1">{products.length} Produk</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Kategori Aktif</span>
          <p className="text-xl md:text-2xl font-bold text-stone-900 mt-1">{categories.length} Kategori</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Hasil Filter</span>
          <p className="text-xl md:text-2xl font-bold text-stone-900 mt-1">{filteredProducts.length} Produk</p>
        </div>
      </section>

      {/* Filter & Toolbar */}
      <section aria-label="Filter Produk" className="bg-white p-3.5 md:p-4 rounded-2xl border border-stone-200 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk..."
            aria-label="Cari nama produk"
            className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter Berdasarkan Kategori"
            className="w-full sm:w-auto px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Urutkan Produk"
            className="w-full sm:w-auto px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
            <option value="name-asc">Nama (A-Z)</option>
          </select>
        </div>
      </section>

      {/* Tabel Produk */}
      <section aria-label="Daftar Tabel Produk" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {loading ? (
          <p className="p-6 text-sm text-stone-500">Memuat katalog produk...</p>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <p className="text-sm font-medium">Tidak ada produk yang ditemukan.</p>
            <p className="text-xs mt-1">
              Kategori ini belum memiliki produk, atau coba sesuaikan kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-780 text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                  <th className="p-4 pl-6">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Stok</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/50 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(prod.thumbnail)}
                          alt={prod.name || 'Gambar Produk'}
                          loading="lazy"
                          className="w-12 h-12 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h2 className="font-bold text-stone-900 truncate text-xs">{prod.name}</h2>
                          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {prod.description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px] font-semibold">
                        {getCategoryName(prod.category_id)}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-stone-900">
                      {getPriceDisplay(prod)}
                    </td>
                    <td className="p-4 font-semibold text-stone-900">{prod.stock ?? 0}</td>
                    <td className="p-4 whitespace-nowrap">{renderStatusBadge(prod.status)}</td>
                    <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                      {prod.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(prod.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(prod.id)}
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openEditModal(prod)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginasi Footer */}
        {!loading && filteredProducts.length > 0 && (
          <nav aria-label="Navigasi Paginasi" className="p-4 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="text-stone-500 text-center sm:text-left">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="px-3 font-semibold text-stone-700">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </nav>
        )}
      </section>

      {/* Modal Tambah / Edit Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-2xl p-5 md:p-6 border border-stone-200 shadow-2xl space-y-4 my-8">
            <h2 className="text-base md:text-lg font-bold text-stone-900">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700">Kategori</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition cursor-pointer"
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
                  <label className="block font-semibold mb-1 text-stone-700">Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700">Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition cursor-pointer"
                  >
                    <option value="approved">Approved / Aktif</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
              </div>

              {/* INPUT OPSI UKURAN & HARGA (SIZES) */}
              <div className="border-t border-stone-100 pt-3">
                <label className="block font-semibold mb-1.5 text-stone-700">Pilihan Ukuran & Harga</label>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['S', 'M', 'L', 'XL', 'XXL', 'All Size'].map((sz) => {
                    const isSelected = productForm.sizes.some((s) => s.name === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition text-xs ${
                          isSelected
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder="Tambah ukuran kustom (mis: 42, 30cm)..."
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold transition"
                  >
                    + Tambah
                  </button>
                </div>

                {/* Baris Harga & Stok per Ukuran */}
                {productForm.sizes.length > 0 && (
                  <div className="space-y-2 bg-stone-50 border border-stone-200 rounded-xl p-3">
                    <div className="grid grid-cols-[1fr_1.3fr_1fr_auto] gap-2 text-[10px] font-semibold text-stone-400 uppercase px-1">
                      <span>Ukuran</span>
                      <span>Harga (IDR)</span>
                      <span>Stok</span>
                      <span></span>
                    </div>
                    {productForm.sizes.map((s, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_1.3fr_1fr_auto] gap-2 items-center">
                        <span className="px-2.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold text-center truncate">
                          {s.name}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={s.price}
                          onChange={(e) => updateSizeField(idx, 'price', e.target.value)}
                          placeholder={`Default: ${productForm.price || 0}`}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                        />
                        <input
                          type="number"
                          min="0"
                          value={s.stock}
                          onChange={(e) => updateSizeField(idx, 'stock', e.target.value)}
                          placeholder={`Default: ${productForm.stock || 0}`}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeSize(idx)}
                          className="text-rose-500 hover:text-rose-700 font-bold px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-stone-400 pt-1">
                      Kosongkan harga/stok jika ingin memakai nilai default produk di atas.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Deskripsi</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Tuliskan deskripsi lengkap produk..."
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
                  onClick={() => setIsModalOpen(false)}
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

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
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

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-stone-900 text-white border-stone-800'
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
    </main>
  );
}