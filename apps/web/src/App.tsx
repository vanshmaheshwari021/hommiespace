import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/PublicLayout.js';
import Home from './pages/Home.js';
import ProductListing from './pages/ProductListing.js';
import ProductDetail from './pages/ProductDetail.js';
import VendorShowroom from './pages/VendorShowroom.js';
import Checkout from './pages/Checkout.js';
import SupportTickets from './pages/SupportTickets.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProfilePage from './pages/ProfilePage.js';

// Unified Admin & Vendor Layouts & Guards
import RequireRole from './guards/RequireRole.js';
import AdminLayout from './layouts/AdminLayout.js';
import VendorLayout from './layouts/VendorLayout.js';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.js';
import VendorApprovals from './pages/admin/VendorApprovals.js';
import CatalogModeration from './pages/admin/CatalogModeration.js';
import CMSManager from './pages/admin/CMSManager.js';
import SettingsPage from './pages/admin/SettingsPage.js';
import CouponsPage from './pages/admin/CouponsPage.js';
import OrdersManager from './pages/admin/OrdersManager.js';
import ReportsPage from './pages/admin/ReportsPage.js';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard.js';
import ProductManagement from './pages/vendor/ProductManagement.js';
import Onboarding from './pages/vendor/Onboarding.js';
import VendorOrdersList from './pages/vendor/OrdersList.js';
import VendorEnquiriesList from './pages/vendor/EnquiriesList.js';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main Storefront Layout Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/vendors/:id" element={<VendorShowroom />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/orders" element={<ProfilePage />} />
            <Route path="/profile/tickets" element={<SupportTickets />} />
          </Route>

          {/* Standalone Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Unified Vendor Routes */}
          <Route element={<RequireRole allowedRoles={['vendor']} />}>
            <Route element={<VendorLayout />}>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<ProductManagement />} />
              <Route path="/vendor/onboarding" element={<Onboarding />} />
              <Route path="/vendor/orders" element={<VendorOrdersList />} />
              <Route path="/vendor/enquiries" element={<VendorEnquiriesList />} />
            </Route>
          </Route>

          {/* Unified Admin Routes */}
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

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
