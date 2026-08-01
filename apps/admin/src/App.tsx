import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/auth.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import AdminLogin from './pages/AdminLogin.js';
import RequireRole from './guards/RequireRole.js';
import AdminLayout from './layouts/AdminLayout.js';
import VendorLayout from './layouts/VendorLayout.js';
import VendorDashboard from './pages/vendor/VendorDashboard.js';
import ProductManagement from './pages/vendor/ProductManagement.js';
import Onboarding from './pages/vendor/Onboarding.js';
import VendorOrdersList from './pages/vendor/OrdersList.js';
import VendorEnquiriesList from './pages/vendor/EnquiriesList.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import VendorApprovals from './pages/admin/VendorApprovals.js';
import CMSManager from './pages/admin/CMSManager.js';
import SettingsPage from './pages/admin/SettingsPage.js';
import CouponsPage from './pages/admin/CouponsPage.js';
import OrdersManager from './pages/admin/OrdersManager.js';
import ReportsPage from './pages/admin/ReportsPage.js';
import CatalogModeration from './pages/admin/CatalogModeration.js';
import Unauthorized from './pages/Unauthorized.js';

const queryClient = new QueryClient();

// Cross-Origin Auth Token Handoff Handler
function AuthHandoffHandler() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userJson = params.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        setAuth(user, token, null);
        navigate('/admin/dashboard', { replace: true });
      } catch (err) {
        console.error('Failed to parse cross-origin token handoff:', err);
      }
    }
  }, [setAuth, navigate]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthHandoffHandler />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Vendor Routes */}
          <Route element={<RequireRole allowedRoles={['vendor']} />}>
            <Route element={<VendorLayout />}>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<ProductManagement />} />
              <Route path="/vendor/onboarding" element={<Onboarding />} />
              <Route path="/vendor/orders" element={<VendorOrdersList />} />
              <Route path="/vendor/enquiries" element={<VendorEnquiriesList />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<RequireRole allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/vendors" element={<VendorApprovals />} />
              <Route path="/admin/catalog" element={<CatalogModeration />} />
              <Route path="/admin/cms" element={<CMSManager />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/coupons" element={<CouponsPage />} />
              <Route path="/admin/orders" element={<OrdersManager />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Default root routes redirect to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
