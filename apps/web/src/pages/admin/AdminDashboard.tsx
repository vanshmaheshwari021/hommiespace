import React, { useState } from 'react';
import { Card } from '@hommiespace/ui';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats] = useState({
    totalSales: '₹18,270.00',
    totalVendors: 3,
    totalProducts: 32,
    pendingVendors: 0
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
          Administrator Workspace
        </h1>
        <p className="text-brand-clay text-sm font-sans">
          Site-wide platform oversight, vendor approvals, and catalog moderation.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={true}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-2">Gross Platform Sales</p>
          <p className="text-2xl font-serif font-bold text-brand-walnut">{stats.totalSales}</p>
        </Card>

        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={true}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-2">Registered Studios</p>
          <p className="text-2xl font-serif font-bold text-brand-walnut">{stats.totalVendors} Partners</p>
        </Card>

        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={true}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-2">Active Catalog Listings</p>
          <p className="text-2xl font-serif font-bold text-brand-walnut">{stats.totalProducts} Pieces</p>
        </Card>

        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={true}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-2">Pending Verifications</p>
          <p className="text-2xl font-serif font-bold text-brand-walnut">{stats.pendingVendors} Studios</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
          <h3 className="font-serif text-lg font-bold text-brand-walnut mb-3">Partner Approvals</h3>
          <p className="text-brand-clay text-xs leading-relaxed mb-6">
            Review registered design studios, read their business descriptions, verify addresses, and approve or restrict their selling permissions on the storefront.
          </p>
          <Link to="/admin/vendors">
            <button className="bg-brand-walnut text-brand-linen px-4 py-2 hover:bg-brand-charcoal text-xs uppercase tracking-widest font-semibold transition-colors">
              Review Vendor Partners
            </button>
          </Link>
        </Card>

        <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
          <h3 className="font-serif text-lg font-bold text-brand-walnut mb-3">CMS Manager</h3>
          <p className="text-brand-clay text-xs leading-relaxed mb-6">
            Update site-wide policies, configure the homepage category sliders, or modify header lookbook settings dynamically.
          </p>
          <button className="bg-brand-linen border border-brand-sand-dark/30 text-brand-walnut px-4 py-2 hover:bg-brand-sand-light text-xs uppercase tracking-widest font-semibold transition-colors">
            Configure CMS Settings
          </button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
