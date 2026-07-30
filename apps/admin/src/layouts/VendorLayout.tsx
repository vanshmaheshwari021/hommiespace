import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { Button } from '@hommiespace/ui';

export const VendorLayout: React.FC = () => {
  const { user, vendor, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const vendorLinks = [
    { label: 'Overview', path: '/vendor/dashboard' },
    { label: 'Manage Products', path: '/vendor/products' },
    { label: 'Studio Onboarding', path: '/vendor/onboarding' },
    { label: 'Customer Orders', path: '/vendor/orders' },
    { label: 'Product Enquiries', path: '/vendor/enquiries' }
  ];

  return (
    <div className="min-h-screen bg-brand-linen flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-brand-walnut text-brand-linen px-6 py-4 flex items-center justify-between border-b border-brand-charcoal/20 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/vendor/dashboard" className="font-serif text-lg font-bold tracking-wider text-brand-linen hover:text-brand-sand transition-colors">
            HOMMIE<span className="text-brand-terracotta">SPACE</span>
          </Link>
          <span className="text-[9px] px-2.5 py-0.5 bg-brand-terracotta text-brand-linen uppercase tracking-widest font-semibold">
            Studio Partner
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-brand-sand hidden sm:inline">Logged in: {user?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-brand-linen hover:bg-brand-charcoal/50 text-[10px]">
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-brand-sand-dark/25 p-6 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-4">
                Partner Menu
              </p>
              <nav className="flex flex-col gap-2">
                {vendorLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all duration-300 border-l-2
                        ${isActive 
                          ? 'bg-brand-sand-light border-brand-terracotta text-brand-walnut font-bold' 
                          : 'border-transparent text-brand-clay hover:bg-brand-linen-light hover:text-brand-walnut'}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Vendor Approval Banner */}
            <div className={`p-4 border text-[10px] leading-relaxed font-sans
              ${vendor?.isApproved 
                ? 'bg-brand-sage/10 border-brand-sage/35 text-brand-sage font-semibold' 
                : 'bg-brand-terracotta/10 border-brand-terracotta/25 text-brand-terracotta font-semibold'}`}>
              <strong>Status:</strong> {vendor?.isApproved ? 'Approved Partner' : 'Pending Verification'}
            </div>
          </div>

          <div className="text-[10px] text-brand-clay font-sans border-t border-brand-sand-dark/15 pt-4">
            <p>HOMMIE SPACE LTD</p>
            <p className="mt-1">Partner Support v1.0.0</p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto bg-brand-linen-dark/20 text-left">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
