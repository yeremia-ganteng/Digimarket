import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const hasExecutedRef = useRef(false);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  useEffect(() => {
    // Mencegah eksekusi berulang (double checkout) di React StrictMode
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const processCheckout = async () => {
      try {
        const res = await api.post('/checkout');
        setOrder(res.data.order);

        const { snap_token } = res.data;
        if (window.snap && snap_token) {
          window.snap.pay(snap_token, {
            onSuccess: function () {
              showToast('Pembayaran berhasil!');
              redirectTimerRef.current = setTimeout(() => navigate('/orders'), 1200);
            },
            onPending: function () {
              showToast('Menunggu pembayaran Anda.', 'pending');
              redirectTimerRef.current = setTimeout(() => navigate('/orders'), 1200);
            },
            onError: function () {
              showToast('Pembayaran gagal.', 'error');
            },
            onClose: function () {
              showToast('Popup pembayaran ditutup.', 'pending');
            },
          });
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Gagal memproses checkout.', 'error');
        redirectTimerRef.current = setTimeout(() => navigate('/cart'), 1200);
      } finally {
        setLoading(false);
      }
    };

    processCheckout();

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className="text-center py-16 text-gray-400" role="status" aria-live="polite">
        Memproses pesanan...
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
      </header>

      {order ? (
        <p className="text-gray-500">
          Pesanan #{order.id} sedang diproses. Ikuti instruksi pembayaran di popup.
        </p>
      ) : (
        <p className="text-gray-500">Menyiapkan pembayaran...</p>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            role="alert"
            aria-live="assertive"
            className={`px-5 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'pending'
                ? 'bg-amber-800 text-white border-amber-700'
                : 'bg-gray-900 text-white border-gray-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'error'
                  ? 'bg-rose-400'
                  : toast.type === 'pending'
                  ? 'bg-amber-300'
                  : 'bg-emerald-400'
              }`}
            ></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </main>
  );
}