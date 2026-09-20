import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'failed'];

const ORDER_STATUS_LABEL = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  failed: 'Gagal',
};

const ORDER_STATUS_DOT = {
  pending: 'bg-amber-500',
  paid: 'bg-emerald-500',
  processing: 'bg-blue-500',
  shipped: 'bg-violet-500',
  completed: 'bg-emerald-600',
  cancelled: 'bg-stone-400',
  failed: 'bg-rose-500',
};

const ORDER_STATUS_BADGE = {
  pending: 'bg-amber-50 text-amber-700',
  paid: 'bg-emerald-50 text-emerald-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-violet-50 text-violet-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-stone-100 text-stone-600',
  failed: 'bg-rose-50 text-rose-700',
};

const METHOD_BADGE = {
  GET: 'bg-blue-50 text-blue-700',
  POST: 'bg-emerald-50 text-emerald-700',
  PUT: 'bg-amber-50 text-amber-700',
  PATCH: 'bg-amber-50 text-amber-700',
  DELETE: 'bg-rose-50 text-rose-700',
};

function statusCodeClass(code) {
  if (code >= 500) return 'text-rose-600 font-bold';
  if (code >= 400) return 'text-amber-600 font-bold';
  if (code >= 300) return 'text-blue-600 font-semibold';
  return 'text-emerald-600 font-semibold';
}

