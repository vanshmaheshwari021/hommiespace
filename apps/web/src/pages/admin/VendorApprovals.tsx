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

export const VendorApprovals: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await API.get('/vendors');
      setVendors(response.data.data);
    } catch (err) {
      console.error(err);
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
      // Update local state
      setVendors(prev =>
        prev.map(v => {
          const vId = v.id || (v as any)._id;
          return String(vId) === String(vendorId) ? { ...v, isApproved: !currentStatus } : v;
        })
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update approval status.');
    }
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
                <tr key={vId} className="hover:bg-brand-sand-light/35 transition-colors">
                  <td className="p-4 text-left">
                    <h4 className="font-serif font-bold text-brand-walnut text-sm">{v.businessName}</h4>
                    <p className="text-brand-clay text-[10px] font-sans leading-relaxed mt-1 max-w-sm">
                      {v.description || 'No description provided.'}
                    </p>
                  </td>
                  <td className="p-4 font-sans text-brand-clay">
                    <p>{u?.email || 'N/A'}</p>
                    <p className="text-[10px] mt-0.5">{v.phone}</p>
                  </td>
                  <td className="p-4 font-sans text-brand-clay">{v.businessAddress}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold 
                      ${v.isApproved ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-terracotta/10 text-brand-terracotta'}`}>
                      {v.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant={v.isApproved ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleApproval(vId, v.isApproved)}
                      className="py-1 px-3"
                    >
                      {v.isApproved ? 'Suspend' : 'Verify & Approve'}
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
