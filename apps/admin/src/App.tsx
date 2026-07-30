import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireRole from './guards/RequireRole';
import AdminLayout from './layouts/AdminLayout';
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import ProductManagement from './pages/vendor/ProductManagement';
import Onboarding from './pages/vendor/Onboarding';
import VendorOrdersList from './pages/vendor/OrdersList';
import VendorEnquiriesList from './pages/vendor/EnquiriesList';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorApprovals from './pages/admin/VendorApprovals';
import CMSManager from './pages/admin/CMSManager';
import SettingsPage from './pages/admin/SettingsPage';
import CouponsPage from './pages/admin/CouponsPage';
import OrdersManager from './pages/admin/OrdersManager';
import ReportsPage from './pages/admin/ReportsPage';
import CatalogModeration from './pages/admin/CatalogModeration';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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

          {/* Catch-all and defaults */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
