import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import About from './pages/about';
import Support from './pages/support';
import ScrollToTop from './components/ScrollToTop';
import Materials from './pages/about/Materials';
import MyDownloads from './pages/MyDownloads';
import Sustainability from './pages/about/Sustainability';
import Shipping from './pages/support/Shipping';
import SellerDashboard from './pages/seller/SellerDashboard';
import Contact from './pages/support/Contact';
import FaqPage from './pages/support/FaqPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CreateProduct from './pages/seller/CreateProduct';
import SellerProduct from './pages/seller/SellerProduct';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDashboard from './pages/admin/AdminDashboard';
import Catalog from './pages/Catalog';
import Marketplace from './pages/Marketplace';
import AdminCategories from './pages/admin/AdminCategories';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about/materials" element={<Materials />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/contact" element={<Contact />} />
          <Route path="/about/sustainability" element={<Sustainability />} />
          <Route path="/support/shipping" element={<Shipping />} />
          <Route path="/support/faq" element={<FaqPage />} />
          <Route path="/legal/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/legal/TermsOfService" element={<TermsOfService />} />

          {/* Protected Customer Routes */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/my-downloads" element={<ProtectedRoute><MyDownloads /></ProtectedRoute>} />

          {/* Protected Seller Routes */}
          <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProduct /></ProtectedRoute>} />
          <Route path="/seller/products/create" element={<ProtectedRoute role="seller"><CreateProduct /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}