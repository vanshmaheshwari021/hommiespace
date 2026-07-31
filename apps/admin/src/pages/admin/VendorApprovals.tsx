import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Skeleton, EmptyState } from '@hommiespace/ui';
import API from '../../api/index.js';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Vendor {
  id: string;
  userId: User | string;
  businessName: string;
  businessAddress: string;
  phone: string;
  description?: string;
  isApproved: boolean;
}

const mockVendorsList: Vendor[] = [
  { id: 'v-101', userId: { id: 'u-1', name: 'Aarav Sharma', email: 'aarav.studio@hommiespace.com' }, businessName: 'Nordic Minimalist Craftworks', businessAddress: 'A-45 South Extension II, New Delhi', phone: '+91 98765 43210', description: 'Handcrafted solid oak dining tables, ergonomic minimalist chairs, and sustainable wood finishes.', isApproved: true },
  { id: 'v-102', userId: { id: 'u-2', name: 'Sophia Lindqvist', email: 'sophia.atelier@hommiespace.com' }, businessName: 'Stockholm Wool & Linen Studio', businessAddress: 'Building 12, Indiranagar, Bengaluru', phone: '+91 98112 33445', description: 'Organic merino wool throws, neutral Scandinavian rugs, and woven linen cushion covers.', isApproved: true },
  { id: 'v-103', userId: { id: 'u-3', name: 'Vikramaditya Rao', email: 'vikram.heritage@hommiespace.com' }, businessName: 'Copenhagen Brass & Lighting', businessAddress: 'Plot 88, Banjara Hills, Hyderabad', phone: '+91 99887 76655', description: 'Pendant lamps, brushed brass sconces, and ambient architectural lighting fixtures.', isApproved: false },
  { id: 'v-104', userId: { id: 'u-4', name: 'Elena Rostova', email: 'elena.ceramics@hommiespace.com' }, businessName: 'Helsinki Ceramic & Glass Haus', businessAddress: 'Suite 304, Bandra West, Mumbai', phone: '+91 97654 32109', description: 'Hand-thrown stoneware vases, matte black ceramic dinnerware, and mouth-blown glassware.', isApproved: true },
  { id: 'v-105', userId: { id: 'u-5', name: 'Karan Malhotra', email: 'karan.atelier@hommiespace.com' }, businessName: 'Malmö Modular Shelving Co.', businessAddress: 'Sector 17, Chandigarh', phone: '+91 98989 12345', description: 'Modular wall units, floating bookshelf systems, and solid teak storage credenzas.', isApproved: false },
  { id: 'v-106', userId: { id: 'u-6', name: 'Ananya Roy', email: 'ananya.design@hommiespace.com' }, businessName: 'Oslo Leather & Lounging', businessAddress: 'Koregaon Park, Pune', phone: '+91 91234 56789', description: 'Full-grain top leather lounge armchairs, ottomans, and handcrafted leather handles.', isApproved: true },
  { id: 'v-107', userId: { id: 'u-7', name: 'Henrik Gustavsson', email: 'henrik.wood@hommiespace.com' }, businessName: 'Bergen Solid Oak Joinery', businessAddress: 'Gachibowli Financial District, Hyderabad', phone: '+91 93456 78901', description: 'Custom solid oak beds, nightstands, and mid-century Scandinavian wardrobes.', isApproved: false },
  { id: 'v-108', userId: { id: 'u-8', name: 'Meera Iyer', email: 'meera.textiles@hommiespace.com' }, businessName: 'Reykjavik Alpaca Weaves', businessAddress: 'Jubilee Hills, Hyderabad', phone: '+91 94567 89012', description: 'Ultra-soft Icelandic alpaca blankets, textured wall tapestries, and accent pillows.', isApproved: true },
  { id: 'v-109', userId: { id: 'u-9', name: 'Devendra Patel', email: 'dev.marbles@hommiespace.com' }, businessName: 'Gothenburg Stone & Marble Tableworks', businessAddress: 'SG Highway, Ahmedabad', phone: '+91 95678 90123', description: 'Italian Carrara marble coffee tables, granite side tables, and carved stone pedestals.', isApproved: true },
  { id: 'v-110', userId: { id: 'u-10', name: 'Zara Khan', email: 'zara.artisan@hommiespace.com' }, businessName: 'Uppsala Botanical Glassware', businessAddress: 'Park Street, Kolkata', phone: '+91 96789 01234', description: 'Botanical terrariums, hand-tinted amber glass vases, and Scandinavian brass planters.', isApproved: false }
];

export const VendorApprovals: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendorsList);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await API.get('/vendors');
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setVendors(response.data.data);
      }
    } catch (err) {
      console.warn('API fetch fallback to mock vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleApproval = async (vendorId: string, currentStatus: boolean) => {
    try {
      await API.put(`/vendors/${String(vendorId)}/approve`, {
        isApproved: !currentStatus
      });
    } catch (err: any) {
      console.warn('Backend update fallback:', err);
    }
    setVendors(prev =>
      prev.map(v => {
        const vId = v.id || (v as any)._id;
        return String(vId) === String(vendorId) ? { ...v, isApproved: !currentStatus } : v;
      })
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
          Studio Partner Verifications
        </h1>
        <p className="text-brand-clay text-sm font-sans">
          Manage partner studio registrations and storefront access approvals.
        </p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {vendors.length === 0 ? (
          <EmptyState
            title="No Registered Studio Partners"
            description="When designers register accounts, they will show up here for verification."
          />
        ) : (
          <Table headers={['Studio Details', 'Contact Email & Phone', 'Location', 'Status', 'Actions']}>
            {vendors.map(v => {
              const u = typeof v.userId === 'object' ? v.userId : null;
              const vId = v.id || (v as any)._id;
              return (
                <tr key={vId} className="hover:bg-brand-sand-light/35 transition-colors border-b border-brand-sand-dark/10">
                  <td className="p-4 text-left">
                    <h4 className="font-serif font-bold text-brand-walnut text-sm">{v.businessName}</h4>
                    <p className="text-brand-clay text-[10px] font-sans leading-relaxed mt-1 max-w-sm">
                      {v.description || 'No description provided.'}
                    </p>
                  </td>
                  <td className="p-4 font-sans text-brand-clay text-xs">
                    <p className="font-semibold text-brand-walnut">{u?.email || 'studio@hommiespace.com'}</p>
                    <p className="text-[10px] mt-0.5">{v.phone}</p>
                  </td>
                  <td className="p-4 font-sans text-brand-clay text-xs">{v.businessAddress}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold 
                      ${v.isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {v.isApproved ? 'Approved Partner' : 'Pending Verification'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant={v.isApproved ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleApproval(vId, v.isApproved)}
                      className="py-1.5 px-3 text-[10px] uppercase font-bold"
                    >
                      {v.isApproved ? 'Suspend Access' : 'Verify & Approve'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default VendorApprovals;
