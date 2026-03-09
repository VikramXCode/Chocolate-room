import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts (eagerly loaded — always needed)
import CustomerLayout from './layouts/CustomerLayout';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Shared loading fallback
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-400/20 border-t-gold-400" />
        <span className="text-sm text-chocolate-400">Loading…</span>
      </div>
    </div>
  );
}

// ─── Lazy-loaded landing ────────────────────────────────────────────
const LandingPage = lazy(() => import('./pages/LandingPage'));

// ─── Lazy-loaded customer pages ─────────────────────────────────────
const HomePage = lazy(() => import('./pages/customer/HomePage'));
const MenuPage = lazy(() => import('./pages/customer/MenuPage'));
const CartPage = lazy(() => import('./pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const OrderTrackingPage = lazy(() => import('./pages/customer/OrderTrackingPage'));
const ReviewsPage = lazy(() => import('./pages/customer/ReviewsPage'));
const QRTableMenuPage = lazy(() => import('./pages/customer/QRTableMenuPage'));
const QRMenuPage = lazy(() => import('./pages/customer/QRMenuPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));

// ─── Lazy-loaded auth ───────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/LoginPage'));

// ─── Lazy-loaded dashboard pages ────────────────────────────────────
const WaiterDashboard = lazy(() => import('./pages/dashboards/waiter/WaiterDashboard'));
const WaiterTables = lazy(() => import('./pages/dashboards/waiter/WaiterTables'));
const WaiterOrders = lazy(() => import('./pages/dashboards/waiter/WaiterOrders'));
const WaiterMenu = lazy(() => import('./pages/dashboards/waiter/WaiterMenu'));

const AdminDashboard = lazy(() => import('./pages/dashboards/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/dashboards/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/dashboards/admin/AdminOrders'));
const AdminTables = lazy(() => import('./pages/dashboards/admin/AdminTables'));
const AdminReviews = lazy(() => import('./pages/dashboards/admin/AdminReviews'));

const SuperAdminDashboard = lazy(() => import('./pages/dashboards/superAdmin/SuperAdminDashboard'));
const SuperAdminUsers = lazy(() => import('./pages/dashboards/superAdmin/SuperAdminUsers'));
const SuperAdminSettings = lazy(() => import('./pages/dashboards/superAdmin/SuperAdminSettings'));
const SuperAdminAnalytics = lazy(() => import('./pages/dashboards/superAdmin/SuperAdminAnalytics'));

// ─────────────────────────────────────────────────────────────────────

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* ─── Landing / Marketing site (separate layout) ──────── */}
          <Route element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* QR Table ordering (standalone page — no layout) */}
          <Route path="/table/:tableId" element={<QRTableMenuPage />} />
          <Route path="/qr-menu" element={<QRMenuPage />} />

          {/* ─── Customer ordering app (/app/*) ──────────────────── */}
          <Route path="/app" element={<CustomerLayout />}>
            <Route index element={<Navigate to="menu" replace />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrderTrackingPage />} />
            <Route path="orders/:orderId" element={<OrderTrackingPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* ─── Waiter dashboard ─────────────────────────────────── */}
          <Route path="/dashboard/waiter" element={<DashboardLayout><WaiterDashboard /></DashboardLayout>} />
          <Route path="/dashboard/waiter/tables" element={<DashboardLayout><WaiterTables /></DashboardLayout>} />
          <Route path="/dashboard/waiter/orders" element={<DashboardLayout><WaiterOrders /></DashboardLayout>} />
          <Route path="/dashboard/waiter/menu" element={<DashboardLayout><WaiterMenu /></DashboardLayout>} />

          {/* ─── Admin dashboard ──────────────────────────────────── */}
          <Route path="/dashboard/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
          <Route path="/dashboard/admin/products" element={<DashboardLayout><AdminProducts /></DashboardLayout>} />
          <Route path="/dashboard/admin/orders" element={<DashboardLayout><AdminOrders /></DashboardLayout>} />
          <Route path="/dashboard/admin/tables" element={<DashboardLayout><AdminTables /></DashboardLayout>} />
          <Route path="/dashboard/admin/reviews" element={<DashboardLayout><AdminReviews /></DashboardLayout>} />

          {/* ─── Super Admin dashboard ────────────────────────────── */}
          <Route path="/dashboard/superadmin" element={<DashboardLayout><SuperAdminDashboard /></DashboardLayout>} />
          <Route path="/dashboard/superadmin/users" element={<DashboardLayout><SuperAdminUsers /></DashboardLayout>} />
          <Route path="/dashboard/superadmin/settings" element={<DashboardLayout><SuperAdminSettings /></DashboardLayout>} />
          <Route path="/dashboard/superadmin/analytics" element={<DashboardLayout><SuperAdminAnalytics /></DashboardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
