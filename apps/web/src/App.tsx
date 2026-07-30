import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import VendorShowroom from './pages/VendorShowroom';
import Checkout from './pages/Checkout';
import OrdersList from './pages/OrdersList';
import SupportTickets from './pages/SupportTickets';
import Login from './pages/Login';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/vendors/:id" element={<VendorShowroom />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile/orders" element={<OrdersList />} />
            <Route path="/profile/tickets" element={<SupportTickets />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
