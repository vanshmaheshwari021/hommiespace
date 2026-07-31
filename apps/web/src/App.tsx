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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main Layout Pages */}
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

          {/* Dedicated Standalone Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
