# DigiMarket 🛍️

Platform marketplace digital & fisik — tempat penjual (seller) memasarkan produk fisik maupun aset digital, dan pembeli (buyer) bisa belanja dengan aman lewat integrasi pembayaran Midtrans.

**🔗 Live Demo:** [digimarket-six.vercel.app](https://digimarket-six.vercel.app)

---

## ✨ Fitur Utama

- **Marketplace & Katalog** — jelajahi produk fisik dan digital dengan filter kategori, harga, dan pencarian
- **Keranjang Belanja** — tambah, ubah kuantitas, dan checkout multi-produk sekaligus
- **Pembayaran Terintegrasi** — checkout via Midtrans Snap (kartu, VA, e-wallet, dll)
- **Produk Digital** — pembeli dapat token unduhan otomatis setelah pembayaran berhasil
- **Manajemen Stok per Varian** — dukungan ukuran/varian dengan stok terpisah per pilihan
- **Multi-Role**
  - **Buyer** — belanja, kelola keranjang, riwayat pesanan, unduh produk digital
  - **Seller** — kelola produk sendiri, pantau status approval
  - **Admin** — kelola seluruh kategori, produk, seller, dan approval produk
- **Responsif Penuh** — termasuk navigasi hamburger menu untuk mobile

---

## 🏗️ Tech Stack

### Backend
- **Laravel 11** (PHP 8.4)
- **MySQL-compatible** — [TiDB Cloud](https://tidbcloud.com) (serverless, SSL-required)
- **Laravel Sanctum** — autentikasi berbasis token
- **Midtrans PHP SDK** — payment gateway

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router**
- **Zustand** — state management
- **Axios** — HTTP client

### Infrastruktur & Deployment
| Layer | Platform |
|---|---|
| Backend (API) | [Railway](https://railway.app) — Nginx + PHP-FPM via Supervisor |
| Database | [TiDB Cloud](https://tidbcloud.com) |
| Frontend | [Vercel](https://vercel.com) |
| Payment Gateway | [Midtrans](https://midtrans.com) (Sandbox/Production) |

---

## 📁 Struktur Project
digimarket/
├── backend/ # Laravel API
│ ├── app/
│ │ └── Http/Controllers/
│ ├── database/
│ │ ├── migrations/
│ │ └── seeders/
│ ├── docker/ # Config Nginx + Supervisor untuk production
│ ├── storage/app/public/products/ # Aset gambar produk
│ └── dockerfile
├── frontend/ # React + Vite SPA
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── stores/
│ │ └── services/api.js
│ └── index.html
└── docker-compose.yml # Setup lokal (MySQL, Redis, backend, frontend)

---

## 🚀 Menjalankan di Lokal

### Prasyarat
- Docker Desktop
- Node.js 18+ & npm
- Composer (opsional, kalau tidak lewat Docker)

### 1. Clone repo
```bash
git clone https://github.com/yeremia-ganteng/Digimarket.git
cd digimarket
```

### 2. Setup environment
Salin file environment contoh di masing-masing folder, lalu isi sesuai kredensial masing-masing (database, Midtrans, dll):
```bash
cp backend/.env.example backend/.env
```

### 3A. Jalankan backend via Docker Compose
```bash
docker-compose up -d
```
Ini menjalankan:
- **MySQL** — `localhost:3309`
- **Redis** — `localhost:6379`
- **Backend (Laravel)** — via Nginx, `localhost:8000`

Migrasi & seed database:
```bash
docker exec -it <nama-container-backend> php artisan migrate --seed
```

### 3B. Jalankan frontend
```bash
cd frontend
npm install
npm run dev
```
Buat file `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STORAGE_BASE_URL=http://localhost:8000/storage
```

### 4. Buka aplikasi
- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:8000/api](http://localhost:8000/api)

---

## 🔑 Environment Variables Penting

### Backend (`backend/.env`)
```env
APP_URL=
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
MYSQL_ATTR_SSL_CA=          # wajib untuk koneksi TiDB Cloud
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=          # contoh: https://api.digimarket.app/api
VITE_STORAGE_BASE_URL=      # contoh: https://api.digimarket.app/storage
```

> ⚠️ Untuk deployment di Vercel, kedua variabel `VITE_*` di atas harus di-set dengan tipe **Config** (bukan Secret), karena akan di-bundle ke kode client-side.

---

## 👥 Role & Akses

| Role | Akses |
|---|---|
| `admin` | Kelola kategori, produk, seller, approval produk |
| `seller` | Kelola produk milik sendiri |
| `buyer` | Default untuk semua pendaftaran baru (keamanan: role tidak bisa diatur dari form pendaftaran publik) |

---

## 📦 Deployment
Vercel (Frontend) → Railway (Backend/Nginx+PHP-FPM) → TiDB Cloud (Database)
↓
Midtrans (Payment)


Backend menjalankan **Nginx + PHP-FPM** dikelola oleh **Supervisor** dalam satu container Docker untuk performa production yang optimal, menggantikan `php artisan serve` yang hanya cocok untuk development.

Webhook pembayaran Midtrans terdaftar ke:

https://<domain-backend>/api/midtrans/callback

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m "feat: deskripsi fitur"`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran/portofolio.