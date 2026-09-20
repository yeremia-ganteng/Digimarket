import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MAX_FILE_SIZE_MB = 20;

export default function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productType, setProductType] = useState('physical');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [digitalFile, setDigitalFile] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const closeConfirmModal = () => setConfirmModal({ isOpen: false });

  // SEO Optimization: Update Title
  useEffect(() => {
    document.title = 'Tambah Produk Baru | Dashboard Seller';
  }, []);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data || res.data))
      .catch((err) => console.error('Gagal memuat kategori:', err));
  }, []);

  const validateFile = (file) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(`Ukuran file maksimal adalah ${MAX_FILE_SIZE_MB}MB`, 'error');
      return false;
    }
    return true;
  };

  const submitProduct = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('category_id', categoryId);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (productType === 'digital' && digitalFile) formData.append('file', digitalFile);

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast(
        productType === 'digital'
          ? 'Produk digital berhasil diunggah! Menunggu approval admin.'
          : 'Produk fisik berhasil diunggah! Menunggu approval admin.'
      );
      setTimeout(() => navigate('/seller/products'), 1200);
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.response?.data?.message || 'Gagal mengunggah produk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (thumbnail && !validateFile(thumbnail)) return;
    if (digitalFile && !validateFile(digitalFile)) return;

    if (productType === 'digital' && !digitalFile) {
      setConfirmModal({ isOpen: true });
      return;
    }

    submitProduct();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">📤 Tambah Produk Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Produk</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProductType('physical');
                    setDigitalFile(null);
                  }}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                    productType === 'physical'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  📦 Produk Fisik
                </button>
                <button
                  type="button"
                  onClick={() => setProductType('digital')}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                    productType === 'digital'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  💾 Produk Digital
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {productType === 'physical'
                  ? 'Barang nyata yang perlu dikirim ke pembeli (misal: dompet, jam tangan, aksesoris).'
                  : 'Aset digital yang bisa langsung diunduh pembeli (misal: e-book, template, software).'}
              </p>
            </div>

            <div>
              <label htmlFor="product-name" className="block text-sm font-semibold text-gray-700 mb-2">Nama Produk</label>
              <input
                id="product-name"
                type="text"
                required
                placeholder={
                  productType === 'digital'
                    ? 'misal: E-book Master Laravel 11'
                    : 'misal: Dompet Kulit Cardholder'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  required
                  placeholder="50000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="product-category" className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select
                  id="product-category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="product-desc" className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Produk</label>
              <textarea
                id="product-desc"
                rows="4"
                placeholder="Penjelasan singkat mengenai produk Anda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center">
                <label htmlFor="product-thumb" className="block text-sm font-semibold text-gray-700 mb-1">
                  Thumbnail (Gambar) <span className="text-gray-400 font-normal">— opsional</span>
                </label>
                <input
                  id="product-thumb"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setThumbnail(e.target.files[0] || null)}
                  className="text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {productType === 'digital' && (
                <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center">
                  <label htmlFor="product-file" className="block text-sm font-semibold text-gray-700 mb-1">
                    File Digital (.zip / .pdf) <span className="text-gray-400 font-normal">— wajib sebelum bisa dibeli</span>
                  </label>
                  <input
                    id="product-file"
                    type="file"
                    accept=".zip,.pdf,.rar"
                    onChange={(e) => setDigitalFile(e.target.files[0] || null)}
                    className="text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Mengunggah...' : 'Simpan & Publikasikan'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-gray-100 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Belum Ada File Digital</h3>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Anda belum mengunggah file digital. Produk akan tetap tersimpan sebagai draft,
                namun <strong>tidak bisa dibeli</strong> sampai file diunggah lewat menu Edit. Lanjutkan?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  closeConfirmModal();
                  submitProduct();
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                Lanjutkan Tanpa File
              </button>
            </div>
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