function formatRupiah(n) {
  return `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
}

function todayLabel() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function timeAgo(dateStr) {
  if (!dateStr) return '-';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return 'baru saja';
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function downloadCsv(filename, rows, headers) {
  const escapeCell = (val) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csvContent = [headers.join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ================= SKELETON HOLDERS =================
function KpiCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs animate-pulse space-y-3">
      <div className="h-3 w-28 bg-stone-200 rounded" />
      <div className="h-7 w-36 bg-stone-300 rounded" />
      <div className="h-3 w-44 bg-stone-200 rounded" />
    </div>
  );
}

function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="p-4">
          <div className="h-4 bg-stone-200 rounded w-full max-w-120" />
        </td>
      ))}
    </tr>
  );
}

function HealthCardSkeleton() {
  return (
    <div className="p-3 border border-stone-200 rounded-xl animate-pulse space-y-2">
      <div className="h-2.5 w-16 bg-stone-200 rounded" />
      <div className="h-4 w-20 bg-stone-300 rounded" />
      <div className="h-2.5 w-24 bg-stone-200 rounded" />
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  // ============ TOAST ============
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // ============ CONFIRM MODAL ============
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionText: 'Konfirmasi',
    onConfirm: null,
  });
  const closeConfirmModal = () =>
    setConfirmModal({ isOpen: false, title: '', message: '', actionText: 'Konfirmasi', onConfirm: null });

  // ============ STATS ============
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Gagal memuat statistik dashboard:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchStats, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchStats]);

  // ============ SYSTEM HEALTH ============
  const [health, setHealth] = useState(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard/system-health');
      setHealth(res.data);
    } catch (err) {
      console.error('Gagal memuat status infrastruktur:', err);
    }
  }, []);

  // ============ ORDERS ============
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotalCount, setOrdersTotalCount] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setOrderSearch(orderSearchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [orderSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => setOrdersPage(1), 0);
    return () => clearTimeout(t);
  }, [orderStatusFilter, orderSearch]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/admin/orders', {
        params: {
          page: ordersPage,
          ...(orderStatusFilter !== 'all' && { status: orderStatusFilter }),
          ...(orderSearch && { search: orderSearch }),
        },
      });
      setOrders(res.data.data || []);
      setOrdersTotalPages(res.data.last_page || 1);
      setOrdersTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
      showToast('Gagal memuat data pesanan.', 'error');
    } finally {
      setOrdersLoading(false);
    }
  }, [ordersPage, orderStatusFilter, orderSearch]);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [activeTab, fetchOrders]);

  const requestStatusChange = (order, newStatus) => {
    if (newStatus === order.status) return;
    setConfirmModal({
      isOpen: true,
      title: 'Ubah Status Pesanan',
      message: `Ubah status pesanan #${order.id} (${order.user?.name || 'Tanpa nama'}) dari "${ORDER_STATUS_LABEL[order.status]}" menjadi "${ORDER_STATUS_LABEL[newStatus]}"?`,
      actionText: 'Ubah Status',
      onConfirm: async () => {
        try {
          const res = await api.put(`/admin/orders/${order.id}/status`, { status: newStatus });
          setOrders((prev) => prev.map((o) => (o.id === order.id ? res.data.order : o)));
          showToast('Status pesanan berhasil diperbarui!');
          fetchStats();
        } catch (err) {
          showToast(err.response?.data?.message || 'Gagal memperbarui status.', 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const exportOrdersCsv = () => {
    if (orders.length === 0) {
      showToast('Tidak ada data pesanan pada halaman ini untuk diekspor.', 'error');
      return;
    }
    const rows = orders.map((o) => [
      o.id,
      o.payment_ref || '',
      o.user?.name || '',
      o.user?.email || '',
      o.items?.length || 0,
      o.total,
      ORDER_STATUS_LABEL[o.status] || o.status,
      o.created_at,
    ]);
    downloadCsv(
      `pesanan-halaman-${ordersPage}.csv`,
      rows,
      ['ID', 'Ref Pembayaran', 'Nama Pembeli', 'Email Pembeli', 'Jumlah Item', 'Total', 'Status', 'Dibuat Pada']
    );
  };

  // ============ ACTIVITY LOGS ============
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsTotalCount, setLogsTotalCount] = useState(0);
  const [logMethodFilter, setLogMethodFilter] = useState('all');
  const [logSearchInput, setLogSearchInput] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [inspectLog, setInspectLog] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLogSearch(logSearchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [logSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => setLogsPage(1), 0);
    return () => clearTimeout(t);
  }, [logMethodFilter, logSearch]);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await api.get('/admin/activity-logs', {
        params: {
          page: logsPage,
          ...(logMethodFilter !== 'all' && { method: logMethodFilter }),
          ...(logSearch && { search: logSearch }),
        },
      });
      setLogs(res.data.data || []);
      setLogsTotalPages(res.data.last_page || 1);
      setLogsTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Gagal memuat log aktivitas:', err);
    } finally {
      setLogsLoading(false);
    }
  }, [logsPage, logMethodFilter, logSearch]);

  useEffect(() => {
    if (activeTab !== 'logs') return;
    const initialFetch = setTimeout(() => {
      fetchLogs();
      fetchStats();
      fetchHealth();
    }, 0);

    if (!autoRefresh) return () => clearTimeout(initialFetch);
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
      fetchHealth();
    }, 5000);
    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [activeTab, fetchLogs, fetchStats, fetchHealth, autoRefresh]);

  const exportLogsCsv = () => {
    if (logs.length === 0) {
      showToast('Tidak ada data log pada halaman ini untuk diekspor.', 'error');
      return;
    }
    const rows = logs.map((l) => [
      l.method,
      l.endpoint,
      l.status_code,
      l.duration_ms ?? '',
      l.user?.name || 'Guest',
      l.user?.email || '',
      l.ip_address || '',
      l.created_at,
    ]);
    downloadCsv(
      `log-aktivitas-halaman-${logsPage}.csv`,
      rows,
      ['Method', 'Endpoint', 'Status Code', 'Durasi (ms)', 'Nama Pengguna', 'Email', 'IP', 'Waktu']
    );
  };

  // ============ ADD SELLER ============
  const [sellerForm, setSellerForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [sellerSubmitting, setSellerSubmitting] = useState(false);

  const handleAddSeller = async (e) => {
    e.preventDefault();
    if (sellerForm.password !== sellerForm.password_confirmation) {
      showToast('Konfirmasi password tidak cocok.', 'error');
      return;
    }
    setSellerSubmitting(true);
    try {
      await api.post('/admin/sellers', sellerForm);
      showToast(`Akun seller "${sellerForm.name}" berhasil dibuat!`);
      setSellerForm({ name: '', email: '', password: '', password_confirmation: '' });
      fetchStats();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const firstError = apiErrors ? Object.values(apiErrors)[0]?.[0] : null;
      showToast(firstError || err.response?.data?.message || 'Gagal membuat akun seller.', 'error');
    } finally {
      setSellerSubmitting(false);
    }
  };

  const sellerInitials = sellerForm.name.trim().slice(0, 2).toUpperCase() || 'SL';

  const tabs = [
    { 
      id: 'orders', 
      label: 'Status Order', 
      badge: ordersTotalCount || null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'logs', 
      label: 'Log Aktivitas API', 
      liveDot: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 'sellers', 
      label: 'Tambah Seller', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif] text-stone-900 relative">
      {/* ===================== HEADER ===================== */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-stone-400 mb-2">
            Operasional Terpadu &bull;{' '}
            <span className="text-emerald-600">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 align-middle" />
              Live Production
            </span>
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl text-stone-900">Dashboard Admin</h1>
          <p className="text-xs text-stone-500 mt-2 max-w-lg">
            Pantau pesanan real-time, pantauan aktivitas log API, dan otorisasi merchant seller secara terpusat.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hari Ini, {todayLabel()}
          </span>
          <button
            type="button"
            onClick={activeTab === 'logs' ? exportLogsCsv : exportOrdersCsv}
            className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50 transition cursor-pointer flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ekspor CSV
          </button>
        </div>
      </header>

      {/* ===================== KPI CARDS ===================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Transaksi Hari Ini</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{formatRupiah(stats?.today_revenue)}</p>
              <p className="text-[11px] text-stone-400 mt-1">Dari {stats?.today_total_orders ?? 0} transaksi hari ini</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Menunggu Konfirmasi</span>
                {(stats?.pending_orders_count ?? 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">Perlu Tindakan</span>
                )}
              </div>
              <p className="text-2xl font-bold text-stone-900">{stats?.pending_orders_count ?? 0} Pesanan</p>
              <p className="text-[11px] text-stone-400 mt-1">Estimasi nilai {formatRupiah(stats?.pending_orders_value)}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Seller Terdaftar</span>
                {(stats?.new_sellers_this_week ?? 0) > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-600">+{stats.new_sellers_this_week} minggu ini</span>
                )}
              </div>
              <p className="text-2xl font-bold text-stone-900">{stats?.seller_count ?? 0} Atelier</p>
              <p className="text-[11px] text-stone-400 mt-1">Akun berperan sebagai seller</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">API Health & Latensi</span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {stats?.success_rate ?? 100}%
                </span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{stats?.avg_latency_ms ?? 0}ms <span className="text-xs font-normal text-stone-400">avg</span></p>
              <p className="text-[11px] text-stone-400 mt-1">{stats?.requests_today ?? 0} request hari ini &bull; {stats?.error_count_today ?? 0} error</p>
            </div>
          </>
        )}
      </section>

      {/* ===================== TABS ===================== */}
      <div className="flex gap-2 mb-6 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white border border-b-0 border-stone-200 text-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-white">{tab.badge}</span>
            )}
            {tab.liveDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* ===================== TAB: ORDERS ===================== */}
      {activeTab === 'orders' && (
        <section className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <input
              type="text"
              value={orderSearchInput}
              onChange={(e) => setOrderSearchInput(e.target.value)}
              placeholder="Cari nama, email, atau ref. pembayaran..."
              className="w-full sm:w-80 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
            />
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                <tr>
                  <th className="p-4 pl-6">Pesanan</th>
                  <th className="p-4">Pembeli</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ordersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-stone-400 text-sm">
                      Tidak ada pesanan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold">#{order.id}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{order.payment_ref || '-'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{order.user?.name || 'Tidak diketahui'}</p>
                        <p className="text-[10px] text-stone-400">{order.user?.email}</p>
                      </td>
                      <td className="p-4 text-stone-500">{order.items?.length || 0} produk</td>
                      <td className="p-4 font-bold">{formatRupiah(order.total)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${ORDER_STATUS_BADGE[order.status] || 'bg-stone-100 text-stone-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[order.status] || 'bg-stone-400'}`} />
                          {ORDER_STATUS_LABEL[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => requestStatusChange(order, e.target.value)}
                          className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 cursor-pointer"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!ordersLoading && orders.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
              <span className="text-stone-500">
                Menampilkan {(ordersPage - 1) * 10 + 1} - {Math.min(ordersPage * 10, ordersTotalCount)} dari {ordersTotalCount} pesanan
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={ordersPage === 1}
                  onClick={() => setOrdersPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                >
                  Sebelumnya
                </button>
                <span className="px-3 font-semibold text-stone-700">{ordersPage} / {ordersTotalPages}</span>
                <button
                  disabled={ordersPage === ordersTotalPages}
                  onClick={() => setOrdersPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================== TAB: ACTIVITY LOGS ===================== */}
      {activeTab === 'logs' && (
        <>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-stone-400 mb-1">
            Operasional Sistem &amp; Infrastruktur &bull; Live Monitoring
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Log Aktivitas API</h2>
              <p className="text-xs text-stone-500 mt-1 max-w-lg">
                Pantau lalu lintas request HTTP/REST, performa response time, audit otentikasi sesi, dan jejak IP secara real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Hari Ini, {todayLabel()}
              </span>
              <label className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="cursor-pointer" />
                Auto-Refresh: 5s
                <span className={autoRefresh ? 'text-emerald-600 font-bold' : 'text-stone-400 font-bold'}>
                  {autoRefresh ? 'AKTIF' : 'MATI'}
                </span>
              </label>
              <button
                type="button"
                onClick={exportLogsCsv}
                className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50 transition cursor-pointer flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ekspor Log
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsLoading ? (
              <>
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </>
            ) : (
              <>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Total Request Hari Ini</span>
                  <p className="text-xl font-bold text-stone-900">{(stats?.requests_today ?? 0).toLocaleString('id-ID')} Req</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Rata-rata Latensi</span>
                  <p className="text-xl font-bold text-stone-900">{stats?.avg_latency_ms ?? 0} ms</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Success Rate</span>
                  <p className="text-xl font-bold text-emerald-600">{stats?.success_rate ?? 100}%</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Error Terdeteksi</span>
                  <p className="text-xl font-bold text-rose-600">{stats?.error_count_today ?? 0} Anomali</p>
                </div>
              </>
            )}
          </div>

          <section className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden mb-6">
            <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <input
                type="text"
                value={logSearchInput}
                onChange={(e) => setLogSearchInput(e.target.value)}
                placeholder="Cari endpoint (mis: /products)..."
                className="w-full sm:w-72 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition"
              />
              <select
                value={logMethodFilter}
                onChange={(e) => setLogMethodFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="all">Semua Method</option>
                {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                  <tr>
                    <th className="p-4 pl-6">Method</th>
                    <th className="p-4">Endpoint</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Latensi</th>
                    <th className="p-4">Pengguna / Akun</th>
                    <th className="p-4">IP</th>
                    <th className="p-4">Waktu</th>
                    <th className="p-4 pr-6 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {logsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-stone-400 text-sm">
                        Belum ada aktivitas tercatat.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/50 transition">
                        <td className="p-4 pl-6">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${METHOD_BADGE[log.method] || 'bg-stone-100 text-stone-600'}`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-stone-700">{log.endpoint}</td>
                        <td className={`p-4 ${statusCodeClass(log.status_code)}`}>{log.status_code}</td>
                        <td className="p-4 text-stone-500">{log.duration_ms != null ? `${log.duration_ms} ms` : '-'}</td>
                        <td className="p-4">
                          {log.user ? (
                            <>
                              <p className="font-semibold">{log.user.name}</p>
                              <p className="text-[10px] text-stone-400">{log.user.email}</p>
                            </>
                          ) : (
                            <span className="text-stone-400 italic">Guest</span>
                          )}
                        </td>
                        <td className="p-4 text-stone-500 font-mono">{log.ip_address || '-'}</td>
                        <td className="p-4 text-stone-400">{timeAgo(log.created_at)}</td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => setInspectLog(log)}
                            className="text-stone-500 hover:text-stone-900 font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Inspeksi
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!logsLoading && logs.length > 0 && (
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <span className="text-stone-500">
                  Menampilkan {(logsPage - 1) * 20 + 1} - {Math.min(logsPage * 20, logsTotalCount)} dari {logsTotalCount} entri log
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={logsPage === 1}
                    onClick={() => setLogsPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-3 font-semibold text-stone-700">{logsPage} / {logsTotalPages}</span>
                  <button
                    disabled={logsPage === logsTotalPages}
                    onClick={() => setLogsPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Infrastruktur & Koneksi Layanan</h3>
                <p className="text-[11px] text-stone-400">Pemeriksaan integritas dependensi sistem secara langsung.</p>
              </div>
              {health && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {health.database?.healthy && health.cache?.healthy ? 'Sistem Inti Beroperasi Normal' : 'Ada Gangguan Terdeteksi'}
                </span>
              )}
            </div>

            {!health ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <HealthCardSkeleton />
                <HealthCardSkeleton />
                <HealthCardSkeleton />
                <HealthCardSkeleton />
                <HealthCardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 border border-stone-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Database</p>
                  <p className="text-xs font-semibold text-stone-800">{health.database?.driver}</p>
                  <p className={`text-[10px] mt-1 font-semibold ${health.database?.healthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {health.database?.healthy ? 'Terhubung' : 'Tidak Terhubung'}
                  </p>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Cache</p>
                  <p className="text-xs font-semibold text-stone-800">{health.cache?.driver}</p>
                  <p className={`text-[10px] mt-1 font-semibold ${health.cache?.healthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {health.cache?.healthy ? 'Aktif' : 'Bermasalah'}
                  </p>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Antrian</p>
                  <p className="text-xs font-semibold text-stone-800">{health.queue?.driver}</p>
                  <p className="text-[10px] mt-1 text-stone-500">
                    {health.queue?.pending ?? '-'} tertunda &bull; {health.queue?.failed ?? '-'} gagal
                  </p>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Storage</p>
                  <p className="text-xs font-semibold text-stone-800">{health.storage?.disk}</p>
                  <p className="text-[10px] mt-1 text-emerald-600 font-semibold">Terkonfigurasi</p>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Payment Webhook</p>
                  {health.payment_webhook ? (
                    <>
                      <p className={`text-xs font-semibold ${health.payment_webhook.healthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {health.payment_webhook.status_code}
                      </p>
                      <p className="text-[10px] mt-1 text-stone-500">{timeAgo(health.payment_webhook.last_seen_at)}</p>
                    </>
                  ) : (
                    <p className="text-[10px] mt-1 text-stone-400 italic">Belum ada aktivitas</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* ===================== TAB: ADD SELLER ===================== */}
      {activeTab === 'sellers' && (
        <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 w-full">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              {sellerInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Buat Akun Seller Baru</h2>
              <p className="text-xs text-stone-500 mt-1">
                Akun akan langsung aktif dengan role <strong>seller</strong> tanpa proses pendaftaran mandiri. Pastikan email valid — kredensial akan digunakan seller untuk masuk ke Dashboard Seller.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddSeller} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-stone-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={sellerForm.name}
                  onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-stone-700">Email Utama</label>
                <input
                  type="email"
                  required
                  value={sellerForm.email}
                  onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                  placeholder="seller@digimarket.com"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-stone-700">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={sellerForm.password}
                  onChange={(e) => setSellerForm({ ...sellerForm, password: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-stone-700">Konfirmasi Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={sellerForm.password_confirmation}
                  onChange={(e) => setSellerForm({ ...sellerForm, password_confirmation: e.target.value })}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Seller baru akan langsung bisa masuk ke <strong>/seller/dashboard</strong> menggunakan email dan password ini, dan dapat mulai menambahkan produk melalui menu Kelola Produk.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={sellerSubmitting}
                className="w-full md:w-auto min-w-200 bg-stone-900 hover:bg-black text-white px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {sellerSubmitting ? 'Membuat Akun...' : 'Buat Akun Seller'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* MODAL INSPEKSI LOG */}
      {inspectLog && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Detail Aktivitas #{inspectLog.id}</h3>
              <button onClick={() => setInspectLog(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="text-xs space-y-2 divide-y divide-stone-100">
              {[
                ['Method', inspectLog.method],
                ['Endpoint', inspectLog.endpoint],
                ['Status Code', inspectLog.status_code],
                ['Durasi', inspectLog.duration_ms != null ? `${inspectLog.duration_ms} ms` : '-'],
                ['Pengguna', inspectLog.user ? `${inspectLog.user.name} (${inspectLog.user.email})` : 'Guest'],
                ['IP Address', inspectLog.ip_address || '-'],
                ['Waktu', new Date(inspectLog.created_at).toLocaleString('id-ID')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between pt-2 first:pt-0">
                  <dt className="text-stone-400 font-medium">{label}</dt>
                  <dd className="text-stone-800 font-semibold text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-black text-white cursor-pointer transition shadow-xs"
              >
                {confirmModal.actionText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-rose-900 text-white border-rose-800' : 'bg-stone-900 text-white border-stone-800'
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